'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import Link from 'next/link';
import { Loader2, Search, Filter, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function ExercisesPage() {
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['exercises', category, difficulty],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty;
      const res = await apiClient.get('/exercises', { params });
      return res.data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['skill-categories'],
    queryFn: async () => {
      const res = await apiClient.get('/skill-categories');
      return res.data; // Note: if it's not wrapped in envelope by backend
    }
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Practice Library</h1>
          <p className="text-slate-400">Targeted exercises to build your foundational skills.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Categories Dropdown */}
          <div className="relative">
             <select 
               className="w-full appearance-none bg-slate-900 border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
               value={category}
               onChange={(e) => setCategory(e.target.value)}
             >
               <option value="">All Categories</option>
               {categories?.map((cat: any) => (
                 <option key={cat.id} value={cat.slug}>{cat.name}</option>
               ))}
             </select>
             <Filter className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative">
             <select 
               className="w-full appearance-none bg-slate-900 border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
               value={difficulty}
               onChange={(e) => setDifficulty(e.target.value)}
             >
               <option value="">Any Difficulty</option>
               <option value="beginner">Beginner</option>
               <option value="intermediate">Intermediate</option>
               <option value="advanced">Advanced</option>
             </select>
             <Filter className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((exercise: any) => (
            <Link key={exercise.id} href={`/exercises/${exercise.id}`} className="block group">
              <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300">
                    {exercise.skillCategory?.name}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider
                    ${exercise.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                    ${exercise.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                    ${exercise.difficulty === 'advanced' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}
                  `}>
                    {exercise.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                  {exercise.title}
                </h3>
                
                <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                  {exercise.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-violet-400 group-hover:text-violet-300 transition-colors mt-auto">
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  View Exercise
                </div>
              </div>
            </Link>
          ))}
          {data?.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <p className="text-slate-400">No exercises found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
