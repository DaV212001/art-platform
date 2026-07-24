'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Clock, Target, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const { data: exercise, isLoading } = useQuery({
    queryKey: ['exercise', params.id],
    queryFn: async () => {
      const res = await apiClient.get(`/exercises/${params.id}`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Exercise not found</h1>
        <Link href="/exercises" className="text-violet-400 hover:text-violet-300">Return to library</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/exercises" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Library
      </Link>
      
      <div className="glass-card p-8 md:p-12 mb-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] -mt-64 -mr-64 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-md bg-slate-800 text-sm font-medium text-slate-300">
              {exercise.skillCategory?.name}
            </span>
            <span className={`px-3 py-1 rounded-md text-sm font-medium uppercase tracking-wider
              ${exercise.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
              ${exercise.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
              ${exercise.difficulty === 'advanced' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}
            `}>
              {exercise.difficulty}
            </span>
            {exercise.estimatedMinutes && (
              <span className="flex items-center text-slate-400 text-sm font-medium ml-auto">
                <Clock className="w-4 h-4 mr-1.5" />
                {exercise.estimatedMinutes} mins
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            {exercise.title}
          </h1>
          
          <div className="prose prose-invert prose-violet max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed">
              {exercise.description}
            </p>
          </div>
          
          {exercise.specificGoals && exercise.specificGoals.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-violet-400" />
                Specific Goals
              </h3>
              <ul className="space-y-3">
                {exercise.specificGoals.map((goal: any, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-slate-300">{goal.goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Call to action */}
      <div className="glass-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-violet-500/20">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Ready to practice?</h3>
          <p className="text-slate-400">Complete the exercise and upload your work for structured peer review.</p>
        </div>
        <button 
          onClick={() => router.push(`/submissions/new?exerciseId=${exercise.id}`)}
          className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all shadow-lg shadow-violet-600/20"
        >
          <UploadCloud className="w-5 h-5 mr-2" />
          Submit Practice
        </button>
      </div>
    </div>
  );
}
