import { Diamonds, Eyebrow } from './ui/Motifs';
import s from './About.module.css';

export function About() {
  return (
    <section aria-labelledby="rreth-title" className={s.section}>
      <div className="tz-wrap">
        <Eyebrow style={{ marginBottom: 'clamp(28px,4vw,52px)' }}>
          Rreth Akademisë Tenzil
        </Eyebrow>

        <div className={s.grid}>
          <figure>
            <blockquote id="rreth-title" data-reveal="1" className={s.quote}>
              “Të jetojmë çdo frymëmarrje me Kuranin, ëndrra e çdo besimtari.”
            </blockquote>

            <Diamonds style={{ marginTop: 'clamp(20px,3vw,32px)' }} />

            <div className={s.statement}>
              <div className="tz-mask">
                <h3 data-valword="1" className={s.statementTitle}>
                  Në Akademinë Tenzil nuk mësojmë vetëm ta lexojmë Kuranin;{' '}
                  <span className="tz-em">mësojmë të jetojmë me të.</span>
                </h3>
              </div>
              <p className={s.statementBody}>
                Sepse besojmë se Kurani nuk është vetëm për t’u recituar, por për
                të ndriçuar zemrat, për të udhëhequr mendjen dhe për të qenë
                shoqëruesi ynë në çdo etapë të jetës.
              </p>
            </div>
          </figure>

          <div data-reveal="1" className={s.prose}>
            <p className={s.leadPara}>
              <span aria-hidden="true" className={s.dropcap}>
                Ç
              </span>
              do besimtar ëndërron ta ketë Kuranin pranë vetes, ta lexojë, ta
              mësojë, ta kuptojë dhe të jetojë sipas tij. Pikërisht kjo ëndërr
              është bërë themeli i Akademisë Tenzil.
            </p>
            <p className={s.para}>
              Ne besojmë se mësimi i Kuranit nuk është vetëm një proces i
              memorizimit të ajeteve, por një rrugëtim që e afron njeriun me
              Allahun dhe e zbukuron jetën e tij me fjalën e Tij.
            </p>
            <p className={s.para}>
              Si fillim kemi hapur dy programe: klasën e memorizimit{' '}
              <span className={s.propn}>(Hifz)</span> dhe klasën e përforcimit{' '}
              <span className={s.propn}>(Itkan)</span> për hafizët që dëshirojnë
              ta ruajnë dhe ta përsërisin vazhdimisht Kuranin.
            </p>
            <p className={s.para}>
              Ky është vetëm fillimi. Me lejen e Allahut, Akademia Tenzil do të
              zgjerohet me programe të tjera, si Texhvidi, Kiraetet, Tefsiri dhe
              shkenca të tjera të Kuranit, me dëshirën që të bëhet një vend ku
              çdo dashamirës i Kuranit gjen dijen dhe dritën e Kuranit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
