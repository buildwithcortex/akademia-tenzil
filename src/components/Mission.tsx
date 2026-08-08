import { Eyebrow } from './ui/Motifs';
import s from './Mission.module.css';

export function Mission() {
  return (
    <section id="misioni" aria-labelledby="misioni-title" className={s.section}>
      <div className="tz-wrap">
        <Eyebrow style={{ marginBottom: 'clamp(28px,4vw,48px)' }}>
          Misioni ynë
        </Eyebrow>

        <div className={s.grid}>
          <h2 id="misioni-title" data-reveal="1" className={s.title}>
            Të ndërtojmë një lidhje{' '}
            <span className="tz-em">të qëndrueshme</span> me Kuranin.
          </h2>

          <div className={s.col}>
            <p data-reveal="1" className={s.body}>
              Qëllimi ynë nuk është vetëm memorizimi i faqeve, por ruajtja e tyre
              në zemër dhe në kujtesë përmes disiplinës, përsëritjes dhe
              udhëzimit të vazhdueshëm.
            </p>

            {/*
              The only Arabic on the site, and a real supplied verse.
              Never generate, extend or restyle Qur'anic text elsewhere.
            */}
            <div data-reveal="1" className={s.card}>
              <div className={s.cardInner}>
                <p dir="rtl" lang="ar" className={s.verse}>
                  وَإِنَّهُۥ لَتَنزِيلُ رَبِّ ٱلۡعَٰلَمِينَ
                </p>
                <p className={s.translation}>
                  “E vërtetë se ky (Kurani) është shpallje (zbritje) e Zotit të
                  botërave.”
                </p>
                <p className={s.source}>Surja Esh-Shuara, 26:192</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
