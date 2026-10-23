import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { foodTexture } from '../lib/foodTextures'
import type { FoodTexture } from '../lib/foodTextures'

type Point=readonly [number,number,number]
export type PoolSample={height:number;radius:number;activity:number;slope?:number;floor?:number;ceiling?:number}
const RINGS=18,SEGMENTS=72
function poolGeometry(){
 const positions=new Float32Array((RINGS+1)*(SEGMENTS+1)*3),uv=new Float32Array((RINGS+1)*(SEGMENTS+1)*2),indices:number[]=[]
 for(let r=0;r<=RINGS;r++)for(let a=0;a<=SEGMENTS;a++){const i=r*(SEGMENTS+1)+a,x=Math.cos(a/SEGMENTS*Math.PI*2)*r/RINGS,z=Math.sin(a/SEGMENTS*Math.PI*2)*r/RINGS;uv[i*2]=.5+x*.5;uv[i*2+1]=.5+z*.5;if(r<RINGS&&a<SEGMENTS){const b=i+SEGMENTS+1;indices.push(i,i+1,b,i+1,b+1,b)}}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.setIndex(indices);return geometry
}
/** A receiving surface with a small impact hollow, travelling waves and a meniscus. */
export function LiquidPool({sample,kind}:{sample:()=>PoolSample;kind:FoodTexture}){
 const mesh=useRef<THREE.Mesh>(null),geometry=useMemo(poolGeometry,[]),texture=useMemo(()=>foodTexture(kind),[kind])
 useEffect(()=>()=>{geometry.dispose();texture.dispose()},[geometry,texture])
 useFrame(({clock})=>{
  const {height,radius,activity,slope=0,floor=-Infinity,ceiling=Infinity}=sample(),time=clock.getElapsedTime(),position=geometry.attributes.position
  if(mesh.current)mesh.current.visible=radius>.01
  for(let r=0;r<=RINGS;r++)for(let a=0;a<=SEGMENTS;a++){
   const fraction=r/RINGS,angle=a/SEGMENTS*Math.PI*2,x=Math.cos(angle)*fraction*radius,z=Math.sin(angle)*fraction*radius
   const wave=activity*(Math.sin(fraction*24-time*7)*.014*Math.exp(-fraction*2)-.035*Math.exp(-fraction*15))
   position.setXYZ(r*(SEGMENTS+1)+a,x,Math.max(floor,Math.min(ceiling,height+x*slope+wave+.012*Math.pow(fraction,16))),z)
  }
  position.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere()
 })
 return <mesh ref={mesh} name={'liquid-surface-'+kind} geometry={geometry}><meshPhysicalMaterial map={texture} roughness={kind==='smoothie'?.55:.28} clearcoat={kind==='smoothie'?.18:.7} clearcoatRoughness={.25} side={THREE.DoubleSide}/></mesh>
}
export type PourSample={from:Point;to:Point;flow:number;radius:number;front?:number;tail?:number}
const ROWS=44,SIDES=12
function pourGeometry(){
 const geometry=new THREE.BufferGeometry(),indices:number[]=[]
 geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array((ROWS+1)*(SIDES+1)*3),3))
 for(let r=0;r<ROWS;r++)for(let a=0;a<SIDES;a++){const i=r*(SIDES+1)+a,b=i+SIDES+1;indices.push(i,i+1,b,i+1,b+1,b)}
 geometry.setIndex(indices);return geometry
}
/** A moving, tapered free stream. Its ends follow the source lip and the liquid level. */
export function LiquidPour({sample,color,bend=false,thick=false}:{sample:()=>PourSample;color:string;bend?:boolean;thick?:boolean}){
 const group=useRef<THREE.Group>(null),drops=useRef<THREE.InstancedMesh>(null),geometry=useMemo(pourGeometry,[]),dummy=useMemo(()=>new THREE.Object3D(),[])
 const material=useMemo(()=>new THREE.MeshPhysicalMaterial({color,roughness:thick?.42:.26,clearcoat:.35,clearcoatRoughness:.22,envMapIntensity:.35,specularIntensity:.65}),[color,thick])
 useEffect(()=>()=>{geometry.dispose();material.dispose()},[geometry,material])
 useFrame(({clock})=>{
  const {from,to,flow,radius,front=1,tail=0}=sample(),time=clock.getElapsedTime(),position=geometry.attributes.position
  if(group.current)group.current.visible=flow>.008
  if(flow<=.008)return
  const dx=to[0]-from[0],dy=to[1]-from[1],dz=to[2]-from[2]
  for(let r=0;r<=ROWS;r++){
   const s=tail+(front-tail)*r/ROWS,gravity=bend?s*s:s,tangentY=dy*(bend?Math.max(.03,2*s):1),len=Math.hypot(dx,tangentY)||1,nx=-tangentY/len,ny=dx/len
   const wobble=Math.sin(Math.PI*s)*(thick?.009:.018)*Math.sin(s*23-time*8)
   const x=from[0]+dx*s+wobble,y=from[1]+dy*gravity,z=from[2]+dz*s+wobble*.45
   const neck=1-s*(thick?.10:.42),pulse=1+(thick?.07:.16)*Math.sin(s*42-time*13)+.045*Math.sin(s*81-time*19)
   const width=radius*Math.sqrt(flow)*neck*pulse
   for(let a=0;a<=SIDES;a++){const angle=a/SIDES*Math.PI*2,c=Math.cos(angle)*width,sn=Math.sin(angle)*width;position.setXYZ(r*(SIDES+1)+a,x+nx*c,y+ny*c,z+sn)}
  }
  position.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere()
  if(drops.current){drops.current.visible=front>.99&&tail<.99;for(let i=0;i<14;i++){
   const p=(time*(thick?.8:1.5)+i*.173)%1,angle=i*2.3999,spread=(thick?.075:.15)*Math.sin(p*Math.PI),size=radius*(thick?.26:.34)*(1-p*.5)*Math.sqrt(flow)
   dummy.position.set(to[0]+Math.cos(angle)*spread,to[1]+.018+Math.sin(p*Math.PI)*(thick?.08:.16),to[2]+Math.sin(angle)*spread)
   dummy.scale.set(size,size*(1.2-p*.5),size);dummy.updateMatrix();drops.current.setMatrixAt(i,dummy.matrix)
  }drops.current.instanceMatrix.needsUpdate=true}
 })
 return <group ref={group} name="free-liquid-pour"><mesh geometry={geometry} material={material}/><instancedMesh ref={drops} args={[undefined,undefined,14]} material={material}><sphereGeometry args={[1,8,6]}/></instancedMesh></group>
}

export type VolumeSample={bottom:number;top:number;radiusTop:number;radiusBottom:number;slope?:number;ceiling?:number}
export function LiquidVolume({sample,color}:{sample:()=>VolumeSample;color:string}){
 const mesh=useRef<THREE.Mesh>(null)
 const geometry=useMemo(()=>new THREE.CylinderGeometry(1,1,1,64,1,true),[])
 const original=useMemo(()=>new Float32Array(geometry.attributes.position.array),[geometry])
 useEffect(()=>()=>geometry.dispose(),[geometry])
 useFrame(()=>{const {bottom,top,radiusTop,radiusBottom,slope=0,ceiling=Infinity}=sample(),position=geometry.attributes.position;if(mesh.current)mesh.current.visible=top>bottom+.002;for(let i=0;i<position.count;i++){const upper=original[i*3+1]>0,radius=upper?radiusTop:radiusBottom,x=original[i*3]*radius,z=original[i*3+2]*radius;position.setXYZ(i,x,upper?Math.max(bottom+.002,Math.min(ceiling,top+x*slope)):bottom,z)}position.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere()})
 return <mesh ref={mesh} geometry={geometry}><meshPhysicalMaterial color={color} roughness={.43} clearcoat={.25}/></mesh>
}
