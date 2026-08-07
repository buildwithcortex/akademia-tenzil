import type { CollectionConfig } from 'payload';
import { slugify } from '@/lib/slugify';

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategori', plural: 'Kategoritë' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    group: 'Përmbajtja',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Emri',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Adresa (slug)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Krijohet vetvetiu nga emri.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ? slugify(value) : slugify(data?.title ?? ''),
        ],
      },
    },
  ],
};
