import type { CollectionConfig } from 'payload';

/**
 * Admin accounts for the academy. There is no public sign-up: accounts are
 * created from inside the admin panel, matching how the iOS app works.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Përdorues', plural: 'Përdoruesit' },
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Sistemi',
  },
  access: {
    // Only signed-in admins may touch accounts.
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Emri',
      required: true,
    },
  ],
};
