var {makeTerrain, contour} = require('../lib/mewo2-terrain')
var marchingsquares = require('marchingsquares')
var simplify = require('simplify-js')
var spline = require('../lib/spline')
var createLink = require('../lib/save-canvas-link')
var createHeightMap = require('../lib/height-map').createHeightMap

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

var colors = [
  '#d73027',
  '#f46d43',
  '#fdae61',
  '#fee090',
  '#ffffbf',
  '#e0f3f8',
  '#abd9e9',
  '#74add1',
  '#4575b4',
]
colors = colors.reverse()
var heightMap = createHeightMap(terrain, size)
var scale = 1
var canvas = document.createElement('canvas')
canvas.width = size
canvas.height = size
var context = canvas.getContext('2d')
document.body.appendChild(canvas)

var minMax = heightMap.reduce((a, row) => 
  row.reduce((a, cell) => 
    ({min: Math.min(a.min, cell), max: Math.max(a.max, cell)}),
    {min: Number.MAX_VALUE, max: Number.MIN_VALUE})
  )
var bandWidth = (minMax.max - minMax.min) / 10
var floor = minMax.min
var index = 0
var bands = Math.ceil((minMax.max - floor) / bandWidth)
context.fillStyle = colors[bands % colors.length]
context.fillRect(0, 0, canvas.width, canvas.height) 

for (var lowerBand = floor; lowerBand < minMax.max; lowerBand += bandWidth) {
  context.fillStyle = colors[index++ % colors.length]
  drawRings(marchingsquares.isoBands(heightMap, lowerBand, bandWidth), {close: true, fill: true})
}

context.lineWidth = 0.67
for (var lowerBand = floor; lowerBand < minMax.max + bandWidth; lowerBand += bandWidth) {
  drawRings(marchingsquares.isoContours(heightMap, lowerBand), {stroke: true})
}

function drawRings (rings, options) {
  rings.forEach(band => {
    var points = band.map(c => ({x: c[0], y: c[1]}))
    var sPoints = simplify(points, 1.5)
    spline(context, sPoints, 0.3, options)
  })
}
