# Nillu Cafe: search and AI discovery

Reviewed 23 October 2026. Business status: opening soon in HSR Layout, Bengaluru.
Google Business Profile is not created yet, per the owner. No online ordering,
reservation support, or enquiry forms are offered by this website.

## Findings and implemented changes

| Area | Before | Implemented |
| --- | --- | --- |
| Initial HTML | Empty React root; page depended on JavaScript | Build-time rendering of the actual React page; lightweight header/hero enhancement and React islands preserve interactions |
| Search title | Brand slogan without location | Nillu Cafe in HSR Layout, Bengaluru / Opening Soon |
| Primary heading | Changed with animation; began as “Somewhere to be” | Stable accessible business/location H1, with animated story headings at H2 |
| Crawler discovery | Live robots.txt returned 404 | Public robots.txt allows crawling and explicitly allows OAI-SearchBot |
| Sitemap | Live sitemap.xml returned 404 | One canonical home URL; no fragment links or preview studies treated as pages |
| Business identity | No structured data | Connected Organization, WebSite, and WebPage entities with stable IDs |
| Shared links | Large-image card declared but no preview image | 1200 × 630 branded preview, descriptions and image alt text for Open Graph and Twitter |
| Facts | Metadata and visible summary maintained separately | Shared verified facts in src/data/site.ts; visible location summary explains the offering |
| No-JavaScript visits | No page content | Readable real content, visible navigation, still logo, and compact food sections |
| Preview studies | Same URL with query parameters | Canonical home URL retained; client marks preview studies noindex |
| Fonts and logo | Full TTF fonts and a 96 KB header image | WOFF2 fonts with Latin subsets, complete Kannada/Telugu coverage, and a 7.4 KB small logo; originals and licenses retained |
| Offscreen graphics | Coffee/juice canvases and story lettering initialized outside the viewport | Mount graphics as sections approach the viewport; reduced-motion visits use still food images |

The build runs `scripts/prerender.mjs` after Vite, waits for the real lazy sections,
and maps SSR artwork URLs through Vite's production manifest. This is the same
content served to visitors and crawlers, not a separate crawler page.

## What current official guidance supports

Google's AI Overviews and AI Mode use established Search foundations: crawlability,
indexing, useful textual content, accurate structured data, and a good page
experience. Google explicitly says no special AI text file or AI-specific schema
is required. This guidance concerns Google Search AI features, not a guarantee
about every answer in the standalone Gemini app.

OpenAI identifies OAI-SearchBot as its search crawler. Allowing it supports
eligibility for ChatGPT search, but does not guarantee citation or recommendation.
Its setting is independent of GPTBot, which relates to model training. This change
does not add a new training preference. The general allow policy remains unchanged.

Local discovery also depends on the person's location, relevance, and the
business's prominence. An SEO audit score is a technical check, not a recommendation
probability or a ranking score. No fake ratings, reviews, “best cafe” claims,
reservation/ordering actions, invented menu prices, or opening dates have been added.

## Business entity and address (updated 23 October 2026)

The owner confirmed the full trading address and operating days:
1902, 19th Main, 25th Cross Rd, Sector 2, HSR Layout, Bengaluru, Karnataka 560102,
open Monday to Sunday. Fit-out work is still under way, so the cafe is **not
trading yet**.

Implemented on the back of that:

| Change | Detail |
| --- | --- |
| Business entity | `Organization` upgraded to `CafeOrCoffeeShop`, retaining the `#business` `@id` as planned |
| Address | Complete `PostalAddress` with street, locality, region, postcode and country |
| Entity identity | `alternateName` (`Nillu`, `ನಿಲ್ಲು`), `areaServed`, `servesCuisine`, `knowsLanguage` |
| Visible address | Full street address in the Visit section, with a map link for the address |
| Operating days | `visit.ts` `days` populated; shown under the planned hours |
| City spelling | Title, description and Visit copy carry "Bangalore" alongside "Bengaluru" |
| Crawler files | `sitemap.xml` gains `lastmod`/`changefreq`; `robots.txt` names major search and assistant crawlers explicitly |

