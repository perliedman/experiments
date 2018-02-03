precision mediump float;

uniform sampler2D texNormal;
varying vec3 vNormal;
varying vec4 vPos;

void main() {
  vec2 uv = vec2(vNormal.x, vNormal.y) * 0.5 + 1.;
//  gl_FragColor = vec4(vPos.z, vPos.z, vPos.z, 1.);
//  gl_FragColor = vec4(1., 0., 0., 1.);
//  gl_FragColor = texture2D(texNormal, normalize(uv));
  gl_FragColor = vec4(vNormal, 1.);
  //gl_FragColor = vec4(vPos.z, vPos.z, vPos.z, 1.);
}
