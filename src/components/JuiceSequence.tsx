import SurfaceLogo from './SurfaceLogo'
import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'

const clamp=(n:number)=>Math.max(0,Math.min(1,n))
const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t)}
function OrangeSlice(){
 return <group rotation={[Math.PI/2,0,0]}>
  <mesh><cylinderGeometry args={[.34,.34,.075,48]}/><meshStandardMaterial color="#fa8608" roughness={.65}/></mesh>
  <mesh position={[0,.04,0]}><cylinderGeometry args={[.308,.308,.01,48]}/><meshStandardMaterial color="#fff1c9"/></mesh>
  {Array.from({length:10},(_,i)=><mesh key={i} position={[0,.048,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.284,10,i*Math.PI/5+.035,Math.PI/5-.07]}/><meshStandardMaterial color={i%2?'#ffb62c':'#ffa318'} roughness={.35} side={THREE.DoubleSide}/></mesh>)}
  <mesh position={[0,.05,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.035,16]}/><meshStandardMaterial color="#fff0ca"/></mesh>
 </group>
}
function JuiceScene({progress,reduced}:{progress:MotionValue<number>;reduced:boolean}){
 const motor=useRef<THREE.Group>(null)
 const blender=useRef<THREE.Group>(null),fruit=useRef<THREE.Group>(null),juice=useRef<THREE.Mesh>(null),glassFill=useRef<THREE.Mesh>(null),pour=useRef<THREE.Mesh>(null),blade=useRef<THREE.Group>(null),lid=useRef<THREE.Group>(null),glass=useRef<THREE.Group>(null)
 const jar=useMemo(()=>new THREE.LatheGeometry([[.48,0],[.59,.12],[.77,1.6],[.82,1.68],[.78,1.73],[.72,1.64],[.54,.15],[.44,.08]].map(([x,y])=>new THREE.Vector2(x,y)),64),[])
 const tumbler=useMemo(()=>new THREE.LatheGeometry([[0,0],[.42,0],[.47,.06],[.57,1.62],[.55,1.65],[.52,1.61],[.42,.12],[0,.12]].map(([x,y])=>new THREE.Vector2(x,y)),64),[])
 const pourGeo=useMemo(()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(.49,1.28,0),new THREE.Vector3(.9,1.2,0),new THREE.Vector3(1.29,.65,0),new THREE.Vector3(1.4,-.1,0)]),40,.065,12,false),[])
 const slices=useMemo(()=>Array.from({length:9},(_,i)=>({x:Math.sin(i*2.4)*.44,z:Math.cos(i*2.4)*.3,y:2.7+i*.38})),[])
 useFrame(()=>{
 const p=reduced?1:progress.get(),fall=smooth((p-.07)/.23),blend=smooth((p-.32)/.15),tilt=smooth((p-.52)/.09),settle=smooth((p-.8)/.14),fill=clamp((p-.6)/.2)
 if(blender.current){blender.current.rotation.z=-tilt*.95*(1-settle);blender.current.position.set(-.8-settle*.7,0,0);blender.current.scale.setScalar(1-settle*.95);blender.current.visible=p<.95}
 if(lid.current){lid.current.position.y=1.8+1.8*(1-smooth((p-.27)/.06))+tilt*1.3;lid.current.visible=p<.54}
 if(motor.current){motor.current.scale.setScalar(1-settle*.95);motor.current.visible=p<.95}
 if(juice.current){juice.current.visible=p>.3;juice.current.scale.y=Math.max(.001,blend*(1-fill)*.75);juice.current.position.y=.82+blend*(1-fill)*.6}
 if(blade.current)blade.current.rotation.y=reduced?0:blend*70
 fruit.current?.children.forEach((f,i)=>{const s=slices[i],b=smooth((p-.3)/.16);f.visible=p<.47;f.position.set(s.x*(1-b),s.y*(1-fall)+(.88+(i%3)*.2)*fall,s.z*(1-b));f.rotation.set(i+fall*3,b*18+i,fall*4);f.scale.setScalar(1-b)})
 if(glassFill.current){glassFill.current.visible=fill>0;glassFill.current.scale.y=Math.max(.001,fill);glassFill.current.position.y=-.67+fill*.66}
 if(pour.current){pour.current.visible=p>.59&&p<.82;pour.current.scale.setScalar(1);const thickness=Math.sin(clamp((p-.59)/.03)*Math.PI/2)*Math.sin(clamp((.82-p)/.03)*Math.PI/2);(pour.current.material as THREE.MeshPhysicalMaterial).opacity=thickness}
 if(glass.current){glass.current.position.x=1.4-settle*.65;glass.current.rotation.y=settle*.25;glass.current.scale.setScalar(1+settle*.17)}
 })
 return <>
 <ambientLight intensity={1.6}/><directionalLight position={[3,6,4]} intensity={3.5}/><directionalLight position={[-3,3,-2]} intensity={2}/>
 <group position={[0,-.1,0]}>
 <group ref={motor} position={[-.8,0,0]}>
  <mesh position={[0,-.37,0]}><cylinderGeometry args={[.62,.73,.65,64]}/><meshPhysicalMaterial color="#f6f6f6" metalness={.18} roughness={.26} clearcoat={1}/></mesh>
  <mesh position={[0,-.08,0]}><cylinderGeometry args={[.5,.58,.13,64]}/><meshStandardMaterial color="#222" metalness={.7} roughness={.3}/></mesh>
  <mesh position={[0,-.36,.64]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.1,.1,.05,32]}/><meshStandardMaterial color="#222" metalness={.6} roughness={.3}/></mesh>
 </group>
 <group ref={blender} position={[-.8,0,0]}>
  <mesh geometry={jar} position={[0,0,0]}><meshPhysicalMaterial color="#d3e7ed" transparent opacity={.22} roughness={.08} metalness={.12} side={THREE.DoubleSide} depthWrite={false}/></mesh>
  <mesh position={[.79,.86,0]} scale={[.65,1,.7]}><torusGeometry args={[.42,.06,16,48]}/><meshPhysicalMaterial color="#cadbde" transparent opacity={.4} roughness={.12}/></mesh>
  <group ref={blade} position={[0,.16,0]}>{[0,Math.PI/2].map(r=><mesh rotation={[0,r,.12]} key={r}><boxGeometry args={[.72,.025,.1]}/><meshStandardMaterial color="#aaa" metalness={.85} roughness={.2}/></mesh>)}</group>
  <mesh ref={juice} position={[0,.5,0]}><cylinderGeometry args={[.67,.5,1.2,64]}/><meshPhysicalMaterial color="#ff9b0b" roughness={.35} clearcoat={.6}/></mesh>
  <group ref={fruit}>{slices.map((s,i)=><group key={i} position={[s.x,s.y,s.z]}><OrangeSlice/></group>)}</group>
  <group ref={lid}><mesh><cylinderGeometry args={[.82,.8,.12,64]}/><meshStandardMaterial color="#222" roughness={.4}/></mesh><mesh position={[0,.12,0]}><cylinderGeometry args={[.19,.23,.18,32]}/><meshStandardMaterial color="#333"/></mesh></group>
 </group>
 <group ref={glass} position={[1.4,0,0]}><SurfaceLogo surface="glass"/>
  <mesh geometry={tumbler} position={[0,-.78,0]} renderOrder={2}><meshPhysicalMaterial color="#c5d8df" transparent opacity={.2} roughness={.06} metalness={.1} side={THREE.DoubleSide} depthWrite={false}/></mesh>
  <mesh position={[0,.85,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.55,.018,12,64]}/><meshStandardMaterial color="#dce5e8" metalness={.25} transparent opacity={.65}/></mesh>
  <mesh ref={glassFill}><cylinderGeometry args={[.515,.42,1.32,64]}/><meshPhysicalMaterial color="#ffa512" roughness={.3} clearcoat={.7}/></mesh>
  <group position={[.43,.72,0]} rotation={[0,.4,-.25]}><OrangeSlice/></group>
 </group>
 <mesh ref={pour} geometry={pourGeo}><meshPhysicalMaterial color="#ffa512" roughness={.25} clearcoat={1} transparent/></mesh>
 </group>
 <ContactShadows position={[0,-.9,0]} opacity={.22} scale={12} blur={2.8} far={6} resolution={256}/>
 </>
}
const chapters=[['It starts','with fruit.','Bright fruit flavours, ready for the blender.'],['Fruit,','freshly blended.','The slices come together in a refreshing blend.'],['Poured into','your glass.','From the blender to a refreshing sip.'],['A fresh change','of pace.','Bright fruit flavours for afternoons that call for something refreshing.']]
export default function JuiceSequence(){
 const ref=useRef<HTMLElement>(null),reduced=!!useReducedMotion()
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']})
 const visible=useInView(ref,{margin:'300px 0px'})
 const [chapter,setChapter]=useState(0)
 useMotionValueEvent(scrollYProgress,'change',p=>setChapter(p<.12?0:p<.52?1:p<.84?2:3))
 const active=reduced?3:chapter
 const bar=useTransform(scrollYProgress,[0,1],['0%','100%'])
 return <section className="coffee-demo juice-demo" id="juice-preview" ref={ref} aria-label="Fresh juice experience">
 <div className="demo-sticky">
 <div className="demo-copy" aria-live="polite"><span className="kicker">{String(active+1).padStart(2,'0')} / FRESH JUICE</span><motion.div key={active} initial={reduced?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.5}}><h2>{chapters[active][0]}<br/><em>{chapters[active][1]}</em></h2><p>{chapters[active][2]}</p></motion.div></div>
 <div className="demo-canvas juice-canvas" role="img" aria-label="Scroll to drop orange slices into a blender, blend them, tilt the jug and pour orange juice into a glass"><Canvas frameloop={visible?(reduced?'demand':'always'):'never'} camera={{position:[3.3,3.3,7.8],fov:38}} dpr={[1,1.75]} gl={{antialias:true,alpha:true}}><Suspense fallback={null}><JuiceScene progress={scrollYProgress} reduced={reduced}/></Suspense></Canvas></div>
 <div className="demo-bottom"><a href="#bowl-preview">NEXT: SMOOTHIE BOWLS ↓</a><span>02 / FRESH JUICE</span></div>
 <div className="demo-track"><motion.div style={{width:bar}}/></div>
 </div>
 </section>
}
