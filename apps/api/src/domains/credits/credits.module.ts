import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditTransactionEntity } from './credit-transaction.entity';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { CreditPolicyService } from './credit-policy.service';
import { UserEntity } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditTransactionEntity, UserEntity])],
  providers: [CreditsService, CreditPolicyService],
  controllers: [CreditsController],
  exports: [CreditsService, CreditPolicyService],
})
export class CreditsModule {}
