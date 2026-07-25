'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, PlusCircle, CheckCircle, Clock, MessageSquare, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';
import AuthGuard from '@/components/auth/auth-guard';

function ReviewCard({ review, isOwner, onRate }: { review: any, isOwner: boolean, onRate: (rating: string) => void }) {
  return (
    <div className="card p-6 mb-4" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-brand-dim)', color: '#b39fff' }}>
            {review.reviewer?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{review.reviewer?.username}</span>
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-1 rounded-full flex-shrink-0" style={{ background: '#34c98b' }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#34c98b' }}>What is working</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{review.whatIsWorking}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-1 rounded-full flex-shrink-0" style={{ background: '#f2547d' }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#f2547d' }}>Specific issue</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{review.specificIssue}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-1 rounded-full flex-shrink-0" style={{ background: '#f5a623' }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#f5a623' }}>Evidence</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{review.evidence}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-1 rounded-full flex-shrink-0" style={{ background: '#7c5cfc' }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#7c5cfc' }}>Concrete Suggestion</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{review.concreteSuggestion}</p>
          </div>
        </div>
        {review.additionalNotes && (
          <div className="flex gap-3">
            <div className="w-1 rounded-full flex-shrink-0" style={{ background: 'var(--color-border)' }} />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-subtle)' }}>Additional Notes</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{review.additionalNotes}</p>
            </div>
          </div>
        )}
      </div>

      {isOwner && !review.helpfulnessRating && (
        <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>Was this review helpful?</span>
          <div className="flex gap-2">
            <button onClick={() => onRate('helpful')} className="btn btn-ghost btn-sm" style={{ color: '#34c98b' }}>
              <ThumbsUp className="w-4 h-4 mr-1" /> Helpful
            </button>
            <button onClick={() => onRate('neutral')} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-muted)' }}>
              <Minus className="w-4 h-4 mr-1" /> Neutral
            </button>
            <button onClick={() => onRate('unhelpful')} className="btn btn-ghost btn-sm" style={{ color: '#f2547d' }}>
              <ThumbsDown className="w-4 h-4 mr-1" /> Unhelpful
            </button>
          </div>
        </div>
      )}
      {review.helpfulnessRating && (
         <div className="mt-6 pt-4 flex items-center gap-2" style={{ borderTop: '1px solid var(--color-border)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>You rated this review:</span>
            <span className="badge badge-brand capitalize">{review.helpfulnessRating}</span>
         </div>
      )}
    </div>
  );
}

function VersionItem({ version, reviews, isOwner, onRate }: { version: any, reviews: any[], isOwner: boolean, onRate: (reviewId: string, rating: string) => void }) {
  return (
    <div className="relative pl-8 pb-12 last:pb-0">
      {/* Timeline line */}
      <div className="absolute top-0 bottom-0 left-3 w-0.5" style={{ background: 'var(--color-border)' }} />
      {/* Timeline dot */}
      <div className="absolute top-0 left-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
           style={{ background: 'var(--color-brand)', color: 'white', border: '4px solid var(--color-background)' }}>
        {version.versionNumber}
      </div>

      <div className="card p-6 mb-6" style={{ background: 'var(--color-surface-1)' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold">Version {version.versionNumber}</h3>
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
              {new Date(version.createdAt).toLocaleString()}
            </span>
          </div>
          <span className="badge badge-muted capitalize">{version.status.replace('_', ' ')}</span>
        </div>

        <img src={version.imageUrl} alt={`Version ${version.versionNumber}`} className="w-full rounded-lg mb-4" />
        
        {version.notes && (
          <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
            <h4 className="text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>Artist Notes</h4>
            <p className="text-sm italic" style={{ color: 'var(--color-subtle)' }}>"{version.notes}"</p>
          </div>
        )}
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-foreground)' }}>
            <MessageSquare className="w-4 h-4" style={{ color: 'var(--color-brand)' }} />
            Reviews ({reviews.length})
          </h4>
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} isOwner={isOwner} onRate={(rating) => onRate(review.id, rating)} />
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl text-center" style={{ border: '1px dashed var(--color-border)', color: 'var(--color-muted)' }}>
          <p className="text-sm">No reviews yet for this version.</p>
        </div>
      )}
    </div>
  );
}

export default function ChainPage() {
  const params = useParams();
  const router = useRouter();
  const chainId = params.chainId as string;
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: chain, isLoading: chainLoading } = useQuery({
    queryKey: ['chain', chainId],
    queryFn: async () => {
      const res = await apiClient.get(`/submissions/chains/${chainId}`);
      return res.data;
    }
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', chainId],
    queryFn: async () => {
      if (!chain) return {};
      const reviewsByVersion: Record<string, any[]> = {};
      for (const version of chain) {
        const res = await apiClient.get(`/submissions/${version.id}/reviews`);
        reviewsByVersion[version.id] = res.data;
      }
      return reviewsByVersion;
    },
    enabled: !!chain,
  });

  const rateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, rating }: { reviewId: string, rating: string }) => {
      await apiClient.patch(`/reviews/${reviewId}/rating`, { rating });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', chainId] });
    }
  });

  if (chainLoading || (chain && reviewsLoading)) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-brand)' }} />
      </div>
    );
  }

  if (!chain || chain.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Submission chain not found</h1>
        <Link href="/exercises" className="text-violet-400 hover:text-violet-300">Return to library</Link>
      </div>
    );
  }

  const latestVersion = chain[chain.length - 1];
  const isOwner = user?.id === latestVersion.userId;
  const canSubmitRevision = isOwner && latestVersion.status === 'reviewed';

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium transition-colors mb-8" style={{ color: 'var(--color-muted)' }}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Profile
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
           <span className="badge badge-brand">{latestVersion.exercise?.skillCategory?.name}</span>
        </div>
        <h1 className="text-4xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}>
          {latestVersion.exercise?.title}
        </h1>
        <p style={{ color: 'var(--color-muted)' }}>
          By {latestVersion.user?.username}
        </p>
      </div>

      <div className="mt-8">
        {[...chain].reverse().map((version) => (
          <VersionItem
            key={version.id}
            version={version}
            reviews={reviewsData?.[version.id] || []}
            isOwner={isOwner}
            onRate={(reviewId, rating) => rateReviewMutation.mutate({ reviewId, rating })}
          />
        ))}
      </div>

      {canSubmitRevision && (
        <div className="mt-12 text-center p-8 rounded-2xl" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
          <h3 className="text-xl font-bold mb-2">Ready for the next iteration?</h3>
          <p className="mb-6" style={{ color: 'var(--color-muted)' }}>Apply the feedback and submit a new version to continue improving.</p>
          <Link href={`/submissions/new?exerciseId=${latestVersion.exerciseId}&chainId=${chainId}`} className="btn btn-primary">
            <PlusCircle className="w-4.5 h-4.5 mr-2" />
            Submit Revision (V{latestVersion.versionNumber + 1})
          </Link>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}
