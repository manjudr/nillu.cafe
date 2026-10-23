import { paintWalk } from './walkIdentity'
import { WALK_DURATION, walkPhase } from './walkTimeline'
import type { Phase } from './walkTimeline'
import type { WalkWorkerMessage } from './walkPlayer'

let canvas:OffscreenCanvas,context:OffscreenCanvasRenderingContext2D,image:ImageBitmap
let width=1,height=1,dpr=1,elapsed=0,last=0,lastDraw=0,visible=true,reduced=false,frame=0
let phase:Phase='walk'
const draw=()=>{if(context&&image)paintWalk(context,elapsed,image,width,height,dpr)}
const schedule=()=>typeof requestAnimationFrame==='function'?requestAnimationFrame(tick):setTimeout(()=>tick(performance.now()),33)
const cancel=()=>{if(typeof cancelAnimationFrame==='function')cancelAnimationFrame(frame);else clearTimeout(frame)}
function resize(){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);draw()}
function tick(now:number){
 if(!visible){last=0;frame=schedule();return}
 if(last)elapsed=Math.min(WALK_DURATION,elapsed+(now-last)/1000)
 last=now
 if(now-lastDraw>=(width<600?1000/30:1000/60)){draw();lastDraw=now}
 const next=walkPhase(elapsed);if(next!==phase){phase=next;self.postMessage({phase})}
 if(elapsed<WALK_DURATION)frame=schedule()
}
self.onmessage=async(event:MessageEvent<WalkWorkerMessage>)=>{
 const message=event.data
 try{
  if(message.type==='init'){
   canvas=message.canvas;width=message.width;height=message.height;dpr=message.dpr;reduced=message.reduced
   const ctx=canvas.getContext('2d');if(!ctx)throw new Error('No offscreen 2D context')
   context=ctx;elapsed=reduced?WALK_DURATION:0;phase=walkPhase(elapsed);resize()
   const response=await fetch(message.source);if(!response.ok)throw new Error('Logo unavailable')
   image=await createImageBitmap(await response.blob());draw();self.postMessage({phase})
   if(!reduced)frame=schedule()
  }else if(message.type==='resize'){
   width=message.width;height=message.height;dpr=message.dpr;resize()
  }else if(message.type==='visible'){
   visible=message.visible;last=0
  }else if(message.type==='reduced'&&message.reduced){
   reduced=true;cancel();elapsed=WALK_DURATION;phase='nillu';draw();self.postMessage({phase})
  }
 }catch{self.postMessage({error:true})}
}
