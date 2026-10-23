precision highp float;

#include noise.glsl

varying vec2 vUv;

uniform sampler2D uWord;      // current word, luminance = glyph coverage
uniform float uStory;         // small story word needs a clean, still hold
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

  float flowAmount = mix(0.014 + 0.085 * dissolve, 0.099 * dissolve, uStory);
  vec2 warp = flow * flowAmount + (ripple * 0.055 + push * 0.045);

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
  float edge = mix(fwidth(field) + 0.0035, max(fwidth(field), 0.001), uStory);
  float alpha = smoothstep(0.45 - edge, 0.45 + edge, field);

  vec3 col = mix(uPaper, uInk, alpha);

  // A barely-there ambient surface so the hero still breathes between words.
  float amb = snoise(vec3(st * 1.5 + vec2(0.0, -t * 0.7), t * 0.45));
  float ambA = smoothstep(0.58, 0.95, amb) * 0.045;
  col = mix(col, uInk, ambA * (1.0 - alpha) * (1.0 - uStory));

  gl_FragColor = vec4(col, 1.0);
}
