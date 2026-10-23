import SceneFallback, { SceneBoundary } from './SceneFallback'
import { useReducedMotion } from '../lib/useReducedMotion'
import fallbackPhoto from '../assets/product/coffee-v2.webp'
import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
const SceneCanvas=lazy(()=>import('./CoffeePreviewCanvas'))
const chapters=[['It starts','with a bean.','Every cup begins with coffee beans.'],['A coffee','in the making.','From beans to your cup.'],['Poured slowly.','Worth the wait.','Almost ready for that first sip.'],['Your coffee.','Your moment.','Coffee with a friend, or a cup all to yourself. Enjoy it your way.']]
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
   <div className="demo-copy" aria-live="polite" data-chapter={active+1}><span className="kicker">COFFEE</span><motion.div key={active} initial={reduced?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.5}}><h2>{chapters[active][0]}<br/><em>{chapters[active][1]}</em></h2><p>{chapters[active][2]}</p></motion.div></div>
   <div className="demo-canvas" role="img" aria-label="Scroll-controlled 3D coffee scene: beans fall, espresso pours, and a white ceramic cup fills"><SceneBoundary image={fallbackPhoto}>{visible&&!reduced?<Suspense fallback={<SceneFallback image={fallbackPhoto} reduced={reduced}/>}><SceneCanvas progress={scrollYProgress}/></Suspense>:<SceneFallback image={fallbackPhoto} reduced={reduced}/>}</SceneBoundary></div>
   <div className="demo-bottom"><a href="#juice-preview">NEXT: FRESH JUICE ↓</a><span>01 / COFFEE</span></div>
   <div className="demo-track"><motion.div style={{width:bar}}/></div>
  </div>
 </section>
}
