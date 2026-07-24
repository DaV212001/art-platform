import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CreditsService } from './credits.service';
import { UserEntity } from '../users/user.entity';

@Controller('credits')
@UseGuards(JwtAuthGuard)
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get('balance')
  async getBalance(@CurrentUser() user: UserEntity) {
    const balance = await this.creditsService.getBalance(user.id);
    return { balance };
  }

  @Get('transactions')
  async getTransactions(
    @CurrentUser() user: UserEntity,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const { transactions, total } = await this.creditsService.getTransactions(
      user.id,
      +page,
      +limit,
    );
    return {
      success: true,
      data: transactions,
      meta: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) },
    };
  }
}
