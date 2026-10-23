import { useNearViewport } from './lib/useNearViewport'
import { lazy, Suspense, useRef } from 'react'
const TypographyPreview = lazy(() => import('./components/TypographyPreview'))
const WalkIdentity = lazy(() => import('./components/WalkIdentity'))
const Experience = lazy(() => import('./components/Experience'))
import logo from './assets/logo-small.webp'
import SiteHeader from './components/SiteHeader'
import StoryWord from './components/StoryWord'
import Visit from './components/Visit'
import sketchRoom from './assets/room/nillu-2d-concept-v1.webp'
import sketchRoomMobile from './assets/room/nillu-2d-concept-v1-mobile.webp'

function Reveal({children, className = ''}: {children: React.ReactNode; className?: string}) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useNearViewport(ref, '0px 0px -8% 0px', true)
  return <div ref={ref} className={`page-reveal ${visible?'is-visible':''} ${className}`}>{children}</div>
}
export default function App() {
 const preview = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('preview')
 if (preview === 'type') return <Suspense fallback={<div className="experience-loading">Preparing typography preview…</div>}><TypographyPreview/></Suspense>
 if (preview === 'walk') return <Suspense fallback={<div className="experience-loading">Nillu Cafe</div>}><WalkIdentity/></Suspense>
 if (preview === 'coffee') return <><a className="skip-link" href="#bites">Skip animations</a><Suspense fallback={<div className="experience-loading">Preparing your pause…</div>}><Experience/></Suspense><div id="bites" className="preview-end"><p>Explore every side of Nillu.</p><a href="/">Explore the full Nillu Cafe website ↗</a></div></>
 return <>
  <a className="skip-link" href="#about">Skip to content</a>
  <SiteHeader/>
  <main id="top">
   <Suspense fallback={<div className="experience-loading">Preparing your pause…</div>}><WalkIdentity embedded/></Suspense>
   <section id="about" className="about-section sketch-story"><Reveal>
    <div className="sketch-story-grid">
     <div className="sketch-story-copy"><span className="kicker">OUR STORY / A WORLD IN TWO DIMENSIONS</span><h2>Our name means stop.<br/><em>Our space gives you a reason.</em></h2><p>“<span lang="kn">ನಿಲ್ಲು</span>” means “stop” in Kannada. We’re bringing that invitation to life through an illustrated 2D setting, food to look forward to, and a warm welcome. Come for a coffee, a catch-up, or a celebration of your own.</p><div className="sketch-name"><StoryWord/><span>Kannada for “stop.”<br/>A welcome to pause.</span></div></div>
     <figure className="sketch-room"><div className="sketch-room-frame"><img src={sketchRoom} srcSet={`${sketchRoomMobile} 700w, ${sketchRoom} 1400w`} sizes="(max-width: 900px) 86vw, 46vw" alt="Black-and-white illustration of Nillu’s planned 2D café concept, with outlined chairs, pendant lights and a café counter" width={1400} height={933} loading="lazy" decoding="async"/><span className="sketch-room-spark" aria-hidden="true">✧</span></div><figcaption>An impression of our planned 2D setting · Coming soon</figcaption></figure>
    </div>
   </Reveal></section>
   <div className="experience-island"><Suspense fallback={<div className="experience-loading">Preparing your pause…</div>}><Experience/></Suspense></div>
   <section className="bites-section" id="bites"><Reveal><span className="kicker">QUICK SNACKS</span><h2>A little bite.<br/>A longer conversation.</h2><p>A snack between plans or something to share across the table. Sometimes, a small bite is all you need to stay a little longer.</p></Reveal><span className="bites-word" aria-hidden="true">little<br/><em>bites.</em></span></section>
   <section className="hospitality-section" id="hospitality"><Reveal><span className="kicker">THE NILLU WAY</span><h2>Good food brings you in.<br/><em>A warm welcome makes you stay.</em></h2><p className="hospitality-lead">Drop in for your favourite coffee. Bring someone you’ve been meaning to catch up with. There’s more than one way to enjoy a little pause.</p><div className="service-grid"><article><h3>A quiet cup.</h3><p>A coffee and something good to eat, with a little time to yourself.</p></article><article><h3>A shared table.</h3><p>Something to share. A familiar face. A conversation worth making time for.</p></article><article><h3>A little celebration.</h3><p>A birthday, good news, or simply being together. Make it a little sweeter with cake.</p></article></div></Reveal></section>
   <section className="care-section" id="care"><Reveal><span className="kicker">BEHIND THE WELCOME</span><h2>Good food.<br/>Thoughtful care.</h2><p className="care-intro">From preparing your food to welcoming you in, we pay attention to the details that make your visit enjoyable.</p><div className="care-grid">{[['01','Quality','Our commitment: attention to flavour, texture, and presentation in every cup, bowl, and plate.'],['02','Hygiene','Our commitment: clean preparation spaces, careful food handling, and a well-kept place to sit.'],['03','Hospitality','Our commitment: a warm greeting, thoughtful service, and attention when you need it.']].map(([n,title,copy])=><article key={n}><span>{n} /</span><h3>{title}</h3><p>{copy}</p></article>)}</div></Reveal></section>
   <Visit/>
   <section className="closing" id="pause"><Reveal><span className="kicker">COFFEE. FOOD. A WARM WELCOME.</span><p lang="kn" className="regional-word">ಮತ್ತೆ ಬನ್ನಿ</p><h2>Come for a coffee.<br/><em>Stay for your own reasons.</em></h2><a href="#top" className="closing-link">Back to the beginning <span>↑</span></a></Reveal></section>
  </main>
  <footer className="site-footer"><a href="#top"><img src={logo} alt="Nillu Cafe" width={1304} height={1148}/></a><p>STEP INTO A SKETCH. MAKE A REAL MOMENT.</p><span>© {new Date().getFullYear()} Nillu Cafe</span><small>Food visuals are illustrative; actual presentation may vary.</small></footer>
 </>
}
