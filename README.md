# Akademia Tenzil — website

Static site for the Akademia Tenzil iOS app. No build step, no dependencies:
plain HTML deployed by Vercel straight from this repo's root.

## Pages

| File | Live path | Purpose |
| --- | --- | --- |
| `index.html` | `/` | Holding page — logo, wordmark, "under construction", and the two links below. |
| `support.html` | `/support` | Support / help (Albanian, with an English summary) — the **Support URL** in App Store Connect. |
| `privacy-policy.html` | `/privacy-policy` | Privacy policy (English) — the **Privacy Policy URL** in App Store Connect. |

`cleanUrls` is on in `vercel.json`, so `/support` serves `support.html` and the
`.html` forms redirect to the clean paths. `/privacy` is kept as a permanent
redirect to `/privacy-policy`.

## Assets

Everything is self-hosted — the pages make **no third-party requests**, which is
what the privacy policy claims, so keep it that way (no Google Fonts, no CDNs,
no analytics).

| Path | Source | Notes |
| --- | --- | --- |
| `assets/appicon-512.png` | `appicon.png` | The app icon, downscaled and de-grained. The 4096px original is ~19 MB and must never be committed. |
| `assets/favicon.ico` | `logo_white.png` | Multi-resolution (16–256). The white cutout carries semi-transparent green fringing, so it is flattened onto deep emerald `#123F33`, which absorbs it. |
| `assets/apple-touch-icon.png` | `logo_white.png` | 180px, same treatment. |
| `assets/og.png` | `appicon.png` | 1200×630 link-preview card. |
| `assets/fonts/*.woff2` | app's bundled TTFs | Cinzel, Cormorant Garamond SemiBold, Manrope Medium — subset to Latin + Latin-1 + Latin Ext-A (covers `ë`/`ç`). ~60 KB total. |

Originals live in the app repo at `Akademia Tenzil/website/public/`.

## Brand

```
Cream #F4F0E6   Card  #FBFAF4   Ink        #22302A
Emerald #1E5A4B Deep  #123F33   Sage       #E7EDE4
Gold  #B08A4C   Dark gold #8A6D3B   Muted   #7B897F
```

Type: Cinzel (wordmark), Cormorant Garamond (display), Manrope (UI).

## Deploying

Every push to `main` deploys automatically. Vercel needs no framework preset, no
build command and no output directory — the repo root *is* the site.

## Editing

Contact address appears in `support.html` (4 places) and `privacy-policy.html`
(1 place). If it changes, update App Store Connect too. When the policy changes,
bump the "Last updated" date at the top of `privacy-policy.html`.
