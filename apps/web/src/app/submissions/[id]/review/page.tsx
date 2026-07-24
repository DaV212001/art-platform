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
        <div className="glass-card p-12 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
          <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">Review Submitted!</h2>
          <p className="text-lg text-slate-300 mb-8">
            Thank you for providing structured, helpful feedback. You've earned{' '}
            <strong className="text-amber-400">{earnedCredits} credits</strong>.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => router.push('/review/queue')} className="px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors">
              Review Another
            </button>
            <button onClick={() => router.push('/')} className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/review/queue" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Queue
      </Link>
      
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left Column: Reference Image & Details */}
        <div className="space-y-6">
          <div className="glass-card overflow-hidden">
             <div className="p-4 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Artist</span>
                  <div className="text-white font-medium">{submission.user?.username}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Exercise</span>
                  <div className="text-white font-medium">{submission.exercise?.title}</div>
                </div>
             </div>
             <img src={submission.imageUrl} alt="Artwork for review" className="w-full h-auto" />
             
             {submission.notes && (
               <div className="p-6 bg-slate-900 border-t border-white/5">
                 <h4 className="text-sm font-semibold text-slate-300 mb-2">Artist Notes</h4>
                 <p className="text-slate-400 text-sm italic border-l-2 border-violet-500 pl-4">{submission.notes}</p>
               </div>
             )}
          </div>
          
          <div className="glass-card p-6 border-indigo-500/20 bg-indigo-500/5">
             <h4 className="font-bold text-white mb-2">Exercise Goals</h4>
             <p className="text-sm text-slate-300 mb-4">{submission.exercise?.description}</p>
             <ul className="space-y-2">
               {submission.exercise?.specificGoals?.map((g: any, i: number) => (
                 <li key={i} className="text-sm text-slate-400 flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    {g.goal}
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Right Column: Structured Review Form */}
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Write Review</h1>
          <p className="text-slate-400 mb-8">Provide structured, objective feedback based on the exercise goals. All fields require at least 100 characters to ensure depth.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 glass-card p-8">
            {serverError && (
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start space-x-3 mb-6">
                <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-rose-200">{serverError}</p>
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
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  {...register('additionalNotes')}
                  rows={3}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none text-sm"
                  placeholder="Any other encouraging words or resources..."
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg text-white bg-violet-600 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 disabled:opacity-50 transition-all font-bold text-lg"
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

// Helper component for the structured fields
function ReviewField({ label, name, register, error, charCount, placeholder }: any) {
  const isSufficient = charCount >= 100;
  
  return (
    <div className="relative">
      <div className="flex justify-between items-end mb-2">
        <label className="block text-sm font-bold text-white">{label}</label>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isSufficient ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
          {charCount}/100 chars
        </span>
      </div>
      <textarea
        {...register(name)}
        rows={4}
        className={`w-full bg-slate-900 border rounded-lg p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none text-sm
          ${error ? 'border-rose-500/50' : isSufficient ? 'border-emerald-500/30' : 'border-white/10'}
        `}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
