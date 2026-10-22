import puppeteer from 'puppeteer-core'
import assert from 'node:assert/strict'
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,defaultViewport:{width:1440,height:900}})
const page=await browser.newPage(),errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('pageerror',e=>errors.push(e.message))
try{
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
 await page.goto(process.env.URL??`http://127.0.0.1:5193/${(process.argv.includes('--main')||process.argv.includes('--story'))?'':'?preview=walk'}`,{waitUntil:'domcontentloaded'});if(process.argv.includes('--story')){
  await page.waitForSelector('.story-liquid-word canvas');await page.evaluate(()=>document.fonts.ready);
  await page.$eval('.story-liquid-word',e=>e.scrollIntoView({block:'center'}));
  await new Promise(r=>setTimeout(r,3000));const word=await page.$('.story-liquid-word');const kannada=await word.screenshot({path:'shots/story-kannada.png'});
  await new Promise(r=>setTimeout(r,6700));const english=await word.screenshot({path:'shots/story-english.png'});assert(!Buffer.from(kannada).equals(Buffer.from(english)));
  await page.setViewport({width:390,height:844});await page.$eval('.story-liquid-word',e=>e.scrollIntoView({block:'center'}));await page.screenshot({path:'shots/story-liquid-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.reload({waitUntil:'domcontentloaded'});await page.waitForSelector('.story-liquid-still');assert.equal(await page.$$eval('.story-liquid-word canvas',e=>e.length),0);
  assert.deepEqual(errors,[]);console.log('Story: original liquid shader changes Kannada to English; mobile fits; reduced motion uses still text.');await browser.close();process.exit(0);
 }
 if(process.argv.includes('--main')){
  await page.waitForSelector('.walk-discover');await page.waitForSelector('#explore');
  assert.equal(await page.$$eval('main',els=>els.length),1);assert.equal(await page.$$eval('header',els=>els.length),1);assert.equal(await page.$$eval('.walk-controls',els=>els.length),0);
  await new Promise(r=>setTimeout(r,5800));await page.screenshot({path:'shots/walk-main.png'});
  await page.setViewport({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'shots/walk-main-mobile.png'});
  assert.deepEqual(errors,[]);console.log('Main hero: one header, no preview controls, mobile fits, no browser errors.');
  await browser.close();process.exit(0);
 }
 await page.waitForSelector('.walk-play');await page.waitForFunction(()=>!document.querySelector('.walk-play')?.disabled);await page.evaluate(()=>document.fonts.ready)
 const results=[]
 for(const phase of ['walk','coffee','pause','become','nillu']){
  await page.click(`[data-seek="${phase}"]`);await new Promise(r=>setTimeout(r,800));await page.screenshot({path:`shots/walk-${phase}.png`});
  const state=await page.evaluate(()=>{const c=document.querySelector('canvas'),ctx=c.getContext('2d'),px=ctx.getImageData(0,0,c.width,c.height).data;let ink=0;for(let i=3;i<px.length;i+=4)if(px[i]>128)ink++;return {active:document.querySelector('.walk-chapters .active')?.dataset.seek,overflow:document.documentElement.scrollWidth>innerWidth,ink}})
  assert.equal(state.active,phase);assert.equal(state.overflow,false);assert(state.ink>500);results.push(state)
  if(phase==='coffee')for(const [name,t] of [['stop',3.8],['drop',4.35],['catch',4.8],['lift',5.25],['sip',5.85],['lower',6.75]]){await page.$eval('input[type=range]',(el,value)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,String(value));el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))},t/11.6);await new Promise(r=>setTimeout(r,450));await page.screenshot({path:`shots/walk-${name}.png`})}
 }
 const geometry=await page.evaluate(async()=>{
  const {coffeePose}=await import('/src/lib/walkIdentity.ts');let maxGripError=0,maxReach=0,maxSipError=0;
  for(let t=4.65;t<=7.65;t+=.01){const p=coffeePose(t),c=Math.cos(p.angle),s=Math.sin(p.angle);maxGripError=Math.max(maxGripError,Math.hypot(p.handWorld[0]-p.cup[0]-p.grip[0]*c+p.grip[1]*s,p.handWorld[1]-p.cup[1]-p.grip[0]*s-p.grip[1]*c));maxReach=Math.max(maxReach,Math.hypot(p.handWorld[0]-517,p.handWorld[1]-282));if(t>=5.7&&t<=6.35)maxSipError=Math.max(maxSipError,Math.hypot(p.lip[0]-p.mouth[0],p.lip[1]-p.mouth[1]));}
  return {maxGripError,maxReach,maxSipError}
 });assert(geometry.maxGripError<.001);assert(geometry.maxReach<=82);assert(geometry.maxSipError<.001);
 await page.click('.walk-replay');await new Promise(r=>setTimeout(r,500));const moving=await page.$eval('input[type=range]',e=>Number(e.value));assert(moving>0&&moving<1)
 await page.click('.walk-play');const paused=await page.$eval('input[type=range]',e=>Number(e.value));await new Promise(r=>setTimeout(r,400));assert.equal(await page.$eval('input[type=range]',e=>Number(e.value)),paused)
 await page.setViewport({width:390,height:844});await page.click('[data-seek="nillu"]');await new Promise(r=>setTimeout(r,800));await page.screenshot({path:'shots/walk-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.reload({waitUntil:'domcontentloaded'});await page.waitForSelector('.walk-chapters .active');assert.equal(await page.$eval('.walk-chapters .active',e=>e.dataset.seek),'nillu')
 assert.deepEqual(errors,[]);console.log(JSON.stringify({results,geometry,replay:true,pause:true,mobile:true,reducedMotion:true,errors},null,2))
}catch(error){console.log(JSON.stringify({errors,html:await page.content()},null,2).slice(0,6000));await page.screenshot({path:'shots/walk-error.png'});throw error}finally{await browser.close()}
