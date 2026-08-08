import { ArchWatermark, Diamonds, Eyebrow } from './ui/Motifs';
import s from './Programs.module.css';

export function Programs() {
  return (
    // Owns the #programi anchor: the Journey section that used to carry it was
    // removed, and nav, footer and the hero CTA all point here now.
    <section id="programi" aria-labelledby="programet-title" className={s.section}>
      <div className="tz-wrap">
        <div className={s.head}>
          <div>
            <Eyebrow style={{ marginBottom: 'clamp(24px,3vw,40px)' }}>
              Programet tona
            </Eyebrow>
            <h2 id="programet-title" data-reveal="1" className={s.title}>
              Një metodë e qartë <span className="tz-em">për çdo fazë.</span>
            </h2>
          </div>
          <p data-reveal="1" className={s.intro}>
            Akademia Tenzil është vendi ku dashuria për Kuranin shndërrohet në
            përkushtim, mësim dhe vazhdimësi. Përmes programeve tona, synojmë
            t’i ndihmojmë nxënësit të ndërtojnë një lidhje të fortë me Kuranin.
          </p>
        </div>

        <div className={s.panels}>
          {/* 01. Hifz */}
          <article data-panel="1" className={`${s.panel} ${s.panelHifz}`}>
            <ArchWatermark
              stroke="#B08A4C"
              style={{
                position: 'absolute',
                right: '-14%',
                top: '-8%',
                width: '70%',
                height: 'auto',
                opacity: 0.16,
              }}
            />
            <p className={s.panelEyebrow} style={{ color: 'rgba(176,138,76,.95)' }}>
              01 — Program
            </p>
            <div className={s.panelBody}>
              <h3 className={s.name}>Hifz</h3>
              <p className={s.sub} style={{ color: 'rgba(244,240,230,.62)' }}>
                Memorizimi i Kuranit
              </p>
              <Diamonds
                filled={1}
                style={{ marginBottom: 'clamp(20px,3vw,28px)' }}
              />
              <p className={s.copy} style={{ color: 'rgba(244,240,230,.86)' }}>
                Program për ata që dëshirojnë ta mësojnë dhe ta mbajnë Kuranin në
                zemrat e tyre, përmes një plani të organizuar dhe përsëritjes së
                vazhdueshme.
              </p>
            </div>
          </article>

          {/* 02. Itkan */}
          <article data-panel="1" className={`${s.panel} ${s.panelItkan}`}>
            <ArchWatermark
              stroke="rgba(30,90,75,.2)"
              style={{
                position: 'absolute',
                left: '-18%',
                bottom: '-10%',
                width: '76%',
                height: 'auto',
                opacity: 0.5,
              }}
            />
            <p className={s.panelEyebrow} style={{ color: 'var(--gold-dark)' }}>
              02 — Program
            </p>
            <div className={s.panelBody}>
              <h3 className={s.nameItkan}>Itkan</h3>
              <p className={s.sub} style={{ color: 'var(--muted)' }}>
                Përforcimi i Kuranit
              </p>
              <Diamonds
                filled={2}
                style={{ marginBottom: 'clamp(20px,3vw,28px)' }}
              />
              <p className={s.copy} style={{ color: 'var(--body)' }}>
                Për hafizët që kanë përfunduar memorizimin dhe dëshirojnë ta
                ruajnë, ta forcojnë dhe ta mbajnë të gjallë lidhjen e tyre me
                Kuranin.
              </p>
            </div>
          </article>

          {/* 03. Në të ardhmen */}
          <article data-panel="1" className={`${s.panel} ${s.panelSoon}`}>
            <ArchWatermark
              stroke="rgba(30,90,75,.22)"
              style={{
                position: 'absolute',
                right: '-12%',
                bottom: '-12%',
                width: '66%',
                height: 'auto',
                opacity: 0.45,
              }}
            />
            <div className={s.panelEyebrowRow}>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: '.24em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-dark)',
                }}
              >
                03 — Në të ardhmen
              </p>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: '.24em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                }}
              >
                Së shpejti
              </span>
            </div>
            <div className={s.panelBodySoon}>
              <h3 className={s.nameSoon}>Shkenca të tjera të Kuranit</h3>
              <p className={s.sub} style={{ color: 'var(--muted)' }}>
                Texhvid · Kiraete · Tefsir
              </p>
              <Diamonds
                filled={0}
                style={{ marginBottom: 'clamp(20px,3vw,28px)' }}
              />
              <p className={s.copy} style={{ color: 'var(--body)' }}>
                Me lejen e Allahut, Akademia Tenzil do të zgjerohet edhe me fusha
                të tjera të shkencave të Kuranit, si Texhvidi, Kiraetet, Tefsiri
                dhe shumë degë të tjera që lidhen me Librin e Allahut.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
