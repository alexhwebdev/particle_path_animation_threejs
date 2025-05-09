uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying float vOpacity;
uniform sampler2D texture1;
attribute float opacity;
float PI = 3.14;

void main() {
  vUv = uv;
  vOpacity = opacity;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = 10000.0 * ( 1.0 / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}