import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() currentUser: { id: string }) {
    const user = await this.usersService.findById(currentUser.id);
    return this.usersService.sanitize(user);
  }

  @Patch('me')
  async updateMe(@CurrentUser() currentUser: { id: string }, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(currentUser.id, dto);
    return this.usersService.sanitize(user);
  }

  @Get(':username')
  async getPublicProfile(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    return this.usersService.sanitizePublic(user);
  }
}
