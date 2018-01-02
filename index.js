var Sky = require('./sky')
var Delaunator = require('delaunator')

var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var context = canvas.getContext('2d')
var imageData = context.createImageData(canvas.width, canvas.height)

document.body.appendChild(canvas)

var sky = new Sky(3, 1.45, Math.PI/2)
var f = sky.sky.bind(sky)

var points = [[0, 0], [0, canvas.height], [canvas.width, 0], [canvas.width, canvas.height]]
for (var i = 0; i < 800; i++) {
  points.push([
    Math.round(Math.random() * canvas.width),
    Math.round(Math.random() * canvas.height),
  ])
}

var delaunay = new Delaunator(points)
var triangles = delaunay.triangles
var sx = Math.PI / canvas.width*1
var sy = Math.PI / canvas.height
var ox = -canvas.width * 2
var oy = canvas.height * 1.5

function up () {
  var t = +new Date() / 2000
  var dx = (canvas.width * 0.25) * Math.sin(t*0.233)
  var dy = (canvas.width * 0.25) * Math.cos(t)
  var r = Math.PI/4 * Math.cos(t*0.067)

  for (i = 0; i < triangles.length; i += 3) {
    var cx =
      (points[triangles[i]][0] +
      points[triangles[i + 1]][0] +
      points[triangles[i + 2]][0]) / 3 + dx
    var cy =
      (points[triangles[i]][1] +
      points[triangles[i + 1]][1] +
      points[triangles[i + 2]][1]) / 3 + dy
    var x = (cx + ox) * sx
    var y = (-cy - oy) * sy

    var azimuth = x * Math.cos(r) + y * Math.sin(r)
    var zenith = x * Math.sin(r) - y * Math.cos(r)

    var rgba = sky.sky(azimuth, zenith)
    rgba.forEach(function(v, i) {rgba[i] = Math.round(v * 255)})

    context.fillStyle = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`
    context.strokeStyle = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${Math.round(rgba[3]*0.5)})`
    context.beginPath()
    context.moveTo(points[triangles[i]][0], points[triangles[i]][1])
    context.lineTo(points[triangles[i + 1]][0], points[triangles[i + 1]][1])
    context.lineTo(points[triangles[i + 2]][0], points[triangles[i + 2]][1])
    context.closePath()
    context.stroke()
    context.fill()
  }

  requestAnimationFrame(up)
}

up()

/*
function up() {
  var t = +new Date() / 10000
  var solarZenith = 1.45//Math.cos(t) * Math.PI/4 + Math.PI/2
  sky.setSolarPos(3, solarZenith, Math.PI/2)

  document.getElementById('info').innerText = 'z = ' + solarZenith.toFixed(3)

  update(f)

  //requestAnimationFrame(up)
}

up()

function update(fn) {
  var t = +new Date() / 1000
  var i = 0
  var data = imageData.data
  for (var y = 0; y < imageData.height; y++) {
    for (var x = 0; x < imageData.width; x++) {
      var rgba = fn(x, y, t)
      for (var j = 0; j < 4; j++) {
        data[i++] = rgba[j] * 255
      }
    }
  }

  context.putImageData(imageData, 0, 0)
}

function dist(cx, cy, x, y) {
  var dx = cx - x;
  var dy = cy - y;
  return 1-Math.min(1, (dx*dx + dy*dy) / (300*300))
}

function flare(x, y, t) {
  var d = dist(350 + Math.cos(t / 10) * 40, 326 + Math.sin(t / 10) * 40, x, y);
  //var d2 = dist(350 + Math.cos(t / 10) * 40, 326 + Math.sin(t / 10) * 40, x, y);
  return [d, d, d, 1]
}
*/
