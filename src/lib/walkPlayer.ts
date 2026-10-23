import logo from '../assets/logo-ink.png'
import mobileLogo from '../assets/logo-canvas-mobile.webp'
import { WALK_DURATION, walkPhase } from './walkTimeline'
import type { Phase } from './walkTimeline'

export type WalkWorkerMessage =
 | {type:'init';canvas:OffscreenCanvas;source:string;width:number;height:number;dpr:number;reduced:boolean}
 | {type:'resize';width:number;height:number;dpr:number}
 | {type:'visible';visible:boolean}
 | {type:'reduced';reduced:boolean}

export function startWalkPlayer(canvas:HTMLCanvasElement,reduced:MediaQueryList,onPhase:(phase:Phase)=>void) {
 const source=innerWidth<=900?mobileLogo:logo
 const fallback=()=>{
  const image=document.createElement('img')
  image.src=source;image.alt='Nillu Cafe';image.className='walk-fallback'
  canvas.replaceWith(image);onPhase('nillu')
 }
 if(typeof canvas.transferControlToOffscreen==='function' && typeof Worker!=='undefined') {
  try {
   const worker=new Worker(new URL('./walk.worker.ts',import.meta.url),{type:'module'})
   const offscreen=canvas.transferControlToOffscreen(),box=canvas.getBoundingClientRect()
   const send=(message:WalkWorkerMessage)=>worker.postMessage(message)
   worker.postMessage({type:'init',canvas:offscreen,source,width:box.width,height:box.height,dpr:Math.min(devicePixelRatio||1,2),reduced:reduced.matches} satisfies WalkWorkerMessage,[offscreen])
   let width=box.width,height=box.height,dpr=Math.min(devicePixelRatio||1,2),inView=true
   const resize=new ResizeObserver(()=>{
    const box=canvas.getBoundingClientRect(),nextDpr=Math.min(devicePixelRatio||1,2)
    if(width===box.width&&height===box.height&&dpr===nextDpr)return
    width=box.width;height=box.height;dpr=nextDpr;send({type:'resize',width,height,dpr})
   })
   const visibility=()=>send({type:'visible',visible:inView&&!document.hidden})
   const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;visibility()})
   resize.observe(canvas);observer.observe(canvas)
   document.addEventListener('visibilitychange',visibility)
   reduced.addEventListener('change',()=>send({type:'reduced',reduced:reduced.matches}))
   const fail=()=>{worker.terminate();resize.disconnect();observer.disconnect();fallback()}
   worker.onmessage=(event:MessageEvent<{phase?:Phase;error?:boolean}>)=>{if(event.data.error)fail();else if(event.data.phase){canvas.dataset.ready='true';onPhase(event.data.phase)}}
   worker.onerror=event=>{event.preventDefault();fail()}
   canvas.dataset.renderer='worker'
   return
  } catch { /* Older browsers keep the main-thread canvas renderer. */ }
 }
 canvas.dataset.renderer='main'
 void import('./walkIdentity').then(async({paintWalk})=>{
  const context=canvas.getContext('2d')
  if(!context){fallback();return}
  const image=new Image();image.decoding='async';image.fetchPriority='low'
  let width=1,height=1,dpr=1,elapsed=reduced.matches?WALK_DURATION:0,last=0,lastDraw=0,inView=true,frame=0,phase=walkPhase(elapsed)
  const draw=()=>paintWalk(context,elapsed,image,width,height,dpr)
  const resize=()=>{
   const box=canvas.getBoundingClientRect(),nextDpr=Math.min(devicePixelRatio||1,2)
   if(width===box.width&&height===box.height&&dpr===nextDpr)return
   width=box.width;height=box.height;dpr=nextDpr;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);draw()
  }
  const tick=(now:number)=>{
   if(document.hidden||!inView){last=now;frame=requestAnimationFrame(tick);return}
   if(last)elapsed=Math.min(WALK_DURATION,elapsed+(now-last)/1000)
   last=now
   if(now-lastDraw>=(width<600?1000/30:1000/60)){draw();lastDraw=now}
   const next=walkPhase(elapsed);if(next!==phase){phase=next;onPhase(phase)}
   if(elapsed<WALK_DURATION)frame=requestAnimationFrame(tick)
  }
  image.onload=async()=>{
   try{await image.decode()}catch{fallback();return}
   onPhase(phase);resize();canvas.dataset.ready='true';lastDraw=performance.now()
   new ResizeObserver(resize).observe(canvas)
   new IntersectionObserver(([entry])=>{inView=entry.isIntersecting}).observe(canvas)
   reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);elapsed=WALK_DURATION;phase='nillu';onPhase(phase);draw()}})
   if(!reduced.matches)frame=requestAnimationFrame(tick)
  }
  image.onerror=fallback;image.src=source
 }).catch(fallback)
}
