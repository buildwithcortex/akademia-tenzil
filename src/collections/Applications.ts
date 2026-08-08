import type { CollectionConfig } from 'payload';

/**
 * Applications submitted through the form on the public site.
 *
 * Nobody may create these from the admin panel and nobody may read them without
 * logging in: they are written only by /api/apply, server-side, and reviewed by
 * the academy.
 *
 * The applicant's own words are read-only in the admin. Reviewing a record
 * should never be able to rewrite what somebody submitted; `status` and
 * `shenime` are the only editable fields.
 */
export const Applications: CollectionConfig = {
  slug: 'applications',
  labels: { singular: 'Aplikim', plural: 'Aplikimet' },
  admin: {
    useAsTitle: 'emri',
    defaultColumns: ['emri', 'programi', 'status', 'createdAt'],
    group: 'Aplikimet',
    description: 'Aplikimet e dërguara nga faqja publike.',
  },
  access: {
    // Written only by the route handler, which uses overrideAccess.
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Statusi',
      defaultValue: 'i_ri',
      options: [
        { label: 'I ri', value: 'i_ri' },
        { label: 'Në shqyrtim', value: 'ne_shqyrtim' },
        { label: 'Kontaktuar', value: 'kontaktuar' },
        { label: 'Pranuar', value: 'pranuar' },
        { label: 'Refuzuar', value: 'refuzuar' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'shenime',
      type: 'textarea',
      label: 'Shënime të brendshme',
      admin: {
        position: 'sidebar',
        description: 'Vetëm për akademinë. Nuk i shfaqet aplikuesit.',
      },
    },

    // Everything below is exactly what the applicant submitted.
    {
      type: 'row',
      fields: [
        {
          name: 'emri',
          type: 'text',
          label: 'Emri dhe mbiemri',
          required: true,
          admin: { readOnly: true, width: '60%' },
        },
        {
          name: 'mosha',
          type: 'text',
          label: 'Mosha',
          admin: { readOnly: true, width: '40%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          required: true,
          admin: { readOnly: true, width: '50%' },
        },
        {
          name: 'telefoni',
          type: 'text',
          label: 'Numri i telefonit',
          admin: { readOnly: true, width: '50%' },
        },
      ],
    },
    {
      name: 'programi',
      type: 'text',
      label: 'Programi',
      admin: { readOnly: true },
    },
    {
      name: 'pervoja',
      type: 'textarea',
      label: 'Përvoja e mëparshme',
      admin: { readOnly: true },
    },
    {
      name: 'mesazhi',
      type: 'textarea',
      label: 'Mesazhi',
      admin: { readOnly: true },
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
