import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
/** Local studio reflections; no remote environment maps or extra image requests. */
export default function FoodStudio(){
 const {gl,scene,invalidate}=useThree()
 useEffect(()=>{
  const room=new RoomEnvironment(),generator=new THREE.PMREMGenerator(gl),target=generator.fromScene(room,.04),previous=scene.environment,previousIntensity=scene.environmentIntensity
  scene.environment=target.texture;scene.environmentIntensity=.5;invalidate();room.dispose();generator.dispose()
  return()=>{scene.environment=previous;scene.environmentIntensity=previousIntensity;target.dispose()}
 },[gl,scene,invalidate])
 return <><ambientLight intensity={.5}/><directionalLight position={[3,7,4]} intensity={2}/><directionalLight position={[-4,4,-2]} intensity={.8}/></>
}
