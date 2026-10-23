import { VISIT } from '../data/visit'
import instagramQr from '../assets/instagram-qr.webp'
function SocialLink({label,url}:{label:string;url:string}){
 return url?<a href={url} target="_blank" rel="noopener noreferrer">{label}<span aria-hidden="true">↗</span></a>:null
}
export default function Visit(){return <section className="visit-section" id="visit" aria-labelledby="visit-title">
 <div className="visit-intro"><span className="kicker">OPENING SOON / HSR LAYOUT, BENGALURU</span><h2 id="visit-title">Your next pause.<br/><em>HSR Layout.</em></h2><p>Our illustrated 2D café is taking shape in Sector 2, HSR Layout, Bengaluru (Bangalore). Coffee, fresh juice, smoothie bowls, bites and desserts are on the way.</p></div>
 <div className="visit-details"><div className="visit-hours"><span className="kicker">PLANNED OPENING HOURS</span><p><time dateTime={VISIT.opens}>11 AM</time><span className="hours-dash" aria-hidden="true">—</span><time dateTime={VISIT.closes}>10 PM</time></p>{VISIT.days&&<span className="visit-days">{VISIT.days}</span>}</div>
 {VISIT.address&&<div className="visit-address"><span className="kicker">OUR LOCATION</span><address>{VISIT.address}</address><a href={VISIT.mapUrl||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VISIT.address)}`} target="_blank" rel="noopener noreferrer">{VISIT.mapUrl?'Get directions':'View on map'} ↗</a></div>}
 {(VISIT.instagramUrl||VISIT.facebookUrl)&&<div className="visit-social"><div className="visit-instagram-copy"><span className="kicker">A LITTLE MORE NILLU</span><p>Follow our café as it takes shape.</p><div className="social-links"><SocialLink label="Follow @nillucafe" url={VISIT.instagramUrl}/><SocialLink label="Facebook" url={VISIT.facebookUrl}/></div></div>{VISIT.instagramUrl&&<figure className="instagram-qr"><a href={VISIT.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Nillu Cafe on Instagram"><img src={instagramQr} alt="Instagram QR code for @nillucafe" width={2350} height={2700} loading="lazy" decoding="async"/></a><figcaption>Scan to follow</figcaption></figure>}</div>}</div>
 </section>}
