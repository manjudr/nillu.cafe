import { lazy, Suspense, useRef } from 'react'
import { useNearViewport } from '../lib/useNearViewport'
const LiquidHero=lazy(()=>import('./LiquidHero'))

export default function StoryWord(){
 const ref=useRef<HTMLDivElement>(null),visible=useNearViewport(ref,'80px')
 const still=<span lang="kn" className="kannada story-liquid-still">ನಿಲ್ಲು</span>
 return <div ref={ref} id="story-word" className="story-liquid-word" role="img" aria-label="ನಿಲ್ಲು, Nillu">
  <Suspense fallback={still}>{visible?<LiquidHero story active/>:still}</Suspense>
 </div>
}
