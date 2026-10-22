import * as THREE from 'three'

export type WordTexture = { texture: THREE.CanvasTexture; aspect: number }

/**
 * Rasterises a word to a luminance map the shader treats as glyph coverage:
 * white where ink should be, black elsewhere. The canvas is trimmed to the
 * glyph bounding box so `aspect` describes the letters, not the padding —
 * which matters because Kannada and Latin set to very different proportions.
 */
export function makeWordTexture(
  text: string,
  fontFamily: string,
  weight = 500,
  targetWidth = 1600,
  suffix = '',
): WordTexture {
  const probe = document.createElement('canvas').getContext('2d')
  if (!probe) throw new Error('2d canvas unavailable')

  const REF = 400
  probe.font = `${weight} ${REF}px ${fontFamily}`
  const m = probe.measureText(text)

  // actualBoundingBox* covers Kannada's above-line vowel signs and below-line
  // conjuncts, which font ascent/descent alone would clip.
  const inkW = Math.max(1, m.actualBoundingBoxLeft + m.actualBoundingBoxRight)
  const inkH = Math.max(1, m.actualBoundingBoxAscent + m.actualBoundingBoxDescent)

  const scale = targetWidth / inkW
  const pad = inkH * scale * 0.1
  const W = Math.ceil(inkW * scale + pad * 2)
  const suffixSize = REF * scale * 0.22
  probe.font = `${weight} ${suffixSize}px ${fontFamily}`
  const suffixMetrics = suffix ? probe.measureText(suffix) : null
  const suffixAscent = suffixMetrics?.actualBoundingBoxAscent ?? 0
  const suffixDescent = suffixMetrics?.actualBoundingBoxDescent ?? 0
  const suffixGap = inkH * scale * 0.12
  const H = Math.ceil(inkH * scale + pad * 2 + (suffix ? suffixGap + suffixAscent + suffixDescent : 0))

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, W, H)

  const size = REF * scale
  ctx.font = `${weight} ${size}px ${fontFamily}`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(text, pad + m.actualBoundingBoxLeft * scale, pad + m.actualBoundingBoxAscent * scale)

  if (suffix && suffixMetrics) {
    ctx.font = `${weight} ${suffixSize}px ${fontFamily}`
    // Align the smaller cafe suffix with the right edge of the name.
    const suffixX = W - pad - suffixMetrics.actualBoundingBoxRight
    ctx.fillText(suffix, suffixX, pad + inkH * scale + suffixGap + suffixAscent)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.colorSpace = THREE.NoColorSpace // raw luminance, not sRGB-decoded
  texture.needsUpdate = true

  return { texture, aspect: W / H }
}

/** Resolves once the given families can actually shape the given sample text. */
export async function waitForFonts(specs: Array<[string, string, number?]>) {
  if (!('fonts' in document)) return
  await Promise.all(
    specs.map(([family, sample, weight = 500]) =>
      document.fonts.load(`${weight} 400px ${family}`, sample).catch(() => undefined),
    ),
  )
  await document.fonts.ready
}
