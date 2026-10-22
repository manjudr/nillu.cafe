import puppeteer from 'puppeteer-core'
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],defaultViewport:{width:1440,height:900}})
const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.URL ?? 'http://127.0.0.1:5185/',{waitUntil:'domcontentloaded'});await page.waitForSelector('#dessert-preview');await page.evaluate(()=>document.fonts.ready);
await new Promise(r=>setTimeout(r,2400));await page.screenshot({path:'shots/final-identity-desktop.png'});
const identity=await page.evaluate(()=>({canvas:!!document.querySelector('#hero canvas'),scripts:[...document.querySelectorAll('.identity-caption [lang]')].map(el=>el.textContent),brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.getAttribute('href').slice(1))).map(a=>a.getAttribute('href'))}));
await page.locator('.identity-caption button').click();
const pause=await page.$eval('.identity-caption button',el=>el.getAttribute('aria-pressed'));
const identityFonts=await page.evaluate(()=>({latin:document.fonts.check('800 100px Outfit'),kannada:document.fonts.check('700 100px "Noto Sans Kannada"','ನಿಲ್ಲು'),telugu:document.fonts.check('700 100px "Noto Sans Telugu"','నిల్లు')}));
await page.screenshot({path:'shots/identity-new-type-paused.png'});
if(process.argv.includes('--identity')){const suffix=await page.$eval('.identity-static-suffix',el=>el.textContent);await page.setViewport({width:390,height:844});await page.screenshot({path:'shots/identity-suffix-mobile.png'});console.log(JSON.stringify({suffix,identityFonts,errors}));await browser.close();process.exit(0)}
await page.locator('.identity-caption button').click();
if(process.argv.includes('--navigation')){
 await page.evaluate(()=>window.scrollTo({top:1000,behavior:'instant'}));await new Promise(r=>setTimeout(r,400));
 const down=await page.$eval('.returning-header',el=>el.classList.contains('header-hidden'));
 await page.evaluate(()=>window.scrollTo({top:800,behavior:'instant'}));await new Promise(r=>setTimeout(r,400));
 const up=await page.$eval('.returning-header',el=>el.classList.contains('header-visible'));
 await page.$eval('.scene-skip',el=>el.click());await page.waitForFunction(()=>Math.abs(document.querySelector('#bites').getBoundingClientRect().top)<150,{timeout:15000});
 const skipped=await page.$eval('#bites',el=>Math.abs(el.getBoundingClientRect().top)<150);
 await page.setViewport({width:390,height:844});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await new Promise(r=>setTimeout(r,800));await page.screenshot({path:'shots/refined-mobile.png'});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 await page.$eval('#visit',el=>el.scrollIntoView({behavior:'instant'}));await new Promise(r=>setTimeout(r,400));await page.screenshot({path:'shots/visit-mobile.png'});
 const visit=await page.evaluate(()=>({hours:document.querySelector('.visit-hours p').innerText,careValues:[...document.querySelectorAll('.care-grid h3')].map(el=>el.textContent),sceneHeaders:document.querySelectorAll('.demo-nav').length,emptySocialLinks:document.querySelectorAll('.social-links a').length===0,socialLabels:[...document.querySelectorAll('.social-label')].map(el=>el.textContent),duplicateIdentity:!!document.querySelector('.identity-caption p'),overflow:document.documentElement.scrollWidth>innerWidth}));
 console.log(JSON.stringify({identity,identityFonts,pause,headerHides:down,headerReturns:up,skipScenes:skipped,mobileOverflow:overflow,visit,errors}));await browser.close();process.exit(0)
}
const results=[];
async function stage(id,p){await page.evaluate(({id,p})=>{const el=document.getElementById(id);window.scrollTo({top:el.getBoundingClientRect().top+scrollY+p*(el.offsetHeight-innerHeight),behavior:'instant'})},{id,p});await new Promise(r=>setTimeout(r,1200));}
for(const [id,points] of [['coffee-preview',[.55]],['juice-preview',[.7]],['bowl-preview',[.16,.47,.76,1]],['dessert-preview',[.1,.48,.76,1]]]){
 for(const p of points){await stage(id,p);await page.screenshot({path:`shots/full-${id}-${p}.png`});results.push(await page.evaluate(id=>({id,label:document.querySelector(`#${id} h2`).innerText,overflow:document.documentElement.scrollWidth>innerWidth}),id))}
}
await stage('bowl-preview',.45);await stage('bowl-preview',.85);await stage('bowl-preview',.45);
await page.setViewport({width:390,height:844});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await new Promise(r=>setTimeout(r,1400));await page.screenshot({path:'shots/final-identity-mobile.png'});
for(const id of ['bowl-preview','dessert-preview']){await stage(id,.9);await page.screenshot({path:`shots/full-${id}-mobile.png`});}
const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth}));
await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.reload({waitUntil:'domcontentloaded'});await page.waitForSelector('#dessert-preview');await stage('bowl-preview',0);await page.screenshot({path:'shots/full-reduced.png'});
const reduced=await page.evaluate(()=>({height:document.getElementById('bowl-preview').offsetHeight,label:document.querySelector('#bowl-preview h2').innerText}));
console.log(JSON.stringify({identity,pause,results,mobile,reduced,errors},null,2));await browser.close()
