import puppeteer from 'puppeteer-core'
import assert from 'node:assert/strict'
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
try{
 for(const reduced of [false,true]){
  const page=await browser.newPage(),errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  await page.evaluateOnNewDocument(()=>Object.defineProperty(HTMLCanvasElement.prototype,'transferControlToOffscreen',{value:undefined,configurable:true}))
  await page.setViewport({width:390,height:844})
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:reduced?'reduce':'no-preference'}])
  await page.goto(process.env.URL??'http://127.0.0.1:5180/',{waitUntil:'networkidle0'})
  await page.waitForSelector('.walk-stage canvas[data-ready="true"][data-renderer="main"]')
  if(reduced)await page.waitForFunction(()=>document.querySelector('#walk-title').textContent.includes('Make a real moment.'))
  else await page.waitForFunction(()=>document.querySelector('#walk-title').textContent.includes('A reason'))
  assert.deepEqual(errors,[])
  console.log(`Main-thread compatibility renderer passed; reduced motion ${reduced}`)
  await page.close()
 }
}finally{await browser.close()}
