import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReputationScoreEntity } from './reputation-score.entity';
import { HelpfulnessRating } from '../reviews/review.entity';
import { CreditPolicyService } from '../credits/credit-policy.service';

@Injectable()
export class ReputationService {
  constructor(
    @InjectRepository(ReputationScoreEntity)
    private readonly reputationRepo: Repository<ReputationScoreEntity>,
    private readonly policy: CreditPolicyService,
  ) {}

  async applyRating(
    reviewerId: string,
    skillCategoryId: string,
    rating: HelpfulnessRating,
  ): Promise<ReputationScoreEntity> {
    let score = await this.reputationRepo.findOneBy({ userId: reviewerId, skillCategoryId });

    if (!score) {
      score = this.reputationRepo.create({
        userId: reviewerId,
        skillCategoryId,
        score: 50,
        totalReviews: 0,
        helpfulCount: 0,
        neutralCount: 0,
        unhelpfulCount: 0,
      });
    }

    score.totalReviews += 1;
    if (rating === 'helpful') score.helpfulCount += 1;
    else if (rating === 'neutral') score.neutralCount += 1;
    else score.unhelpfulCount += 1;

    // Score formula: (helpful * 1.0 + neutral * 0.5) / total * 100
    score.score = parseFloat(
      ((score.helpfulCount * 1.0 + score.neutralCount * 0.5) / score.totalReviews * 100).toFixed(2),
    );

    return this.reputationRepo.save(score);
  }

  async getForUser(userId: string): Promise<ReputationScoreEntity[]> {
    const scores = await this.reputationRepo.find({
      where: { userId },
      relations: { skillCategory: true },
      order: { skillCategory: { sortOrder: 'ASC' } },
    });
    // Hide scores with fewer than minimum reviews
    return scores.map((s) => ({
      ...s,
      score: s.totalReviews >= this.policy.MIN_REVIEWS_FOR_PUBLIC_SCORE ? s.score : null as unknown as number,
      isHidden: s.totalReviews < this.policy.MIN_REVIEWS_FOR_PUBLIC_SCORE,
    }));
  }
}
