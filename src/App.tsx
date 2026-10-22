import { lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'motion/react'
const WalkIdentity = lazy(() => import('./components/WalkIdentity'))
const Experience = lazy(() => import('./components/Experience'))
import logo from './assets/logo-ink.png'
import SiteHeader from './components/SiteHeader'
import StoryWord from './components/StoryWord'
import Visit from './components/Visit'

function Reveal({children, className = ''}: {children: React.ReactNode; className?: string}) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : {opacity: 0, y: 30}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: .15}} transition={{duration: .8}}>{children}</motion.div>
}
export default function App() {
 if (new URLSearchParams(window.location.search).get("preview") === "walk") return <Suspense fallback={<div className="experience-loading">Nillu Cafe</div>}><WalkIdentity/></Suspense>
 if (new URLSearchParams(window.location.search).get("preview") === "coffee") return <><a className="skip-link" href="#bites">Skip animations</a><Suspense fallback={<div className="experience-loading">Preparing your pause…</div>}><Experience/></Suspense><div id="bites" className="preview-end"><p>Explore every side of Nillu.</p><a href="/">Explore the full Nillu Cafe website ↗</a></div></>
 return <>
  <a className="skip-link" href="#about">Skip to content</a>
  <SiteHeader/>
  <main id="top">
   <Suspense fallback={<div className="experience-loading">Preparing your pause…</div>}><WalkIdentity embedded/></Suspense>
   <section id="about" className="about-section"><Reveal><span className="kicker">OUR STORY</span><h2>Our name means stop.<br/><em>Our idea is to make you stay.</em></h2><div className="about-bottom"><StoryWord/><p>“<span lang="kn">ನಿಲ್ಲು</span>” means “stop” in Kannada. That simple word holds the idea behind Nillu Cafe: a place to step out of the everyday rush, enjoy something good, and spend time with the people who matter—including yourself.</p></div></Reveal></section>
   <Suspense fallback={<div className="experience-loading">Preparing your pause…</div>}><Experience/></Suspense>
   <section className="bites-section" id="bites"><Reveal><span className="kicker">QUICK SNACKS</span><h2>A little bite.<br/>A longer conversation.</h2><p>A snack between plans or something to share across the table. Sometimes, a small bite is all you need to stay a little longer.</p></Reveal><span className="bites-word" aria-hidden="true">little<br/><em>bites.</em></span></section>
   <section className="hospitality-section" id="hospitality"><Reveal><span className="kicker">THE NILLU WAY</span><h2>Good food brings you in.<br/><em>A warm welcome makes you stay.</em></h2><p className="hospitality-lead">At Nillu, hospitality means listening, paying attention, and making room for the way you want to spend your time—alone, together, or celebrating.</p><div className="service-grid"><article><span>01 / THE EVERYDAY</span><h3>Time for yourself.</h3><p>A coffee, a snack, and a moment to enjoy your own company.</p></article><article><span>02 / TOGETHER</span><h3>Time together.</h3><p>Meet for a catch-up, share something to eat, and let the conversation take its time.</p></article><article><span>03 / THE CELEBRATIONS</span><h3>Something to celebrate.</h3><p>Custom designs and 2D cakes for birthdays, milestones, and moments worth marking.</p></article></div></Reveal></section>
   <section className="care-section" id="care"><Reveal><span className="kicker">BEHIND THE WELCOME</span><h2>Care you can taste.<br/>Care you can feel.</h2><p className="care-intro">What reaches your table matters. So does everything that happens before it gets there.</p><div className="care-grid">{[['01','Quality','Our commitment: attention to flavour, texture, and presentation in every cup, bowl, and plate.'],['02','Hygiene','Our commitment: clean preparation spaces, careful food handling, and a well-kept place to sit.'],['03','Hospitality','Our commitment: a warm greeting, thoughtful service, and attention when you need it.']].map(([n,title,copy])=><article key={n}><span>{n} /</span><h3>{title}</h3><p>{copy}</p></article>)}</div></Reveal></section>
   <Visit/>
   <section className="closing" id="pause"><Reveal><span className="kicker">COFFEE. FOOD. A WARM WELCOME.</span><p lang="kn" className="regional-word">ಮತ್ತೆ ಬನ್ನಿ</p><h2>Come for a coffee.<br/><em>Stay for your own reasons.</em></h2><a href="#top" className="closing-link">Back to the beginning <span>↑</span></a></Reveal></section>
  </main>
  <footer className="site-footer"><a href="#top"><img src={logo} alt="Nillu Cafe"/></a><p>A PLACE WORTH PAUSING FOR.</p><span>© {new Date().getFullYear()} Nillu Cafe</span><small>Food visuals are illustrative; actual presentation may vary.</small></footer>
 </>
}
