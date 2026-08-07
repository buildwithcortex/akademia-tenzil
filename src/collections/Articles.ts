import type { CollectionConfig } from 'payload';
import { slugify } from '@/lib/slugify';

/**
 * Articles published by the academy, shown at /artikuj.
 *
 * Drafts are enabled, so nothing is visible on the site until it is explicitly
 * published. Read access reflects that: a signed-in admin sees everything,
 * the public sees only published documents.
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Artikull', plural: 'Artikujt' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Përmbajtja',
    description: 'Shkrimet që shfaqen te faqja Artikuj.',
  },
  versions: {
    drafts: {
      autosave: { interval: 1200 },
    },
    maxPerDoc: 20,
  },
  access: {
    // Admins see drafts; everyone else sees only what has been published.
    read: ({ req }) => {
      if (req.user) return true;
      return {
        _status: { equals: 'published' },
      };
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titulli',
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
        description: 'Pjesa e fundit e adresës: /artikuj/<slug>',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ? slugify(value) : slugify(data?.title ?? ''),
        ],
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data e publikimit',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
      },
      hooks: {
        // Stamp a date on first publish so ordering is stable.
        beforeChange: [
          ({ siblingData, value }) =>
            value ?? (siblingData?._status === 'published' ? new Date() : value),
        ],
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Kategoria',
      admin: { position: 'sidebar' },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Imazhi kryesor',
      admin: {
        description: 'Shfaqet te lista e artikujve dhe në krye të shkrimit.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Përshkrimi i shkurtër',
      maxLength: 300,
      admin: {
        description:
          'Dy-tre rreshta që shfaqen te lista dhe te rezultatet e kërkimit.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Përmbajtja',
      required: true,
    },
  ],
};
