import { IsString, IsUUID, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  exerciseId: string;

  @IsString()
  imagePublicId: string; // Cloudinary public_id after upload

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}

export class CreateRevisionDto {
  @IsString()
  imagePublicId: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}
