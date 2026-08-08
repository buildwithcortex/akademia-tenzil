import Link from 'next/link';
import s from './AdminNavExtras.module.css';

/**
 * Top of the admin sidebar: the logo, then a way back to the dashboard and a
 * way out to the public site.
 *
 * The logo lives here rather than in the breadcrumb because this slot is wide
 * enough for it to actually read. Both colour variants are rendered and CSS
 * picks one, since the sidebar is light or dark depending on the theme.
 */
export function AdminNavExtras() {
  return (
    <div className={s.wrap}>
      <Link href="/admin" className={s.brand} aria-label="Akademia Tenzil">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-dark.png" alt="" className={`${s.logo} ${s.onLight}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-white.png" alt="" className={`${s.logo} ${s.onDark}`} />
        <span className={s.wordmark}>Akademia Tenzil</span>
      </Link>

      <div className={s.links}>
        <Link href="/admin" className={s.link}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 6.5 8 2l6 4.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6.5Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
          Kreu i panelit
        </Link>

        <Link href="/" target="_blank" rel="noreferrer" className={s.link}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6.5 3H3.8A.8.8 0 0 0 3 3.8v8.4a.8.8 0 0 0 .8.8h8.4a.8.8 0 0 0 .8-.8V9.5M9.5 2.5H13.5V6.5M13 3l-5.5 5.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Shiko faqen
        </Link>
      </div>
    </div>
  );
}
