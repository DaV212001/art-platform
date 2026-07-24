import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './notification.entity';

export type NotificationType =
  | 'review_received'
  | 'credit_earned'
  | 'review_rated'
  | 'submission_queued'
  | 'revision_reminder';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
  ) {}

  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    body?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    try {
      const notification = this.notificationRepo.create({
        userId,
        type,
        title,
        body: body ?? null,
        metadata: metadata ?? {},
      });
      await this.notificationRepo.save(notification);
    } catch (err) {
      this.logger.error(`Failed to create notification for user ${userId}`, err);
    }
  }

  async getUnread(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepo.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getAll(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await this.notificationRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { notifications, total };
  }

  async markRead(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepo.update({ id: notificationId, userId }, { isRead: true });
  }

  async markAllRead(userId: string): Promise<void> {
    await this.notificationRepo.update({ userId, isRead: false }, { isRead: true });
  }
}
