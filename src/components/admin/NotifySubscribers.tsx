'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, toast, useConfig } from '@payloadcms/ui';
import s from './NotifySubscribers.module.css';

type ListStatus = { open: boolean; total: number; pending: number };

const ERRORS: Record<string, string> = {
  CLOSED: 'Aplikimet janë të mbyllura. Hapini para se të dërgoni njoftimin.',
  EMAIL_NOT_CONFIGURED: 'Dërgimi i email-eve nuk është konfiguruar.',
  UNAUTHORIZED: 'Sesioni ka skaduar. Hyni përsëri.',
};

/**
 * Sits above the waitlist table: how many people are waiting, and the one
 * button that tells them applications have reopened.
 *
 * Sending is never automatic. Reopening applications and announcing it are two
 * decisions, and an accidental tick of a checkbox should not email everyone.
 * The server sends in batches and marks each person as it goes, so this simply
 * calls again while anyone is left, and stops if a call makes no progress
 * (a provider's daily cap, most likely) rather than looping against a wall.
 */
export function NotifySubscribers() {
  const { config } = useConfig();
  const endpoint = `${config.routes.api}/subscribers/notify`;
  const router = useRouter();

  const [status, setStatus] = useState<ListStatus | null>(null);
  const [sending, setSending] = useState(false);
  const [sentSoFar, setSentSoFar] = useState(0);
  // Bumped after a send, so the counts are read again through the same effect.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch(endpoint, { credentials: 'include' })
      .then((res) => (res.ok ? (res.json() as Promise<ListStatus>) : null))
      .then((data) => {
        if (!cancelled && data) setStatus(data);
      })
      .catch(() => {
        /* the panel simply stays hidden */
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint, reloadKey]);

  async function send() {
    if (!status?.open || status.pending === 0) return;
    if (
      !window.confirm(
        `Do t’u dërgohet email ${status.pending} personave. Vazhdoni?`,
      )
    ) {
      return;
    }

    setSending(true);
    setSentSoFar(0);
    let total = 0;
    let remaining = status.pending;

    try {
      while (remaining > 0) {
        const res = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
        });
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          toast.error(ERRORS[body?.error as string] ?? 'Dërgimi dështoi.');
          break;
        }

        total += body.sent as number;
        remaining = body.remaining as number;
        setSentSoFar(total);

        if (body.sent === 0) break;
      }

      if (total > 0) toast.success(`U dërguan ${total} email-e.`);
      if (remaining > 0) {
        toast.info(
          `Mbeten ${remaining} pa u njoftuar. Provoni përsëri më vonë: kufiri ditor i dërgimit mund të jetë arritur.`,
        );
      }
    } catch {
      toast.error('Dërgimi dështoi.');
    } finally {
      setSending(false);
      setReloadKey((k) => k + 1);
      router.refresh();
    }
  }

  if (!status) return null;

  return (
    <div className={s.wrap}>
      <div>
        <p className={s.counts}>
          Në listë: <strong>{status.total}</strong> · Pa u njoftuar:{' '}
          <strong>{status.pending}</strong>
        </p>
        <p className={s.hint}>
          {sending
            ? `Duke dërguar… (${sentSoFar} të dërguar)`
            : status.open
              ? 'Aplikimet janë të hapura. Njoftimi u shkon vetëm atyre që nuk e kanë marrë ende.'
              : 'Aplikimet janë të mbyllura. Hapini te “Hapja e aplikimeve” para se të dërgoni njoftimin.'}
        </p>
      </div>

      <Button
        buttonStyle="primary"
        disabled={sending || !status.open || status.pending === 0}
        onClick={() => void send()}
      >
        Dërgo njoftimin
      </Button>
    </div>
  );
}
