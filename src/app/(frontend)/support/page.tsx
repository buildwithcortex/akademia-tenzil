import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalShell } from '@/components/LegalShell';
import s from '@/components/LegalPage.module.css';

/**
 * The iOS app's Support URL in App Store Connect points at this exact path.
 * The path must not change. Wording is carried over verbatim from the previous
 * static page; only the presentation changed.
 */
export const metadata: Metadata = {
  title: 'Ndihmë dhe kontakt · Akademia Tenzil',
  description:
    'Ndihmë për aplikacionin e brendshëm të Akademisë Tenzil: kyçja, fjalëkalimi, njoftimet dhe fshirja e të dhënave.',
  alternates: { canonical: '/support' },
  openGraph: {
    title: 'Ndihmë dhe kontakt · Akademia Tenzil',
    description:
      'Ndihmë për aplikacionin e brendshëm të Akademisë Tenzil.',
    url: '/support',
  },
};

export default function SupportPage() {
  return (
    <LegalShell
      eyebrow="Akademia Tenzil"
      title="Ndihmë dhe kontakt"
      intro="Aplikacion për menaxhimin e shkollës së Kuranit."
      footer={
        <>
          <Link href="/">Akademia Tenzil</Link>
          <span className={s.dot} aria-hidden="true">
            ·
          </span>
          <a href="mailto:akademiatenzil@gmail.com">akademiatenzil@gmail.com</a>
          <span className={s.dot} aria-hidden="true">
            ·
          </span>
          <Link href="/privacy-policy">Politika e privatësisë</Link>
        </>
      }
    >
      <div className={s.card}>
        <div className={s.cardInner}>
          <p className={s.cardLabel}>Na shkruani</p>
          <a href="mailto:akademiatenzil@gmail.com" className={s.cardMail}>
            akademiatenzil@gmail.com
          </a>
          <p className={s.cardNote}>
            Përgjigjemi zakonisht brenda 2 ditësh pune.
          </p>
        </div>
      </div>

      <h2>Si të kyçem?</h2>
      <p>
        Llogaritë krijohen nga shkolla, jo nga aplikacioni. Nuk ka regjistrim
        publik. Mësuesi kyçet me email-in e vet, ndërsa nxënësi kyçet me emrin e
        përdoruesit që ia jep mësuesi. Nëse nuk keni të dhëna kyçjeje,
        kontaktoni shkollën tuaj.
      </p>

      <h2>Kam harruar fjalëkalimin</h2>
      <p>
        Mësuesi ose administratori mund ta ndryshojë fjalëkalimin e nxënësit
        brenda aplikacionit, te profili i nxënësit. Për llogarinë e mësuesit, na
        shkruani në adresën më lart.
      </p>

      <h2>Nuk po marr njoftime</h2>
      <p>
        Kontrolloni që njoftimet të jenë të lejuara: Settings, pastaj Tenzil,
        pastaj Notifications. Njoftimet u dërgohen nxënësve nga mësuesi i tyre,
        prandaj duhet të jeni të kyçur me llogarinë e nxënësit.
      </p>

      <h2>Fshirja e llogarisë dhe e të dhënave</h2>
      <p>
        Llogaritë i menaxhon shkolla. Administratori mund të fshijë një nxënës
        brenda aplikacionit. Për të kërkuar fshirjen e llogarisë suaj ose të të
        dhënave tuaja, na shkruani në{' '}
        <a href="mailto:akademiatenzil@gmail.com">akademiatenzil@gmail.com</a>.
      </p>

      <h2>Privatësia</h2>
      <p>
        Lexoni <Link href="/privacy-policy">politikën e privatësisë</Link>.
        Aplikacioni nuk ka reklama, nuk ka gjurmues dhe nuk i shet të dhënat e
        askujt.
      </p>

      <h2 lang="en">In English</h2>
      <p lang="en">
        Akademia Tenzil is a private management app for a Qur&apos;an school.
        Accounts are created by the school, not through public sign-up, so there
        is nothing to register here. For any question, password reset or data
        deletion request, email{' '}
        <a href="mailto:akademiatenzil@gmail.com">akademiatenzil@gmail.com</a>.
        See also our <Link href="/privacy-policy">privacy policy</Link>.
      </p>
    </LegalShell>
  );
}
