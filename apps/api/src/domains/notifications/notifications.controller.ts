import { Controller, Get, Patch, Param, Query, UseGuards, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('unread')
  async getUnread(@CurrentUser() user: { id: string }) {
    return this.notificationsService.getUnread(user.id);
  }

  @Get()
  async getAll(
    @CurrentUser() user: { id: string },
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const { notifications, total } = await this.notificationsService.getAll(user.id, +page, +limit);
    return {
      success: true,
      data: notifications,
      meta: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) },
    };
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    await this.notificationsService.markRead(id, user.id);
    return { message: 'Notification marked as read' };
  }

  @Post('read-all')
  async markAllRead(@CurrentUser() user: { id: string }) {
    await this.notificationsService.markAllRead(user.id);
    return { message: 'All notifications marked as read' };
  }
}
