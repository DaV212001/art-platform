'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import apiClient from '@/lib/api/client';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, underscores, and hyphens allowed'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      await apiClient.post('/auth/register', {
        email: data.email,
        username: data.username,
        password: data.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to register. Please try again.');
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
            We've sent a verification link to your email address. Please verify your account to continue.
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
          <h2 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}>
            Create your account
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--color-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold transition-colors hover:text-violet-400">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="card p-8 space-y-6" style={{ background: 'var(--color-surface-1)' }} onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="p-4 rounded-xl flex items-start gap-3 animate-scale-in" style={{ background: 'var(--color-danger-dim)', border: '1px solid rgba(242,84,125,0.25)' }}>
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" style={{ color: '#ff82a1' }} />
              <p className="text-sm" style={{ color: '#ff82a1' }}>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-foreground)' }}>Username</label>
              <input
                {...register('username')}
                type="text"
                className="input"
                placeholder="art_student"
              />
              {errors.username && <p className="mt-1 text-xs" style={{ color: '#ff82a1' }}>{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-foreground)' }}>Email address</label>
              <input
                {...register('email')}
                type="email"
                className="input"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs" style={{ color: '#ff82a1' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-foreground)' }}>Password</label>
              <input
                {...register('password')}
                type="password"
                className="input"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs" style={{ color: '#ff82a1' }}>{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-foreground)' }}>Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="input"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: '#ff82a1' }}>{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg w-full"
            style={{ marginTop: '1.5rem' }}
          >
            {isSubmitting ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
