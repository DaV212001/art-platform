'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';
import { Palette, Bell, CreditCard, User, LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Art Platform</span>
          </Link>
          
          {isClient && isAuthenticated && (
            <nav className="hidden md:flex ml-8 space-x-6">
              <Link href="/exercises" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Exercises
              </Link>
              <Link href="/review/queue" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Review Queue
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {!isClient ? (
             <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          ) : isAuthenticated ? (
            <>
              {/* Credit Balance Badge */}
              <Link href="/profile/credits" title="View Credit History">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm font-bold">{user?.creditBalance || 0}</span>
                </div>
              </Link>

              {/* Notifications */}
              <button className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5">
                <Bell className="w-5 h-5" />
                {/* Dummy unread indicator */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 border-2 border-background"></span>
              </button>

              {/* Profile Dropdown Trigger */}
              <div className="flex items-center space-x-3 ml-2 pl-4 border-l border-white/10">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium leading-none mb-1">{user?.displayName || user?.username}</span>
                  <span className="text-xs text-slate-400 leading-none">Level 1 Artist</span>
                </div>
                <button onClick={() => router.push('/profile')} className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:ring-2 ring-violet-500 transition-all">
                  <User className="w-4 h-4 text-slate-300" />
                </button>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 transition-colors" title="Log out">
                   <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
