export const clamp=(n:number)=>Math.max(0,Math.min(1,n))
export const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t)}
export const flowWindow=(p:number,start:number,end:number,ramp=.035)=>smooth((p-start)/ramp)*(1-smooth((p-end+ramp)/ramp))
export function coffeeFill(p:number){const fill=smooth((p-.34)/.40);return {height:.15+fill*.91,radius:(.70+fill*.267)*smooth((p-.32)/.025),flow:flowWindow(p,.32,.78),front:smooth((p-.32)/.025),tail:smooth((p-.745)/.035)}}
export function bowlFill(p:number){const fill=smooth((p-.05)/.25);return {height:.20+fill*.58,radius:(.57+fill*.67)*smooth((p-.03)/.025),flow:flowWindow(p,.03,.34),front:smooth((p-.03)/.025),tail:smooth((p-.305)/.035)}}
/** Both the jug and the stream use this exact cup-relative transform. */
export function juicePose(p:number){
 const blend=smooth((p-.30)/.17),tilt=smooth((p-.50)/.10),settle=smooth((p-.83)/.14),fill=smooth((p-.57)/.25)
 const angle=-(.72+fill*.55)*tilt*(1-settle),x=-1.15-settle*3,c=Math.cos(angle),s=Math.sin(angle)
 const y=tilt*(1-settle)*(1.98-(.72*s+1.65*c))
 const lip:[number,number,number]=[x+.72*c-1.65*s,y+.72*s+1.65*c,0]
 return {blend,tilt,settle,fill,angle,x,y,lip,glassX:1.45-settle*.70,top:-.66+fill*1.30,radius:.425+fill*.075,flow:flowWindow(p,.57,.82,.035),front:smooth((p-.57)/.03),tail:smooth((p-.785)/.035),remaining:.16+blend*(1-fill)*1.04}
}
/** Accelerating fall followed by a short, small impact settle. */
export function landing(p:number,start:number,duration:number,height:number,bounce=.025){
 const t=(p-start)/duration
 if(t<=0)return {height,visible:false,turn:1}
 if(t<1)return {height:height*(1-t*t),visible:true,turn:1-t*t}
 const after=(t-1)*duration
 return {height:after<.1?Math.sin(after/.1*Math.PI)*bounce*Math.exp(-after*18):0,visible:true,turn:0}
}
