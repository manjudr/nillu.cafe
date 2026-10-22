import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo-ink.png'
export default function SiteHeader(){
 const previous=useRef(0),[visible,setVisible]=useState(true),[raised,setRaised]=useState(false)
 useEffect(()=>{
  const onScroll=()=>{const y=Math.max(0,window.scrollY);if(Math.abs(y-previous.current)<6)return;setVisible(y<100||y<previous.current);setRaised(y>40);previous.current=y}
  window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)
 },[])
 return <header className={`site-header returning-header ${visible?'header-visible':'header-hidden'} ${raised?'header-raised':''}`} onFocusCapture={()=>setVisible(true)}><a href="#top" aria-label="Nillu Cafe home"><img src={logo} alt="Nillu Cafe"/></a><nav aria-label="Main navigation"><a href="#about">Our story</a><a href="#explore">Food & drinks</a><a href="#hospitality">The Nillu way</a><a href="#visit">Visit us</a></nav><a className="nav-pill" href="#explore">Explore food & drinks <span>↓</span></a></header>
}
