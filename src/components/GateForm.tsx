'use client';

import { useState } from 'react';
import { ArrowCircle } from './ui/Motifs';
import s from './Gate.module.css';

/**
 * Password form for the work-in-progress gate.
 *
 * On success it reloads the page the visitor originally asked for, rather than
 * always dropping them on the homepage: the proxy rewrites in place and passes
 * the wanted path through `next`.
 */
export function GateForm({ next }: { next: string }) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password) return;

    setStatus('sending');
    setMessage('');

    try {
      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Full navigation, not a router push: the cookie has to be sent with a
        // fresh request for the proxy to let it through.
        window.location.href = next || '/';
        return;
      }

      const body = await res.json().catch(() => ({}));
      setStatus('error');
      setMessage(
        body?.error === 'RATE_LIMITED'
          ? 'Shumë përpjekje. Provoni përsëri pas pak.'
          : 'Fjalëkalimi nuk është i saktë.',
      );
    } catch {
      setStatus('error');
      setMessage('Diçka shkoi keq. Provoni përsëri.');
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className={s.form}>
        <label htmlFor="tz-gate-password" className="tz-sr-only">
          Fjalëkalimi
        </label>
        <input
          id="tz-gate-password"
          type="password"
          className={s.input}
          placeholder="Fjalëkalimi"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
        />
        <button
          type="submit"
          className={s.submit}
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Duke hyrë…' : 'Hyr'}
          <ArrowCircle />
        </button>
      </form>
      <p className={s.error} role="alert">
        {status === 'error' ? message : ''}
      </p>
    </>
  );
}
