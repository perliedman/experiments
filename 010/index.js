var {makeTerrain, neighbours} = require('../lib/mewo2-terrain')
var {renderHeightMap} = require('../lib/height-map')
var {normalize, dot, cross} = require('../lib/vec')

var insertCss = require('insert-css')
insertCss(`
  body {
    display: flex;
    height: 100vh;
  }

  canvas {
    border: 4px solid white;
    margin: auto;  /* Magic! */
  }
`)

var terrain = makeTerrain({npts:16384})
var size = Math.min(512, window.innerWidth, window.innerHeight)

const trinormal = function normal(h, i) {
    var nbs = neighbours(h.mesh, i);
    if (nbs.length !== 3) return [0,0,1];
    var p0 = h.mesh.vxs[nbs[0]];
    var p1 = h.mesh.vxs[nbs[1]];
    var p2 = h.mesh.vxs[nbs[2]];

    var x1 = p1[0] - p0[0];
    var x2 = p2[0] - p0[0];
    var y1 = p1[1] - p0[1];
    var y2 = p2[1] - p0[1];
    var z1 = h[nbs[1]] - h[nbs[0]];
    var z2 = h[nbs[2]] - h[nbs[0]];

    var v1 = normalize([x1, y1, z1])
    var v2 = normalize([x2, y2, z2])
    if (dot(v1, v2) > 0) {
      return cross(v1, v2)
    } else {
      return cross(v2, v1)
    }
}

const renderTris = function(context, terrain, size, colFn) {
  const scaleCoord = c => (c+0.5)*size

   terrain.h.mesh.tris.forEach((tri, i) => {
    context.strokeStyle = context.fillStyle = colFn(terrain, tri, i)
    context.beginPath()
    context.moveTo(scaleCoord(tri[0][0]), scaleCoord(tri[0][1]))
    for (var i = 1; i < tri.length; i++) {
      context.lineTo(scaleCoord(tri[i][0]), scaleCoord(tri[i][1]))
    }
    context.closePath()
    context.stroke()
    context.fill()
  })
}

const hillShade = function hillShade (terrain, size) {
  var minMax = terrain.h.reduce((a, cell) => 
      ({min: Math.min(a.min, cell), max: Math.max(a.max, cell)}),
      {min: Number.MAX_VALUE, max: Number.MIN_VALUE})
  var heightScale = 255 / (minMax.max - minMax.min)

  var l = normalize([3, 4, -1])

  var canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  document.body.appendChild(canvas)
  var context = canvas.getContext('2d')
  renderTris(context, terrain, size, (terrain, tri, i) => {
    var s = trinormal(terrain.h, i)
    var d = dot(normalize(s), l)
    var col = Math.round(Math.max(0, d * 255))
    return `rgb(${col}, ${col}, ${col})`
  })

  /*
  canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  document.body.appendChild(canvas)
  context = canvas.getContext('2d')
  renderTris(context, terrain, size, (terrain, tri, i) => {
    var col = Math.round((terrain.h[i] - minMax.min) * heightScale)
    return `rgb(${col}, ${col}, ${col})`
  })

  return canvas
  */
}

hillShade(terrain, size)