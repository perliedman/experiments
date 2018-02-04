var {makeTerrain} = require('../lib/mewo2-terrain')
var marchingsquares = require('marchingsquares')
var createLink = require('../lib/save-canvas-link')
var createHeightMap = require('../lib/height-map').createHeightMap
var {normalize, dot, cross} = require('../lib/vec')

const renderTris = function(context, terrain, size, colFn) {
  for (var y = 0; y < size - 1; y++) {
    for (var x = 0; x < size - 1; x++) {
      var tri = [[x, y], [x + 1, y], [x, y + 1]]
      context.fillStyle = colFn(terrain, tri, context)
      context.fillRect(x, y, 1, 1)
    }
  }
}

const trinormal = function(map, tri) {
  var v1 = [
    tri[1][0] - tri[0][0],
    tri[1][1] - tri[0][1],
    (map[tri[1][0]][tri[1][1]] - map[tri[0][0]][tri[0][1]]) * 255
  ]
  var v2 = [
    tri[2][0] - tri[0][0],
    tri[2][1] - tri[0][1],
    (map[tri[2][0]][tri[2][1]] - map[tri[0][0]][tri[0][1]]) * 255
  ]

  return cross(normalize(v1), normalize(v2))
}

const hillShade = function hillShade (terrain, size, getEnv) {
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
  renderTris(context, terrain, size, (terrain, tri, context) => {
    var s = trinormal(terrain, tri)
    var d = dot(normalize(s), l)
    var col = Math.max(0, d) * 255
    if (Math.abs(Math.round(col) - col) < 1e-9) {
      return `rgb(${Math.round(col)}, ${Math.round(col)}, ${Math.round(col)})`
    } else {
      return context.fillStyle
    }
    /*
    return `rgb(${col*255}, ${col*255}, ${col*255})`
    return `rgb(${s[0]*127+128}, ${s[1]*127+128}, ${s[2]*127+128})`
    */
  })
}

var size = Math.min(960, window.innerWidth, window.innerHeight)
var terrain = makeTerrain({npts:16384})
var heightMap = createHeightMap(terrain, size, true)
hillShade(heightMap, size)
