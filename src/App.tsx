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
   <section id="about" className="about-section"><Reveal><span className="kicker">OUR STORY</span><h2>A name that says stop.<br/><em>A place to slow down.</em></h2><div className="about-bottom"><StoryWord/><p>“<span lang="kn">ನಿಲ್ಲು</span>” is Kannada for “stop.” For us, it’s an invitation: step out of the rush, settle into a conversation, and give the good things your time. That’s the thought behind Nillu Cafe.</p></div></Reveal></section>
   <Suspense fallback={<div className="experience-loading">Preparing your pause…</div>}><Experience/></Suspense>
   <section className="bites-section" id="bites"><Reveal><span className="kicker">QUICK SNACKS</span><h2>Small cravings.<br/>Good company.</h2><p>Something to nibble on. Something to share.<br/>A good excuse to keep the conversation going.</p></Reveal><span className="bites-word" aria-hidden="true">little<br/><em>bites.</em></span></section>
   <section className="hospitality-section" id="hospitality"><Reveal><span className="kicker">THE NILLU WAY</span><h2>Feel welcome.<br/><em>From the first hello.</em></h2><p className="hospitality-lead">A cafe is more than what it serves. It’s how it makes you feel. Our idea of hospitality starts with a warm hello and thoughtful attention to the people at the table.</p><div className="service-grid"><article><span>01 / THE EVERYDAY</span><h3>Your usual. Your company.</h3><p>A coffee catch-up, a snack between plans, or some time to yourself. There’s more than one way to make Nillu part of your day.</p></article><article><span>02 / A CHANGE OF PACE</span><h3>Follow your mood.</h3><p>A fresh juice when you want a sip of something bright. A smoothie bowl when you’d rather take a spoon to it.</p></article><article><span>03 / THE CELEBRATIONS</span><h3>Make it a cake occasion.</h3><p>From cheesecake and tiramisu to custom designed and 2D cakes—something sweet for an ordinary afternoon or a date worth celebrating.</p></article></div></Reveal></section>
   <section className="care-section" id="care"><Reveal><span className="kicker">BEHIND THE WELCOME</span><h2>Care is part<br/>of the recipe.</h2><p className="care-intro">The thought behind the food matters as much as the food itself.</p><div className="care-grid">{[['01','Quality','Our aim: give you a reason to look forward to the next cup, bowl, or bite.'],['02','Hygiene','Clean spaces and careful food handling belong at the heart of hospitality. That’s the standard we want Nillu to stand for.'],['03','Hospitality','A warm hello. An attentive ear. Our intention is to make you feel welcome, from the first greeting to the next visit.']].map(([n,title,copy])=><article key={n}><span>{n} /</span><h3>{title}</h3><p>{copy}</p></article>)}</div></Reveal></section>
   <Visit/>
   <section className="closing" id="pause"><Reveal><span className="kicker">GOOD COMPANY. SOMETHING LOVELY. NILLU.</span><p lang="kn" className="regional-word">ಮತ್ತೆ ಬನ್ನಿ</p><h2>See you<br/>at <em>Nillu.</em></h2><a href="#top" className="closing-link">Back to the beginning <span>↑</span></a></Reveal></section>
  </main>
  <footer className="site-footer"><a href="#top"><img src={logo} alt="Nillu Cafe"/></a><p>PAUSE. STAY. ENJOY.</p><span>© {new Date().getFullYear()} Nillu Cafe</span><small>Food visuals are illustrative; actual presentation may vary.</small></footer>
 </>
}
