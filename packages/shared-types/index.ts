// ─── Enums ────────────────────────────────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type SubmissionStatus =
  | 'pending_review'
  | 'in_review'
  | 'reviewed'
  | 'closed';

export type ReviewStatus = 'draft' | 'submitted' | 'accepted' | 'disputed';

export type HelpfulnessRating = 'helpful' | 'neutral' | 'unhelpful';

export type TransactionType =
  | 'review_reward'
  | 'submission_cost'
  | 'signup_bonus'
  | 'adjustment'
  | 'refund';

export type ReportReason = 'abusive' | 'spam' | 'off_topic' | 'inappropriate';
export type ReportStatus = 'open' | 'resolved' | 'dismissed';
export type ReportTargetType = 'review' | 'submission';

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  creditBalance: number;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconName: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Exercise {
  id: string;
  skillCategoryId: string;
  skillCategory?: SkillCategory;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number | null;
  specificGoals: Array<{ goal: string; measurable: boolean }>;
  tags: string[];
  isPublished: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  exerciseId: string;
  exercise?: Exercise;
  userId: string;
  user?: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
  chainId: string;
  versionNumber: number;
  imageUrl: string;
  imageThumbnailUrl: string | null;
  notes: string | null;
  status: SubmissionStatus;
  reviewRequestedAt: string | null;
  creditsSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  reviewer?: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
  whatIsWorking: string;
  specificIssue: string;
  evidence: string;
  concreteSuggestion: string;
  additionalNotes: string | null;
  status: ReviewStatus;
  helpfulnessRating: HelpfulnessRating | null;
  ratedAt: string | null;
  creditsEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: TransactionType;
  referenceId: string | null;
  referenceType: 'review' | 'submission' | null;
  notes: string | null;
  balanceAfter: number;
  createdAt: string;
}

export interface ReputationScore {
  id: string;
  userId: string;
  skillCategoryId: string;
  skillCategory?: SkillCategory;
  score: number;
  totalReviews: number;
  helpfulCount: number;
  neutralCount: number;
  unhelpfulCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string | null;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  isAdmin: boolean;
}
