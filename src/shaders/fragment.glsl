uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying float vOpacity;
float PI = 3.14;

void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  vec2 cUV = 2.0 * uv - 1.0;

  vec3 originalColor = vec3(4.0/255.0, 10.0/255.0, 20.0/255.0);

  vec4 color = vec4(0.08 / length(cUV));
  color.rgb = min(vec3(10.0), color.rgb);
  color.rgb *= originalColor * 120.0;
  color *= vOpacity;
  color.a = min(1.0, color.a) * 10.0;

  float disc = length(cUV);

  gl_FragColor = vec4(1.0 - disc, 0.0, 0.0, 1.0) * vOpacity;
  gl_FragColor = vec4(color.rgb, color.a);
}