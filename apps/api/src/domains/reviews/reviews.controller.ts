import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, RateReviewDto, ReportDto } from './dto/review.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('reviews')
  async create(@CurrentUser() user: { id: string }, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @Get('reviews/:id')
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch('reviews/:id/rating')
  async rate(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: RateReviewDto,
  ) {
    return this.reviewsService.rateReview(id, user.id, dto);
  }

  @Post('reviews/:id/report')
  async report(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: ReportDto,
  ) {
    return this.reviewsService.reportReview(user.id, id, dto);
  }

  @Get('submissions/:id/reviews')
  async getForSubmission(@Param('id') id: string) {
    return this.reviewsService.getForSubmission(id);
  }

  @Get('users/me/reviews-given')
  async getGiven(
    @CurrentUser() user: { id: string },
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const { reviews, total } = await this.reviewsService.getGiven(user.id, +page, +limit);
    return { success: true, data: reviews, meta: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) } };
  }

  @Get('users/me/reviews-received')
  async getReceived(
    @CurrentUser() user: { id: string },
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const { reviews, total } = await this.reviewsService.getReceived(user.id, +page, +limit);
    return { success: true, data: reviews, meta: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) } };
  }
}
