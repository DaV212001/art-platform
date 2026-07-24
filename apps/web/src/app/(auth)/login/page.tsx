'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Palette, Eye, EyeOff } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      const res = await apiClient.post('/auth/login', data);
      const { accessToken, refreshToken, user } = res.data;
      login(accessToken, refreshToken, user);
      router.push('/exercises');
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password.');
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #7c5cfc 0%, #5b6ef5 100%)',
              boxShadow: '0 4px 20px rgba(124,92,252,0.4)',
            }}
          >
            <Palette className="w-6 h-6 text-white" />
          </div>
          <h1
            className="text-2xl font-extrabold"
            style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}
          >
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--color-muted)' }}>
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-semibold transition-colors"
              style={{ color: '#b39fff' }}
            >
              Sign up free
            </Link>
          </p>
        </div>

        {/* Card */}
        <div
          className="card p-8 space-y-6"
          style={{ background: 'var(--color-surface-1)' }}
        >
          {/* Error */}
          {error && (
            <div
              className="p-4 rounded-xl flex items-start gap-3 animate-scale-in"
              style={{ background: 'var(--color-danger-dim)', border: '1px solid rgba(242,84,125,0.25)' }}
            >
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" style={{ color: '#ff82a1' }} />
              <p className="text-sm" style={{ color: '#ff82a1' }}>{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs transition-colors"
                  style={{ color: 'var(--color-muted)' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = '#b39fff')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--color-muted)')}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-11"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--color-subtle)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--color-muted)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--color-subtle)')}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs" style={{ color: '#ff82a1' }}>{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg w-full"
              style={{ marginTop: '1.5rem' }}
            >
              {isSubmitting ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