`openingHoursSpecification` is still **deliberately absent**. Publishing operating
hours for a business that has not opened would present a closed cafe as trading.
Add it, with `validFrom`, once the opening date is confirmed; the hours shown on
the page remain labelled "planned opening hours" until then. The explicit
`robots.txt` crawler entries document intent only — the existing `User-agent: *`
wildcard already permitted every one of them.

The food exploration is not a priced menu. It is not marked up as a Menu or
Product feed. Illustrative food images are not presented as photographs of actual
served dishes. There is no FAQ section or FAQPage markup: the owner declined one,
and FAQ structured data without matching visible content would breach Google's
structured-data policy. The location, opening status, hours and offering are
instead carried as prose in the Visit section. No llms.txt ranking promise or
artificial neighbourhood landing-page network has been added.

## Later: local presence and indexing

1. **Highest-value remaining action.** Create and verify the Google Business Profile
   now that the full address is confirmed. On-page markup alone does not make
   assistants or Maps answer local "cafe in HSR Layout" questions; they ground on
   Business Profile, Maps and review data, none of which exists yet. Use the actual
   business name, the appropriate cafe category, website, the Sector 2 address, and
   genuine photos. Set a future opening date through Google's supported process
   rather than marking the cafe open early. Add the resulting Maps URL to
   `visit.ts` `mapUrl`, which currently falls back to an address search.
2. Keep the name, address, opening status, hours and contact details consistent
   between the website, Maps, and genuine social profiles. Add the resulting Maps
   and social links to the site.
3. Verify nillu.cafe in Google Search Console (domain verification needs DNS access)
   and Bing Webmaster Tools. Submit https://nillu.cafe/sitemap.xml. Use Google's URL
   Inspection after deployment to verify the rendered page and request indexing.
4. When open, update visible copy, metadata, business profile and structured data
   together. Upload real cafe and food photos. Invite honest customer reviews and
   respond to them; never fabricate or buy them.
5. If the owner later approves a real menu, publish readable HTML with verified
   items/prices/dietary details. The owner has deferred menu and other feature
   additions, so this release does not create them.

Account setup, DNS verification, submissions and business-listing edits have not
been performed. Technical changes must be deployed before crawlers can see them.

## Measurement

- `npm run build`: TypeScript, production assets, and complete page prerender.
- `node scripts/check-seo.mjs`: raw HTML, crawler files, structured data, canonical,
  metadata uniqueness, JavaScript-on hydration, JavaScript-off readability, resource
  failures, mobile overflow, preview noindex, and social assets. Uses local Chrome.
- `URL=http://127.0.0.1:5180/ node scripts/check-responsive.mjs --no-shots`: existing layout and
  interaction checks at seven screen sizes and all five animation phases.
- Lighthouse mobile lab reports are saved in `shots/lighthouse-mobile.report.html`
  and `.json`. Results are local production-preview measurements, not published-site
  field Core Web Vitals. See the recorded results below.
- After launch, use Search Console for indexing, search impressions/clicks and real
  Core Web Vitals. Track Maps discovery in Business Profile once available. If
  analytics is later approved, track referral sources, including ChatGPT's
  `utm_source=chatgpt.com`. No analytics/tracking was added in this work.
- Monthly discovery checks: branded searches (“Nillu Cafe”, “Nillu Cafe HSR Layout”),
  then local category searches. Record tool, date, wording, location, citations,
  and whether the answer correctly says opening soon. AI answers vary; a handful
  of prompts is not a reliable visibility score.

The installed Lighthouse version also includes an **Agentic Browsing** category
that its own description marks as still under development. It checks optional
`llms.txt` and `ai-catalog.json` resources as well as accessibility/layout. These
are not Google indexing requirements or a ChatGPT recommendation score. This
release does not invent action APIs or an AI catalogue for a site that supports
neither online orders nor reservations. The complete report retains these checks
rather than hiding them.

The font assets shrink from 1,598,496 to 330,752 bytes (79.3%). Latin faces retain
Latin/extended Latin, punctuation, currency, trademark and arrow symbols; Kannada
and Telugu retain full glyph and shaping coverage. Original TTFs are retained. The original artwork remains available for the
large animated logo; the small header/footer use a separate lossless WebP.

## Rebuilding search assets

