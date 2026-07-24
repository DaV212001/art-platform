import { IsString, IsUUID, IsEnum, IsOptional, MinLength } from 'class-validator';
import type { HelpfulnessRating } from '../review.entity';
import type { ReportReason } from '../../notifications/report.entity';

export class CreateReviewDto {
  @IsUUID()
  submissionId: string;

  @IsString()
  @MinLength(100, { message: 'What is working must be at least 100 characters' })
  whatIsWorking: string;

  @IsString()
  @MinLength(100, { message: 'Specific issue must be at least 100 characters' })
  specificIssue: string;

  @IsString()
  @MinLength(100, { message: 'Evidence must be at least 100 characters' })
  evidence: string;

  @IsString()
  @MinLength(100, { message: 'Concrete suggestion must be at least 100 characters' })
  concreteSuggestion: string;

  @IsString()
  @IsOptional()
  additionalNotes?: string;
}

export class RateReviewDto {
  @IsEnum(['helpful', 'neutral', 'unhelpful'])
  rating: HelpfulnessRating;
}

export class ReportDto {
  @IsEnum(['abusive', 'spam', 'off_topic', 'inappropriate'])
  reason: ReportReason;

  @IsString()
  @IsOptional()
  details?: string;
}
