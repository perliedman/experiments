var Terrain = require('../lib/fractal-terrain')
var marchingsquares = require('marchingsquares')
var simplify = require('simplify-js')
var createLink = require('../lib/save-canvas-link')

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

var terrain = new Terrain(9, 100)
terrain.generate(0.05)

var minMax = terrain.map.reduce((a, row) => 
  row.reduce((a, cell) => 
    ({min: Math.min(a.min, cell), max: Math.max(a.max, cell)}),
    {min: Number.MAX_VALUE, max: Number.MIN_VALUE})
  )

var canvas = document.createElement('canvas')
var size = Math.min(window.innerWidth, window.innerHeight, 512)
canvas.width = size
canvas.height = size
var scale = size / terrain.size
var context = canvas.getContext('2d')
document.body.appendChild(canvas)
var saveLink = createLink(canvas, 'topo.png')
saveLink.id = 'save'
saveLink.innerText = 'Save'
document.body.appendChild(saveLink)

context.lineWidth = 1
context.strokeStyle = 'black'

var bandWidth = 5
var floor = Math.floor(minMax.min / bandWidth) * bandWidth
var index = 0
var bands = Math.ceil((minMax.max - floor) / bandWidth)
context.fillStyle = colors[bands % colors.length]
context.fillRect(0, 0, canvas.width, canvas.height) 

for (var lowerBand = floor; lowerBand < minMax.max; lowerBand += bandWidth) {
  context.fillStyle = colors[index++ % colors.length]
  drawRings(marchingsquares.isoBands(terrain.map, lowerBand, bandWidth), {close: true, fill: true})
}

for (var lowerBand = floor; lowerBand < minMax.max + bandWidth; lowerBand += bandWidth) {
  drawRings(marchingsquares.isoContours(terrain.map, lowerBand), {stroke: true})
}

function drawRings (rings, options) {
  rings.forEach(band => {
    var points = band.map(c => ({x: c[0], y: c[1]}))
    var sPoints = simplify(points, 1)

    context.beginPath()
    context.moveTo(sPoints[0].x*scale, sPoints[0].y*scale)
    for (var i = 1; i < sPoints.length; i++) {
      var coord = sPoints[i]
      context.lineTo(coord.x*scale, coord.y*scale)
    }

    if (options.close) {      
      context.closePath()
    }

    if (options.fill) {      
      context.fill()
    }

    if (options.stroke) {      
      context.stroke()
    }
  })
}
