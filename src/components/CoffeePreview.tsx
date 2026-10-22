import SurfaceLogo from './SurfaceLogo'
import { COFFEE_BEANS, coffeeBeanPose } from '../lib/coffeeBeans'
import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import * as THREE from 'three'

const clamp = (n:number) => Math.max(0, Math.min(1,n))
function Scene({progress,reduced}:{progress:MotionValue<number>;reduced:boolean}) {
 const group=useRef<THREE.Group>(null)
 const liquid=useRef<THREE.Mesh>(null)
 const stream=useRef<THREE.Mesh>(null)
 const beans=useRef<THREE.Group>(null)
 const ripple=useRef<THREE.Mesh>(null)
 const cup=useMemo(()=>new THREE.LatheGeometry([
 new THREE.Vector2(.71,0),new THREE.Vector2(.79,.05),new THREE.Vector2(.86,.2),new THREE.Vector2(1.03,.8),new THREE.Vector2(1.09,1.18),new THREE.Vector2(1.08,1.23),new THREE.Vector2(1.01,1.24),new THREE.Vector2(.99,1.17),new THREE.Vector2(.93,.8),new THREE.Vector2(.77,.2),new THREE.Vector2(.70,.12),new THREE.Vector2(0,.12)],96),[])
 const seeds=COFFEE_BEANS
 useFrame(()=>{
 const p=reduced?1:progress.get()
 if(group.current){group.current.rotation.y=-.28+p*.65;group.current.position.y=-.6+clamp((p-.78)/.22)*.12;group.current.scale.setScalar(.94+clamp((p-.65)/.35)*.13)}
 const fill=clamp((p-.34)/.4)
 if(liquid.current){liquid.current.position.y=.15+fill*.91;liquid.current.scale.setScalar(.73+fill*.27);liquid.current.visible=p>.34}
 if(stream.current){const pouring=p>.32&&p<.78;stream.current.visible=pouring;stream.current.scale.x=stream.current.scale.z=Math.sin(clamp((p-.32)/.04)*Math.PI/2)*Math.sin(clamp((.78-p)/.05)*Math.PI/2)}
 if(ripple.current){ripple.current.visible=p>.35&&p<.8;ripple.current.position.y=.16+fill*.91;ripple.current.scale.setScalar(.3+((p*18)%1)*.65);(ripple.current.material as THREE.MeshStandardMaterial).opacity=.35*(1-((p*18)%1))}
 beans.current?.children.forEach((b,i)=>{const s=seeds[i],pose=coffeeBeanPose(p,i);b.position.set(pose.x,pose.y,pose.z);b.rotation.set(s.turn+pose.fall*6,pose.fall*5,s.turn+pose.fall*3);b.visible=pose.visible;b.scale.setScalar(.85)})
 })
 return <>
 <ambientLight intensity={1.25}/><directionalLight position={[3,7,4]} intensity={3}/><directionalLight position={[-4,3,-2]} intensity={2}/>
 <group ref={group}>
  <SurfaceLogo surface="cup"/><mesh geometry={cup}><meshPhysicalMaterial color="#fcfcfc" roughness={.2} metalness={.04} clearcoat={1} side={THREE.DoubleSide}/></mesh>
  <mesh position={[1.13,.68,0]} rotation={[0,0,0]} scale={[.72,1,.8]}><torusGeometry args={[.48,.105,24,64]}/><meshPhysicalMaterial color="#fafafa" roughness={.2} clearcoat={1}/></mesh>
  <mesh position={[0,-.065,0]}><cylinderGeometry args={[1.65,1.55,.11,96]}/><meshPhysicalMaterial color="#fafafa" roughness={.25} clearcoat={1}/></mesh>
  <mesh position={[0,-.001,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[1.4,.023,12,96]}/><meshStandardMaterial color="#eee" roughness={.4}/></mesh>
  <mesh ref={liquid} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.99,96]}/><meshPhysicalMaterial color="#8b4e27" roughness={.28} clearcoat={1}/></mesh>
  <mesh ref={stream} position={[0,2.3,0]}><cylinderGeometry args={[.035,.055,3.1,20]}/><meshPhysicalMaterial color="#623019" roughness={.2} clearcoat={1}/></mesh>
  <mesh ref={ripple} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.7,.008,8,64]}/><meshStandardMaterial color="#e5bb7c" transparent opacity={.3}/></mesh>
 <group ref={beans}>{seeds.map((s,i)=><group key={i} position={[s.x,s.start,s.z]}><mesh scale={[.12,.19,.105]}><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color={i%2?'#53301d':'#392319'} roughness={.45}/></mesh><mesh position={[0,0,.099]} rotation={[0,0,.12]}><capsuleGeometry args={[.009,.24,4,8]}/><meshStandardMaterial color="#21150f"/></mesh></group>)}</group>
 </group>
 <ContactShadows position={[0,-.78,0]} opacity={.25} scale={12} blur={2.8} far={5} resolution={256}/>

 </>
}
const chapters=[['It starts','with a bean.','The first step towards your next coffee.'],['A coffee','in the making.','A familiar ritual, from bean to cup.'],['Poured slowly.','Worth the wait.','A rich pour fills the cup. Your moment is next.'],['Your coffee.','Your moment.','A catch-up with a friend, a little time alone, or a break between plans. There’s always a moment for coffee.']]
export default function CoffeePreview(){
 const ref=useRef<HTMLElement>(null)
 const reduced=useReducedMotion()
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']})
 const visible=useInView(ref,{margin:'300px 0px'})
 const [chapter,setChapter]=useState(0)
 useMotionValueEvent(scrollYProgress,'change',p=>setChapter(p<.12?0:p<.34?1:p<.78?2:3))
 const active=reduced?3:chapter
 const bar=useTransform(scrollYProgress,[0,1],['0%','100%'])
 return <section className="coffee-demo" id="coffee-preview" ref={ref}>
  <div className="demo-sticky">
   <div className="demo-copy" aria-live="polite"><span className="kicker">{String(active+1).padStart(2,'0')} / COFFEE</span><motion.div key={active} initial={reduced?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.5}}><h2>{chapters[active][0]}<br/><em>{chapters[active][1]}</em></h2><p>{chapters[active][2]}</p></motion.div></div>
   <div className="demo-canvas" role="img" aria-label="Scroll-controlled 3D coffee scene: beans fall, espresso pours, and a white ceramic cup fills"><Canvas frameloop={visible?(reduced?'demand':'always'):'never'} camera={{position:[3.4,4.1,6.6],fov:35}} dpr={[1,1.75]} gl={{antialias:true,alpha:true}}><Suspense fallback={null}><Scene progress={scrollYProgress} reduced={!!reduced}/></Suspense></Canvas></div>
   <div className="demo-bottom"><a href="#juice-preview">NEXT: FRESH JUICE ↓</a><span>NILLU / COFFEE</span></div>
   <div className="demo-track"><motion.div style={{width:bar}}/></div>
  </div>
 </section>
}
