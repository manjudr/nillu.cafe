import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const url = process.env.URL ?? 'http://127.0.0.1:5180/'
const html = await (await fetch(url)).text()
assert(html.includes('id="dessert-preview"'), 'Food content missing from initial HTML')
assert(html.includes('Our welcome invites you to stay.'), 'Story missing from initial HTML')
assert(!html.includes('/src/assets/'), 'Source asset URLs leaked into production HTML')
assert(!html.includes('<!--$!-->'), 'A server-rendered section failed')
const robots = await (await fetch(new URL('robots.txt', url))).text()
assert(robots.includes('User-agent: OAI-SearchBot\nAllow: /'))
assert(robots.includes('Sitemap: https://nillu.cafe/sitemap.xml'))
const sitemap = await (await fetch(new URL('sitemap.xml', url))).text()
assert(sitemap.includes('<loc>https://nillu.cafe/</loc>'))
assert(!sitemap.includes('?preview='))
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],
})
const results = []
try {
  for (const {javascript, reduced} of [{javascript:false,reduced:false},{javascript:true,reduced:false},{javascript:true,reduced:true}]) {
    const page = await browser.newPage()
    const errors = [], failedResources = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
    page.on('response', r => { if (r.status() >= 400) failedResources.push(`${r.status()} ${r.url()}`) })
    await page.setJavaScriptEnabled(javascript)
    if (reduced) await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])
    await page.setViewport({width:390,height:844})
    await page.goto(url, {waitUntil:'networkidle0'})
    if (javascript) await page.waitForSelector('.walk-stage canvas')
    const facts = await page.evaluate(() => ({
      title: document.title,
      titleCount: document.querySelectorAll('title').length,
      descriptionCount: document.querySelectorAll('meta[name="description"]').length,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      headings: [...document.querySelectorAll('h1')].map(el => el.textContent),
      schema: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent),
      storyVisible: getComputedStyle(document.querySelector('#about>div')).opacity,
      brokenImages: [...document.images].filter(i => !i.loading && (!i.complete || !i.naturalWidth)).map(i=>i.src),
      overflow: document.documentElement.scrollWidth > innerWidth,
    }))
    assert.equal(facts.titleCount, 1)
    assert.equal(facts.descriptionCount, 1)
    assert.equal(facts.canonical, 'https://nillu.cafe/')
    assert.equal(facts.headings.length, 1)
    assert(facts.headings[0].includes('Nillu Cafe in HSR Layout'))
    assert.equal(facts.schema['@graph'].length, 3)
    assert(!JSON.stringify(facts.schema).includes('openingHours'), 'Planned hours must not become operating hours')
    assert.deepEqual(facts.brokenImages, [])
    assert.equal(facts.overflow, false)
    if (!javascript) assert.equal(facts.storyVisible, '1')
    await page.$eval('#visit', el => el.scrollIntoView())
    if (javascript) await new Promise(resolve => setTimeout(resolve,1000))
    assert.deepEqual(errors, [])
    assert.deepEqual(failedResources, [])
    results.push({javascript, reduced, ...facts, errors, failedResources})
    await mkdir('shots', {recursive:true})
    await page.screenshot({path:`shots/seo-mobile-js-${javascript}-reduced-${reduced}.png`})
    if (javascript) {
      await page.goto(`${url}?preview=walk`, {waitUntil:'networkidle0'})
      assert(await page.$('meta[name="robots"][content="noindex, follow"]'))
      assert.equal(await page.$$eval('h1', els => els.length), 1)
      await page.goto(`${url}?preview=coffee`, {waitUntil:'networkidle0'})
      await page.waitForSelector('#dessert-preview')
      assert(await page.$('meta[name="robots"][content="noindex, follow"]'))
    }
    await page.close()
  }
  for (const asset of ['social-preview.png','brand/nillu-logo.png']) {
    const response = await fetch(new URL(asset,url))
    assert.equal(response.status,200)
    assert(response.headers.get('content-type')?.startsWith('image/'))
  }
  const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'))
  assert(Object.keys(manifest).length > 0)
  await writeFile('shots/seo-checks.json',JSON.stringify(results,null,2))
  console.log(JSON.stringify(results,null,2))
} finally { await browser.close() }
