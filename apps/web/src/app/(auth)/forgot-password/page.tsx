'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import apiClient from '@/lib/api/client';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setError(null);
      await apiClient.post('/auth/forgot-password', data);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)' }} />
        
        <div className="relative w-full max-w-md space-y-8 card p-10 text-center" style={{ background: 'var(--color-surface-1)' }}>
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--color-success-dim)' }}>
            <CheckCircle2 className="w-8 h-8" style={{ color: '#34c98b' }} />
          </div>
          <h2 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}>Check your email</h2>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            If an account exists with that email, we have sent a password reset link.
          </p>
          <div className="pt-6">
            <Link href="/login" className="btn btn-primary w-full">
              Return to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)' }} />
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
            <KeyRound className="w-6 h-6 text-violet-400" />
          </div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}>
            Reset your password
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--color-muted)' }}>
            Enter your email and we'll send you a reset link.
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
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                className="input"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-xs" style={{ color: '#ff82a1' }}>{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg w-full"
              style={{ marginTop: '1.5rem' }}
            >
              {isSubmitting ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : 'Send reset link'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/login" className="inline-flex items-center text-sm font-semibold transition-colors hover:text-violet-400" style={{ color: 'var(--color-muted)' }}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
