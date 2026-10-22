// Turns assets/logo.PNG (white letters on opaque black) into web-ready marks:
// the artwork becomes ink-coloured pixels on a transparent background, trimmed
// to the glyphs so layout can control its own padding.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'assets/logo.PNG'
const OUT = 'src/assets'
const INK = { r: 10, g: 10, b: 10 }

await mkdir(OUT, { recursive: true })

// The source luminance IS the coverage mask: white glyph = opaque, black field = clear.
const { data: mask, info } = await sharp(SRC)
  .removeAlpha()
  .greyscale()
  .trim({ background: '#000000', threshold: 12 })
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height } = info
console.log(`trimmed: ${width}x${height} (from 1714x4096)`)

const tinted = (rgb, name, scale) =>
  sharp({ create: { width, height, channels: 3, background: rgb } })
    .joinChannel(mask, { raw: { width, height, channels: 1 } })
    .resize({ width: Math.round(width * scale), withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${name}`)
    .then((r) => console.log(`  ${name}  ${r.width}x${r.height}  ${(r.size / 1024).toFixed(1)} KB`))

await tinted(INK, 'logo-ink.png', 1)                      // full lockup, ink on transparent
await tinted({ r: 255, g: 255, b: 255 }, 'logo-paper.png', 1) // inverse, for dark panels

// Square favicon: crop the NILLU block away from the vertical "café", then pad.
const side = Math.max(width, height)
await sharp({ create: { width, height, channels: 3, background: INK } })
  .joinChannel(mask, { raw: { width, height, channels: 1 } })
  .extend({
    top: Math.floor((side - height) / 2), bottom: Math.ceil((side - height) / 2),
    left: Math.floor((side - width) / 2), right: Math.ceil((side - width) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .resize(400, 400)
  .extend({ top: 56, bottom: 56, left: 56, right: 56, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('public/icon.png')
  .then((r) => console.log(`  public/icon.png  ${r.width}x${r.height}  ${(r.size / 1024).toFixed(1)} KB`))
