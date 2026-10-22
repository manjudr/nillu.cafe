import{a as e,n as t,t as n}from"./jsx-runtime-Wy9s6hX0.js";import{E as r,O as i,T as a,a as o,i as s,l as c,m as l,n as u,o as d,s as f,t as p,u as m,x as h}from"./react-three-fiber.esm-DRjiwhSi.js";var g=e(t());function _(){let e=new d,t=new Float32Array([-1,-1,3,-1,-1,3]);return e.boundingSphere=new h,e.boundingSphere.set(new r,1/0),e.setAttribute(`position`,new o(t,2)),e}var v=g.forwardRef(function({children:e,...t},n){let r=g.useMemo(_,[]);return g.createElement(`mesh`,i({ref:n,geometry:r,frustumCulled:!1},t),e)}),y=`// Fullscreen triangle: positions already arrive in clip space.
// drei's ScreenQuad geometry supplies only a 2-component \`position\`, no \`uv\`
// attribute — so derive the 0..1 coordinate from clip space here.
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,b=`precision highp float;

#include noise.glsl

varying vec2 vUv;

uniform sampler2D uWord;      // current word, luminance = glyph coverage
uniform float uForm;          // 0 = scattered droplets, 1 = solid letterforms
uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uPointer;       // centred, aspect-corrected
uniform float uPointerOn;     // 0 when the cursor has never entered
uniform float uTexAspect;
uniform float uScale;         // half-height of the word box in centred units
uniform vec3  uInk;
uniform vec3  uPaper;

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 st = (vUv - 0.5) * vec2(aspect, 1.0);

  float dissolve = 1.0 - uForm;
  float t = uTime * 0.16;

  // Slow two-octave flow — this is what gives the surface its viscosity.
  vec3 q = vec3(st * 2.3, t);
  vec2 flow = vec2(snoise(q), snoise(q * 1.87 + 23.1));
  flow += 0.45 * vec2(snoise(q * 3.4 + 7.0), snoise(q * 3.1 - 4.0));

  // The cursor drags the liquid: a travelling ripple plus a soft outward push.
  vec2 toP = st - uPointer;
  float d = length(toP);
  vec2 dir = toP / max(d, 1e-4);
  float fall = exp(-d * 4.5) * uPointerOn;
  vec2 ripple = dir * sin(d * 16.0 - uTime * 2.6) * fall;
  vec2 push = dir * fall;

  vec2 warp = flow * (0.014 + 0.085 * dissolve) + (ripple * 0.055 + push * 0.045);

  // Sample the word through the warped field.
  vec2 tuv = (st + warp) / vec2(uTexAspect, 1.0) / uScale + 0.5;
  // The word is swapped while fully dissolved, so one texture is enough.
  float cov = 0.0;
  if (tuv.x > 0.0 && tuv.x < 1.0 && tuv.y > 0.0 && tuv.y < 1.0) {
    cov = texture2D(uWord, tuv).r;
  }

  // Raising the threshold against a noise field makes the glyphs break into
  // droplets rather than simply fading out.
  float grain = snoise(vec3(st * 3.0, uTime * 0.22)) * 0.5 + 0.5;
  float field = cov - dissolve * (0.30 + 0.80 * grain);
  float edge = fwidth(field) + 0.0035;
  float alpha = smoothstep(0.45 - edge, 0.45 + edge, field);

  vec3 col = mix(uPaper, uInk, alpha);

  // A barely-there ambient surface so the hero still breathes between words.
  float amb = snoise(vec3(st * 1.5 + vec2(0.0, -t * 0.7), t * 0.45));
  float ambA = smoothstep(0.58, 0.95, amb) * 0.045;
  col = mix(col, uInk, ambA * (1.0 - alpha));

  gl_FragColor = vec4(col, 1.0);
}
`,x=`// Simplex 3D noise — Ashima Arts / Stefan Gustavson, MIT licensed.
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;function S(e,t,n=500,r=1600,i=``,a=!1){let o=document.createElement(`canvas`).getContext(`2d`);if(!o)throw Error(`2d canvas unavailable`);o.font=`${n} 400px ${t}`;let s=o.measureText(e),u=Math.max(1,s.actualBoundingBoxLeft+s.actualBoundingBoxRight),d=Math.max(1,s.actualBoundingBoxAscent+s.actualBoundingBoxDescent),p=r/u,m=d*p*.1,h=Math.ceil(u*p+m*2+(a?d*p*.18:0)),g=400*p*.22;o.font=`${n} ${g}px ${t}`;let _=i?o.measureText(i):null,v=_?.actualBoundingBoxAscent??0,y=_?.actualBoundingBoxDescent??0,b=d*p*.12,x=Math.ceil(d*p+m*2+(i?b+v+y:0)),S=document.createElement(`canvas`);S.width=h,S.height=x;let C=S.getContext(`2d`);if(C.fillStyle=`#000000`,C.fillRect(0,0,h,x),C.font=`${n} ${400*p}px ${t}`,C.fillStyle=`#ffffff`,C.textAlign=`left`,C.textBaseline=`alphabetic`,C.fillText(e,m+s.actualBoundingBoxLeft*p,m+s.actualBoundingBoxAscent*p),a){let e=d*p*.12;C.font=`500 ${e}px sans-serif`,C.fillText(`™`,m+u*p+e*.2,m+e)}if(i&&_){C.font=`${n} ${g}px ${t}`;let e=m+u*p-_.actualBoundingBoxRight;C.fillText(i,e,m+d*p+b+v)}let w=new f(S);return w.minFilter=l,w.magFilter=l,w.generateMipmaps=!1,w.wrapS=c,w.wrapT=c,w.colorSpace=``,w.needsUpdate=!0,{texture:w,aspect:h/x}}async function C(e){`fonts`in document&&(await Promise.all(e.map(([e,t,n=500])=>document.fonts.load(`${n} 400px ${e}`,t).catch(()=>void 0))),await document.fonts.ready)}var w={latin:{family:`"Outfit", sans-serif`,weight:800},kannada:{family:`"Noto Sans Kannada", sans-serif`,weight:700},telugu:{family:`"Noto Sans Telugu", sans-serif`,weight:700}},T=n();function E(){return(0,T.jsx)(`div`,{className:`absolute inset-0 grid place-items-center`,children:(0,T.jsxs)(`div`,{className:`identity-static-lockup`,children:[(0,T.jsxs)(`span`,{className:`identity-static-name select-none leading-none`,style:{fontSize:`clamp(3rem, 11vw, 10rem)`,fontFamily:w.latin.family,fontWeight:w.latin.weight,letterSpacing:`-0.045em`},children:[`NILLU`,(0,T.jsx)(`sup`,{className:`identity-trademark`,children:`™`})]}),(0,T.jsx)(`span`,{className:`identity-static-suffix`,style:{fontFamily:w.latin.family,fontWeight:w.latin.weight},children:`.cafe`})]})})}var D=b.replace(`#include noise.glsl`,x),O=w.kannada.family,k=w.telugu.family,A=w.latin.family,j=[{text:`NILLU`,suffix:`.cafe`,font:A,weight:w.latin.weight},{text:`ನಿಲ್ಲು`,suffix:`.ಕೆಫೆ`,font:O,weight:w.kannada.weight},{text:`నిల్లు`,suffix:`.cafe`,font:k,weight:w.telugu.weight}],M=1.3,N=4.2,P=1.2,F=6.7,I=e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2;function L({words:e,story:t=!1}){let n=(0,g.useRef)(null),{size:r,viewport:i}=s(),o=(0,g.useRef)(0),c=(0,g.useRef)(0),l=(0,g.useRef)(new a(0,0)),d=(0,g.useRef)(new a(0,0)),f=(0,g.useRef)(0),p=(0,g.useMemo)(()=>({uWord:{value:e[0].texture},uForm:{value:0},uTime:{value:0},uResolution:{value:new a(1,1)},uPointer:{value:new a(0,0)},uPointerOn:{value:0},uTexAspect:{value:e[0].aspect},uScale:{value:.4},uInk:{value:new m(`#0a0a0a`)},uPaper:{value:new m(`#ffffff`)}}),[e]),h=e=>{let t=r.width/Math.max(r.height,1),n=r.width<720?.86:.8;return Math.min(n*t/e,.46)};return(0,g.useEffect)(()=>{let e=document.getElementById(t?`story-word`:`hero`);if(!e)return;let n=t=>{let n=e.getBoundingClientRect(),r=n.width/Math.max(n.height,1);d.current.set(((t.clientX-n.left)/n.width-.5)*r,.5-(t.clientY-n.top)/n.height),f.current=1},r=()=>{f.current=0};return e.addEventListener(`pointermove`,n,{passive:!0}),e.addEventListener(`pointerleave`,r,{passive:!0}),()=>{e.removeEventListener(`pointermove`,n),e.removeEventListener(`pointerleave`,r)}},[t]),u((t,i)=>{let a=n.current?.uniforms;if(!a)return;let s=Math.min(i,1/30);c.current+=s,a.uTime.value+=s;let u=c.current%F,p=Math.floor(c.current/F)%e.length;p!==o.current&&(o.current=p,a.uWord.value=e[p].texture,a.uTexAspect.value=e[p].aspect);let m;m=u<M?I(u/M):u<5.5?1:1-I((u-M-N)/P),a.uForm.value=m,l.current.lerp(d.current,1-.001**s),a.uPointer.value.copy(l.current),a.uPointerOn.value+=(f.current-a.uPointerOn.value)*(1-.01**s),a.uResolution.value.set(r.width,r.height),a.uScale.value=h(e[o.current].aspect)}),(0,T.jsx)(v,{children:(0,T.jsx)(`shaderMaterial`,{ref:n,vertexShader:y,fragmentShader:D,uniforms:p,depthTest:!1,depthWrite:!1})})}function R({paused:e=!1,active:t=!0,story:n=!1}){let[r,i]=(0,g.useState)(null),[a,o]=(0,g.useState)(!1);(0,g.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`);o(e.matches);let t=()=>o(e.matches);return e.addEventListener(`change`,t),()=>e.removeEventListener(`change`,t)},[]),(0,g.useEffect)(()=>{if(a)return;let e=!0;return(async()=>{if(await C([[O,`ನಿಲ್ಲು .ಕೆಫೆ`,w.kannada.weight],[k,`నిల్లు`,w.telugu.weight],[A,`NILLU`,w.latin.weight]]),!e)return;let t=n?[{text:`ನಿಲ್ಲು`,suffix:``,font:O,weight:w.kannada.weight},{text:`NILLU`,suffix:``,font:A,weight:w.latin.weight}]:j;i(t.map(e=>S(e.text,e.font,e.weight,1600,e.suffix,!n)))})(),()=>{e=!1}},[a,n]),(0,g.useEffect)(()=>()=>r?.forEach(e=>e.texture.dispose()),[r]);let s=n?(0,T.jsx)(`span`,{lang:`kn`,className:`kannada story-liquid-still`,children:`ನಿಲ್ಲು`}):(0,T.jsx)(E,{});return a||e?s:(0,T.jsx)(p,{frameloop:t?`always`:`never`,className:`absolute inset-0`,gl:{antialias:!1,alpha:!1,powerPreference:`high-performance`},dpr:[1,2],flat:!0,fallback:s,children:r&&(0,T.jsx)(L,{words:r,story:n})})}export{R as default};