import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { LegalShell } from '@/components/LegalShell';
import {
  getPayloadClient,
  formatDate,
  PUBLISHED_ONLY,
  pickImage,
} from '@/lib/payload';
import type { Article, Category, Media } from '@/payload-types';
import s from '@/components/Articles.module.css';

export const revalidate = 300;

async function findArticle(slug: string): Promise<Article | null> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'articles',
    overrideAccess: false,
    where: { and: [{ slug: { equals: slug } }, PUBLISHED_ONLY] },
    depth: 1,
    limit: 1,
  });
  return (docs[0] as Article) ?? null;
}

export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'articles',
    overrideAccess: false,
    where: PUBLISHED_ONLY,
    limit: 200,
    select: { slug: true },
  });
  return docs
    .map((d) => ({ slug: (d as Article).slug }))
    .filter((p): p is { slug: string } => Boolean(p.slug));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await findArticle(slug);
  if (!article) return { title: 'Artikulli nuk u gjet · Akademia Tenzil' };

  const cover = pickImage(
    article.cover && typeof article.cover === 'object'
      ? (article.cover as Media)
      : null,
    ['card', 'wide'],
  );

  return {
    title: `${article.title} · Akademia Tenzil`,
    description: article.excerpt ?? undefined,
    alternates: { canonical: `/artikuj/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt ?? undefined,
      url: `/artikuj/${article.slug}`,
      publishedTime: article.publishedAt ?? undefined,
      ...(cover?.url ? { images: [{ url: cover.url }] } : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await findArticle(slug);
  if (!article) notFound();

  const cover = pickImage(
    article.cover && typeof article.cover === 'object'
      ? (article.cover as Media)
      : null,
    ['wide', 'card'],
  );
  const category =
    article.category && typeof article.category === 'object'
      ? (article.category as Category)
      : null;

  const meta = [category?.title, formatDate(article.publishedAt)]
    .filter(Boolean)
    .join(' · ');

  return (
    <LegalShell
      eyebrow={category?.title || 'Artikull'}
      title={article.title}
      meta={meta || undefined}
      intro={article.excerpt || undefined}
      footer={
        <>
          <Link href="/artikuj">Të gjithë artikujt</Link>
          <span className={s.itemCat} aria-hidden="true">
            ·
          </span>
          <Link href="/">Akademia Tenzil</Link>
        </>
      }
    >
      {cover ? (
        <figure className={s.cover}>
          <Image
            src={cover.url}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 900px) 100vw, 820px"
          />
        </figure>
      ) : null}

      <div className={s.prose}>
        <RichText data={article.body} />
      </div>

      <div className={s.backRow}>
        <Link href="/artikuj" className={s.back}>
          ← Të gjithë artikujt
        </Link>
      </div>
    </LegalShell>
  );
}
