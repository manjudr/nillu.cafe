/**
 * RULE FOR THIS FILE — nothing here may assert a fact about how the café
 * actually operates unless Manjunath has confirmed it.
 *
 * That means no ingredients, no brew or bake methods, no equipment, no
 * quantities, no timings, no shelf life, no facilities, and no allergen or
 * dietary statements. Those read as fact to a visitor and would be false if
 * guessed. Statements of intent ("we would rather make fewer things well")
 * are fine, because they cannot be wrong.
 *
 * Also: no prices and no ordering anywhere on this site.
 *
 * Unconfirmed values are written in [square brackets] so they are visibly
 * provisional on the page rather than quietly wrong.
 */

/** One line on the board: a thing you can actually ask for. */
export type Line = {
  name: string
  /** How it is served — hot/iced, size, season. Set in italics beside the name. */
  qualifier?: string
  /** Omitted until there is something true to say about it. */
  desc?: string
}

export type Item = {
  id: string
  kn: string
  en: string
  /** What the category is. Must not describe how it is made. */
  lead: string
  /** Only names Manjunath has confirmed. Empty where he has not. */
  lines: Line[]
  /** Omitted until the real process is confirmed. */
  craft?: string
  /**
   * What the picture shows, for screen readers. Only needed once an image
   * exists for this item — describe the picture as it is, not as a claim
   * about our kitchen. Leave unset and the image is treated as decorative,
   * which is fair: the heading beside it already names the product.
   */
  alt?: string
  /**
   * Set true to print a small line under the card saying the picture is an
   * illustration rather than a photograph of our own food. Worth doing on
   * any panel where a visitor might read the picture as one of the named
   * items — `desserts` especially.
   */
  credit?: boolean
}

/*
 * THE PICTURES
 *
 * There is no `image` field here on purpose, because nothing needs wiring up
 * by hand. Drop a file into `src/assets/product/` named after the `id` below
 * — coffee.webp, juice.webp, bowl.webp, bites.webp, desserts.webp — and that
 * panel picks it up. Delete the file and the panel goes back to its
 * typographic card. Partial is fine; three images and two cards reads as a
 * decision rather than a gap.
 *
 * `src/assets/product/README.md` has the size, the format, the safe area,
 * the house look, and prompts ready to paste into an image generator. Read it
 * before generating anything, or the images will not sit in the page.
 */

export const ITEMS: Item[] = [
  {
    id: 'coffee',
    kn: 'ಕಾಫಿ',
    en: 'Coffee',
    lead: 'The reason most people stop in the first place.',
    lines: [],
  },
  {
    id: 'juice',
    kn: 'ಹಣ್ಣಿನ ರಸ',
    en: 'Fresh juice',
    lead: 'Fruit, in a glass, for the days Bengaluru is too warm for coffee.',
    lines: [],
  },
  {
    id: 'bowl',
    kn: 'ಸ್ಮೂದಿ ಬೌಲ್',
    en: 'Smoothie bowls',
    lead: 'Thick enough to need a spoon. Breakfast if you want it to be.',
    lines: [],
  },
  {
    id: 'bites',
    kn: 'ತಿಂಡಿ',
    en: 'Quick bites',
    lead: 'Small plates for a short stop, or for a long one.',
    lines: [],
  },
  {
    id: 'desserts',
    kn: 'ಸಿಹಿತಿಂಡಿ',
    en: 'Desserts',
    lead: 'The reason to look at the counter on your way past.',
    // Confirmed by Manjunath. No descriptions yet, so the names stand alone
    // rather than carrying a guess about how each one is made.
    lines: [
      { name: 'Cheesecake' },
      { name: 'Tiramisu' },
      { name: 'Muffins' },
      { name: 'Cupcakes' },
    ],
    // This panel names four real things beside the picture, so a visitor
    // could reasonably read the picture as one of them. Delete this line
    // once the image is a photograph of our own counter.
    credit: true,
  },
]

/**
 * The three things the room is built around — named by Manjunath.
 * These are statements of intent, not claims of fact, which is what makes
 * them safe to publish before anything else is confirmed.
 *
 * TODO — Kannada needs a native read before launch.
 */
export const PRINCIPLES = [
  {
    kn: 'ಗುಣಮಟ್ಟ',
    en: 'Quality',
    note: 'We would rather make fewer things and make them properly.',
  },
  {
    kn: 'ಆತಿಥ್ಯ',
    en: 'Hospitality',
    note: 'You are a guest, not a cover. The table is yours for as long as you want it.',
  },
  {
    kn: 'ಶುಚಿತ್ವ',
    en: 'Hygiene',
    note: 'A clean kitchen is not a feature to advertise. It is the floor we hold to.',
  },
]

/**
 * The practical answers.
 *
 * TODO — every answer below is unconfirmed and shows in brackets on the page.
 * Replace the bracketed text with the real answer, or delete the entry.
 */
export const GOOD_TO_KNOW = [
  { q: 'Seating', a: '[How many seats, and what kind of tables?]' },
  { q: 'Laptops', a: '[Welcome, or not? Are there plug points?]' },
  { q: 'Wifi', a: '[Free, paid, or none?]' },
  { q: 'Milk', a: '[Which milks are available besides full cream?]' },
  { q: 'Kitchen', a: '[Vegetarian? Eggs? Anything else people should know?]' },
  { q: 'Parking', a: '[Two-wheelers and cars — where?]' },
]

/* TODO — confirm with Manjunath before launch. */
export const DETAILS = {
  addressLines: ['[Street address]', 'HSR Layout, Sector [—]', 'Bengaluru 560102'],
  hours: [
    { days: 'Monday — Friday', time: '[Opening — closing]' },
    { days: 'Saturday — Sunday', time: '[Opening — closing]' },
  ],
  mapUrl: 'https://maps.google.com/?q=HSR+Layout+Bengaluru',
  /* TODO — confirm these exist before linking to them. */
  instagram: { handle: '@nillu.cafe', url: 'https://instagram.com/nillu.cafe' },
  email: 'hello@nillu.cafe',
}
