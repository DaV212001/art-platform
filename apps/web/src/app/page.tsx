import Link from 'next/link';
import { ArrowRight, Sparkles, Target, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-24 text-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-background to-background -z-10"></div>
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>The deliberate practice engine for artists</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          Improve faster through structured peer review.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop posting into the void. Complete focused exercises, give detailed feedback, and build a measurable track record of improvement.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/register" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-lg transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30">
            Start Practicing
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link href="/exercises" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl glass-card text-white font-medium text-lg hover:bg-white/10 transition-all">
            Browse Exercises
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-white/5 bg-slate-950/50 py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Targeted Exercises</h3>
              <p className="text-slate-400">Not just "draw something." Follow structured goals across anatomy, perspective, and composition.</p>
            </div>
            
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users className="w-32 h-32 text-amber-500" />
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Credit Economy</h3>
              <p className="text-slate-400">Review others to earn credits. Spend credits to get your own work reviewed. A balanced ecosystem.</p>
            </div>
            
            <div className="glass-card p-8">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Structured Feedback</h3>
              <p className="text-slate-400">No "nice work!" comments. Reviewers must provide what works, specific issues, evidence, and concrete suggestions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
