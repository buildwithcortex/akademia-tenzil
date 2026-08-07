import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LegalShell } from '@/components/LegalShell';
import { getPayloadClient, formatDate, PUBLISHED_ONLY } from '@/lib/payload';
import type { Article, Category, Media } from '@/payload-types';
import s from '@/components/Articles.module.css';

export const metadata: Metadata = {
  title: 'Artikuj · Akademia Tenzil',
  description:
    'Shkrime nga Akademia Tenzil për memorizimin, përforcimin dhe ruajtjen e Kuranit.',
  alternates: { canonical: '/artikuj' },
  openGraph: { title: 'Artikuj · Akademia Tenzil', url: '/artikuj' },
};

// Articles change when the academy publishes; revalidate rather than rebuild.
export const revalidate = 300;

export default async function ArticlesPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'articles',
    // Both guards on purpose: overrideAccess:false makes the collection's
    // access rule apply, and the explicit filter means a public page never
    // depends on that rule being right.
    overrideAccess: false,
    where: PUBLISHED_ONLY,
    depth: 1,
    limit: 50,
    sort: '-publishedAt',
  });

  const articles = docs as Article[];

  return (
    <LegalShell
      eyebrow="Akademia Tenzil"
      title="Artikuj"
      intro="Shkrime rreth memorizimit, përforcimit dhe rrugëtimit me Kuranin."
      footer={
        <>
          <Link href="/">Kthehu te faqja</Link>
        </>
      }
    >
      {articles.length === 0 ? (
        <div className={s.empty}>
          <p className={s.emptyTitle}>Ende pa artikuj</p>
          <p className={s.emptyBody}>
            Shkrimet e para do të shfaqen këtu sapo të publikohen.
          </p>
        </div>
      ) : (
        <div className={s.list}>
          {articles.map((article) => {
            const cover =
              article.cover && typeof article.cover === 'object'
                ? (article.cover as Media)
                : null;
            const category =
              article.category && typeof article.category === 'object'
                ? (article.category as Category)
                : null;

            return (
              <article key={article.id} className={s.item}>
                <div className={s.itemBody}>
                  <p className={s.itemMeta}>
                    {category ? (
                      <span className={s.itemCat}>{category.title}</span>
                    ) : null}
                    {article.publishedAt ? (
                      <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt)}
                      </time>
                    ) : null}
                  </p>
                  <Link href={`/artikuj/${article.slug}`} className={s.itemLink}>
                    <h2 className={s.itemTitle}>{article.title}</h2>
                  </Link>
                  {article.excerpt ? (
                    <p className={s.itemExcerpt}>{article.excerpt}</p>
                  ) : null}
                </div>

                {cover?.url ? (
                  <Link href={`/artikuj/${article.slug}`} className={s.thumb}>
                    <Image
                      src={cover.url}
                      alt={cover.alt || ''}
                      width={cover.width ?? 900}
                      height={cover.height ?? 600}
                      sizes="(max-width: 700px) 100vw, 380px"
                    />
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </LegalShell>
  );
}
