import {
  Controller, Get, Post, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto, CreateRevisionDto } from './dto/submission.dto';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('upload-url')
  async getUploadUrl() {
    return this.submissionsService.getUploadSignature();
  }

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateSubmissionDto,
  ) {
    return this.submissionsService.create(user.id, dto);
  }

  @Post('chains/:chainId/revisions')
  async createRevision(
    @CurrentUser() user: { id: string },
    @Param('chainId') chainId: string,
    @Body() dto: CreateRevisionDto,
  ) {
    return this.submissionsService.createRevision(user.id, chainId, dto);
  }

  @Get('chains/:chainId')
  async getChain(@Param('chainId') chainId: string) {
    return this.submissionsService.getChain(chainId);
  }

  @Get('queue')
  async getQueue(
    @CurrentUser() user: { id: string },
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('category') category?: string,
  ) {
    const { submissions, total } = await this.submissionsService.getQueue(
      +page, +limit, category, user.id,
    );
    return {
      success: true,
      data: submissions,
      meta: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Post(':id/request-review')
  async requestReview(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.submissionsService.requestReview(id, user.id);
  }
}
