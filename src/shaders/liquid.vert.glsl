// Fullscreen triangle: positions already arrive in clip space.
// drei's ScreenQuad geometry supplies only a 2-component `position`, no `uv`
// attribute — so derive the 0..1 coordinate from clip space here.
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
