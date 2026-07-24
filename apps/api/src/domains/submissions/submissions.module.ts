import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionEntity } from './submission.entity';
import { ExerciseEntity } from '../exercises/exercise.entity';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { CreditsModule } from '../credits/credits.module';
import { StorageModule } from '../../shared/storage/storage.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubmissionEntity, ExerciseEntity]),
    CreditsModule,
    StorageModule,
    NotificationsModule,
  ],
  providers: [SubmissionsService],
  controllers: [SubmissionsController],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
