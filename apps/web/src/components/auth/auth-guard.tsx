'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!isAuthenticated) {
      const currentQuery = searchParams.toString();
      const currentUrl = `${pathname}${currentQuery ? `?${currentQuery}` : ''}`;
      router.replace(`/login?next=${encodeURIComponent(currentUrl)}`);
    } else {
      setIsReady(true);
    }
  }, [isAuthenticated, _hasHydrated, pathname, searchParams, router]);

  if (!isReady || !_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return <>{children}</>;
}
