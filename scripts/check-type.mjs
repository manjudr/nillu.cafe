import puppeteer from 'puppeteer-core'
import assert from 'node:assert/strict'
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,defaultViewport:{width:1440,height:1000}})
const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message))
try{
 await page.goto('http://127.0.0.1:5204/?preview=type',{waitUntil:'networkidle0'});await page.waitForSelector('.type-proposed');await page.evaluate(()=>document.fonts.ready)
 const fonts=await page.evaluate(()=>({manrope:document.fonts.check('500 48px "Manrope"'),fraunces:document.fonts.check('italic 400 48px "Fraunces"')}));assert(fonts.manrope&&fonts.fraunces)
 await page.screenshot({path:'shots/type-comparison.png',fullPage:true});await page.click('.type-switch button:last-child');assert.equal(await page.$eval('.type-proposed em',e=>getComputedStyle(e).fontFamily.includes('Manrope')),true);await page.screenshot({path:'shots/type-sans.png'});await page.click('.type-switch button:first-child')
 await page.setViewport({width:390,height:844});await page.$eval('.type-proposed',e=>e.scrollIntoView());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'shots/type-mobile.png'});assert.deepEqual(errors,[])
 await page.goto('http://127.0.0.1:5204/',{waitUntil:'domcontentloaded'});await page.waitForSelector('.walk-copy');assert.equal(await page.$eval('body',e=>getComputedStyle(e).fontFamily.includes('Manrope')),true);assert.equal(await page.$eval('.walk-copy h1',e=>getComputedStyle(e).fontFamily.includes('Manrope')),true)
 console.log(JSON.stringify({fonts,toggle:true,mobile:true,approvedPairingApplied:true,errors}))
}finally{await browser.close()}
