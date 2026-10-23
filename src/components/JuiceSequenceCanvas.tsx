import type { MotionValue } from 'motion/react'
import SurfaceLogo from './SurfaceLogo'
import FoodStudio from './FoodStudio'
import { LiquidPool, LiquidPour, LiquidVolume } from './LiquidEffects'
import { juicePose, landing } from '../lib/foodMotion'
import { foodTexture } from '../lib/foodTextures'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

const clamp=(n:number)=>Math.max(0,Math.min(1,n))
const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t)}
function OrangeSlice({map}:{map:THREE.Texture}){
 return <group rotation={[Math.PI/2,0,0]}>
  <mesh><cylinderGeometry args={[.34,.337,.07,48]}/><meshStandardMaterial color="#e99020" roughness={.7}/></mesh>
  {[1,-1].map(side=><mesh key={side} position={[0,side*.036,0]} rotation={[-side*Math.PI/2,0,0]}><circleGeometry args={[.34,48]}/><meshPhysicalMaterial map={map} bumpMap={map} bumpScale={.003} roughness={.42} clearcoat={.18}/></mesh>)}
 </group>
}
function JuiceScene({progress,reduced}:{progress:MotionValue<number>;reduced:boolean}){
 const motor=useRef<THREE.Group>(null)
 const blender=useRef<THREE.Group>(null),fruit=useRef<THREE.Group>(null),blade=useRef<THREE.Group>(null),lid=useRef<THREE.Group>(null),glass=useRef<THREE.Group>(null)
 const jar=useMemo(()=>new THREE.LatheGeometry([[.48,0],[.59,.12],[.77,1.6],[.82,1.68],[.78,1.73],[.72,1.64],[.54,.15],[.44,.08]].map(([x,y])=>new THREE.Vector2(x,y)),64),[])
 const tumbler=useMemo(()=>new THREE.LatheGeometry([[0,0],[.42,0],[.47,.06],[.57,1.62],[.55,1.65],[.52,1.61],[.42,.12],[0,.12]].map(([x,y])=>new THREE.Vector2(x,y)),64),[])
 const orangeMap=useMemo(()=>foodTexture('orange'),[])
 useEffect(()=>()=>orangeMap.dispose(),[orangeMap])
 const slices=useMemo(()=>Array.from({length:9},(_,i)=>({x:Math.sin(i*2.4)*.44,z:Math.cos(i*2.4)*.3,y:2.7+i*.38})),[])
 useFrame(()=>{
 const p=reduced?1:progress.get(),state=juicePose(p),{blend,tilt,settle}=state
 if(blender.current){blender.current.rotation.z=state.angle;blender.current.position.set(state.x,state.y,0);blender.current.visible=p<.97}
 if(lid.current){lid.current.position.y=1.8+1.8*(1-smooth((p-.27)/.06))+tilt*1.3;lid.current.visible=p<.52}
 if(motor.current){motor.current.position.x=-1.15-settle*3;motor.current.visible=p<.94}
 if(blade.current)blade.current.rotation.y=reduced?0:blend*90
 fruit.current?.children.forEach((f,i)=>{const seed=slices[i],fall=landing(p,.045+(i%5)*.012,.20,seed.y-.35,.025),dissolve=smooth((p-.30)/.16);f.visible=fall.visible&&dissolve<.995;f.position.set(seed.x*(1-dissolve),.35+fall.height,seed.z*(1-dissolve));f.rotation.set(seed.y+fall.turn*2,dissolve*18+i,fall.turn*3);f.scale.setScalar(1-dissolve)})
 if(glass.current){glass.current.position.x=state.glassX;glass.current.rotation.y=settle*.25;glass.current.scale.setScalar(1+settle*.12)}
 })
 return <>
 <FoodStudio/>
 <group position={[0,-.1,0]}>
 <group ref={motor} position={[-1.15,0,0]}>
  <mesh position={[0,-.4225,0]}><cylinderGeometry args={[.62,.73,.755,64]}/><meshPhysicalMaterial color="#f6f6f6" metalness={.18} roughness={.26} clearcoat={1}/></mesh>
  <mesh position={[0,-.08,0]}><cylinderGeometry args={[.5,.58,.13,64]}/><meshStandardMaterial color="#222" metalness={.7} roughness={.3}/></mesh>
  <mesh position={[0,-.36,.64]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.1,.1,.05,32]}/><meshStandardMaterial color="#222" metalness={.6} roughness={.3}/></mesh>
 </group>
 <group ref={blender} position={[-1.15,0,0]}>
  <mesh geometry={jar} position={[0,0,0]}><meshPhysicalMaterial color="#f5fbfc" transparent opacity={.28} roughness={.08} metalness={0} clearcoat={1} envMapIntensity={.9} side={THREE.DoubleSide} depthWrite={false}/></mesh>
  <mesh position={[.79,.86,0]} scale={[.65,1,.7]}><torusGeometry args={[.42,.06,16,48]}/><meshPhysicalMaterial color="#e3edef" transparent opacity={.4} roughness={.12} metalness={0}/></mesh>
  <group ref={blade} position={[0,.16,0]}>{[0,Math.PI/2].map(r=><mesh rotation={[0,r,.12]} key={r}><boxGeometry args={[.72,.025,.1]}/><meshStandardMaterial color="#aaa" metalness={.85} roughness={.2}/></mesh>)}</group>
  <LiquidVolume color="#ed9c29" sample={()=>{const state=juicePose(reduced?1:progress.get());return {bottom:.14,top:state.blend>.002?state.remaining:.14,radiusBottom:.45,radiusTop:.45+.20*state.blend*(1-state.fill),slope:Math.tan(-state.angle),ceiling:1.63}}}/>
  <LiquidPool kind="juice" sample={()=>{const p=reduced?1:progress.get(),state=juicePose(p);return {height:state.remaining,radius:state.blend>.002&&state.remaining>.18?.45+.20*state.blend*(1-state.fill):0,activity:p>.30&&p<.52?.7:state.flow*.4,slope:Math.tan(-state.angle),floor:.15,ceiling:1.63}}}/>
  <group ref={fruit}>{slices.map((s,i)=><group key={i} position={[s.x,s.y,s.z]}><OrangeSlice map={orangeMap}/></group>)}</group>
  <group ref={lid}><mesh><cylinderGeometry args={[.82,.8,.12,64]}/><meshStandardMaterial color="#222" roughness={.4}/></mesh><mesh position={[0,.12,0]}><cylinderGeometry args={[.19,.23,.18,32]}/><meshStandardMaterial color="#333"/></mesh></group>
 </group>
 <group ref={glass} position={[1.45,0,0]}><SurfaceLogo surface="glass"/>
  <mesh geometry={tumbler} position={[0,-.78,0]} renderOrder={2}><meshPhysicalMaterial color="#f0f7fa" transparent opacity={.24} roughness={.07} metalness={0} clearcoat={1} envMapIntensity={.85} side={THREE.DoubleSide} depthWrite={false}/></mesh>
  <mesh position={[0,.85,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.55,.018,12,64]}/><meshStandardMaterial color="#dce5e8" metalness={.25} transparent opacity={.65}/></mesh>
  <LiquidVolume color="#eea12c" sample={()=>{const state=juicePose(reduced?1:progress.get());return {bottom:-.66,top:state.top,radiusBottom:.425,radiusTop:state.radius}}}/>
  <LiquidPool kind="juice" sample={()=>{const state=juicePose(reduced?1:progress.get());return {height:state.top,radius:state.fill>.001?state.radius:0,activity:state.flow}}}/>
  <group position={[.43,.72,0]} rotation={[0,.4,-.25]}><OrangeSlice map={orangeMap}/></group>
 </group>
 <LiquidPour color="#ef9f29" bend sample={()=>{const state=juicePose(reduced?1:progress.get());return {from:state.lip,to:[state.glassX,state.top+.01,0],flow:state.flow,radius:.055,front:state.front,tail:state.tail}}}/>

 </group>
 <ContactShadows position={[0,-.9,0]} opacity={.22} scale={12} blur={2.8} far={6} resolution={256}/>
 </>
}

export default function JuiceSequenceCanvas({progress}:{progress:MotionValue<number>}){
 return <Canvas frameloop="always" camera={{position:[3.3,3.3,7.8],fov:38}} dpr={[1,1.75]} gl={{antialias:true,alpha:true}}><Suspense fallback={null}><JuiceScene progress={progress} reduced={false}/></Suspense></Canvas>
}
