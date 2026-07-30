import { Eyebrow, JourneyLine } from './ui/Motifs';
import s from './Journey.module.css';

const STAGES = [
  {
    num: '01',
    title: 'Mëson faqen e re',
    desc: 'Nxënësi dëgjon, kupton dhe përsërit faqen derisa ta memorizojë me siguri.',
  },
  {
    num: '02',
    title: 'Përforcon mësimin',
    desc: 'Faqet e fundit përsëriten përpara se nxënësi të kalojë te mësimi i ri.',
  },
  {
    num: '03',
    title: 'Përsërit vazhdimisht',
    desc: 'Përsëritja e vogël e forcon pjesën që nxënësi po memorizon aktualisht.',
  },
  {
    num: '04',
    title: 'E ruan për një kohë të gjatë',
    desc: 'Përsëritja e madhe rikthen rregullisht pjesët e përfunduara që të mbeten të forta në kujtesë.',
  },
];

/** The nav's #programi anchor lives here. */
export function Journey() {
  return (
    <section id="programi" aria-labelledby="rrugetimi-title" className={s.section}>
      <div className="tz-wrap">
        <Eyebrow style={{ marginBottom: 'clamp(24px,3vw,40px)' }}>
          Rrugëtimi i nxënësit
        </Eyebrow>

        <h2 id="rrugetimi-title" data-reveal="1" className={s.title}>
          Nga faqja e re, <span className="tz-em">te ruajtja afatgjatë.</span>
        </h2>

        <div className={s.rail}>
          <JourneyLine
            style={{
              left: 'clamp(0px,3vw,56px)',
              top: '6px',
              bottom: '6px',
            }}
          />

          {STAGES.map((stage) => (
            <article key={stage.num} data-reveal="1" className={s.stage}>
              <div aria-hidden="true" className={s.node} />
              <div className={s.head}>
                <span className={s.num}>{stage.num}</span>
                <h3 className={s.stageTitle}>{stage.title}</h3>
              </div>
              <p className={s.desc}>{stage.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
