import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SubmissionEntity } from './submission.entity';
import { ExerciseEntity } from '../exercises/exercise.entity';
import { CreditsService } from '../credits/credits.service';
import { CreditPolicyService } from '../credits/credit-policy.service';
import { StorageService } from '../../shared/storage/storage.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateSubmissionDto, CreateRevisionDto } from './dto/submission.dto';

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    @InjectRepository(SubmissionEntity)
    private readonly submissionRepo: Repository<SubmissionEntity>,
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepo: Repository<ExerciseEntity>,
    private readonly creditsService: CreditsService,
    private readonly policy: CreditPolicyService,
    private readonly storageService: StorageService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(userId: string, dto: CreateSubmissionDto): Promise<SubmissionEntity> {
    const exercise = await this.exerciseRepo.findOneBy({ id: dto.exerciseId, isPublished: true });
    if (!exercise) throw new NotFoundException({ code: 'EXERCISE_NOT_FOUND', message: 'Exercise not found' });

    const imageUrl = this.storageService.getImageUrl(dto.imagePublicId);
    const imageThumbnailUrl = this.storageService.getThumbnailUrl(dto.imagePublicId);
    const chainId = uuidv4();

    const submission = this.submissionRepo.create({
      exerciseId: dto.exerciseId,
      userId,
      chainId,
      versionNumber: 1,
      imageUrl,
      imageThumbnailUrl,
      notes: dto.notes ?? null,
      status: 'pending_review',
    });
    return this.submissionRepo.save(submission);
  }

  async createRevision(
    userId: string,
    chainId: string,
    dto: CreateRevisionDto,
  ): Promise<SubmissionEntity> {
    const lastVersion = await this.submissionRepo.findOne({
      where: { chainId, userId },
      order: { versionNumber: 'DESC' },
    });
    if (!lastVersion) throw new NotFoundException({ code: 'CHAIN_NOT_FOUND', message: 'Submission chain not found' });

    const imageUrl = this.storageService.getImageUrl(dto.imagePublicId);
    const imageThumbnailUrl = this.storageService.getThumbnailUrl(dto.imagePublicId);

    const revision = this.submissionRepo.create({
      exerciseId: lastVersion.exerciseId,
      userId,
      chainId,
      versionNumber: lastVersion.versionNumber + 1,
      imageUrl,
      imageThumbnailUrl,
      notes: dto.notes ?? null,
      status: 'pending_review',
    });
    return this.submissionRepo.save(revision);
  }

  async getChain(chainId: string): Promise<SubmissionEntity[]> {
    return this.submissionRepo.find({
      where: { chainId },
      order: { versionNumber: 'ASC' },
      relations: { exercise: { skillCategory: true }, user: true },
    });
  }

  async findOne(id: string): Promise<SubmissionEntity> {
    const sub = await this.submissionRepo.findOne({
      where: { id },
      relations: { exercise: { skillCategory: true }, user: true },
    });
    if (!sub) throw new NotFoundException({ code: 'SUBMISSION_NOT_FOUND', message: 'Submission not found' });
    return sub;
  }

  async requestReview(submissionId: string, userId: string): Promise<SubmissionEntity> {
    const submission = await this.findOne(submissionId);
    if (submission.userId !== userId) throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Not your submission' });
    if (submission.status !== 'pending_review') {
      throw new BadRequestException({
        code: 'SUBMISSION_NOT_OPEN',
        message: 'Submission is not in a state that allows review request',
        statusCode: 409,
      });
    }

    // Debit credits
    await this.creditsService.debit(userId, this.policy.SUBMISSION_COST, 'submission_cost', {
      referenceId: submissionId,
      referenceType: 'submission',
      notes: `Review request for submission ${submissionId}`,
    });

    await this.submissionRepo.update({ id: submissionId }, {
      status: 'pending_review',
      reviewRequestedAt: new Date(),
      creditsSpent: this.policy.SUBMISSION_COST,
    });

    return this.findOne(submissionId);
  }

  async getQueue(
    page = 1,
    limit = 20,
    categorySlug?: string,
    excludeUserId?: string,
  ): Promise<{ submissions: SubmissionEntity[]; total: number }> {
    const qb = this.submissionRepo.createQueryBuilder('s')
      .leftJoinAndSelect('s.exercise', 'ex')
      .leftJoinAndSelect('ex.skillCategory', 'cat')
      .leftJoinAndSelect('s.user', 'u')
      .where('s.status = :status', { status: 'pending_review' })
      .andWhere('s.review_requested_at IS NOT NULL')
      .andWhere('s.deleted_at IS NULL');

    if (excludeUserId) {
      qb.andWhere('s.user_id != :excludeUserId', { excludeUserId });
    }
    if (categorySlug) {
      qb.andWhere('cat.slug = :slug', { slug: categorySlug });
    }

    qb.orderBy('s.review_requested_at', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [submissions, total] = await qb.getManyAndCount();
    return { submissions, total };
  }

  async getForUser(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ submissions: SubmissionEntity[]; total: number }> {
    const qb = this.submissionRepo.createQueryBuilder('s')
      .leftJoinAndSelect('s.exercise', 'ex')
      .leftJoinAndSelect('ex.skillCategory', 'cat')
      .where('s.user_id = :userId', { userId })
      .andWhere('s.deleted_at IS NULL')
      // Only fetch the latest version per chain for the list view
      .andWhere(qb => {
         const subQuery = qb.subQuery()
           .select('MAX(sub.version_number)')
           .from(SubmissionEntity, 'sub')
           .where('sub.chain_id = s.chain_id')
           .getQuery();
         return `s.version_number = ${subQuery}`;
      })
      .orderBy('s.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [submissions, total] = await qb.getManyAndCount();
    return { submissions, total };
  }

  async getUploadSignature() {
    return this.storageService.generateUploadSignature('submissions');
  }
}
