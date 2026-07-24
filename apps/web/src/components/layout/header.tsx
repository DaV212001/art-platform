'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import {
  Palette,
  Bell,
  Coins,
  User,
  LogOut,
  Loader2,
  LayoutGrid,
  MessageSquareMore,
  ChevronDown,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const NAV_LINKS = [
  { href: '/exercises', label: 'Exercises', icon: LayoutGrid },
  { href: '/review/queue', label: 'Review Queue', icon: MessageSquareMore },
];

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsClient(true); }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push('/login');
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(10, 11, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">

        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7c5cfc 0%, #5b6ef5 100%)',
                boxShadow: '0 2px 12px rgba(124,92,252,0.4)',
              }}
            >
              <Palette className="w-4.5 h-4.5 text-white" />
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}
            >
              Artifex
            </span>
          </Link>

          {/* Desktop Nav */}
          {isClient && isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                  style={{
                    color: isActive(href) ? 'var(--color-foreground)' : 'var(--color-muted)',
                    background: isActive(href) ? 'rgba(255,255,255,0.07)' : 'transparent',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!isClient ? (
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--color-subtle)' }} />
          ) : isAuthenticated ? (
            <>
              {/* Credit Balance */}
              <Link
                href="/profile/credits"
                title="View Credit History"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: 'var(--color-credit-dim)',
                  border: '1px solid var(--color-credit-border)',
                  color: '#ffc662',
                }}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>{user?.creditBalance ?? 0}</span>
              </Link>

              {/* Notification Bell */}
              <button
                className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ color: 'var(--color-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Bell className="w-4.5 h-4.5" />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{
                    background: 'var(--color-brand)',
                    border: '2px solid var(--color-background)',
                  }}
                />
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 pl-3 transition-all rounded-full"
                  style={{ borderLeft: '1px solid var(--color-border)' }}
                >
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium leading-none mb-0.5">
                      {user?.displayName || user?.username}
                    </span>
                    <span className="text-xs leading-none" style={{ color: 'var(--color-muted)' }}>
                      Artist
                    </span>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-surface-3), var(--color-surface-4))',
                      border: '1px solid var(--color-border)',
                      color: '#b39fff',
                    }}
                  >
                    {(user?.displayName || user?.username || 'A').charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform"
                    style={{
                      color: 'var(--color-muted)',
                      transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 py-1 rounded-xl animate-scale-in"
                    style={{
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-card-hover)',
                    }}
                  >
                    <button
                      onClick={() => { setProfileOpen(false); router.push('/profile'); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: 'var(--color-muted)' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.color = 'var(--color-foreground)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--color-muted)';
                      }}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <div className="my-1" style={{ height: '1px', background: 'var(--color-border)' }} />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: '#ff82a1' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(242,84,125,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--color-muted)' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--color-foreground)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--color-muted)')}
              >
                Sign in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
