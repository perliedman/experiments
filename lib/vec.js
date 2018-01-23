"use strict";

module.exports = {
  normalize: normalize,
  dot: dot,
  cross: cross
}

function normalize(v) {
  var l = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
  return [v[0]/l, v[1]/l, v[2]/l]
}

function dot(v1, v2) {
  return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2]
}

function cross(v1, v2) {
  return [(v1[1] * v2[2] - v1[2] * v2[1]),
          (v1[2] * v2[0] - v1[0] * v2[2]),
          (v1[0] * v2[1] - v1[1] * v2[0])];
}
