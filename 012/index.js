var {makeTerrain} = require('../lib/mewo2-terrain')
var marchingsquares = require('marchingsquares')
var createLink = require('../lib/save-canvas-link')
var createHeightMap = require('../lib/height-map').createHeightMap
var {normalize, dot, cross} = require('../lib/vec')

const renderTris = function(context, terrain, size, colFn) {
  for (var y = 0; y < size - 1; y++) {
    for (var x = 0; x < size - 1; x++) {
      var tri = [[x, y], [x + 1, y], [x, y + 1]]
      context.fillStyle = colFn(terrain, tri)
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

const loadEnvironmentMap = function(url) {
  return new Promise(function (resolve, reject) {
    var img = new Image()
    img.src = url
    img.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      img.style.display = 'none';
      var data = ctx.getImageData(0, 0, img.width, img.height).data;
      resolve(function(x, y) {
        x = Math.round((x + 1) * 0.5 * img.width)
        y = Math.round((y + 1) * 0.5 * img.height)
        var offset = (y * img.width + x) * 4

        return `rgba(${data[offset + 0]},${data[offset + 1]},${data[offset + 2]},${data[offset + 3]/255})`
      })
    };
  });
}

const hillShade = function hillShade (terrain, size, getEnv) {
  var minMax = terrain.reduce((a, row) => 
    row.reduce((a, cell) => 
      ({min: Math.min(a.min, cell), max: Math.max(a.max, cell)}),
      {min: Number.MAX_VALUE, max: Number.MIN_VALUE})
    )
  var heightScale = 255 / (minMax.max - minMax.min)

  var l = normalize([0, 0, 1])
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
    return `rgb(${col*255}, ${col*255}, ${col*255})`
    if (Math.abs(Math.round(col) - col) < 1e-9) {
      return `rgb(${Math.round(col*255)}, ${Math.round(col*255)}, ${Math.round(col*255)})`
    } else {
      return 'rgba(0,0,0,0)'
    }
    //return `rgb(${s[0]*127+128}, ${s[1]*127+128}, ${s[2]*127+128})`
    //return getEnv(s[0], s[1])
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

var size = 480
var terrain = makeTerrain({npts:16384})
var heightMap = createHeightMap(terrain, size, true)
loadEnvironmentMap('imhof5.jpg')
  .then(function(getEnv) {
    hillShade(heightMap, size, getEnv)
  })
