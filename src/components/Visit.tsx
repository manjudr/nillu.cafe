import { VISIT } from '../data/visit'
function SocialLink({label,url}:{label:string;url:string}){
 return url?<a href={url} target="_blank" rel="noopener noreferrer">{label}<span aria-hidden="true">↗</span></a>:<span className="social-label">{label}</span>
}
export default function Visit(){return <section className="visit-section" id="visit" aria-labelledby="visit-title">
 <div className="visit-intro"><span className="kicker">VISIT NILLU / <span lang="kn">ಬನ್ನಿ</span></span><h2 id="visit-title">Make time<br/><em>for Nillu.</em></h2><p>A coffee, a catch-up, or just because.</p></div>
 <div className="visit-details"><div className="visit-hours"><span className="kicker">OPENING HOURS</span><p><time dateTime={VISIT.opens}>11 AM</time><span className="hours-dash" aria-hidden="true">—</span><time dateTime={VISIT.closes}>10 PM</time></p>{VISIT.days&&<span className="visit-days">{VISIT.days}</span>}</div>
 {VISIT.address&&<div className="visit-address"><span className="kicker">FIND US</span><address>{VISIT.address}</address>{VISIT.mapUrl&&<a href={VISIT.mapUrl} target="_blank" rel="noopener noreferrer">Get directions ↗</a>}</div>}
 <div className="visit-social"><span className="kicker">BEYOND THE CAFE</span><p>Coffee, cakes, and a closer look at Nillu.</p><div className="social-links"><SocialLink label="Instagram" url={VISIT.instagramUrl}/><SocialLink label="Facebook" url={VISIT.facebookUrl}/></div></div></div>
 </section>}
