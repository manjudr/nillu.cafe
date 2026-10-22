import { useEffect, useId, useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/** A visible liquid arrival on each entry; the accessible text stays ordinary, selectable text. */
export default function StoryWord(){
 const noise=useRef<SVGFETurbulenceElement>(null),word=useRef<HTMLSpanElement>(null),displacement=useRef<SVGFEDisplacementMapElement>(null)
 const visible=useInView(word,{amount:.7}),reduced=useReducedMotion(),id=`story-liquid-${useId().replace(/:/g,'')}`
 useEffect(()=>{
  if(!visible||reduced||!word.current||!displacement.current)return
  const element=word.current,map=displacement.current
  let frame=0,start=0
  const finish=()=>{map.setAttribute('scale','0');element.style.filter='none'}
  element.style.filter=`url(#${id})`
  const tick=(now:number)=>{
   if(!start)start=now
   const p=Math.min(1,Math.max(0,now-start-550)/4800),envelope=Math.sin(Math.PI*p)*Math.pow(1-p,.3)
   map.setAttribute('scale',String(65*envelope*(.85+.15*Math.sin(p*Math.PI*4))))
   noise.current?.setAttribute('baseFrequency',`${.008+.003*Math.sin(p*Math.PI*3)} ${.014+.005*Math.cos(p*Math.PI*4)}`)
   if(p<1)frame=requestAnimationFrame(tick);else finish()
  }
  frame=requestAnimationFrame(tick)
  return()=>{cancelAnimationFrame(frame);finish()}
 },[visible,reduced,id])
 return <>
  <svg className="story-liquid-filter" aria-hidden="true" focusable="false"><defs><filter id={id} x="-25%" y="-35%" width="150%" height="170%" colorInterpolationFilters="sRGB"><feTurbulence ref={noise} type="fractalNoise" baseFrequency=".008 .014" numOctaves="1" seed="8" result="ripple"/><feDisplacementMap ref={displacement} in="SourceGraphic" in2="ripple" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>
  <span ref={word} lang="kn" className="kannada story-liquid-word">ನಿಲ್ಲು.</span>
 </>
}
