import { useState } from 'react'
import logo from '../assets/logo-ink.png'
import './TypographyPreview.css'

export default function TypographyPreview(){
 const [paired,setPaired]=useState(true)
 return <main className="type-review">
  <header><a href="/"><img src={logo} alt="Nillu Cafe"/></a><span>TYPOGRAPHY STUDY / PREVIEW ONLY</span><a href="/">Back to website ↗</a></header>
  <div className="type-intro"><p>SAME WORDS. A DIFFERENT FEEL.</p><h1>A little more Nillu.</h1><p>Compare the current lettering with a cleaner, warmer direction. The main website has not changed.</p><div className="type-switch"><button aria-pressed={paired} onClick={()=>setPaired(true)}>Manrope + Fraunces · Recommended</button><button aria-pressed={!paired} onClick={()=>setPaired(false)}>Manrope only</button></div></div>
  <div className="type-grid">{(['current','proposed'] as const).map(version=><article className={'type-specimen type-'+version+(paired?'':' type-sans')} key={version}>
   <div className="type-label"><span>{version==='current'?'01 / CURRENT':'02 / PROPOSED'}</span><p>{version==='current'?'Jost + Cormorant Garamond':paired?'Manrope + Fraunces':'Manrope'}</p></div>
   <nav><img src={logo} alt="Nillu Cafe"/><span>Our story</span><span>Food & drinks</span><span>Visit us ↗</span></nav>
   <section className="type-hero"><p className="type-kicker">OPENING SOON / HSR LAYOUT, BENGALURU</p><h2>A place worth<br/><em>pausing for.</em></h2><p className="type-body">Coffee, fresh flavours, and a warm welcome at Nillu Cafe.</p><p className="type-action">Explore food & drinks <span>↓</span></p></section>
   <section><p className="type-kicker">OUR STORY</p><h3>Our name means stop.<br/><em>Our idea is to make you stay.</em></h3><p lang="kn" className="type-kannada">ನಿಲ್ಲು.</p><p className="type-body">“ನಿಲ್ಲು” means “stop” in Kannada. That simple word holds the idea behind Nillu Cafe: a place to step out of the everyday rush, enjoy something good, and spend time with the people who matter—including yourself.</p></section>
   <section><p className="type-kicker">THE NILLU WAY</p><h3>Good food brings you in.<br/><em>A warm welcome makes you stay.</em></h3><p className="type-body">At Nillu, hospitality means listening, paying attention, and making room for the way you want to spend your time—alone, together, or celebrating.</p><div className="type-hours"><span>PLANNED OPENING HOURS</span><p>11 AM — 10 PM</p></div></section>
   <footer>{version==='current'?'The existing website pairing.':paired?'Clean Manrope for reading. Warm Fraunces for accents.':'One clean family throughout. A more minimal direction.'}</footer>
  </article>)}</div>
  <p className="type-note">The supplied logo and Kannada wordmark stay consistent. Candidate English fonts are downloaded and served locally in this preview.</p>
 </main>
}
