var Sky = require('../lib/sky')
var Delaunator = require('delaunator')

var stopped = false
var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var context = canvas.getContext('2d')
var imageData = context.createImageData(canvas.width, canvas.height)

document.body.appendChild(canvas)

var sky = new Sky(3, 1.45, Math.PI/2)
var ratio = canvas.height / canvas.width
var sx = Math.PI / canvas.width
var sy = Math.PI/4 / canvas.height / ratio
var ox = -canvas.width * 1
var oy = canvas.height * 1

function up() {
  var t = +new Date() / 10000
  var solarZenith = 1.45+Math.cos(t) * Math.PI/8
  sky.setSolarPos(3, solarZenith, Math.PI/2)

  document.getElementById('info').innerText = 'z = ' + solarZenith.toFixed(3)

  var f = function (x, y) {
    return sky.sky((x + ox) * sx, Math.max(-Math.PI*0.5, (-y - oy) * sy + Math.PI/3))
  }

  update(f)

  if (!stopped) {
    requestAnimationFrame(up)
  }
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

window.addEventListener('keypress', function(e) {
  if (e.keyCode == 13) {
    stopped = true
    canvas.style.display = 'none'
    canvas.toBlob(function(blob) {
      var newImg = document.createElement('img'),
          url = URL.createObjectURL(blob);

      newImg.onload = function() {
        // no longer need to read the blob so it's revoked
        URL.revokeObjectURL(url);
      };

      newImg.src = url;
      document.body.appendChild(newImg);
    });
  }
})