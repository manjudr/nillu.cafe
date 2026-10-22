// Derive motion contours from the supplied mark; never redraw its typography.
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
const {data,info}=await sharp('src/assets/logo-ink.png').resize({width:600}).ensureAlpha().raw().toBuffer({resolveWithObject:true})
const {width:w,height:h}=info,seen=new Uint8Array(w*h),components=[]
const black=p=>p>=0&&p<w*h&&data[p*4+3]>=128
for(let p=0;p<w*h;p++){
 if(seen[p]||!black(p))continue
 const pixels=[p];seen[p]=1
 for(let i=0;i<pixels.length;i++){
  const v=pixels[i],x=v%w,y=Math.floor(v/w)
  for(const n of [x?v-1:-1,x<w-1?v+1:-1,y?v-w:-1,y<h-1?v+w:-1])if(n>=0&&!seen[n]&&black(n)){seen[n]=1;pixels.push(n)}
 }
 if(pixels.length<5000)continue
 const edges=new Map(),key=(x,y)=>y*(w+1)+x
 const add=(x,y,xx,yy)=>{const k=key(x,y);const list=edges.get(k)||[];list.push(key(xx,yy));edges.set(k,list)}
 for(const v of pixels){const x=v%w,y=Math.floor(v/w);if(!y||!black(v-w))add(x,y,x+1,y);if(x===w-1||!black(v+1))add(x+1,y,x+1,y+1);if(y===h-1||!black(v+w))add(x+1,y+1,x,y+1);if(!x||!black(v-1))add(x,y+1,x,y)}
 const rings=[]
 while(edges.size){const start=edges.keys().next().value;let next=start;const ring=[];for(let guard=0;guard<20000;guard++){ring.push([next%(w+1),Math.floor(next/(w+1))]);const list=edges.get(next);if(!list?.length)break;const dest=list.pop();if(!list.length)edges.delete(next);next=dest;if(next===start)break}if(ring.length>3)rings.push(ring)}
 const area=pts=>Math.abs(pts.reduce((a,p,i)=>{const q=pts[(i+1)%pts.length];return a+p[0]*q[1]-q[0]*p[1]},0))
 rings.sort((a,b)=>area(b)-area(a))
 const ring=rings[0],lengths=[0];for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];lengths.push(lengths.at(-1)+Math.hypot(b[0]-a[0],b[1]-a[1]))}
 let at=0;const points=Array.from({length:192},(_,i)=>{const dist=lengths.at(-1)*i/192;while(lengths[at+1]<dist)at++;const a=ring[at],b=ring[(at+1)%ring.length],t=(dist-lengths[at])/(lengths[at+1]-lengths[at]);return [+(a[0]+(b[0]-a[0])*t).toFixed(2),+(a[1]+(b[1]-a[1])*t).toFixed(2)]})
 components.push({area:pixels.length,points})
}
components.sort((a,b)=>b.area-a.area)
const [n,u,l2,l1,stem,dot]=components
const output={width:w,height:h,parts:{head:dot.points,torso:n.points,frontArm:stem.points,backArm:u.points,frontLeg:l2.points,backLeg:l1.points}}
await writeFile('src/assets/logo-motion.ts',`// Generated from logo-ink.png by scripts/trace-motion-logo.mjs.\nexport const LOGO_MOTION = ${JSON.stringify(output)} as const\n`)
console.log('Traced six original logo components into 192-point contours.')
