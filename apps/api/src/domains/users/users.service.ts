import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepo.findOneBy({ id, isActive: true });
    if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' });
    return user;
  }

  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepo.findOneBy({ username, isActive: true });
    if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' });
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserEntity> {
    await this.userRepo.update({ id: userId }, dto);
    return this.findById(userId);
  }

  sanitize(user: UserEntity) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, emailVerificationToken, passwordResetToken, refreshTokenHash, passwordResetExpires, ...safe } = user;
    return safe;
  }

  sanitizePublic(user: UserEntity) {
    const { id, username, displayName, avatarUrl, creditBalance, isAdmin, createdAt } = user;
    return { id, username, displayName, avatarUrl, creditBalance, isAdmin, createdAt };
  }
}
