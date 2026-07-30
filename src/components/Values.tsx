import s from './Values.module.css';

const VALUES = [
  {
    word: 'Disiplinë',
    color: 'var(--ink)',
    statement: 'Sepse përparimi ndërtohet çdo ditë.',
  },
  {
    word: 'Vazhdimësi',
    color: 'var(--emerald)',
    statement: 'Sepse ajo që përsëritet, ruhet.',
  },
  {
    word: 'Kujdes',
    color: 'var(--gold-dark)',
    statement: 'Sepse çdo nxënës ka ritmin dhe rrugëtimin e vet.',
  },
];

export function Values() {
  return (
    <section aria-label="Vlerat e akademisë" className={s.section}>
      <div aria-hidden="true" data-parallax="0.06" className={s.blob} />
      <div className={s.wrap}>
        {VALUES.map((v) => (
          <div key={v.word} className={s.row}>
            <div className="tz-mask">
              <h3
                data-valword="1"
                className={s.word}
                style={{ color: v.color }}
              >
                {v.word}
              </h3>
            </div>
            <p className={s.statement}>{v.statement}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
