'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import Link from 'next/link';
import { Loader2, Clock, GitBranch, MessageSquare, Coins, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'submissions' | 'reviews'>('submissions');

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get('/users/me');
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const { data: submissionsData, isLoading: submissionsLoading } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: async () => {
      const res = await apiClient.get('/submissions/me');
      return res.data;
    },
    enabled: isAuthenticated && activeTab === 'submissions',
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['my-reviews-given'],
    queryFn: async () => {
      const res = await apiClient.get('/users/me/reviews-given');
      return res.data;
    },
    enabled: isAuthenticated && activeTab === 'reviews',
  });

  if (!isAuthenticated) return null; // Auth guard will handle redirect

  if (profileLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-brand)' }} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Profile Header */}
      <div className="card p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6" style={{ background: 'var(--color-surface-1)' }}>
        <div 
          className="w-24 h-24 rounded-full flex flex-shrink-0 items-center justify-center text-3xl font-bold"
          style={{ 
            background: 'linear-gradient(135deg, var(--color-surface-3), var(--color-surface-4))',
            border: '2px solid var(--color-border)',
            color: '#b39fff' 
          }}
        >
          {(profile?.displayName || profile?.username || 'A').charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold mb-1">{profile?.displayName || profile?.username}</h1>
          <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>@{profile?.username}</p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-subtle)' }}>
              <Clock className="w-4 h-4" /> Joined {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
            </div>
            <Link href="/profile/credits" className="flex items-center gap-1.5 text-sm font-semibold badge badge-brand hover:opacity-80 transition-opacity">
              <Coins className="w-4 h-4" /> {profile?.creditBalance} Credits
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-8" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${activeTab === 'submissions' ? '' : 'opacity-60 hover:opacity-100'}`}
          style={{ color: activeTab === 'submissions' ? 'var(--color-brand)' : 'var(--color-foreground)' }}
        >
          My Submissions
          {activeTab === 'submissions' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: 'var(--color-brand)' }} />
          )}
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${activeTab === 'reviews' ? '' : 'opacity-60 hover:opacity-100'}`}
          style={{ color: activeTab === 'reviews' ? 'var(--color-brand)' : 'var(--color-foreground)' }}
        >
          Reviews Given
          {activeTab === 'reviews' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: 'var(--color-brand)' }} />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'submissions' && (
        <div>
          {submissionsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-brand)' }} /></div>
          ) : submissionsData?.data?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {submissionsData.data.map((sub: any) => (
                <Link key={sub.id} href={`/submissions/chain/${sub.chainId}`} className="card card-interactive overflow-hidden flex flex-col" style={{ background: 'var(--color-surface-1)' }}>
                  <div className="h-40 overflow-hidden bg-black relative">
                    <img src={sub.imageThumbnailUrl || sub.imageUrl} alt="Submission" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2 right-2 badge badge-brand bg-black/60 backdrop-blur-md">V{sub.versionNumber}</div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-sm mb-1">{sub.exercise?.title}</h3>
                    <p className="text-xs mb-3" style={{ color: 'var(--color-muted)' }}>{sub.exercise?.skillCategory?.name}</p>
                    <div className="mt-auto flex justify-between items-center text-xs">
                      <span className="badge badge-muted capitalize">{sub.status.replace('_', ' ')}</span>
                      <span style={{ color: 'var(--color-subtle)' }}>{new Date(sub.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card" style={{ background: 'var(--color-surface-1)' }}>
              <GitBranch className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-subtle)' }} />
              <p style={{ color: 'var(--color-muted)' }}>You haven't submitted any artwork yet.</p>
              <Link href="/exercises" className="btn btn-primary mt-4 inline-flex">Find an Exercise</Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div>
          {reviewsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-brand)' }} /></div>
          ) : reviewsData?.data?.length > 0 ? (
            <div className="space-y-4">
              {reviewsData.data.map((review: any) => (
                <Link key={review.id} href={`/submissions/chain/${review.submission?.chainId}`} className="card card-interactive p-5 block" style={{ background: 'var(--color-surface-1)' }}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                       <MessageSquare className="w-4 h-4" style={{ color: 'var(--color-brand)' }} />
                       Reviewed: {review.submission?.exercise?.title}
                    </h3>
                    <span className="text-xs" style={{ color: 'var(--color-subtle)' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--color-muted)' }}>{review.whatIsWorking}</p>
                  {review.helpfulnessRating && (
                    <div className="mt-3">
                      <span className="badge badge-muted text-xs capitalize">Rated: {review.helpfulnessRating}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card" style={{ background: 'var(--color-surface-1)' }}>
              <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-subtle)' }} />
              <p style={{ color: 'var(--color-muted)' }}>You haven't written any reviews yet.</p>
              <Link href="/review/queue" className="btn btn-primary mt-4 inline-flex">Go to Review Queue</Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
