import { VISIT } from '../data/visit'
import { SITE } from '../data/site'
function SocialLink({label,url}:{label:string;url:string}){
 return url?<a href={url} target="_blank" rel="noopener noreferrer">{label}<span aria-hidden="true">↗</span></a>:null
}
export default function Visit(){return <section className="visit-section" id="visit" aria-labelledby="visit-title">
 <div className="visit-intro"><span className="kicker">OPENING SOON / HSR LAYOUT, BENGALURU</span><h2 id="visit-title">Your next pause.<br/><em>HSR Layout.</em></h2><p>{SITE.description} We look forward to welcoming you.</p></div>
 <div className="visit-details"><div className="visit-hours"><span className="kicker">PLANNED OPENING HOURS</span><p><time dateTime={VISIT.opens}>11 AM</time><span className="hours-dash" aria-hidden="true">—</span><time dateTime={VISIT.closes}>10 PM</time></p>{VISIT.days&&<span className="visit-days">{VISIT.days}</span>}</div>
 {VISIT.address&&<div className="visit-address"><span className="kicker">OUR LOCATION</span><address>{VISIT.address}</address>{VISIT.mapUrl&&<a href={VISIT.mapUrl} target="_blank" rel="noopener noreferrer">Get directions ↗</a>}</div>}
 {(VISIT.instagramUrl||VISIT.facebookUrl)&&<div className="visit-social"><span className="kicker">A LITTLE MORE NILLU</span><p>Food, cafe moments, and news from Nillu.</p><div className="social-links"><SocialLink label="Instagram" url={VISIT.instagramUrl}/><SocialLink label="Facebook" url={VISIT.facebookUrl}/></div></div>}</div>
 </section>}
