/**
 * Pictures are picked up from their folder by filename, not wired in by hand.
 *
 * Drop a file into the folder named after the slot and it appears on the page;
 * remove it and the page falls back to what it shows without one. No code
 * change either way, and partial coverage is a supported state rather than a
 * missing asset.
 *
 *   src/assets/product/   coffee, juice, bowl, bites, desserts
 *   src/assets/room/      wide, counter
 *
 * Each folder has a README.md with the size, format and look that slot is
 * built for. They are not the same brief — read the right one.
 *
 * Note for whoever adds the first file: Vite reads these folders when the dev
 * server starts, so a brand-new filename needs a restart. Overwriting a file
 * that is already there hot-reloads normally.
 */

/** Strips the directory and the extension, leaving the slot id. */
const byId = (files: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(files).map(([path, url]) => [
      path.split('/').pop()!.replace(/\.[^.]+$/, ''),
      url,
    ]),
  )

// Vite resolves these at build time by reading the pattern as source text, so
// each one has to be written out in full. Pulling the extension list into a
// shared constant looks tidier and silently matches nothing.
export const PRODUCT_IMAGES = byId(
  import.meta.glob('../assets/product/*.{webp,png,jpg,jpeg,avif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }) as Record<string, string>,
)

export const ROOM_IMAGES = byId(
  import.meta.glob('../assets/room/*.{webp,png,jpg,jpeg,avif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }) as Record<string, string>,
)

/** `id` is the product id in src/data/menu.ts. */
export const imageFor = (id: string): string | undefined => PRODUCT_IMAGES[id]

/** `id` is `wide` or `counter` — see src/assets/room/README.md. */
export const roomImageFor = (id: string): string | undefined => ROOM_IMAGES[id]
