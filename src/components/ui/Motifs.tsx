import type { CSSProperties } from 'react';

/* ---------------------------------------------------------------------------
   Motif 1. Eyebrow: 34×1px gold rule + 11px uppercase text.
   --------------------------------------------------------------------------- */

export function Eyebrow({
  children,
  gold = false,
  reveal = true,
  style,
}: {
  children: React.ReactNode;
  /** gold on dark surfaces, gold-dark on light (AA contrast) */
  gold?: boolean;
  reveal?: boolean;
  style?: CSSProperties;
}) {
  return (
    <p
      className={gold ? 'tz-eyebrow tz-eyebrow--gold' : 'tz-eyebrow'}
      data-reveal={reveal ? '1' : undefined}
      style={style}
    >
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------------------
   Motif 2. Three gold diamonds. `filled` marks how many read as complete.
   --------------------------------------------------------------------------- */

export function Diamonds({
  filled = 3,
  size,
  style,
}: {
  filled?: 0 | 1 | 2 | 3;
  size?: number;
  style?: CSSProperties;
}) {
  const dim = size ? { width: size, height: size } : undefined;
  return (
    <div className="tz-diamonds" aria-hidden="true" style={style}>
      {[0, 1, 2].map((i) => (
        <span key={i} data-pending={i >= filled} style={dim} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Motif 3. Arch / mihrab. One path vocabulary, different scale and opacity.
   --------------------------------------------------------------------------- */

/** Two-curve arch used as a watermark inside the program panels. */
export function ArchWatermark({
  stroke,
  style,
}: {
  stroke: string;
  style: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 500"
      fill="none"
      stroke={stroke}
      strokeWidth="1.2"
      style={style}
    >
      <path d="M40 500V250C40 180 80 130 200 10c120 120 160 170 160 240v250" />
      <path d="M100 500V270C100 214 132 174 200 90c68 84 100 124 100 180v230" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Motif 4. Gold journey line: pale rule + gold child scaled by scroll.
   --------------------------------------------------------------------------- */

export function JourneyLine({ style }: { style: CSSProperties }) {
  return (
    <div className="tz-line" aria-hidden="true" style={style}>
      <i data-scrollline="1" />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Motif 6. Paper grain: fixed feTurbulence overlay at 3%.
   --------------------------------------------------------------------------- */

export function PaperGrain() {
  return <div className="tz-grain" aria-hidden="true" />;
}

/* ---------------------------------------------------------------------------
   Motif 7. Arrow in its own circle. Every CTA gets one.
   --------------------------------------------------------------------------- */

export function ArrowCircle({
  tone = 'gold',
}: {
  /** gold circle on dark buttons, translucent cream on the nav CTA */
  tone?: 'gold' | 'nav';
}) {
  const nav = tone === 'nav';
  return (
    <span className={nav ? 'tz-arrow tz-arrow--nav' : 'tz-arrow'}>
      <svg
        width={nav ? 11 : 12}
        height={nav ? 11 : 12}
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 10 10 2M10 2H4.2M10 2v5.8"
          stroke={nav ? '#F4F0E6' : '#123F33'}
          strokeWidth={nav ? 1.3 : 1.4}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
