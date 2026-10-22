import puppeteer from 'puppeteer-core'
import assert from 'node:assert/strict'
const url=process.env.URL??'http://127.0.0.1:5204/'
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],defaultViewport:{width:1440,height:900}})
const page=await browser.newPage(),errors=[],externalFonts=[]
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/fonts\.(googleapis|gstatic)\.com/.test(r.url()))externalFonts.push(r.url())})
const sections=['top','about','coffee-preview','juice-preview','bowl-preview','dessert-preview','bites','hospitality','care','visit','pause']
const sizes=[[320,740],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080],[844,390]]
try{
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.goto(url,{waitUntil:'networkidle0'});await page.waitForSelector('#dessert-preview');await page.evaluate(()=>document.fonts.ready)
 const fonts=await page.evaluate(async()=>{await Promise.all([document.fonts.load('500 40px Manrope'),document.fonts.load('italic 400 40px Fraunces'),document.fonts.load('700 40px "Noto Sans Kannada"','ನಿಲ್ಲು'),document.fonts.load('800 40px Outfit')]);return {body:getComputedStyle(document.body).fontFamily,manrope:document.fonts.check('500 40px Manrope'),fraunces:document.fonts.check('italic 400 40px Fraunces'),kannada:document.fonts.check('700 40px "Noto Sans Kannada"','ನಿಲ್ಲು')}})
 assert.equal(await page.$$eval('.demo-steps',els=>els.length),0);assert.equal(await page.$$eval('.demo-bottom a',els=>els.length),4);
 assert(fonts.body.includes('Manrope')&&fonts.manrope&&fonts.fraunces&&fonts.kannada)
 const results=[]
 for(const [width,height] of sizes){
  await page.setViewport({width,height});await page.goto(url,{waitUntil:'networkidle0'});await page.waitForSelector('#dessert-preview');await page.evaluate(()=>document.fonts.ready);
  for(const id of sections){
   await page.$eval(`#${id}`,el=>el.scrollIntoView({block:'start',behavior:'instant'}));await new Promise(r=>setTimeout(r,260));
   const layout=await page.evaluate(id=>{const section=document.getElementById(id),bad=[];for(const el of section.querySelectorAll('h1,h2,h3,p,address')){if(el.closest('#top')&&id==='top'&&!el.closest('.walk-story'))continue;if(!el.checkVisibility())continue;const range=document.createRange();range.selectNodeContents(el);const r=range.getBoundingClientRect();if(r.left<-.5||r.right>innerWidth+.5)bad.push({text:el.textContent,left:r.left,right:r.right})}return {overflow:document.documentElement.scrollWidth>innerWidth,bad}},id)
   assert.equal(layout.overflow,false,`${id}: page overflow at ${width}`);assert.deepEqual(layout.bad,[],`${id}: text clipped at ${width}`)
   const target=id==='top'?'.walk-preview':`#${id}`;await (await page.$(target)).screenshot({path:`shots/responsive-${width}-${height}-${id}.png`})
  }
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await new Promise(r=>setTimeout(r,150));
  if(width<=640){await page.click('.site-menu-toggle');assert.equal(await page.$eval('.site-menu-toggle',e=>e.getAttribute('aria-expanded')),'true');await page.keyboard.press('Escape');assert.equal(await page.$eval('.site-menu-toggle',e=>e.getAttribute('aria-expanded')),'false');await page.click('.site-menu-toggle');await page.click('#main-navigation a[href="#visit"]');assert.equal(await page.$eval('.site-menu-toggle',e=>e.getAttribute('aria-expanded')),'false')}
  results.push({width,height,sections:sections.length});console.log(`Reviewed ${width} × ${height}`)
 }
 // With animations enabled, inspect every hero message at each breakpoint.
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);await page.goto(url+'?preview=walk',{waitUntil:'networkidle0'});await page.waitForSelector('.walk-play:not(:disabled)');await page.click('[data-seek="nillu"]');await page.evaluate(()=>document.fonts.ready)
 for(const [width,height] of sizes){await page.setViewport({width,height});for(const phase of ['walk','coffee','pause','become','nillu']){await page.click(`[data-seek="${phase}"]`);await new Promise(r=>setTimeout(r,1000));const layout=await page.evaluate(()=>{const el=document.querySelector('#walk-title'),range=document.createRange();range.selectNodeContents(el);const text=range.getBoundingClientRect(),copy=document.querySelector('.walk-copy').getBoundingClientRect(),stage=document.querySelector('.walk-stage').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,textFits:text.left>=0&&text.right<=innerWidth,stackFits:innerWidth>900||copy.bottom<=stage.top+1}});assert(!layout.overflow&&layout.textFits&&layout.stackFits,`Hero ${phase} ${width}: ${JSON.stringify(layout)}`);await page.screenshot({path:`shots/hero-${width}-${height}-${phase}.png`})}}
 assert.deepEqual(externalFonts,[]);assert.deepEqual(errors,[]);console.log(JSON.stringify({fonts,results,heroPhases:5,mobileMenu:true,externalFonts,errors},null,2))
}finally{const closing=setTimeout(()=>browser.process()?.kill('SIGKILL'),5000);await browser.close().catch(()=>{});clearTimeout(closing)}
