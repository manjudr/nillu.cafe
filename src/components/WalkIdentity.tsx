import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import logo from '../assets/logo-ink.png'
import { paintWalk, walkPhase, WALK_DURATION, WALK_STOPS } from '../lib/walkIdentity'
import type { Phase } from '../lib/walkIdentity'

const story:Record<Phase,{number:string;title:string;accent:string;copy:string}>={
 walk:{number:'01 / THE WALK',title:'Always',accent:'on the move.',copy:'The day keeps moving. You don’t always have to.'},
 coffee:{number:'02 / THE COFFEE',title:'First,',accent:'a coffee.',copy:'A Nillu coffee, right on cue.'},
 pause:{number:'03 / THE PAUSE',title:'Then,',accent:'take a pause.',copy:'ನಿಲ್ಲು — Kannada for “stop.” An invitation to slow down.'},
 become:{number:'04 / TAKING SHAPE',title:'A pause.',accent:'Taking shape.',copy:'A simple gesture becomes a familiar name.'},
 nillu:{number:'05 / NILLU CAFE',title:'A little pause.',accent:'A lot to love.',copy:'Coffee, good company, and a place to slow down.'},
}
export default function WalkIdentity({embedded=false}:{embedded?:boolean}){
 const reduced=!!useReducedMotion(),canvas=useRef<HTMLCanvasElement>(null),image=useRef<HTMLImageElement|null>(null),elapsed=useRef(reduced?WALK_DURATION:0)
 const [ready,setReady]=useState(false),[playing,setPlaying]=useState(!reduced),[run,setRun]=useState(0),[progress,setProgress]=useState(reduced?1:0),[phase,setPhase]=useState<Phase>(reduced?'nillu':'walk'),[failed,setFailed]=useState(false)
 useEffect(()=>{let active=true;const img=new Image();img.onload=()=>{if(active){image.current=img;setReady(true)}};img.onerror=()=>{if(active)setFailed(true)};img.src=logo;return()=>{active=false}},[])
 useEffect(()=>{if(reduced){elapsed.current=WALK_DURATION;setProgress(1);setPhase('nillu');setPlaying(false)}},[reduced])
 useEffect(()=>{
  if(!ready||!canvas.current||!image.current)return
  const element=canvas.current,ctx=element.getContext('2d',{alpha:true}),img=image.current
  if(!ctx){setFailed(true);return}
  let frame=0,last=0,update=0,width=1,height=1,dpr=1
  const draw=()=>paintWalk(ctx,elapsed.current,img,width,height,dpr)
  const resize=()=>{const box=element.getBoundingClientRect();width=box.width;height=box.height;dpr=Math.min(devicePixelRatio||1,2);element.width=Math.round(width*dpr);element.height=Math.round(height*dpr);draw()}
  const observer=new ResizeObserver(resize);observer.observe(element);resize()
  const tick=(now:number)=>{
   if(document.hidden){last=now;frame=requestAnimationFrame(tick);return}
   if(last)elapsed.current=Math.min(WALK_DURATION,elapsed.current+(now-last)/1000)
   last=now;draw();setPhase(walkPhase(elapsed.current))
   if(now-update>65){setProgress(elapsed.current/WALK_DURATION);update=now}
   if(elapsed.current>=WALK_DURATION){setProgress(1);setPlaying(false)}else frame=requestAnimationFrame(tick)
  }
  setPhase(walkPhase(elapsed.current));draw()
  if(playing&&!reduced)frame=requestAnimationFrame(tick)
  return()=>{cancelAnimationFrame(frame);observer.disconnect()}
 },[ready,playing,run,reduced])
 const seek=(seconds:number)=>{elapsed.current=seconds;setProgress(seconds/WALK_DURATION);setPhase(walkPhase(seconds));setPlaying(false);setRun(v=>v+1)}
 const replay=()=>{elapsed.current=0;setProgress(0);setPhase('walk');setRun(v=>v+1);setPlaying(true)}
 const toggle=()=>{if(elapsed.current>=WALK_DURATION)replay();else setPlaying(p=>!p)}
 const current=story[phase]
 return <div className={`walk-preview ${embedded?'walk-embedded':''}`}>
  {!embedded&&<header className="walk-preview-header"><a href="/" className="walk-brand" aria-label="Nillu Cafe current website"><img src={logo} alt="Nillu Cafe"/><sup>™</sup></a><span>A NILLU STORY</span><a href="/">Current website <span aria-hidden="true">↗</span></a></header>}
  <section className="walk-story" aria-labelledby="walk-title">
   <div className="walk-copy"><p className="walk-location">Opening soon.<span>HSR Layout, Bengaluru</span></p><AnimatePresence mode="wait" initial={false}><motion.div key={phase} initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.35}}><span className="walk-kicker">{current.number}</span><h1 id="walk-title">{current.title}<br/><em>{current.accent}</em></h1><p className="walk-support">{current.copy}</p></motion.div></AnimatePresence></div>
   <div className="walk-stage" role="img" aria-label="A Chaplin-inspired character in a bowler hat, fitted jacket, and oversized shoes walks in, catches a branded takeaway coffee falling from above, takes a sip, pauses, and reshapes into the original Nillu Cafe logo.">{failed?<img className="walk-fallback" src={logo} alt="Nillu Cafe"/>:<canvas ref={canvas}/>}</div>
   {!embedded&&<div className="walk-controls"><div className="walk-playback"><button className="walk-play" onClick={toggle} disabled={!ready||reduced} aria-label={playing?'Pause animation':elapsed.current>=WALK_DURATION?'Replay animation':'Play animation'}>{playing?'Ⅱ':'▷'}</button><button className="walk-replay" onClick={replay} disabled={!ready||reduced}>Watch again <span aria-hidden="true">↺</span></button></div><div className="walk-chapters" aria-label="Animation chapters">{(['walk','coffee','pause','become','nillu'] as const).map(p=><button data-seek={p} key={p} onClick={()=>seek(WALK_STOPS[p])} className={phase===p?'active':''} aria-pressed={phase===p}>{p==='become'?'Transform':p==='nillu'?'Nillu':p==='walk'?'Walk':p==='coffee'?'Coffee':'Pause'}</button>)}</div>{embedded?<a className="walk-signoff walk-explore" href="#explore">Explore food & drinks ↓</a>:<span className="walk-signoff">PAUSE. STAY. ENJOY.</span>}<label className="walk-scrubber"><span className="sr-only">Animation progress</span><input type="range" min="0" max="1" step=".001" value={progress} onChange={e=>seek(Number(e.target.value)*WALK_DURATION)} aria-valuetext={`${Math.round(progress*100)} percent, ${phase}`}/></label></div>}
   {embedded&&<a className="walk-discover" href="#explore">Explore food & drinks <span aria-hidden="true">↓</span></a>}
  </section>
 </div>
}
