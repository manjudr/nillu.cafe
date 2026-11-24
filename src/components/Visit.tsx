import { VISIT } from '../data/visit'
import instagramQr from '../assets/instagram-qr.webp'
function SocialLink({label,url}:{label:string;url:string}){
 return url?<a href={url} target="_blank" rel="noopener noreferrer">{label}<span aria-hidden="true">↗</span></a>:null
}
export default function Visit(){return <section className="visit-section" id="visit" aria-labelledby="visit-title">
 <div className="visit-intro"><span className="kicker">SECTOR 2 / BENGALURU</span><h2 id="visit-title">Your next pause.<br/><em>HSR Layout.</em></h2><p>Find Nillu Cafe on 19th Main, at 25th Cross Road in Sector 2.</p></div>
 <div className="visit-details"><div className="visit-opening"><span className="kicker">WHEN WE OPEN</span><p>{VISIT.openingMonth}</p></div>
 {VISIT.address&&<div className="visit-address"><span className="kicker">OUR LOCATION</span><address>{VISIT.address}</address><a href={VISIT.mapUrl||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VISIT.address)}`} target="_blank" rel="noopener noreferrer">{VISIT.mapUrl?'Get directions':'View on map'}<span aria-hidden="true">↗</span></a></div>}
 {(VISIT.instagramUrl||VISIT.facebookUrl)&&<div className="visit-social"><div className="visit-instagram-copy"><span className="kicker">A LITTLE MORE NILLU</span><p>Follow along as we get ready to open.</p><div className="social-links"><SocialLink label="Follow @nillucafe" url={VISIT.instagramUrl}/><SocialLink label="Facebook" url={VISIT.facebookUrl}/></div></div>{VISIT.instagramUrl&&<figure className="instagram-qr"><a href={VISIT.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Nillu Cafe on Instagram"><span className="instagram-qr-art"><img src={instagramQr} alt="Instagram QR code for @nillucafe" width={2350} height={2700} loading="lazy" decoding="async"/></span></a><figcaption>Scan to follow</figcaption></figure>}</div>}</div>
 </section>}
