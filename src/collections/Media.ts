import type { CollectionConfig } from 'payload';

/**
 * Uploaded images. Files themselves live in Supabase Storage via the S3
 * adapter; only the metadata row is stored in Postgres.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imazh', plural: 'Imazhet' },
  admin: { group: 'Përmbajtja' },
  access: {
    // Images are served publicly on the site.
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 480, height: undefined, position: 'centre' },
      { name: 'card', width: 900, height: undefined, position: 'centre' },
      { name: 'wide', width: 1600, height: undefined, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Përshkrimi i imazhit',
      required: true,
      admin: {
        description:
          'Përshkrimi për lexuesit e ekranit. Shkruani çfarë tregon imazhi.',
      },
    },
  ],
};
