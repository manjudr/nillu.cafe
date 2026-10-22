import puppeteer from 'puppeteer-core'
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],defaultViewport:{width:1440,height:900}})
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5180/?preview=coffee',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,2000));
for(const [name,p] of [['beans',.2],['pour',.55],['finish',1]]){await page.evaluate(p=>window.scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*p,behavior:'instant'}),p);await new Promise(r=>setTimeout(r,700));await page.screenshot({path:`shots/coffee-${name}.png`})}
const desktop=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,canvas:!!document.querySelector('canvas')}));
await page.setViewport({width:390,height:844});await page.evaluate(()=>window.scrollTo(0,0));await new Promise(r=>setTimeout(r,700));await page.screenshot({path:'shots/coffee-mobile.png'});
const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth}));
console.log(JSON.stringify({desktop,mobile,errors}));await browser.close()
