import type { GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';

export const DEFAULT_CLOSED_MESSAGE =
  'Aplikimet për këtë periudhë janë mbyllur. Lini email-in tuaj dhe do t’ju njoftojmë sapo të hapen përsëri.';

export const DEFAULT_ANNOUNCEMENT_SUBJECT =
  'Aplikimet në Akademia Tenzil janë hapur';

export const DEFAULT_ANNOUNCEMENT_TEXT =
  'Të nderuar,\n\nAplikimet në Akademia Tenzil janë hapur përsëri. Nëse dëshironi të bëheni pjesë e akademisë, mund të aplikoni tani.';

/**
 * The one switch that opens and closes applications.
 *
 * It defaults to open, so shipping this changes nothing until somebody unticks
 * the box. Closed, the public form is replaced by the waitlist and /api/apply
 * refuses submissions; the check lives on the server as well as the page,
 * because a closed form that still accepts a hand-written POST is not closed.
 */
export const ApplicationSettings: GlobalConfig = {
  slug: 'application-settings',
  label: 'Hapja e aplikimeve',
  admin: {
    group: 'Aplikimet',
    description:
      'Hapni ose mbyllni aplikimet. Kur janë të mbyllura, faqja shfaq listën e njoftimeve në vend të formularit.',
  },
  access: {
    // The site reads this through the local API, server-side. Nothing public
    // needs it over REST.
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        // The homepage is prerendered, so flipping the switch has to tell Next
        // to rebuild it. Outside a request (a script, a migration) there is no
        // cache to touch and revalidatePath throws, which is fine to ignore:
        // the page also revalidates on a timer.
        try {
          revalidatePath('/');
        } catch {
          /* not in a request scope */
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'hapur',
      type: 'checkbox',
      label: 'Aplikimet janë të hapura',
      defaultValue: true,
      admin: {
        description:
          'Hiqeni shenjën për t’i mbyllur aplikimet. Ndryshimi shfaqet në faqe brenda pak çastesh.',
      },
    },
    {
      name: 'mesazhiMbyllur',
      type: 'textarea',
      label: 'Teksti në faqe kur aplikimet janë të mbyllura',
      defaultValue: DEFAULT_CLOSED_MESSAGE,
    },
    {
      name: 'njoftimSubjekti',
      type: 'text',
      label: 'Subjekti i email-it njoftues',
      defaultValue: DEFAULT_ANNOUNCEMENT_SUBJECT,
      admin: {
        description:
          'Email-i që u dërgohet personave në listën e njoftimeve kur aplikimet hapen përsëri.',
      },
    },
    {
      name: 'njoftimTeksti',
      type: 'textarea',
      label: 'Teksti i email-it njoftues',
      defaultValue: DEFAULT_ANNOUNCEMENT_TEXT,
      admin: {
        description:
          'Lidhja për të aplikuar dhe lidhja për çregjistrim shtohen automatikisht në fund.',
      },
    },
  ],
};
