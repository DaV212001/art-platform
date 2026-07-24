import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

export type TransactionType =
  | 'review_reward'
  | 'submission_cost'
  | 'signup_bonus'
  | 'adjustment'
  | 'refund';

@Entity('credit_transactions')
export class CreditTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_credit_tx_user')
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  amount: number;

  @Column({ name: 'transaction_type', type: 'text' })
  transactionType: TransactionType;

  @Index('idx_credit_tx_reference')
  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string | null;

  @Column({ name: 'reference_type', type: 'text', nullable: true })
  referenceType: 'review' | 'submission' | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'balance_after' })
  balanceAfter: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
