precision mediump float;

attribute vec4 position;
attribute vec3 normal;

varying vec3 vNormal;
varying vec4 vPos;

void main() {
  vNormal = normal;
  vPos = position;
  gl_Position = position;
}
