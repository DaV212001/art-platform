import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';
import { SubmissionEntity } from '../submissions/submission.entity';
import { ReportEntity } from '../notifications/report.entity';
import { CreditsService } from '../credits/credits.service';
import { CreditPolicyService } from '../credits/credit-policy.service';
import { ReputationService } from '../reputation/reputation.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReviewDto, RateReviewDto, ReportDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    @InjectRepository(SubmissionEntity)
    private readonly submissionRepo: Repository<SubmissionEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
    private readonly creditsService: CreditsService,
    private readonly policy: CreditPolicyService,
    private readonly reputationService: ReputationService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(reviewerId: string, dto: CreateReviewDto): Promise<ReviewEntity> {
    const submission = await this.submissionRepo.findOne({
      where: { id: dto.submissionId },
      relations: { exercise: { skillCategory: true } },
    });
    if (!submission) throw new NotFoundException({ code: 'SUBMISSION_NOT_FOUND', message: 'Submission not found' });

    // Business rule: Cannot review own submission
    if (submission.userId === reviewerId) {
      throw new ForbiddenException({ code: 'OWN_SUBMISSION', message: 'Cannot review your own submission' });
    }

    // Business rule: Submission must be open for review
    if (submission.status !== 'pending_review' && submission.status !== 'in_review') {
      throw new ConflictException({ code: 'SUBMISSION_NOT_OPEN', message: 'Submission is not open for review', statusCode: 409 });
    }

    // Business rule: One reviewer per submission
    const existing = await this.reviewRepo.findOneBy({ submissionId: dto.submissionId, reviewerId });
    if (existing) {
      throw new ConflictException({ code: 'ALREADY_REVIEWED', message: 'You have already reviewed this submission' });
    }

    // Create review
    const review = this.reviewRepo.create({
      submissionId: dto.submissionId,
      reviewerId,
      whatIsWorking: dto.whatIsWorking,
      specificIssue: dto.specificIssue,
      evidence: dto.evidence,
      concreteSuggestion: dto.concreteSuggestion,
      additionalNotes: dto.additionalNotes ?? null,
      status: 'submitted',
    });
    const saved = await this.reviewRepo.save(review);

    // Mark submission as reviewed
    await this.submissionRepo.update({ id: dto.submissionId }, { status: 'reviewed' });

    // Award credits to reviewer
    const tx = await this.creditsService.credit(reviewerId, this.policy.REVIEW_REWARD, 'review_reward', {
      referenceId: saved.id,
      referenceType: 'review',
      notes: `Credit for completing review ${saved.id}`,
    });
    await this.reviewRepo.update({ id: saved.id }, { creditsEarned: this.policy.REVIEW_REWARD });

    // Notify submission author and reviewer
    await this.notificationsService.notify(
      submission.userId,
      'review_received',
      'Your artwork has been reviewed!',
      `A reviewer left feedback on your submission.`,
      { reviewId: saved.id, submissionId: submission.id },
    );
    await this.notificationsService.notify(
      reviewerId,
      'credit_earned',
      `You earned ${this.policy.REVIEW_REWARD} credits!`,
      `Thanks for your structured review. Credits added to your balance.`,
      { credits: this.policy.REVIEW_REWARD },
    );

    return this.findOne(saved.id);
  }

  async findOne(id: string): Promise<ReviewEntity> {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: { reviewer: true, submission: true },
    });
    if (!review) throw new NotFoundException({ code: 'REVIEW_NOT_FOUND', message: 'Review not found' });
    return review;
  }

  async getForSubmission(submissionId: string): Promise<ReviewEntity[]> {
    return this.reviewRepo.find({
      where: { submissionId },
      relations: { reviewer: true },
      order: { createdAt: 'DESC' },
    });
  }

  async rateReview(
    reviewId: string,
    raterId: string,
    dto: RateReviewDto,
  ): Promise<ReviewEntity> {
    const review = await this.findOne(reviewId);

    // Only the submission author can rate
    const submission = await this.submissionRepo.findOneBy({ id: review.submissionId });
    if (!submission || submission.userId !== raterId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only the submission author can rate this review' });
    }

    if (review.status !== 'submitted') {
      throw new BadRequestException({ code: 'REVIEW_NOT_RATABLE', message: 'Review is not in a rateable state', statusCode: 422 });
    }
    if (review.helpfulnessRating) {
      throw new ConflictException({ code: 'ALREADY_RATED', message: 'This review has already been rated' });
    }

    await this.reviewRepo.update({ id: reviewId }, {
      helpfulnessRating: dto.rating,
      ratedAt: new Date(),
    });

    // Update reputation
    if (submission.exercise?.skillCategoryId) {
      await this.reputationService.applyRating(
        review.reviewerId,
        submission.exercise.skillCategoryId,
        dto.rating,
      );
    }

    // Notify reviewer of rating
    await this.notificationsService.notify(
      review.reviewerId,
      'review_rated',
      `Your review was rated "${dto.rating}"`,
      undefined,
      { reviewId, rating: dto.rating },
    );

    return this.findOne(reviewId);
  }

  async reportReview(
    reporterId: string,
    reviewId: string,
    dto: ReportDto,
  ): Promise<{ message: string }> {
    const review = await this.findOne(reviewId);
    const report = this.reportRepo.create({
      reporterId,
      targetType: 'review',
      targetId: reviewId,
      reason: dto.reason,
      details: dto.details ?? null,
    });
    await this.reportRepo.save(report);
    return { message: 'Report submitted successfully' };
  }

  async getGiven(reviewerId: string, page = 1, limit = 20) {
    const [reviews, total] = await this.reviewRepo.findAndCount({
      where: { reviewerId },
      relations: { submission: { exercise: true } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { reviews, total };
  }

  async getReceived(userId: string, page = 1, limit = 20) {
    const qb = this.reviewRepo.createQueryBuilder('r')
      .leftJoinAndSelect('r.submission', 's')
      .leftJoinAndSelect('s.exercise', 'ex')
      .leftJoinAndSelect('r.reviewer', 'rev')
      .where('s.user_id = :userId', { userId })
      .orderBy('r.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [reviews, total] = await qb.getManyAndCount();
    return { reviews, total };
  }
}
