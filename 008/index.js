var stations = require('./stations.json')
const borders = require('./sweden.json')
const proj4 = require('proj4')
const inside = require('@turf/boolean-point-in-polygon')
const point = require('@turf/helpers').point
const Delaunator = require('delaunator')
const createLink = require('../lib/save-canvas-link')

const width = 512
const height = 768
const canvas = document.createElement('canvas')
canvas.width = width
canvas.height = height
const context = canvas.getContext('2d')
document.body.appendChild(canvas)
const saveLink = createLink(canvas, 'text.png')
saveLink.id = 'save'
saveLink.innerText = 'Save'
document.body.appendChild(saveLink)

const proj = proj4('+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs') 
const cx = 603739
const cy = 6901148
const scale = 5e-4
const threshold = 10
debugger
stations = stations.filter(s => inside(point([s.Longitud, s.Latitud]), borders)).map(s => {
  const p = proj.forward([s.Longitud, s.Latitud])
  return Object.assign({
    X: width / 2 + (p[0] - cx) * scale,
    Y: height / 2 + (cy - p[1]) * scale
  }, s)
})


const delaunay = new Delaunator(stations, s => s.X, s => s.Y)

const triangles = getTriangles(delaunay)
context.fillStyle = '#260'
context.strokeStyle = '#aaa'
for (let i = 0; i < triangles.length; i += 3) {
  context.beginPath()
  context.moveTo(stations[triangles[i]].X, stations[triangles[i]].Y)
  context.lineTo(stations[triangles[i + 1]].X, stations[triangles[i + 1]].Y)
  context.lineTo(stations[triangles[i + 2]].X, stations[triangles[i + 2]].Y)
  context.closePath()
  context.stroke()
  context.fill()
}

function getTriangles(delaunay) {
  const triangles = []
  const actions = []
  for (let i = 0; i < delaunay.triangles.length; i += 3) {
    const a = delaunay.triangles[i]
    const b = delaunay.triangles[i + 1]
    const c = delaunay.triangles[i + 2]
    const midPoint = proj.inverse([
      (((stations[a].X + stations[b].X + stations[c].X) / 3) - width / 2) / scale + cx,
      cy - (((stations[a].Y + stations[b].Y + stations[c].Y) / 3) - height / 2) / scale,
    ])

    if (inside(point(midPoint), borders)) {
      triangles.push(a)
      triangles.push(b)
      triangles.push(c)
    }

    // const area = Math.abs(
    //   (stations[a].X * (stations[b].Y - stations[c].Y) +
    //    stations[b].X * (stations[c].Y - stations[a].Y) +
    //    stations[c].X * (stations[a].Y - stations[b].Y)) / 2)
    // if (area < threshold) {
    //   triangles.push(a)
    //   triangles.push(b)
    //   triangles.push(c)
    // } else {

    // }
  }

  return triangles
}