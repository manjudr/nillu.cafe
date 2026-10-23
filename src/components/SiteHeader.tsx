import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo-small.webp'
export default function SiteHeader(){
 const previous=useRef(0),menuButton=useRef<HTMLButtonElement>(null)
 const [visible,setVisible]=useState(true),[raised,setRaised]=useState(false),[menuOpen,setMenuOpen]=useState(false)
 useEffect(()=>{
  const onScroll=()=>{const y=Math.max(0,window.scrollY);if(Math.abs(y-previous.current)<6)return;setVisible(y<100||y<previous.current);setRaised(y>40);previous.current=y}
  window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)
 },[])
 useEffect(()=>{
  if(!menuOpen)return
  const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){setMenuOpen(false);menuButton.current?.focus()}}
  const onResize=()=>{if(innerWidth>640)setMenuOpen(false)}
  document.addEventListener('keydown',onKey);window.addEventListener('resize',onResize)
  return()=>{document.removeEventListener('keydown',onKey);window.removeEventListener('resize',onResize)}
 },[menuOpen])
 return <header className={`site-header returning-header ${visible||menuOpen?'header-visible':'header-hidden'} ${raised?'header-raised':''}`} onFocusCapture={()=>setVisible(true)}>
  <a href="#top" className="brand-link" aria-label="Nillu Cafe home" onClick={()=>setMenuOpen(false)}><img src={logo} alt="Nillu Cafe" width={1304} height={1148}/><sup className="brand-trademark">™</sup></a>
  <button ref={menuButton} className="site-menu-toggle" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={()=>setMenuOpen(open=>!open)}>{menuOpen?'Close':'Menu'}<span aria-hidden="true">{menuOpen?'×':'☰'}</span></button>
  <nav id="main-navigation" className={menuOpen?'nav-open':''} aria-label="Main navigation" onClick={()=>setMenuOpen(false)}><a href="#about">Our story</a><a href="#explore">Food & drinks</a><a href="#hospitality">The Nillu way</a><a href="#visit">Visit us</a></nav>
  <a className="nav-pill" href="#explore">Explore food & drinks <span aria-hidden="true">↓</span></a>
 </header>
}
