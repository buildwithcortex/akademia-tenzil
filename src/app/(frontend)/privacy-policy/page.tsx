import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalShell } from '@/components/LegalShell';
import s from '@/components/LegalPage.module.css';

/**
 * The iOS app's Privacy Policy URL in App Store Connect points at this exact
 * path. The path must not change.
 *
 * The wording below is carried over verbatim from the previous static page.
 * Only the presentation changed, so the "Last updated" date is unchanged too:
 * bump it only when the policy itself is revised.
 */
export const metadata: Metadata = {
  title: 'Politika e privatësisë · Akademia Tenzil',
  description:
    'Si i trajton Akademia Tenzil të dhënat e nxënësve dhe të mësuesve në aplikacionin e brendshëm.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy · Akademia Tenzil',
    description:
      'How Akademia Tenzil handles student and teacher information in its private school-management app.',
    url: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalShell
      eyebrow="Akademia Tenzil"
      title="Privacy Policy"
      meta="Last updated: 28 July 2026"
      lang="en"
      intro={
        <>
          Akademia Tenzil (&quot;the App&quot;, &quot;we&quot;, &quot;us&quot;)
          is a private Qur&apos;an-school management app used by a
          school&apos;s teachers and their students. This policy explains what
          information the App handles, why, and how it is protected. We have
          tried to keep it short and plain.
        </>
      }
      footer={
        <>
          <Link href="/">Akademia Tenzil</Link>
          <span className={s.dot} aria-hidden="true">
            ·
          </span>
          <Link href="/support">Ndihmë / Support</Link>
          <p className={s.disclaimer}>
            This document is provided for the Akademia Tenzil app and is not
            legal advice. The school may adapt it to local requirements.
          </p>
        </>
      }
    >
      <h2>Who the App is for</h2>
      <p>
        The App is used only by a Qur&apos;an school and the students enrolled
        in it. Accounts are{' '}
        <strong>created by the school&apos;s teacher or administrator</strong>,
        and there is no public sign-up. Students receive a username and password
        from their teacher.
      </p>

      <h2>Information we handle</h2>
      <p>
        The App stores only what is needed to run the school. This information
        is entered by the teacher or school, not collected automatically:
      </p>
      <ul>
        <li>
          <strong>Student records:</strong>{' '}name, optional age, a username,
          class (Hifz or Përforcim), and the student&apos;s Qur&apos;an
          memorization position (surah, page, juz).
        </li>
        <li>
          <strong>Academic records:</strong>{' '}attendance, mistakes and notes
          recorded by the teacher, test grades, and teacher messages to the
          student.
        </li>
        <li>
          <strong>Teacher account:</strong>{' '}name, email address, optional bio
          and profile photo.
        </li>
        <li>
          <strong>Authentication data:</strong>{' '}the login credentials needed to
          sign in.
        </li>
        <li>
          <strong>Notification token:</strong>{' '}if notifications are allowed, a
          device token so the school can send lesson reminders.
        </li>
      </ul>
      <p>
        We do <strong>not</strong>{' '}collect location, contacts, advertising
        identifiers, browsing activity, or any data from your device beyond what
        you enter in the App. The App contains{' '}
        <strong>no advertising and no third-party trackers</strong>.
      </p>

      <h2>Children&apos;s data</h2>
      <p>
        Some students are minors. Their information is entered and managed{' '}
        <strong>only by their own teacher or school</strong>, is used{' '}
        <strong>solely</strong>{' '}for the student&apos;s Qur&apos;an education,
        and is{' '}
        <strong>
          never sold, shared for advertising, or disclosed to third parties
        </strong>
        . A student can see only their own records, and a teacher can see only
        their own students.
      </p>

      <h2>How the information is used</h2>
      <p>
        Only to operate the school: tracking memorization progress, attendance,
        grades and mistakes, sending lesson reminders, and letting each student
        see their own progress. We do not use the information for any other
        purpose.
      </p>

      <h2>How it is stored and protected</h2>
      <ul>
        <li>
          Data is stored on <strong>Supabase</strong>{' '}(a hosted PostgreSQL
          database) and transmitted over encrypted HTTPS connections.
        </li>
        <li>
          Access is enforced by database <strong>Row-Level Security</strong>:
          each teacher can reach only their own students&apos; data, and each
          student only their own.
        </li>
        <li>
          On the device, cached data is protected by iOS file protection and
          excluded from device backups. Optional Face ID or Touch ID sign-in
          keeps saved credentials in the device&apos;s secure Keychain.
        </li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We do <strong>not</strong>{' '}sell, rent, or share personal information
        with any third party for marketing or any other purpose. Data is
        processed only by our hosting provider (Supabase) strictly to store and
        serve it for the App, and by Apple&apos;s push notification service
        strictly to deliver notifications.
      </p>

      <h2>Data retention and deletion</h2>
      <p>
        Records are kept for as long as the student is enrolled with the school.
        The teacher or administrator can edit, remove, or archive a
        student&apos;s records at any time from within the App. To have an
        account or its data deleted, contact the school or us at the address
        below and we will remove it.
      </p>

      <h2>Data location</h2>
      <p>Data is hosted in the European Union (Supabase, Frankfurt region).</p>

      <h2>Changes to this policy</h2>
      <p>
        If this policy changes, we will update the date at the top and post the
        revised version at the same link.
      </p>

      <h2>Contact</h2>
      <div className={s.card}>
        <div className={s.cardInner}>
          <p className={s.cardLabel}>
            For any privacy question or a deletion request, contact:
          </p>
          <a
            href="mailto:akademiatenzil@gmail.com"
            className={s.cardMail}
          >
            akademiatenzil@gmail.com
          </a>
        </div>
      </div>
    </LegalShell>
  );
}
