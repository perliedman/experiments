var {makeTerrain} = require('../lib/mewo2-terrain')
var marchingsquares = require('marchingsquares')
var {createHeightMap, renderHeightMap, canvasToHeightMap} = require('../lib/height-map')
var {normalize, dot, cross} = require('../lib/vec')
var {stackBlurCanvasRGB} = require('../lib/StackBlur')
var loadImage = require('../lib/load-image')
var glContext = require('webgl-context') 
var createTexture = require('gl-texture2d')
var createGeometry = require('gl-geometry')
var createShader = require('gl-shader')
var glslify = require('glslify')
var normals = require('normals')

var vert = glslify('./shaders/basic.vert')
var frag = glslify('./shaders/env.frag')

var insertCss = require('insert-css')

const createMesh = function(terrain, size) {
  var index = function(x, y) { return y * size + x }
  var positions = []
  var cells = []
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      positions.push([(x - size/2)/(size/2), (y - size/2)/(size/2), terrain[x][y]])
//      if (x < size - 1 && y < size - 1) {
      if (x < size - 1 && y < size - 1) {
        cells.push([index(x, y), index(x, y + 1), index(x + 1, y)])
        cells.push([index(x, y + 1), index(x + 1, y + 1), index(x + 1, y)])
      }
    }
  }

  return {positions, cells}
}

const hillShade = function hillShade (terrain, gl, size, envMap) {
  var l = normalize([-1, -1, 1])

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  var envTexture = createTexture(gl, envMap)

  var mesh = createMesh(terrain, size)
  var vertexNormals = normals.vertexNormals(mesh.cells, mesh.positions, 1e-9)
  var geom = createGeometry(gl)
    .attr('positions', mesh.positions)
    .attr('normals', vertexNormals)
    .faces(mesh.cells)

  var shader = createShader(gl, vert, frag)

  shader.bind()
  shader.uniforms.light = l
  shader.uniforms.texNormal = envTexture.bind()

  geom.bind(shader)
  geom.draw(gl.TRIANGLES)
  geom.unbind()

  return gl.canvas
}

insertCss(`
  body {
    background-color: #161624;
    display: flex;
    height: 100vh;
  }

  canvas {
    margin: 2em;
  }

  div {
    background-color: #161624;
    margin: auto;
  }
`)

loadImage('imhof5.jpg', (err, image) => {
  if (err) {
    return console.error(err)
  }
  var size = Math.min(64, window.innerWidth / 3, window.innerHeight / 3)
  var container
  for (var i = 0; i < 9; i++) {
    var terrain = makeTerrain({npts: 512})
    var canvas = renderHeightMap(terrain, size)
    stackBlurCanvasRGB(canvas, 0, 0, canvas.width, canvas.height, 2)
    var heightMap = canvasToHeightMap(canvas, true)
    document.body.removeChild(canvas)
    
    var gl = glContext({ width: size*2, height: size*2 })
    document.body.appendChild(gl.canvas)
    var canvas = hillShade(heightMap, gl, size, image)

    if (i % 3 === 0) {
      container = document.createElement('div')
      document.body.appendChild(container)
    }
    container.appendChild(canvas)
  }
})
