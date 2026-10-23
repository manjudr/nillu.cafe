import type { MotionValue } from 'motion/react'
import SurfaceLogo from './SurfaceLogo'
import FoodStudio from './FoodStudio'
import { LiquidPool, LiquidPour } from './LiquidEffects'
import { coffeeFill } from '../lib/foodMotion'
import { COFFEE_BEANS, coffeeBeanPose } from '../lib/coffeeBeans'
import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

const clamp = (n:number) => Math.max(0, Math.min(1,n))
function Scene({progress,reduced}:{progress:MotionValue<number>;reduced:boolean}) {
 const group=useRef<THREE.Group>(null)
 const beans=useRef<THREE.Group>(null)
 const cup=useMemo(()=>new THREE.LatheGeometry([
 new THREE.Vector2(.71,0),new THREE.Vector2(.79,.05),new THREE.Vector2(.86,.2),new THREE.Vector2(1.03,.8),new THREE.Vector2(1.09,1.18),new THREE.Vector2(1.08,1.23),new THREE.Vector2(1.01,1.24),new THREE.Vector2(.99,1.17),new THREE.Vector2(.93,.8),new THREE.Vector2(.77,.2),new THREE.Vector2(.70,.12),new THREE.Vector2(0,.12)],96),[])
 const seeds=COFFEE_BEANS
 useFrame(()=>{
 const p=reduced?1:progress.get()
 if(group.current){group.current.rotation.y=-.28+p*.65;group.current.position.y=-.65;group.current.scale.setScalar(.94+clamp((p-.65)/.35)*.13)}
 beans.current?.children.forEach((b,i)=>{const s=seeds[i],pose=coffeeBeanPose(p,i);b.position.set(pose.x,pose.y,pose.z);b.rotation.set(s.turn+pose.fall*6,pose.fall*5,s.turn+pose.fall*3);b.visible=pose.visible;b.scale.setScalar(.85)})
 })
 return <>
 <FoodStudio/>
 <group ref={group}>
  <SurfaceLogo surface="cup"/><mesh geometry={cup}><meshPhysicalMaterial color="#fcfcfc" roughness={.24} metalness={0} clearcoat={.65} side={THREE.DoubleSide}/></mesh>
  <mesh position={[1.13,.68,0]} rotation={[0,0,0]} scale={[.72,1,.8]}><torusGeometry args={[.48,.105,24,64]}/><meshPhysicalMaterial color="#fafafa" roughness={.2} clearcoat={1}/></mesh>
  <mesh position={[0,-.065,0]}><cylinderGeometry args={[1.65,1.55,.11,96]}/><meshPhysicalMaterial color="#fafafa" roughness={.25} clearcoat={1}/></mesh>
  <mesh position={[0,-.001,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[1.4,.023,12,96]}/><meshStandardMaterial color="#eee" roughness={.4}/></mesh>
  <LiquidPool kind="coffee" sample={()=>{const state=coffeeFill(reduced?1:progress.get());return {...state,activity:state.flow}}}/>
  <LiquidPour color="#62341c" sample={()=>{const state=coffeeFill(reduced?1:progress.get());return {from:[-.05,5.2,0],to:[0,state.height+.01,0],flow:state.flow,radius:.030,front:state.front,tail:state.tail}}}/>
 <group ref={beans}>{seeds.map((s,i)=><group key={i} position={[s.x,s.start,s.z]}><mesh scale={[.12,.19,.105]}><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color={i%2?'#53301d':'#392319'} roughness={.72}/></mesh><mesh position={[0,0,.099]} rotation={[0,0,.12]}><capsuleGeometry args={[.009,.24,4,8]}/><meshStandardMaterial color="#21150f"/></mesh></group>)}</group>
 </group>
 <ContactShadows position={[0,-.78,0]} opacity={.25} scale={12} blur={2.8} far={5} resolution={256}/>

 </>
}

export default function CoffeePreviewCanvas({progress}:{progress:MotionValue<number>}){
 return <Canvas frameloop="always" camera={{position:[3.4,4.1,6.6],fov:35}} dpr={[1,1.75]} gl={{antialias:true,alpha:true}}><Suspense fallback={null}><Scene progress={progress} reduced={false}/></Suspense></Canvas>
}
