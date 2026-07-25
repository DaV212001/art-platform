import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/header';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Artifex | Deliberate Practice for Artists',
  description:
    'Stop posting into the void. Complete targeted exercises, give structured peer feedback, and build a measurable track record of artistic improvement.',
  openGraph: {
    title: 'Artifex | Deliberate Practice for Artists',
    description: 'The deliberate practice engine for serious artists.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${plusJakarta.variable} min-h-screen flex flex-col font-sans`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/5 py-8 text-center flex flex-col items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--color-subtle)' }}>
              © {new Date().getFullYear()} Artifex — Built for artists who take improvement seriously.
            </p>
            <div className="flex gap-4 text-sm" style={{ color: 'var(--color-subtle)' }}>
              <Link href="/legal" className="hover:text-white transition-colors">Terms of Service</Link>
              <span>&middot;</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
