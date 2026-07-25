'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import Link from 'next/link';
import { Loader2, ArrowLeft, Coins, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

export default function CreditsPage() {
  const { user, isAuthenticated } = useAuthStore();

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['credit-balance'],
    queryFn: async () => {
      const res = await apiClient.get('/credits/balance');
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ['credit-transactions'],
    queryFn: async () => {
      const res = await apiClient.get('/credits/transactions');
      return res.data;
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null; // Auth guard handles redirect

  if (balanceLoading || txLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-brand)' }} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium transition-colors mb-8" style={{ color: 'var(--color-muted)' }}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Profile
      </Link>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="flex-1 card p-8 flex flex-col justify-center" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-brand-border)' }}>
          <p className="section-label mb-2">Current Balance</p>
          <div className="flex items-end gap-3 mb-2">
            <Coins className="w-10 h-10" style={{ color: '#ffc662' }} />
            <h1 className="text-5xl font-extrabold leading-none" style={{ color: '#ffc662' }}>{balanceData?.balance ?? user?.creditBalance ?? 0}</h1>
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--color-muted)' }}>Available to spend on requesting reviews.</p>
        </div>

        <div className="flex-1 card p-8 flex flex-col justify-center" style={{ background: 'var(--color-surface-2)' }}>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-violet-400" /> How credits work
          </h3>
          <ul className="text-sm space-y-3" style={{ color: 'var(--color-muted)' }}>
            <li className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <span>Writing a review</span>
              <span className="font-bold" style={{ color: '#34c98b' }}>+5</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <span>Requesting a review</span>
              <span className="font-bold" style={{ color: '#f2547d' }}>−3</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Signup bonus</span>
              <span className="font-bold" style={{ color: '#34c98b' }}>+5</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="card p-6" style={{ background: 'var(--color-surface-1)' }}>
        <h2 className="text-xl font-bold mb-6">Transaction History</h2>
        
        {txData?.data?.length > 0 ? (
          <div className="space-y-4">
            {txData.data.map((tx: any) => {
              const isEarned = tx.amount > 0;
              return (
                <div key={tx.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isEarned ? 'var(--color-success-dim)' : 'var(--color-danger-dim)' }}>
                    {isEarned ? <ArrowUpRight className="w-5 h-5" style={{ color: '#34c98b' }} /> : <ArrowDownRight className="w-5 h-5" style={{ color: '#f2547d' }} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm capitalize">{tx.transactionType.replace(/_/g, ' ')}</p>
                    {tx.notes && <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{tx.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg" style={{ color: isEarned ? '#34c98b' : '#f2547d' }}>
                      {isEarned ? '+' : ''}{tx.amount}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-subtle)' }}>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Coins className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-subtle)' }} />
            <p style={{ color: 'var(--color-muted)' }}>No credit transactions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
