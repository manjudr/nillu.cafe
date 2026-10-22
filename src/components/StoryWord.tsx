import { lazy, Suspense, useRef } from 'react'
import { useInView } from 'motion/react'
const LiquidHero=lazy(()=>import('./LiquidHero'))

export default function StoryWord(){
 const ref=useRef<HTMLDivElement>(null),visible=useInView(ref,{margin:'80px'})
 const still=<span lang="kn" className="kannada story-liquid-still">ನಿಲ್ಲು</span>
 return <div ref={ref} id="story-word" className="story-liquid-word" role="img" aria-label="ನಿಲ್ಲು — Nillu">
  <Suspense fallback={still}><LiquidHero story active={visible}/></Suspense>
 </div>
}
