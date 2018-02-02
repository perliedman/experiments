(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Terrain = require('../lib/fractal-terrain')
var createLink = require('../lib/save-canvas-link')
var {normalize, dot, cross} = require('../lib/vec')

var terrain = new Terrain(9, 100)
terrain.generate(0.05)
var size = 512

const renderTris = function(context, terrain, size, colFn) {
  const scaleCoord = x => x
  function triangle(tri) {
    context.strokeStyle = context.fillStyle = colFn(terrain, tri)
    context.beginPath()
    context.moveTo(scaleCoord(tri[0][0]), scaleCoord(tri[0][1]))
    context.lineTo(scaleCoord(tri[1][0]), scaleCoord(tri[1][1]))
    context.lineTo(scaleCoord(tri[2][0]), scaleCoord(tri[2][1]))
    context.closePath()
    context.stroke()
    context.fill()
  }

  for (var y = 0; y < terrain.size - 1; y++) {
    for (var x = 0; x < terrain.size - 1; x++) {
      triangle([[x, y], [x + 1, y], [x, y + 1]])
      triangle([[x + 1, y], [x + 1, y + 1], [x, y + 1]])
    }
  }
}

const trinormal = function(map, tri) {
  var v1 = [
    tri[1][0] - tri[0][0],
    tri[1][1] - tri[0][1],
    (terrain.map[tri[1][0]][tri[1][1]] - terrain.map[tri[0][0]][tri[0][1]]) * 3
  ]
  var v2 = [
    tri[2][0] - tri[0][0],
    tri[2][1] - tri[0][1],
    (terrain.map[tri[2][0]][tri[2][1]] - terrain.map[tri[0][0]][tri[0][1]]) * 3
  ]

  return cross(normalize(v1), normalize(v2))
}

const hillShade = function hillShade (terrain, size) {
  var minMax = terrain.map.reduce((a, row) => 
    row.reduce((a, cell) => 
      ({min: Math.min(a.min, cell), max: Math.max(a.max, cell)}),
      {min: Number.MAX_VALUE, max: Number.MIN_VALUE})
    )
  var heightScale = 255 / (minMax.max - minMax.min)

  var l = normalize([-1, -1, 1])
  var canvas
  var context

  canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  document.body.appendChild(canvas)
  context = canvas.getContext('2d')
  renderTris(context, terrain, size, (terrain, tri) => {
    var s = trinormal(terrain.map, tri)
    var d = dot(normalize(s), l)
    var col = Math.max(0, d * 255)
    return `rgb(${col}, ${col}, ${col})`
  })

  canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  document.body.appendChild(canvas)
  context = canvas.getContext('2d')
  renderTris(context, terrain, size, (terrain, tri) => {
    var avg = 
      (terrain.map[tri[0][0]][tri[0][1]] +
      terrain.map[tri[1][0]][tri[1][1]] +
      terrain.map[tri[2][0]][tri[2][1]]) / 3
    var col = Math.round((avg - minMax.min) * heightScale)
    return `rgb(${col}, ${col}, ${col})`
  })

  return canvas
}

hillShade(terrain, size)

},{"../lib/fractal-terrain":2,"../lib/save-canvas-link":3,"../lib/vec":4}],2:[function(require,module,exports){
/*
  This is a slightly modified version of Hunter Loftis'
  fractal terrain generator from PlayfulJS:

  http://www.playfuljs.com/realistic-terrain-in-130-lines/
*/

module.exports = Terrain

function Terrain(detail, maxVal) {
  this.size = Math.pow(2, detail) + 1;
  this.max = this.size - 1;
  this.maxVal = maxVal
  this.map = new Array(this.size);
  for (var i = 0; i < this.size; i++) {
    this.map[i] = new Array(this.size);
  }
}

Terrain.prototype.get = function(x, y) {
  if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
  return this.map[y][x];
};
Terrain.prototype.set = function(x, y, val) {
  this.map[y][x] = val;
};
Terrain.prototype.generate = function(roughness) {
  var self = this;
  this.set(0, 0, Math.random() * this.maxVal);
  this.set(this.max, 0, Math.random() * this.maxVal);
  this.set(this.max, this.max, Math.random() * this.maxVal);
  this.set(0, this.max, Math.random() * this.maxVal);
  divide(this.max);
  function divide(size) {
    var x, y, half = size / 2;
    var scale = roughness * size;
    if (half < 1) return;
    for (y = half; y < self.max; y += size) {
      for (x = half; x < self.max; x += size) {
        square(x, y, half, Math.random() * scale * 2 - scale);
      }
    }
    for (y = 0; y <= self.max; y += half) {
      for (x = (y + half) % size; x <= self.max; x += size) {
        diamond(x, y, half, Math.random() * scale * 2 - scale);
      }
    }
    divide(size / 2);
  }
  function average(values) {
    var valid = values.filter(function(val) { return val !== -1; });
    var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
    return total / valid.length;
  }
  function square(x, y, size, offset) {
    var ave = average([
      self.get(x - size, y - size),   // upper left
      self.get(x + size, y - size),   // upper right
      self.get(x + size, y + size),   // lower right
      self.get(x - size, y + size)    // lower left
    ]);
    self.set(x, y, ave + offset);
  }
  function diamond(x, y, size, offset) {
    var ave = average([
      self.get(x, y - size),      // top
      self.get(x + size, y),      // right
      self.get(x, y + size),      // bottom
      self.get(x - size, y)       // left
    ]);
    self.set(x, y, ave + offset);
  }
};

},{}],3:[function(require,module,exports){
module.exports = function (canvas, name) {
  var link = document.createElement('a')
  link.href = '#'
  link.addEventListener('mousedown', function(ev) {
      link.href = canvas.toDataURL()
      link.download = name || 'unnamed.png'
      ev.preventDefault()
  }, false)

  return link
}

},{}],4:[function(require,module,exports){
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

},{}]},{},[1]);
