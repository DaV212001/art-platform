import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private etherealUser = '';
  private etherealPass = '';

  async onModuleInit() {
    await this.initTransporter();
  }

  private async initTransporter() {
    const provider = process.env.EMAIL_PROVIDER || 'ethereal';

    if (provider === 'ethereal') {
      // Create a test account at Ethereal — no real emails sent, viewable at ethereal.email
      const testAccount = await nodemailer.createTestAccount();
      this.etherealUser = testAccount.user;
      this.etherealPass = testAccount.pass;
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      this.logger.log(`📧 Ethereal email ready. Preview at: https://ethereal.email`);
      this.logger.log(`   User: ${testAccount.user}`);
    } else {
      // Brevo SMTP (free tier: 300 emails/day)
      this.transporter = nodemailer.createTransport({
        host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.BREVO_SMTP_USER,
          pass: process.env.BREVO_SMTP_PASS,
        },
      });
    }
  }

  async send(options: EmailOptions): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Email transporter not ready, skipping email send');
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Art Platform'}" <${process.env.EMAIL_FROM || 'noreply@artplatform.com'}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      const provider = process.env.EMAIL_PROVIDER || 'ethereal';
      if (provider === 'ethereal') {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        this.logger.log(`📧 Email sent (preview): ${previewUrl}`);
      } else {
        this.logger.log(`📧 Email sent to ${options.to}: ${info.messageId}`);
      }
    } catch (err) {
      this.logger.error('Failed to send email', err);
    }
  }

  async sendVerificationEmail(to: string, token: string, username: string): Promise<void> {
    const appUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/verify-email?token=${token}`;
    this.logger.log(`[DEV] Verification Link: ${verifyUrl}`);
    
    await this.send({
      to,
      subject: 'Verify your Art Platform email',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Art Platform, ${username}!</h2>
          <p>You've received <strong>5 free credits</strong> to get started.</p>
          <p>Click below to verify your email and unlock your account:</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;margin:16px 0;">
            Verify Email
          </a>
          <p style="color:#666;font-size:14px;">Link expires in 24 hours.</p>
        </div>
      `,
      text: `Verify your email: ${verifyUrl}`,
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const appUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    this.logger.log(`[DEV] Password Reset Link: ${resetUrl}`);
    
    await this.send({
      to,
      subject: 'Reset your Art Platform password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Click below to reset your password:</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;margin:16px 0;">
            Reset Password
          </a>
          <p style="color:#666;font-size:14px;">This link expires in 1 hour. If you didn't request a reset, ignore this email.</p>
        </div>
      `,
      text: `Reset your password: ${resetUrl}`,
    });
  }
}
