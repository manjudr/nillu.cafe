import SurfaceLogo, { PlateLogo } from './SurfaceLogo'
import FoodStudio from './FoodStudio'
import { LiquidPool, LiquidPour } from './LiquidEffects'
import { bowlFill, landing } from '../lib/foodMotion'
import { foodTexture } from '../lib/foodTextures'
import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import * as THREE from 'three'
import bowlPhoto from '../assets/product/bowl-v2.webp'
import dessertPhoto from '../assets/product/dessert-v2.webp'
const clamp=(v:number)=>Math.max(0,Math.min(1,v))
const ease=(v:number)=>{const t=clamp(v);return t*t*(3-2*t)}
class SceneBoundary extends Component<{children:ReactNode;image:string},{failed:boolean}>{
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<img className="scene-fallback" src={this.props.image} alt="Illustration of this Nillu Cafe food category"/>:this.props.children}
}
function Banana({map}:{map:THREE.Texture}){return <group><mesh><cylinderGeometry args={[.224,.214,.075,40]}/><meshStandardMaterial color="#dfc78f" roughness={.72}/></mesh><mesh position={[0,.039,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.224,40]}/><meshStandardMaterial map={map} bumpMap={map} bumpScale={.002} roughness={.66}/></mesh></group>}
function Strawberry({map}:{map:THREE.Texture}){
 const shape=useMemo(()=>new THREE.LatheGeometry([[0,-.26],[.07,-.22],[.17,-.08],[.215,.09],[.18,.19],[.09,.23],[0,.22]].map(([x,y])=>new THREE.Vector2(x,y)),36),[])
 useEffect(()=>()=>shape.dispose(),[shape])
 return <group rotation={[0,0,.18]}><mesh geometry={shape}><meshPhysicalMaterial map={map} bumpMap={map} bumpScale={.006} roughness={.48} clearcoat={.12}/></mesh><group position={[0,.225,0]}>{[0,1,2,3,4].map(i=><group key={i} rotation={[0,i*Math.PI*.4,0]}><mesh position={[.06,.014,0]} rotation={[0,0,-1.12]} scale={[1,1,.28]}><coneGeometry args={[.048,.17,3]}/><meshStandardMaterial color={i%2?'#526c30':'#6c813e'} roughness={.9}/></mesh></group>)}</group></group>
}
function Blueberry({map}:{map:THREE.Texture}){return <group><mesh scale={[1,.96,1.03]}><sphereGeometry args={[.115,20,16]}/><meshStandardMaterial map={map} bumpMap={map} bumpScale={.002} roughness={.78}/></mesh><mesh position={[0,.109,0]} rotation={[-Math.PI/2,0,.1]}><circleGeometry args={[.029,5]}/><meshStandardMaterial color="#30354b" roughness={1}/></mesh><mesh position={[0,.108,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.032,.005,6,5]}/><meshStandardMaterial color="#545d79" roughness={.9}/></mesh></group>}
function BowlScene({progress,reduced}:{progress:MotionValue<number>;reduced:boolean}){
 const group=useRef<THREE.Group>(null),toppings=useRef<THREE.Group>(null),crumbs=useRef<THREE.InstancedMesh>(null),dummy=useMemo(()=>new THREE.Object3D(),[])
 const maps=useMemo(()=>({banana:foodTexture('banana'),strawberry:foodTexture('strawberry'),blueberry:foodTexture('blueberry')}),[])
 useEffect(()=>()=>Object.values(maps).forEach(map=>map.dispose()),[maps])
 const shape=useMemo(()=>new THREE.LatheGeometry([[0,0],[.6,0],[.8,.08],[1.15,.5],[1.38,.85],[1.4,.93],[1.34,.95],[1.29,.86],[1.07,.5],[.72,.15],[0,.15]].map(([x,y])=>new THREE.Vector2(x,y)),80),[])
 useEffect(()=>()=>shape.dispose(),[shape])
 const fruit=useMemo(()=>[
 ...Array.from({length:6},(_,i)=>({kind:0,x:-.72+i*.27,z:.34+Math.sin(i*.5)*.12,turn:i*.13,offset:.045})),
 ...Array.from({length:5},(_,i)=>({kind:1,x:-.66+i*.31,z:-.30+Math.sin(i*2.2)*.04,turn:i*.7,offset:.20})),
 ...Array.from({length:12},(_,i)=>({kind:2,x:Math.sin(i*2.4)*.5+.30,z:Math.cos(i*2.4)*.3-.02,turn:i,offset:.09})),
 ],[])
 const granola=useMemo(()=>Array.from({length:96},(_,i)=>({x:.73+Math.sin(i*5.3)*.16,z:-.55+i/96*1.05+Math.cos(i*3.7)*.06,size:.018+(i%5)*.007})),[])
 useEffect(()=>{if(!crumbs.current)return;const color=new THREE.Color();granola.forEach((_,i)=>crumbs.current!.setColorAt(i,color.set(i%3?'#ba915b':'#dec18b')));if(crumbs.current.instanceColor)crumbs.current.instanceColor.needsUpdate=true},[granola])
 useFrame(()=>{
  const p=reduced?1:progress.get()
  if(group.current){group.current.rotation.y=-.3+p*.65;group.current.rotation.x=-ease((p-.75)/.25)*.04;group.current.position.y=-.65}
  toppings.current?.children.forEach((f,i)=>{const seed=fruit[i],fall=landing(p,.32+(i%6)*.018,.23,2.5+(i%4)*.3,seed.kind===2?.035:.012);f.visible=fall.visible;f.position.set(seed.x,.79+seed.offset+fall.height,seed.z);f.rotation.set(fall.turn*2.5+(seed.kind===0?.04:0),seed.turn+fall.turn*2,fall.turn*1.8);const size=.94+(i%4)*.035;f.scale.setScalar(size)})
  if(crumbs.current){for(let i=0;i<granola.length;i++){const seed=granola[i],fall=landing(p,.63+(i%8)*.009,.16,2+(i%3)*.3,.008);dummy.position.set(seed.x,.80+fall.height,seed.z);dummy.rotation.set(i*.7,i*1.8+fall.turn*3,i*.4);const size=fall.visible?seed.size:0;dummy.scale.set(size*1.8,size*.65,size);dummy.updateMatrix();crumbs.current.setMatrixAt(i,dummy.matrix)}crumbs.current.instanceMatrix.needsUpdate=true}
 })
 return <><FoodStudio/><group ref={group}><SurfaceLogo surface="bowl"/><mesh geometry={shape}><meshPhysicalMaterial color="#f8f6f1" roughness={.28} clearcoat={.55} side={THREE.DoubleSide}/></mesh><LiquidPool kind="smoothie" sample={()=>{const state=bowlFill(reduced?1:progress.get());return {...state,activity:state.flow*.6}}}/><LiquidPour color="#a2476d" thick sample={()=>{const state=bowlFill(reduced?1:progress.get());return {from:[.08,4.8,0],to:[.02,state.height+.01,0],flow:state.flow,radius:.13,front:state.front,tail:state.tail}}}/><group ref={toppings}>{fruit.map((f,i)=><group key={i}>{f.kind===0?<Banana map={maps.banana}/>:f.kind===1?<Strawberry map={maps.strawberry}/>:<Blueberry map={maps.blueberry}/>}</group>)}</group><instancedMesh ref={crumbs} args={[undefined,undefined,96]}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial roughness={.93}/></instancedMesh></group><ContactShadows position={[0,-.67,0]} opacity={.22} scale={12} blur={2.8} far={5} resolution={256}/></>
}
const LAYERS=[{bottom:0,height:.20,kind:'sponge'},{bottom:.20,height:.26,kind:'cream'},{bottom:.46,height:.20,kind:'sponge'},{bottom:.66,height:.25,kind:'cream'},{bottom:.91,height:.035,kind:'cocoa'}] as const
function cakeGeometry(shape:THREE.Shape){
 const edge=new THREE.Shape();shape.getSpacedPoints(100).forEach((p,i)=>{const x=p.x+.008*Math.sin(p.x*17+p.y*9),y=p.y+.009*Math.sin(p.y*13-p.x*11);if(i===0)edge.moveTo(x,y);else edge.lineTo(x,y)});edge.closePath()
 const geometry=new THREE.ExtrudeGeometry(edge,{depth:.2,bevelEnabled:true,bevelSize:.008,bevelThickness:.005,bevelSegments:2,steps:1}),position=geometry.attributes.position
 for(let i=0;i<position.count;i++){const x=position.getX(i),y=position.getY(i),z=position.getZ(i);position.setZ(i,z+.008*Math.sin(x*23+y*17)+.006*Math.sin(x*47-y*31))}
 position.needsUpdate=true;geometry.computeVertexNormals();return geometry
}
function Fork(){return <group position={[1,-.025,.48]}><mesh position={[.65,0,0]} rotation={[0,0,Math.PI/2]} scale={[1,1,.40]}><capsuleGeometry args={[.045,1.05,5,16]}/><meshStandardMaterial color="#c4c4c0" metalness={.95} roughness={.2}/></mesh><mesh position={[.08,0,0]} scale={[.20,.02,.15]}><sphereGeometry args={[1,20,12]}/><meshStandardMaterial color="#d1d1cd" metalness={.95} roughness={.18}/></mesh>{[0,1,2,3].map(i=><mesh key={i} position={[-.19,0,-.105+i*.07]} rotation={[0,0,Math.PI/2]} scale={[1,1,.8]}><capsuleGeometry args={[.013,.34,4,10]}/><meshStandardMaterial color="#d1d1cd" metalness={.95} roughness={.17}/></mesh>)}</group>}
function DessertScene({progress,reduced}:{progress:MotionValue<number>;reduced:boolean}){
 const maps=useMemo(()=>({sponge:foodTexture('sponge'),cream:foodTexture('cream'),cocoa:foodTexture('cocoa')}),[])
 useEffect(()=>()=>Object.values(maps).forEach(map=>map.dispose()),[maps])
 const group=useRef<THREE.Group>(null),layers=useRef<THREE.Group>(null),bite=useRef<THREE.Group>(null),biteLayers=useRef<THREE.Group>(null),fork=useRef<THREE.Group>(null),cocoa=useRef<THREE.InstancedMesh>(null),crumbs=useRef<THREE.InstancedMesh>(null),dummy=useMemo(()=>new THREE.Object3D(),[])
 const [bodyGeo,biteGeo]=useMemo(()=>{
  const body=new THREE.Shape();body.moveTo(-1,-.7);body.lineTo(.50,-.7);body.lineTo(.51,-.36);body.lineTo(.72,-.28);body.lineTo(1,-.27);body.lineTo(1,.7);body.lineTo(-1,.7);body.closePath()
  const tip=new THREE.Shape();tip.moveTo(.50,-.7);tip.lineTo(1,-.7);tip.lineTo(1,-.27);tip.lineTo(.72,-.28);tip.lineTo(.51,-.36);tip.closePath()
  return [cakeGeometry(body),cakeGeometry(tip)]
 },[])
 useEffect(()=>()=>{bodyGeo.dispose();biteGeo.dispose()},[bodyGeo,biteGeo])
 const dust=useMemo(()=>Array.from({length:180},(_,i)=>{let x=-.94+((i*37)%179)/179*1.88,z=-.65+((i*53)%173)/173*1.3;if(x>.46&&z>.24)x-=.65;return{x,z,size:.004+(i%4)*.0015}}),[])
 useFrame(()=>{
  const p=reduced?1:progress.get(),assemble=ease((p-.03)/.30),lift=ease((p-.67)/.21),approach=ease((p-.49)/.14)
  if(group.current){group.current.rotation.y=-.4+p*.6;group.current.position.y=-.60}
  layers.current?.children.forEach((l,i)=>{l.position.y=.12+LAYERS[i].bottom+(1-assemble)*(.10+i*.12)})
  biteLayers.current?.children.forEach((l,i)=>{l.position.y=LAYERS[i].bottom+(1-assemble)*(.10+i*.12)})
  if(bite.current){bite.current.position.set(lift*.12,.12+lift*.85,lift*.12);bite.current.rotation.z=-lift*.065}
  if(fork.current){fork.current.visible=p>.49;fork.current.position.x=(1-approach)*1.2}
  if(cocoa.current){for(let i=0;i<dust.length;i++){const seed=dust[i],fall=landing(p,.35+(i%11)*.006,.19,1.6+(i%4)*.16,.003);dummy.position.set(seed.x,1.074+fall.height,seed.z);dummy.scale.setScalar(fall.visible?seed.size:0);dummy.rotation.set(i,i*.8,0);dummy.updateMatrix();cocoa.current.setMatrixAt(i,dummy.matrix)}cocoa.current.instanceMatrix.needsUpdate=true}
  if(crumbs.current){crumbs.current.visible=lift>0;for(let i=0;i<12;i++){dummy.position.set(.52+(i%4)*.13,.078+Math.sin(lift*Math.PI)*.05*(i%3),.34+(i%5)*.08);dummy.scale.setScalar(.012+(i%3)*.006);dummy.rotation.set(i,i*2,0);dummy.updateMatrix();crumbs.current.setMatrixAt(i,dummy.matrix)}crumbs.current.instanceMatrix.needsUpdate=true}
 })
 const layer=(i:number,geometry:THREE.ExtrudeGeometry)=><mesh key={i} geometry={geometry} rotation={[-Math.PI/2,0,0]} scale={[1,1,LAYERS[i].height/.2]}><meshStandardMaterial map={maps[LAYERS[i].kind]} bumpMap={maps[LAYERS[i].kind]} bumpScale={LAYERS[i].kind==='sponge'?.018:.003} roughness={LAYERS[i].kind==='cocoa'?1:.82}/></mesh>
 return <><FoodStudio/><group ref={group}><PlateLogo/><mesh><cylinderGeometry args={[1.85,1.75,.1,80]}/><meshPhysicalMaterial color="#fbfaf7" roughness={.26} clearcoat={.6}/></mesh><mesh position={[0,.056,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[1.65,.014,12,80]}/><meshStandardMaterial color="#e4e2dc" roughness={.55}/></mesh><group ref={layers}>{LAYERS.map((_,i)=>layer(i,bodyGeo))}</group><group ref={bite}><group ref={biteLayers}>{LAYERS.map((_,i)=>layer(i,biteGeo))}</group><group ref={fork}><Fork/></group></group><instancedMesh ref={cocoa} args={[undefined,undefined,180]}><sphereGeometry args={[1,5,4]}/><meshStandardMaterial color="#69462f" roughness={1}/></instancedMesh><instancedMesh ref={crumbs} args={[undefined,undefined,12]}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial map={maps.sponge} roughness={1}/></instancedMesh></group><ContactShadows position={[0,-.65,0]} opacity={.22} scale={12} blur={2.8} far={5} resolution={256}/></>
}
const content={
 bowl:{id:'bowl-preview',label:'SMOOTHIE BOWLS',number:'03',prev:'juice-preview',next:'dessert-preview',image:bowlPhoto,steps:['THE BASE','THE FRUIT','THE FINISH','THE BOWL'],positions:[0,.43,.72,1],chapters:[['A smoothie.','By the spoonful.','A smooth base, ready for fruit and toppings.'],['Fruit in','every spoonful.','Banana, berries, and more to bring the bowl together.'],['A little','crunch on top.','A finishing sprinkle adds another texture.'],['Take a spoon to','something good.','Smoothie bowls with fruit and toppings, bringing different flavours and textures to every spoonful.']]},
 dessert:{id:'dessert-preview',label:'DESSERTS',number:'04',prev:'bowl-preview',next:'bites',image:dessertPhoto,steps:['THE LAYERS','THE COCOA','THE BITE','THE DESSERT'],positions:[0,.45,.73,1],chapters:[['Tiramisu,','layer by layer.','Layers of coffee and cream, with a cocoa finish to come.'],['A dusting','of cocoa.','The final touch before the first bite.'],['The first bite.','Take your time.','A forkful of tiramisu, ready to enjoy.'],['For the occasion.','Or just because.','Tiramisu, cheesecake, and cakes for moments big and small. From a slice to enjoy today to a custom design or 2D cake for a celebration.']]},
}
export default function FinishSequence({kind}:{kind:'bowl'|'dessert'}){
 const data=content[kind],ref=useRef<HTMLElement>(null),reduced=!!useReducedMotion(),visible=useInView(ref,{margin:'300px 0px'})
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']})
 const [chapter,setChapter]=useState(0)
 useMotionValueEvent(scrollYProgress,'change',p=>setChapter(p<.32?0:p<.63?1:p<.86?2:3))
 const bar=useTransform(scrollYProgress,[0,1],['0%','100%'])
 const active=reduced?3:chapter
 return <section ref={ref} id={data.id} className={`coffee-demo finish-demo ${kind}-demo`} aria-label={data.label}>
 <div className="demo-sticky">
 <div className="demo-copy" aria-live="polite"><span className="kicker">{String(active+1).padStart(2,'0')} / {data.label}</span><motion.div key={active} initial={reduced?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.5}}><h2>{data.chapters[active][0]}<br/><em>{data.chapters[active][1]}</em></h2><p>{data.chapters[active][2]}</p></motion.div></div>
 <div className="demo-canvas" role="img" aria-label={kind==='bowl'?'Berry smoothie pours into a ceramic bowl, then banana, strawberries, blueberries and granola assemble as you scroll':'Tiramisu layers assemble, cocoa falls, and a fork lifts a bite as you scroll'}><SceneBoundary image={data.image}>{visible?<Canvas frameloop={reduced?'demand':'always'} camera={{position:kind==='bowl'?[3,5,6.4]:[3.6,3.7,6.5],fov:36}} dpr={[1,1.5]}><Suspense fallback={null}>{kind==='bowl'?<BowlScene progress={scrollYProgress} reduced={reduced}/>:<DessertScene progress={scrollYProgress} reduced={reduced}/>}</Suspense></Canvas>:<img className="scene-fallback" src={data.image} alt="" loading="lazy"/>}</SceneBoundary></div>
 <div className="demo-bottom"><a href={`#${data.next}`}>{kind==='bowl'?'NEXT: DESSERTS ↓':'NEXT: QUICK SNACKS ↓'}</a><span>{data.number} / {data.label}</span></div><div className="demo-track"><motion.div style={{width:bar}}/></div>
 </div></section>
}
