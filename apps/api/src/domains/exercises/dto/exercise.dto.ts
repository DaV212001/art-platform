import {
  IsString, IsUUID, IsEnum, IsOptional, IsInt, IsArray, IsBoolean,
  MinLength, Min, Max
} from 'class-validator';
import type { Difficulty } from '../exercise.entity';

export class CreateExerciseDto {
  @IsUUID()
  skillCategoryId: string;

  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty: Difficulty;

  @IsInt()
  @Min(5)
  @Max(480)
  @IsOptional()
  estimatedMinutes?: number;

  @IsArray()
  @IsOptional()
  specificGoals?: Array<{ goal: string; measurable: boolean }>;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateExerciseDto extends CreateExerciseDto {}

export class ExerciseFilterDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  @IsOptional()
  difficulty?: Difficulty;

  @IsString()
  @IsOptional()
  search?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}