`node scripts/prep-search-assets.mjs` creates the small logo, stable business logo,
and social preview from the original artwork. It requires the existing Sharp
dependency. `scripts/compress-fonts.py` produces WOFF2 files with the above coverage using
`fonttools[woff]`; generated WOFF2 files are committed assets and do not require
Python or font conversion on deployment. Metadata and the preview artwork must be
updated together when the opening status changes.

## Official sources

- Google: AI features and your website — https://developers.google.com/search/docs/appearance/ai-features
- Google: JavaScript SEO basics — https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google: Local business structured data — https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google: Organization structured data — https://developers.google.com/search/docs/appearance/structured-data/organization
- Google: Build and submit a sitemap — https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google: Improve local ranking — https://support.google.com/business/answer/7091
- Google: Future opening date — https://support.google.com/business/answer/9174409
- Google: Page experience and scoring limits — https://developers.google.com/search/docs/appearance/page-experience
- OpenAI: Crawlers — https://developers.openai.com/api/docs/bots
- Bing: Sitemaps — https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed

## Initial SEO-round validation (before the mobile follow-up)

Local production preview, Lighthouse 13.5.0, mobile preset, 2026-10-23T13:39:45.425Z.
Other browser tests were stopped before this audit. These are simulated lab scores,
not field measurements or search rankings.

| Category | Score |
| --- | ---: |
| performance | 70/100 |
| accessibility | 100/100 |
| best-practices | 100/100 |
| seo | 100/100 |
| agentic-browsing | 50/100 |

- first-contentful-paint: 3.9 s
- largest-contentful-paint: 5.3 s
- total-blocking-time: 140 ms
- cumulative-layout-shift: 0

Build, SEO checks (JavaScript off/on and reduced motion), seven responsive sizes,
all five hero phases, mobile menu, and all four food scenes advancing/reversing at
three widths passed. No browser errors in those checks. The first local audit
after the basic SEO implementation, before graphics/font optimizations, scored
performance 27/100; it was not an audit of the published site.

Mobile performance still needs further work, particularly initial rendering of
the animated hero and the remaining JavaScript/food-image payload. Lab results
vary between runs. The current release preserves the approved animation.
The mobile follow-up extracts first-screen rules from the compiled stylesheet and loads the full stylesheet asynchronously. The initial full-stylesheet inline experiment was not retained.

These measurements were collected locally before publication. The site has since been published; see the deployment note below.

## Mobile follow-up

The page now starts with a small native header/hero/reveal controller. React and
the food controls hydrate only as their section approaches; Canvas modules load
only near their individual scenes. The hero uses OffscreenCanvas in a dedicated
worker where supported, with the existing main-thread renderer as a compatibility
path. The timeline and illustration renderer are shared with the React previews.

Cold-load checks confirm that neither React/WebGL nor hidden food photos are
downloaded during startup. Still-photo fallbacks use transparent active sources
for normal motion; reduced-motion visitors and no-JavaScript visitors retain real
images, and renderer errors expose an explicit image fallback. This also removes
the photograph flash on hard refresh.

Header/hero styles are extracted by PostCSS from the exact production stylesheet.
A test holds the full stylesheet back and confirms identical header/hero geometry
before and after it arrives. The small Latin font files are preloaded. A 640px
lossless WebP logo is decoded off the main thread for the mobile canvas.

The tab icon now contains the complete stacked mark, with 16/32/48px ICO entries
and separate PNG/Apple sizes. Its tiny vertical cafe suffix is omitted at icon
sizes. The owner-provided Instagram profile is linked in the page and sameAs
metadata: https://www.instagram.com/nillucafe/.

Current copy: “One sip. A little joy.” with a clearer happy eye and smile; care
section: “Good food. Thoughtful care.” The supplied font licenses and original
artwork remain intact.

Final measurements are in MOBILE-PERFORMANCE.md and the complete local Lighthouse
report in shots/lighthouse-mobile.report.html. The 2D-cafe release is live at https://nillu.cafe/ following successful Pages deployment https://github.com/manjudr/nillu.cafe/actions/runs/39973496563. The custom artifact workflow remains manual-only while the account billing lock is active.
