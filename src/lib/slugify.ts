/**
 * URL slug from Albanian text.
 *
 * Albanian ë and ç must fold to e and c rather than being stripped, otherwise
 * "Përforcim" would become "prforcim". Everything else is NFD-normalised so
 * accents come off cleanly.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ë/g, 'e')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}
