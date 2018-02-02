var Sky = require('../lib/sky')

function curves(canvas) {
  
}

function skyCanvas(width, turbidity) {
  function update(fn) {
    var i = 0
    var data = imageData.data
    for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
        var rgba = fn(x, y)
        for (var j = 0; j < 4; j++) {
          data[i++] = rgba[j] * 255
        }
      }
    }

    context.putImageData(imageData, 0, 0)
  }

  var canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = width
  var context = canvas.getContext('2d')
  document.body.appendChild(canvas)
  var imageData = context.createImageData(canvas.width, canvas.height)

  var sky = new Sky(turbidity, 1.45, Math.PI/2)
  var ratio = canvas.height / canvas.width
  var sx = Math.PI / canvas.width / 2
  var sy = Math.PI*0.5 / canvas.height / ratio
  var ox = -canvas.width * 0.5
  var oy = canvas.height * 0.5

  var solarZenith = 1.35
  sky.setSolarPos(turbidity, solarZenith, Math.PI/2)

  var f = function (x, y) {
    return sky.rgba((x + ox) * sx + Math.PI*0.5, Math.max(-Math.PI*0.5, (oy + y) * sy - Math.PI * 0.2))
  }

  update(f)
  return canvas
}

for (var i = 1; i < 10; i++) {
  skyCanvas(128, i*2+1)
}
