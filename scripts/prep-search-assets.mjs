import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

await mkdir('public/brand', {recursive:true})
await sharp('src/assets/logo-ink.png').resize({width:400}).png({compressionLevel:9}).toFile('public/brand/nillu-logo.png')
await sharp('src/assets/logo-ink.png').resize({width:192}).webp({lossless:true}).toFile('src/assets/logo-small.webp')
await sharp('src/assets/logo-ink.png').resize({width:640}).webp({lossless:true}).toFile('src/assets/logo-canvas-mobile.webp')
const logo=await sharp('src/assets/logo-ink.png').resize({width:370,height:400,fit:'inside'}).toBuffer()
const label=Buffer.from(`<svg width="1200" height="630"><rect width="1200" height="630" fill="white"/><path d="M510 150v330" stroke="#dedede"/><g fill="#0a0a0a" font-family="Arial, sans-serif"><text x="575" y="230" font-size="52" font-weight="600">Nillu Cafe</text><text x="575" y="294" font-size="28">HSR Layout, Bengaluru</text><text x="575" y="364" font-size="22">Coffee. Food. A warm welcome.</text><text x="575" y="430" font-size="20" letter-spacing="3">OPENING SOON</text></g></svg>`)
await sharp(label).composite([{input:logo,left:85,top:115}]).png({compressionLevel:9}).toFile('public/social-preview.png')
