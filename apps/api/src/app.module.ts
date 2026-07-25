import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Domains
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';
import { ExercisesModule } from './domains/exercises/exercises.module';
import { SubmissionsModule } from './domains/submissions/submissions.module';
import { ReviewsModule } from './domains/reviews/reviews.module';
import { CreditsModule } from './domains/credits/credits.module';
import { ReputationModule } from './domains/reputation/reputation.module';
import { NotificationsModule } from './domains/notifications/notifications.module';

// Shared
import { StorageModule } from './shared/storage/storage.module';
import { EmailModule } from './shared/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 60000,
      limit: 10,
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://artplatform:artplatform_secret@localhost:5432/artplatform',
      autoLoadEntities: true,
      synchronize: false, // Using migrations instead
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    ExercisesModule,
    SubmissionsModule,
    ReviewsModule,
    CreditsModule,
    ReputationModule,
    NotificationsModule,
    StorageModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
