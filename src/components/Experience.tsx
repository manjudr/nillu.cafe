import { useEffect, useRef } from 'react'
import './ShortExperience.css'
import CoffeePreview from './CoffeePreview'
import JuiceSequence from './JuiceSequence'
import FinishSequence from './FinishSequences'
export default function Experience(){
 const compact=true
 const ref=useRef<HTMLDivElement>(null)
 useEffect(()=>{ref.current?.setAttribute('data-ready','true')},[])
 return <div id="explore" className={compact?'experience-short':undefined} ref={ref}><nav className="experience-nav" aria-label="Explore our food"><span>EXPLORE FOOD & DRINKS</span><a href="#coffee-preview">Coffee</a><a href="#juice-preview">Fresh juice</a><a href="#bowl-preview">Smoothie bowls</a><a href="#dessert-preview">Desserts</a><a href="#bites">Quick snacks</a><a className="scene-skip" href="#bites">Skip scenes ↓</a></nav><CoffeePreview compact={compact}/><JuiceSequence compact={compact}/><FinishSequence kind="bowl" compact={compact}/><FinishSequence kind="dessert" compact={compact}/></div>}
