import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GateForm } from '@/components/GateForm';
import s from '@/components/Gate.module.css';

export const metadata: Metadata = {
  title: 'Akademia Tenzil',
  description: 'Faqja është në ndërtim.',
  // A work-in-progress screen should never be indexed.
  robots: { index: false, follow: false },
};

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  // Only ever return to a path on this site: an attacker-supplied absolute URL
  // here would turn the gate into an open redirect.
  const safeNext =
    next && next.startsWith('/') && !next.startsWith('//') ? next : '/';

  return (
    <div className={s.page}>
      <svg
        aria-hidden="true"
        viewBox="0 0 800 900"
        className={s.arch}
        fill="none"
        stroke="rgba(176,138,76,.5)"
        strokeWidth="1.1"
      >
        <path d="M120 900V420C120 290 190 210 400 20c210 190 280 270 280 400v480" />
        <path d="M210 900V450C210 340 268 272 400 130c132 142 190 210 190 320v450" />
        <path d="M300 900V478C300 396 342 340 400 250c58 90 100 146 100 228v422" />
      </svg>

      <div className={s.inner}>
        <Image
          src="/logo-white.png"
          alt="Akademia Tenzil"
          width={512}
          height={512}
          loading="eager"
          fetchPriority="high"
          className={s.logo}
        />
        <p className={s.wordmark}>Akademia Tenzil</p>
        <p className={s.tagline}>Shkollë e Kuranit</p>

        <p className={s.note}>
          Faqja është duke u ndërtuar. Nëse keni fjalëkalimin, mund të hyni më
          poshtë.
        </p>

        <GateForm next={safeNext} />
      </div>

      <p className={s.foot}>
        <Link href="/support">Ndihmë</Link>
        <span className={s.dot} aria-hidden="true">
          ·
        </span>
        <Link href="/privacy-policy">Politika e privatësisë</Link>
      </p>
    </div>
  );
}
