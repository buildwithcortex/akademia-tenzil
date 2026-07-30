# Akademia Tenzil, public website

Next.js 16 (App Router, TypeScript, CSS Modules) port of the approved design in
`../Akademia Tenzil.dc.html`. All copy is Albanian; the design file remains the
visual source of truth.

```bash
npm install
npm run dev
```

## Environment

Nothing is required to run the site locally. Three variables matter for
production:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production origin. Drives `metadataBase`, the canonical URL, `sitemap.xml` and `robots.txt`. Defaults to `https://akademiatenzil.com`. **Set this to the real domain before launch.** |
| `APPLY_WEBHOOK_URL` | Where applications are POSTed as JSON. Works with a Google Apps Script bound to a Sheet, Airtable/Notion via a proxy, Zapier, Make, n8n, or your own endpoint. |
| `RESEND_API_KEY` + `APPLY_TO_EMAIL` | Alternative to the webhook: emails the application to the academy. `APPLY_FROM_EMAIL` optionally overrides the sender. |

Optional: `APPLY_WEBHOOK_SECRET` is sent as the `X-Tenzil-Secret` header so the
receiving endpoint can verify the caller.

**Delivery is deliberately unset by default.** With neither a webhook nor Resend
configured, `/api/apply` returns `501 NO_ENDPOINT` and the form shows its error
state. The site never fakes a successful application.

Payload shape:

```json
{
  "emri": "…", "mosha": "…", "email": "…", "telefoni": "…",
  "programi": "Hifz | Përforcim | Nuk jam i sigurt",
  "pervoja": "…", "mesazhi": "…",
  "source": "akademiatenzil.web",
  "ts": "2026-07-29T10:00:00.000Z"
}
```

## Structure

```
src/
  app/
    layout.tsx            fonts, metadata, <html lang="sq">
    page.tsx              composes all 11 sections
    globals.css           tokens, resets, the 7 recurring motifs
    opengraph-image.tsx   1200×630, generated from Cinzel Wolf + the white logo
    sitemap.ts robots.ts
    api/apply/route.ts    validation, honeypot, rate limit, delivery
  components/
    Nav.tsx               client: compact morph, mobile overlay
    ApplicationForm.tsx   client: validation and submit states
    <Section>.tsx         server components, one CSS Module each
    ui/Motifs.tsx         Eyebrow, Diamonds, ArchWatermark, JourneyLine,
                          PaperGrain, ArrowCircle
    motion/
      SmoothScroll.tsx    Lenis provider + anchor intercept
      PageMotion.tsx      the one animating primitive
      useReveal.ts        all scroll-driven motion, read from data attributes
      useMagnetic.ts      magnetic CTAs
  lib/
    validation.ts         shared by the form and the route handler
    delivery.ts  rateLimit.ts  site.ts
```

### Motion architecture

The handoff suggested a per-component `Reveal` wrapper. This build instead keeps
**every section a server component** carrying plain data attributes
(`data-reveal`, `data-parallax`, `data-panel`, `data-sticky`, …) and has a single
client component (`PageMotion`) read them and drive GSAP. Same behaviour as
the prototype, selector for selector, with only `Nav`, `ApplicationForm`,
`SmoothScroll` and `PageMotion` in the client bundle.

## Still open

1. **Real contact details** for the footer. The approved placeholder line
   ("Kontaktet zyrtare shtohen sapo t'i konfirmojë akademia.") is in place;
   nothing was invented. `JsonLd.tsx` likewise omits `address`/`telephone`/
   `email`/`sameAs` until they land.
2. **Privacy + Contact as routes or inline?** Currently inline, as designed.
3. **Program picker label.** The picker says "Përforcim" while the panel says
   "Itkan". Left as designed; the submitted value is `Përforcim` either way.
4. **Production domain** for `NEXT_PUBLIC_SITE_URL`.
5. **Rate limiting** is in-process (5 requests/hour/IP). Real on a single
   long-lived server, best-effort on serverless. Put Upstash Ratelimit or a
   Vercel WAF rule in front for production.
6. **GDPR.** The form collects a minor's name, age, email and phone. Confirm
   who receives it, where it is stored and for how long, and reflect that in the
   privacy copy before launch.
