/**
 * Application form rules: the single source of truth, imported by both the
 * client form and the /api/apply route handler so they cannot drift.
 */

export const PROGRAMS = ['Hifz', 'Përforcim', 'Nuk jam i sigurt'] as const;
export type Program = (typeof PROGRAMS)[number];

export type ApplicationInput = {
  emri: string;
  mosha: string;
  email: string;
  telefoni: string;
  programi: string;
  pervoja?: string;
  mesazhi?: string;
};

export type FieldErrors = Partial<
  Record<'emri' | 'mosha' | 'email' | 'telefoni' | 'programi', string>
>;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;

export function validate(data: Partial<ApplicationInput>): FieldErrors {
  const e: FieldErrors = {};
  const emri = (data.emri ?? '').trim();
  const mosha = (data.mosha ?? '').trim();
  const email = (data.email ?? '').trim();
  const telefoni = data.telefoni ?? '';
  const programi = data.programi ?? '';

  if (!emri || emri.length < 3) e.emri = 'Shkruani emrin dhe mbiemrin.';

  const m = parseInt(mosha, 10);
  if (!mosha || Number.isNaN(m) || m < 4 || m > 99) {
    e.mosha = 'Shkruani një moshë të vlefshme.';
  }

  if (!EMAIL_RE.test(email)) e.email = 'Shkruani një email të vlefshëm.';

  if (telefoni.replace(/[^0-9]/g, '').length < 6) {
    e.telefoni = 'Shkruani numrin e telefonit.';
  }

  if (!programi) e.programi = 'Zgjidhni një program.';
  else if (!(PROGRAMS as readonly string[]).includes(programi)) {
    e.programi = 'Zgjidhni një program.';
  }

  return e;
}

/** Field-length ceilings, applied server-side so a public POST can't be abused. */
export const MAX_LEN = {
  emri: 120,
  mosha: 3,
  email: 160,
  telefoni: 40,
  programi: 40,
  pervoja: 2000,
  mesazhi: 4000,
} as const;

export function tooLong(data: Partial<ApplicationInput>): boolean {
  return (Object.keys(MAX_LEN) as Array<keyof typeof MAX_LEN>).some((k) => {
    const v = data[k];
    return typeof v === 'string' && v.length > MAX_LEN[k];
  });
}
