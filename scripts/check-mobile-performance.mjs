import puppeteer from 'puppeteer-core'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
const url = process.env.URL ?? 'http://127.0.0.1:5180/'
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']})
const page=await browser.newPage(),errors=[],requests=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('request',r=>requests.push(r.url()))
const profile=process.argv.includes('--profile')
try{
 await page.setViewport({width:390,height:844})
 await page.setCacheEnabled(false)
 const client=await page.createCDPSession()
 if(profile){await client.send('Emulation.setCPUThrottlingRate',{rate:4});await client.send('Profiler.enable');await client.send('Profiler.start')}
 await page.goto(url,{waitUntil:'networkidle0'})
 await page.waitForSelector('#explore')
 await page.waitForSelector('.walk-stage canvas[data-ready="true"]')
 if(profile){
  await new Promise(r=>setTimeout(r,5000))
  const {profile:data}=await client.send('Profiler.stop')
  const times=new Map();data.samples.forEach((id,i)=>times.set(id,(times.get(id)??0)+data.timeDeltas[i]))
  console.log(JSON.stringify(data.nodes.map(n=>({...n.callFrame,ms:Math.round((times.get(n.id)??0)/1000)})).sort((a,b)=>b.ms-a.ms).slice(0,25),null,2))
  await mkdir('shots',{recursive:true});await writeFile('shots/mobile-cpu-profile.json',JSON.stringify(data))
 }
 assert.equal(await page.$eval('#coffee-preview .scene-fallback',el=>getComputedStyle(el).visibility),'hidden','A still photo flashes before the live scene loads')
 const icon=await page.$eval('link[rel="icon"][type="image/png"]',el=>el.href)
 assert(icon.includes('favicon-32.png?v=2'))
 assert(!requests.some(x=>/(coffee|juice|bowl|dessert)-v2-/.test(x)), 'Hidden food photos downloaded during startup')
 const renderer=await page.$eval('.walk-stage canvas',el=>el.dataset.renderer)
 assert.equal(renderer,'worker','Supported browsers should draw the hero off the main thread')
 const startup=requests.filter(x=>x.endsWith('.js'))
 assert(!startup.some(x=>/\/(client-|react-main-|enhanceScenes-)/.test(x)), 'React downloaded during startup')
 assert(!startup.some(x=>/Experience-/.test(x)), 'Offscreen section controls downloaded during startup')
 assert(!startup.some(x=>/react-three-fiber|Canvas-|foodMotion-|LiquidHero-/.test(x)), '3D code downloaded before approaching a scene')
 await page.$eval('#coffee-preview',el=>el.scrollIntoView({behavior:'instant'}))
 await page.waitForSelector('#coffee-preview canvas')
 assert(requests.some(x=>/CoffeePreviewCanvas-/.test(x)), 'Coffee graphics failed to load on approach')
 assert.deepEqual(errors,[])
 await page.goto(`${url}?preview=walk`,{waitUntil:'networkidle0'})
 await page.waitForSelector('.walk-play:not(:disabled)')
 await page.click('[data-seek="pause"]')
 await page.waitForFunction(()=>document.querySelector('#walk-title').textContent.includes('A little joy.'))
 await page.click('.walk-play');await new Promise(r=>setTimeout(r,1600));await page.click('.walk-play')
 await mkdir('shots',{recursive:true});await page.screenshot({path:'shots/hero-smile-mobile.png'})
 console.log(JSON.stringify({startupScripts:startup,graphicsLoadOnApproach:true,joyMessage:true,renderer,errors},null,2))
}finally{await browser.close()}
