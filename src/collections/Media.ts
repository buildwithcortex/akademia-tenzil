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
    /**
     * Variants are converted to WebP. Resizing a PNG keeps it a PNG, and a
     * photographic PNG stays enormous: a 2048px upload produced a 900px "card"
     * that was still 1.2 MB. WebP takes the same image to roughly a tenth of
     * that, and every browser the site supports reads it.
     */
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 900,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'wide',
        width: 1600,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
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
