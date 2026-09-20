import Image from 'next/image';
import { getPayloadClient } from '@/lib/payload';
import { readApplicationState } from '@/lib/applicationState';
import { ApplicationForm } from './ApplicationForm';
import { WaitlistForm } from './WaitlistForm';
import { Diamonds, Eyebrow } from './ui/Motifs';
import s from './Apply.module.css';

/**
 * The closing section. Open, it carries the application form; closed, the same
 * panel becomes the waitlist and the paragraph says so. Which one is decided by
 * the "Hapja e aplikimeve" switch in the admin.
 */
export async function Apply() {
  const { open, closedMessage } = await readApplicationState(
    await getPayloadClient(),
  );

  return (
    <section id="apliko" aria-labelledby="apliko-title" className={s.section}>
      <svg
        aria-hidden="true"
        data-parallax="0.04"
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

      <div className="tz-wrap" style={{ position: 'relative' }}>
        <div className={s.grid}>
          <div>
            <Eyebrow gold style={{ marginBottom: 'clamp(24px,3vw,40px)' }}>
              Bëhu pjesë e akademisë
            </Eyebrow>
            <h2 id="apliko-title" data-reveal="1" className={s.title}>
              Filloni një rrugëtim{' '}
              <span className="tz-em-gold">që ndërtohet për të qëndruar.</span>
            </h2>
            <p data-reveal="1" className={s.body}>
              {open
                ? 'Nëse dëshironi të ndiqni një program të strukturuar të memorizimit dhe përforcimit të Kuranit, aplikoni për t’u bërë pjesë e Akademisë Tenzil.'
                : closedMessage}
            </p>
            <div data-reveal="1" className={s.mark}>
              <Image
                src="/logo-white.png"
                alt=""
                width={54}
                height={54}
                loading="lazy"
                style={{ width: 54, height: 54 }}
              />
              <Diamonds />
            </div>
          </div>

          {open ? <ApplicationForm /> : <WaitlistForm />}
        </div>
      </div>
    </section>
  );
}
