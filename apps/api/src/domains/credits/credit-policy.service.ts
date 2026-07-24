import { Injectable } from '@nestjs/common';

/**
 * Single source of truth for all credit economy rules.
 * Change values here to adjust the credit economy without hunting through the codebase.
 */
@Injectable()
export class CreditPolicyService {
  /** Credits granted to new users on signup */
  readonly SIGNUP_BONUS = 5;

  /** Credits an artist must spend to request a review */
  readonly SUBMISSION_COST = 3;

  /** Credits a reviewer earns for completing a review */
  readonly REVIEW_REWARD = 2;

  /** Minimum characters required per review field */
  readonly MIN_REVIEW_FIELD_LENGTH = 100;

  /** Minimum number of reviews given before reputation score is shown publicly */
  readonly MIN_REVIEWS_FOR_PUBLIC_SCORE = 3;
}
