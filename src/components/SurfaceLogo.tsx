import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import logo from '../assets/logo-ink.png'

const surfaces = {
 cup: {bottom:.34,height:.51,angle:.35,width:.62,profile:[[.2,.86],[.8,1.03],[1.18,1.09]]},
 glass: {bottom:-.4,height:.43,angle:.35,width:.94,profile:[[-.72,.47],[.84,.57]]},
 bowl: {bottom:.28,height:.54,angle:.1,width:.52,profile:[[.08,.8],[.5,1.15],[.85,1.38]]},
} as const
/** Transparent ink follows the vessel profile and turns with its parent. */
export default function SurfaceLogo({surface}:{surface:keyof typeof surfaces}){
 const texture=useTexture(logo)
 const geometry=useMemo(()=>{
  const spec=surfaces[surface]
  const points=Array.from({length:17},(_,i)=>{
   const y=spec.bottom+spec.height*i/16
   let radius:number=spec.profile[0][1]
   for(let j=1;j<spec.profile.length;j++){
    const [loY,loR]=spec.profile[j-1],[hiY,hiR]=spec.profile[j]
    if(y<=hiY){radius=loR+(hiR-loR)*(y-loY)/(hiY-loY);break}
   }
   return new THREE.Vector2(radius+.004,y)
  })
  return new THREE.LatheGeometry(points,40,spec.angle-spec.width/2,spec.width)
 },[surface])
 return <mesh geometry={geometry} renderOrder={4}><meshStandardMaterial map={texture} transparent alphaTest={.03} depthWrite={false} roughness={.55} polygonOffset polygonOffsetFactor={-2}/></mesh>
}

export function PlateLogo(){
 const texture=useTexture(logo)
 return <mesh position={[0,.067,1.22]} rotation={[-Math.PI/2,0,0]} renderOrder={4}><planeGeometry args={[.44,.387]}/><meshStandardMaterial map={texture} transparent alphaTest={.03} depthWrite={false} roughness={.55} polygonOffset polygonOffsetFactor={-2}/></mesh>
}
