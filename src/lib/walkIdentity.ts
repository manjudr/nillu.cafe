import { LOGO_MOTION } from '../assets/logo-motion'

type Point = readonly [number,number]
type Part = keyof typeof LOGO_MOTION.parts
export type Phase = 'walk'|'coffee'|'pause'|'become'|'nillu'
export const WALK_DURATION=11.6
export const WALK_STOPS={walk:2.2,coffee:5.85,pause:7.35,become:9.05,nillu:11.6} as const
const PARTS:Part[]=['backLeg','backArm','torso','frontLeg','frontArm','head']
const clamp=(v:number)=>Math.max(0,Math.min(1,v))
const ease=(v:number)=>{const t=clamp(v);return t*t*(3-2*t)}
const mix=(a:number,b:number,t:number)=>a+(b-a)*t
const area=(p:Point[])=>p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1]},0)
const center=(p:Point[]):Point=>[p.reduce((s,a)=>s+a[0],0)/p.length,p.reduce((s,a)=>s+a[1],0)/p.length]
function resample(points:Point[],count=192):Point[]{
 const lengths=[0];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];lengths.push(lengths[i]+Math.hypot(b[0]-a[0],b[1]-a[1]))}
 let at=0;return Array.from({length:count},(_,i)=>{const d=lengths[lengths.length-1]*i/count;while(lengths[at+1]<d)at++;const a=points[at],b=points[(at+1)%points.length],t=(d-lengths[at])/(lengths[at+1]-lengths[at]);return [mix(a[0],b[0],t),mix(a[1],b[1],t)]})
}
function limb(points:Point[],radii:number[]):Point[]{
 const normals=points.map((_,i)=>{const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],d=Math.hypot(b[0]-a[0],b[1]-a[1]);return [-(b[1]-a[1])/d,(b[0]-a[0])/d] as Point})
 const a=points.map((p,i)=>[p[0]+normals[i][0]*radii[i],p[1]+normals[i][1]*radii[i]] as Point)
 const b=points.map((p,i)=>[p[0]-normals[i][0]*radii[i],p[1]-normals[i][1]*radii[i]] as Point).reverse()
 const cap=(p:Point,n:Point,r:number,direction:number)=>Array.from({length:10},(_,i)=>{const angle=Math.atan2(n[1],n[0])+direction*Math.PI*(i+1)/11;return [p[0]+Math.cos(angle)*r,p[1]+Math.sin(angle)*r] as Point})
 return resample([...a,...cap(points[points.length-1],normals[normals.length-1],radii[radii.length-1],-1),...b,...cap(points[0],[-normals[0][0],-normals[0][1]],radii[0],-1)])
}
function cubic(a:Point,b:Point,c:Point,d:Point):Point[]{return Array.from({length:18},(_,i)=>{const t=i/18,u=1-t;return [u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]})}
const headShape=resample([
 ...cubic([-10,-158],[-24,-151],[-24,-130],[-12,-123]),
 ...cubic([-12,-123],[-9,-120],[-10,-116],[-9,-112]),
 ...cubic([-9,-112],[-3,-109],[5,-110],[9,-114]),
 ...cubic([9,-114],[8,-120],[20,-120],[20,-129]),
 ...cubic([20,-129],[18,-133],[24,-134],[25,-138]),
 ...cubic([25,-138],[21,-141],[20,-142],[20,-146]),
 ...cubic([20,-146],[21,-151],[19,-155],[18,-158]),
 // Bowler crown and its gently turned brim are part of the morphing head.
 [30,-158],[30,-163],[17,-164],
 ...cubic([17,-164],[19,-191],[-23,-193],[-23,-164]),
 [-31,-163],[-31,-158],[-10,-158],
])
const rotate=(p:Point,angle:number):Point=>[p[0]*Math.cos(angle)-p[1]*Math.sin(angle),p[0]*Math.sin(angle)+p[1]*Math.cos(angle)]
const HIP_Y=378
const CUP_LIP:Point=[-19,-28]
function headAngle(t:number){
 const glance=-.12*ease((t-3.8)/.25)*(1-ease((t-4.65)/.25))
 const sip=-.04*ease((t-5.15)/.55)*(1-ease((t-6.35)/.55))
 return glance+sip
}
/** One pose drives the cup, its contact point, and the hand gripping it. */
export function coffeePose(t:number){
 const reach=ease((t-3.8)/.8),lift=ease((t-4.95)/.75),lower=ease((t-6.35)/.8),wrap=ease((t-4.72)/.25)
 const tilt=headAngle(t),mouthOffset=rotate([20,-16],tilt),mouth:Point=[500+mouthOffset[0],HIP_Y-113+mouthOffset[1]]
 const angle=-.32*lift*(1-lower)
 const grip:Point=[mix(0,17.5,wrap),mix(25,4,wrap)]
 const lipOffset=rotate(CUP_LIP,angle),sipCenter:Point=[mouth[0]-lipOffset[0],mouth[1]-lipOffset[1]]
 const catchCenter:Point=[548,326],restCenter:Point=[534,348]
 const cupHeld:Point=[mix(mix(catchCenter[0],sipCenter[0],lift),restCenter[0],lower),mix(mix(catchCenter[1],sipCenter[1],lift),restCenter[1],lower)]
 const dip=t>=4.65&&t<4.93?Math.sin((t-4.65)/.28*Math.PI)*5.5:0
 const held:Point=[cupHeld[0],cupHeld[1]+dip],gripOffset=rotate(grip,angle)
 const handWorld:Point=[mix(525.74,held[0]+gripOffset[0],reach),mix(HIP_Y-14.61,held[1]+gripOffset[1],reach)]
 const caught=t>=4.65,fall=clamp((t-3.9)/.75)
 const cup:Point=caught?held:[mix(558,548,fall),mix(-70,326,fall*fall)]
 return {hand:[handWorld[0]-500,handWorld[1]-HIP_Y] as Point,handWorld,cup,grip,mouth,angle:caught?angle:.09*(1-fall),lip:[held[0]+lipOffset[0],held[1]+lipOffset[1]] as Point,caught,headAngle:tilt}
}
/** Keep the arrival in the illustration column, clear of the hero copy. */
export function walkEntrance(t:number){
 const travel=1-Math.pow(1-clamp(t/3.8),1.5)
 return {travel,x:200+300*travel,opacity:ease((t-.12)/.9),phase:300*travel/100*Math.PI*2}
}
function person(t:number):Record<Part,Point[]>{
 const {x,phase}=walkEntrance(t),amp=ease((3.8-t)/.75)
 const hipY=HIP_Y+7*amp-Math.abs(Math.sin(phase*2))*2*amp,lean=(.025+Math.sin(phase)*.025)*amp
 const world=(p:Point):Point=>[x+p[0]*Math.cos(lean)-p[1]*Math.sin(lean),hipY+p[0]*Math.sin(lean)+p[1]*Math.cos(lean)]
 const leg=(offset:number,side:number)=>{
  const a=phase+offset,start:Point=[side*7,0],foot:Point=[Math.sin(a)*43*amp+side*15*(1-amp),498-hipY-Math.max(0,Math.cos(a))*20*amp]
  const dx=foot[0]-start[0],dy=foot[1]-start[1],d=Math.hypot(dx,dy),length=Math.max(60.5,d/2+.1),bend=Math.sqrt(length*length-d*d/4)
  const knee:Point=[(start[0]+foot[0])/2+dy/d*bend,(start[1]+foot[1])/2-dx/d*bend]
  return limb([start,knee,[foot[0],foot[1]-3],[foot[0]+23,foot[1]-1]],[15,14,8,8]).map(world)
 }
 const arm=(offset:number,side:number)=>{
  const a=Math.sin(phase+offset)*.55*amp+.05,shoulder:Point=[side*17,-96],elbow:Point=[shoulder[0]+Math.sin(a)*43,shoulder[1]+Math.cos(a)*43],b=a+.12+Math.max(0,Math.sin(phase+offset))*.25*amp
  return limb([shoulder,elbow,[elbow[0]+Math.sin(b)*39,elbow[1]+Math.cos(b)*39]],[8,7,6]).map(world)
 }
 const headTilt=headAngle(t)
 const head=headShape.map(p=>world([p[0]*Math.cos(headTilt)-(p[1]+113)*Math.sin(headTilt),p[0]*Math.sin(headTilt)+(p[1]+113)*Math.cos(headTilt)-113]))
 let frontArm=arm(Math.PI,1)
 if(t>=3.8){
  const shoulder:Point=[17,-96],hand=coffeePose(t).hand,dx=hand[0]-shoulder[0],dy=hand[1]-shoulder[1],d=Math.max(1,Math.hypot(dx,dy)),along=(43*43-39*39+d*d)/(2*d),bend=Math.sqrt(Math.max(0,43*43-along*along))
  const elbow:Point=[shoulder[0]+dx/d*along-dy/d*bend,shoulder[1]+dy/d*along+dx/d*bend]
  frontArm=limb([shoulder,elbow,hand],[8,7,6]).map(world)
 }
 return {head,torso:resample([[-7,-119],[8,-119],[9,-106],[20,-98],[17,-64],[24,-15],[5,-23],[0,-12],[-8,-23],[-24,-15],[-17,-64],[-21,-98],[-8,-106]]).map(world),frontArm,backArm:arm(0,-1),frontLeg:leg(0,1),backLeg:leg(Math.PI,-1)}
}
function aligned(source:Point[],target:Point[]):Point[]{
 let ring=area(source)*area(target)<0?[...target].reverse():[...target]
 const ca=center(source),cb=center(ring),ra=Math.sqrt(source.reduce((s,p)=>s+(p[0]-ca[0])**2+(p[1]-ca[1])**2,0)/source.length),rb=Math.sqrt(ring.reduce((s,p)=>s+(p[0]-cb[0])**2+(p[1]-cb[1])**2,0)/ring.length)
 let best=0,score=Infinity
 for(let shift=0;shift<ring.length;shift++){let cost=0;for(let i=0;i<source.length;i+=3){const a=source[i],b=ring[(i+shift)%ring.length];cost+=((a[0]-ca[0])/ra-(b[0]-cb[0])/rb)**2+((a[1]-ca[1])/ra-(b[1]-cb[1])/rb)**2}if(cost<score){score=cost;best=shift}}
 ring=ring.map((_,i)=>ring[(i+best)%ring.length]);return ring
}
const standing=person(7.65)
const logoBox={x:255,y:153.4,width:390,height:343.2}
const destinations=Object.fromEntries(PARTS.map(part=>[part,aligned(standing[part],LOGO_MOTION.parts[part].map(([x,y])=>[logoBox.x+x*.65,logoBox.y+y*.65] as Point))])) as Record<Part,Point[]>
const delays:Record<Part,number>={head:7.65,torso:7.8,frontLeg:7.9,backLeg:7.95,frontArm:8.0,backArm:8.1}
export function walkPhase(t:number):Phase{return t<3.8?'walk':t<7.15?'coffee':t<7.65?'pause':t<10.2?'become':'nillu'}
export function paintWalk(ctx:CanvasRenderingContext2D,t:number,logo:HTMLImageElement,width:number,height:number,dpr:number){
 const scale=Math.min(width/(width<600?650:900),height/650)
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height)
 ctx.translate((width-900*scale)/2,(height-650*scale)/2);ctx.scale(scale,scale)
 const morph=ease((t-7.65)/2.55),walk=person(Math.min(t,7.65)),{x,opacity:arrival}=walkEntrance(t)
 ctx.save();ctx.globalAlpha=.7*(1-morph);ctx.strokeStyle='#e6e6e6';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(45,503);ctx.lineTo(855,503);ctx.stroke();ctx.restore()
 ctx.save();ctx.globalAlpha=.065*arrival;ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.ellipse(mix(x,450,morph),502,mix(35,140,morph),mix(4,7,morph),0,0,Math.PI*2);ctx.fill();ctx.restore()
 ctx.save();ctx.globalAlpha=arrival;ctx.fillStyle='#0a0a0a'
 for(const part of PARTS){
  let points=walk[part]
  if(t>=7.65){const p=ease((t-delays[part])/1.8);points=standing[part].map((a,i)=>{const b=destinations[part][i];return [mix(a[0],b[0],p),mix(a[1],b[1],p)-Math.sin(p*Math.PI)*10] as Point})}
  ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fill()
 }
 // Costume details follow the same body and head transforms, then dissolve into the mark.
 const detailAlpha=1-ease((t-7.65)/.65)
 if(detailAlpha>0){
  const pt=Math.min(t,7.65),{x:bodyX,phase}=walkEntrance(pt),amp=ease((3.8-pt)/.75)
  const hipY=HIP_Y+7*amp-Math.abs(Math.sin(phase*2))*2*amp,lean=(.025+Math.sin(phase)*.025)*amp
  ctx.save();ctx.globalAlpha=detailAlpha*arrival;ctx.translate(bodyX,hipY);ctx.rotate(lean)
  // White shirt, narrow lapels, and a small black tie inside the fitted coat.
  ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-10,-101);ctx.lineTo(0,-91);ctx.lineTo(10,-101);ctx.lineTo(5,-67);ctx.lineTo(0,-58);ctx.lineTo(-5,-67);ctx.closePath();ctx.fill()
  ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.moveTo(0,-91);ctx.lineTo(3,-86);ctx.lineTo(2,-71);ctx.lineTo(-2,-71);ctx.lineTo(-3,-86);ctx.closePath();ctx.fill()
  ctx.strokeStyle='#777';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-12,-95);ctx.lineTo(-8,-78);ctx.lineTo(-13,-72);ctx.moveTo(12,-95);ctx.lineTo(8,-78);ctx.lineTo(13,-72);ctx.stroke()
  ctx.translate(0,-113);ctx.rotate(headAngle(pt));ctx.translate(0,113)
  // A light face inset makes the eye and toothbrush moustache legible in profile.
  ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(4,-153);ctx.bezierCurveTo(15,-157,20,-150,18,-144);ctx.lineTo(23,-138);ctx.lineTo(18,-135);ctx.lineTo(19,-130);ctx.quadraticCurveTo(16,-122,9,-123);ctx.lineTo(4,-130);ctx.closePath();ctx.fill()
  ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.ellipse(15,-144,1.6,1.9,0,0,Math.PI*2);ctx.fill();ctx.fillRect(14,-134,6,4)
  ctx.strokeStyle='#777';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-22,-165);ctx.quadraticCurveTo(-3,-162,17,-165);ctx.stroke()
  ctx.restore()
 }
 ctx.restore()
 // A lidded takeaway cup drops under gravity; the hand absorbs the catch before the sip.
 const cupAlpha=(t>=3.9?1:0)*(1-ease((t-7.65)/.6))
 if(cupAlpha>0){
  const pose=coffeePose(Math.min(t,7.65)),join=ease((t-7.65)/.6)
  ctx.save();ctx.globalAlpha=cupAlpha;ctx.translate(mix(pose.cup[0],566,join),mix(pose.cup[1],265,join));ctx.scale(1-join*.7,1-join*.7)
  ctx.rotate(pose.angle)
  ctx.strokeStyle='#0a0a0a';ctx.lineWidth=2;ctx.fillStyle='#fff'
  ctx.beginPath();ctx.moveTo(-18,-20);ctx.lineTo(-13.5,22);ctx.quadraticCurveTo(0,27,13.5,22);ctx.lineTo(18,-20);ctx.closePath();ctx.fill();ctx.stroke()
  // Warm paper sleeve, with the supplied mark printed directly on its front.
  ctx.fillStyle='#d8c5a5';ctx.beginPath();ctx.moveTo(-16,-8);ctx.lineTo(-14,13);ctx.quadraticCurveTo(0,17,14,13);ctx.lineTo(16,-8);ctx.closePath();ctx.fill()
  ctx.drawImage(logo,-10,-6,20,17.6)
  ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.roundRect(-21,-26,42,8,2.5);ctx.fill();ctx.beginPath();ctx.roundRect(-17,-30,34,6,2);ctx.fill()
  ctx.fillStyle='#555';ctx.beginPath();ctx.roundRect(-11,-29,11,1.5,.75);ctx.fill()
  if(pose.caught){const wrap=ease((t-4.72)/.25);ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.ellipse(pose.grip[0],pose.grip[1],mix(9,5,wrap),mix(4,7,wrap),0,0,Math.PI*2);ctx.fill()}
  ctx.restore()
 }
 if(t>10.0){ctx.save();ctx.globalAlpha=ease((t-10.0)/.45);ctx.drawImage(logo,logoBox.x,logoBox.y,logoBox.width,logoBox.height);ctx.font='500 12px sans-serif';ctx.fillText('™',logoBox.x+logoBox.width+6,logoBox.y+12);ctx.restore()}
}
