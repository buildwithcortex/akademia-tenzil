import Image from 'next/image';
import Link from 'next/link';
import s from './Footer.module.css';

const PAGE_LINKS = [
  { href: '#ballina', label: 'Ballina' },
  { href: '#misioni', label: 'Misioni' },
  { href: '#programi', label: 'Programi' },
  { href: '#metoda', label: 'Metoda' },
  { href: '/artikuj', label: 'Artikuj' },
  { href: '#apliko', label: 'Apliko' },
];

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <div className={s.cols}>
          <div className={s.brand}>
            <Image
              src="/logo-white.png"
              alt="Akademia Tenzil"
              width={58}
              height={58}
              loading="lazy"
              style={{ width: 58, height: 58 }}
            />
            <p className={s.wordmark}>Akademia Tenzil</p>
            <p className={s.tagline}>Memorizim · Përforcim · Përsosje</p>
          </div>

          <nav aria-label="Navigimi i fundit" className={s.col}>
            <p className={s.colTitle}>Faqja</p>
            {PAGE_LINKS.map((l) => (
              <a key={l.href} href={l.href} className={s.link}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className={s.col}>
            <p className={s.colTitle}>Kontakt</p>
            <a href="#apliko" className={s.link}>
              Apliko për program
            </a>
            {/*
              akademiatenzil@gmail.com is the academy's published address: it is
              live on /support and registered with App Store Connect. Phone,
              city and social are still owed and are deliberately absent.
            */}
            <a href="mailto:akademiatenzil@gmail.com" className={s.link}>
              akademiatenzil@gmail.com
            </a>
            <Link href="/support" className={s.link}>
              Ndihmë dhe mbështetje
            </Link>
          </div>

          <div className={s.col}>
            <p className={s.colTitle}>Politika e privatësisë</p>
            <p className={s.privacy}>
              Të dhënat e dërguara përmes formularit të aplikimit përdoren vetëm
              nga Akademia Tenzil për shqyrtimin e aplikimit. Ato nuk ndahen me
              palë të treta dhe fshihen me kërkesë. Llogaritë në aplikacionin e
              brendshëm krijohen vetëm nga akademia.
            </p>
            <Link href="/privacy-policy" className={s.link}>
              Lexo politikën e plotë
            </Link>
          </div>
        </div>

        <div className={s.bottom}>
          <p className={s.sign}>Një rrugëtim me Kuranin.</p>
          <p className={s.copyright}>
            © 2026 Akademia Tenzil. Të gjitha të drejtat e rezervuara.
          </p>
        </div>
      </div>
    </footer>
  );
}
