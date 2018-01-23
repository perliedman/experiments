
const createHeightMap = function createHeightMap (terrain, size) {
  var canvas = renderHeightMap(terrain, size)
  var context = canvas.getContext('2d')
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

const renderHeightMap = function renderHeightMap (terrain, size) {
  const scaleCoord = c => (c+0.5)*size
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

  return canvas
}

module.exports = {
  createHeightMap,
  renderHeightMap
}
