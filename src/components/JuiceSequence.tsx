import SceneFallback, { SceneBoundary } from './SceneFallback'
import { useReducedMotion } from '../lib/useReducedMotion'
import fallbackPhoto from '../assets/product/juice-v2.webp'
import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
const SceneCanvas=lazy(()=>import('./JuiceSequenceCanvas'))
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
 <div className="demo-canvas juice-canvas" role="img" aria-label="Scroll to drop orange slices into a blender, blend them, tilt the jug and pour orange juice into a glass"><SceneBoundary image={fallbackPhoto}>{visible&&!reduced?<Suspense fallback={<SceneFallback image={fallbackPhoto} reduced={reduced}/>}><SceneCanvas progress={scrollYProgress}/></Suspense>:<SceneFallback image={fallbackPhoto} reduced={reduced}/>}</SceneBoundary></div>
 <div className="demo-bottom"><a href="#bowl-preview">NEXT: SMOOTHIE BOWLS ↓</a><span>02 / FRESH JUICE</span></div>
 <div className="demo-track"><motion.div style={{width:bar}}/></div>
 </div>
 </section>
}
