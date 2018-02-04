var {makeTerrain, contour} = require('../lib/mewo2-terrain')
var marchingsquares = require('marchingsquares')
var simplify = require('simplify-js')
var spline = require('../lib/spline')

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

var terrain = makeTerrain()
var size = Math.min(512, window.innerHeight)
var scaleCoord = c => (c+0.5)*size

function createHeightMap(terrain) {
  var canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  document.body.appendChild(canvas)
  var context = canvas.getContext('2d')

  var minMax = terrain.h.reduce((a, cell) => 
      ({min: Math.min(a.min, cell), max: Math.max(a.max, cell)}),
      {min: Number.MAX_VALUE, max: Number.MIN_VALUE})
  var heightScale = 255 / (minMax.max - minMax.min)


  terrain.h.mesh.tris.forEach((tri, i) => {
    var h = terrain.h[i]
    var col = Math.round((h - minMax.min) * heightScale)
    context.strokeStyle = context.fillStyle = `rgb(${col}, ${col}, ${col})`
    context.beginPath()
    context.moveTo(scaleCoord(tri[0][0]), scaleCoord(tri[0][1]))
    for (var i = 1; i < tri.length; i++) {
      context.lineTo(scaleCoord(tri[i][0]), scaleCoord(tri[i][1]))
    }
    context.closePath()
    context.stroke()
    context.fill()
  })

  var data = context.getImageData(0, 0, canvas.width, canvas.height).data
  var heightMap = new Array(canvas.height)
  for (var y = 0; y < canvas.height; y++) {
    heightMap[y] = new Array(canvas.width)
    for (var x = 0; x < canvas.width; x++) {
      heightMap[y][x] = data[(canvas.width*y + x)*4]
    }
  }

  document.body.removeChild(canvas)

  return heightMap
}

var heightMap = createHeightMap(terrain)
var scale = 1
var canvas = document.createElement('canvas')
canvas.width = size
canvas.height = size
var context = canvas.getContext('2d')
document.body.appendChild(canvas)

context.fillStyle = 'white'
context.fillRect(0, 0, size, size)

var minMax = heightMap.reduce((a, row) => 
  row.reduce((a, cell) => 
    ({min: Math.min(a.min, cell), max: Math.max(a.max, cell)}),
    {min: Number.MAX_VALUE, max: Number.MIN_VALUE})
  )
var bandWidth = (minMax.max - minMax.min) / 10
var floor = minMax.min

context.lineWidth = 0.67
context.strokeStyle = '#BE7B54'
for (var lowerBand = floor; lowerBand < minMax.max + bandWidth; lowerBand += bandWidth) {
  drawRings(marchingsquares.isoContours(heightMap, lowerBand), {stroke: true})
}

context.lineWidth = 1
context.strokeStyle = '#00A3E0'
terrain.rivers.forEach(river => {
  var points = river.map(c => ({x: scaleCoord(c[0]), y: scaleCoord(c[1])}))
  var sPoints = simplify(points, 2)
  spline(context, sPoints, 0.5, {stroke: true})
})

function drawRings (rings, options) {
  rings.forEach(band => {
    var points = band.map(c => ({x: c[0], y: c[1]}))
    var sPoints = simplify(points, 2)
    spline(context, sPoints, 0.5, options)
  })
}
