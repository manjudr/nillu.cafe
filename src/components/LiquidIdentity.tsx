import { lazy, Suspense, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import StillWord from './StillWord'
const LiquidHero=lazy(()=>import('./LiquidHero'))
export default function LiquidIdentity(){
 const ref=useRef<HTMLDivElement>(null),visible=useInView(ref,{margin:'100px'}),[paused,setPaused]=useState(false)
 return <div className="hero-photo hero-liquid" id="hero" ref={ref}>
 <div className="identity-surface" aria-hidden="true"><Suspense fallback={<StillWord/>}><LiquidHero paused={paused} active={visible}/></Suspense></div>
 <div className="identity-caption"><button onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?'Play liquid lettering ↗':'Pause liquid lettering Ⅱ'}</button></div>
 </div>
}
