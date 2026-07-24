import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { ExerciseEntity } from '../exercises/exercise.entity';
import { UserEntity } from '../users/user.entity';

export type SubmissionStatus =
  | 'pending_review'
  | 'in_review'
  | 'reviewed'
  | 'closed';

@Entity('submissions')
@Unique(['chainId', 'versionNumber'])
export class SubmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_submissions_exercise')
  @Column({ name: 'exercise_id' })
  exerciseId: string;

  @ManyToOne(() => ExerciseEntity)
  @JoinColumn({ name: 'exercise_id' })
  exercise: ExerciseEntity;

  @Index('idx_submissions_user')
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Index('idx_submissions_chain')
  @Column({ name: 'chain_id' })
  chainId: string;

  @Column({ name: 'version_number', default: 1 })
  versionNumber: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'image_thumbnail_url', type: 'varchar', nullable: true })
  imageThumbnailUrl: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Index('idx_submissions_status')
  @Column({ type: 'text', default: 'pending_review' })
  status: SubmissionStatus;

  @Column({ name: 'review_requested_at', type: 'timestamptz', nullable: true })
  reviewRequestedAt: Date | null;

  @Column({ name: 'credits_spent', default: 0 })
  creditsSpent: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
