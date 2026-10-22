const clamp=(n:number)=>Math.max(0,Math.min(1,n))
export const COFFEE_BEANS=Array.from({length:26},(_,i)=>{
 const angle=i*2.399963,radius=.2+(i%6)*.045
 return {x:Math.sin(angle)*1.7,z:Math.cos(angle)*1.7,targetX:Math.sin(angle)*radius,targetZ:Math.cos(angle)*radius,start:3+(i%7)*.7,turn:i*1.7,delay:(i%5)*.018}
})
/** Cup-local paths converge inside the rim before a bean can enter the vessel. */
export function coffeeBeanPose(p:number,i:number){
 const s=COFFEE_BEANS[i],fall=clamp((p-.04-s.delay)/.30),converge=Math.min(1,fall*1.4)
 const y=s.start-(s.start-.45)*fall*fall
 return {x:s.x+(s.targetX-s.x)*converge,y,z:s.z+(s.targetZ-s.z)*converge,fall,visible:p>.015&&y>.92}
}
