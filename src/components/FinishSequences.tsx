import SceneFallback, { SceneBoundary } from './SceneFallback'
import { useReducedMotion } from '../lib/useReducedMotion'
import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import bowlPhoto from '../assets/product/bowl-v2.webp'
import dessertPhoto from '../assets/product/dessert-v2.webp'
const SceneCanvas=lazy(()=>import('./FinishCanvas'))
const content={
 bowl:{id:'bowl-preview',label:'SMOOTHIE BOWLS',number:'03',prev:'juice-preview',next:'dessert-preview',image:bowlPhoto,steps:['THE BASE','THE FRUIT','THE FINISH','THE BOWL'],positions:[0,.43,.72,1],chapters:[['A smoothie.','By the spoonful.','A smooth base, ready for fruit and toppings.'],['Fruit, colour,','and texture.','Fruit and toppings bring the bowl together.'],['A little','crunch on top.','A finishing sprinkle adds another texture.'],['A spoonful of','something good.','Smoothie bowls with fruit and toppings, bringing different flavours and textures to every spoonful.']]},
 dessert:{id:'dessert-preview',label:'DESSERTS',number:'04',prev:'bowl-preview',next:'bites',image:dessertPhoto,steps:['THE LAYERS','THE COCOA','THE BITE','THE DESSERT'],positions:[0,.45,.73,1],chapters:[['Tiramisu,','layer by layer.','Layers of coffee and cream, with a cocoa finish to come.'],['A dusting','of cocoa.','The final touch before the first bite.'],['The first bite.','Take your time.','A forkful of tiramisu, ready to enjoy.'],['For the occasion.','Or just because.','Tiramisu, cheesecake, and cakes for moments big and small. From individual slices to custom designs and 2D cakes for celebrations.']]},
}
export default function FinishSequence({kind}:{kind:'bowl'|'dessert'}){
 const data=content[kind],ref=useRef<HTMLElement>(null),reduced=!!useReducedMotion(),visible=useInView(ref,{margin:'300px 0px'})
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']})
 const [chapter,setChapter]=useState(0)
 useMotionValueEvent(scrollYProgress,'change',p=>setChapter(p<.32?0:p<.63?1:p<.86?2:3))
 const bar=useTransform(scrollYProgress,[0,1],['0%','100%'])
 const active=reduced?3:chapter
 return <section ref={ref} id={data.id} className={`coffee-demo finish-demo ${kind}-demo`} aria-label={data.label}>
 <div className="demo-sticky">
 <div className="demo-copy" aria-live="polite"><span className="kicker">{String(active+1).padStart(2,'0')} / {data.label}</span><motion.div key={active} initial={reduced?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.5}}><h2>{data.chapters[active][0]}<br/><em>{data.chapters[active][1]}</em></h2><p>{data.chapters[active][2]}</p></motion.div></div>
 <div className="demo-canvas" role="img" aria-label={kind==='bowl'?'Berry smoothie pours into a ceramic bowl, then banana, strawberries, blueberries and granola assemble as you scroll':'Tiramisu layers assemble, cocoa falls, and a fork lifts a bite as you scroll'}><SceneBoundary image={data.image}>{visible&&!reduced?<Suspense fallback={<SceneFallback image={data.image} reduced={reduced}/>}><SceneCanvas kind={kind} progress={scrollYProgress}/></Suspense>:<SceneFallback image={data.image} reduced={reduced}/>}</SceneBoundary></div>
 <div className="demo-bottom"><a href={`#${data.next}`}>{kind==='bowl'?'NEXT: DESSERTS ↓':'NEXT: QUICK SNACKS ↓'}</a><span>{data.number} / {data.label}</span></div><div className="demo-track"><motion.div style={{width:bar}}/></div>
 </div></section>
}
