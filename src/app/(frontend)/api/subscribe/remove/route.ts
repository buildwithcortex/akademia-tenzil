import { getPayloadClient } from '@/lib/payload';
import { validSubscriberToken } from '@/lib/subscriberToken';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The unsubscribe link in the announcement email.
 *
 * GET only asks; POST removes. Mail scanners and link previews follow every
 * link in a message, and a GET that deleted on sight would quietly unsubscribe
 * people who never clicked anything.
 */

function page(body: string, status = 200): Response {
  const html = `<!doctype html>
<html lang="sq">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Çregjistrimi · Akademia Tenzil</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
         background: #f4f0e6; color: #1b2a26; font: 17px/1.6 Georgia, serif; }
  main { max-width: 30rem; padding: 2rem; text-align: center; }
  h1 { font-size: 1.4rem; font-weight: 400; letter-spacing: .06em; }
  button, a.home { display: inline-block; margin-top: 1rem; padding: .8rem 1.6rem;
         border: 0; border-radius: 999px; background: #14433a; color: #f4f0e6;
         font: inherit; text-decoration: none; cursor: pointer; }
</style>
</head>
<body><main><h1>Akademia Tenzil</h1>${body}</main></body>
</html>`;
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

const invalid = () => page('<p>Kjo lidhje nuk është e vlefshme.</p>', 400);

function credentials(req: Request): { id: string; token: string } | null {
  const params = new URL(req.url).searchParams;
  const id = params.get('id') ?? '';
  const token = params.get('t') ?? '';
  if (!/^\d+$/.test(id) || !token || !validSubscriberToken(id, token)) {
    return null;
  }
  return { id, token };
}

export async function GET(req: Request) {
  const c = credentials(req);
  if (!c) return invalid();

  return page(`
    <p>Dëshironi të hiqeni nga lista e njoftimeve të Akademisë Tenzil?</p>
    <form method="post" action="?id=${c.id}&amp;t=${encodeURIComponent(c.token)}">
      <button type="submit">Po, më hiqni nga lista</button>
    </form>`);
}

export async function POST(req: Request) {
  const c = credentials(req);
  if (!c) return invalid();

  const payload = await getPayloadClient();
  // Already gone is the outcome they asked for, so it is not an error.
  await payload
    .delete({
      collection: 'subscribers',
      id: Number(c.id),
      overrideAccess: true,
    })
    .catch(() => null);

  return page(`
    <p>U hoqët nga lista. Nuk do të merrni më njoftime nga ne.</p>
    <a class="home" href="/">Kthehu te faqja</a>`);
}
