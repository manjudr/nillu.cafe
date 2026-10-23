import puppeteer from 'puppeteer-core'
import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
const url=process.env.URL??'http://127.0.0.1:5180/'
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']})
try{
 for(const width of [390,1440]){
  const page=await browser.newPage();await page.setViewport({width,height:900});await page.setCacheEnabled(false)
  let release;const held=new Promise(resolve=>release=resolve)
  await page.setRequestInterception(true)
  page.on('request',async request=>{if(/\/assets\/index-.*\.css$/.test(request.url()))await held;await request.continue()})
  const navigation=page.goto(url,{waitUntil:'networkidle0'})
  const boxes=()=>page.evaluate(()=>Object.fromEntries(['.site-header','.brand-link','.walk-location','#walk-title','.walk-support','.walk-stage','.walk-discover'].map(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return[selector,[r.x,r.y,r.width,r.height].map(n=>Math.round(n))]})))
  try{
   await page.waitForSelector('#walk-title');await page.evaluate(()=>document.fonts.ready)
   const before=await boxes()
   assert.equal(await page.$eval('#coffee-preview .scene-fallback',el=>getComputedStyle(el).visibility),'hidden')
   await mkdir('shots',{recursive:true});await page.screenshot({path:`shots/first-paint-critical-${width}.png`})
   release();await navigation
   assert.deepEqual(await boxes(),before,'Header or hero shifts when the full stylesheet arrives')
   await page.screenshot({path:`shots/first-paint-full-${width}.png`})
   console.log(`First-screen CSS and no photo flash verified at ${width}`)
  }finally{release();await page.close()}
 }
}finally{await browser.close()}
