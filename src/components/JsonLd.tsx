import { SITE_URL } from '@/lib/site';

/**
 * EducationalOrganization block, limited to facts the academy has confirmed.
 *
 * The email is the academy's published address, live on /support and
 * registered with App Store Connect. `address`, `telephone` and `sameAs` are
 * still absent on purpose: add them here (never placeholders) once confirmed.
 */
const schema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Akademia Tenzil',
  url: SITE_URL,
  email: 'akademiatenzil@gmail.com',
  logo: `${SITE_URL}/logo-dark.png`,
  inLanguage: 'sq',
  description:
    'Akademia Tenzil ofron një program të strukturuar për memorizimin, përforcimin dhe ruajtjen afatgjatë të Kuranit.',
  slogan: 'Memorizim · Përforcim · Përsosje',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Programet',
    itemListElement: [
      {
        '@type': 'Course',
        name: 'Hifz',
        description: 'Memorizimi i Kuranit',
        provider: { '@type': 'EducationalOrganization', name: 'Akademia Tenzil' },
      },
      {
        '@type': 'Course',
        name: 'Itkan',
        description: 'Përforcimi i Kuranit',
        provider: { '@type': 'EducationalOrganization', name: 'Akademia Tenzil' },
      },
    ],
  },
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
