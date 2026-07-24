import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ExerciseEntity } from './exercise.entity';
import { SkillCategoryEntity } from './skill-category.entity';
import { CreateExerciseDto, UpdateExerciseDto, ExerciseFilterDto } from './dto/exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepo: Repository<ExerciseEntity>,
    @InjectRepository(SkillCategoryEntity)
    private readonly categoryRepo: Repository<SkillCategoryEntity>,
  ) {}

  async findAll(filter: ExerciseFilterDto) {
    const qb = this.exerciseRepo.createQueryBuilder('e')
      .leftJoinAndSelect('e.skillCategory', 'cat')
      .where('e.is_published = true')
      .andWhere('e.deleted_at IS NULL');

    if (filter.category) {
      qb.andWhere('cat.slug = :slug', { slug: filter.category });
    }
    if (filter.difficulty) {
      qb.andWhere('e.difficulty = :difficulty', { difficulty: filter.difficulty });
    }
    if (filter.search) {
      qb.andWhere('(e.title ILIKE :search OR e.description ILIKE :search)', {
        search: `%${filter.search}%`,
      });
    }

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit).orderBy('e.created_at', 'DESC');

    const [exercises, total] = await qb.getManyAndCount();
    return { exercises, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<ExerciseEntity> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id, isPublished: true },
    });
    if (!exercise) throw new NotFoundException({ code: 'EXERCISE_NOT_FOUND', message: 'Exercise not found' });
    return exercise;
  }

  async findAllCategories(): Promise<SkillCategoryEntity[]> {
    return this.categoryRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async create(dto: CreateExerciseDto, createdBy: string): Promise<ExerciseEntity> {
    const exercise = this.exerciseRepo.create({ ...dto, createdBy });
    return this.exerciseRepo.save(exercise);
  }

  async update(id: string, dto: UpdateExerciseDto): Promise<ExerciseEntity> {
    await this.exerciseRepo.update({ id }, dto);
    return this.findOne(id);
  }
}
