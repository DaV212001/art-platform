'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, Eye, EyeOff, CheckCircle2, LockKeyhole } from 'lucide-react';
import apiClient from '@/lib/api/client';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    try {
      setError(null);
      await apiClient.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. The link may have expired.');
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4" style={{ background: 'var(--color-danger-dim)', border: '1px solid rgba(242,84,125,0.25)' }}>
          <AlertCircle className="w-6 h-6" style={{ color: '#ff82a1' }} />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">Invalid Link</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
          This password reset link is invalid or missing a token.
        </p>
        <Link href="/forgot-password" className="btn btn-primary">
          Request new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center card p-10">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--color-success-dim)' }}>
          <CheckCircle2 className="w-8 h-8" style={{ color: '#34c98b' }} />
        </div>
        <h2 className="text-2xl font-extrabold mb-2">Password reset</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--color-muted)' }}>
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <Link href="/login" className="btn btn-primary w-full">
          Log in now
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          <LockKeyhole className="w-6 h-6 text-violet-400" />
        </div>
        <h1 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}>
          Set new password
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--color-muted)' }}>
          Enter a strong password for your account.
        </p>
      </div>

      <div className="card p-8 space-y-6" style={{ background: 'var(--color-surface-1)' }}>
        {error && (
          <div className="p-4 rounded-xl flex items-start gap-3 animate-scale-in" style={{ background: 'var(--color-danger-dim)', border: '1px solid rgba(242,84,125,0.25)' }}>
            <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" style={{ color: '#ff82a1' }} />
            <p className="text-sm" style={{ color: '#ff82a1' }}>{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-foreground)' }}>
              New Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs" style={{ color: '#ff82a1' }}>{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-foreground)' }}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: '#ff82a1' }}>{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg w-full"
            style={{ marginTop: '1.5rem' }}
          >
            {isSubmitting ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)' }} />
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-brand)' }} />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
