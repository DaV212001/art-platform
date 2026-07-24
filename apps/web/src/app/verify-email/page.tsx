'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api/client';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided.');
      return;
    }

    const verifyToken = async () => {
      hasFetchedRef.current = true;
      try {
        await apiClient.post('/auth/verify-email', { token });
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err?.message || 'Failed to verify email. The link may have expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md glass-card p-10 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin text-violet-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Verifying your email...</h2>
            <p className="text-slate-400">Please wait while we confirm your email address.</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-slate-400 mb-8">Your account is now fully active. You can log in and start practicing.</p>
            <Link href="/login" className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors">
              Continue to Login
            </Link>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-slate-400 mb-8">{errorMessage}</p>
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
