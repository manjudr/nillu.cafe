# Mobile performance follow-up

Local production preview: http://127.0.0.1:5180/. Lighthouse 13.5.0, mobile preset, 2026-10-23T14:34:01.861Z. Other browser tests were closed before measurement. These are lab measurements, not published-site field data.

| Category | Before | After |
| --- | ---: | ---: |
| performance | 70 | 97 |
| accessibility | 100 | 100 |
| best-practices | 100 | 100 |
| seo | 100 | 100 |

| Metric | Before | After |
| --- | ---: | ---: |
| first-contentful-paint | 3.9 s | 1.7 s |
| largest-contentful-paint | 5.3 s | 2.3 s |
| total-blocking-time | 140 ms | 0 ms |
| cumulative-layout-shift | 0 | 0 |

## Changes

- The real page remains rendered at build time for visitors and crawlers. Its header, hero and reveals use a small native controller. React and WebGL load as interactive sections approach.
- The hero draws with OffscreenCanvas in a worker on supported browsers. The compatibility renderer uses the same timeline and drawing functions. Hidden/offscreen animation pauses, and the mobile canvas draws at 30 fps.
- Header/hero CSS is extracted from the exact compiled stylesheet and embedded in the HTML. The remaining stylesheet loads without blocking the first screen.
- Latin fonts retain Latin/extended Latin, punctuation, currency, trademark and arrow symbols in smaller WOFF2 subsets. Kannada/Telugu coverage and shaping tables remain complete. Critical fonts are preloaded.
- Mobile canvas artwork uses a smaller lossless logo, decoded asynchronously.
- Normal-motion fallbacks use a transparent active image source. Real food photos are reserved for reduced motion, no JavaScript, or explicit renderer failure. This prevents the hard-refresh photograph flash and unused startup downloads.
- Tab icons use the complete stacked mark at proper 16/32/48px sizes with a white background for dark tabs.
- Hero copy: “One sip. A little joy.” with a clearer happy eye and smile. Care copy: “Good food. Thoughtful care.”
- The owner-provided Instagram profile is linked in the site and business sameAs metadata.

## Validation

- Production build, TypeScript, complete prerender and clean whitespace diff.
- SEO/crawler checks with JavaScript off, normal motion, and reduced motion; Instagram is present in entity markup.
- Cold-load download assertions: no React, WebGL, scene controls or hidden food photos during startup; live coffee graphics load on approach.
- Actual worker readiness and compatibility renderer with OffscreenCanvas disabled, both normal and reduced motion.
- Deliberately delayed full stylesheet: identical header/hero geometry at 390px and 1440px, and no photo flash.
- Seven responsive sizes, mobile menu, all five hero states, four food scenes advancing/reversing at phone/tablet/desktop widths.
- Browser checks reported no errors.

The full audit is in shots/lighthouse-mobile.report.html and .json. Lighthouse also includes an under-development Agentic Browsing category (50/100) for optional AI catalogue files; it is separate from the four standard categories above and is not a search-ranking score. See SEO-REVIEW.md for the source-backed search plan.

## Maintenance

The Vite dev server and standalone previews use the React entry; measure performance against the compiled production preview. The page controller and React previews share walkTimeline.ts, walkIdentity.ts and walkStory.ts. First-screen styles are selected in scripts/prerender.mjs; update its selector set if future header/hero classes use new prefixes.

Use scripts/prep-favicon.mjs, scripts/prep-search-assets.mjs and scripts/compress-fonts.py to regenerate their assets. Original artwork, TTFs and licenses are retained.

The measured mobile work and subsequent 2D-cafe copy are now published at https://nillu.cafe/. Pages deployment: https://github.com/manjudr/nillu.cafe/actions/runs/39973496563. The measurements above were collected locally before publication.
