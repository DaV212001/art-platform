import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { SkillCategoryEntity } from '../exercises/skill-category.entity';

@Entity('reputation_scores')
@Unique(['userId', 'skillCategoryId'])
export class ReputationScoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_reputation_user')
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'skill_category_id' })
  skillCategoryId: string;

  @ManyToOne(() => SkillCategoryEntity, { eager: true })
  @JoinColumn({ name: 'skill_category_id' })
  skillCategory: SkillCategoryEntity;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 50 })
  score: number;

  @Column({ name: 'total_reviews', default: 0 })
  totalReviews: number;

  @Column({ name: 'helpful_count', default: 0 })
  helpfulCount: number;

  @Column({ name: 'neutral_count', default: 0 })
  neutralCount: number;

  @Column({ name: 'unhelpful_count', default: 0 })
  unhelpfulCount: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
