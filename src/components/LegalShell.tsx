import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow, PaperGrain } from './ui/Motifs';
import s from './LegalPage.module.css';

/**
 * Shell for the two standing documents, /privacy-policy and /support.
 *
 * Both are linked from App Store Connect, so their paths are fixed. They keep
 * the site's tokens and motifs but sit at document measure rather than the
 * editorial grid, and they carry no scroll motion: these are pages people read,
 * not pages people are sold to.
 */
export function LegalShell({
  eyebrow,
  title,
  meta,
  intro,
  lang,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  /** e.g. the "Last updated" line */
  meta?: string;
  intro?: React.ReactNode;
  /** set when the document is not in the page's default Albanian */
  lang?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className={s.page}>
      <PaperGrain />

      <header className={s.bar}>
        <div className={s.barInner}>
          <Link href="/" className={s.brand}>
            <Image
              src="/logo-dark.png"
              alt=""
              width={30}
              height={30}
              loading="eager"
              fetchPriority="high"
              style={{ width: 30, height: 30 }}
            />
            <span className={s.wordmark}>Akademia Tenzil</span>
          </Link>
          <Link href="/" className={s.back}>
            Kthehu te faqja
          </Link>
        </div>
      </header>

      <main className={s.wrap} lang={lang}>
        <div className={s.head}>
          <Eyebrow reveal={false}>{eyebrow}</Eyebrow>
          <h1 className={s.title}>{title}</h1>
          {meta ? <p className={s.updated}>{meta}</p> : null}
          {intro ? <p className={s.sub}>{intro}</p> : null}
        </div>

        <div className={s.body}>{children}</div>

        <div className={s.foot}>{footer}</div>
      </main>
    </div>
  );
}
