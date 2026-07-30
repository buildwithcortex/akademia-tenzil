import Image from 'next/image';
import { Eyebrow } from './ui/Motifs';
import s from './Guidance.module.css';

/**
 * The internal app is never presented as a public product:
 * no App Store badge, no download CTA, no signup link.
 */
export function Guidance() {
  return (
    <section aria-labelledby="udhezim-title" className={s.section}>
      <div className={s.grid}>
        <div>
          <Eyebrow style={{ marginBottom: 'clamp(24px,3vw,40px)' }}>
            Udhëzim i vazhdueshëm
          </Eyebrow>
          <h2 id="udhezim-title" data-reveal="1" className={s.title}>
            Mësuesi udhëheq.{' '}
            <span className="tz-em">Nxënësi ecën përpara.</span>
          </h2>
          <p data-reveal="1" className={s.body}>
            Mësuesi ndjek pozicionin, përsëritjen dhe përparimin e çdo nxënësi.
            Nxënësi e di qartë çfarë duhet të mësojë, çfarë duhet të përsërisë
            dhe ku duhet të vazhdojë.
          </p>
        </div>

        <aside data-reveal="1" className={s.card}>
          <div data-parallax="0.03" className={s.phone}>
            <div aria-hidden="true" className={s.phoneShadow} />
            <Image
              src="/app-mockup.png"
              alt="Aplikacioni i brendshëm i Akademisë Tenzil i shfaqur në telefon"
              width={780}
              height={1398}
              loading="lazy"
              sizes="(max-width: 900px) 60vw, 286px"
              className={s.phoneImg}
            />
          </div>

          <div className={s.aside}>
            <div className={s.appHead}>
              <Image
                src="/app-icon.png"
                alt=""
                width={42}
                height={42}
                loading="lazy"
                className={s.appIcon}
              />
              <div>
                <p className={s.appName}>Aplikacioni i brendshëm</p>
                <p className={s.appScope}>Vetëm për nxënësit e pranuar</p>
              </div>
            </div>
            <p className={s.appCopy}>
              Nxënësit e pranuar marrin akses në aplikacionin e brendshëm të
              akademisë, ku ndjekin pozicionin, përsëritjen dhe përparimin e tyre
              bashkë me mësuesin.
            </p>
            <p className={s.appNote}>
              Llogaritë në aplikacion krijohen vetëm nga Akademia Tenzil për
              mësuesit dhe nxënësit e pranuar. Nuk ka regjistrim publik në
              aplikacion.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
