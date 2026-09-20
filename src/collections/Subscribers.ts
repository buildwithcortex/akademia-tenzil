import type { CollectionConfig, PayloadHandler, Where } from 'payload';
import { readApplicationState } from '@/lib/applicationState';
import { subscriberToken } from '@/lib/subscriberToken';
import { SITE_URL } from '@/lib/site';

/**
 * How many emails one request sends, and how far apart.
 *
 * Resend allows two requests a second, and a serverless function has a time
 * limit (raised to 60s on the REST route). 40 sends at 600ms is about 25s, well
 * inside both. The admin button simply calls again while anyone is left, so
 * the list size is not bounded by one request.
 */
const BATCH = 40;
const SPACING_MS = 600;

/** Stop a batch once the provider is clearly refusing us, e.g. a daily cap. */
const MAX_FAILURES = 3;

/** Notified addresses have served their purpose; the policy promises this. */
const RETENTION_MS = 365 * 24 * 60 * 60 * 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const unauthorized = () =>
  Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });

const pendingWhere: Where = { njoftuarMe: { exists: false } };

const status: PayloadHandler = async (req) => {
  if (!req.user) return unauthorized();

  const [{ open }, total, pending] = await Promise.all([
    readApplicationState(req.payload),
    req.payload.count({ collection: 'subscribers' }),
    req.payload.count({ collection: 'subscribers', where: pendingWhere }),
  ]);

  return Response.json({
    open,
    total: total.totalDocs,
    pending: pending.totalDocs,
  });
};

const notify: PayloadHandler = async (req) => {
  if (!req.user) return unauthorized();

  const state = await readApplicationState(req.payload);
  // Telling people applications are open while they are closed would be the
  // worst email this system could send.
  if (!state.open) {
    return Response.json({ error: 'CLOSED' }, { status: 409 });
  }
  if (!(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)) {
    return Response.json({ error: 'EMAIL_NOT_CONFIGURED' }, { status: 503 });
  }

  await req.payload.delete({
    collection: 'subscribers',
    where: {
      njoftuarMe: {
        less_than: new Date(Date.now() - RETENTION_MS).toISOString(),
      },
    },
  });

  const { docs } = await req.payload.find({
    collection: 'subscribers',
    where: pendingWhere,
    sort: 'createdAt',
    limit: BATCH,
    depth: 0,
  });

  let sent = 0;
  let failed = 0;

  for (const subscriber of docs) {
    const unsubscribe = `${SITE_URL}/api/subscribe/remove?id=${subscriber.id}&t=${subscriberToken(subscriber.id)}`;
    const text = [
      state.announcementText,
      '',
      `Aplikoni këtu: ${SITE_URL}/#apliko`,
      '',
      'Këtë email e morët sepse kërkuat të njoftoheni kur të hapen aplikimet.',
      `Për t’u hequr nga lista: ${unsubscribe}`,
    ].join('\n');

    try {
      await req.payload.sendEmail({
        to: subscriber.email,
        subject: state.announcementSubject,
        text,
      });
      // Marked one by one, so a batch that dies halfway never emails the
      // people it already reached a second time.
      await req.payload.update({
        collection: 'subscribers',
        id: subscriber.id,
        data: { njoftuarMe: new Date().toISOString() },
      });
      sent++;
    } catch (err) {
      failed++;
      req.payload.logger.error(
        { err, subscriber: subscriber.id },
        '[subscribers] announcement failed',
      );
      if (failed >= MAX_FAILURES) break;
    }

    await sleep(SPACING_MS);
  }

  const remaining = await req.payload.count({
    collection: 'subscribers',
    where: pendingWhere,
  });

  return Response.json({ sent, failed, remaining: remaining.totalDocs });
};

/**
 * People waiting to hear that applications have reopened.
 *
 * Written only by /api/subscribe and removed by the link in the announcement;
 * nobody creates or edits these by hand. `njoftuarMe` is set when the
 * announcement reached them, which is what makes sending resumable.
 */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Abonent', plural: 'Lista e njoftimeve' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'njoftuarMe', 'createdAt'],
    group: 'Aplikimet',
    description:
      'Personat që duan të njoftohen kur aplikimet të hapen përsëri.',
    components: {
      beforeListTable: [
        '@/components/admin/NotifySubscribers#NotifySubscribers',
      ],
    },
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  endpoints: [
    { path: '/notify', method: 'get', handler: status },
    { path: '/notify', method: 'post', handler: notify },
  ],
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'njoftuarMe',
      type: 'date',
      label: 'Njoftuar më',
      admin: {
        readOnly: true,
        description: 'Bosh derisa t’i dërgohet njoftimi.',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Burimi',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
  timestamps: true,
};
