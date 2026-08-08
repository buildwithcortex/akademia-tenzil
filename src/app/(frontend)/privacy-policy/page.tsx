import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalShell } from '@/components/LegalShell';
import s from '@/components/LegalPage.module.css';

/**
 * The iOS app's Privacy Policy URL in App Store Connect points at this exact
 * path. The path must not change.
 *
 * The App sections are carried over verbatim from the previous static page and
 * must stay that way: they are what the App Store listing points at. The Site
 * sections were added when the website itself began collecting applications.
 * Bump the "Last updated" date whenever either half is revised.
 */
export const metadata: Metadata = {
  title: 'Politika e privatësisë · Akademia Tenzil',
  description:
    'Si i trajton Akademia Tenzil të dhënat personale në aplikacionin e brendshëm dhe në faqen akademiatenzil.com.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy · Akademia Tenzil',
    description:
      'How Akademia Tenzil handles personal information in its private school-management app and on akademiatenzil.com.',
    url: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalShell
      eyebrow="Akademia Tenzil"
      title="Privacy Policy"
      meta="Last updated: 8 August 2026"
      lang="en"
      intro={
        <>
          Akademia Tenzil (&quot;we&quot;, &quot;us&quot;) runs a private
          Qur&apos;an-school management app used by a school&apos;s teachers and
          their students, and the website at akademiatenzil.com. This policy
          explains what information each of them handles, why, and how it is
          protected. We have tried to keep it short and plain.
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
      <h2>What this policy covers</h2>
      <p>
        This policy covers two separate things. The{' '}
        <strong>Akademia Tenzil app</strong>{' '}(&quot;the App&quot;) is the
        private iOS app used by the school&apos;s teachers and their students.
        The <strong>akademiatenzil.com website</strong>{' '}(&quot;the
        Site&quot;) is the public website, which presents the academy,
        publishes articles, and carries an application form. The App is
        described first. The sections about the Site follow, and each of them
        says so in its heading.
      </p>

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

      <h2>The Site: what it collects</h2>
      <p>
        Reading the Site collects nothing about you. There are no visitor
        accounts, no comments, and no tracking. The only personal information
        the Site receives is what you choose to type into the application form.
        When you send one, we receive:
      </p>
      <ul>
        <li>
          <strong>Contact details:</strong>{' '}your full name, email address and
          phone number.
        </li>
        <li>
          <strong>Application details:</strong>{' '}your age, the programme you
          are applying for, any previous experience you describe, and your
          message.
        </li>
      </ul>
      <p>
        Nothing is added beyond that. Your <strong>IP address</strong>{' '}is read
        from the request and held in the server&apos;s memory for up to one
        hour, purely to stop the form being flooded. It is never written to the
        database and never attached to your application. Our hosting provider
        also keeps ordinary server logs for security and reliability, as any
        website does.
      </p>

      <h2>The Site: children and parental consent</h2>
      <p>
        The academy teaches children, so an application will often be about a
        child; the form accepts an age as young as four. If the applicant is{' '}
        <strong>under 18</strong>, the form should be filled in by a parent or
        legal guardian, or with their knowledge and permission.
      </p>
      <p>
        We ask for nothing about a child beyond the fields listed above. We do
        not profile children, and we use their details only to answer the
        application and, if they enrol, to register them with the school. A
        parent or guardian can ask us at any time to show, correct or delete
        what we hold, at the contact address at the end of this policy.
      </p>

      <h2>The Site: how applications are used and shared</h2>
      <p>
        An application is used to reply to you about it and to arrange
        enrolment. It is not used for marketing, and we send no newsletters.
        Applications are stored in the academy&apos;s own database and read by
        academy staff in a password-protected admin area, where a status and
        internal notes are added as the application is handled. They are{' '}
        <strong>never sold, rented, or shared for advertising</strong>.
      </p>
      <p>
        Beyond the providers that run the Site, applications are not shared with
        anyone. Those providers are:
      </p>
      <ul>
        <li>
          <strong>Vercel:</strong>{' '}hosts the Site and serves its pages.
        </li>
        <li>
          <strong>Supabase:</strong>{' '}stores applications, articles and
          uploaded images.
        </li>
        <li>
          <strong>Resend:</strong>{' '}delivers the email telling the academy that
          an application has arrived.
        </li>
      </ul>
      <p>
        There is <strong>no advertising network, analytics service or social
        media tracker</strong>{' '}on the Site. Fonts are served from our own
        domain, so reading a page makes no request to a third party.
      </p>

      <h2>The Site: cookies</h2>
      <p>
        The Site sets no analytics or advertising cookies, which is why it shows
        no cookie banner. Only two strictly necessary cookies exist:
      </p>
      <ul>
        <li>
          <strong>Access cookie:</strong>{' '}while the Site is being built it
          sits behind a password, and entering it stores a cookie so you are not
          asked again. The cookie holds a signed token, never the password
          itself, and it goes away once the Site opens to the public.
        </li>
        <li>
          <strong>Admin session cookie:</strong>{' '}set only for academy staff
          who sign in to the admin area, to keep them signed in.
        </li>
      </ul>

      <h2>The Site: where data is stored and for how long</h2>
      <p>
        Applications and uploaded images are stored by{' '}
        <strong>Supabase</strong>{' '}in its London region, in the United
        Kingdom, and travel over encrypted HTTPS connections. The database is
        reachable only with the academy&apos;s own credentials, and the admin
        area is limited to accounts the academy creates by hand: there is{' '}
        <strong>no public sign-up</strong>.
      </p>
      <p>
        We keep an application while it is being considered. If it leads to
        enrolment, the details become part of the student&apos;s school record
        and are then covered by the App sections above. If it does not, we
        delete it within <strong>12 months</strong>. You can ask us to delete it
        sooner at any time.
      </p>

      <h2>The Site: your rights</h2>
      <p>
        You can ask us to show you what we hold about you, to correct it, or to
        delete it, and you can withdraw an application whenever you like. Write
        to the address at the end of this policy and we will act on it. Sending
        an application is entirely voluntary, and the only consequence of not
        sending one is that we cannot contact you about enrolling.
      </p>

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
