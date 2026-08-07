import type { Metadata, Viewport } from 'next';
import { Manrope, Amiri } from 'next/font/google';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { SITE_URL } from '@/lib/site';
import './globals.css';

// `latin-ext` is required on Manrope: it carries ë and ç.
const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

// The one Arabic verse only.
const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const title = 'Akademia Tenzil — Memorizim dhe Përforcim i Kuranit';
const description =
  'Akademia Tenzil ofron një program të strukturuar për memorizimin, përforcimin dhe ruajtjen afatgjatë të Kuranit.';

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    url: '/',
    siteName: 'Akademia Tenzil',
    title,
    description,
  },
  twitter: { card: 'summary_large_image', title, description },
  icons: { icon: '/app-icon.png', apple: '/app-icon.png' },
};

export const viewport: Viewport = {
  themeColor: '#F4F0E6',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq" className={`${manrope.variable} ${amiri.variable}`}>
      <head>
        <link
          rel="preload"
          href="/fonts/CinzelWolf.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
