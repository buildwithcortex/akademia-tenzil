import { Eyebrow, JourneyLine } from './ui/Motifs';
import s from './Method.module.css';

const STEPS = [
  {
    title: 'Dëgjim',
    desc: 'Nxënësi dëgjon faqen me vëmendje, derisa tingëllimi i saj bëhet i njohur.',
  },
  {
    title: 'Përkthim dhe kuptim',
    desc: 'Kuptimi i ajeteve e bën memorizimin më të thellë dhe më të qëndrueshëm.',
  },
  {
    title: 'Përsëritje',
    desc: 'Faqja përsëritet me qetësi, pa nxitim, derisa të qëndrojë vetë në kujtesë.',
  },
  {
    title: 'Lexim para mësuesit',
    desc: 'Nxënësi e lexon para mësuesit, i cili korrigjon, dëgjon dhe konfirmon.',
  },
  {
    title: 'Përforcim',
    desc: 'Faqet e fundit forcohen përpara se të vijë mësimi i ri.',
  },
  {
    title: 'Ruajtje afatgjatë',
    desc: 'Përsëritja e madhe rikthen pjesët e përfunduara, që të mbeten të forta.',
  },
];

export function Method() {
  return (
    <section id="metoda" aria-labelledby="metoda-title" className={s.section}>
      <div className={s.grid}>
        {/* Sticky rail: "one pinned desktop sequence", implemented as sticky
            rather than a true GSAP pin: smoother, no layout jump, and it
            degrades to a normal column below 900px for free. */}
        <div data-sticky="1" className={s.rail}>
          <Eyebrow style={{ marginBottom: 'clamp(24px,3vw,36px)' }}>
            Metoda Tenzil
          </Eyebrow>
          <h2 id="metoda-title" data-reveal="1" className={s.title}>
            Përparimi vjen <span className="tz-em">nga vazhdimësia.</span>
          </h2>
          <p data-reveal="1" className={s.lead}>
            Çdo hap ndërtohet mbi hapin e mëparshëm. Nxënësi nuk kalon përpara pa
            e forcuar atë që ka mësuar.
          </p>
          <div data-reveal="1" className={s.counter}>
            <span data-stepcount="1" className={s.count}>
              01
            </span>
            <span className={s.countTotal}>/ 06 hapa</span>
          </div>
        </div>

        <div className={s.listWrap}>
          <JourneyLine style={{ left: 0, top: '0.6em', bottom: '0.6em' }} />

          <ol className={s.list}>
            {STEPS.map((step) => (
              <li key={step.title} data-step="1" className={s.step}>
                <div aria-hidden="true" className={s.node} />
                <div className="tz-mask">
                  <h3 data-stepline="1" className={s.stepTitle}>
                    {step.title}
                  </h3>
                </div>
                <p className={s.stepDesc}>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
