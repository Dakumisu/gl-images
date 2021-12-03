precision highp float;

#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uAlpha;
uniform vec3 uResolution;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec4 texture = texture2D(uTexture, vUv);

  texture.a = uAlpha;

  gl_FragColor = texture;
}