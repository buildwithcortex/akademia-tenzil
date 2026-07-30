import { Eyebrow } from './ui/Motifs';
import s from './Message.module.css';

export function Message() {
  return (
    <section aria-labelledby="mesazhi-title" className={s.section}>
      <svg
        aria-hidden="true"
        data-parallax="0.05"
        viewBox="0 0 600 500"
        className={s.arch}
        fill="none"
        stroke="rgba(176,138,76,.32)"
        strokeWidth="1.1"
      >
        <path d="M60 500V240C60 166 104 114 300 -80c196 194 240 246 240 320v260" />
        <path d="M140 500V266C140 202 176 158 300 22c124 136 160 180 160 244v234" />
      </svg>

      <div className={s.grid}>
        <div>
          <Eyebrow gold style={{ marginBottom: 'clamp(26px,3vw,44px)' }}>
            Mesazhi ynë
          </Eyebrow>
          <blockquote id="mesazhi-title" data-reveal="1" className={s.quote}>
            “Le ta bëjmë Kuranin ibadet,{' '}
            <span className="tz-em-gold">jo vetëm adet.”</span>
          </blockquote>
        </div>
        <p data-reveal="1" className={s.body}>
          Kurani nuk është vetëm për t’u lexuar me gjuhë, por për t’u përjetuar
          me zemër. Kur lidhemi me të me sinqeritet, e kuptojmë dhe përpiqemi ta
          zbatojmë, ai bëhet dritë në jetën tonë, qetësi në zemrat tona dhe rrugë
          që na afron më shumë me Allahun.
        </p>
      </div>
    </section>
  );
}
