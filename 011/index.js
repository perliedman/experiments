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
