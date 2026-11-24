import puppeteer from 'puppeteer-core'
import assert from 'node:assert/strict'
const capture=!process.argv.includes('--no-shots')
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']})
const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message))
try{
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
 for(const [width,height] of [[390,844],[768,1024],[1440,900]]){
  await page.setViewport({width,height});await page.goto(process.env.URL??'http://127.0.0.1:5204/',{waitUntil:'networkidle0'});await page.$eval('#explore',el=>el.scrollIntoView({behavior:'instant'}));await page.waitForSelector('#explore[data-ready="true"]');await page.evaluate(()=>document.fonts.ready)
  for(const id of ['coffee-preview','juice-preview','bowl-preview','dessert-preview']){
   const labels=[];
   const compact = await page.$eval('#explore', el => el.classList.contains('experience-short'));
   for(const progress of [.18,.55,.95,.18]){
    await page.$eval(`#${id}`, (el, p) => scrollTo({
      top: el.getBoundingClientRect().top + scrollY + p * (el.offsetHeight - innerHeight),
      behavior: 'instant',
    }), progress)
    // Both layouts animate the scroll indicator. Compact panels keep the final caption.
    await page.waitForFunction((id, progress) => {
      const track = document.querySelector(`#${id} .demo-track`)
      return Math.abs(parseFloat(track.firstElementChild.style.width) / 100 - progress) < .03
    }, {}, id, progress)
    const early = progress === .18
    const expected = compact || progress === .95 ? 4 : ['coffee-preview','juice-preview'].includes(id) ? (early ? 2 : 3) : (early ? 1 : 2)
    await page.waitForFunction((id, chapter) => document.querySelector(`#${id} .demo-copy`)?.dataset.chapter === String(chapter), {}, id, expected)
    labels.push(await page.$eval(`#${id} h2`, el => el.innerText))
    if(capture && progress !== .18) await page.screenshot({path:`shots/motion-${width}-${id}-${progress}.png`})
   }
   assert.equal(labels[0],labels[3],`Reverse scroll ${id}`);if (compact) assert.equal(new Set(labels).size, 1, `Stable caption ${id}`); else assert.notEqual(labels[0],labels[2],`Scene advances ${id}`);assert.equal(await page.$$eval(`#${id} .demo-steps`,e=>e.length),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  }
  console.log(`Motion and reverse scroll verified at ${width}`)
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({scenes:4,widths:3,reverse:true,errors}))
}finally{const closing=setTimeout(()=>browser.process()?.kill('SIGKILL'),5000);await browser.close().catch(()=>{});clearTimeout(closing)}
