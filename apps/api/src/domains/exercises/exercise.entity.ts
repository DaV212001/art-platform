import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SkillCategoryEntity } from './skill-category.entity';
import { UserEntity } from '../users/user.entity';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ExerciseGoal {
  goal: string;
  measurable: boolean;
}

@Entity('exercises')
export class ExerciseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_exercises_skill_category')
  @Column({ name: 'skill_category_id' })
  skillCategoryId: string;

  @ManyToOne(() => SkillCategoryEntity, { eager: true })
  @JoinColumn({ name: 'skill_category_id' })
  skillCategory: SkillCategoryEntity;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Index('idx_exercises_difficulty')
  @Column({ type: 'text' })
  difficulty: Difficulty;

  @Column({ name: 'estimated_minutes', type: 'int', nullable: true })
  estimatedMinutes: number | null;

  @Column({ name: 'specific_goals', type: 'jsonb', default: '[]' })
  specificGoals: ExerciseGoal[];

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: UserEntity | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
