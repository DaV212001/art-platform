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
import { SubmissionEntity } from '../submissions/submission.entity';
import { UserEntity } from '../users/user.entity';

export type ReviewStatus = 'draft' | 'submitted' | 'accepted' | 'disputed';
export type HelpfulnessRating = 'helpful' | 'neutral' | 'unhelpful';

@Entity('reviews')
@Unique(['submissionId', 'reviewerId'])
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_reviews_submission')
  @Column({ name: 'submission_id' })
  submissionId: string;

  @ManyToOne(() => SubmissionEntity)
  @JoinColumn({ name: 'submission_id' })
  submission: SubmissionEntity;

  @Index('idx_reviews_reviewer')
  @Column({ name: 'reviewer_id' })
  reviewerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: UserEntity;

  @Column({ name: 'what_is_working', type: 'text' })
  whatIsWorking: string;

  @Column({ name: 'specific_issue', type: 'text' })
  specificIssue: string;

  @Column({ type: 'text' })
  evidence: string;

  @Column({ name: 'concrete_suggestion', type: 'text' })
  concreteSuggestion: string;

  @Column({ name: 'additional_notes', type: 'text', nullable: true })
  additionalNotes: string | null;

  @Index('idx_reviews_status')
  @Column({ type: 'text', default: 'draft' })
  status: ReviewStatus;

  @Column({ name: 'helpfulness_rating', type: 'text', nullable: true })
  helpfulnessRating: HelpfulnessRating | null;

  @Column({ name: 'rated_at', type: 'timestamptz', nullable: true })
  ratedAt: Date | null;

  @Column({ name: 'credits_earned', default: 0 })
  creditsEarned: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
