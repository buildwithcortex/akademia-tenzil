'use client';

import { useId, useRef, useState } from 'react';
import { EMAIL_RE } from '@/lib/validation';
import { ArrowCircle, Diamonds } from './ui/Motifs';
import s from './ApplicationForm.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const MSG_FAILED =
  'Regjistrimi nuk u realizua. Provoni përsëri pas një momenti.';
const MSG_RATE_LIMITED =
  'Shumë përpjekje nga kjo lidhje. Provoni përsëri pas një ore.';
const MSG_OPEN = 'Aplikimet janë hapur. Rifreskoni faqen për të aplikuar.';
const MSG_EMAIL = 'Shkruani një email të vlefshëm.';

/**
 * Shown in place of the application form while applications are closed: one
 * email field, for the people who want to hear when they reopen.
 *
 * It wears the application form's stylesheet on purpose. The two occupy the
 * same panel and should be indistinguishable as objects.
 */
export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [failMsg, setFailMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!EMAIL_RE.test(email.trim())) {
      setError(MSG_EMAIL);
      setStatus('idle');
      setFailMsg('');
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }

    setError('');
    setStatus('sending');
    setFailMsg('');

    const website = (
      formRef.current?.elements.namedItem('website') as HTMLInputElement | null
    )?.value;

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body?.errors?.email) {
          setError(body.errors.email as string);
          setStatus('idle');
          return;
        }
        setStatus('error');
        setFailMsg(
          body?.error === 'RATE_LIMITED'
            ? MSG_RATE_LIMITED
            : body?.error === 'OPEN'
              ? MSG_OPEN
              : MSG_FAILED,
        );
        return;
      }

      setStatus('sent');
    } catch {
      setStatus('error');
      setFailMsg(MSG_FAILED);
    }
  }

  if (status === 'sent') {
    return (
      <div data-reveal="1" className={s.panel}>
        <div role="status" className={s.success}>
          <Diamonds size={9} />
          <h3 className={s.successTitle}>U regjistruat në listë.</h3>
          <p className={s.successBody}>
            Do t’ju njoftojmë me email sapo të hapen aplikimet.
          </p>
        </div>
      </div>
    );
  }

  const sending = status === 'sending';
  const id = `${uid}-email`;

  return (
    <div data-reveal="1" className={s.panel}>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        noValidate
        aria-label="Lista e njoftimeve"
        className={s.form}
      >
        <p className={s.formLabel}>Njoftohuni kur të hapen aplikimet</p>

        <div className={s.field}>
          <label className={s.label} htmlFor={id}>
            Email *
          </label>
          <input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            className={s.input}
            value={email}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
          />
          <span id={`${id}-err`} className={s.error}>
            {error}
          </span>
        </div>

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
          {sending ? 'Duke dërguar…' : 'Më njoftoni'}
          <ArrowCircle />
        </button>

        <p className={s.consent}>
          Email-i përdoret vetëm për t’ju njoftuar kur të hapen aplikimet. Mund
          të çregjistroheni në çdo kohë.
        </p>
      </form>
    </div>
  );
}
