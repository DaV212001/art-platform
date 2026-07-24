import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

export type ReportTargetType = 'review' | 'submission';
export type ReportReason = 'abusive' | 'spam' | 'off_topic' | 'inappropriate';
export type ReportStatus = 'open' | 'resolved' | 'dismissed';

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reporter_id' })
  reporterId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reporter_id' })
  reporter: UserEntity;

  @Column({ name: 'target_type', type: 'text' })
  targetType: ReportTargetType;

  @Column({ name: 'target_id' })
  targetId: string;

  @Column({ type: 'text' })
  reason: ReportReason;

  @Column({ type: 'text', nullable: true })
  details: string | null;

  @Column({ type: 'text', default: 'open' })
  status: ReportStatus;

  @Column({ name: 'resolved_by', type: 'uuid', nullable: true })
  resolvedBy: string | null;

  @Column({ name: 'resolved_at', type: 'timestamptz', nullable: true })
  resolvedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
