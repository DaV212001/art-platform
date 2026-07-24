import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReputationScoreEntity } from './reputation-score.entity';
import { ReputationService } from './reputation.service';
import { CreditsModule } from '../credits/credits.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReputationScoreEntity]), CreditsModule],
  providers: [ReputationService],
  exports: [ReputationService],
})
export class ReputationModule {}
