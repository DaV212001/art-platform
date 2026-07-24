'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import Link from 'next/link';
import { Loader2, MessageSquarePlus, Clock, Coins, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function QueueSkeleton() {
  return (
    <div className="card overflow-hidden" style={{ background: 'var(--color-surface-1)' }}>
      <div className="skeleton h-56 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-10 w-full mt-4" />
      </div>
    </div>
  );
}

export default function ReviewQueuePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['review-queue'],
    queryFn: async () => {
      const res = await apiClient.get('/submissions/queue');
      return res.data?.data ?? res.data ?? [];
    },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="section-label mb-2">Community</p>
          <h1
            className="text-4xl font-extrabold mb-2"
            style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}
          >
            Review Queue
          </h1>
          <p style={{ color: 'var(--color-muted)' }}>
            Give structured feedback and earn credits. Every review makes you a better artist too.
          </p>
        </div>

        {/* Earnings reminder */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-xl flex-shrink-0"
          style={{
            background: 'var(--color-credit-dim)',
            border: '1px solid var(--color-credit-border)',
          }}
        >
          <Coins className="w-5 h-5" style={{ color: '#ffc662' }} />
          <div>
            <p className="text-xs font-medium" style={{ color: '#ffc662' }}>Each review earns</p>
            <p className="text-lg font-extrabold" style={{ color: '#ffc662' }}>+5 credits</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <QueueSkeleton key={i} />)}
        </div>
      ) : data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((submission: any, idx: number) => (
            <div
              key={submission.id}
              className="card card-interactive group overflow-hidden flex flex-col animate-fade-up"
              style={{
                background: 'var(--color-surface-1)',
                animationDelay: `${idx * 60}ms`,
              }}
            >
              {/* Artwork */}
              <div
                className="relative overflow-hidden"
                style={{ height: '220px', background: 'var(--color-surface-2)' }}
              >
                {submission.imageThumbnailUrl || submission.imageUrl ? (
                  <img
                    src={submission.imageThumbnailUrl || submission.imageUrl}
                    alt="Submission preview"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10" style={{ color: 'var(--color-subtle)' }} />
                  </div>
                )}

                {/* Overlay gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(10,11,15,0.9) 0%, rgba(10,11,15,0.2) 50%, transparent 100%)',
                  }}
                />

                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {submission.exercise?.skillCategory?.name && (
                    <span className="badge badge-brand mb-2">
                      {submission.exercise.skillCategory.name}
                    </span>
                  )}
                  <h3 className="font-bold text-sm leading-snug line-clamp-2" style={{ color: 'var(--color-foreground)' }}>
                    {submission.exercise?.title ?? 'Untitled Exercise'}
                  </h3>
                </div>
              </div>

              {/* Meta & Action */}
              <div className="p-5 flex flex-col flex-1">
                {/* Artist + time */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: 'var(--color-brand-dim)',
                      border: '1px solid var(--color-brand-border)',
                      color: '#b39fff',
                    }}
                  >
                    {submission.user?.username?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                    {submission.user?.username ?? 'Anonymous'}
                  </span>
                  <span style={{ color: 'var(--color-subtle)' }}>·</span>
                  <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-subtle)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {submission.reviewRequestedAt
                      ? formatDistanceToNow(new Date(submission.reviewRequestedAt), { addSuffix: true })
                      : 'Recently'}
                  </span>
                </div>

                {/* Artist notes */}
                {submission.notes ? (
                  <div
                    className="p-3 rounded-xl mb-4 flex-1"
                    style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                  >
                    <p className="text-xs italic line-clamp-3" style={{ color: 'var(--color-muted)' }}>
                      "{submission.notes}"
                    </p>
                  </div>
                ) : (
                  <div className="flex-1" />
                )}

                {/* CTA */}
                <Link
                  href={`/submissions/${submission.id}/review`}
                  className="btn btn-ghost w-full group-hover:bg-violet-600/90 group-hover:border-transparent group-hover:text-white transition-all"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  Write Review
                  <span
                    className="ml-auto text-xs font-bold opacity-60 group-hover:opacity-100"
                    style={{ color: '#ffc662' }}
                  >
                    +5 ◎
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div
          className="py-32 text-center card"
          style={{ background: 'var(--color-surface-1)' }}
        >
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
          >
            <MessageSquarePlus className="w-10 h-10" style={{ color: 'var(--color-subtle)' }} />
          </div>
          <h3 className="text-2xl font-bold mb-3">Queue is empty</h3>
          <p className="mb-8 max-w-sm mx-auto" style={{ color: 'var(--color-muted)' }}>
            No submissions are waiting for review right now. Check back later, or submit your own work!
          </p>
          <Link href="/exercises" className="btn btn-primary">
            Browse exercises
          </Link>
        </div>
      )}
    </div>
  );
}
