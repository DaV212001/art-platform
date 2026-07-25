'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api/client';

const reviewSchema = z.object({
  whatIsWorking: z.string().min(100, 'Must be at least 100 characters to ensure depth'),
  specificIssue: z.string().min(100, 'Must be at least 100 characters to ensure depth'),
  evidence: z.string().min(100, 'Must be at least 100 characters to ensure depth'),
  concreteSuggestion: z.string().min(100, 'Must be at least 100 characters to ensure depth'),
  additionalNotes: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function WriteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id;
  
  const [success, setSuccess] = useState(false);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: submission, isLoading } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: async () => {
      const res = await apiClient.get(`/submissions/${submissionId}`);
      return res.data;
    }
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      setServerError(null);
      const res = await apiClient.post('/reviews', {
        submissionId,
        ...data,
      });
      setEarnedCredits(res.data.creditsEarned || 5);
      setSuccess(true);
    } catch (err: any) {
      setServerError(err?.message || 'Failed to submit review. Please try again.');
    }
  };

  const getCharCount = (field: keyof ReviewFormValues) => watch(field)?.length || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Submission not found</h1>
        <Link href="/review/queue" className="text-violet-400 hover:text-violet-300">Return to queue</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <div className="card p-12 relative overflow-hidden animate-scale-in" style={{ background: 'var(--color-surface-1)' }}>
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
          <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--color-foreground)' }}>Review Submitted!</h2>
          <p className="text-lg mb-8" style={{ color: 'var(--color-muted)' }}>
            Thank you for providing structured, helpful feedback. You've earned{' '}
            <strong className="text-amber-400">{earnedCredits} credits</strong>.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => router.push('/review/queue')} className="btn btn-primary">
              Review Another
            </button>
            <button onClick={() => router.push('/')} className="btn btn-ghost">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/review/queue" className="inline-flex items-center text-sm font-medium transition-colors mb-8" style={{ color: 'var(--color-muted)' }}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Queue
      </Link>
      
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left Column: Reference Image & Details */}
        <div className="space-y-6">
          <div className="card overflow-hidden" style={{ background: 'var(--color-surface-1)' }}>
             <div className="p-4 border-b flex items-center justify-between" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--color-muted)' }}>Artist</span>
                  <div className="font-medium" style={{ color: 'var(--color-foreground)' }}>{submission.user?.username}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--color-muted)' }}>Exercise</span>
                  <div className="font-medium" style={{ color: 'var(--color-foreground)' }}>{submission.exercise?.title}</div>
                </div>
             </div>
             <img src={submission.imageUrl} alt="Artwork for review" className="w-full h-auto" />
             
             {submission.notes && (
               <div className="p-6 border-t" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                 <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>Artist Notes</h4>
                 <p className="text-sm italic border-l-2 pl-4" style={{ color: 'var(--color-muted)', borderColor: 'var(--color-brand)' }}>{submission.notes}</p>
               </div>
             )}
          </div>
          
          <div className="card p-6" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-brand-border)' }}>
             <h4 className="font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>Exercise Goals</h4>
             <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>{submission.exercise?.description}</p>
             <ul className="space-y-2">
               {submission.exercise?.specificGoals?.map((g: any, i: number) => (
                 <li key={i} className="text-sm flex items-start" style={{ color: 'var(--color-subtle)' }}>
                    <span className="mr-2" style={{ color: 'var(--color-brand)' }}>•</span>
                    {g.goal}
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Right Column: Structured Review Form */}
        <div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--color-foreground)', fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}>Write Review</h1>
          <p className="mb-8" style={{ color: 'var(--color-muted)' }}>Provide structured, objective feedback based on the exercise goals. All fields require at least 100 characters to ensure depth.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 card p-8" style={{ background: 'var(--color-surface-1)' }}>
            {serverError && (
              <div className="p-4 rounded-xl flex items-start gap-3 mb-6 animate-scale-in" style={{ background: 'var(--color-danger-dim)', border: '1px solid rgba(242,84,125,0.25)' }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ff82a1' }} />
                <p className="text-sm" style={{ color: '#ff82a1' }}>{serverError}</p>
              </div>
            )}

            <div className="space-y-4">
              <ReviewField 
                label="What is Working" 
                name="whatIsWorking" 
                register={register} 
                error={errors.whatIsWorking?.message} 
                charCount={getCharCount('whatIsWorking')}
                placeholder="Identify strong points. Are the proportions solid? Is the line weight confident? Provide positive reinforcement on what they achieved."
              />
              
              <ReviewField 
                label="Specific Issue" 
                name="specificIssue" 
                register={register} 
                error={errors.specificIssue?.message} 
                charCount={getCharCount('specificIssue')}
                placeholder="Identify one core issue related to the exercise goals. Be highly specific (e.g., 'The cranium sphere is too small relative to the facial plane')."
              />
              
              <ReviewField 
                label="Evidence" 
                name="evidence" 
                register={register} 
                error={errors.evidence?.message} 
                charCount={getCharCount('evidence')}
                placeholder="Point to exactly where the issue occurs in the image. e.g., 'Notice how the ear on the left side sits higher than the brow line.'"
              />
              
              <ReviewField 
                label="Concrete Suggestion" 
                name="concreteSuggestion" 
                register={register} 
                error={errors.concreteSuggestion?.message} 
                charCount={getCharCount('concreteSuggestion')}
                placeholder="How can they fix this in the next iteration? Provide a specific method or technique."
              />
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  {...register('additionalNotes')}
                  rows={3}
                  className="input w-full resize-none text-sm"
                  placeholder="Any other encouraging words or resources..."
                />
              </div>
            </div>

            <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg w-full"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Review & Earn Credits
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ReviewField({ label, name, register, error, charCount, placeholder }: any) {
  const isSufficient = charCount >= 100;
  
  return (
    <div className="relative">
      <div className="flex justify-between items-end mb-2">
        <label className="block text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>{label}</label>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isSufficient ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
          {charCount}/100 chars
        </span>
      </div>
      <textarea
        {...register(name)}
        rows={4}
        className={`input w-full resize-none text-sm`}
        style={error ? { borderColor: '#ff82a1' } : isSufficient ? { borderColor: '#34c98b' } : undefined}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs" style={{ color: '#ff82a1' }}>{error}</p>}
    </div>
  );
}
