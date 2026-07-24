import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../users/user.entity';
import { CreditsService } from '../credits/credits.service';
import { EmailService } from '../../shared/email/email.service';
import { RegisterDto, RefreshDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly creditsService: CreditsService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    // Check uniqueness
    const existingEmail = await this.userRepo.findOneBy({ email: dto.email });
    if (existingEmail) throw new ConflictException({ code: 'EMAIL_TAKEN', message: 'Email already registered' });

    const existingUsername = await this.userRepo.findOneBy({ username: dto.username });
    if (existingUsername) throw new ConflictException({ code: 'USERNAME_TAKEN', message: 'Username already taken' });

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verificationToken = uuidv4();

    const user = this.userRepo.create({
      email: dto.email,
      username: dto.username,
      displayName: dto.displayName || dto.username,
      passwordHash,
      emailVerificationToken: verificationToken,
    });
    await this.userRepo.save(user);

    // Signup credit bonus
    await this.creditsService.credit(user.id, 5, 'signup_bonus', {
      notes: 'Welcome bonus for new signup',
    });

    // Send verification email (non-blocking)
    this.emailService
      .sendVerificationEmail(user.email, verificationToken, user.username)
      .catch((err) => this.logger.error('Email send failed', err));

    return { message: 'Registration successful. Check your email to verify your account.' };
  }

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOneBy({ email, isActive: true });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async login(user: UserEntity) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
    });

    const refreshToken = uuidv4();
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update({ id: user.id }, { refreshTokenHash });

    return { accessToken, refreshToken, user: this.sanitizeUser(user) };
  }

  async refresh(dto: RefreshDto) {
    // Find user by matching refresh token
    const users = await this.userRepo.find({ where: { isActive: true } });
    let found: UserEntity | null = null;
    for (const u of users) {
      if (u.refreshTokenHash && (await bcrypt.compare(dto.refreshToken, u.refreshTokenHash))) {
        found = u;
        break;
      }
    }
    if (!found) throw new UnauthorizedException({ code: 'INVALID_REFRESH_TOKEN', message: 'Invalid or expired refresh token' });

    return this.login(found);
  }

  async logout(userId: string) {
    await this.userRepo.update({ id: userId }, { refreshTokenHash: null });
    return { message: 'Logged out successfully' };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepo.findOneBy({ emailVerificationToken: token });
    if (!user) throw new NotFoundException({ code: 'INVALID_TOKEN', message: 'Verification token invalid or expired' });

    await this.userRepo.update({ id: user.id }, {
      emailVerified: true,
      emailVerificationToken: null,
    });
    return { message: 'Email verified successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    // Always return success to prevent email enumeration
    if (!user) return { message: 'If that email exists, a reset link has been sent' };

    const token = uuidv4();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.userRepo.update({ id: user.id }, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });

    this.emailService
      .sendPasswordResetEmail(user.email, token)
      .catch((err) => this.logger.error('Email send failed', err));

    return { message: 'If that email exists, a reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepo.findOneBy({ passwordResetToken: dto.token });
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException({ code: 'INVALID_TOKEN', message: 'Password reset token is invalid or has expired' });
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    await this.userRepo.update({ id: user.id }, {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      refreshTokenHash: null, // Invalidate all sessions
    });
    return { message: 'Password reset successfully. Please log in.' };
  }

  sanitizeUser(user: UserEntity) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, emailVerificationToken, passwordResetToken, refreshTokenHash, ...safe } = user;
    return safe;
  }
}
