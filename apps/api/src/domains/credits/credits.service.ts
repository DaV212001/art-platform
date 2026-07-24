import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreditTransactionEntity, TransactionType } from './credit-transaction.entity';
import { UserEntity } from '../users/user.entity';
import { CreditPolicyService } from './credit-policy.service';

@Injectable()
export class CreditsService {
  private readonly logger = new Logger(CreditsService.name);

  constructor(
    @InjectRepository(CreditTransactionEntity)
    private readonly txRepo: Repository<CreditTransactionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly policy: CreditPolicyService,
  ) {}

  /**
   * Credit a user's balance atomically.
   * Updates user.credit_balance AND inserts ledger row in one DB transaction.
   */
  async credit(
    userId: string,
    amount: number,
    type: TransactionType,
    options: { referenceId?: string; referenceType?: 'review' | 'submission'; notes?: string } = {},
  ): Promise<CreditTransactionEntity> {
    if (amount <= 0) throw new BadRequestException('Credit amount must be positive');
    return this.runInTransaction(userId, amount, type, options);
  }

  /**
   * Debit a user's balance atomically.
   * Throws if insufficient balance.
   */
  async debit(
    userId: string,
    amount: number,
    type: TransactionType,
    options: { referenceId?: string; referenceType?: 'review' | 'submission'; notes?: string } = {},
  ): Promise<CreditTransactionEntity> {
    if (amount <= 0) throw new BadRequestException('Debit amount must be positive');

    // Check balance first (optimistic — real check is inside the transaction)
    const user = await this.userRepo.findOneByOrFail({ id: userId });
    if (user.creditBalance < amount) {
      throw new BadRequestException({
        code: 'INSUFFICIENT_CREDITS',
        message: `You need at least ${amount} credits. Current balance: ${user.creditBalance}.`,
        statusCode: 402,
      });
    }
    return this.runInTransaction(userId, -amount, type, options);
  }

  private async runInTransaction(
    userId: string,
    signedAmount: number,
    type: TransactionType,
    options: { referenceId?: string; referenceType?: 'review' | 'submission'; notes?: string },
  ): Promise<CreditTransactionEntity> {
    return this.dataSource.transaction(async (manager) => {
      // Lock the user row to prevent race conditions
      const user = await manager
        .createQueryBuilder(UserEntity, 'u')
        .setLock('pessimistic_write')
        .where('u.id = :id', { id: userId })
        .getOneOrFail();

      const newBalance = user.creditBalance + signedAmount;
      if (newBalance < 0) {
        throw new BadRequestException({
          code: 'INSUFFICIENT_CREDITS',
          message: `Insufficient credits.`,
          statusCode: 402,
        });
      }

      // Update cached balance
      await manager.update(UserEntity, { id: userId }, { creditBalance: newBalance });

      // Insert append-only ledger row
      const tx = manager.create(CreditTransactionEntity, {
        userId,
        amount: signedAmount,
        transactionType: type,
        referenceId: options.referenceId ?? null,
        referenceType: options.referenceType ?? null,
        notes: options.notes ?? null,
        balanceAfter: newBalance,
      });
      return manager.save(tx);
    });
  }

  async getBalance(userId: string): Promise<number> {
    const user = await this.userRepo.findOneByOrFail({ id: userId });
    return user.creditBalance;
  }

  async getTransactions(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ transactions: CreditTransactionEntity[]; total: number }> {
    const [transactions, total] = await this.txRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { transactions, total };
  }
}
