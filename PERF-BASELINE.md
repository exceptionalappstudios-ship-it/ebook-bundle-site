# SeekhoShop page speed: before / after

Measured 25 Oct 2026 with Lighthouse 12, mobile preset (simulated slow 4G, 4× CPU slowdown), median of 3 runs.
URL tested: `/?utm_source=meta&utm_campaign=test&utm_content=t1`

## Step 0: what the site is built on

Plain static HTML/CSS/JS (no WordPress, no Hostinger Website Builder, no frameworks, no jQuery, no Tailwind).
Hosted on Hostinger (`server: hcdn`), already serving **HTTP/2 + HTTP/3** with **Brotli**. The ad URL with UTM
parameters loads with **0 redirects** (`http://` → `https://` is one 301 hop).

Third-party domains on the page: `connect.facebook.net`, `www.facebook.com` (Meta Pixel),
`capig.stape.id` (Meta Conversions API Gateway, loaded by the Pixel), `fonts.googleapis.com`, `fonts.gstatic.com`.
No files over 100 KB on our side except the PDFs (not loaded on page view). Largest page-view files were the two
Meta Pixel scripts (≈117 KB + 150 KB) and Google Fonts (≈157 KB across 4 files).

## Results

| Metric | Target | Live site (before) | Same server, before | **Same server, after** |
|---|---|---|---|---|
| Lighthouse performance score | 90+ | 91 | 58 | **93** |
| Largest Contentful Paint | < 2.0 s | 2.19 s | 6.99 s | **1.96 s** |
| First Contentful Paint | | 2.19 s | 3.02 s | **0.96 s** |
| Cumulative Layout Shift | < 0.05 | 0.002 | 0 | **0** |
| Total Blocking Time | < 150 ms | 269 ms | 431 ms | **≈220–285 ms** (Meta Pixel, see below) |
| Our own bytes on first load | < 300 KB | ≈455 KB | 493 KB | **279 KB** |
| Our own requests before first screen | < 15 | 26 | 26 | **13** |
| Render-blocking resources | | 310 ms | 1,140 ms | **none** |

"Live site" is the real seekhoshop.com (US test machine → Hostinger). "Same server" columns serve the old and
new files from one local Brotli server so the comparison is like-for-like. The Meta Pixel adds ≈263 KB and
≈480 ms of main-thread blocking on top of the figures above; it was left untouched as required.

## What changed

- **Fonts:** removed Google Fonts; self-hosted Bricolage Grotesque (600–800) and Plus Jakarta Sans (400–800)
  as variable WOFF2, subset to Latin + ₹ (48 KB total, was ≈157 KB), `font-display: swap`, both preloaded.
- **CSS:** homepage CSS purged of unused rules, minified and inlined (≈6 KB compressed), so nothing blocks the
  first paint. Other pages keep the shared stylesheet.
- **Images:** all covers converted to WebP (−27%), 184 px thumbnails for small covers (marquee, category cards,
  buy box), `width`/`height` on every image, below-the-fold images `loading="lazy" decoding="async"`,
  centre hero cover `fetchpriority="high"`.
- **Cover marquee:** 16 separate images → one WebP strip (1 request instead of 16).
- **Effects:** removed `backdrop-filter: blur()` from the sticky header and bottom bar (expensive on mid-range Android).
- **JS:** `track.js` deferred; no other scripts besides the inline page logic and the Pixel.
- **Checkout:** `preconnect` + `dns-prefetch` to `superprofile.bio` and `connect.facebook.net`. Buy buttons now open
  checkout in the **same tab** (more reliable in the Instagram/Facebook in-app browser). The click waits ≈150 ms so
  `InitiateCheckout` is sent before leaving; the buttons still work as plain links without JavaScript.
- **Caching (`.htaccess`):** images, fonts, CSS, JS, PDFs `public, max-age=31536000, immutable`; HTML `no-cache`;
  `font/woff2` and `image/webp` MIME types.

## Checked

- Meta Pixel `2120747508548541`: `PageView` + `ViewContent` on load, `ViewPricing`, `InitiateCheckout`
  (same parameters as before), `SampleDownload`, `Contact`, all still firing.
- Both checkout links unchanged; prices unchanged (₹399 Complete, ₹299 Ebooks only).
- No layout overflow at 360 / 390 / 768 / 1280 px on all pages; visual comparison against the old page.

## Not changed, and why

- **Meta Pixel** stays async in `<head>` and is not delayed (rule 1). It is the remaining cause of TBT > 150 ms.
- **Inter font:** the site has always used Bricolage Grotesque + Plus Jakarta Sans, so these were kept to keep the look.
- **Headline font optical size** fixed to its display setting (saves 28 KB). Mobile looks identical; desktop headline
  glyphs are very slightly narrower.
- **Original JPGs** kept on the server (used for the share image and as a fallback); the page no longer loads them.
- **Cloudflare / Hostinger CDN:** needs to be switched on in your accounts (see notes in chat).

## How to judge it in Meta

A week after going live, compare **landing page views ÷ link clicks** in Ads Manager (74% now, target 85%+).
