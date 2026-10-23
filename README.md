# Nillu Cafe

White-and-black brand website built with React, TypeScript, Vite, Motion, and React Three Fiber. No ordering or reservation flow.

## Run locally

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 5180
```

Open http://127.0.0.1:5180/. Build with `npm run build`; preview the build with `npm run preview`.

The production page is rendered at build time. A small native controller runs the header, hero and editorial reveals; supported browsers draw the hero with OffscreenCanvas in a worker; React and the WebGL scene modules load as their sections approach the viewport. The standalone studies and Vite dev mode use the React entry.

The main page includes the introduction, four scroll-controlled 3D food scenes, quick snacks, hospitality/services, cafe values and closing section. `/?preview=coffee` opens all four scenes together without the introduction.

The opening follows a Chaplin-inspired character who catches a takeaway coffee, sips, and transforms into the Nillu logo. It plays once without preview controls. The story section reuses the original liquid shader to alternate between Kannada and English Nillu lettering. Reduced motion shows a still identity. See `DESIGN-REVIEW.md` for section-by-section decisions and remaining content needs.

## Scroll scenes

- Coffee: falling beans, pour, cup filling.
- Juice: orange slices, blending, tilting jug, glass filling.
- Smoothie bowl: berry base, fruit toppings, granola.
- Dessert: tiramisu layers, cocoa, fork lifting a bite.

Scroll backward to reverse each sequence. The category navigation and Next links move between scenes; animation-stage button rows have been removed. Reduced-motion mode presents finished products in short sections. Reduced-motion scenes use still food images instead of initializing WebGL. Offscreen coffee and juice canvases pause rendering; bowl and dessert canvases mount near the viewport. Bowl and dessert also provide image fallbacks if WebGL fails.

`src/components/Experience.tsx` combines the scenes. Cafe copy and the surrounding page are in `src/App.tsx`; the shared hero story is in `src/data/walkStory.ts`; production enhancement is in `src/lib/enhancePage.ts`; styling is in `src/styles.css`.

## Content and assets

Food imagery and 3D scenes illustrate categories, not actual product photography. The supplied logo is retained. Generated images are saved in `src/assets/product/` as `coffee-v2.webp`, `juice-v2.webp`, `bowl-v2.webp` and `dessert-v2.webp`. Built-in image generation was used. Prompt set: white seamless studio backdrop, premium food editorial lighting, natural textures, no lettering or logos; subjects were a cappuccino with falling beans, orange juice pouring into a glass, a berry smoothie bowl with fruit toppings, and tiramisu with a lifted forkful.

The cafe is opening soon in HSR Layout, Bengaluru. Hours are labelled planned. The owner-supplied Instagram profile is linked. Full address, opening date and other unconfirmed details are not invented. The site has not been deployed by this update.

## Visual verification

`scripts/check-juice.mjs` checks the complete page in local Chrome: food scene stages, reverse scrolling, mobile width and reduced motion. It saves screenshots in `shots/` and reports browser errors. Start the dev server before running `node scripts/check-juice.mjs`.

## GitHub Pages publishing

The Pages site must serve compiled `dist` output, never the source `index.html` that imports `/src/main.tsx`. `.github/workflows/deploy-pages.yml` retains the manual artifact-deployment path: it installs dependencies, builds with Node 22, and publishes `dist` when GitHub Actions runners and workflow-based Pages publishing are available.

GitHub blocked the custom workflow on 22 October 2026 because of an account billing lock. The site was restored by publishing the locally compiled output to `gh-pages`, with Pages configured to publish that branch at `/`. This native Pages deployment succeeds. While this fallback is active, pushing source changes to `main` alone does not update the live site; rebuild and update `gh-pages` as well. The custom artifact workflow is manual-only while this branch publishing path is active, so a source push does not start a runner that is blocked by the billing lock. Once the billing lock is resolved, switch Pages back to the GitHub Actions source, restore the workflow push trigger, and run the workflow. Verify the built-in “pages build and deployment” run and the live HTML after each gh-pages publish.

## Typography and responsive layout

Manrope is used for body text, navigation and headings, with Fraunces italic accents. Fonts are self-hosted in `src/assets/fonts/`, including their original SIL Open Font Licenses. Outfit and Noto Sans Kannada/Telugu preserve the liquid identity. Jost and Cormorant Garamond are retained only for the comparison at `/?preview=type`. There are no Google Fonts network requests. Font sources and the repeatable download script are documented in that asset directory.

`src/responsive.css` applies the approved typography and responsive composition. The hero stacks below 900px; navigation becomes an accessible menu below 640px. Short landscape screens use flowing food scenes rather than tall sticky panels.

Run `node scripts/check-responsive.mjs` against the local server to inspect all sections at seven sizes from 320px to 1920px, including landscape. It checks headline clipping, page width, all five hero phases, local font loading, and the mobile menu. `node scripts/check-scenes.mjs` checks all four food scenes in both scroll directions on phone, tablet and desktop. Screenshots are written to `shots/`. Set `URL` to test another local or published build.

## Search and AI discovery

`npm run build` prerenders the actual home page so page content is available
without JavaScript. It derives first-screen styles from the full compiled CSS,
then loads the remaining stylesheet without blocking the first screen. Preview this production output with `npm run preview`; the
Vite dev server still renders on the client. Search facts and entity markup live
in `src/data/site.ts`, and Vite injects the metadata into the document head.
Crawler discovery files and social assets live in `public/`.

See `SEO-REVIEW.md` for research, verified-fact boundaries, the later Business
Profile/Search Console steps, and validation. Run `node scripts/check-seo.mjs`
against a production preview on port 5180 (override with `URL`). The site remains
opening soon; planned hours are not published as current operating-hours schema.

## Mobile loading and icons

`node scripts/check-mobile-performance.mjs` checks a cold mobile load for deferred
React/3D code and absent hidden-photo downloads, then verifies scene activation,
hero copy and the favicon. Add `--profile` to record a CPU profile.
`node scripts/check-first-paint.mjs` deliberately holds back the full stylesheet
and compares header/hero geometry before and after it arrives.

Normal-motion scene placeholders contain no real food-photo URL in their active
image source. Reduced-motion visitors get still photos; JavaScript-off visitors
get the noscript images; renderer failures get an explicit image fallback. This
avoids both a photograph flash on hard reload and unused startup image downloads.

Regenerate tab icons with `node scripts/prep-favicon.mjs`. The stacked artwork is
kept intact, with the small vertical cafe suffix omitted at tab-icon sizes and an
opaque white tile for dark tabs. `node scripts/prep-search-assets.mjs` also builds
the smaller mobile-canvas logo.

The worker compatibility path is checked with `node scripts/check-walk-fallback.mjs`.
The native controller calls the shared `walkTimeline.ts`/`walkIdentity.ts` story
renderer; the `?preview=walk` study uses the same renderer through React.

See `MOBILE-PERFORMANCE.md` for the latest measured results and validation.

## 2D cafe positioning

The owner has confirmed a planned illustrated 2D store concept. The lead line is
“Step into a sketch. Make a real moment.” The website and search descriptions
state that the cafe is coming soon. The supplied store-design reference is a
concept reference and has not been published as a photograph of Nillu.
