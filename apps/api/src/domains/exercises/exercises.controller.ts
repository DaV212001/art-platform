import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto, UpdateExerciseDto, ExerciseFilterDto } from './dto/exercise.dto';

@Controller()
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('skill-categories')
  async getCategories() {
    return this.exercisesService.findAllCategories();
  }

  @Get('exercises')
  async browse(@Query() filter: ExerciseFilterDto) {
    const { exercises, total, page, limit, totalPages } = await this.exercisesService.findAll(filter);
    return {
      success: true,
      data: exercises,
      meta: { page, limit, total, totalPages },
    };
  }

  @Get('exercises/:id')
  async getOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('exercises')
  async create(
    @Body() dto: CreateExerciseDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.exercisesService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('exercises/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateExerciseDto) {
    return this.exercisesService.update(id, dto);
  }
}
