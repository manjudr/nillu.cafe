# Nillu Cafe search review · 24 November 2026

The owner identifies smoothie bowls and fresh hot cookies as the two signature products and confirms a December opening. The site uses December 2026, the upcoming December at the time of review. The project brief confirms the Sector 2 address and verified Google Business Profile. The exact day, trading hours and Maps listing URL remain unconfirmed.

## Production baseline and priorities

| Priority | Evidence before changes | Resolution |
| --- | --- | --- |
| High | The live title emphasized the 2D concept. The description and accessible H1 announced “opening soon.” The visible hero led with coffee and the Visit section gave planned daily hours. | Lead with the specialties, show the confirmed opening month and publish the address without provisional hours. |
| Medium | A single JSON-LD graph already described a physical cafe and its address. Its website publisher and page subject both referenced the old cafe identifier. | Distinguish the brand from the location and verify every reference in the graph. |
| Medium | Preview studies appended a second robots directive. | Update the existing directive to noindex on preview renders. On static hosting, the initial HTML for query variants shares the homepage canonical. |
| Low | The social preview image itself contained the previous opening announcement. | Regenerate the existing branded card with both specialties and update its alternative text. |

The public homepage returned HTTP 200. HTTP apex, HTTP www and HTTPS www redirected permanently to the HTTPS apex. The homepage response had no X-Robots-Tag restriction. The index.html alias returned the homepage with its root canonical. Googlebot is allowed by robots.txt. The sitemap returned XML and listed only the homepage. The React/TypeScript site uses Vite head injection and build-time prerendering for one public page with section anchors. GitHub Pages serves compiled output from gh-pages.

A public web search for the brand and location surfaced a separate Nerlu Cafe in HSR Layout. The direct localized Google result request required JavaScript. A reproducible Bengaluru local-pack position, spelling correction, Google-selected canonical and index status remain unverified.

## Implementation and validation

- src/data/site.ts defines one Organization (#organization, with the official Instagram sameAs), one CafeOrCoffeeShop (#cafe, with a PostalAddress and parentOrganization), one WebSite (#website, published by the organization), and a WebPage about the cafe. All IDs resolve within the same graph. The title and description feed the search and social tags.
- src/data/visit.ts supplies the opening month and address components. Visit.tsx, WalkIdentity.tsx, walkStory.ts, App.tsx, Experience.tsx and TypographyPreview.tsx use the updated status, copy or menu. The food navigation leads directly to the bowl scene and cookie section. The Maps link searches the full confirmed address.
- The three existing stylesheets apply the Visit typography to the opening month. scripts/prep-search-assets.mjs regenerates public/social-preview.png. public/sitemap.xml records the content revision. src/react-main.tsx updates the preview directive.
- The production build passed. The SEO suite verified the graph relationships, a single H1/title/description, canonical URL, both featured food links, working anchors, image alt attributes, preview directives and social assets. Checks covered JavaScript on, JavaScript off and reduced motion. No missing image, failed resource or browser error was reported. The sitemap parsed as XML with one URL.
- The responsive suite checked all eleven sections at seven screen sizes, mobile navigation and all five hero phases. Mobile startup checks verified deferred scene loading and worker rendering. Visual review covered the hero, cookie and Visit sections at 390px and 1440px. PageSpeed Insights returned a quota error, so field Core Web Vitals are unverified. The build retains a size warning for the deferred 3D bundle.
- scripts/check-seo.mjs verifies entity relationships and the featured items. scripts/check-juice.mjs reads the opening month in its Visit diagnostic. scripts/check-scenes.mjs checks the current compact food presentation. README.md and SEO-REVIEW.md point to this review.

## Published review

[Pages deployment 45447424363](https://github.com/manjudr/nillu.cafe/actions/runs/45447424363) published source 3a10c06 in release 146bc6f. The public homepage, robots.txt, sitemap.xml and social card matched the reviewed build byte for byte. The live browser SEO checks passed with JavaScript enabled, disabled and with reduced motion. The Schema.org validator fetched the published homepage and reported zero errors and zero warnings. Forward and reverse scroll checks passed for all four scenes at phone, tablet and desktop sizes.

## Google follow-up

1. Inspect https://nillu.cafe/ in the verified Search Console property. Record crawl status, rendered HTML, selected canonical and indexing status. Check https://nillu.cafe/index.html as an alternate URL.
2. Check https://nillu.cafe/sitemap.xml in the Sitemaps report. Use the live URL test after publication, then request indexing if appropriate.
3. From HSR Layout, record Search and Maps results for Nillu, Nillu Cafe, Nillu Cafe Bangalore, Nillu Cafe HSR, Cafe in HSR Layout, and Smoothie bowls HSR Layout. Record location, date, spelling suggestions, local-pack business, and organic domain. Compare branded query impressions and clicks over equivalent reporting periods.
4. Compare the verified Business Profile name, address, website and opening information to the homepage, and obtain the exact Maps listing link. Revisit the December announcement when the opening day and hours are confirmed. Check real-user Core Web Vitals when field data becomes available.
