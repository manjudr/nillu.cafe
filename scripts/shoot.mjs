// Visual QA harness: drives the real Chrome on this machine with genuine rAF
// timing so Motion animations settle and the WebGL hero actually draws.
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = process.env.URL ?? 'http://localhost:5180/'
const OUT = process.env.OUT ?? 'shots'
const WIDTH = Number(process.env.W ?? 1440)
const HEIGHT = Number(process.env.H ?? 900)

await mkdir(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--hide-scrollbars',
    '--no-first-run',
    '--disable-features=IsolateOrigins',
  ],
  defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
})

const page = await browser.newPage()

const errors = []
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => {
  const t = m.type()
  if (t === 'error' || t === 'warning') errors.push(`${t}: ${m.text()}`.slice(0, 400))
})
page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`))

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// Let the hero reach the middle of its "formed" hold before capturing.
await wait(4200)
await page.screenshot({ path: `${OUT}/01-hero.png` })

// Report what the WebGL layer actually produced.
const canvasInk = await page.evaluate(() => {
  const c = document.querySelector('canvas')
  if (!c) return { ok: false, reason: 'no canvas' }
  const gl = c.getContext('webgl2') ?? c.getContext('webgl')
  if (!gl) return { ok: false, reason: 'no gl context' }
  return { ok: true, w: c.width, h: c.height, css: [c.clientWidth, c.clientHeight] }
})

// Walk the page, pausing at each section so reveals finish.
const sections = await page.evaluate(() =>
  [...document.querySelectorAll('section, footer')].map((s, n) => s.id || `panel-${n}`),
)

let i = 2
for (let n = 0; n < sections.length; n++) {
  if (sections[n] === 'hero') continue
  await page.evaluate((idx) => {
    const el = [...document.querySelectorAll('section, footer')][idx]
    el?.scrollIntoView({ behavior: 'instant', block: 'center' })
  }, n)
  await wait(1500)
  await page.screenshot({ path: `${OUT}/${String(i).padStart(2, '0')}-${sections[n]}.png` })
  i++
}

const height = await page.evaluate(() => document.documentElement.scrollHeight)

await browser.close()

console.log(JSON.stringify({ canvasInk, sections, pageHeight: height, errors }, null, 2))
