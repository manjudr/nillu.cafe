import SceneFallback, { SceneBoundary } from './SceneFallback'
import { useReducedMotion } from '../lib/useReducedMotion'
import fallbackPhoto from '../assets/product/juice-v2.webp'
import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
const SceneCanvas=lazy(()=>import('./JuiceSequenceCanvas'))
const chapters=[['It starts','with fruit.','Fruit, ready to blend.'],['Fruit,','freshly blended.','The fruit goes into the blender.'],['Poured into','your glass.','Blended and ready to pour.'],['A fresh change','of pace.','In the mood for something fruity? Try a fresh juice.']]
export default function JuiceSequence({compact=false}:{compact?:boolean}){
 const ref=useRef<HTMLElement>(null),reduced=!!useReducedMotion()
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']})
 const visible=useInView(ref,{margin:'300px 0px'})
 const [chapter,setChapter]=useState(0)
 useMotionValueEvent(scrollYProgress,'change',p=>setChapter(p<.12?0:p<.52?1:p<.84?2:3))
 const active=reduced||compact?3:chapter
 const bar=useTransform(scrollYProgress,[0,1],['0%','100%'])
 return <section className="coffee-demo juice-demo" id="juice-preview" ref={ref} aria-label="Fresh juice experience">
 <div className="demo-sticky">
 <div className="demo-copy" aria-live="polite" data-chapter={active+1}><span className="kicker">FRESH JUICE</span><motion.div key={active} initial={reduced||compact?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.5}}><h2>{chapters[active][0]}<br/><em>{chapters[active][1]}</em></h2><p>{chapters[active][2]}</p></motion.div></div>
 <div className="demo-canvas juice-canvas" role="img" aria-label="Scroll to drop orange slices into a blender, blend them, tilt the jug and pour orange juice into a glass"><SceneBoundary image={fallbackPhoto}>{visible&&!reduced?<Suspense fallback={<SceneFallback image={fallbackPhoto} reduced={reduced}/>}><SceneCanvas progress={scrollYProgress}/></Suspense>:<SceneFallback image={fallbackPhoto} reduced={reduced}/>}</SceneBoundary></div>
 <div className="demo-bottom"><a href="#bowl-preview">NEXT: SMOOTHIE BOWLS ↓</a><span>02 / FRESH JUICE</span></div>
 <div className="demo-track"><motion.div style={{width:bar}}/></div>
 </div>
 </section>
}
