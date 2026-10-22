import SurfaceLogo, { PlateLogo } from './SurfaceLogo'
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
function Lights(){return <><ambientLight intensity={1.3}/><directionalLight position={[3,6,4]} intensity={3}/><directionalLight position={[-4,4,-2]} intensity={1.8}/></>}
function Banana(){return <group><mesh><cylinderGeometry args={[.23,.23,.09,32]}/><meshStandardMaterial color="#f6df9c" roughness={.7}/></mesh><mesh position={[0,.047,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.19,32]}/><meshStandardMaterial color="#fff1c9"/></mesh>{Array.from({length:5},(_,i)=><mesh key={i} position={[Math.sin(i*1.256)*.045,.053,Math.cos(i*1.256)*.045]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.012,8]}/><meshStandardMaterial color="#bb9767"/></mesh>)}</group>}
function Strawberry(){return <group rotation={[0,0,.25]}><mesh scale={[.22,.29,.15]}><sphereGeometry args={[1,24,20]}/><meshPhysicalMaterial color="#d72b40" roughness={.5} clearcoat={.25}/></mesh>{Array.from({length:13},(_,i)=>{const a=i*2.4,y=(i%5)*.085-.17,r=Math.sqrt(1-(y/.29)**2);return <mesh key={i} position={[Math.cos(a)*.215*r,y,Math.sin(a)*.148*r]} scale={[.012,.022,.009]}><sphereGeometry args={[1,6,6]}/><meshStandardMaterial color="#f7c576"/></mesh>})}</group>}
function Blueberry(){return <group><mesh><sphereGeometry args={[.115,20,16]}/><meshPhysicalMaterial color="#3c426d" roughness={.6}/></mesh><mesh position={[0,.108,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.032,.008,6,5]}/><meshStandardMaterial color="#222846"/></mesh></group>}
function BowlScene({progress,reduced}:{progress:MotionValue<number>;reduced:boolean}){
 const group=useRef<THREE.Group>(null),smoothie=useRef<THREE.Mesh>(null),stream=useRef<THREE.Mesh>(null),toppings=useRef<THREE.Group>(null),crumbs=useRef<THREE.Group>(null)
 const shape=useMemo(()=>new THREE.LatheGeometry([[0,0],[.6,0],[.8,.08],[1.15,.5],[1.38,.85],[1.4,.93],[1.34,.95],[1.29,.86],[1.07,.5],[.72,.15],[0,.15]].map(([x,y])=>new THREE.Vector2(x,y)),80),[])
 const fruit=useMemo(()=>[
 ...Array.from({length:6},(_,i)=>({kind:0,x:-.72+i*.27,z:.34+Math.sin(i*.5)*.12,turn:i*.1})),
 ...Array.from({length:5},(_,i)=>({kind:1,x:-.68+i*.31,z:-.3,turn:i*.7})),
 ...Array.from({length:12},(_,i)=>({kind:2,x:Math.sin(i*2.4)*.5+.3,z:Math.cos(i*2.4)*.3-.02,turn:i})),
 ],[])
 const granola=useMemo(()=>Array.from({length:48},(_,i)=>({x:Math.sin(i*5.3)*.9,z:-.6+Math.cos(i*3.7)*.17,size:.025+(i%4)*.012})),[])
 useFrame(()=>{
 const p=reduced?1:progress.get(),fill=ease((p-.05)/.25)
 if(group.current){group.current.rotation.y=-.3+p*.65;group.current.rotation.x=-ease((p-.75)/.25)*.08;group.current.position.y=-.6}
 if(smoothie.current){smoothie.current.scale.setScalar(.45+fill*.55);smoothie.current.position.y=.2+fill*.58;smoothie.current.visible=p>.04}
 if(stream.current){stream.current.visible=p>.03&&p<.34;stream.current.scale.x=stream.current.scale.z=Math.sin(clamp((p-.03)/.04)*Math.PI/2)*Math.sin(clamp((.34-p)/.05)*Math.PI/2)}
 toppings.current?.children.forEach((f,i)=>{const t=ease((p-.32-(i%6)*.024)/.23);f.visible=t>0;f.position.set(fruit[i].x,.87+(1-t)*(3+(i%4)*.4),fruit[i].z);f.rotation.set((1-t)*3,fruit[i].turn+(1-t)*4,(1-t)*2);f.scale.setScalar(.8+t*.2)})
 crumbs.current?.children.forEach((f,i)=>{const t=ease((p-.63-(i%8)*.01)/.16);f.visible=t>0;f.position.set(granola[i].x,.86+(1-t)*(2+i%3),granola[i].z);f.rotation.set(i,t*4,i*.6)})
 })
 return <><Lights/><group ref={group}><SurfaceLogo surface="bowl"/><mesh geometry={shape}><meshPhysicalMaterial color="#f8f7f4" roughness={.25} clearcoat={.8} side={THREE.DoubleSide}/></mesh><mesh ref={smoothie} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[1.3,80]}/><meshPhysicalMaterial color="#b34170" roughness={.45} clearcoat={.35}/></mesh><mesh ref={stream} position={[0,2.4,0]}><cylinderGeometry args={[.12,.16,3.4,24]}/><meshPhysicalMaterial color="#b34170" roughness={.4}/></mesh><group ref={toppings}>{fruit.map((f,i)=><group key={i}>{f.kind===0?<Banana/>:f.kind===1?<Strawberry/>:<Blueberry/>}</group>)}</group><group ref={crumbs}>{granola.map((g,i)=><mesh key={i} scale={[g.size*1.6,g.size,g.size]}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color={i%3?'#b88b50':'#e0bc78'} roughness={.9}/></mesh>)}</group></group><ContactShadows position={[0,-.67,0]} opacity={.25} scale={12} blur={2.8} far={5} resolution={256}/></>
}
function DessertScene({progress,reduced}:{progress:MotionValue<number>;reduced:boolean}){
 const texture=useMemo(()=>{const pixels=new Uint8Array(128*128*4);for(let i=0;i<128*128;i++){const n=Math.sin(i*127.1+17.7)*43758.5453;const v=130+Math.floor((n-Math.floor(n))*125);pixels[i*4]=pixels[i*4+1]=pixels[i*4+2]=v;pixels[i*4+3]=255}const t=new THREE.DataTexture(pixels,128,128);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);t.needsUpdate=true;return t},[])
 useEffect(()=>()=>texture.dispose(),[texture])
 const group=useRef<THREE.Group>(null),layers=useRef<THREE.Group>(null),bite=useRef<THREE.Group>(null),cocoa=useRef<THREE.Group>(null)
 const [bodyGeo,biteGeo]=useMemo(()=>{
 const body=new THREE.Shape();body.moveTo(-1,-.75);body.lineTo(.57,-.75);body.lineTo(.57,.55);body.lineTo(-1,.75);body.closePath()
 const tip=new THREE.Shape();tip.moveTo(.6,-.75);tip.lineTo(1.12,-.75);tip.lineTo(.6,.55);tip.closePath()
 return [body,tip].map(shape=>new THREE.ExtrudeGeometry(shape,{depth:.2,bevelEnabled:true,bevelSize:.028,bevelThickness:.02,bevelSegments:3,steps:1}))
 },[])
 const dust=useMemo(()=>Array.from({length:64},(_,i)=>({x:-.9+((i*37)%61)/61*1.8,z:-.65+((i*23)%59)/59*1.1})),[])
 const colors=['#9a633d','#f5e5c8','#90552f','#f9ebd4','#53301e']
 useFrame(()=>{
 const p=reduced?1:progress.get(),assemble=ease((p-.03)/.32),lift=ease((p-.63)/.22)
 if(group.current){group.current.rotation.y=-.4+p*.6;group.current.position.y=-.55}
 layers.current?.children.forEach((l,i)=>{l.position.y=.12+i*.21+(1-assemble)*(i+1)*.5})
 if(bite.current){bite.current.position.set(lift*.5,.12+lift*1.5,lift*.3);bite.current.rotation.z=lift*.18;bite.current.scale.setScalar(1-lift*.45)}
 cocoa.current?.children.forEach((c,i)=>{const t=ease((p-.35-(i%8)*.01)/.2);c.visible=t>0;c.position.set(dust[i].x,1.19+(1-t)*(2+i%4*.2),dust[i].z)})
 })
 const layer=(color:string,i:number,geometry:THREE.ExtrudeGeometry)=><mesh key={i} geometry={geometry} rotation={[-Math.PI/2,0,0]} position={[0,i*.21,0]}><meshStandardMaterial color={color} bumpMap={texture} bumpScale={i%2===0?.035:.009} roughness={i===4?.95:.65}/></mesh>
 return <><Lights/><group ref={group}><PlateLogo/><mesh position={[0,0,0]}><cylinderGeometry args={[1.85,1.75,.1,80]}/><meshPhysicalMaterial color="#fbfbfb" roughness={.2} clearcoat={1}/></mesh><mesh position={[0,.06,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[1.65,.02,12,80]}/><meshStandardMaterial color="#e4e4e4"/></mesh><group ref={layers}>{colors.map((c,i)=>layer(c,i,bodyGeo))}</group><group ref={bite}>{colors.map((c,i)=>layer(c,i,biteGeo))}<group position={[1.05,-.04,-.25]} rotation={[0,0,-.05]}><mesh position={[.7,0,0]}><boxGeometry args={[1.2,.045,.1]}/><meshStandardMaterial color="#aaa" metalness={.9} roughness={.2}/></mesh>{[0,1,2,3].map(i=><mesh key={i} position={[0,0,-.16+i*.105]}><boxGeometry args={[.42,.035,.035]}/><meshStandardMaterial color="#bbb" metalness={.9} roughness={.2}/></mesh>)}</group></group><group ref={cocoa}>{dust.map((_,i)=><mesh key={i}><sphereGeometry args={[.012+(i%3)*.005,6,4]}/><meshStandardMaterial color="#4c2a16" roughness={1}/></mesh>)}</group></group><ContactShadows position={[0,-.65,0]} opacity={.25} scale={12} blur={2.8} far={5} resolution={256}/></>
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
