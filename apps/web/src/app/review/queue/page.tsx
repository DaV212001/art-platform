'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import Link from 'next/link';
import { Loader2, MessageSquarePlus, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewQueuePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['review-queue'],
    queryFn: async () => {
      const res = await apiClient.get('/submissions/queue');
      return res.data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Review Queue</h1>
        <p className="text-slate-400">Help fellow artists improve and earn credits for detailed, structured feedback.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.map((submission: any) => (
            <div key={submission.id} className="glass-card flex flex-col overflow-hidden group">
              {/* Image Preview */}
              <div className="h-64 overflow-hidden relative bg-slate-900 border-b border-white/5">
                <img 
                  src={submission.imageThumbnailUrl || submission.imageUrl} 
                  alt="Submission preview" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-2.5 py-1 rounded-md bg-violet-600 text-xs font-bold text-white mb-2 inline-block">
                    {submission.exercise?.skillCategory?.name}
                  </span>
                  <h3 className="font-bold text-white line-clamp-1">{submission.exercise?.title}</h3>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-slate-400 mb-4">
                  <div className="w-6 h-6 rounded-full bg-slate-800 mr-2 flex items-center justify-center font-bold text-slate-300">
                    {submission.user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span>{submission.user?.username}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <span>{formatDistanceToNow(new Date(submission.reviewRequestedAt), { addSuffix: true })}</span>
                </div>
                
                {submission.notes ? (
                  <div className="bg-white/5 rounded-lg p-3 mb-6 flex-1">
                    <p className="text-sm text-slate-300 italic line-clamp-2">"{submission.notes}"</p>
                  </div>
                ) : (
                  <div className="flex-1"></div>
                )}
                
                <Link 
                  href={`/submissions/${submission.id}/review`}
                  className="w-full flex items-center justify-center py-3 rounded-lg bg-white/5 hover:bg-violet-600 text-white font-medium border border-white/10 hover:border-violet-500 transition-all group-hover:bg-violet-600 group-hover:border-violet-500"
                >
                  <MessageSquarePlus className="w-4 h-4 mr-2" />
                  Write Review
                </Link>
              </div>
            </div>
          ))}
          {data?.length === 0 && (
            <div className="col-span-full py-24 text-center glass-card">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquarePlus className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Queue is empty</h3>
              <p className="text-slate-400">There are no submissions waiting for review right now. Check back later!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
