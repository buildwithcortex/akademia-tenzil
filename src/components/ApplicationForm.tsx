'use client';

import { useId, useRef, useState } from 'react';
import { PROGRAMS, validate, type FieldErrors } from '@/lib/validation';
import { ArrowCircle, Diamonds } from './ui/Motifs';
import s from './ApplicationForm.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY = {
  emri: '',
  mosha: '',
  email: '',
  telefoni: '',
  programi: '',
  pervoja: '',
  mesazhi: '',
};

const MSG_NO_ENDPOINT =
  'Dërgimi nuk është i lidhur me serverin ende, ndaj aplikimi nuk u dërgua. Lidhni formularin me backend-in ose kontaktoni akademinë drejtpërdrejt.';
const MSG_FAILED = 'Dërgimi nuk u realizua. Provoni përsëri pas një momenti.';

export function ApplicationForm() {
  const [f, setF] = useState(EMPTY);
  const [err, setErr] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [failMsg, setFailMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  const set = (k: keyof typeof EMPTY) => (value: string) => {
    setF((prev) => ({ ...prev, [k]: value }));
    setErr((prev) => ({ ...prev, [k]: '' }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = validate(f);
    if (Object.keys(errors).length) {
      setErr(errors);
      setStatus('idle');
      setFailMsg('');
      // Focus the first invalid control after React paints the aria state.
      // The program group is a button set, which can't carry aria-invalid, so
      // it falls back to focusing the first pill.
      requestAnimationFrame(() => {
        const form = formRef.current;
        const firstInvalid =
          form?.querySelector<HTMLElement>('[aria-invalid="true"]') ??
          (errors.programi
            ? form?.querySelector<HTMLElement>('fieldset button')
            : null);
        firstInvalid?.focus();
      });
      return;
    }

    setErr({});
    setStatus('sending');
    setFailMsg('');

    const website = (
      formRef.current?.elements.namedItem('website') as HTMLInputElement | null
    )?.value;

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...f,
          website,
          source: 'akademiatenzil.web',
          ts: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body?.errors) {
          setErr(body.errors as FieldErrors);
          setStatus('idle');
          return;
        }
        // No delivery target configured. Never fake a success.
        throw new Error(body?.error === 'NO_ENDPOINT' ? 'NO_ENDPOINT' : 'HTTP');
      }

      setStatus('sent');
    } catch (ex) {
      setStatus('error');
      setFailMsg(
        ex instanceof Error && ex.message === 'NO_ENDPOINT'
          ? MSG_NO_ENDPOINT
          : MSG_FAILED,
      );
    }
  }

  if (status === 'sent') {
    return (
      <div data-reveal="1" className={s.panel}>
        <div role="status" className={s.success}>
          <Diamonds size={9} />
          <h3 className={s.successTitle}>Aplikimi juaj u pranua.</h3>
          <p className={s.successBody}>
            Akademia Tenzil do t’ju kontaktojë pas shqyrtimit.
          </p>
        </div>
      </div>
    );
  }

  const sending = status === 'sending';

  return (
    <div data-reveal="1" className={s.panel}>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        noValidate
        aria-label="Formulari i aplikimit"
        className={s.form}
      >
        <p className={s.formLabel}>Formulari i aplikimit</p>

        <div className={s.pair}>
          <Field
            id={`${uid}-emri`}
            label="Emri dhe mbiemri *"
            name="emri"
            autoComplete="name"
            value={f.emri}
            onChange={set('emri')}
            error={err.emri}
          />
          <Field
            id={`${uid}-mosha`}
            label="Mosha *"
            name="mosha"
            inputMode="numeric"
            value={f.mosha}
            onChange={set('mosha')}
            error={err.mosha}
          />
          <Field
            id={`${uid}-email`}
            label="Email *"
            name="email"
            type="email"
            autoComplete="email"
            value={f.email}
            onChange={set('email')}
            error={err.email}
          />
          <Field
            id={`${uid}-telefoni`}
            label="Numri i telefonit *"
            name="telefoni"
            type="tel"
            autoComplete="tel"
            value={f.telefoni}
            onChange={set('telefoni')}
            error={err.telefoni}
          />
        </div>

        <fieldset className={s.fieldset}>
          <legend className={s.legend}>Programi *</legend>
          <div className={s.pills}>
            {PROGRAMS.map((p) => (
              <button
                key={p}
                type="button"
                className={s.pill}
                aria-pressed={f.programi === p}
                onClick={() => set('programi')(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <span className={s.error}>{err.programi ?? ''}</span>
        </fieldset>

        <label className={s.field}>
          <span className={s.label}>Përvoja e mëparshme me memorizimin</span>
          <textarea
            name="pervoja"
            rows={2}
            className={s.textarea}
            placeholder="Sa faqe ose xhuze keni memorizuar më parë?"
            value={f.pervoja}
            onChange={(e) => set('pervoja')(e.target.value)}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>Mesazhi</span>
          <textarea
            name="mesazhi"
            rows={3}
            className={s.textarea}
            value={f.mesazhi}
            onChange={(e) => set('mesazhi')(e.target.value)}
          />
        </label>

        <div className={s.honeypot} aria-hidden="true">
          <label htmlFor={`${uid}-website`}>Mos e plotësoni këtë fushë</label>
          <input
            id={`${uid}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        {status === 'error' && (
          <p role="alert" className={s.banner}>
            {failMsg}
          </p>
        )}

        <button
          data-magnetic="1"
          type="submit"
          disabled={sending}
          className={s.submit}
        >
          {sending ? 'Duke dërguar…' : 'Dërgo aplikimin'}
          <ArrowCircle />
        </button>

        <p className={s.consent}>
          Të dhënat përdoren vetëm për shqyrtimin e aplikimit tuaj nga Akademia
          Tenzil.
        </p>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  inputMode,
  autoComplete,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  inputMode?: 'numeric';
  autoComplete?: string;
}) {
  return (
    <div className={s.field}>
      <label className={s.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={s.input}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      <span id={`${id}-err`} className={s.error}>
        {error ?? ''}
      </span>
    </div>
  );
}
