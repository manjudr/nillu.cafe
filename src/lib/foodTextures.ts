import * as THREE from 'three'
export type FoodTexture='coffee'|'smoothie'|'juice'|'orange'|'banana'|'strawberry'|'blueberry'|'sponge'|'cream'|'cocoa'
const fract=(v:number)=>v-Math.floor(v)
function noise(x:number,y:number){return fract(Math.sin(x*127.1+y*311.7)*43758.5453)}
function soft(x:number,y:number){const ix=Math.floor(x),iy=Math.floor(y),a=x-ix,b=y-iy,u=a*a*(3-2*a),v=b*b*(3-2*b);return THREE.MathUtils.lerp(THREE.MathUtils.lerp(noise(ix,iy),noise(ix+1,iy),u),THREE.MathUtils.lerp(noise(ix,iy+1),noise(ix+1,iy+1),u),v)}
/** Deterministic diffuse detail: fine pores and variation, rather than glossy flat colours. */
export function foodTexture(kind:FoodTexture,size=256){
 const pixels=new Uint8Array(size*size*4)
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/size,v=y/size,n=noise(x,y),low=soft(u*12,v*12),grain=(n-.5)*14
  let color=[240,230,210],shade=grain
  const dx=u-.5,dy=v-.5,r=Math.hypot(dx,dy)*2,a=Math.atan2(dy,dx)
  if(kind==='coffee'){
   const ribbon=Math.pow(Math.max(0,Math.sin(u*18+v*24+soft(u*5,v*5)*16+soft(u*12,v*12)*2)),8)
   const crema=.58+(low-.5)*.22+Math.max(0,r-.68)*.6+ribbon*.10
   color=[88+crema*112,44+crema*100,25+crema*60];shade=grain*.4
   if(n>.985&&r>.55)shade+=22
  }else if(kind==='smoothie'){
   color=[159+low*13,67+low*12,100+low*13];shade=grain*.35+(n>.995?-32:0)
  }else if(kind==='juice'){
   color=[242+low*7,149+low*16,27+low*10];shade=grain*.25+(n>.998?12:0)
  }else if(kind==='orange'){
   const segment=Math.abs(Math.sin(a*5)),vein=segment<.045&&r>.1?45:0
   color=[246+low*6,148+low*28,25+low*14];shade=grain*.6+vein
   if(r>.9){color=[248,183,59];shade=grain}
   if(r>.82&&r<=.9){color=[255,238,191];shade=grain*.3}
  }else if(kind==='banana'){
   color=[246,226+low*8,177+low*15];shade=grain*.4
   const seed=Math.abs(Math.sin(a*3))<.18&&r>.12&&r<.34
   if(seed&&n>.47){color=[159,119,70];shade=grain}
   if(r>.87){color=[231,207,148];shade=grain*.6}
  }else if(kind==='strawberry'){
   color=[145+low*30,15+low*13,29+low*8];shade=grain*.6
   const row=Math.floor(v*13),sx=fract(u*18+(row%2)*.5),sy=fract(v*13)
   if(Math.pow((sx-.5)/.065,2)+Math.pow((sy-.5)/.13,2)<1){color=[183,142,75];shade=-10+grain}
  }else if(kind==='blueberry'){
   color=[56+low*21,64+low*18,93+low*22];shade=grain*.5
   if(low>.6)shade+=14
  }else if(kind==='sponge'){
   color=[104+low*24,65+low*18,38+low*13];shade=grain*1.8+(n>.88?-35:0)
  }else if(kind==='cream'){
   color=[232,219,195];shade=grain*.15+(low-.5)*8
  }else if(kind==='cocoa'){
   color=[99,62,39];shade=grain*1.4+(low-.5)*14
  }
  const i=(y*size+x)*4;for(let c=0;c<3;c++)pixels[i+c]=Math.max(0,Math.min(255,color[c]+shade));pixels[i+3]=255
 }
 const texture=new THREE.DataTexture(pixels,size,size,THREE.RGBAFormat);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=true;texture.anisotropy=4;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.needsUpdate=true;return texture
}
