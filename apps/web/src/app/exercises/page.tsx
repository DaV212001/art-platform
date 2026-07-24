'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import Link from 'next/link';
import { Loader2, BookOpen, BarChart2, Search, X } from 'lucide-react';
import { useState } from 'react';

const DIFFICULTY_META: Record<string, { label: string; className: string }> = {
  beginner:     { label: 'Beginner',     className: 'badge-beginner' },
  intermediate: { label: 'Intermediate', className: 'badge-intermediate' },
  advanced:     { label: 'Advanced',     className: 'badge-advanced' },
};

function ExerciseSkeleton() {
  return (
    <div className="card p-6 space-y-4" style={{ background: 'var(--color-surface-1)' }}>
      <div className="flex justify-between">
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-5 w-20" />
      </div>
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-4 w-1/3 mt-2" />
    </div>
  );
}

export default function ExercisesPage() {
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const { data: exercises, isLoading: loadingExercises } = useQuery({
    queryKey: ['exercises', category, difficulty, search],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (category)   params.category   = category;
      if (difficulty) params.difficulty = difficulty;
      if (search)     params.search     = search;
      const res = await apiClient.get('/exercises', { params });
      return res.data?.exercises ?? res.data ?? [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['skill-categories'],
    queryFn: async () => {
      const res = await apiClient.get('/skill-categories');
      return res.data ?? [];
    },
  });

  const activeFilters = [
    category   && { key: 'category',   label: categories?.find((c: any) => c.slug === category)?.name ?? category },
    difficulty && { key: 'difficulty', label: DIFFICULTY_META[difficulty]?.label ?? difficulty },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">

      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">Practice Library</p>
        <h1
          className="text-4xl font-extrabold mb-2"
          style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}
        >
          Choose your exercise
        </h1>
        <p style={{ color: 'var(--color-muted)' }}>
          Each exercise is a targeted challenge built around a specific, measurable skill goal.
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-8 p-4 rounded-2xl"
        style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--color-subtle)' }}
          />
          <input
            type="text"
            className="input pl-9"
            placeholder="Search exercises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-subtle)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category pill strip */}
        <div className="scroll-x gap-2 items-center">
          {[{ id: '', name: 'All' }, ...(categories ?? [])].map((cat: any) => (
            <button
              key={cat.id ?? 'all'}
              onClick={() => setCategory(cat.slug ?? '')}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: category === (cat.slug ?? '') ? 'var(--color-brand)' : 'var(--color-surface-2)',
                color: category === (cat.slug ?? '') ? '#fff' : 'var(--color-muted)',
                border: `1px solid ${category === (cat.slug ?? '') ? 'transparent' : 'var(--color-border)'}`,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <div className="flex gap-2">
          {['', 'beginner', 'intermediate', 'advanced'].map(d => (
            <button
              key={d || 'all'}
              onClick={() => setDifficulty(d)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0"
              style={{
                background: difficulty === d
                  ? d === 'beginner'     ? 'rgba(52,201,139,0.2)'
                  : d === 'intermediate' ? 'rgba(245,166,35,0.2)'
                  : d === 'advanced'     ? 'rgba(242,84,125,0.2)'
                  : 'var(--color-surface-3)'
                  : 'var(--color-surface-2)',
                color: difficulty === d
                  ? d === 'beginner'     ? '#5ddba3'
                  : d === 'intermediate' ? '#ffc662'
                  : d === 'advanced'     ? '#ff82a1'
                  : 'var(--color-foreground)'
                  : 'var(--color-muted)',
                border: `1px solid ${difficulty === d ? 'transparent' : 'var(--color-border)'}`,
              }}
            >
              {d === '' ? 'Any' : DIFFICULTY_META[d].label}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>Filtering by:</span>
          {activeFilters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => key === 'category' ? setCategory('') : setDifficulty('')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all badge badge-brand"
            >
              {label}
              <X className="w-3 h-3" />
            </button>
          ))}
          <button
            onClick={() => { setCategory(''); setDifficulty(''); setSearch(''); }}
            className="text-xs transition-colors"
            style={{ color: 'var(--color-muted)' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Grid */}
      {loadingExercises ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <ExerciseSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exercises?.map((exercise: any, idx: number) => {
            const diff = DIFFICULTY_META[exercise.difficulty] ?? { label: exercise.difficulty, className: 'badge-muted' };
            return (
              <Link
                key={exercise.id}
                href={`/exercises/${exercise.id}`}
                className="block group animate-fade-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div
                  className="card card-interactive p-6 h-full flex flex-col relative overflow-hidden"
                  style={{ background: 'var(--color-surface-1)' }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at top right, rgba(124,92,252,0.08) 0%, transparent 70%)' }}
                  />

                  <div className="relative flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className="badge badge-muted">{exercise.skillCategory?.name ?? 'General'}</span>
                      <span className={`badge ${diff.className}`}>{diff.label}</span>
                    </div>

                    <h3
                      className="text-lg font-bold mb-2 transition-colors group-hover:text-violet-300"
                      style={{ color: 'var(--color-foreground)' }}
                    >
                      {exercise.title}
                    </h3>

                    <p
                      className="text-sm leading-relaxed line-clamp-3 flex-1 mb-6"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {exercise.description}
                    </p>

                    <div
                      className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                      style={{ color: 'var(--color-brand)' }}
                    >
                      <BookOpen className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      <span className="group-hover:translate-x-0.5 transition-transform">View Exercise</span>
                      <BarChart2 className="w-4 h-4 ml-auto opacity-30 group-hover:opacity-70 transition-opacity" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {exercises?.length === 0 && (
            <div
              className="col-span-full py-24 text-center card"
              style={{ background: 'var(--color-surface-1)' }}
            >
              <div
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
              >
                <Search className="w-7 h-7" style={{ color: 'var(--color-subtle)' }} />
              </div>
              <h3 className="text-lg font-bold mb-2">No exercises found</h3>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
