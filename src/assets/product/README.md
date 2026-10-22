# Product images — drop them in here

This folder is the image slot for the five product panels. (The two interior
pictures in "The room" are a separate folder with a different brief —
`src/assets/room/`. Those must be real photographs; these need not be.)

Nothing else needs to change: drop a file in, it appears on the page; delete
it, the panel falls back to its typographic card.

## How it works

Name the file after the **product id** in `src/data/menu.ts`:

| File to add        | Panel            |
| ------------------ | ---------------- |
| `coffee.webp`      | Coffee           |
| `juice.webp`       | Fresh juice      |
| `bowl.webp`        | Smoothie bowls   |
| `bites.webp`       | Quick bites      |
| `desserts.webp`    | Desserts         |

`.webp`, `.png`, `.jpg` and `.avif` all work. `.webp` is preferred — same
quality, roughly a third of the weight.

Partial is fine. Three images and two typographic cards looks deliberate, not
broken. Do **not** feel obliged to fill all five.

**Restart the dev server after adding a file.** The folder is read by Vite at
start-up, so a brand-new file will not show until you stop `npm run dev` and
start it again. Replacing a file that is already there hot-reloads normally.

---

## The spec the panels are built for

| | |
| --- | --- |
| **Aspect** | **Square, 1:1.** The card is `aspect-square`. Anything else gets cropped. |
| **Size** | 1600 × 1600 px. 1200 × 1200 is the floor; above 2000 is wasted weight. |
| **Weight** | Under ~400 kB each. Re-encode to WebP q80 if it comes out heavier. |
| **Background** | **Pure white, `#FFFFFF`**, edge to edge. The card background is white, so a white-background image dissolves into the page instead of sitting in a grey box. |
| **Safe area** | Keep the subject inside the **middle 70%**. The panel scales the image to 118% and drifts it vertically as you scroll, so the top and bottom ~15% get cropped at the extremes of that travel. |
| **Subject** | **One** thing, centred. Not a flat-lay spread, not a table scene, not a person, not an interior. One cup. One glass. One bowl. |
| **Light** | Soft, diffuse, from the **upper left**, with a soft shadow falling to the lower right. Same direction in all five, or they stop looking like a set. |
| **Framing** | Either straight-on at table height, or directly top-down. Pick one and use it for all five. Mixed angles read as stock. |

## The look — this is the part that matters

The site is strictly monochrome: ink `#0a0a0a` on paper `#FFFFFF`, a light
serif display face, a lot of empty space, thin 1px rules. It is quiet and
editorial. A bright, saturated, warm-toned food photo will look like it was
pasted in from a delivery app.

**Pick one of these two and use it for all five images.**

### Option A — muted monochrome (recommended)

Near-greyscale. A trace of warmth is fine; saturation stays very low. The
images read as part of the ink-and-paper palette rather than as decoration.
This is the safer choice and it is what the rest of the page is designed for.

> Add to any prompt: *desaturated, near-monochrome, muted warm greys, no
> vivid colour, editorial black-and-white photography feel*

### Option B — one colour subject per white field

Full natural colour, but only the food is coloured — everything else is white.
Striking, and it makes the food the only colour on the whole site. Riskier: if
even one image has a busy or warm background it breaks.

> Add to any prompt: *natural colour, restrained and not oversaturated, pure
> white background, no props, no colour anywhere except the subject itself*

### In both cases, avoid

- Wooden tables, linen, marble, scattered beans, scattered crumbs, cutlery
  arranged artfully — no props at all. White field only.
- Hands, people, logos, text, watermarks.
- Hard shadows, heavy vignette, dramatic side light, dark/moody grading.
- Steam drawn as white smoke (it goes invisible against a white background).
- Wide-angle distortion or extreme close-up macro.

---

## Prompts you can paste straight into ChatGPT / Gemini / Midjourney

Append your chosen look line from Option A or B to each one, and add
`square 1:1, 1600x1600` if the tool needs the size spelled out.

**coffee**
> A single cup of black coffee in a plain white ceramic cup on a matching
> saucer, photographed from directly above, centred on a pure white seamless
> background. Soft diffuse light from the upper left, soft shadow to the lower
> right. No props, no table, no beans, no text. Minimal editorial style.

**juice**
> A single tall clear glass of fresh fruit juice, straight-on at table height,
> centred on a pure white seamless background. Soft diffuse light from the
> upper left. No props, no fruit beside the glass, no straw, no text. Minimal
> editorial style.

**bowl**
> A single smoothie bowl in a plain white ceramic bowl, photographed from
> directly above, centred on a pure white seamless background. Thick smooth
> surface with a few simple toppings arranged on top. Soft diffuse light from
> the upper left. No props, no spoon, no table, no text. Minimal editorial
> style.

**bites**
> A single small plain white plate holding one simple baked item, straight-on
> at table height, centred on a pure white seamless background. Soft diffuse
> light from the upper left. No props, no cutlery, no table, no text. Minimal
> editorial style.

**desserts**
> A single slice of cheesecake on a plain white plate, straight-on at table
> height, centred on a pure white seamless background. Soft diffuse light from
> the upper left, soft shadow to the lower right. No props, no fruit garnish,
> no cutlery, no table, no text. Minimal editorial style.

Order matters less than consistency — generate all five in the same session,
with the same look line, so they come out as a set.

---

## One thing to decide before launch

These images will not be photographs of Nillu's own food. That is normal and
nobody will be misled by a cup of coffee looking like a cup of coffee — but
the `desserts` image is the one to watch, because the panel names four real
things we sell beside it, and a visitor may reasonably read the picture as one
of them.

Two ways to stay straight with people:

1. Replace them with real photographs of the counter as soon as there are any.
   The folder works the same way; just overwrite the files.
2. Until then, keep the images generic — a slice of plain cheesecake rather
   than a specific one of ours.

If you would rather say so on the page, set `credit: true` on an item in
`src/data/menu.ts` and the panel prints a small line beneath the card.
