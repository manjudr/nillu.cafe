import{P as e,j as t,k as n,n as r,t as i}from"./index-CJ5OAC5Z.js";import{E as a,O as o,T as s,a as c,i as l,l as u,m as d,n as f,o as p,s as m,t as h,u as g,x as _}from"./react-three-fiber.esm-CMeTgb6l.js";var v=e(t());function y(){let e=new p,t=new Float32Array([-1,-1,3,-1,-1,3]);return e.boundingSphere=new _,e.boundingSphere.set(new a,1/0),e.setAttribute(`position`,new c(t,2)),e}var b=v.forwardRef(function({children:e,...t},n){let r=v.useMemo(y,[]);return v.createElement(`mesh`,o({ref:n,geometry:r,frustumCulled:!1},t),e)}),x=`// Fullscreen triangle: positions already arrive in clip space.
// drei's ScreenQuad geometry supplies only a 2-component \`position\`, no \`uv\`
// attribute — so derive the 0..1 coordinate from clip space here.
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,S=`precision highp float;

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
`,C=`// Simplex 3D noise — Ashima Arts / Stefan Gustavson, MIT licensed.
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
`;function w(e,t,n=500,r=1600,i=``,a=!1){let o=document.createElement(`canvas`).getContext(`2d`);if(!o)throw Error(`2d canvas unavailable`);o.font=`${n} 400px ${t}`;let s=o.measureText(e),c=Math.max(1,s.actualBoundingBoxLeft+s.actualBoundingBoxRight),l=Math.max(1,s.actualBoundingBoxAscent+s.actualBoundingBoxDescent),f=r/c,p=l*f*.1,h=Math.ceil(c*f+p*2+(a?l*f*.18:0)),g=400*f*.22;o.font=`${n} ${g}px ${t}`;let _=i?o.measureText(i):null,v=_?.actualBoundingBoxAscent??0,y=_?.actualBoundingBoxDescent??0,b=l*f*.12,x=Math.ceil(l*f+p*2+(i?b+v+y:0)),S=document.createElement(`canvas`);S.width=h,S.height=x;let C=S.getContext(`2d`);if(C.fillStyle=`#000000`,C.fillRect(0,0,h,x),C.font=`${n} ${400*f}px ${t}`,C.fillStyle=`#ffffff`,C.textAlign=`left`,C.textBaseline=`alphabetic`,C.fillText(e,p+s.actualBoundingBoxLeft*f,p+s.actualBoundingBoxAscent*f),a){let e=l*f*.12;C.font=`500 ${e}px sans-serif`,C.fillText(`™`,p+c*f+e*.2,p+e)}if(i&&_){C.font=`${n} ${g}px ${t}`;let e=p+c*f-_.actualBoundingBoxRight;C.fillText(i,e,p+l*f+b+v)}let w=new m(S);return w.minFilter=d,w.magFilter=d,w.generateMipmaps=!1,w.wrapS=u,w.wrapT=u,w.colorSpace=``,w.needsUpdate=!0,{texture:w,aspect:h/x}}async function T(e){`fonts`in document&&(await Promise.all(e.map(([e,t,n=500])=>document.fonts.load(`${n} 400px ${e}`,t).catch(()=>void 0))),await document.fonts.ready)}var E=n(),D=S.replace(`#include noise.glsl`,C),O=r.kannada.family,k=r.telugu.family,A=r.latin.family,j=[{text:`NILLU`,suffix:`.cafe`,font:A,weight:r.latin.weight},{text:`ನಿಲ್ಲು`,suffix:`.ಕೆಫೆ`,font:O,weight:r.kannada.weight},{text:`నిల్లు`,suffix:`.cafe`,font:k,weight:r.telugu.weight}],M=1.3,N=4.2,P=1.2,F=6.7,I=e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2;function L({words:e}){let t=(0,v.useRef)(null),{size:n,viewport:r}=l(),i=(0,v.useRef)(0),a=(0,v.useRef)(0),o=(0,v.useRef)(new s(0,0)),c=(0,v.useRef)(new s(0,0)),u=(0,v.useRef)(0),d=(0,v.useMemo)(()=>({uWord:{value:e[0].texture},uForm:{value:0},uTime:{value:0},uResolution:{value:new s(1,1)},uPointer:{value:new s(0,0)},uPointerOn:{value:0},uTexAspect:{value:e[0].aspect},uScale:{value:.4},uInk:{value:new g(`#0a0a0a`)},uPaper:{value:new g(`#ffffff`)}}),[e]),p=e=>{let t=n.width/Math.max(n.height,1),r=n.width<720?.86:.8;return Math.min(r*t/e,.46)};return(0,v.useEffect)(()=>{let e=document.getElementById(`hero`);if(!e)return;let t=t=>{let n=e.getBoundingClientRect(),r=n.width/Math.max(n.height,1);c.current.set(((t.clientX-n.left)/n.width-.5)*r,.5-(t.clientY-n.top)/n.height),u.current=1},n=()=>{u.current=0};return e.addEventListener(`pointermove`,t,{passive:!0}),e.addEventListener(`pointerleave`,n,{passive:!0}),()=>{e.removeEventListener(`pointermove`,t),e.removeEventListener(`pointerleave`,n)}},[]),f((r,s)=>{let l=t.current?.uniforms;if(!l)return;let d=Math.min(s,1/30);a.current+=d,l.uTime.value+=d;let f=a.current%F,m=Math.floor(a.current/F)%e.length;m!==i.current&&(i.current=m,l.uWord.value=e[m].texture,l.uTexAspect.value=e[m].aspect);let h;h=f<M?I(f/M):f<5.5?1:1-I((f-M-N)/P),l.uForm.value=h,o.current.lerp(c.current,1-.001**d),l.uPointer.value.copy(o.current),l.uPointerOn.value+=(u.current-l.uPointerOn.value)*(1-.01**d),l.uResolution.value.set(n.width,n.height),l.uScale.value=p(e[i.current].aspect)}),(0,E.jsx)(b,{children:(0,E.jsx)(`shaderMaterial`,{ref:t,vertexShader:x,fragmentShader:D,uniforms:d,depthTest:!1,depthWrite:!1})})}function R({paused:e=!1,active:t=!0}){let[n,a]=(0,v.useState)(null),[o,s]=(0,v.useState)(!1);return(0,v.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`);s(e.matches);let t=()=>s(e.matches);return e.addEventListener(`change`,t),()=>e.removeEventListener(`change`,t)},[]),(0,v.useEffect)(()=>{if(o)return;let e=!0;return(async()=>{await T([[O,`ನಿಲ್ಲು .ಕೆಫೆ`,r.kannada.weight],[k,`నిల్లు`,r.telugu.weight],[A,`NILLU`,r.latin.weight]]),e&&a(j.map(e=>w(e.text,e.font,e.weight,1600,e.suffix,!0)))})(),()=>{e=!1}},[o]),(0,v.useEffect)(()=>()=>n?.forEach(e=>e.texture.dispose()),[n]),o||e?(0,E.jsx)(i,{}):(0,E.jsx)(h,{frameloop:t?`always`:`never`,className:`absolute inset-0`,gl:{antialias:!1,alpha:!1,powerPreference:`high-performance`},dpr:[1,2],flat:!0,fallback:(0,E.jsx)(i,{}),children:n&&(0,E.jsx)(L,{words:n})})}export{R as default};