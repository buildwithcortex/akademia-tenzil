import Image from 'next/image';
import { ArrowCircle, Eyebrow } from './ui/Motifs';
import s from './Hero.module.css';

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className={s.section}>
      <div aria-hidden="true" data-parallax="0.05" className={s.blob} />

      <div className={s.grid}>
        <div>
          <Eyebrow style={{ marginBottom: 'clamp(20px,3vw,34px)', maxWidth: '34ch' }}>
            Akademia e memorizimit dhe përforcimit të Kuranit
          </Eyebrow>

          <h1 id="hero-title" className={s.title}>
            <span className={s.titleMask}>
              <span data-hero-line="1">Një rrugëtim me Kuranin,</span>
            </span>
            <span className={s.titleMask}>
              <span data-hero-line="1" style={{ color: 'var(--emerald)' }}>
                i ndërtuar për të qëndruar.
              </span>
            </span>
          </h1>

          <p data-reveal="1" className={s.lead}>
            Akademia Tenzil i udhëheq nxënësit në memorizimin, përforcimin dhe
            përsosjen e Kuranit përmes një programi të strukturuar, përsëritjes
            së vazhdueshme dhe kujdesit të mësuesit.
          </p>

          <div data-reveal="1" className={s.ctas}>
            <a data-magnetic="1" href="#apliko" className={s.primary}>
              Apliko për t’u bërë pjesë e akademisë
              <ArrowCircle />
            </a>
            <a data-magnetic="1" href="#programi" className={s.ghost}>
              Zbulo programin
            </a>
          </div>
        </div>

        <div className={s.archWrap}>
          <div
            style={{
              position: 'relative',
              width: 'min(100%, 560px)',
              aspectRatio: '600 / 800',
            }}
          >
            <svg
              viewBox="0 0 600 800"
              role="img"
              aria-label="Formë abstrakte e frymëzuar nga harku i logos së Akademisë Tenzil"
              className={s.arch}
            >
              <g fill="none" stroke="#1E5A4B" strokeWidth="1.1" opacity=".55">
                <path
                  data-draw="1"
                  d="M96 760V420C96 300 142 224 300 34c158 190 204 266 204 386v340"
                />
              </g>
              <g fill="none" stroke="#B08A4C" strokeWidth="1" opacity=".85">
                <path
                  data-draw="1"
                  d="M162 760V438C162 342 200 280 300 148c100 132 138 194 138 290v322"
                />
              </g>
              <g fill="none" stroke="rgba(30,90,75,.28)" strokeWidth="1">
                <path
                  data-draw="1"
                  d="M228 760V456C228 386 254 338 300 264c46 74 72 122 72 192v304"
                />
              </g>
              <g fill="none" stroke="#B08A4C" strokeWidth="1.1" opacity=".7">
                <path
                  data-draw="1"
                  d="M8 636c150 22 232 66 292 132 60-66 142-110 292-132"
                />
                <path
                  data-draw="1"
                  d="M28 690c136 18 214 58 272 118 58-60 136-100 272-118"
                />
              </g>

              {/* 16-point star: four nested rects at 0/22.5/45/67.5° */}
              <g data-star="1" opacity=".07" fill="#1E5A4B" transform="translate(300 430)">
                <rect x="-92" y="-92" width="184" height="184" />
                <rect x="-92" y="-92" width="184" height="184" transform="rotate(22.5)" />
                <rect x="-92" y="-92" width="184" height="184" transform="rotate(45)" />
                <rect x="-92" y="-92" width="184" height="184" transform="rotate(67.5)" />
              </g>

              <g data-diamonds="1" fill="#B08A4C">
                <rect x="292" y="536" width="16" height="16" transform="rotate(45 300 544)" />
                <rect x="292" y="574" width="16" height="16" transform="rotate(45 300 582)" />
                <rect x="292" y="612" width="16" height="16" transform="rotate(45 300 620)" />
              </g>

              <path
                data-journeyline="1"
                d="M300 660V800"
                stroke="#B08A4C"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>

            {/* Logo sits where the SVG's <image> did: x 222/600, y 336/800, w 156/600 */}
            <Image
              src="/logo-dark.png"
              alt=""
              width={512}
              height={512}
              priority
              style={{
                position: 'absolute',
                left: '37%',
                top: '42%',
                width: '26%',
                height: 'auto',
              }}
            />
          </div>
        </div>
      </div>

      <p data-reveal="1" className={s.caption}>
        Memorizim · Përforcim · Përsosje
      </p>
    </section>
  );
}
