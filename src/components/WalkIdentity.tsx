import { WALK_STORY } from '../data/walkStory'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo-ink.png'
import { paintWalk, walkPhase, WALK_DURATION, WALK_STOPS } from '../lib/walkIdentity'
import type { Phase } from '../lib/walkIdentity'


export default function WalkIdentity({embedded=false}:{embedded?:boolean}){
 const reduced=!!useReducedMotion(),canvas=useRef<HTMLCanvasElement>(null),image=useRef<HTMLImageElement|null>(null),elapsed=useRef(reduced?WALK_DURATION:0)
 const [ready,setReady]=useState(false),[playing,setPlaying]=useState(!reduced),[run,setRun]=useState(0),[progress,setProgress]=useState(reduced?1:0),[phase,setPhase]=useState<Phase>(reduced?'nillu':'walk'),[failed,setFailed]=useState(false)
 useEffect(()=>{let active=true;const img=new Image();img.onload=()=>{if(active){image.current=img;setReady(true)}};img.onerror=()=>{if(active)setFailed(true)};img.src=logo;return()=>{active=false}},[])
 useEffect(()=>{if(reduced){elapsed.current=WALK_DURATION;setProgress(1);setPhase('nillu');setPlaying(false)}},[reduced])
 useEffect(()=>{
  if(!ready||!canvas.current||!image.current)return
  const element=canvas.current,ctx=element.getContext('2d',{alpha:true}),img=image.current
  if(!ctx){setFailed(true);return}
  let frame=0,last=0,lastDraw=0,update=0,width=1,height=1,dpr=1,inView=true,lastPhase=walkPhase(elapsed.current)
  const draw=()=>paintWalk(ctx,elapsed.current,img,width,height,dpr)
  const resize=()=>{const box=element.getBoundingClientRect();width=box.width;height=box.height;dpr=Math.min(devicePixelRatio||1,2);element.width=Math.round(width*dpr);element.height=Math.round(height*dpr);draw()}
  const observer=new ResizeObserver(resize);observer.observe(element);resize()
  const visibility=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting});visibility.observe(element)
  const tick=(now:number)=>{
   if(document.hidden||!inView){last=now;frame=requestAnimationFrame(tick);return}
   if(last)elapsed.current=Math.min(WALK_DURATION,elapsed.current+(now-last)/1000)
   last=now
   if(now-lastDraw>=(width<600?1000/30:1000/60)){draw();lastDraw=now}
   const nextPhase=walkPhase(elapsed.current)
   if(nextPhase!==lastPhase){lastPhase=nextPhase;setPhase(nextPhase)}
   if(!embedded&&now-update>65){setProgress(elapsed.current/WALK_DURATION);update=now}
   if(elapsed.current>=WALK_DURATION){setProgress(1);setPlaying(false)}else frame=requestAnimationFrame(tick)
  }
  setPhase(walkPhase(elapsed.current));draw()
  if(playing&&!reduced)frame=requestAnimationFrame(tick)
  return()=>{cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect()}
 },[ready,playing,run,reduced,embedded])
 const seek=(seconds:number)=>{elapsed.current=seconds;setProgress(seconds/WALK_DURATION);setPhase(walkPhase(seconds));setPlaying(false);setRun(v=>v+1)}
 const replay=()=>{elapsed.current=0;setProgress(0);setPhase('walk');setRun(v=>v+1);setPlaying(true)}
 const toggle=()=>{if(elapsed.current>=WALK_DURATION)replay();else setPlaying(p=>!p)}
 const current=WALK_STORY[phase]
 const Heading=embedded?'h2':'h1'
 return <div className={`walk-preview ${embedded?'walk-embedded':''}`}>
  {!embedded&&<header className="walk-preview-header"><a href="/" className="walk-brand" aria-label="Nillu Cafe current website"><img src={logo} alt="Nillu Cafe" width={1304} height={1148}/><sup>™</sup></a><span>A NILLU STORY</span><a href="/">Current website <span aria-hidden="true">↗</span></a></header>}
  <section className="walk-story" aria-labelledby={embedded?'site-title':'walk-title'}>
   {embedded&&<h1 id="site-title" className="sr-only">Nillu Cafe in HSR Layout, Bengaluru — opening soon</h1>}
   <div className="walk-copy"><p className="walk-location">Opening soon.<span>HSR Layout, Bengaluru</span></p><div key={phase} className={phase==='walk'?'':'walk-copy-enter'}><span className="walk-kicker">{current.number}</span><Heading id="walk-title" className="walk-title">{current.title}<br/><em>{current.accent}</em></Heading><p className="walk-support">{current.copy}</p></div></div>
   <div className="walk-stage" role="img" aria-label="A Chaplin-inspired character in a bowler hat, fitted jacket, and oversized shoes walks in, catches a branded takeaway coffee falling from above, takes a sip, smiles as a few hearts rise and fade, pauses, and reshapes into the original Nillu Cafe logo.">{failed?<img className="walk-fallback" src={logo} alt="Nillu Cafe"/>:<canvas ref={canvas}/>}</div>
   {!embedded&&<div className="walk-controls"><div className="walk-playback"><button className="walk-play" onClick={toggle} disabled={!ready||reduced} aria-label={playing?'Pause animation':elapsed.current>=WALK_DURATION?'Replay animation':'Play animation'}>{playing?'Ⅱ':'▷'}</button><button className="walk-replay" onClick={replay} disabled={!ready||reduced}>Watch again <span aria-hidden="true">↺</span></button></div><div className="walk-chapters" aria-label="Animation chapters">{(['walk','coffee','pause','become','nillu'] as const).map(p=><button data-seek={p} key={p} onClick={()=>seek(WALK_STOPS[p])} className={phase===p?'active':''} aria-pressed={phase===p}>{p==='become'?'Transform':p==='nillu'?'Nillu':p==='walk'?'Walk':p==='coffee'?'Coffee':'Pause'}</button>)}</div>{embedded?<a className="walk-signoff walk-explore" href="#explore">Explore food & drinks ↓</a>:<span className="walk-signoff">PAUSE. STAY. ENJOY.</span>}<label className="walk-scrubber"><span className="sr-only">Animation progress</span><input type="range" min="0" max="1" step=".001" value={progress} onChange={e=>seek(Number(e.target.value)*WALK_DURATION)} aria-valuetext={`${Math.round(progress*100)} percent, ${phase}`}/></label></div>}
   {embedded&&<a className="walk-discover" href="#explore">Explore food & drinks <span aria-hidden="true">↓</span></a>}
  </section>
 </div>
}
