var {makeTerrain} = require('../lib/mewo2-terrain')
var marchingsquares = require('marchingsquares')
var createLink = require('../lib/save-canvas-link')
var createHeightMap = require('../lib/height-map').createHeightMap
var {normalize, dot, cross} = require('../lib/vec')

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

  for (var y = 0; y < size - 1; y++) {
    for (var x = 0; x < size - 1; x++) {
      triangle([[x, y], [x + 1, y], [x, y + 1]])
      triangle([[x + 1, y], [x + 1, y + 1], [x, y + 1]])
    }
  }
}

const trinormal = function(map, tri) {
  var v1 = [
    tri[1][0] - tri[0][0],
    tri[1][1] - tri[0][1],
    (map[tri[1][0]][tri[1][1]] - map[tri[0][0]][tri[0][1]])
  ]
  var v2 = [
    tri[2][0] - tri[0][0],
    tri[2][1] - tri[0][1],
    (map[tri[2][0]][tri[2][1]] - map[tri[0][0]][tri[0][1]])
  ]

  return cross(normalize(v1), normalize(v2))
}

const hillShade = function hillShade (terrain, size) {
  var minMax = terrain.reduce((a, row) => 
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
    var s = trinormal(terrain, tri)
    var d = dot(normalize(s), l)
    var col = Math.max(0, d)
    return `rgb(${col*255}, ${col*col*192}, ${col*col*col*192})`
  })

  canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  document.body.appendChild(canvas)
  context = canvas.getContext('2d')
  renderTris(context, terrain, size, (terrain, tri) => {
    var avg = 
      (terrain[tri[0][0]][tri[0][1]] +
      terrain[tri[1][0]][tri[1][1]] +
      terrain[tri[2][0]][tri[2][1]]) / 3
    var col = Math.round((avg - minMax.min) * heightScale)
    return `rgb(${col}, ${col}, ${col})`
  })

  return canvas
}

var size = 512
var terrain = makeTerrain()
var heightMap = createHeightMap(terrain, size)
hillShade(heightMap, size)