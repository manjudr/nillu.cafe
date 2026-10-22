// Interim artwork for the six product slots. These are deliberately simple
// line drawings so the layout reads as finished while real photography is
// pending — see PHOTOS.md for the drop-in spec that replaces them.
import { writeFile } from 'node:fs/promises'

const wrap = (id, art) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="${id} illustration placeholder">
  <defs>
    <radialGradient id="mass-${id}" cx="42%" cy="34%" r="72%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="62%" stop-color="#f3f3f3"/>
      <stop offset="100%" stop-color="#e6e6e6"/>
    </radialGradient>
  </defs>
  <circle cx="300" cy="305" r="245" fill="url(#mass-${id})"/>
  <g fill="none" stroke="#0a0a0a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
${art}
  </g>
</svg>
`

const art = {
  coffee: `    <path d="M258 186c-20-24 20-48 0-72"/>
    <path d="M300 176c-20-24 20-48 0-72"/>
    <path d="M342 186c-20-24 20-48 0-72"/>
    <path d="M175 252h220v78a110 110 0 0 1-220 0z"/>
    <path d="M395 276h26a50 50 0 0 1 0 100h-12"/>
    <path d="M146 464h308"/>
    <path d="M186 464a118 30 0 0 0 228 0"/>`,
  juice: `    <path d="M214 180h152l-26 266h-100z"/>
    <path d="M222 252h136"/>
    <path d="M330 180l74-62"/>
    <circle cx="414" cy="246" r="48"/>
    <path d="M414 198v96M366 246h96"/>
    <path d="M240 452h100"/>`,
  bowl: `    <ellipse cx="300" cy="312" rx="152" ry="40"/>
    <path d="M148 312a152 152 0 0 0 304 0"/>
    <path d="M258 456h84"/>
    <circle cx="238" cy="300" r="20"/>
    <circle cx="300" cy="292" r="16"/>
    <circle cx="358" cy="302" r="20"/>
    <path d="M268 324a16 16 0 0 1 28 0"/>
    <path d="M328 322a16 16 0 0 1 28 0"/>`,
  bites: `    <ellipse cx="300" cy="430" rx="176" ry="40"/>
    <path d="M176 404h248L300 230z"/>
    <path d="M202 370h196"/>
    <path d="M238 328l62-52 62 52"/>`,
  cheesecake: `    <path d="M182 404v-86c78-60 178-66 240-46v132z"/>
    <path d="M182 372h240"/>
    <path d="M182 318c78-60 178-66 240-46"/>
    <circle cx="368" cy="238" r="21"/>
    <path d="M368 217c6-16 20-20 30-18"/>`,
  tiramisu: `    <path d="M178 278l122-36 122 36-122 36z"/>
    <path d="M178 278v118l122 38 122-38V278"/>
    <path d="M300 314v120"/>
    <path d="M178 320l122 38M422 320l-122 38"/>
    <path d="M178 358l122 38M422 358l-122 38"/>`,
}

for (const [id, body] of Object.entries(art)) {
  const file = `src/assets/placeholder/${id}.svg`
  await writeFile(file, wrap(id, body))
  console.log(`  ${file}`)
}
