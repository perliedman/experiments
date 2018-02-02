(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var stations = require('./stations.json')
const borders = require('./sweden.json')
const proj4 = require('proj4')
const inside = require('@turf/boolean-point-in-polygon')
const point = require('@turf/helpers').point
const Delaunator = require('delaunator')
const createLink = require('../lib/save-canvas-link')

const height = Math.min(768, window.innerHeight)
const width = height * 0.67
const canvas = document.createElement('canvas')
canvas.width = width
canvas.height = height
const context = canvas.getContext('2d')
document.body.appendChild(canvas)
const saveLink = createLink(canvas, 'text.png')
saveLink.id = 'save'
saveLink.innerText = 'Save'
document.body.appendChild(saveLink)

context.fillStyle = 'white'
context.fillRect(0, 0, width, height)

const proj = proj4('+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs') 
const cx = 603739
const cy = 6901148
const scale = height * 7e-7
const threshold = 10
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
},{"../lib/save-canvas-link":4,"./stations.json":2,"./sweden.json":3,"@turf/boolean-point-in-polygon":5,"@turf/helpers":6,"delaunator":9,"proj4":10}],2:[function(require,module,exports){
module.exports=[
 {
   "Stationsnamn": "Fårösund Ar A",
   "Stationsnummer": 78550,
   "Latitud": 57.9167,
   "Longitud": 18.9568,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norrköping-SMHI",
   "Stationsnummer": 86340,
   "Latitud": 58.5828,
   "Longitud": 16.147,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norrsundet",
   "Stationsnummer": 107560,
   "Latitud": 60.9297,
   "Longitud": 17.1561,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Falsterbo",
   "Stationsnummer": 52230,
   "Latitud": 55.3836,
   "Longitud": 12.8203,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Falsterbo A",
   "Stationsnummer": 52240,
   "Latitud": 55.3838,
   "Longitud": 12.819,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malmö A",
   "Stationsnummer": 52350,
   "Latitud": 55.5714,
   "Longitud": 13.0734,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Landskrona D",
   "Stationsnummer": 52520,
   "Latitud": 55.8659,
   "Longitud": 12.8512,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ven",
   "Stationsnummer": 52550,
   "Latitud": 55.912,
   "Longitud": 12.6823,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Beddingestrand",
   "Stationsnummer": 53190,
   "Latitud": 55.3606,
   "Longitud": 13.4343,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Trelleborg",
   "Stationsnummer": 53230,
   "Latitud": 55.381,
   "Longitud": 13.1279,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ystad",
   "Stationsnummer": 53260,
   "Latitud": 55.4325,
   "Longitud": 13.8067,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skurup D",
   "Stationsnummer": 53280,
   "Latitud": 55.4405,
   "Longitud": 13.4796,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sturup",
   "Stationsnummer": 53300,
   "Latitud": 55.5231,
   "Longitud": 13.3787,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "ESMS",
   "Stationsnummer": 53306,
   "Latitud": 55.539,
   "Longitud": 13.3665,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tomelilla",
   "Stationsnummer": 53320,
   "Latitud": 55.5533,
   "Longitud": 13.945,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malmö",
   "Stationsnummer": 53360,
   "Latitud": 55.5726,
   "Longitud": 13.0776,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Björnstorp",
   "Stationsnummer": 53380,
   "Latitud": 55.6254,
   "Longitud": 13.4122,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lövestad",
   "Stationsnummer": 53400,
   "Latitud": 55.6008,
   "Longitud": 13.892,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vomb",
   "Stationsnummer": 53410,
   "Latitud": 55.6616,
   "Longitud": 13.5323,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lund",
   "Stationsnummer": 53430,
   "Latitud": 55.693,
   "Longitud": 13.229,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sjöbo D",
   "Stationsnummer": 53450,
   "Latitud": 55.6405,
   "Longitud": 13.683,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hörby A",
   "Stationsnummer": 53530,
   "Latitud": 55.8633,
   "Longitud": 13.6689,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stehag",
   "Stationsnummer": 53540,
   "Latitud": 55.8814,
   "Longitud": 13.4424,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Knopparp D",
   "Stationsnummer": 53570,
   "Latitud": 55.9299,
   "Longitud": 13.8491,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skillinge A",
   "Stationsnummer": 54290,
   "Latitud": 55.4889,
   "Longitud": 14.3172,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bollerup",
   "Stationsnummer": 54300,
   "Latitud": 55.4907,
   "Longitud": 14.0476,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stiby",
   "Stationsnummer": 54340,
   "Latitud": 55.5629,
   "Longitud": 14.191,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Brösarp D",
   "Stationsnummer": 54410,
   "Latitud": 55.7206,
   "Longitud": 14.1049,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Degeberga D",
   "Stationsnummer": 54480,
   "Latitud": 55.7965,
   "Longitud": 14.1668,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Helsingborg 2",
   "Stationsnummer": 62020,
   "Latitud": 56.0261,
   "Longitud": 12.7432,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Helsingborg A",
   "Stationsnummer": 62040,
   "Latitud": 56.0304,
   "Longitud": 12.7653,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tånga",
   "Stationsnummer": 62120,
   "Latitud": 56.2013,
   "Longitud": 12.7782,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Munka-Ljungby D",
   "Stationsnummer": 62130,
   "Latitud": 56.2225,
   "Longitud": 12.996,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nyhamnsläge",
   "Stationsnummer": 62140,
   "Latitud": 56.2451,
   "Longitud": 12.5438,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Louisefred",
   "Stationsnummer": 62150,
   "Latitud": 56.242,
   "Longitud": 12.5778,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Baramossa",
   "Stationsnummer": 62220,
   "Latitud": 56.384,
   "Longitud": 12.9839,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hallands Väderö A",
   "Stationsnummer": 62260,
   "Latitud": 56.4495,
   "Longitud": 12.547,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hov",
   "Stationsnummer": 62270,
   "Latitud": 56.4498,
   "Longitud": 12.7033,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Laholm D",
   "Stationsnummer": 62300,
   "Latitud": 56.4946,
   "Longitud": 12.989,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Halmstad",
   "Stationsnummer": 62400,
   "Latitud": 56.6737,
   "Longitud": 12.9242,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Eftra D",
   "Stationsnummer": 62510,
   "Latitud": 56.8584,
   "Longitud": 12.6475,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gillastig",
   "Stationsnummer": 63010,
   "Latitud": 56.0147,
   "Longitud": 13.2334,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Klippan",
   "Stationsnummer": 63070,
   "Latitud": 56.1391,
   "Longitud": 13.2516,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hästveda Mo",
   "Stationsnummer": 63160,
   "Latitud": 56.2799,
   "Longitud": 13.9432,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Örkelljunga",
   "Stationsnummer": 63170,
   "Latitud": 56.2829,
   "Longitud": 13.3002,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bjärnum D",
   "Stationsnummer": 63180,
   "Latitud": 56.2907,
   "Longitud": 13.7464,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Osby",
   "Stationsnummer": 63220,
   "Latitud": 56.3742,
   "Longitud": 13.9376,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Markaryd",
   "Stationsnummer": 63280,
   "Latitud": 56.4595,
   "Longitud": 13.6191,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Knäred D",
   "Stationsnummer": 63320,
   "Latitud": 56.5218,
   "Longitud": 13.3364,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Marbäck D",
   "Stationsnummer": 63410,
   "Latitud": 56.7001,
   "Longitud": 13.0332,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vrå D",
   "Stationsnummer": 63430,
   "Latitud": 56.7361,
   "Longitud": 13.454,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ljungby D",
   "Stationsnummer": 63500,
   "Latitud": 56.8099,
   "Longitud": 13.9694,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ljungby A",
   "Stationsnummer": 63510,
   "Latitud": 56.8526,
   "Longitud": 13.8822,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bakarebo D",
   "Stationsnummer": 63550,
   "Latitud": 56.9029,
   "Longitud": 13.696,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Torup A",
   "Stationsnummer": 63590,
   "Latitud": 56.9496,
   "Longitud": 13.0625,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lidhult D",
   "Stationsnummer": 63670,
   "Latitud": 56.828,
   "Longitud": 13.4502,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tosteberga",
   "Stationsnummer": 64010,
   "Latitud": 56.0094,
   "Longitud": 14.4429,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hanö A",
   "Stationsnummer": 64020,
   "Latitud": 56.0131,
   "Longitud": 14.8488,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kristianstad",
   "Stationsnummer": 64030,
   "Latitud": 56.0133,
   "Longitud": 14.2896,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bromölla",
   "Stationsnummer": 64070,
   "Latitud": 56.0642,
   "Longitud": 14.4783,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norra Ströö",
   "Stationsnummer": 64080,
   "Latitud": 56.1049,
   "Longitud": 14.0173,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Karlshamn",
   "Stationsnummer": 64130,
   "Latitud": 56.1813,
   "Longitud": 14.8517,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Olofström",
   "Stationsnummer": 64170,
   "Latitud": 56.2773,
   "Longitud": 14.5177,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Olastorp",
   "Stationsnummer": 64250,
   "Latitud": 56.4188,
   "Longitud": 14.3546,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tingsryd-Degerhaga",
   "Stationsnummer": 64320,
   "Latitud": 56.5376,
   "Longitud": 14.9019,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Pjätteryd",
   "Stationsnummer": 64380,
   "Latitud": 56.6199,
   "Longitud": 14.0229,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hyltan",
   "Stationsnummer": 64410,
   "Latitud": 56.6815,
   "Longitud": 14.3358,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Växjö A",
   "Stationsnummer": 64510,
   "Latitud": 56.8464,
   "Longitud": 14.8324,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Växjö D",
   "Stationsnummer": 64520,
   "Latitud": 56.8811,
   "Longitud": 14.8289,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Åby",
   "Stationsnummer": 64550,
   "Latitud": 56.9152,
   "Longitud": 14.0141,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Räfsebo D",
   "Stationsnummer": 64590,
   "Latitud": 56.9857,
   "Longitud": 14.2124,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Karlskrona-Söderstjerna Mo",
   "Stationsnummer": 65090,
   "Latitud": 56.1498,
   "Longitud": 15.5921,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lyckeby",
   "Stationsnummer": 65120,
   "Latitud": 56.2141,
   "Longitud": 15.7106,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ronneby-Bredåkra",
   "Stationsnummer": 65160,
   "Latitud": 56.2619,
   "Longitud": 15.2742,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bredåkra D",
   "Stationsnummer": 65170,
   "Latitud": 56.2523,
   "Longitud": 15.2548,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Fridlevstad D",
   "Stationsnummer": 65180,
   "Latitud": 56.2596,
   "Longitud": 15.5362,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Torsås",
   "Stationsnummer": 65250,
   "Latitud": 56.4112,
   "Longitud": 15.988,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Eringsboda D",
   "Stationsnummer": 65260,
   "Latitud": 56.4459,
   "Longitud": 15.3663,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Emmaboda D",
   "Stationsnummer": 65360,
   "Latitud": 56.5977,
   "Longitud": 15.5347,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stångsmåla D",
   "Stationsnummer": 65370,
   "Latitud": 56.6105,
   "Longitud": 15.138,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nybro-Slättingebygd D",
   "Stationsnummer": 65440,
   "Latitud": 56.8507,
   "Longitud": 15.9918,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lessebo",
   "Stationsnummer": 65450,
   "Latitud": 56.7379,
   "Longitud": 15.3495,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Orrefors D",
   "Stationsnummer": 65500,
   "Latitud": 56.8216,
   "Longitud": 15.7009,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kosta Mo",
   "Stationsnummer": 65510,
   "Latitud": 56.8403,
   "Longitud": 15.47,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hinshult",
   "Stationsnummer": 65580,
   "Latitud": 56.9703,
   "Longitud": 15.8768,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ölands Södra Udde A",
   "Stationsnummer": 66110,
   "Latitud": 56.1977,
   "Longitud": 16.4036,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Komstorp",
   "Stationsnummer": 66170,
   "Latitud": 56.2774,
   "Longitud": 16.0197,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Trolleboda D",
   "Stationsnummer": 66180,
   "Latitud": 56.3008,
   "Longitud": 16.0355,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Segerstad",
   "Stationsnummer": 66220,
   "Latitud": 56.3689,
   "Longitud": 16.5444,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kastlösa",
   "Stationsnummer": 66260,
   "Latitud": 56.4323,
   "Longitud": 16.4213,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norra Möckleby D",
   "Stationsnummer": 66380,
   "Latitud": 56.6332,
   "Longitud": 16.6703,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kalmar D",
   "Stationsnummer": 66430,
   "Latitud": 56.6622,
   "Longitud": 16.282,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bjärby D",
   "Stationsnummer": 66440,
   "Latitud": 56.7126,
   "Longitud": 16.708,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skedemosse D",
   "Stationsnummer": 66500,
   "Latitud": 56.807,
   "Longitud": 16.7426,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hoburg D",
   "Stationsnummer": 68550,
   "Latitud": 56.922,
   "Longitud": 18.1504,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hoburg A",
   "Stationsnummer": 68560,
   "Latitud": 56.9213,
   "Longitud": 18.1541,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nidingen A",
   "Stationsnummer": 71190,
   "Latitud": 57.304,
   "Longitud": 11.9064,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Onsala D",
   "Stationsnummer": 71230,
   "Latitud": 57.3847,
   "Longitud": 11.9749,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vinga A",
   "Stationsnummer": 71380,
   "Latitud": 57.6324,
   "Longitud": 11.6077,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Göteborg A",
   "Stationsnummer": 71420,
   "Latitud": 57.7157,
   "Longitud": 11.9925,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kärna",
   "Stationsnummer": 71510,
   "Latitud": 57.8403,
   "Longitud": 11.8086,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Varberg",
   "Stationsnummer": 72080,
   "Latitud": 57.1084,
   "Longitud": 12.2741,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ullared A",
   "Stationsnummer": 72090,
   "Latitud": 57.1136,
   "Longitud": 12.7758,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Källsjö",
   "Stationsnummer": 72140,
   "Latitud": 57.2323,
   "Longitud": 12.7042,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Veddige D",
   "Stationsnummer": 72170,
   "Latitud": 57.2618,
   "Longitud": 12.3228,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Linhult D",
   "Stationsnummer": 72180,
   "Latitud": 57.2949,
   "Longitud": 12.6906,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Fotskäl D",
   "Stationsnummer": 72210,
   "Latitud": 57.4382,
   "Longitud": 12.4135,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rossared D",
   "Stationsnummer": 72300,
   "Latitud": 57.485,
   "Longitud": 12.1997,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Grebbeshult",
   "Stationsnummer": 72330,
   "Latitud": 57.5413,
   "Longitud": 12.463,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Horred",
   "Stationsnummer": 72350,
   "Latitud": 57.3747,
   "Longitud": 12.4526,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kållered D",
   "Stationsnummer": 72360,
   "Latitud": 57.6095,
   "Longitud": 12.0673,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Häggårda",
   "Stationsnummer": 72370,
   "Latitud": 57.6149,
   "Longitud": 12.9451,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bollebygd",
   "Stationsnummer": 72400,
   "Latitud": 57.6381,
   "Longitud": 12.6335,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Borås",
   "Stationsnummer": 72450,
   "Latitud": 57.7611,
   "Longitud": 12.9493,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mollsjönäs D",
   "Stationsnummer": 72530,
   "Latitud": 57.8638,
   "Longitud": 12.1399,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sätila",
   "Stationsnummer": 72540,
   "Latitud": 57.5467,
   "Longitud": 12.438,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Alingsås D",
   "Stationsnummer": 72560,
   "Latitud": 57.8898,
   "Longitud": 12.552,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Askim D",
   "Stationsnummer": 72620,
   "Latitud": 57.6283,
   "Longitud": 11.9613,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Härryda",
   "Stationsnummer": 72680,
   "Latitud": 57.6865,
   "Longitud": 12.2986,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Åminne D",
   "Stationsnummer": 73060,
   "Latitud": 57.1232,
   "Longitud": 13.9547,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skeppshult D",
   "Stationsnummer": 73070,
   "Latitud": 57.1215,
   "Longitud": 13.4056,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Reftele D",
   "Stationsnummer": 73080,
   "Latitud": 57.1691,
   "Longitud": 13.6002,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kävsjö D",
   "Stationsnummer": 73200,
   "Latitud": 57.3222,
   "Longitud": 13.9264,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sjötofta D",
   "Stationsnummer": 73210,
   "Latitud": 57.3848,
   "Longitud": 13.2974,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hid D",
   "Stationsnummer": 73220,
   "Latitud": 57.3658,
   "Longitud": 13.0486,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hestra D",
   "Stationsnummer": 73230,
   "Latitud": 57.4669,
   "Longitud": 13.6319,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kindsboda",
   "Stationsnummer": 73330,
   "Latitud": 57.5559,
   "Longitud": 13.2825,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ulricehamn",
   "Stationsnummer": 73470,
   "Latitud": 57.8052,
   "Longitud": 13.4083,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rångedala A",
   "Stationsnummer": 73480,
   "Latitud": 57.7848,
   "Longitud": 13.1668,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mullsjö D",
   "Stationsnummer": 73560,
   "Latitud": 57.9246,
   "Longitud": 13.8806,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sandhem",
   "Stationsnummer": 73580,
   "Latitud": 57.9657,
   "Longitud": 13.7804,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Moheda D",
   "Stationsnummer": 74000,
   "Latitud": 57.0064,
   "Longitud": 14.5712,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Söraby",
   "Stationsnummer": 74030,
   "Latitud": 57.0345,
   "Longitud": 14.9446,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Berg",
   "Stationsnummer": 74080,
   "Latitud": 57.121,
   "Longitud": 14.6931,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rörvik D",
   "Stationsnummer": 74150,
   "Latitud": 57.2377,
   "Longitud": 14.5751,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hagshult Mo",
   "Stationsnummer": 74180,
   "Latitud": 57.2926,
   "Longitud": 14.1399,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nävelsjö",
   "Stationsnummer": 74240,
   "Latitud": 57.4397,
   "Longitud": 14.8863,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sävsjö",
   "Stationsnummer": 74250,
   "Latitud": 57.3813,
   "Longitud": 14.6579,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skillingaryd",
   "Stationsnummer": 74270,
   "Latitud": 57.4302,
   "Longitud": 14.1004,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tomtabacken A",
   "Stationsnummer": 74300,
   "Latitud": 57.4983,
   "Longitud": 14.4672,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malmbäck D",
   "Stationsnummer": 74360,
   "Latitud": 57.5985,
   "Longitud": 14.5206,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Flahult",
   "Stationsnummer": 74420,
   "Latitud": 57.6898,
   "Longitud": 14.1455,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Prästkulla",
   "Stationsnummer": 74440,
   "Latitud": 57.7242,
   "Longitud": 14.986,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Jönköpings Flygplats",
   "Stationsnummer": 74460,
   "Latitud": 57.7514,
   "Longitud": 14.0733,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Huskvarna",
   "Stationsnummer": 74480,
   "Latitud": 57.7865,
   "Longitud": 14.2874,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ramsjöholm",
   "Stationsnummer": 74490,
   "Latitud": 57.8429,
   "Longitud": 14.4317,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nobynäs D",
   "Stationsnummer": 74540,
   "Latitud": 57.911,
   "Longitud": 14.7985,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Älghult",
   "Stationsnummer": 75010,
   "Latitud": 57.0142,
   "Longitud": 15.5703,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Fagerhult D",
   "Stationsnummer": 75090,
   "Latitud": 57.1107,
   "Longitud": 15.6415,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Korsberga",
   "Stationsnummer": 75180,
   "Latitud": 57.3101,
   "Longitud": 15.2425,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Virserum-Rödmossa",
   "Stationsnummer": 75190,
   "Latitud": 57.2931,
   "Longitud": 15.5695,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Målilla A",
   "Stationsnummer": 75250,
   "Latitud": 57.3848,
   "Longitud": 15.8037,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ungsberg",
   "Stationsnummer": 75310,
   "Latitud": 57.5103,
   "Longitud": 15.919,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Värne",
   "Stationsnummer": 75340,
   "Latitud": 57.5388,
   "Longitud": 15.1002,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hässleby D",
   "Stationsnummer": 75380,
   "Latitud": 57.6104,
   "Longitud": 15.5776,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Södra Vi D",
   "Stationsnummer": 75430,
   "Latitud": 57.7174,
   "Longitud": 15.7092,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Svinhult D",
   "Stationsnummer": 75450,
   "Latitud": 57.7471,
   "Longitud": 15.3914,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Horn A",
   "Stationsnummer": 75520,
   "Latitud": 57.8863,
   "Longitud": 15.8652,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norra Vi D",
   "Stationsnummer": 75540,
   "Latitud": 57.8831,
   "Longitud": 15.3286,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kisa D",
   "Stationsnummer": 75590,
   "Latitud": 57.9845,
   "Longitud": 15.6349,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mönsterås D",
   "Stationsnummer": 76020,
   "Latitud": 57.0271,
   "Longitud": 16.5057,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Löttorp D",
   "Stationsnummer": 76080,
   "Latitud": 57.1555,
   "Longitud": 16.9502,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Oskarshamn",
   "Stationsnummer": 76160,
   "Latitud": 57.2674,
   "Longitud": 16.4149,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Krokshult D",
   "Stationsnummer": 76230,
   "Latitud": 57.3853,
   "Longitud": 16.0976,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kråkemåla",
   "Stationsnummer": 76280,
   "Latitud": 57.4694,
   "Longitud": 16.6538,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ankarsrum D",
   "Stationsnummer": 76410,
   "Latitud": 57.6783,
   "Longitud": 16.1931,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gladhammar A",
   "Stationsnummer": 76420,
   "Latitud": 57.7071,
   "Longitud": 16.4585,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hellerö",
   "Stationsnummer": 76570,
   "Latitud": 57.9545,
   "Longitud": 16.6513,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ölands Norra Udde A",
   "Stationsnummer": 77210,
   "Latitud": 57.3672,
   "Longitud": 17.0986,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ölands Norra Udde",
   "Stationsnummer": 77220,
   "Latitud": 57.3689,
   "Longitud": 17.1008,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Burs D",
   "Stationsnummer": 78130,
   "Latitud": 57.2265,
   "Longitud": 18.5617,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hemse",
   "Stationsnummer": 78140,
   "Latitud": 57.2438,
   "Longitud": 18.3835,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ljugarn D",
   "Stationsnummer": 78190,
   "Latitud": 57.3301,
   "Longitud": 18.7104,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vänge",
   "Stationsnummer": 78230,
   "Latitud": 57.4348,
   "Longitud": 18.486,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sanda",
   "Stationsnummer": 78270,
   "Latitud": 57.4255,
   "Longitud": 18.2118,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Östergarnsholm A",
   "Stationsnummer": 78280,
   "Latitud": 57.4413,
   "Longitud": 18.9871,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mästerby",
   "Stationsnummer": 78320,
   "Latitud": 57.473,
   "Longitud": 18.2739,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Visby D",
   "Stationsnummer": 78390,
   "Latitud": 57.6477,
   "Longitud": 18.3494,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Visby Flygplats",
   "Stationsnummer": 78400,
   "Latitud": 57.6614,
   "Longitud": 18.3428,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hejnum",
   "Stationsnummer": 78420,
   "Latitud": 57.6954,
   "Longitud": 18.6377,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Austers D",
   "Stationsnummer": 78480,
   "Latitud": 57.8103,
   "Longitud": 18.6335,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Fårö D",
   "Stationsnummer": 79580,
   "Latitud": 57.9548,
   "Longitud": 19.2459,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rörastrand",
   "Stationsnummer": 81040,
   "Latitud": 58.0582,
   "Longitud": 11.6528,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Måseskär A",
   "Stationsnummer": 81050,
   "Latitud": 58.094,
   "Longitud": 11.3333,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Henån",
   "Stationsnummer": 81140,
   "Latitud": 58.2327,
   "Longitud": 11.6826,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lysekil D",
   "Stationsnummer": 81170,
   "Latitud": 58.2713,
   "Longitud": 11.4321,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Uddevalla D",
   "Stationsnummer": 81210,
   "Latitud": 58.3703,
   "Longitud": 11.9364,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Heden",
   "Stationsnummer": 81310,
   "Latitud": 58.5185,
   "Longitud": 11.5248,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Grebbestad",
   "Stationsnummer": 81420,
   "Latitud": 58.6933,
   "Longitud": 11.2485,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nordkoster A",
   "Stationsnummer": 81540,
   "Latitud": 58.8925,
   "Longitud": 11.0062,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ed D",
   "Stationsnummer": 81550,
   "Latitud": 58.9102,
   "Longitud": 11.7723,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Håvelund",
   "Stationsnummer": 81570,
   "Latitud": 58.946,
   "Longitud": 11.4414,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vårgårda D",
   "Stationsnummer": 82020,
   "Latitud": 58.024,
   "Longitud": 12.856,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Komperöd",
   "Stationsnummer": 82040,
   "Latitud": 58.06,
   "Longitud": 12.0109,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Uplo",
   "Stationsnummer": 82060,
   "Latitud": 58.1001,
   "Longitud": 12.6568,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gendalen",
   "Stationsnummer": 82110,
   "Latitud": 58.1589,
   "Longitud": 12.647,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Trökörna",
   "Stationsnummer": 82160,
   "Latitud": 58.2686,
   "Longitud": 12.6554,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vänersborg",
   "Stationsnummer": 82230,
   "Latitud": 58.3552,
   "Longitud": 12.3616,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Såtenäs",
   "Stationsnummer": 82260,
   "Latitud": 58.4358,
   "Longitud": 12.7075,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kroppefjäll-Granan A",
   "Stationsnummer": 82360,
   "Latitud": 58.6068,
   "Longitud": 12.1999,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Erikstad",
   "Stationsnummer": 82380,
   "Latitud": 58.602,
   "Longitud": 12.4447,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bäckefors",
   "Stationsnummer": 82490,
   "Latitud": 58.8055,
   "Longitud": 12.1581,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ånimskog",
   "Stationsnummer": 82530,
   "Latitud": 58.8746,
   "Longitud": 12.5913,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Herrljunga D",
   "Stationsnummer": 83060,
   "Latitud": 58.0862,
   "Longitud": 13.0485,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Falköping-Valtorp D",
   "Stationsnummer": 83090,
   "Latitud": 58.2363,
   "Longitud": 13.6332,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tidaholm D",
   "Stationsnummer": 83110,
   "Latitud": 58.1806,
   "Longitud": 13.9829,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vedum",
   "Stationsnummer": 83150,
   "Latitud": 58.1536,
   "Longitud": 13.0388,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hällum A",
   "Stationsnummer": 83190,
   "Latitud": 58.3221,
   "Longitud": 13.0406,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lanna",
   "Stationsnummer": 83210,
   "Latitud": 58.3476,
   "Longitud": 13.1296,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kilagården",
   "Stationsnummer": 83220,
   "Latitud": 58.3565,
   "Longitud": 13.2537,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skövde",
   "Stationsnummer": 83230,
   "Latitud": 58.3949,
   "Longitud": 13.8436,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skara",
   "Stationsnummer": 83270,
   "Latitud": 58.4072,
   "Longitud": 13.4407,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Remningstorp",
   "Stationsnummer": 83280,
   "Latitud": 58.4529,
   "Longitud": 13.6671,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lidköping",
   "Stationsnummer": 83320,
   "Latitud": 58.4835,
   "Longitud": 13.1479,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Traneberg",
   "Stationsnummer": 83400,
   "Latitud": 58.6607,
   "Longitud": 13.1507,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Naven A",
   "Stationsnummer": 83420,
   "Latitud": 58.6998,
   "Longitud": 13.1109,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mariestad",
   "Stationsnummer": 83440,
   "Latitud": 58.7136,
   "Longitud": 13.823,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Värmlandsnäs-Ekenäs D",
   "Stationsnummer": 83550,
   "Latitud": 58.8973,
   "Longitud": 13.2384,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Högemålen D",
   "Stationsnummer": 84040,
   "Latitud": 58.0563,
   "Longitud": 14.5956,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Visingsö A",
   "Stationsnummer": 84050,
   "Latitud": 58.0951,
   "Longitud": 14.4086,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ödeshög D",
   "Stationsnummer": 84140,
   "Latitud": 58.2546,
   "Longitud": 14.6584,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hjo",
   "Stationsnummer": 84180,
   "Latitud": 58.3202,
   "Longitud": 14.3332,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Djursätra",
   "Stationsnummer": 84200,
   "Latitud": 58.3286,
   "Longitud": 14.0637,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Omberg D",
   "Stationsnummer": 84220,
   "Latitud": 58.3564,
   "Longitud": 14.6969,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vadstena D",
   "Stationsnummer": 84270,
   "Latitud": 58.45,
   "Longitud": 14.8918,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Karlsborg Mo",
   "Stationsnummer": 84310,
   "Latitud": 58.514,
   "Longitud": 14.5102,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Axstål Mo",
   "Stationsnummer": 84340,
   "Latitud": 58.5719,
   "Longitud": 14.5722,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Fägre D",
   "Stationsnummer": 84390,
   "Latitud": 58.6444,
   "Longitud": 14.0659,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Älgarås D",
   "Stationsnummer": 84470,
   "Latitud": 58.7906,
   "Longitud": 14.3188,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sörbytorp",
   "Stationsnummer": 84490,
   "Latitud": 58.8121,
   "Longitud": 14.6526,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gårdsjö A",
   "Stationsnummer": 84520,
   "Latitud": 58.8772,
   "Longitud": 14.3903,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gullspång",
   "Stationsnummer": 84590,
   "Latitud": 58.9863,
   "Longitud": 14.1101,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malexander A",
   "Stationsnummer": 85050,
   "Latitud": 58.0718,
   "Longitud": 15.2359,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ulrika",
   "Stationsnummer": 85070,
   "Latitud": 58.1282,
   "Longitud": 15.4353,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Boxholm D",
   "Stationsnummer": 85120,
   "Latitud": 58.2048,
   "Longitud": 15.0215,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Härsnäs",
   "Stationsnummer": 85180,
   "Latitud": 58.2886,
   "Longitud": 15.237,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sya",
   "Stationsnummer": 85200,
   "Latitud": 58.325,
   "Longitud": 15.2247,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malmslätt",
   "Stationsnummer": 85240,
   "Latitud": 58.4004,
   "Longitud": 15.5327,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Linköping D",
   "Stationsnummer": 85250,
   "Latitud": 58.4214,
   "Longitud": 15.7372,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skärkind D",
   "Stationsnummer": 85280,
   "Latitud": 58.4855,
   "Longitud": 16.002,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Motala",
   "Stationsnummer": 85330,
   "Latitud": 58.5539,
   "Longitud": 15.0145,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vånga D",
   "Stationsnummer": 85350,
   "Latitud": 58.588,
   "Longitud": 15.8142,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kvarn Mo",
   "Stationsnummer": 85390,
   "Latitud": 58.6277,
   "Longitud": 15.4372,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Finspång",
   "Stationsnummer": 85430,
   "Latitud": 58.7017,
   "Longitud": 15.779,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tjällmo D",
   "Stationsnummer": 85440,
   "Latitud": 58.7417,
   "Longitud": 15.3735,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Godegård D",
   "Stationsnummer": 85450,
   "Latitud": 58.7564,
   "Longitud": 15.1076,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kettstaka A",
   "Stationsnummer": 85460,
   "Latitud": 58.7165,
   "Longitud": 15.03,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Zinkgruvan",
   "Stationsnummer": 85490,
   "Latitud": 58.8063,
   "Longitud": 15.1285,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Regna D",
   "Stationsnummer": 85530,
   "Latitud": 58.8595,
   "Longitud": 15.6973,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hjortkvarn D",
   "Stationsnummer": 85540,
   "Latitud": 58.9313,
   "Longitud": 15.4479,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tyllinge D",
   "Stationsnummer": 86010,
   "Latitud": 58.0207,
   "Longitud": 16.0824,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tryserum D",
   "Stationsnummer": 86060,
   "Latitud": 58.1024,
   "Longitud": 16.7213,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Holmbo D",
   "Stationsnummer": 86120,
   "Latitud": 58.1944,
   "Longitud": 16.3635,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Börrum D",
   "Stationsnummer": 86220,
   "Latitud": 58.3521,
   "Longitud": 16.6256,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gustorp D",
   "Stationsnummer": 86260,
   "Latitud": 58.4223,
   "Longitud": 16.1351,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Söderköping D",
   "Stationsnummer": 86290,
   "Latitud": 58.5018,
   "Longitud": 16.2834,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Östra Husby D",
   "Stationsnummer": 86320,
   "Latitud": 58.5373,
   "Longitud": 16.5655,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hult D",
   "Stationsnummer": 86410,
   "Latitud": 58.6756,
   "Longitud": 16.1313,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kolmården-Strömsfors A",
   "Stationsnummer": 86420,
   "Latitud": 58.6894,
   "Longitud": 16.3103,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Björkvik D",
   "Stationsnummer": 86500,
   "Latitud": 58.8205,
   "Longitud": 16.4998,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Glindran",
   "Stationsnummer": 86510,
   "Latitud": 58.8427,
   "Longitud": 16.419,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vrena",
   "Stationsnummer": 86520,
   "Latitud": 58.8741,
   "Longitud": 16.6841,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Harstena A",
   "Stationsnummer": 87140,
   "Latitud": 58.2505,
   "Longitud": 17.0106,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Oxelösund",
   "Stationsnummer": 87400,
   "Latitud": 58.6777,
   "Longitud": 17.1223,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Landsort A",
   "Stationsnummer": 87440,
   "Latitud": 58.7433,
   "Longitud": 17.8716,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Landsort",
   "Stationsnummer": 87450,
   "Latitud": 58.743,
   "Longitud": 17.8699,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tystberga D",
   "Stationsnummer": 87490,
   "Latitud": 58.8236,
   "Longitud": 17.3318,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nynäshamn",
   "Stationsnummer": 87570,
   "Latitud": 58.9217,
   "Longitud": 17.9248,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Åda",
   "Stationsnummer": 87580,
   "Latitud": 58.9279,
   "Longitud": 17.5358,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sjögärde",
   "Stationsnummer": 87590,
   "Latitud": 58.9752,
   "Longitud": 17.8411,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Aspa D",
   "Stationsnummer": 87600,
   "Latitud": 58.9277,
   "Longitud": 17.1048,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vagnhärad D",
   "Stationsnummer": 87610,
   "Latitud": 58.9413,
   "Longitud": 17.4615,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gotska Sandön A",
   "Stationsnummer": 89230,
   "Latitud": 58.3943,
   "Longitud": 19.1975,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Töcksfors D",
   "Stationsnummer": 91330,
   "Latitud": 59.5468,
   "Longitud": 11.8397,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bengtsfors D",
   "Stationsnummer": 92040,
   "Latitud": 59.0459,
   "Longitud": 12.2326,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Säffle",
   "Stationsnummer": 92100,
   "Latitud": 59.1412,
   "Longitud": 12.9359,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Svaneholm D",
   "Stationsnummer": 92120,
   "Latitud": 59.1744,
   "Longitud": 12.501,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Blomskog A",
   "Stationsnummer": 92130,
   "Latitud": 59.2217,
   "Longitud": 12.078,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sölje D",
   "Stationsnummer": 92290,
   "Latitud": 59.4846,
   "Longitud": 12.6959,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Årjäng",
   "Stationsnummer": 92380,
   "Latitud": 59.3833,
   "Longitud": 12.139,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Arvika A",
   "Stationsnummer": 92410,
   "Latitud": 59.6747,
   "Longitud": 12.6381,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Charlottenberg",
   "Stationsnummer": 92530,
   "Latitud": 59.8875,
   "Longitud": 12.3039,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Uddheden D",
   "Stationsnummer": 92570,
   "Latitud": 59.9437,
   "Longitud": 12.9134,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Grums",
   "Stationsnummer": 93200,
   "Latitud": 59.3499,
   "Longitud": 13.1107,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Väse D",
   "Stationsnummer": 93210,
   "Latitud": 59.3675,
   "Longitud": 13.8534,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Karlstad Flygplats",
   "Stationsnummer": 93220,
   "Latitud": 59.4446,
   "Longitud": 13.3374,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gräsås D",
   "Stationsnummer": 93310,
   "Latitud": 59.5271,
   "Longitud": 13.9389,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Högboda",
   "Stationsnummer": 93350,
   "Latitud": 59.5762,
   "Longitud": 13.0279,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Dejefors",
   "Stationsnummer": 93370,
   "Latitud": 59.6082,
   "Longitud": 13.4776,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Östra Ämtervik",
   "Stationsnummer": 93440,
   "Latitud": 59.7406,
   "Longitud": 13.2136,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Munkfors",
   "Stationsnummer": 93500,
   "Latitud": 59.8482,
   "Longitud": 13.5415,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sunne A",
   "Stationsnummer": 93520,
   "Latitud": 59.8644,
   "Longitud": 13.1193,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Åtorp",
   "Stationsnummer": 94050,
   "Latitud": 59.0966,
   "Longitud": 14.3678,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Degerfors D",
   "Stationsnummer": 94140,
   "Latitud": 59.1903,
   "Longitud": 14.3891,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kristinehamn",
   "Stationsnummer": 94180,
   "Latitud": 59.3107,
   "Longitud": 14.1019,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kilsbergen-Suttarboda A",
   "Stationsnummer": 94190,
   "Latitud": 59.3,
   "Longitud": 14.8986,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Karlskoga",
   "Stationsnummer": 94200,
   "Latitud": 59.3291,
   "Longitud": 14.5538,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Daglösen A",
   "Stationsnummer": 94390,
   "Latitud": 59.6616,
   "Longitud": 14.1831,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Grythyttan",
   "Stationsnummer": 94420,
   "Latitud": 59.7113,
   "Longitud": 14.5301,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Persberg",
   "Stationsnummer": 94450,
   "Latitud": 59.7494,
   "Longitud": 14.2582,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Silvergruvan",
   "Stationsnummer": 94510,
   "Latitud": 59.8482,
   "Longitud": 14.479,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ställdalen",
   "Stationsnummer": 94580,
   "Latitud": 59.9391,
   "Longitud": 14.891,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lesjöfors D",
   "Stationsnummer": 94590,
   "Latitud": 59.9785,
   "Longitud": 14.1799,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vingåker D",
   "Stationsnummer": 95030,
   "Latitud": 59.0199,
   "Longitud": 15.981,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Asker D",
   "Stationsnummer": 95100,
   "Latitud": 59.1594,
   "Longitud": 15.4673,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Örebro A",
   "Stationsnummer": 95130,
   "Latitud": 59.2289,
   "Longitud": 15.0455,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Örebro D",
   "Stationsnummer": 95160,
   "Latitud": 59.2584,
   "Longitud": 15.2586,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ön",
   "Stationsnummer": 95240,
   "Latitud": 59.4033,
   "Longitud": 15.1946,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Västvalla",
   "Stationsnummer": 95250,
   "Latitud": 59.417,
   "Longitud": 15.6145,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nora D",
   "Stationsnummer": 95300,
   "Latitud": 59.5059,
   "Longitud": 15.0347,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Spannarboda D",
   "Stationsnummer": 95340,
   "Latitud": 59.5801,
   "Longitud": 15.502,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kolsva D",
   "Stationsnummer": 95360,
   "Latitud": 59.5876,
   "Longitud": 15.9153,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Riddarhyttan",
   "Stationsnummer": 95490,
   "Latitud": 59.8089,
   "Longitud": 15.5391,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kopparberg D",
   "Stationsnummer": 95520,
   "Latitud": 59.8597,
   "Longitud": 15.0479,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kloten",
   "Stationsnummer": 95530,
   "Latitud": 59.8707,
   "Longitud": 15.2544,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kloten A",
   "Stationsnummer": 95540,
   "Latitud": 59.8709,
   "Longitud": 15.2553,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Frändesta",
   "Stationsnummer": 96010,
   "Latitud": 59.0115,
   "Longitud": 16.8803,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Floda A",
   "Stationsnummer": 96040,
   "Latitud": 59.0561,
   "Longitud": 16.3975,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sköldinge",
   "Stationsnummer": 96050,
   "Latitud": 59.0578,
   "Longitud": 16.4029,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Granhed D",
   "Stationsnummer": 96060,
   "Latitud": 59.1014,
   "Longitud": 16.4348,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hälleforsnäs D",
   "Stationsnummer": 96090,
   "Latitud": 59.1567,
   "Longitud": 16.5092,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Näshulta",
   "Stationsnummer": 96110,
   "Latitud": 59.1952,
   "Longitud": 16.2795,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Västermo",
   "Stationsnummer": 96170,
   "Latitud": 59.2748,
   "Longitud": 16.0885,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Eskilstuna A",
   "Stationsnummer": 96190,
   "Latitud": 59.3832,
   "Longitud": 16.4549,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hyndevad",
   "Stationsnummer": 96200,
   "Latitud": 59.3226,
   "Longitud": 16.4422,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Eskilstuna",
   "Stationsnummer": 96230,
   "Latitud": 59.3867,
   "Longitud": 16.4647,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Strängnäs-Vansö",
   "Stationsnummer": 96240,
   "Latitud": 59.3961,
   "Longitud": 16.9398,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lida D",
   "Stationsnummer": 96250,
   "Latitud": 59.3658,
   "Longitud": 16.0158,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Västerås",
   "Stationsnummer": 96350,
   "Latitud": 59.5977,
   "Longitud": 16.6034,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "ESOW",
   "Stationsnummer": 96356,
   "Latitud": 59.5888,
   "Longitud": 16.6299,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hallstaberg",
   "Stationsnummer": 96390,
   "Latitud": 59.6545,
   "Longitud": 16.7995,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skultuna",
   "Stationsnummer": 96440,
   "Latitud": 59.7141,
   "Longitud": 16.4362,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sala",
   "Stationsnummer": 96550,
   "Latitud": 59.9045,
   "Longitud": 16.6607,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sala A",
   "Stationsnummer": 96560,
   "Latitud": 59.9098,
   "Longitud": 16.6875,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gnesta",
   "Stationsnummer": 97030,
   "Latitud": 59.095,
   "Longitud": 17.321,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Wiad",
   "Stationsnummer": 97070,
   "Latitud": 59.1116,
   "Longitud": 17.7219,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tullinge A",
   "Stationsnummer": 97100,
   "Latitud": 59.1789,
   "Longitud": 17.9125,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Södertälje",
   "Stationsnummer": 97120,
   "Latitud": 59.2142,
   "Longitud": 17.6289,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norsborg II",
   "Stationsnummer": 97160,
   "Latitud": 59.2524,
   "Longitud": 17.7989,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mariefred",
   "Stationsnummer": 97170,
   "Latitud": 59.2661,
   "Longitud": 17.2342,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stockholm-Bromma",
   "Stationsnummer": 97200,
   "Latitud": 59.3537,
   "Longitud": 17.9513,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Adelsö A",
   "Stationsnummer": 97280,
   "Latitud": 59.3582,
   "Longitud": 17.5244,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ytterselö D",
   "Stationsnummer": 97290,
   "Latitud": 59.407,
   "Longitud": 17.2769,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sätra Gård",
   "Stationsnummer": 97320,
   "Latitud": 59.5339,
   "Longitud": 17.8446,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skjörby",
   "Stationsnummer": 97330,
   "Latitud": 59.5494,
   "Longitud": 17.3699,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hacksta",
   "Stationsnummer": 97350,
   "Latitud": 59.5546,
   "Longitud": 17.0521,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Enköping Mo",
   "Stationsnummer": 97370,
   "Latitud": 59.6557,
   "Longitud": 17.1121,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Enköping",
   "Stationsnummer": 97380,
   "Latitud": 59.6407,
   "Longitud": 17.0697,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Uppsala Aut",
   "Stationsnummer": 97510,
   "Latitud": 59.8586,
   "Longitud": 17.6253,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Uppsala",
   "Stationsnummer": 97520,
   "Latitud": 59.8585,
   "Longitud": 17.6252,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Uppsala Flygplats",
   "Stationsnummer": 97530,
   "Latitud": 59.8953,
   "Longitud": 17.5935,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vittinge",
   "Stationsnummer": 97540,
   "Latitud": 59.9007,
   "Longitud": 17.0263,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Berga Mo",
   "Stationsnummer": 98040,
   "Latitud": 59.0688,
   "Longitud": 18.1184,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Västerhaninge",
   "Stationsnummer": 98080,
   "Latitud": 59.1111,
   "Longitud": 18.1094,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Dalarö D",
   "Stationsnummer": 98090,
   "Latitud": 59.1342,
   "Longitud": 18.4142,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nämdö",
   "Stationsnummer": 98110,
   "Latitud": 59.1146,
   "Longitud": 18.4352,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stormyra",
   "Stationsnummer": 98140,
   "Latitud": 59.2032,
   "Longitud": 18.3308,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sandhamn D",
   "Stationsnummer": 98170,
   "Latitud": 59.2899,
   "Longitud": 18.9146,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Djurö D",
   "Stationsnummer": 98190,
   "Latitud": 59.307,
   "Longitud": 18.6937,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stockholm",
   "Stationsnummer": 98210,
   "Latitud": 59.342,
   "Longitud": 18.0575,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stockholm A",
   "Stationsnummer": 98230,
   "Latitud": 59.3421,
   "Longitud": 18.0577,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tranvik",
   "Stationsnummer": 98270,
   "Latitud": 59.4507,
   "Longitud": 18.5717,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vallentuna",
   "Stationsnummer": 98310,
   "Latitud": 59.519,
   "Longitud": 18.0779,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Svanberga A",
   "Stationsnummer": 98490,
   "Latitud": 59.8321,
   "Longitud": 18.6348,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norrveda",
   "Stationsnummer": 98500,
   "Latitud": 59.8298,
   "Longitud": 18.9524,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Almunge",
   "Stationsnummer": 98560,
   "Latitud": 59.9341,
   "Longitud": 18.0499,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vällnora D",
   "Stationsnummer": 98570,
   "Latitud": 59.9562,
   "Longitud": 18.3461,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Svenska Högarna",
   "Stationsnummer": 99270,
   "Latitud": 59.4445,
   "Longitud": 19.5059,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Svenska högarna A",
   "Stationsnummer": 99280,
   "Latitud": 59.4428,
   "Longitud": 19.5058,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Söderarm A",
   "Stationsnummer": 99450,
   "Latitud": 59.7538,
   "Longitud": 19.4089,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Östmark-Åsarna",
   "Stationsnummer": 102170,
   "Latitud": 60.2788,
   "Longitud": 12.8538,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kindsjön D",
   "Stationsnummer": 102400,
   "Latitud": 60.6591,
   "Longitud": 12.7103,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Letafors D",
   "Stationsnummer": 102440,
   "Latitud": 60.7397,
   "Longitud": 12.6989,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tåsan",
   "Stationsnummer": 102460,
   "Latitud": 60.7658,
   "Longitud": 12.8493,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Höljes",
   "Stationsnummer": 102540,
   "Latitud": 60.9066,
   "Longitud": 12.5843,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gustavsfors",
   "Stationsnummer": 103090,
   "Latitud": 60.1514,
   "Longitud": 13.7975,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gustavsfors A",
   "Stationsnummer": 103100,
   "Latitud": 60.1538,
   "Longitud": 13.8019,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Andersviksberg",
   "Stationsnummer": 103220,
   "Latitud": 60.3694,
   "Longitud": 13.8749,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stöllet D",
   "Stationsnummer": 103260,
   "Latitud": 60.411,
   "Longitud": 13.2693,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malung",
   "Stationsnummer": 103410,
   "Latitud": 60.6717,
   "Longitud": 13.7058,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malung A",
   "Stationsnummer": 103420,
   "Latitud": 60.6773,
   "Longitud": 13.71,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Öje D",
   "Stationsnummer": 103490,
   "Latitud": 60.8087,
   "Longitud": 13.8604,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Fredriksberg",
   "Stationsnummer": 104090,
   "Latitud": 60.1418,
   "Longitud": 14.2145,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sågen D",
   "Stationsnummer": 104150,
   "Latitud": 60.2616,
   "Longitud": 14.137,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nyhammar",
   "Stationsnummer": 104180,
   "Latitud": 60.2915,
   "Longitud": 14.9804,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mockfjärd D",
   "Stationsnummer": 104300,
   "Latitud": 60.5082,
   "Longitud": 14.959,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Dala-Järna D",
   "Stationsnummer": 104320,
   "Latitud": 60.56,
   "Longitud": 14.366,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gesunda D",
   "Stationsnummer": 104540,
   "Latitud": 60.8896,
   "Longitud": 14.5473,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mora A",
   "Stationsnummer": 104580,
   "Latitud": 60.9607,
   "Longitud": 14.507,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Söderbärke D",
   "Stationsnummer": 105040,
   "Latitud": 60.064,
   "Longitud": 15.5713,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norberg",
   "Stationsnummer": 105060,
   "Latitud": 60.0652,
   "Longitud": 15.9111,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ludvika",
   "Stationsnummer": 105100,
   "Latitud": 60.1415,
   "Longitud": 15.1759,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stora Spånsberget A",
   "Stationsnummer": 105220,
   "Latitud": 60.3822,
   "Longitud": 15.1404,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stora Skedvi",
   "Stationsnummer": 105250,
   "Latitud": 60.41,
   "Longitud": 15.7422,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Borlänge Flygplats",
   "Stationsnummer": 105260,
   "Latitud": 60.4294,
   "Longitud": 15.5079,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Borlänge D",
   "Stationsnummer": 105310,
   "Latitud": 60.492,
   "Longitud": 15.4274,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Falun-Lugnet",
   "Stationsnummer": 105370,
   "Latitud": 60.619,
   "Longitud": 15.6603,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hillersboda",
   "Stationsnummer": 105390,
   "Latitud": 60.7074,
   "Longitud": 15.9392,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Leksand",
   "Stationsnummer": 105450,
   "Latitud": 60.7256,
   "Longitud": 15.0167,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bjursås",
   "Stationsnummer": 105470,
   "Latitud": 60.7438,
   "Longitud": 15.4625,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tänger D",
   "Stationsnummer": 105500,
   "Latitud": 60.8149,
   "Longitud": 15.761,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Brovallen",
   "Stationsnummer": 106040,
   "Latitud": 60.0991,
   "Longitud": 16.3062,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Avesta",
   "Stationsnummer": 106070,
   "Latitud": 60.1419,
   "Longitud": 16.1747,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tärnsjö D",
   "Stationsnummer": 106120,
   "Latitud": 60.1321,
   "Longitud": 16.9483,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kerstinbo A",
   "Stationsnummer": 106160,
   "Latitud": 60.2688,
   "Longitud": 16.977,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Österfärnebo",
   "Stationsnummer": 106180,
   "Latitud": 60.3048,
   "Longitud": 16.805,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Långshyttan D",
   "Stationsnummer": 106280,
   "Latitud": 60.4612,
   "Longitud": 16.062,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Torsåker D",
   "Stationsnummer": 106290,
   "Latitud": 60.5022,
   "Longitud": 16.4813,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hofors",
   "Stationsnummer": 106330,
   "Latitud": 60.5403,
   "Longitud": 16.292,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gästrike-Hammarby D",
   "Stationsnummer": 106360,
   "Latitud": 60.5648,
   "Longitud": 16.586,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kungsberget D",
   "Stationsnummer": 106460,
   "Latitud": 60.7651,
   "Longitud": 16.4679,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ockelbo",
   "Stationsnummer": 106540,
   "Latitud": 60.8982,
   "Longitud": 16.7376,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Åmot A",
   "Stationsnummer": 106570,
   "Latitud": 60.962,
   "Longitud": 16.4311,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vattholma D",
   "Stationsnummer": 107010,
   "Latitud": 60.0289,
   "Longitud": 17.7243,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Björklinge D",
   "Stationsnummer": 107040,
   "Latitud": 60.0401,
   "Longitud": 17.5573,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Östervåla D",
   "Stationsnummer": 107100,
   "Latitud": 60.1744,
   "Longitud": 17.2298,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Films Kyrkby D",
   "Stationsnummer": 107130,
   "Latitud": 60.2357,
   "Longitud": 17.9072,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Films Kyrkby A",
   "Stationsnummer": 107140,
   "Latitud": 60.2363,
   "Longitud": 17.9078,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hedesunda",
   "Stationsnummer": 107230,
   "Latitud": 60.4058,
   "Longitud": 17.0221,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lövsta",
   "Stationsnummer": 107250,
   "Latitud": 60.4086,
   "Longitud": 17.884,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Älvkarleby D",
   "Stationsnummer": 107340,
   "Latitud": 60.5653,
   "Longitud": 17.4632,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gävle A",
   "Stationsnummer": 107420,
   "Latitud": 60.7166,
   "Longitud": 17.1641,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gävle-Åbyggeby",
   "Stationsnummer": 107430,
   "Latitud": 60.7285,
   "Longitud": 17.1132,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norrby S",
   "Stationsnummer": 108040,
   "Latitud": 60.0623,
   "Longitud": 18.7422,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Risinge",
   "Stationsnummer": 108110,
   "Latitud": 60.175,
   "Longitud": 18.2272,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Söderby-Karlsäng D",
   "Stationsnummer": 108180,
   "Latitud": 60.293,
   "Longitud": 18.4507,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Örskär A",
   "Stationsnummer": 108320,
   "Latitud": 60.5262,
   "Longitud": 18.3766,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Löten D",
   "Stationsnummer": 112020,
   "Latitud": 61.0255,
   "Longitud": 12.8399,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Storbron",
   "Stationsnummer": 112230,
   "Latitud": 61.3868,
   "Longitud": 12.8585,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gördalen D",
   "Stationsnummer": 112360,
   "Latitud": 61.5951,
   "Longitud": 12.5003,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Idre D",
   "Stationsnummer": 112520,
   "Latitud": 61.8591,
   "Longitud": 12.7286,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mångsbodarna",
   "Stationsnummer": 113050,
   "Latitud": 61.0804,
   "Longitud": 13.6189,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Trängslet",
   "Stationsnummer": 113230,
   "Latitud": 61.3804,
   "Longitud": 13.7273,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nornäs D",
   "Stationsnummer": 113260,
   "Latitud": 61.4306,
   "Longitud": 13.2296,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Särna D",
   "Stationsnummer": 113410,
   "Latitud": 61.6912,
   "Longitud": 13.1866,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Orsa D",
   "Stationsnummer": 114070,
   "Latitud": 61.1306,
   "Longitud": 14.638,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Våmhus D",
   "Stationsnummer": 114080,
   "Latitud": 61.1364,
   "Longitud": 14.42,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skattungbyn D",
   "Stationsnummer": 114120,
   "Latitud": 61.1988,
   "Longitud": 14.868,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Älvdalen A",
   "Stationsnummer": 114140,
   "Latitud": 61.2542,
   "Longitud": 14.0383,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ulvsjö",
   "Stationsnummer": 114360,
   "Latitud": 61.6022,
   "Longitud": 14.1847,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lillhamra D",
   "Stationsnummer": 114390,
   "Latitud": 61.642,
   "Longitud": 14.7998,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hamra A",
   "Stationsnummer": 114410,
   "Latitud": 61.6606,
   "Longitud": 14.9948,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Fågelsjö D",
   "Stationsnummer": 114480,
   "Latitud": 61.7984,
   "Longitud": 14.6477,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lillhärdal",
   "Stationsnummer": 114510,
   "Latitud": 61.8547,
   "Longitud": 14.0921,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Finnbacka D",
   "Stationsnummer": 115030,
   "Latitud": 61.0566,
   "Longitud": 15.5777,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Östanvik D",
   "Stationsnummer": 115100,
   "Latitud": 61.1684,
   "Longitud": 15.2223,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Edsbyn A",
   "Stationsnummer": 115220,
   "Latitud": 61.3613,
   "Longitud": 15.7175,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lobonäs D",
   "Stationsnummer": 115320,
   "Latitud": 61.5338,
   "Longitud": 15.3444,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Los D",
   "Stationsnummer": 115450,
   "Latitud": 61.7256,
   "Longitud": 15.1783,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Föne D",
   "Stationsnummer": 115500,
   "Latitud": 61.8302,
   "Longitud": 15.8253,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Härnebo",
   "Stationsnummer": 116070,
   "Latitud": 61.1326,
   "Longitud": 16.7458,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kilafors D",
   "Stationsnummer": 116150,
   "Latitud": 61.2489,
   "Longitud": 16.5572,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bergvik",
   "Stationsnummer": 116160,
   "Latitud": 61.2602,
   "Longitud": 16.835,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Söderala D",
   "Stationsnummer": 116170,
   "Latitud": 61.295,
   "Longitud": 16.9548,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bollnäs D",
   "Stationsnummer": 116250,
   "Latitud": 61.4173,
   "Longitud": 16.373,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Simeå",
   "Stationsnummer": 116340,
   "Latitud": 61.5706,
   "Longitud": 16.3277,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nianfors",
   "Stationsnummer": 116360,
   "Latitud": 61.6021,
   "Longitud": 16.7726,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Järvsö",
   "Stationsnummer": 116430,
   "Latitud": 61.7111,
   "Longitud": 16.1667,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Delsbo A",
   "Stationsnummer": 116490,
   "Latitud": 61.8271,
   "Longitud": 16.5418,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kuggören A",
   "Stationsnummer": 117430,
   "Latitud": 61.7033,
   "Longitud": 17.525,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hudiksvall",
   "Stationsnummer": 117440,
   "Latitud": 61.7167,
   "Longitud": 17.086,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bergsjö",
   "Stationsnummer": 117570,
   "Latitud": 61.9488,
   "Longitud": 17.0669,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Myskelåsen D",
   "Stationsnummer": 122200,
   "Latitud": 62.3335,
   "Longitud": 12.647,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tännäs A",
   "Stationsnummer": 122260,
   "Latitud": 62.4502,
   "Longitud": 12.6702,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Medskogen",
   "Stationsnummer": 122270,
   "Latitud": 62.443,
   "Longitud": 12.9673,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ljusnedal",
   "Stationsnummer": 122330,
   "Latitud": 62.5493,
   "Longitud": 12.6043,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malmagen",
   "Stationsnummer": 122370,
   "Latitud": 62.6094,
   "Longitud": 12.1605,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ljungdalen",
   "Stationsnummer": 122510,
   "Latitud": 62.8543,
   "Longitud": 12.807,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Häggberget D",
   "Stationsnummer": 123020,
   "Latitud": 62.031,
   "Longitud": 13.0879,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Dravagen A",
   "Stationsnummer": 123060,
   "Latitud": 62.0943,
   "Longitud": 13.6115,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hedeviken",
   "Stationsnummer": 123340,
   "Latitud": 62.4112,
   "Longitud": 13.6748,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Börtnan A",
   "Stationsnummer": 123460,
   "Latitud": 62.7557,
   "Longitud": 13.8456,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sveg A",
   "Stationsnummer": 124030,
   "Latitud": 62.0471,
   "Longitud": 14.41,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ytterberg D",
   "Stationsnummer": 124040,
   "Latitud": 62.0673,
   "Longitud": 14.4944,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ytterhogdal",
   "Stationsnummer": 124110,
   "Latitud": 62.1825,
   "Longitud": 14.9508,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rätan",
   "Stationsnummer": 124280,
   "Latitud": 62.4845,
   "Longitud": 14.544,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Handsjön D",
   "Stationsnummer": 124290,
   "Latitud": 62.4768,
   "Longitud": 14.8009,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Klövsjöhöjden A",
   "Stationsnummer": 124300,
   "Latitud": 62.4961,
   "Longitud": 14.1571,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Åsarna D",
   "Stationsnummer": 124400,
   "Latitud": 62.66,
   "Longitud": 14.3556,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Dödre",
   "Stationsnummer": 124480,
   "Latitud": 62.7923,
   "Longitud": 14.687,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hennan D",
   "Stationsnummer": 125030,
   "Latitud": 62.0313,
   "Longitud": 15.9127,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ramsjö",
   "Stationsnummer": 125110,
   "Latitud": 62.1843,
   "Longitud": 15.6508,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kölsillre",
   "Stationsnummer": 125240,
   "Latitud": 62.3986,
   "Longitud": 15.2137,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rotnäset D",
   "Stationsnummer": 125250,
   "Latitud": 62.4001,
   "Longitud": 15.4417,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ånge-Parteboda D",
   "Stationsnummer": 125310,
   "Latitud": 62.5257,
   "Longitud": 15.7694,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hunge A",
   "Stationsnummer": 125440,
   "Latitud": 62.7512,
   "Longitud": 15.0876,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mälgåsen D",
   "Stationsnummer": 125510,
   "Latitud": 62.8513,
   "Longitud": 15.329,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sänningstjärn D",
   "Stationsnummer": 126080,
   "Latitud": 62.1376,
   "Longitud": 16.8676,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ljusdals-Valsjön",
   "Stationsnummer": 126120,
   "Latitud": 62.195,
   "Longitud": 16.0367,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ulvsjön D",
   "Stationsnummer": 126170,
   "Latitud": 62.2713,
   "Longitud": 16.4328,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Västerlo D",
   "Stationsnummer": 126250,
   "Latitud": 62.4133,
   "Longitud": 16.6573,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Torpshammar A",
   "Stationsnummer": 126290,
   "Latitud": 62.4943,
   "Longitud": 16.2774,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Öraåtjärnarna D",
   "Stationsnummer": 126430,
   "Latitud": 62.7165,
   "Longitud": 16.1775,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kälarne",
   "Stationsnummer": 126580,
   "Latitud": 62.9628,
   "Longitud": 16.1075,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Åsnorrbodarna",
   "Stationsnummer": 127090,
   "Latitud": 62.1492,
   "Longitud": 17.1724,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Brämön A",
   "Stationsnummer": 127130,
   "Latitud": 62.2207,
   "Longitud": 17.7426,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sidsjö D",
   "Stationsnummer": 127220,
   "Latitud": 62.3806,
   "Longitud": 17.2855,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sundsvalls Flygplats",
   "Stationsnummer": 127310,
   "Latitud": 62.5246,
   "Longitud": 17.441,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stordalen-Midlanda D",
   "Stationsnummer": 127320,
   "Latitud": 62.53,
   "Longitud": 17.4129,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Härnösand",
   "Stationsnummer": 127380,
   "Latitud": 62.628,
   "Longitud": 17.9471,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Höglandsbodarna D",
   "Stationsnummer": 127390,
   "Latitud": 62.6336,
   "Longitud": 17.4146,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gåltjärn",
   "Stationsnummer": 127480,
   "Latitud": 62.7958,
   "Longitud": 17.5538,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kramfors",
   "Stationsnummer": 127560,
   "Latitud": 62.929,
   "Longitud": 17.7636,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Åkroken D",
   "Stationsnummer": 127570,
   "Latitud": 62.938,
   "Longitud": 17.2411,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lungö A",
   "Stationsnummer": 128390,
   "Latitud": 62.6431,
   "Longitud": 18.0929,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nora-Östanö D",
   "Stationsnummer": 128500,
   "Latitud": 62.8599,
   "Longitud": 18.1795,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ullånger",
   "Stationsnummer": 128590,
   "Latitud": 63.0132,
   "Longitud": 18.188,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Storlien-Storvallen A",
   "Stationsnummer": 132170,
   "Latitud": 63.2831,
   "Longitud": 12.1246,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Storlien-Storvallen",
   "Stationsnummer": 132180,
   "Latitud": 63.2825,
   "Longitud": 12.1222,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Medstugan",
   "Stationsnummer": 132320,
   "Latitud": 63.5269,
   "Longitud": 12.4037,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Digernäset D",
   "Stationsnummer": 132370,
   "Latitud": 63.624,
   "Longitud": 12.9206,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sandnäs",
   "Stationsnummer": 132450,
   "Latitud": 63.7552,
   "Longitud": 12.4316,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Edevik",
   "Stationsnummer": 132590,
   "Latitud": 63.9812,
   "Longitud": 12.8709,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Höglekardalen",
   "Stationsnummer": 133050,
   "Latitud": 63.0796,
   "Longitud": 13.7529,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vallbo",
   "Stationsnummer": 133100,
   "Latitud": 63.1569,
   "Longitud": 13.0726,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mörsil",
   "Stationsnummer": 133190,
   "Latitud": 63.3193,
   "Longitud": 13.6488,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Järpströmmen",
   "Stationsnummer": 133240,
   "Latitud": 63.3915,
   "Longitud": 13.388,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kaxås-Åflo D",
   "Stationsnummer": 133300,
   "Latitud": 63.4935,
   "Longitud": 13.8797,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bottnen",
   "Stationsnummer": 133410,
   "Latitud": 63.6769,
   "Longitud": 13.3699,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Olden D",
   "Stationsnummer": 133420,
   "Latitud": 63.6964,
   "Longitud": 13.6504,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Korsvattnet A",
   "Stationsnummer": 133500,
   "Latitud": 63.8395,
   "Longitud": 13.5037,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tandsbyn D",
   "Stationsnummer": 134000,
   "Latitud": 63.0092,
   "Longitud": 14.7184,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Marby D",
   "Stationsnummer": 134070,
   "Latitud": 63.122,
   "Longitud": 14.2939,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norderön",
   "Stationsnummer": 134090,
   "Latitud": 63.1618,
   "Longitud": 14.3692,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Frösön",
   "Stationsnummer": 134110,
   "Latitud": 63.1974,
   "Longitud": 14.4863,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Litsnäset",
   "Stationsnummer": 134170,
   "Latitud": 63.3089,
   "Longitud": 14.7065,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tullus D",
   "Stationsnummer": 134190,
   "Latitud": 63.3085,
   "Longitud": 14.3174,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Långan D",
   "Stationsnummer": 134270,
   "Latitud": 63.4555,
   "Longitud": 14.4859,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lundsjön",
   "Stationsnummer": 134310,
   "Latitud": 63.5195,
   "Longitud": 14.5261,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Föllinge A",
   "Stationsnummer": 134410,
   "Latitud": 63.677,
   "Longitud": 14.6079,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Almdalen",
   "Stationsnummer": 134590,
   "Latitud": 63.9967,
   "Longitud": 14.6701,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Västerövsjö D",
   "Stationsnummer": 135020,
   "Latitud": 63.0421,
   "Longitud": 15.9347,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rissna D",
   "Stationsnummer": 135040,
   "Latitud": 63.0593,
   "Longitud": 15.3441,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Borgvattnet D",
   "Stationsnummer": 135260,
   "Latitud": 63.4248,
   "Longitud": 15.8283,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hammerdal D",
   "Stationsnummer": 135350,
   "Latitud": 63.575,
   "Longitud": 15.3685,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hallhåxåsen A",
   "Stationsnummer": 135460,
   "Latitud": 63.7695,
   "Longitud": 15.331,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Strömsund-Edet D",
   "Stationsnummer": 135550,
   "Latitud": 63.9157,
   "Longitud": 15.3181,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lövberga D",
   "Stationsnummer": 135580,
   "Latitud": 63.9664,
   "Longitud": 15.8533,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bispgården",
   "Stationsnummer": 136020,
   "Latitud": 63.0295,
   "Longitud": 16.6232,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Krångede A",
   "Stationsnummer": 136090,
   "Latitud": 63.1521,
   "Longitud": 16.1733,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Edsele",
   "Stationsnummer": 136240,
   "Latitud": 63.4047,
   "Longitud": 16.55,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Näsåker",
   "Stationsnummer": 136260,
   "Latitud": 63.4188,
   "Longitud": 16.9563,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Storfinnforsen",
   "Stationsnummer": 136360,
   "Latitud": 63.595,
   "Longitud": 16.1846,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Junsele A",
   "Stationsnummer": 136410,
   "Latitud": 63.6849,
   "Longitud": 16.9531,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Backe D",
   "Stationsnummer": 136490,
   "Latitud": 63.8148,
   "Longitud": 16.4058,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rossön",
   "Stationsnummer": 136560,
   "Latitud": 63.9351,
   "Longitud": 16.3731,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Forse",
   "Stationsnummer": 137080,
   "Latitud": 63.1466,
   "Longitud": 17.0262,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Multrå D",
   "Stationsnummer": 137090,
   "Latitud": 63.1681,
   "Longitud": 17.4192,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sollefteå",
   "Stationsnummer": 137100,
   "Latitud": 63.1748,
   "Longitud": 17.2314,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lännäs",
   "Stationsnummer": 137110,
   "Latitud": 63.1663,
   "Longitud": 17.6543,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Resele",
   "Stationsnummer": 137200,
   "Latitud": 63.3279,
   "Longitud": 17.0676,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Aspeå",
   "Stationsnummer": 137220,
   "Latitud": 63.4002,
   "Longitud": 17.4947,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Myckelgensjö",
   "Stationsnummer": 137350,
   "Latitud": 63.5772,
   "Longitud": 17.5898,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Västmarkum A",
   "Stationsnummer": 138070,
   "Latitud": 63.1251,
   "Longitud": 18.2555,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Örnsköldsvik",
   "Stationsnummer": 138180,
   "Latitud": 63.2963,
   "Longitud": 18.7217,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bredbyn D",
   "Stationsnummer": 138270,
   "Latitud": 63.4612,
   "Longitud": 18.0717,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hattsjöbäcken D",
   "Stationsnummer": 138360,
   "Latitud": 63.5918,
   "Longitud": 18.9539,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hemling A",
   "Stationsnummer": 138390,
   "Latitud": 63.6513,
   "Longitud": 18.5502,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Södersel D",
   "Stationsnummer": 138450,
   "Latitud": 63.747,
   "Longitud": 18.1689,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skagsudde A",
   "Stationsnummer": 139120,
   "Latitud": 63.1886,
   "Longitud": 19.0202,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Järnäsklubb A",
   "Stationsnummer": 139260,
   "Latitud": 63.4359,
   "Longitud": 19.6768,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Torrböle D",
   "Stationsnummer": 139420,
   "Latitud": 63.7076,
   "Longitud": 19.5932,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nordanbäck D",
   "Stationsnummer": 139440,
   "Latitud": 63.7424,
   "Longitud": 19.2951,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vännäs D",
   "Stationsnummer": 139540,
   "Latitud": 63.9226,
   "Longitud": 19.8144,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Balsjö D",
   "Stationsnummer": 139570,
   "Latitud": 63.9206,
   "Longitud": 19.0703,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Holmön A",
   "Stationsnummer": 140460,
   "Latitud": 63.8082,
   "Longitud": 20.8692,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Holmön D",
   "Stationsnummer": 140470,
   "Latitud": 63.7918,
   "Longitud": 20.8606,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Umeå Flygplats",
   "Stationsnummer": 140480,
   "Latitud": 63.7947,
   "Longitud": 20.2918,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Röbäcksdalen",
   "Stationsnummer": 140490,
   "Latitud": 63.813,
   "Longitud": 20.2398,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Jormlien",
   "Stationsnummer": 143440,
   "Latitud": 64.7306,
   "Longitud": 13.986,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Valsjön",
   "Stationsnummer": 144040,
   "Latitud": 64.0645,
   "Longitud": 14.1341,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Frostviken D",
   "Stationsnummer": 144220,
   "Latitud": 64.3866,
   "Longitud": 14.3169,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Håkafot D",
   "Stationsnummer": 144230,
   "Latitud": 64.3914,
   "Longitud": 14.3913,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Fågelberget D",
   "Stationsnummer": 144240,
   "Latitud": 64.3891,
   "Longitud": 14.5261,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gäddede A",
   "Stationsnummer": 144310,
   "Latitud": 64.5057,
   "Longitud": 14.2238,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ankarvattnet D",
   "Stationsnummer": 144530,
   "Latitud": 64.8779,
   "Longitud": 14.2293,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Leipikvattnet",
   "Stationsnummer": 144560,
   "Latitud": 64.9298,
   "Longitud": 14.1592,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hillsand",
   "Stationsnummer": 145090,
   "Latitud": 64.1102,
   "Longitud": 15.3168,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gubbhögen A",
   "Stationsnummer": 145130,
   "Latitud": 64.2182,
   "Longitud": 15.5561,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kyrktåsjö D",
   "Stationsnummer": 145150,
   "Latitud": 64.2485,
   "Longitud": 15.8478,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Högland D",
   "Stationsnummer": 145340,
   "Latitud": 64.5812,
   "Longitud": 15.8792,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Avasjö-Borgafjäll D",
   "Stationsnummer": 145500,
   "Latitud": 64.8366,
   "Longitud": 15.0918,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stalon II",
   "Stationsnummer": 145570,
   "Latitud": 64.9451,
   "Longitud": 15.8364,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hoting A",
   "Stationsnummer": 146050,
   "Latitud": 64.0885,
   "Longitud": 16.2388,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vilhelmina A",
   "Stationsnummer": 146350,
   "Latitud": 64.5809,
   "Longitud": 16.8421,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Laxbäcken",
   "Stationsnummer": 146380,
   "Latitud": 64.6389,
   "Longitud": 16.4142,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ytterrissjö D",
   "Stationsnummer": 147020,
   "Latitud": 64.0302,
   "Longitud": 17.777,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Åsele A",
   "Stationsnummer": 147090,
   "Latitud": 64.1661,
   "Longitud": 17.3188,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Åsele",
   "Stationsnummer": 147100,
   "Latitud": 64.159,
   "Longitud": 17.3494,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Latikberg D",
   "Stationsnummer": 147390,
   "Latitud": 64.6434,
   "Longitud": 17.0866,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gunnarn A",
   "Stationsnummer": 147560,
   "Latitud": 65.0106,
   "Longitud": 17.7034,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Fredrika A",
   "Stationsnummer": 148040,
   "Latitud": 64.0753,
   "Longitud": 18.3656,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Granträsk D",
   "Stationsnummer": 148200,
   "Latitud": 64.3346,
   "Longitud": 18.3756,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lycksele A",
   "Stationsnummer": 148330,
   "Latitud": 64.5492,
   "Longitud": 18.7169,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bäverträsk",
   "Stationsnummer": 148370,
   "Latitud": 64.6179,
   "Longitud": 18.3387,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rusksele D",
   "Stationsnummer": 148490,
   "Latitud": 64.8166,
   "Longitud": 18.8886,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norrby",
   "Stationsnummer": 148550,
   "Latitud": 64.9238,
   "Longitud": 18.2404,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vindeln-Sunnansjönäs",
   "Stationsnummer": 149120,
   "Latitud": 64.1386,
   "Longitud": 19.7618,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Granö D",
   "Stationsnummer": 149150,
   "Latitud": 64.2517,
   "Longitud": 19.3127,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malkälen D",
   "Stationsnummer": 149230,
   "Latitud": 64.3918,
   "Longitud": 19.6903,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Petisträsk A",
   "Stationsnummer": 149340,
   "Latitud": 64.5669,
   "Longitud": 19.6983,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Brännforssund",
   "Stationsnummer": 149390,
   "Latitud": 64.6517,
   "Longitud": 19.3708,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kalvträsk D",
   "Stationsnummer": 149400,
   "Latitud": 64.6703,
   "Longitud": 19.8082,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Talliden",
   "Stationsnummer": 149470,
   "Latitud": 64.7781,
   "Longitud": 19.3679,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norsjö",
   "Stationsnummer": 149540,
   "Latitud": 64.9093,
   "Longitud": 19.4746,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Norsjö A",
   "Stationsnummer": 149560,
   "Latitud": 64.9263,
   "Longitud": 19.3782,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tavelsjö D",
   "Stationsnummer": 150020,
   "Latitud": 64.0406,
   "Longitud": 20.0758,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Brände",
   "Stationsnummer": 150200,
   "Latitud": 64.334,
   "Longitud": 20.9608,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bygdsiljum D",
   "Stationsnummer": 150210,
   "Latitud": 64.3681,
   "Longitud": 20.4841,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Grönliden",
   "Stationsnummer": 150440,
   "Latitud": 64.7301,
   "Longitud": 20.1927,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Holmfors D",
   "Stationsnummer": 150460,
   "Latitud": 64.7855,
   "Longitud": 20.5185,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kåge",
   "Stationsnummer": 150500,
   "Latitud": 64.8386,
   "Longitud": 20.9406,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kusmark D",
   "Stationsnummer": 150530,
   "Latitud": 64.8846,
   "Longitud": 20.8323,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bjuröklubb A",
   "Stationsnummer": 151280,
   "Latitud": 64.4812,
   "Longitud": 21.5791,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kittelfjäll D",
   "Stationsnummer": 155770,
   "Latitud": 65.2574,
   "Longitud": 15.5269,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gielas A",
   "Stationsnummer": 155790,
   "Latitud": 65.328,
   "Longitud": 15.0686,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Boksjö",
   "Stationsnummer": 155900,
   "Latitud": 65.6772,
   "Longitud": 15.8245,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Hemavan D",
   "Stationsnummer": 155940,
   "Latitud": 65.8224,
   "Longitud": 15.0885,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Bastansjö D",
   "Stationsnummer": 156230,
   "Latitud": 65.3819,
   "Longitud": 16.1966,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Dajkanvik",
   "Stationsnummer": 156740,
   "Latitud": 65.1444,
   "Longitud": 16.3,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Blaiken D",
   "Stationsnummer": 156780,
   "Latitud": 65.2511,
   "Longitud": 16.857,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nordanås",
   "Stationsnummer": 156840,
   "Latitud": 65.4635,
   "Longitud": 16.0904,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Fjällsjönäs",
   "Stationsnummer": 156880,
   "Latitud": 65.6242,
   "Longitud": 16.6077,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sadiliden",
   "Stationsnummer": 157750,
   "Latitud": 65.1709,
   "Longitud": 17.8199,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gargnäs D",
   "Stationsnummer": 157790,
   "Latitud": 65.3263,
   "Longitud": 17.9505,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sorsele",
   "Stationsnummer": 157860,
   "Latitud": 65.5354,
   "Longitud": 17.5225,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Buresjön A",
   "Stationsnummer": 157870,
   "Latitud": 65.5592,
   "Longitud": 17.86,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Klippen D",
   "Stationsnummer": 157970,
   "Latitud": 65.8969,
   "Longitud": 17.1093,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vaxborg",
   "Stationsnummer": 157980,
   "Latitud": 65.9451,
   "Longitud": 17.4821,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malå-Brännan A",
   "Stationsnummer": 158740,
   "Latitud": 65.1522,
   "Longitud": 18.5974,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malå",
   "Stationsnummer": 158750,
   "Latitud": 65.1808,
   "Longitud": 18.7431,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Adak D",
   "Stationsnummer": 158820,
   "Latitud": 65.383,
   "Longitud": 18.6201,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Arjeplog-Myrheden D",
   "Stationsnummer": 158980,
   "Latitud": 65.9799,
   "Longitud": 18.2287,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Abraur",
   "Stationsnummer": 158990,
   "Latitud": 65.9867,
   "Longitud": 18.9236,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Långträsk D",
   "Stationsnummer": 159760,
   "Latitud": 65.1953,
   "Longitud": 19.249,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Glommersträsk",
   "Stationsnummer": 159770,
   "Latitud": 65.278,
   "Longitud": 19.6673,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Arvidsjaur A",
   "Stationsnummer": 159880,
   "Latitud": 65.5953,
   "Longitud": 19.2682,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Jörn D",
   "Stationsnummer": 160710,
   "Latitud": 65.0971,
   "Longitud": 20.1072,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Koler D",
   "Stationsnummer": 160850,
   "Latitud": 65.504,
   "Longitud": 20.4675,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vidsel",
   "Stationsnummer": 160960,
   "Latitud": 65.8801,
   "Longitud": 20.1315,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vidsel Mo",
   "Stationsnummer": 160970,
   "Latitud": 65.8769,
   "Longitud": 20.1543,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Pite-Rönnskär A",
   "Stationsnummer": 161710,
   "Latitud": 65.035,
   "Longitud": 21.5655,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Piteå",
   "Stationsnummer": 161790,
   "Latitud": 65.2636,
   "Longitud": 21.4776,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Klöverträsk D",
   "Stationsnummer": 161900,
   "Latitud": 65.636,
   "Longitud": 21.4173,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Älvsbyn A",
   "Stationsnummer": 161910,
   "Latitud": 65.6702,
   "Longitud": 21.0662,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Brännberg D",
   "Stationsnummer": 161930,
   "Latitud": 65.7938,
   "Longitud": 21.26,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Boden Mo",
   "Stationsnummer": 161940,
   "Latitud": 65.8151,
   "Longitud": 21.6396,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rödkallen A",
   "Stationsnummer": 162790,
   "Latitud": 65.3131,
   "Longitud": 22.3753,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Luleå Flygplats",
   "Stationsnummer": 162860,
   "Latitud": 65.5434,
   "Longitud": 22.1193,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Luleå-Bergnäset",
   "Stationsnummer": 162870,
   "Latitud": 65.5762,
   "Longitud": 22.109,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Storön A",
   "Stationsnummer": 163900,
   "Latitud": 65.6982,
   "Longitud": 23.1005,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kalix D",
   "Stationsnummer": 163940,
   "Latitud": 65.838,
   "Longitud": 23.2026,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Haparanda D",
   "Stationsnummer": 163950,
   "Latitud": 65.8567,
   "Longitud": 24.1118,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Haparanda A",
   "Stationsnummer": 163960,
   "Latitud": 65.8249,
   "Longitud": 24.1162,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mjölkbäcken",
   "Stationsnummer": 164730,
   "Latitud": 66.1041,
   "Longitud": 14.8503,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Jäckvik",
   "Stationsnummer": 166810,
   "Latitud": 66.3881,
   "Longitud": 16.9763,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Mierkenis A",
   "Stationsnummer": 166910,
   "Latitud": 66.6815,
   "Longitud": 16.1088,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Arjeplog A",
   "Stationsnummer": 167710,
   "Latitud": 66.0526,
   "Longitud": 17.8434,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Svartberget D",
   "Stationsnummer": 167790,
   "Latitud": 66.3239,
   "Longitud": 17.321,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kvikkjokk-Årrenjarka",
   "Stationsnummer": 167980,
   "Latitud": 66.8834,
   "Longitud": 18.0226,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kvikkjokk-Årrenjarka A",
   "Stationsnummer": 167990,
   "Latitud": 66.8888,
   "Longitud": 18.0234,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tjåkaape Mo",
   "Stationsnummer": 169790,
   "Latitud": 66.3002,
   "Longitud": 19.2,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Jokkmokk",
   "Stationsnummer": 169880,
   "Latitud": 66.6135,
   "Longitud": 19.8316,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Harads D",
   "Stationsnummer": 170670,
   "Latitud": 66.0805,
   "Longitud": 20.968,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Puottaure",
   "Stationsnummer": 170760,
   "Latitud": 66.1861,
   "Longitud": 20.2534,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Murjek D",
   "Stationsnummer": 170850,
   "Latitud": 66.4771,
   "Longitud": 20.9263,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Jokkmokk Flygplats Mo",
   "Stationsnummer": 170860,
   "Latitud": 66.499,
   "Longitud": 20.131,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nattavaara A",
   "Stationsnummer": 170930,
   "Latitud": 66.7529,
   "Longitud": 20.9281,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sörbyn",
   "Stationsnummer": 171720,
   "Latitud": 66.0531,
   "Longitud": 21.7851,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lakaträsk A",
   "Stationsnummer": 171790,
   "Latitud": 66.2801,
   "Longitud": 21.133,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Skröven D",
   "Stationsnummer": 171930,
   "Latitud": 66.7757,
   "Longitud": 21.8444,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Sadjem D",
   "Stationsnummer": 171990,
   "Latitud": 66.9615,
   "Longitud": 21.2324,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Överkalix-Svartbyn A",
   "Stationsnummer": 172770,
   "Latitud": 66.263,
   "Longitud": 22.8472,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Talljärv D",
   "Stationsnummer": 172780,
   "Latitud": 66.2512,
   "Longitud": 22.309,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rödupp",
   "Stationsnummer": 172840,
   "Latitud": 66.4585,
   "Longitud": 22.7855,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Markusvinsa",
   "Stationsnummer": 172920,
   "Latitud": 66.7265,
   "Longitud": 22.9001,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Paharova A",
   "Stationsnummer": 172940,
   "Latitud": 66.8107,
   "Longitud": 22.336,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Karungi",
   "Stationsnummer": 173710,
   "Latitud": 66.0438,
   "Longitud": 23.9765,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kypäsjärvi D",
   "Stationsnummer": 173760,
   "Latitud": 66.1937,
   "Longitud": 23.2295,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Övertorneå",
   "Stationsnummer": 173810,
   "Latitud": 66.3862,
   "Longitud": 23.622,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Svanstein",
   "Stationsnummer": 173890,
   "Latitud": 66.6538,
   "Longitud": 23.864,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ylinenjärvi A",
   "Stationsnummer": 173900,
   "Latitud": 66.6235,
   "Longitud": 23.468,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Jarhois",
   "Stationsnummer": 173980,
   "Latitud": 66.9534,
   "Longitud": 23.8404,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Ritsem A",
   "Stationsnummer": 177930,
   "Latitud": 67.7262,
   "Longitud": 17.4711,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Björkudden",
   "Stationsnummer": 178820,
   "Latitud": 67.3956,
   "Longitud": 18.7156,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Stora Sjöfallet A",
   "Stationsnummer": 178860,
   "Latitud": 67.4964,
   "Longitud": 18.2943,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tarfala A",
   "Stationsnummer": 178970,
   "Latitud": 67.9113,
   "Longitud": 18.6068,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Nikkaluokta A",
   "Stationsnummer": 179960,
   "Latitud": 67.8542,
   "Longitud": 19.0253,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Malmberget",
   "Stationsnummer": 180750,
   "Latitud": 67.1681,
   "Longitud": 20.6389,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Gällivare A",
   "Stationsnummer": 180760,
   "Latitud": 67.1421,
   "Longitud": 20.6455,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Latnivaara A",
   "Stationsnummer": 180770,
   "Latitud": 67.2564,
   "Longitud": 20.2747,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Jukkasjärvi D",
   "Stationsnummer": 180950,
   "Latitud": 67.8532,
   "Longitud": 20.5793,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Parakka",
   "Stationsnummer": 181850,
   "Latitud": 67.4864,
   "Longitud": 21.6687,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Svappavaara",
   "Stationsnummer": 181890,
   "Latitud": 67.6536,
   "Longitud": 21.0525,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Vittangi",
   "Stationsnummer": 181900,
   "Latitud": 67.6943,
   "Longitud": 21.6335,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Esrange",
   "Stationsnummer": 181970,
   "Latitud": 67.8911,
   "Longitud": 21.0846,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Tärendö D",
   "Stationsnummer": 182740,
   "Latitud": 67.1661,
   "Longitud": 22.6287,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Saittarova D",
   "Stationsnummer": 182800,
   "Latitud": 67.3345,
   "Longitud": 22.2433,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Saittarova A",
   "Stationsnummer": 182810,
   "Latitud": 67.3376,
   "Longitud": 22.2334,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kangos D",
   "Stationsnummer": 182850,
   "Latitud": 67.4954,
   "Longitud": 22.6647,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Keräntöjärvi",
   "Stationsnummer": 182890,
   "Latitud": 67.6375,
   "Longitud": 22.9211,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Parkalompolo A",
   "Stationsnummer": 182910,
   "Latitud": 67.7315,
   "Longitud": 22.8266,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lainio",
   "Stationsnummer": 182930,
   "Latitud": 67.7615,
   "Longitud": 22.3518,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Pajala A",
   "Stationsnummer": 183750,
   "Latitud": 67.2049,
   "Longitud": 23.3952,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Parkajoki",
   "Stationsnummer": 183920,
   "Latitud": 67.7314,
   "Longitud": 23.486,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Abisko",
   "Stationsnummer": 188800,
   "Latitud": 68.3557,
   "Longitud": 18.8206,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Katterjåkk",
   "Stationsnummer": 188820,
   "Latitud": 68.4218,
   "Longitud": 18.1698,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Katterjåkk A",
   "Stationsnummer": 188850,
   "Latitud": 68.4217,
   "Longitud": 18.1719,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Rensjön A",
   "Stationsnummer": 189720,
   "Latitud": 68.0745,
   "Longitud": 19.8392,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Övre Soppero",
   "Stationsnummer": 191730,
   "Latitud": 68.0916,
   "Longitud": 21.7003,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Naimakka A",
   "Stationsnummer": 191910,
   "Latitud": 68.6777,
   "Longitud": 21.5274,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Saarikoski D",
   "Stationsnummer": 191940,
   "Latitud": 68.805,
   "Longitud": 21.2529,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Lannavaara D",
   "Stationsnummer": 192710,
   "Latitud": 68.0487,
   "Longitud": 21.9759,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Karesuando A",
   "Stationsnummer": 192840,
   "Latitud": 68.4432,
   "Longitud": 22.4488,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Kätkesuando",
   "Stationsnummer": 193730,
   "Latitud": 68.1202,
   "Longitud": 23.3283,
   "Aktiv": 1
 },
 {
   "Stationsnamn": "Djupadal",
   "Stationsnummer": 75080,
   "Latitud": 57.1528,
   "Longitud": 15.5833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tjärö",
   "Stationsnummer": 65110,
   "Latitud": 56.1722,
   "Longitud": 15.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östra Lonntorp",
   "Stationsnummer": 94220,
   "Latitud": 59.3861,
   "Longitud": 14.475,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gärdsta",
   "Stationsnummer": 134060,
   "Latitud": 63.1417,
   "Longitud": 14.2833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fuglunda",
   "Stationsnummer": 53590,
   "Latitud": 55.5889,
   "Longitud": 13.8,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Götestorp",
   "Stationsnummer": 75640,
   "Latitud": 57.2666,
   "Longitud": 15.047,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bodträskfors",
   "Stationsnummer": 170630,
   "Latitud": 66.0792,
   "Longitud": 20.925,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gyljen",
   "Stationsnummer": 172740,
   "Latitud": 66.3792,
   "Longitud": 22.7139,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Färna",
   "Stationsnummer": 95480,
   "Latitud": 59.7833,
   "Longitud": 15.8667,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kimramåla",
   "Stationsnummer": 75650,
   "Latitud": 57,
   "Longitud": 15.847,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Häggås",
   "Stationsnummer": 146600,
   "Latitud": 64.3991,
   "Longitud": 16.5965,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kyrkhult",
   "Stationsnummer": 64180,
   "Latitud": 56.3556,
   "Longitud": 14.5972,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gåsbornshyttan",
   "Stationsnummer": 94460,
   "Latitud": 59.8861,
   "Longitud": 14.3417,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jonsered",
   "Stationsnummer": 72380,
   "Latitud": 57.7569,
   "Longitud": 12.1833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hjältevad",
   "Stationsnummer": 75370,
   "Latitud": 57.6278,
   "Longitud": 15.3375,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hau träsk",
   "Stationsnummer": 78510,
   "Latitud": 57.8944,
   "Longitud": 18.9944,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Flåss myr",
   "Stationsnummer": 63190,
   "Latitud": 56.3806,
   "Longitud": 13.4819,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dalfors",
   "Stationsnummer": 115630,
   "Latitud": 61.2139,
   "Longitud": 15.4083,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kappeludden",
   "Stationsnummer": 66610,
   "Latitud": 56.8167,
   "Longitud": 16.8468,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björklund",
   "Stationsnummer": 95270,
   "Latitud": 59.4208,
   "Longitud": 15.2958,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Arvika sanatorium",
   "Stationsnummer": 92430,
   "Latitud": 59.6667,
   "Longitud": 12.6194,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kolmårdssanatoriet",
   "Stationsnummer": 86650,
   "Latitud": 58.6664,
   "Longitud": 16.3301,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Broddbo",
   "Stationsnummer": 96640,
   "Latitud": 59.9829,
   "Longitud": 16.4634,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bollstabruk",
   "Stationsnummer": 137020,
   "Latitud": 63.0042,
   "Longitud": 17.6708,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Haraliden",
   "Stationsnummer": 160610,
   "Latitud": 65.45,
   "Longitud": 20.1,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sundby",
   "Stationsnummer": 98030,
   "Latitud": 59.0319,
   "Longitud": 18.3944,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bergvattnet",
   "Stationsnummer": 158600,
   "Latitud": 65.0158,
   "Longitud": 18.2462,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dalliden",
   "Stationsnummer": 160600,
   "Latitud": 65.0157,
   "Longitud": 20.3127,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jägarhyddan",
   "Stationsnummer": 73630,
   "Latitud": 57.2166,
   "Longitud": 13.9472,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Edesnäs",
   "Stationsnummer": 88560,
   "Latitud": 58.9556,
   "Longitud": 18.2861,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gråsjön",
   "Stationsnummer": 132680,
   "Latitud": 63.7291,
   "Longitud": 12.8691,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kölaråsen",
   "Stationsnummer": 104600,
   "Latitud": 60.2663,
   "Longitud": 14.3637,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ede",
   "Stationsnummer": 126280,
   "Latitud": 62.4264,
   "Longitud": 16.4948,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hönsäter",
   "Stationsnummer": 83740,
   "Latitud": 58.6331,
   "Longitud": 13.4305,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bornö",
   "Stationsnummer": 81090,
   "Latitud": 58.3806,
   "Longitud": 11.5819,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kullatorp",
   "Stationsnummer": 94620,
   "Latitud": 59.5164,
   "Longitud": 14.797,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Alnarp mellangård",
   "Stationsnummer": 53750,
   "Latitud": 55.6556,
   "Longitud": 13.0511,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Håen",
   "Stationsnummer": 104140,
   "Latitud": 60.1847,
   "Longitud": 14.4444,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Klitten",
   "Stationsnummer": 114180,
   "Latitud": 61.2806,
   "Longitud": 14.1139,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östra Hulvik",
   "Stationsnummer": 94680,
   "Latitud": 59.1497,
   "Longitud": 14.797,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bro",
   "Stationsnummer": 107600,
   "Latitud": 60.3996,
   "Longitud": 17.5799,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gånälven",
   "Stationsnummer": 132610,
   "Latitud": 63.9824,
   "Longitud": 12.7305,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hulan",
   "Stationsnummer": 72500,
   "Latitud": 57.7556,
   "Longitud": 12.2417,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Granåbron",
   "Stationsnummer": 103290,
   "Latitud": 60.4403,
   "Longitud": 13.8944,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bensjö",
   "Stationsnummer": 125470,
   "Latitud": 62.7139,
   "Longitud": 15.4667,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hindås",
   "Stationsnummer": 72440,
   "Latitud": 57.7083,
   "Longitud": 12.4417,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kairo",
   "Stationsnummer": 97660,
   "Latitud": 59.5164,
   "Longitud": 16.0468,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ekskogen",
   "Stationsnummer": 98630,
   "Latitud": 59.633,
   "Longitud": 18.2298,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Harg",
   "Stationsnummer": 108600,
   "Latitud": 60.1829,
   "Longitud": 18.3964,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Viksta",
   "Stationsnummer": 107020,
   "Latitud": 60.0694,
   "Longitud": 17.6181,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Finsthögst",
   "Stationsnummer": 115610,
   "Latitud": 61.3161,
   "Longitud": 15.4969,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gästrike-Hammarby I",
   "Stationsnummer": 106670,
   "Latitud": 60.5501,
   "Longitud": 16.5833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gästrike-Hammarby II",
   "Stationsnummer": 106680,
   "Latitud": 60.5502,
   "Longitud": 16.5833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bergs säteri",
   "Stationsnummer": 82370,
   "Latitud": 58.7167,
   "Longitud": 12.4833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Herrökna",
   "Stationsnummer": 96080,
   "Latitud": 59.1167,
   "Longitud": 16.9653,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Halmsjön",
   "Stationsnummer": 97460,
   "Latitud": 59.6583,
   "Longitud": 17.3042,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ödskölt",
   "Stationsnummer": 82660,
   "Latitud": 58.8458,
   "Longitud": 12.1472,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sjulsåsen",
   "Stationsnummer": 144250,
   "Latitud": 64.3486,
   "Longitud": 14.7736,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kratte masugn",
   "Stationsnummer": 106340,
   "Latitud": 60.4528,
   "Longitud": 16.3861,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grönkulla",
   "Stationsnummer": 85610,
   "Latitud": 58.5831,
   "Longitud": 15.4636,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grönhult",
   "Stationsnummer": 76500,
   "Latitud": 57.7778,
   "Longitud": 16.1583,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sulsta",
   "Stationsnummer": 87480,
   "Latitud": 58.8361,
   "Longitud": 17.2556,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ulverud",
   "Stationsnummer": 92450,
   "Latitud": 59.6167,
   "Longitud": 12.2917,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Barsebäck",
   "Stationsnummer": 52610,
   "Latitud": 55.7668,
   "Longitud": 12.9473,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gudhammar",
   "Stationsnummer": 84690,
   "Latitud": 58.9056,
   "Longitud": 14.225,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björksättra",
   "Stationsnummer": 98580,
   "Latitud": 59.9333,
   "Longitud": 18.4833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Finnåker",
   "Stationsnummer": 95310,
   "Latitud": 59.55,
   "Longitud": 15.5819,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Brunström",
   "Stationsnummer": 84010,
   "Latitud": 58,
   "Longitud": 14.4764,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västanå",
   "Stationsnummer": 107650,
   "Latitud": 60.5829,
   "Longitud": 17.4465,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högstorp",
   "Stationsnummer": 74740,
   "Latitud": 57.85,
   "Longitud": 14.4833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Böket",
   "Stationsnummer": 65280,
   "Latitud": 56.4333,
   "Longitud": 15.0167,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Arbrå",
   "Stationsnummer": 116600,
   "Latitud": 61.4827,
   "Longitud": 16.3801,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jäkna",
   "Stationsnummer": 169030,
   "Latitud": 66.05,
   "Longitud": 19.02,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kurrarp",
   "Stationsnummer": 53170,
   "Latitud": 55.5556,
   "Longitud": 13.5417,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Adelsberg",
   "Stationsnummer": 76510,
   "Latitud": 57.8667,
   "Longitud": 16.0667,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Badstuguhöjden",
   "Stationsnummer": 127580,
   "Latitud": 62.9,
   "Longitud": 17.2667,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Edeby",
   "Stationsnummer": 97600,
   "Latitud": 59.4497,
   "Longitud": 16.9967,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Osby I",
   "Stationsnummer": 63210,
   "Latitud": 56.3778,
   "Longitud": 13.9778,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bobbenarve",
   "Stationsnummer": 78050,
   "Latitud": 57.0333,
   "Longitud": 18.2833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Båstad",
   "Stationsnummer": 62600,
   "Latitud": 56.45,
   "Longitud": 12.7974,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Iggesund",
   "Stationsnummer": 117200,
   "Latitud": 61.65,
   "Longitud": 17.0889,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högfors",
   "Stationsnummer": 92580,
   "Latitud": 59.9833,
   "Longitud": 12.8167,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kurön",
   "Stationsnummer": 97720,
   "Latitud": 59.325,
   "Longitud": 17.4972,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fröbol",
   "Stationsnummer": 92440,
   "Latitud": 59.6542,
   "Longitud": 12.4583,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bie",
   "Stationsnummer": 96610,
   "Latitud": 59.083,
   "Longitud": 16.2135,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lappträsk",
   "Stationsnummer": 173020,
   "Latitud": 66.0323,
   "Longitud": 23.512,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Flen",
   "Stationsnummer": 104160,
   "Latitud": 60.3167,
   "Longitud": 14.7667,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björklinge",
   "Stationsnummer": 107030,
   "Latitud": 60.0514,
   "Longitud": 17.5667,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ekby",
   "Stationsnummer": 83330,
   "Latitud": 58.625,
   "Longitud": 13.8694,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Aapua",
   "Stationsnummer": 173010,
   "Latitud": 66.8656,
   "Longitud": 23.4951,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fröseke",
   "Stationsnummer": 65570,
   "Latitud": 56.9486,
   "Longitud": 15.7819,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Broby Skolhem",
   "Stationsnummer": 86620,
   "Latitud": 58.4665,
   "Longitud": 16.2968,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bernshammar",
   "Stationsnummer": 95600,
   "Latitud": 59.6663,
   "Longitud": 15.7636,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Öster Säby",
   "Stationsnummer": 96760,
   "Latitud": 59.433,
   "Longitud": 16.2302,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gottröra",
   "Stationsnummer": 98430,
   "Latitud": 59.7236,
   "Longitud": 18.1708,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högbränna",
   "Stationsnummer": 138410,
   "Latitud": 63.7361,
   "Longitud": 18.6278,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gästrike-Hammarby III",
   "Stationsnummer": 106690,
   "Latitud": 60.5503,
   "Longitud": 16.5833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Forshem",
   "Stationsnummer": 83380,
   "Latitud": 58.6125,
   "Longitud": 13.5,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björkåsen",
   "Stationsnummer": 82390,
   "Latitud": 58.65,
   "Longitud": 12.6333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ågården",
   "Stationsnummer": 92600,
   "Latitud": 59.183,
   "Longitud": 12.0141,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Blankafors",
   "Stationsnummer": 94350,
   "Latitud": 59.5333,
   "Longitud": 14.7167,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fageråsdammen",
   "Stationsnummer": 102520,
   "Latitud": 60.8639,
   "Longitud": 12.8903,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jönköpings Gamla Flygplats",
   "Stationsnummer": 74450,
   "Latitud": 57.75,
   "Longitud": 14.17,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Äspered",
   "Stationsnummer": 73690,
   "Latitud": 57.9331,
   "Longitud": 13.1805,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hälla",
   "Stationsnummer": 95260,
   "Latitud": 59.4222,
   "Longitud": 15.6056,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västernäs",
   "Stationsnummer": 98520,
   "Latitud": 59.7111,
   "Longitud": 18.9833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ed",
   "Stationsnummer": 74610,
   "Latitud": 57.0832,
   "Longitud": 14.1639,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åsbro",
   "Stationsnummer": 95700,
   "Latitud": 58.9998,
   "Longitud": 15.0302,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bjurvattnet",
   "Stationsnummer": 138710,
   "Latitud": 63.8825,
   "Longitud": 18.9461,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Haggården",
   "Stationsnummer": 105170,
   "Latitud": 60.2672,
   "Longitud": 15.9813,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Erken",
   "Stationsnummer": 98480,
   "Latitud": 59.8333,
   "Longitud": 18.6292,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kronobergshed",
   "Stationsnummer": 64570,
   "Latitud": 56.9769,
   "Longitud": 14.575,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östra Trättlanda",
   "Stationsnummer": 92150,
   "Latitud": 59.2833,
   "Longitud": 12.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Brevik",
   "Stationsnummer": 98280,
   "Latitud": 59.35,
   "Longitud": 18.2,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lannaskede",
   "Stationsnummer": 74640,
   "Latitud": 57.3832,
   "Longitud": 14.8638,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Drottningtorp",
   "Stationsnummer": 84680,
   "Latitud": 58.0999,
   "Longitud": 14.8304,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Adelsnäs",
   "Stationsnummer": 85600,
   "Latitud": 58.1998,
   "Longitud": 15.9802,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Älvhöjden",
   "Stationsnummer": 94560,
   "Latitud": 59.9978,
   "Longitud": 14.7889,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Arlöv sockerbruk",
   "Stationsnummer": 53770,
   "Latitud": 55.6333,
   "Longitud": 13.0667,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hedenstorp",
   "Stationsnummer": 74410,
   "Latitud": 57.7653,
   "Longitud": 14.1111,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fanbergstorp",
   "Stationsnummer": 136050,
   "Latitud": 63.0764,
   "Longitud": 16.7083,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hjälsta by",
   "Stationsnummer": 97470,
   "Latitud": 59.6944,
   "Longitud": 17.3944,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Romanäs",
   "Stationsnummer": 85010,
   "Latitud": 58.0694,
   "Longitud": 15.0222,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stenhamra",
   "Stationsnummer": 97570,
   "Latitud": 59.3389,
   "Longitud": 17.675,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sånnahult",
   "Stationsnummer": 64390,
   "Latitud": 56.5875,
   "Longitud": 14.8014,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hamra",
   "Stationsnummer": 97060,
   "Latitud": 59.2167,
   "Longitud": 17.85,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Exens flygplats",
   "Stationsnummer": 63470,
   "Latitud": 56.6778,
   "Longitud": 13.7792,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grönskär",
   "Stationsnummer": 99150,
   "Latitud": 59.2792,
   "Longitud": 19.0306,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grönåsen",
   "Stationsnummer": 65610,
   "Latitud": 56.8332,
   "Longitud": 15.447,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Steneryd",
   "Stationsnummer": 65620,
   "Latitud": 56.1334,
   "Longitud": 15.8303,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grannäs",
   "Stationsnummer": 93730,
   "Latitud": 59.4333,
   "Longitud": 13.8333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stormyrheden",
   "Stationsnummer": 159600,
   "Latitud": 65.78,
   "Longitud": 19.38,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lierna",
   "Stationsnummer": 63090,
   "Latitud": 56.0264,
   "Longitud": 13.2375,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mjöhult",
   "Stationsnummer": 62170,
   "Latitud": 56.1764,
   "Longitud": 12.6819,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ingmarsö",
   "Stationsnummer": 98340,
   "Latitud": 59.4806,
   "Longitud": 18.7611,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vängsö",
   "Stationsnummer": 97620,
   "Latitud": 59.1166,
   "Longitud": 17.2,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nibbla",
   "Stationsnummer": 97040,
   "Latitud": 59.2889,
   "Longitud": 17.7292,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lovö kyrka",
   "Stationsnummer": 97430,
   "Latitud": 59.3236,
   "Longitud": 17.8417,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ökna",
   "Stationsnummer": 87520,
   "Latitud": 59.0833,
   "Longitud": 16.3167,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åtorps kraftverk",
   "Stationsnummer": 94040,
   "Latitud": 59.1,
   "Longitud": 14.35,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gersebacken",
   "Stationsnummer": 84700,
   "Latitud": 58.7497,
   "Longitud": 14.3305,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Övre Gränsö",
   "Stationsnummer": 86700,
   "Latitud": 58.35,
   "Longitud": 16.8333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Blåbärskullen",
   "Stationsnummer": 92550,
   "Latitud": 59.8333,
   "Longitud": 12.8833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Orrskog",
   "Stationsnummer": 107220,
   "Latitud": 60.3833,
   "Longitud": 17.4167,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Saltoluokta",
   "Stationsnummer": 178680,
   "Latitud": 67.3833,
   "Longitud": 18.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sätra",
   "Stationsnummer": 97300,
   "Latitud": 59.3819,
   "Longitud": 17.5958,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Höganäs",
   "Stationsnummer": 62160,
   "Latitud": 56.1917,
   "Longitud": 12.6014,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Valar",
   "Stationsnummer": 78030,
   "Latitud": 57.0278,
   "Longitud": 18.2194,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rastaborg",
   "Stationsnummer": 97020,
   "Latitud": 59.3042,
   "Longitud": 17.6542,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ängsäter",
   "Stationsnummer": 97080,
   "Latitud": 59.3833,
   "Longitud": 17.7,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ekerö kyrka",
   "Stationsnummer": 97360,
   "Latitud": 59.2806,
   "Longitud": 17.7514,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gråtbäck",
   "Stationsnummer": 114300,
   "Latitud": 61.4139,
   "Longitud": 14.7528,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Härslätt",
   "Stationsnummer": 81580,
   "Latitud": 58.75,
   "Longitud": 11.9833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Frölunda",
   "Stationsnummer": 97420,
   "Latitud": 59.4597,
   "Longitud": 17.7125,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Teckomatorp",
   "Stationsnummer": 53580,
   "Latitud": 55.8778,
   "Longitud": 13.0917,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sandbro",
   "Stationsnummer": 107050,
   "Latitud": 60.0042,
   "Longitud": 17.5833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Morups Tånge",
   "Stationsnummer": 62620,
   "Latitud": 56.9332,
   "Longitud": 12.3641,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rinkaby",
   "Stationsnummer": 64600,
   "Latitud": 55.9833,
   "Longitud": 14.2666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Aneboda II",
   "Stationsnummer": 74600,
   "Latitud": 57.1167,
   "Longitud": 14.5639,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Århult",
   "Stationsnummer": 83680,
   "Latitud": 58.5664,
   "Longitud": 13.7139,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Likenäs",
   "Stationsnummer": 103600,
   "Latitud": 60.6496,
   "Longitud": 13.014,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gammelstilla",
   "Stationsnummer": 106600,
   "Latitud": 60.4328,
   "Longitud": 16.6134,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lågbol",
   "Stationsnummer": 108660,
   "Latitud": 60.0164,
   "Longitud": 18.4131,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ånn",
   "Stationsnummer": 132670,
   "Latitud": 63.3159,
   "Longitud": 12.5305,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fjälkvarn",
   "Stationsnummer": 135600,
   "Latitud": 63.2659,
   "Longitud": 15.0468,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Näsbrännan",
   "Stationsnummer": 136600,
   "Latitud": 63.216,
   "Longitud": 16.9798,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Brännbergs försöksgård",
   "Stationsnummer": 161660,
   "Latitud": 65.8,
   "Longitud": 21.2666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Naisheden",
   "Stationsnummer": 172680,
   "Latitud": 66.5333,
   "Longitud": 22.3666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Solsidan",
   "Stationsnummer": 97560,
   "Latitud": 59.4,
   "Longitud": 17.5639,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tännäs II",
   "Stationsnummer": 132700,
   "Latitud": 62.4431,
   "Longitud": 12.6958,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Överkalix I",
   "Stationsnummer": 172760,
   "Latitud": 66.3333,
   "Longitud": 22.85,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skivarp",
   "Stationsnummer": 53670,
   "Latitud": 55.4334,
   "Longitud": 13.5805,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Aspa bruk",
   "Stationsnummer": 84670,
   "Latitud": 58.7664,
   "Longitud": 14.7971,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ålandsdal",
   "Stationsnummer": 97700,
   "Latitud": 59.8663,
   "Longitud": 17.2799,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Spargott",
   "Stationsnummer": 52570,
   "Latitud": 55.9417,
   "Longitud": 12.9653,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björnegården",
   "Stationsnummer": 83640,
   "Latitud": 58.5166,
   "Longitud": 13.0666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Spethult",
   "Stationsnummer": 84770,
   "Latitud": 58.4997,
   "Longitud": 14.3139,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Virsbo",
   "Stationsnummer": 96570,
   "Latitud": 59.8667,
   "Longitud": 16.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Såtång",
   "Stationsnummer": 93620,
   "Latitud": 59.483,
   "Longitud": 13.8139,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tegen",
   "Stationsnummer": 92270,
   "Latitud": 59.3972,
   "Longitud": 12.3889,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kärnskogen",
   "Stationsnummer": 85650,
   "Latitud": 58.85,
   "Longitud": 15.2833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lönsboda",
   "Stationsnummer": 64660,
   "Latitud": 56.4,
   "Longitud": 14.3305,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kalmar",
   "Stationsnummer": 66640,
   "Latitud": 56.67,
   "Longitud": 16.35,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skattlösberg",
   "Stationsnummer": 104720,
   "Latitud": 60.1828,
   "Longitud": 14.7303,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Junosuando",
   "Stationsnummer": 182830,
   "Latitud": 67.4236,
   "Longitud": 22.5444,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nausta",
   "Stationsnummer": 169010,
   "Latitud": 66.3666,
   "Longitud": 19.3,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Botorp",
   "Stationsnummer": 74710,
   "Latitud": 57.9833,
   "Longitud": 14.75,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hällsjön",
   "Stationsnummer": 105720,
   "Latitud": 60.0333,
   "Longitud": 15.15,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bjärbolund",
   "Stationsnummer": 62730,
   "Latitud": 56.1833,
   "Longitud": 12.7666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Klagstorp",
   "Stationsnummer": 83670,
   "Latitud": 58.3331,
   "Longitud": 13.8804,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Askersund",
   "Stationsnummer": 84660,
   "Latitud": 58.88,
   "Longitud": 14.9,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stavrumstorp",
   "Stationsnummer": 94650,
   "Latitud": 59.5163,
   "Longitud": 14.7637,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Flodafors",
   "Stationsnummer": 96600,
   "Latitud": 59.0666,
   "Longitud": 16.3666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Aske",
   "Stationsnummer": 97630,
   "Latitud": 59.6166,
   "Longitud": 17.65,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gärdsjö",
   "Stationsnummer": 106720,
   "Latitud": 60.9333,
   "Longitud": 15.2333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fränsta",
   "Stationsnummer": 126630,
   "Latitud": 62.5,
   "Longitud": 16.1833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Oldsjön",
   "Stationsnummer": 137720,
   "Latitud": 63.3333,
   "Longitud": 17.4833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bredträsk",
   "Stationsnummer": 138720,
   "Latitud": 63.8833,
   "Longitud": 18.6,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Granberget",
   "Stationsnummer": 145710,
   "Latitud": 64.3,
   "Longitud": 15.9166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hednoret",
   "Stationsnummer": 161650,
   "Latitud": 65.8333,
   "Longitud": 21.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sarkavara",
   "Stationsnummer": 170680,
   "Latitud": 66.7374,
   "Longitud": 20.3605,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nattavaara",
   "Stationsnummer": 170690,
   "Latitud": 66.7666,
   "Longitud": 20.9666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Valinge",
   "Stationsnummer": 86530,
   "Latitud": 58.7944,
   "Longitud": 16.6833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Klamby",
   "Stationsnummer": 53740,
   "Latitud": 55.6666,
   "Longitud": 13.7333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vassbo",
   "Stationsnummer": 105630,
   "Latitud": 60.5333,
   "Longitud": 15.5333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vad",
   "Stationsnummer": 84710,
   "Latitud": 58.5666,
   "Longitud": 14.0166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ödebyn",
   "Stationsnummer": 82650,
   "Latitud": 58.7833,
   "Longitud": 12.1833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Noreborg",
   "Stationsnummer": 92710,
   "Latitud": 59.7666,
   "Longitud": 12.3333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östernäs",
   "Stationsnummer": 99710,
   "Latitud": 59.7166,
   "Longitud": 19,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storjungfrun",
   "Stationsnummer": 117610,
   "Latitud": 61.1666,
   "Longitud": 17.3333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Asmundtorp",
   "Stationsnummer": 52530,
   "Latitud": 55.8833,
   "Longitud": 12.95,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hilleshög",
   "Stationsnummer": 52560,
   "Latitud": 55.925,
   "Longitud": 12.8472,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högestad",
   "Stationsnummer": 53730,
   "Latitud": 55.5,
   "Longitud": 13.8833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bällefors",
   "Stationsnummer": 84620,
   "Latitud": 58.5833,
   "Longitud": 14.1166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skorped",
   "Stationsnummer": 137710,
   "Latitud": 63.3833,
   "Longitud": 17.8666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kyrkberg",
   "Stationsnummer": 156020,
   "Latitud": 65.2666,
   "Longitud": 16.7666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Saltmyran",
   "Stationsnummer": 159680,
   "Latitud": 65.4166,
   "Longitud": 19.5,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Röslöv",
   "Stationsnummer": 63710,
   "Latitud": 56.0166,
   "Longitud": 13.7166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ursholmen",
   "Stationsnummer": 81640,
   "Latitud": 58.8333,
   "Longitud": 11,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stråssa",
   "Stationsnummer": 95450,
   "Latitud": 59.7486,
   "Longitud": 15.2056,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högstena",
   "Stationsnummer": 83610,
   "Latitud": 58.2333,
   "Longitud": 13.7166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Forsnäs",
   "Stationsnummer": 75710,
   "Latitud": 57.85,
   "Longitud": 15.2166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Söråker",
   "Stationsnummer": 127630,
   "Latitud": 62.5166,
   "Longitud": 17.5166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kyvik",
   "Stationsnummer": 71710,
   "Latitud": 57.55,
   "Longitud": 11.9666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Pater noster",
   "Stationsnummer": 71720,
   "Latitud": 57.9,
   "Longitud": 11.4666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åmotfors",
   "Stationsnummer": 92470,
   "Latitud": 59.7666,
   "Longitud": 12.3639,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gränna",
   "Stationsnummer": 84610,
   "Latitud": 58.0333,
   "Longitud": 14.4666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jäders bruk",
   "Stationsnummer": 95710,
   "Latitud": 59.4,
   "Longitud": 15.8,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hällnäs Skogsskola",
   "Stationsnummer": 149710,
   "Latitud": 64.3333,
   "Longitud": 19.5,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bölestrand",
   "Stationsnummer": 136610,
   "Latitud": 63.1333,
   "Longitud": 16.15,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åhus",
   "Stationsnummer": 54720,
   "Latitud": 55.9166,
   "Longitud": 14.2833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hallands väderö",
   "Stationsnummer": 62630,
   "Latitud": 56.45,
   "Longitud": 12.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Egernahult",
   "Stationsnummer": 63720,
   "Latitud": 56.6166,
   "Longitud": 13.3833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Väderöbod",
   "Stationsnummer": 81620,
   "Latitud": 58.55,
   "Longitud": 11.0333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lurö",
   "Stationsnummer": 83650,
   "Latitud": 58.8,
   "Longitud": 13.25,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Koppartorp",
   "Stationsnummer": 86710,
   "Latitud": 58.6333,
   "Longitud": 16.9,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sunne",
   "Stationsnummer": 93650,
   "Latitud": 59.85,
   "Longitud": 13.1666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norra Viggen",
   "Stationsnummer": 102710,
   "Latitud": 60.4833,
   "Longitud": 12.7166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bullerforsen",
   "Stationsnummer": 105610,
   "Latitud": 60.4996,
   "Longitud": 15.4303,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Katrineberg",
   "Stationsnummer": 116720,
   "Latitud": 61.0666,
   "Longitud": 16.3,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gisselås",
   "Stationsnummer": 135640,
   "Latitud": 63.7,
   "Longitud": 15.3666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Knaften",
   "Stationsnummer": 148710,
   "Latitud": 64.45,
   "Longitud": 18.6333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norrtälje",
   "Stationsnummer": 98450,
   "Latitud": 59.7667,
   "Longitud": 18.7167,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Älvestorp",
   "Stationsnummer": 94440,
   "Latitud": 59.6333,
   "Longitud": 14.5667,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högskogen",
   "Stationsnummer": 106710,
   "Latitud": 60.0166,
   "Longitud": 17.2166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stalon I",
   "Stationsnummer": 145560,
   "Latitud": 64.9503,
   "Longitud": 15.8292,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vekafors",
   "Stationsnummer": 73710,
   "Latitud": 57.1,
   "Longitud": 13.7333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vittskövle",
   "Stationsnummer": 54710,
   "Latitud": 55.85,
   "Longitud": 14.1333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kittelfjäll",
   "Stationsnummer": 155680,
   "Latitud": 65.25,
   "Longitud": 15.5,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västra Lagnö",
   "Stationsnummer": 98720,
   "Latitud": 59.5333,
   "Longitud": 18.75,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lindome",
   "Stationsnummer": 72710,
   "Latitud": 57.5833,
   "Longitud": 12.1,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tidaholm",
   "Stationsnummer": 83720,
   "Latitud": 58.1833,
   "Longitud": 13.9666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hagåsen",
   "Stationsnummer": 84720,
   "Latitud": 58.4333,
   "Longitud": 14.1,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Granvik",
   "Stationsnummer": 84730,
   "Latitud": 58.6331,
   "Longitud": 14.547,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mjölby",
   "Stationsnummer": 85710,
   "Latitud": 58.3333,
   "Longitud": 15.15,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sälgvålen",
   "Stationsnummer": 93660,
   "Latitud": 59.75,
   "Longitud": 13.23,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Alstrum",
   "Stationsnummer": 93720,
   "Latitud": 59.4833,
   "Longitud": 13.6,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kärrgruvan",
   "Stationsnummer": 105710,
   "Latitud": 60.0829,
   "Longitud": 15.9469,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tjäderåsen",
   "Stationsnummer": 114710,
   "Latitud": 61.5666,
   "Longitud": 14.5,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Krokströmmen",
   "Stationsnummer": 124710,
   "Latitud": 62.05,
   "Longitud": 14.9,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Klutmark",
   "Stationsnummer": 150640,
   "Latitud": 64.75,
   "Longitud": 20.6333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nordanås",
   "Stationsnummer": 157020,
   "Latitud": 65.6333,
   "Longitud": 17.7333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Weibullsholm",
   "Stationsnummer": 52620,
   "Latitud": 55.8722,
   "Longitud": 12.8556,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västra Ny",
   "Stationsnummer": 85630,
   "Latitud": 58.65,
   "Longitud": 15.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Djurö",
   "Stationsnummer": 98710,
   "Latitud": 59.3166,
   "Longitud": 18.7333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ora",
   "Stationsnummer": 108710,
   "Latitud": 60.02,
   "Longitud": 18.08,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Strand",
   "Stationsnummer": 139710,
   "Latitud": 63.8666,
   "Longitud": 19.9,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Boarp",
   "Stationsnummer": 62720,
   "Latitud": 56.3333,
   "Longitud": 12.9333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Aneboda I",
   "Stationsnummer": 74730,
   "Latitud": 57.1166,
   "Longitud": 14.5666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åmmeberg",
   "Stationsnummer": 85730,
   "Latitud": 58.8664,
   "Longitud": 14.997,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hålabäck",
   "Stationsnummer": 64710,
   "Latitud": 56.1166,
   "Longitud": 14.6166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Strandvallen",
   "Stationsnummer": 74650,
   "Latitud": 57.85,
   "Longitud": 14.2833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Trollhättan",
   "Stationsnummer": 82620,
   "Latitud": 58.3,
   "Longitud": 12.3166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mo",
   "Stationsnummer": 133630,
   "Latitud": 63.3166,
   "Longitud": 13.4833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mölnbacka",
   "Stationsnummer": 93710,
   "Latitud": 59.6333,
   "Longitud": 13.5666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ringseröd",
   "Stationsnummer": 81710,
   "Latitud": 58.1333,
   "Longitud": 11.7,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storfjället-Sälen",
   "Stationsnummer": 113610,
   "Latitud": 61.1666,
   "Longitud": 13.1166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ekebo",
   "Stationsnummer": 53710,
   "Latitud": 55.95,
   "Longitud": 13.1333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stenträsk",
   "Stationsnummer": 169020,
   "Latitud": 66.3166,
   "Longitud": 19.8333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stora Fjäderägg",
   "Stationsnummer": 141710,
   "Latitud": 63.8,
   "Longitud": 21,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sjöslätt",
   "Stationsnummer": 108670,
   "Latitud": 60.025,
   "Longitud": 18.35,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gräsfall",
   "Stationsnummer": 102700,
   "Latitud": 60.4472,
   "Longitud": 12.7167,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ryd",
   "Stationsnummer": 64620,
   "Latitud": 56.45,
   "Longitud": 14.7166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Emmaboda",
   "Stationsnummer": 65640,
   "Latitud": 56.6333,
   "Longitud": 15.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ölvingstorp",
   "Stationsnummer": 66630,
   "Latitud": 56.6166,
   "Longitud": 16.1166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kållared",
   "Stationsnummer": 73720,
   "Latitud": 57.8833,
   "Longitud": 13.0666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Viby",
   "Stationsnummer": 86720,
   "Latitud": 58.4166,
   "Longitud": 16.1666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tyngsjö",
   "Stationsnummer": 104710,
   "Latitud": 60.3,
   "Longitud": 13.8833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Domnarvet",
   "Stationsnummer": 105640,
   "Latitud": 60.5,
   "Longitud": 15.45,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gästrike-Hammarby IV",
   "Stationsnummer": 106630,
   "Latitud": 60.55,
   "Longitud": 16.5833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Öregrund",
   "Stationsnummer": 108640,
   "Latitud": 60.3333,
   "Longitud": 18.4333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Noppikoski",
   "Stationsnummer": 114630,
   "Latitud": 61.5,
   "Longitud": 14.85,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Backarna",
   "Stationsnummer": 117710,
   "Latitud": 61.5666,
   "Longitud": 16.3,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Viken",
   "Stationsnummer": 125710,
   "Latitud": 62.3833,
   "Longitud": 15.1666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gran",
   "Stationsnummer": 127600,
   "Latitud": 62.0166,
   "Longitud": 17.6333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Graninge",
   "Stationsnummer": 136710,
   "Latitud": 63.0666,
   "Longitud": 16.95,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lungsjöbacken",
   "Stationsnummer": 136720,
   "Latitud": 63.4666,
   "Longitud": 16.2666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ankarvattnet",
   "Stationsnummer": 144650,
   "Latitud": 64.8666,
   "Longitud": 14.25,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storön",
   "Stationsnummer": 144710,
   "Latitud": 64.6333,
   "Longitud": 14.1166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björkfors",
   "Stationsnummer": 163680,
   "Latitud": 65.9166,
   "Longitud": 23.4666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storkölen",
   "Stationsnummer": 172010,
   "Latitud": 66.2666,
   "Longitud": 22.3,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kulbäcksliden",
   "Stationsnummer": 149610,
   "Latitud": 64.2,
   "Longitud": 19.5666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mykinge",
   "Stationsnummer": 74720,
   "Latitud": 57.9,
   "Longitud": 14.3166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Niannoret",
   "Stationsnummer": 116740,
   "Latitud": 61.6,
   "Longitud": 16.6,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skån",
   "Stationsnummer": 125600,
   "Latitud": 62.1494,
   "Longitud": 15.0801,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Oxelby",
   "Stationsnummer": 96730,
   "Latitud": 59.55,
   "Longitud": 16.2166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Uttersberg",
   "Stationsnummer": 95640,
   "Latitud": 59.75,
   "Longitud": 15.6666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Torpaslätt",
   "Stationsnummer": 96720,
   "Latitud": 59.4166,
   "Longitud": 16.2,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rickleå",
   "Stationsnummer": 150090,
   "Latitud": 64.0875,
   "Longitud": 20.9444,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hököpinge",
   "Stationsnummer": 53630,
   "Latitud": 55.5,
   "Longitud": 13.0166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hasselfors",
   "Stationsnummer": 94710,
   "Latitud": 59.1,
   "Longitud": 14.65,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Staffanstorp",
   "Stationsnummer": 53720,
   "Latitud": 55.65,
   "Longitud": 13.2166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ängelholm",
   "Stationsnummer": 62710,
   "Latitud": 56.25,
   "Longitud": 12.85,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högaryd",
   "Stationsnummer": 63730,
   "Latitud": 56.7166,
   "Longitud": 13.1666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Falsterbo Skola",
   "Stationsnummer": 76610,
   "Latitud": 57.65,
   "Longitud": 16.37,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ekeby",
   "Stationsnummer": 85720,
   "Latitud": 58.9333,
   "Longitud": 15.9333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lönnhöjden",
   "Stationsnummer": 102720,
   "Latitud": 60.0166,
   "Longitud": 12.8333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björn",
   "Stationsnummer": 107620,
   "Latitud": 60.6333,
   "Longitud": 17.9833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Österby",
   "Stationsnummer": 107640,
   "Latitud": 60.1996,
   "Longitud": 17.8965,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hasberget",
   "Stationsnummer": 115710,
   "Latitud": 61.4333,
   "Longitud": 14.85,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tännäs I",
   "Stationsnummer": 132710,
   "Latitud": 62.4333,
   "Longitud": 12.6833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vinliden",
   "Stationsnummer": 147710,
   "Latitud": 64.6333,
   "Longitud": 17.8666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Abborrberg",
   "Stationsnummer": 157010,
   "Latitud": 65.4833,
   "Longitud": 16.6,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bredviken",
   "Stationsnummer": 164720,
   "Latitud": 66.1167,
   "Longitud": 14.75,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kaitum",
   "Stationsnummer": 180010,
   "Latitud": 67.5333,
   "Longitud": 20.1166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vallsta",
   "Stationsnummer": 116320,
   "Latitud": 61.5167,
   "Longitud": 16.3694,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Töreboda",
   "Stationsnummer": 84650,
   "Latitud": 58.7166,
   "Longitud": 14.1333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sunderbyn",
   "Stationsnummer": 161680,
   "Latitud": 65.7,
   "Longitud": 21.85,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Boxholm",
   "Stationsnummer": 85620,
   "Latitud": 58.2,
   "Longitud": 15.0833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bollnäs",
   "Stationsnummer": 116730,
   "Latitud": 61.35,
   "Longitud": 16.4166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Alnarp",
   "Stationsnummer": 53640,
   "Latitud": 55.65,
   "Longitud": 13.0833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gärsnäs",
   "Stationsnummer": 54650,
   "Latitud": 55.55,
   "Longitud": 14.1833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hörlinge",
   "Stationsnummer": 63620,
   "Latitud": 56.2,
   "Longitud": 13.6833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tynderö",
   "Stationsnummer": 127710,
   "Latitud": 62.45,
   "Longitud": 17.6166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ulfshyttan",
   "Stationsnummer": 105620,
   "Latitud": 60.3,
   "Longitud": 15.3833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Klädesholmen",
   "Stationsnummer": 71660,
   "Latitud": 57.95,
   "Longitud": 11.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högsäter",
   "Stationsnummer": 91660,
   "Latitud": 59.88,
   "Longitud": 11.97,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tyllinge",
   "Stationsnummer": 86610,
   "Latitud": 58.0166,
   "Longitud": 16.0833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skärblacka",
   "Stationsnummer": 85640,
   "Latitud": 58.5666,
   "Longitud": 15.9,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stora Ekeberg",
   "Stationsnummer": 83180,
   "Latitud": 58.4056,
   "Longitud": 13.5417,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Södra Viggen",
   "Stationsnummer": 102690,
   "Latitud": 60.45,
   "Longitud": 12.7069,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Väckelsång",
   "Stationsnummer": 64640,
   "Latitud": 56.65,
   "Longitud": 14.9166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nol",
   "Stationsnummer": 72660,
   "Latitud": 57.9166,
   "Longitud": 12.0666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stora Sundby-Alberga",
   "Stationsnummer": 96620,
   "Latitud": 59.2666,
   "Longitud": 16.1166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Finngrundets Fyrskepp",
   "Stationsnummer": 118610,
   "Latitud": 61.0666,
   "Longitud": 18.6833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skalmsjö",
   "Stationsnummer": 137640,
   "Latitud": 63.5166,
   "Longitud": 17.7666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Trollebo",
   "Stationsnummer": 75620,
   "Latitud": 57.3166,
   "Longitud": 15.3,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Holmsberg",
   "Stationsnummer": 108620,
   "Latitud": 60.0166,
   "Longitud": 18.3333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Säbyholm",
   "Stationsnummer": 52660,
   "Latitud": 55.9,
   "Longitud": 12.8333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rönnskär",
   "Stationsnummer": 161670,
   "Latitud": 65.0333,
   "Longitud": 21.5666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björkliden",
   "Stationsnummer": 188680,
   "Latitud": 68.38,
   "Longitud": 18.68,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sundmo",
   "Stationsnummer": 136640,
   "Latitud": 63.5,
   "Longitud": 16.7,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sutterhöjden",
   "Stationsnummer": 93640,
   "Latitud": 59.5833,
   "Longitud": 13.9333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hoberg",
   "Stationsnummer": 132660,
   "Latitud": 63.85,
   "Longitud": 12.9833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nyland",
   "Stationsnummer": 147630,
   "Latitud": 64.4833,
   "Longitud": 17.3333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kalix",
   "Stationsnummer": 163690,
   "Latitud": 65.85,
   "Longitud": 23.2,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hållö",
   "Stationsnummer": 81630,
   "Latitud": 58.3333,
   "Longitud": 11.2166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gryt",
   "Stationsnummer": 85660,
   "Latitud": 58.9,
   "Longitud": 15.3666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Råforsen",
   "Stationsnummer": 103630,
   "Latitud": 60.45,
   "Longitud": 13.7666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sjöaryd",
   "Stationsnummer": 64630,
   "Latitud": 56.5166,
   "Longitud": 14.75,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hjulsta",
   "Stationsnummer": 97640,
   "Latitud": 59.55,
   "Longitud": 17.0166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tuna",
   "Stationsnummer": 108610,
   "Latitud": 60.0166,
   "Longitud": 18.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Koholma",
   "Stationsnummer": 99650,
   "Latitud": 59.7333,
   "Longitud": 19.0666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Johannisholm",
   "Stationsnummer": 104660,
   "Latitud": 60.8333,
   "Longitud": 14.1333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ängeså",
   "Stationsnummer": 172690,
   "Latitud": 66.75,
   "Longitud": 22.3,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björka",
   "Stationsnummer": 53650,
   "Latitud": 55.7,
   "Longitud": 13.6333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kolleberga",
   "Stationsnummer": 63610,
   "Latitud": 56.0666,
   "Longitud": 13.2666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bäckatorp",
   "Stationsnummer": 94610,
   "Latitud": 59.1333,
   "Longitud": 14.65,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tjusta",
   "Stationsnummer": 97650,
   "Latitud": 59.6,
   "Longitud": 17.6333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tjälsbyn",
   "Stationsnummer": 137660,
   "Latitud": 63.85,
   "Longitud": 17.3833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gullaboås",
   "Stationsnummer": 65630,
   "Latitud": 56.4333,
   "Longitud": 15.8833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vårgårda",
   "Stationsnummer": 82610,
   "Latitud": 58.0166,
   "Longitud": 12.7833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Forsbacka",
   "Stationsnummer": 106640,
   "Latitud": 60.6166,
   "Longitud": 16.9166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Boda",
   "Stationsnummer": 117640,
   "Latitud": 61.5833,
   "Longitud": 17,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västra Banken",
   "Stationsnummer": 107530,
   "Latitud": 60.88,
   "Longitud": 17.93,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tinghalla",
   "Stationsnummer": 73660,
   "Latitud": 57.9666,
   "Longitud": 13.85,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bygdsiljum",
   "Stationsnummer": 150630,
   "Latitud": 64.35,
   "Longitud": 20.5,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Älvsby Skogsskola",
   "Stationsnummer": 161690,
   "Latitud": 65.6833,
   "Longitud": 21.0666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bjuråker",
   "Stationsnummer": 116650,
   "Latitud": 61.85,
   "Longitud": 16.5833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stora Sundby",
   "Stationsnummer": 96630,
   "Latitud": 59.2666,
   "Longitud": 16.1333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tidan",
   "Stationsnummer": 84630,
   "Latitud": 58.55,
   "Longitud": 14,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ryholm",
   "Stationsnummer": 84640,
   "Latitud": 58.5819,
   "Longitud": 14.2167,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Berga",
   "Stationsnummer": 98610,
   "Latitud": 59.0833,
   "Longitud": 18.1166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Farsta",
   "Stationsnummer": 98620,
   "Latitud": 59.3165,
   "Longitud": 18.3664,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rörum",
   "Stationsnummer": 54380,
   "Latitud": 55.6333,
   "Longitud": 14.2666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Knäred",
   "Stationsnummer": 63630,
   "Latitud": 56.5216,
   "Longitud": 13.3369,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fågelnäs",
   "Stationsnummer": 72640,
   "Latitud": 57.7666,
   "Longitud": 12.4166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Härsjönäs",
   "Stationsnummer": 72650,
   "Latitud": 57.75,
   "Longitud": 12.35,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kinnared",
   "Stationsnummer": 73610,
   "Latitud": 57.0333,
   "Longitud": 13.1166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stora Hyltan",
   "Stationsnummer": 74620,
   "Latitud": 57.2,
   "Longitud": 14.25,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Böksholm",
   "Stationsnummer": 75610,
   "Latitud": 57.0833,
   "Longitud": 15,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rings",
   "Stationsnummer": 78430,
   "Latitud": 57.7166,
   "Longitud": 18.6333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mo",
   "Stationsnummer": 81650,
   "Latitud": 58.7,
   "Longitud": 11.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Brålanda",
   "Stationsnummer": 82640,
   "Latitud": 58.5666,
   "Longitud": 12.3666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rånna",
   "Stationsnummer": 83630,
   "Latitud": 58.45,
   "Longitud": 13.8333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Viberg",
   "Stationsnummer": 93630,
   "Latitud": 59.5333,
   "Longitud": 13.85,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tyresö",
   "Stationsnummer": 98150,
   "Latitud": 59.25,
   "Longitud": 18.2833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mossfallet",
   "Stationsnummer": 103610,
   "Latitud": 60.0166,
   "Longitud": 13.9166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hillersbo",
   "Stationsnummer": 106610,
   "Latitud": 60.0666,
   "Longitud": 16.5833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Brämö",
   "Stationsnummer": 127620,
   "Latitud": 62.1299,
   "Longitud": 17.4498,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dalen",
   "Stationsnummer": 133620,
   "Latitud": 63.3166,
   "Longitud": 13.0666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Juktfors",
   "Stationsnummer": 157670,
   "Latitud": 65.2666,
   "Longitud": 17.4833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hult",
   "Stationsnummer": 75060,
   "Latitud": 57.1,
   "Longitud": 15.2333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åre",
   "Stationsnummer": 133230,
   "Latitud": 63.4,
   "Longitud": 13.1,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dungen",
   "Stationsnummer": 73010,
   "Latitud": 57.0166,
   "Longitud": 13.7333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östergarn",
   "Stationsnummer": 78630,
   "Latitud": 57.45,
   "Longitud": 18.9833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ryningsnäs",
   "Stationsnummer": 75160,
   "Latitud": 57.2666,
   "Longitud": 15.9333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skirö",
   "Stationsnummer": 75220,
   "Latitud": 57.3666,
   "Longitud": 15.3833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Arboga",
   "Stationsnummer": 95230,
   "Latitud": 59.3833,
   "Longitud": 15.8333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Byske",
   "Stationsnummer": 151570,
   "Latitud": 64.95,
   "Longitud": 21.2166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kattuvuoma",
   "Stationsnummer": 189780,
   "Latitud": 68.2833,
   "Longitud": 19.9,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Risungs",
   "Stationsnummer": 78490,
   "Latitud": 57.8166,
   "Longitud": 18.9333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mariedal",
   "Stationsnummer": 83290,
   "Latitud": 58.4833,
   "Longitud": 13.4,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Koberg",
   "Stationsnummer": 82100,
   "Latitud": 58.1666,
   "Longitud": 12.4166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Årjäng",
   "Stationsnummer": 92230,
   "Latitud": 59.3833,
   "Longitud": 12.1666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Katrinefors",
   "Stationsnummer": 83430,
   "Latitud": 58.7166,
   "Longitud": 13.8333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Adolfsfors",
   "Stationsnummer": 92480,
   "Latitud": 59.8,
   "Longitud": 12.2333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skara-Ekeberg",
   "Stationsnummer": 83240,
   "Latitud": 58.4,
   "Longitud": 13.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ingelstad",
   "Stationsnummer": 64450,
   "Latitud": 56.75,
   "Longitud": 14.9333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norriån",
   "Stationsnummer": 171780,
   "Latitud": 66.25,
   "Longitud": 21.8,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Harrträsk",
   "Stationsnummer": 180710,
   "Latitud": 67.0333,
   "Longitud": 20.7,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dalkarlsjöhyttan",
   "Stationsnummer": 94570,
   "Latitud": 59.95,
   "Longitud": 14.1333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rånäs",
   "Stationsnummer": 98470,
   "Latitud": 59.7833,
   "Longitud": 18.3,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Väddö",
   "Stationsnummer": 98590,
   "Latitud": 59.9833,
   "Longitud": 18.8166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sågmyra",
   "Stationsnummer": 105430,
   "Latitud": 60.72,
   "Longitud": 15.28,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vallsjön",
   "Stationsnummer": 112070,
   "Latitud": 61.1166,
   "Longitud": 12.8666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Pengsjö",
   "Stationsnummer": 137400,
   "Latitud": 63.6666,
   "Longitud": 17.8,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stornorrfors",
   "Stationsnummer": 140510,
   "Latitud": 63.85,
   "Longitud": 20.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ledningsmark",
   "Stationsnummer": 148270,
   "Latitud": 64.45,
   "Longitud": 18.1333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bergfors",
   "Stationsnummer": 189740,
   "Latitud": 68.15,
   "Longitud": 19.8,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fröslida",
   "Stationsnummer": 63530,
   "Latitud": 56.8666,
   "Longitud": 13.0666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Haby",
   "Stationsnummer": 72280,
   "Latitud": 57.4666,
   "Longitud": 12.65,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Järkvissle",
   "Stationsnummer": 126480,
   "Latitud": 62.8166,
   "Longitud": 16.6833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skånes fagerhult",
   "Stationsnummer": 63230,
   "Latitud": 56.3666,
   "Longitud": 13.4666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lernbo",
   "Stationsnummer": 105090,
   "Latitud": 60.15,
   "Longitud": 15.3166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Våthultström",
   "Stationsnummer": 73190,
   "Latitud": 57.3166,
   "Longitud": 13.4333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gothem",
   "Stationsnummer": 78340,
   "Latitud": 57.5666,
   "Longitud": 18.7666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kristineberg",
   "Stationsnummer": 81150,
   "Latitud": 58.25,
   "Longitud": 11.45,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rankhyttan",
   "Stationsnummer": 105290,
   "Latitud": 60.4833,
   "Longitud": 15.7333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lövsjön",
   "Stationsnummer": 134450,
   "Latitud": 63.75,
   "Longitud": 14.7166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Yxsjö",
   "Stationsnummer": 147170,
   "Latitud": 64.2833,
   "Longitud": 17.5166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rönnberga",
   "Stationsnummer": 156830,
   "Latitud": 65.4333,
   "Longitud": 16.7333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Pitsund",
   "Stationsnummer": 161770,
   "Latitud": 65.23,
   "Longitud": 21.52,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Brunsberg",
   "Stationsnummer": 92370,
   "Latitud": 59.6166,
   "Longitud": 12.9833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Utklippan",
   "Stationsnummer": 55570,
   "Latitud": 55.95,
   "Longitud": 15.7,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mullhyttan",
   "Stationsnummer": 94090,
   "Latitud": 59.15,
   "Longitud": 14.6833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Älvsbyn M",
   "Stationsnummer": 161890,
   "Latitud": 65.68,
   "Longitud": 20.97,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bingsgärde",
   "Stationsnummer": 62240,
   "Latitud": 56.4,
   "Longitud": 12.9666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ambjörnarp",
   "Stationsnummer": 73250,
   "Latitud": 57.4166,
   "Longitud": 13.2833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Borgholm",
   "Stationsnummer": 66530,
   "Latitud": 56.8833,
   "Longitud": 16.6666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sjölund",
   "Stationsnummer": 73360,
   "Latitud": 57.6,
   "Longitud": 13.9333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Krakstad",
   "Stationsnummer": 92110,
   "Latitud": 59.1833,
   "Longitud": 12.4833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Trollenäs",
   "Stationsnummer": 53510,
   "Latitud": 55.8666,
   "Longitud": 13.25,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skromberga",
   "Stationsnummer": 62000,
   "Latitud": 56,
   "Longitud": 12.9833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skara-Stenum",
   "Stationsnummer": 83200,
   "Latitud": 58.37,
   "Longitud": 13.52,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gunnebo",
   "Stationsnummer": 76430,
   "Latitud": 57.7166,
   "Longitud": 16.5333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Höksäter",
   "Stationsnummer": 81530,
   "Latitud": 58.8833,
   "Longitud": 11.8833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stegeborg",
   "Stationsnummer": 86270,
   "Latitud": 58.4333,
   "Longitud": 16.6,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vintersjöhöjden",
   "Stationsnummer": 94550,
   "Latitud": 59.9166,
   "Longitud": 14.35,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storliden",
   "Stationsnummer": 149570,
   "Latitud": 64.95,
   "Longitud": 19.4833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Flatån",
   "Stationsnummer": 104360,
   "Latitud": 60.6,
   "Longitud": 14.4333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kläggeröd",
   "Stationsnummer": 53330,
   "Latitud": 55.5666,
   "Longitud": 13.5166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Smålandsstenar",
   "Stationsnummer": 73100,
   "Latitud": 57.1666,
   "Longitud": 13.4166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Strömstad",
   "Stationsnummer": 81560,
   "Latitud": 58.9333,
   "Longitud": 11.2,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skara-Västerskog",
   "Stationsnummer": 83260,
   "Latitud": 58.38,
   "Longitud": 13.33,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Barkarby",
   "Stationsnummer": 97260,
   "Latitud": 59.4166,
   "Longitud": 17.8833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ekerum",
   "Stationsnummer": 66470,
   "Latitud": 56.7849,
   "Longitud": 16.5812,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Agö",
   "Stationsnummer": 117330,
   "Latitud": 61.55,
   "Longitud": 17.4666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Karlshammar",
   "Stationsnummer": 76090,
   "Latitud": 57.15,
   "Longitud": 16.45,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lyckås",
   "Stationsnummer": 97240,
   "Latitud": 59.4,
   "Longitud": 17.6666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tosterö skola",
   "Stationsnummer": 97230,
   "Latitud": 59.4,
   "Longitud": 17.0333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skinnskatteberg",
   "Stationsnummer": 95500,
   "Latitud": 59.8333,
   "Longitud": 15.6833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storbäcken",
   "Stationsnummer": 112410,
   "Latitud": 61.6833,
   "Longitud": 12.6,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Älvdalen I",
   "Stationsnummer": 114150,
   "Latitud": 61.25,
   "Longitud": 14.0833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nolmyra",
   "Stationsnummer": 107060,
   "Latitud": 60.1,
   "Longitud": 17.1166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Pardixhyttan",
   "Stationsnummer": 93430,
   "Latitud": 59.7166,
   "Longitud": 13.9166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Osebol",
   "Stationsnummer": 103240,
   "Latitud": 60.4,
   "Longitud": 13.2833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kävlinge",
   "Stationsnummer": 53480,
   "Latitud": 55.8,
   "Longitud": 13.1,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åsaborg",
   "Stationsnummer": 83250,
   "Latitud": 58.4166,
   "Longitud": 13.7666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Uråsa",
   "Stationsnummer": 64400,
   "Latitud": 56.6833,
   "Longitud": 14.95,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Medhamn",
   "Stationsnummer": 93080,
   "Latitud": 59.1333,
   "Longitud": 13.9833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Väsby",
   "Stationsnummer": 107180,
   "Latitud": 60.3,
   "Longitud": 17.4333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Karpalund",
   "Stationsnummer": 64040,
   "Latitud": 56.05,
   "Longitud": 14.1,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rimsbo",
   "Stationsnummer": 116080,
   "Latitud": 61.1333,
   "Longitud": 16.1833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lennartsfors",
   "Stationsnummer": 91620,
   "Latitud": 59.3,
   "Longitud": 11.9333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norjeby",
   "Stationsnummer": 64110,
   "Latitud": 56.1166,
   "Longitud": 14.6666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bergnäsudden",
   "Stationsnummer": 158900,
   "Latitud": 65.6666,
   "Longitud": 18.15,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tolsgården",
   "Stationsnummer": 84530,
   "Latitud": 58.8833,
   "Longitud": 14.45,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Degernäs",
   "Stationsnummer": 94160,
   "Latitud": 59.25,
   "Longitud": 14.4666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Laisaliden",
   "Stationsnummer": 155930,
   "Latitud": 65.7666,
   "Longitud": 15.1666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hasslarp",
   "Stationsnummer": 62080,
   "Latitud": 56.1333,
   "Longitud": 12.8166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hjärnarp",
   "Stationsnummer": 62200,
   "Latitud": 56.3166,
   "Longitud": 12.9166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Danielshammar",
   "Stationsnummer": 85080,
   "Latitud": 58.1333,
   "Longitud": 15.25,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tornby",
   "Stationsnummer": 85260,
   "Latitud": 58.4166,
   "Longitud": 15.6166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ljusdal",
   "Stationsnummer": 116500,
   "Latitud": 61.8333,
   "Longitud": 16.1333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hullsjön",
   "Stationsnummer": 126330,
   "Latitud": 62.55,
   "Longitud": 16.7,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Pengfors",
   "Stationsnummer": 139550,
   "Latitud": 63.9333,
   "Longitud": 19.6666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Örtofta",
   "Stationsnummer": 53470,
   "Latitud": 55.7833,
   "Longitud": 13.25,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stora Uttervik",
   "Stationsnummer": 87510,
   "Latitud": 58.85,
   "Longitud": 17.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åmotfors Pappersbruk",
   "Stationsnummer": 92460,
   "Latitud": 59.7666,
   "Longitud": 12.35,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rämshyttan",
   "Stationsnummer": 105200,
   "Latitud": 60.3333,
   "Longitud": 15.2,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storlien",
   "Stationsnummer": 132620,
   "Latitud": 63.3158,
   "Longitud": 12.1009,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tärnaby",
   "Stationsnummer": 155910,
   "Latitud": 65.7166,
   "Longitud": 15.25,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gammalkroppa",
   "Stationsnummer": 94410,
   "Latitud": 59.6833,
   "Longitud": 14.3166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Filipstad",
   "Stationsnummer": 94430,
   "Latitud": 59.7166,
   "Longitud": 14.1666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nyckelby",
   "Stationsnummer": 97180,
   "Latitud": 59.3,
   "Longitud": 17.7166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vissvass",
   "Stationsnummer": 98120,
   "Latitud": 59.2,
   "Longitud": 18.3666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Årsnäs",
   "Stationsnummer": 71560,
   "Latitud": 57.9333,
   "Longitud": 11.7833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stjärnfors",
   "Stationsnummer": 95510,
   "Latitud": 59.8333,
   "Longitud": 15.0166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Untorp",
   "Stationsnummer": 114230,
   "Latitud": 61.3833,
   "Longitud": 14.4166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lejen",
   "Stationsnummer": 104120,
   "Latitud": 60.2,
   "Longitud": 14.4,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Eggegrund",
   "Stationsnummer": 107440,
   "Latitud": 60.7333,
   "Longitud": 17.5666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skara",
   "Stationsnummer": 83620,
   "Latitud": 58.4,
   "Longitud": 13.45,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vanneberga",
   "Stationsnummer": 63060,
   "Latitud": 56.0813,
   "Longitud": 13.9189,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Villands Vånga",
   "Stationsnummer": 64140,
   "Latitud": 56.1803,
   "Longitud": 14.3782,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Axelfors",
   "Stationsnummer": 73270,
   "Latitud": 57.45,
   "Longitud": 13.1,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skålan",
   "Stationsnummer": 124390,
   "Latitud": 62.65,
   "Longitud": 14.1666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rensjönäset",
   "Stationsnummer": 132360,
   "Latitud": 63.6,
   "Longitud": 12.65,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Korpilombolo",
   "Stationsnummer": 173950,
   "Latitud": 66.85,
   "Longitud": 23.0666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lyngby",
   "Stationsnummer": 53350,
   "Latitud": 55.5833,
   "Longitud": 13.3666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Värnamo",
   "Stationsnummer": 74110,
   "Latitud": 57.1833,
   "Longitud": 14.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lundsberg",
   "Stationsnummer": 94300,
   "Latitud": 59.4996,
   "Longitud": 14.1635,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ytterboda",
   "Stationsnummer": 107370,
   "Latitud": 60.6166,
   "Longitud": 17.45,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vårgårda-Hägrunga",
   "Stationsnummer": 82010,
   "Latitud": 58.0166,
   "Longitud": 12.8333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Edebäck",
   "Stationsnummer": 103050,
   "Latitud": 60.0666,
   "Longitud": 13.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vuoddas",
   "Stationsnummer": 171830,
   "Latitud": 66.4083,
   "Longitud": 21.7789,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mellansel",
   "Stationsnummer": 138260,
   "Latitud": 63.4333,
   "Longitud": 18.35,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Holsvattnet",
   "Stationsnummer": 161980,
   "Latitud": 65.9666,
   "Longitud": 21.6,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Brandstad",
   "Stationsnummer": 53420,
   "Latitud": 55.6833,
   "Longitud": 13.7333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dalstuga",
   "Stationsnummer": 115040,
   "Latitud": 61.0666,
   "Longitud": 15.7,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tjulträsk",
   "Stationsnummer": 155990,
   "Latitud": 65.9669,
   "Longitud": 15.955,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Örby",
   "Stationsnummer": 72290,
   "Latitud": 57.4833,
   "Longitud": 12.7,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Torslanda",
   "Stationsnummer": 71430,
   "Latitud": 57.7166,
   "Longitud": 11.7833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Öjebro",
   "Stationsnummer": 85220,
   "Latitud": 58.3833,
   "Longitud": 15.2,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lindö",
   "Stationsnummer": 87560,
   "Latitud": 58.9166,
   "Longitud": 17.0333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vindel-Storsjö",
   "Stationsnummer": 157930,
   "Latitud": 65.7666,
   "Longitud": 17.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gödeberg",
   "Stationsnummer": 74350,
   "Latitud": 57.5666,
   "Longitud": 14.6333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Blankaström",
   "Stationsnummer": 75140,
   "Latitud": 57.2166,
   "Longitud": 15.9166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kräckelbäcken",
   "Stationsnummer": 114330,
   "Latitud": 61.55,
   "Longitud": 14.2,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rögle",
   "Stationsnummer": 62110,
   "Latitud": 56.1833,
   "Longitud": 12.8,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skeen",
   "Stationsnummer": 63460,
   "Latitud": 56.7591,
   "Longitud": 13.6776,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gössäter",
   "Stationsnummer": 83370,
   "Latitud": 58.6166,
   "Longitud": 13.4666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Franshammar",
   "Stationsnummer": 126060,
   "Latitud": 62.1,
   "Longitud": 16.67,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Strömsberg",
   "Stationsnummer": 107240,
   "Latitud": 60.4,
   "Longitud": 17.5833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gällivare",
   "Stationsnummer": 180730,
   "Latitud": 67.1429,
   "Longitud": 20.6586,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Marielund",
   "Stationsnummer": 65130,
   "Latitud": 56.2182,
   "Longitud": 15.5331,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tomta",
   "Stationsnummer": 96480,
   "Latitud": 59.8,
   "Longitud": 16.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Halmstad Flygflottilj",
   "Stationsnummer": 62410,
   "Latitud": 56.6833,
   "Longitud": 12.8333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Svabensverk",
   "Stationsnummer": 115050,
   "Latitud": 61.0442,
   "Longitud": 15.7921,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Långströmmen",
   "Stationsnummer": 124050,
   "Latitud": 62.1166,
   "Longitud": 15,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jönköping",
   "Stationsnummer": 74470,
   "Latitud": 57.7666,
   "Longitud": 14.1833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Haddebo",
   "Stationsnummer": 85550,
   "Latitud": 58.9166,
   "Longitud": 15.3666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Olstorp",
   "Stationsnummer": 75500,
   "Latitud": 57.8333,
   "Longitud": 15.1,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västergarn",
   "Stationsnummer": 78260,
   "Latitud": 57.4333,
   "Longitud": 18.15,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fagerviken",
   "Stationsnummer": 107330,
   "Latitud": 60.542,
   "Longitud": 17.7478,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västerås",
   "Stationsnummer": 96370,
   "Latitud": 59.6166,
   "Longitud": 16.55,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dalsjöfors",
   "Stationsnummer": 73430,
   "Latitud": 57.722,
   "Longitud": 13.1238,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rindö",
   "Stationsnummer": 98250,
   "Latitud": 59.4166,
   "Longitud": 18.3666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ljusne Strömmar",
   "Stationsnummer": 117130,
   "Latitud": 61.2116,
   "Longitud": 17.0852,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Moskojärvi",
   "Stationsnummer": 181810,
   "Latitud": 67.3746,
   "Longitud": 21.0787,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Solberga",
   "Stationsnummer": 71570,
   "Latitud": 57.9525,
   "Longitud": 11.8155,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Falerum",
   "Stationsnummer": 86090,
   "Latitud": 58.1425,
   "Longitud": 16.2102,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nyköpings Flygplats",
   "Stationsnummer": 86480,
   "Latitud": 58.7833,
   "Longitud": 16.9166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Södra Lökaröd",
   "Stationsnummer": 54460,
   "Latitud": 55.7743,
   "Longitud": 14.0913,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fårösund",
   "Stationsnummer": 79520,
   "Latitud": 57.8666,
   "Longitud": 19.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Trollhättans Flygplats",
   "Stationsnummer": 82190,
   "Latitud": 58.3141,
   "Longitud": 12.3292,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Slätvik",
   "Stationsnummer": 156930,
   "Latitud": 65.7833,
   "Longitud": 16.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skellefteå",
   "Stationsnummer": 150450,
   "Latitud": 64.7584,
   "Longitud": 20.9478,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norra Bergnäs",
   "Stationsnummer": 168820,
   "Latitud": 66.3833,
   "Longitud": 18.2333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Röskär",
   "Stationsnummer": 98260,
   "Latitud": 59.4166,
   "Longitud": 18.1666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gislaved",
   "Stationsnummer": 73170,
   "Latitud": 57.2847,
   "Longitud": 13.5324,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Molkom",
   "Stationsnummer": 93360,
   "Latitud": 59.6166,
   "Longitud": 13.75,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Härlöv",
   "Stationsnummer": 64580,
   "Latitud": 56.9666,
   "Longitud": 14.6333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Allgunnen",
   "Stationsnummer": 75040,
   "Latitud": 57.0666,
   "Longitud": 15.9681,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Strängstorp",
   "Stationsnummer": 96030,
   "Latitud": 59.05,
   "Longitud": 16.2166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Möklinta",
   "Stationsnummer": 106050,
   "Latitud": 60.0849,
   "Longitud": 16.5477,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Erikstad Ö",
   "Stationsnummer": 85230,
   "Latitud": 58.3833,
   "Longitud": 15.8166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Strömbacka",
   "Stationsnummer": 116580,
   "Latitud": 61.9572,
   "Longitud": 16.7138,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Villingsberg",
   "Stationsnummer": 94170,
   "Latitud": 59.2833,
   "Longitud": 14.7,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Knislinge",
   "Stationsnummer": 64150,
   "Latitud": 56.2,
   "Longitud": 14.1,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ulvhäll",
   "Stationsnummer": 97210,
   "Latitud": 59.3619,
   "Longitud": 17.044,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Länshult",
   "Stationsnummer": 64370,
   "Latitud": 56.6083,
   "Longitud": 14.0665,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kyrkerud",
   "Stationsnummer": 92630,
   "Latitud": 59.3833,
   "Longitud": 12.1166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mossen",
   "Stationsnummer": 77170,
   "Latitud": 57.2833,
   "Longitud": 17.0042,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lövlund",
   "Stationsnummer": 158970,
   "Latitud": 65.9075,
   "Longitud": 18.1507,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fjälla",
   "Stationsnummer": 73550,
   "Latitud": 57.9166,
   "Longitud": 13.0833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åninge",
   "Stationsnummer": 76520,
   "Latitud": 57.8666,
   "Longitud": 16.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Degersjö",
   "Stationsnummer": 138110,
   "Latitud": 63.1902,
   "Longitud": 18.0314,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östersund",
   "Stationsnummer": 134100,
   "Latitud": 63.1736,
   "Longitud": 14.6786,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norrköping-Kungsängen",
   "Stationsnummer": 86350,
   "Latitud": 58.5842,
   "Longitud": 16.2383,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björkfors",
   "Stationsnummer": 163980,
   "Latitud": 65.9333,
   "Longitud": 23.4666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Svartingstorp",
   "Stationsnummer": 66460,
   "Latitud": 56.786,
   "Longitud": 16.3296,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Trosa",
   "Stationsnummer": 87540,
   "Latitud": 58.9,
   "Longitud": 17.5666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Umeå",
   "Stationsnummer": 140500,
   "Latitud": 63.8302,
   "Longitud": 20.2901,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Majenfors",
   "Stationsnummer": 63300,
   "Latitud": 56.4969,
   "Longitud": 13.4557,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Krogstorp",
   "Stationsnummer": 84070,
   "Latitud": 58.1058,
   "Longitud": 14.0707,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Danskebo",
   "Stationsnummer": 85060,
   "Latitud": 58.106,
   "Longitud": 15.2511,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gångarebo",
   "Stationsnummer": 72010,
   "Latitud": 57.0153,
   "Longitud": 12.916,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kyrkonäs",
   "Stationsnummer": 74500,
   "Latitud": 57.8222,
   "Longitud": 14.7188,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nås",
   "Stationsnummer": 104270,
   "Latitud": 60.4494,
   "Longitud": 14.4825,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Viksbäcken",
   "Stationsnummer": 137030,
   "Latitud": 63.05,
   "Longitud": 17.75,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Törneryd",
   "Stationsnummer": 65140,
   "Latitud": 56.2297,
   "Longitud": 15.0249,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sundsvall",
   "Stationsnummer": 127240,
   "Latitud": 62.4066,
   "Longitud": 17.2664,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dannemora",
   "Stationsnummer": 107120,
   "Latitud": 60.2026,
   "Longitud": 17.9049,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stenshuvud",
   "Stationsnummer": 54400,
   "Latitud": 55.6646,
   "Longitud": 14.2595,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dådran",
   "Stationsnummer": 105570,
   "Latitud": 60.9402,
   "Longitud": 15.5474,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högsön",
   "Stationsnummer": 162970,
   "Latitud": 65.8849,
   "Longitud": 22.3961,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ulriksfors",
   "Stationsnummer": 135500,
   "Latitud": 63.8345,
   "Longitud": 15.6164,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Aktse",
   "Stationsnummer": 178740,
   "Latitud": 67.1498,
   "Longitud": 18.3061,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åkers Styckebruk",
   "Stationsnummer": 97150,
   "Latitud": 59.2511,
   "Longitud": 17.0879,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Knivsta",
   "Stationsnummer": 97440,
   "Latitud": 59.7243,
   "Longitud": 17.8078,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mjölkvattnet",
   "Stationsnummer": 133510,
   "Latitud": 63.85,
   "Longitud": 13.3797,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ringhals",
   "Stationsnummer": 72150,
   "Latitud": 57.253,
   "Longitud": 12.1032,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ökna Lantbruksskola",
   "Stationsnummer": 87550,
   "Latitud": 58.8901,
   "Longitud": 17.1569,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bomsund",
   "Stationsnummer": 135090,
   "Latitud": 63.1506,
   "Longitud": 15.7568,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Leknäs",
   "Stationsnummer": 106110,
   "Latitud": 60.1245,
   "Longitud": 16.588,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nedgården",
   "Stationsnummer": 123570,
   "Latitud": 62.9365,
   "Longitud": 13.2534,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vällingberget",
   "Stationsnummer": 136580,
   "Latitud": 63.971,
   "Longitud": 16.8034,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Beateberg",
   "Stationsnummer": 98410,
   "Latitud": 59.6576,
   "Longitud": 18.4206,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Laisvallsby",
   "Stationsnummer": 167730,
   "Latitud": 66.1347,
   "Longitud": 17.1748,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Båtvik",
   "Stationsnummer": 86170,
   "Latitud": 58.2699,
   "Longitud": 16.079,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Laxviken",
   "Stationsnummer": 134470,
   "Latitud": 63.7901,
   "Longitud": 14.6784,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bruksvallarna",
   "Stationsnummer": 122390,
   "Latitud": 62.6421,
   "Longitud": 12.4192,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Röke",
   "Stationsnummer": 63140,
   "Latitud": 56.2393,
   "Longitud": 13.5278,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mariedamm",
   "Stationsnummer": 85520,
   "Latitud": 58.8509,
   "Longitud": 15.164,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Oskarström",
   "Stationsnummer": 62480,
   "Latitud": 56.7939,
   "Longitud": 12.9731,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bränna",
   "Stationsnummer": 133400,
   "Latitud": 63.6691,
   "Longitud": 13.5494,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Undersåker",
   "Stationsnummer": 133200,
   "Latitud": 63.3269,
   "Longitud": 13.3826,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sandsjöbacka",
   "Stationsnummer": 72340,
   "Latitud": 57.5571,
   "Longitud": 12.0387,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sanna",
   "Stationsnummer": 138080,
   "Latitud": 63.1316,
   "Longitud": 18.0733,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tärnamo",
   "Stationsnummer": 155890,
   "Latitud": 65.6699,
   "Longitud": 15.1297,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Surahammar",
   "Stationsnummer": 96430,
   "Latitud": 59.701,
   "Longitud": 16.2202,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Buttle",
   "Stationsnummer": 78240,
   "Latitud": 57.4034,
   "Longitud": 18.5297,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Furuögrund",
   "Stationsnummer": 151550,
   "Latitud": 64.9112,
   "Longitud": 21.2263,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Håvreström",
   "Stationsnummer": 82500,
   "Latitud": 58.8216,
   "Longitud": 12.4127,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Eksjö",
   "Stationsnummer": 74400,
   "Latitud": 57.669,
   "Longitud": 14.9832,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norrtälje",
   "Stationsnummer": 98460,
   "Latitud": 59.7506,
   "Longitud": 18.7091,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lummelunda",
   "Stationsnummer": 78440,
   "Latitud": 57.7409,
   "Longitud": 18.4347,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Smögen",
   "Stationsnummer": 81220,
   "Latitud": 58.3571,
   "Longitud": 11.2276,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Offer",
   "Stationsnummer": 137070,
   "Latitud": 63.1492,
   "Longitud": 17.7617,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björsarv",
   "Stationsnummer": 126020,
   "Latitud": 62.031,
   "Longitud": 16.2995,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Råsele",
   "Stationsnummer": 146260,
   "Latitud": 64.4191,
   "Longitud": 16.812,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sikåskälen",
   "Stationsnummer": 135380,
   "Latitud": 63.6198,
   "Longitud": 15.0929,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bispgården",
   "Stationsnummer": 136010,
   "Latitud": 63.0335,
   "Longitud": 16.5536,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Täxan",
   "Stationsnummer": 135430,
   "Latitud": 63.7195,
   "Longitud": 15.8315,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sköllersta",
   "Stationsnummer": 95090,
   "Latitud": 59.1441,
   "Longitud": 15.2775,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Viskan",
   "Stationsnummer": 126270,
   "Latitud": 62.4556,
   "Longitud": 16.4291,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grimsmåla",
   "Stationsnummer": 64200,
   "Latitud": 56.326,
   "Longitud": 14.8805,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Horrmund",
   "Stationsnummer": 113190,
   "Latitud": 61.3138,
   "Longitud": 13.1615,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gammalstorp",
   "Stationsnummer": 64090,
   "Latitud": 56.1118,
   "Longitud": 14.6218,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Främlingshem",
   "Stationsnummer": 106300,
   "Latitud": 60.4993,
   "Longitud": 16.9409,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ljusbäck",
   "Stationsnummer": 106090,
   "Latitud": 60.155,
   "Longitud": 16.8595,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norsborg I",
   "Stationsnummer": 97140,
   "Latitud": 59.2401,
   "Longitud": 17.7834,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Öjared",
   "Stationsnummer": 72510,
   "Latitud": 57.8453,
   "Longitud": 12.3838,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Morup",
   "Stationsnummer": 62590,
   "Latitud": 56.9824,
   "Longitud": 12.3911,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Riksten",
   "Stationsnummer": 97110,
   "Latitud": 59.1833,
   "Longitud": 17.9167,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bogen",
   "Stationsnummer": 102040,
   "Latitud": 60.0591,
   "Longitud": 12.5558,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stjärnsund",
   "Stationsnummer": 106270,
   "Latitud": 60.4551,
   "Longitud": 16.2662,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hornkullen",
   "Stationsnummer": 94400,
   "Latitud": 59.6506,
   "Longitud": 14.2849,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tegelträsk",
   "Stationsnummer": 137560,
   "Latitud": 63.9515,
   "Longitud": 17.904,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åmål",
   "Stationsnummer": 92030,
   "Latitud": 59.0542,
   "Longitud": 12.6969,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Varpnäs",
   "Stationsnummer": 93240,
   "Latitud": 59.4041,
   "Longitud": 13.2906,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vedjeön",
   "Stationsnummer": 145040,
   "Latitud": 64.063,
   "Longitud": 15.3737,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ålåsen",
   "Stationsnummer": 134520,
   "Latitud": 63.8683,
   "Longitud": 14.6063,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lenhovda",
   "Stationsnummer": 65590,
   "Latitud": 56.9893,
   "Longitud": 15.2933,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tranhult",
   "Stationsnummer": 73290,
   "Latitud": 57.4882,
   "Longitud": 13.8585,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rättvik",
   "Stationsnummer": 105540,
   "Latitud": 60.8928,
   "Longitud": 15.1087,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sankt Olof",
   "Stationsnummer": 54390,
   "Latitud": 55.6402,
   "Longitud": 14.1273,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högsta",
   "Stationsnummer": 95290,
   "Latitud": 59.3521,
   "Longitud": 15.4802,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gråda Kraftverk",
   "Stationsnummer": 105360,
   "Latitud": 60.6046,
   "Longitud": 15.0146,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lörudden",
   "Stationsnummer": 127140,
   "Latitud": 62.2314,
   "Longitud": 17.6623,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hångstad",
   "Stationsnummer": 91520,
   "Latitud": 59.8633,
   "Longitud": 11.9746,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Simlångsdalen",
   "Stationsnummer": 63440,
   "Latitud": 56.7154,
   "Longitud": 13.1247,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Svarteborg",
   "Stationsnummer": 81340,
   "Latitud": 58.5707,
   "Longitud": 11.5572,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Omsjö",
   "Stationsnummer": 137320,
   "Latitud": 63.5319,
   "Longitud": 17.1299,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Borgviksbruk",
   "Stationsnummer": 92210,
   "Latitud": 59.3534,
   "Longitud": 12.9623,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lidingö",
   "Stationsnummer": 98220,
   "Latitud": 59.3701,
   "Longitud": 18.16,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Spånsberget",
   "Stationsnummer": 105240,
   "Latitud": 60.3828,
   "Longitud": 15.1418,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Silverberg",
   "Stationsnummer": 156800,
   "Latitud": 65.3496,
   "Longitud": 16.1107,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Öjebyn",
   "Stationsnummer": 161800,
   "Latitud": 65.3566,
   "Longitud": 21.389,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storberget",
   "Stationsnummer": 171940,
   "Latitud": 66.7714,
   "Longitud": 21.7652,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björnliden",
   "Stationsnummer": 122020,
   "Latitud": 62.0444,
   "Longitud": 12.3953,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Parkalompolo",
   "Stationsnummer": 182920,
   "Latitud": 67.7312,
   "Longitud": 22.8275,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ingels",
   "Stationsnummer": 105580,
   "Latitud": 60.9437,
   "Longitud": 15.2473,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sickelsjö",
   "Stationsnummer": 95200,
   "Latitud": 59.329,
   "Longitud": 15.8193,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hallamölla",
   "Stationsnummer": 54430,
   "Latitud": 55.7082,
   "Longitud": 14.0106,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Westö",
   "Stationsnummer": 78540,
   "Latitud": 57.8934,
   "Longitud": 18.7624,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bjurfors",
   "Stationsnummer": 106080,
   "Latitud": 60.1316,
   "Longitud": 16.1282,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stabbo",
   "Stationsnummer": 88580,
   "Latitud": 58.9733,
   "Longitud": 18.4493,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ljungå",
   "Stationsnummer": 126460,
   "Latitud": 62.7594,
   "Longitud": 16.3141,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nordmaling",
   "Stationsnummer": 139340,
   "Latitud": 63.5739,
   "Longitud": 19.4875,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kuggören",
   "Stationsnummer": 117420,
   "Latitud": 61.7027,
   "Longitud": 17.5225,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nordvik",
   "Stationsnummer": 128510,
   "Latitud": 62.8485,
   "Longitud": 18.0159,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gällivare-Flakaberg",
   "Stationsnummer": 171850,
   "Latitud": 66.5189,
   "Longitud": 21.9092,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Suttertjärn",
   "Stationsnummer": 93340,
   "Latitud": 59.5956,
   "Longitud": 13.9525,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tovehult",
   "Stationsnummer": 76380,
   "Latitud": 57.642,
   "Longitud": 16.5682,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Landvetter",
   "Stationsnummer": 72410,
   "Latitud": 57.6874,
   "Longitud": 12.2277,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gastsjön",
   "Stationsnummer": 125580,
   "Latitud": 62.9595,
   "Longitud": 15.8545,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björkbacken",
   "Stationsnummer": 155920,
   "Latitud": 65.7456,
   "Longitud": 15.5515,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sarkavare",
   "Stationsnummer": 170920,
   "Latitud": 66.7373,
   "Longitud": 20.3603,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Flakaträsk",
   "Stationsnummer": 148150,
   "Latitud": 64.2539,
   "Longitud": 18.5184,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Örebro",
   "Stationsnummer": 95620,
   "Latitud": 59.2448,
   "Longitud": 15.2854,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Frötuna",
   "Stationsnummer": 97550,
   "Latitud": 59.9077,
   "Longitud": 17.8611,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Pålkem",
   "Stationsnummer": 171810,
   "Latitud": 66.3888,
   "Longitud": 21.6098,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sågmyra",
   "Stationsnummer": 105410,
   "Latitud": 60.7004,
   "Longitud": 15.3263,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Smygehuk",
   "Stationsnummer": 53200,
   "Latitud": 55.3376,
   "Longitud": 13.3563,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Julita",
   "Stationsnummer": 96100,
   "Latitud": 59.1635,
   "Longitud": 16.0553,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Luleå",
   "Stationsnummer": 162880,
   "Latitud": 65.62,
   "Longitud": 22.1307,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östmark-Rännberg",
   "Stationsnummer": 102200,
   "Latitud": 60.3328,
   "Longitud": 12.6775,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Haraholmen",
   "Stationsnummer": 161780,
   "Latitud": 65.2391,
   "Longitud": 21.6317,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Arvingetorp",
   "Stationsnummer": 75280,
   "Latitud": 57.4496,
   "Longitud": 15.0344,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Riksgränsen",
   "Stationsnummer": 188830,
   "Latitud": 68.4284,
   "Longitud": 18.1302,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Killebäckstorp",
   "Stationsnummer": 62230,
   "Latitud": 56.3822,
   "Longitud": 12.7491,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bredshult",
   "Stationsnummer": 76310,
   "Latitud": 57.5249,
   "Longitud": 16.2768,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lappträsket",
   "Stationsnummer": 171770,
   "Latitud": 66.2283,
   "Longitud": 21.7881,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stångfallet",
   "Stationsnummer": 94660,
   "Latitud": 59.95,
   "Longitud": 14.8833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Karlskrona",
   "Stationsnummer": 65100,
   "Latitud": 56.167,
   "Longitud": 15.587,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bjursås-Sågsbo",
   "Stationsnummer": 105460,
   "Latitud": 60.7746,
   "Longitud": 15.3844,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gnarp",
   "Stationsnummer": 127040,
   "Latitud": 62.0647,
   "Longitud": 17.2788,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hällnäs-Lund",
   "Stationsnummer": 149160,
   "Latitud": 64.2684,
   "Longitud": 19.6314,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Börringe Kloster",
   "Stationsnummer": 53310,
   "Latitud": 55.5061,
   "Longitud": 13.3293,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Råneå-Flakaberg",
   "Stationsnummer": 171800,
   "Latitud": 66.3615,
   "Longitud": 21.847,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Robertsfors",
   "Stationsnummer": 150110,
   "Latitud": 64.1935,
   "Longitud": 20.8467,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ladnivaara",
   "Stationsnummer": 180780,
   "Latitud": 67.2566,
   "Longitud": 20.2793,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Notholmen",
   "Stationsnummer": 96180,
   "Latitud": 59.2948,
   "Longitud": 16.0053,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lövnäs",
   "Stationsnummer": 113210,
   "Latitud": 61.3445,
   "Longitud": 13.3578,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fiskåvattnet",
   "Stationsnummer": 144260,
   "Latitud": 64.4367,
   "Longitud": 14.7175,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Köpinge",
   "Stationsnummer": 53270,
   "Latitud": 55.4575,
   "Longitud": 13.9379,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stora Karlsö",
   "Stationsnummer": 77180,
   "Latitud": 57.2893,
   "Longitud": 17.9623,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Billingsfors",
   "Stationsnummer": 82590,
   "Latitud": 58.9884,
   "Longitud": 12.2589,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lit",
   "Stationsnummer": 134180,
   "Latitud": 63.3081,
   "Longitud": 14.8517,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ekefors",
   "Stationsnummer": 64330,
   "Latitud": 56.5546,
   "Longitud": 14.7571,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Väderstad",
   "Stationsnummer": 84190,
   "Latitud": 58.3143,
   "Longitud": 14.9274,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Strängnäs",
   "Stationsnummer": 97270,
   "Latitud": 59.402,
   "Longitud": 17.0605,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Härnö",
   "Stationsnummer": 128370,
   "Latitud": 62.6183,
   "Longitud": 18.0618,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Randijaur",
   "Stationsnummer": 169930,
   "Latitud": 66.761,
   "Longitud": 19.3166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hallviken",
   "Stationsnummer": 135440,
   "Latitud": 63.73,
   "Longitud": 15.5,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bersbo",
   "Stationsnummer": 86160,
   "Latitud": 58.2635,
   "Longitud": 16.0417,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bogesund",
   "Stationsnummer": 98240,
   "Latitud": 59.4084,
   "Longitud": 18.2314,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Allavaara",
   "Stationsnummer": 180790,
   "Latitud": 67.2594,
   "Longitud": 20.1205,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grästorp",
   "Stationsnummer": 82200,
   "Latitud": 58.3355,
   "Longitud": 12.6765,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hissmofors",
   "Stationsnummer": 134200,
   "Latitud": 63.3329,
   "Longitud": 14.4733,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bergaholm",
   "Stationsnummer": 97130,
   "Latitud": 59.2291,
   "Longitud": 17.7164,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tårrajaur",
   "Stationsnummer": 169830,
   "Latitud": 66.4329,
   "Longitud": 19.6885,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stenudden",
   "Stationsnummer": 167860,
   "Latitud": 66.5343,
   "Longitud": 17.6677,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Borgärdet",
   "Stationsnummer": 105440,
   "Latitud": 60.7344,
   "Longitud": 15.9083,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jordberga",
   "Stationsnummer": 53250,
   "Latitud": 55.4114,
   "Longitud": 13.4001,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Roma",
   "Stationsnummer": 78310,
   "Latitud": 57.5069,
   "Longitud": 18.4539,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sonnbo",
   "Stationsnummer": 106060,
   "Latitud": 60.1197,
   "Longitud": 16.2838,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mörbylånga",
   "Stationsnummer": 66320,
   "Latitud": 56.5256,
   "Longitud": 16.39,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Häljum",
   "Stationsnummer": 127160,
   "Latitud": 62.2622,
   "Longitud": 17.3358,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gävle-Lexe",
   "Stationsnummer": 107410,
   "Latitud": 60.6812,
   "Longitud": 17.098,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Loftahammar",
   "Stationsnummer": 76540,
   "Latitud": 57.9038,
   "Longitud": 16.6962,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Seglehult",
   "Stationsnummer": 63560,
   "Latitud": 56.9371,
   "Longitud": 13.3393,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ugerup",
   "Stationsnummer": 54580,
   "Latitud": 55.9657,
   "Longitud": 14.1168,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Siljansfors",
   "Stationsnummer": 104530,
   "Latitud": 60.8846,
   "Longitud": 14.3786,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Askeryd",
   "Stationsnummer": 75480,
   "Latitud": 57.8055,
   "Longitud": 14.9925,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Suddesjaur",
   "Stationsnummer": 159970,
   "Latitud": 65.8952,
   "Longitud": 19.0929,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Reymersholm",
   "Stationsnummer": 62010,
   "Latitud": 56.0127,
   "Longitud": 12.7218,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bäckaskog",
   "Stationsnummer": 64050,
   "Latitud": 56.0483,
   "Longitud": 14.3384,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hammenhög",
   "Stationsnummer": 54310,
   "Latitud": 55.5049,
   "Longitud": 14.1589,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kumla",
   "Stationsnummer": 95070,
   "Latitud": 59.1248,
   "Longitud": 15.1535,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bolmsö",
   "Stationsnummer": 73020,
   "Latitud": 57.0152,
   "Longitud": 13.728,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gällivare Flygplats",
   "Stationsnummer": 180740,
   "Latitud": 67.1358,
   "Longitud": 20.8144,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Pauliström",
   "Stationsnummer": 75290,
   "Latitud": 57.4711,
   "Longitud": 15.5037,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jonsberg",
   "Stationsnummer": 86300,
   "Latitud": 58.5059,
   "Longitud": 16.8575,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kårsta",
   "Stationsnummer": 98400,
   "Latitud": 59.6575,
   "Longitud": 18.2718,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kompelusvaara",
   "Stationsnummer": 182720,
   "Latitud": 67.0887,
   "Longitud": 22.2265,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skellefteå flygplats",
   "Stationsnummer": 151380,
   "Latitud": 64.6244,
   "Longitud": 21.0717,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Örnsköldsviks Flygplats",
   "Stationsnummer": 138240,
   "Latitud": 63.4116,
   "Longitud": 18.9973,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norrfors",
   "Stationsnummer": 138470,
   "Latitud": 63.7705,
   "Longitud": 18.9927,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Granån",
   "Stationsnummer": 163970,
   "Latitud": 65.9199,
   "Longitud": 23.4267,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Moforsen",
   "Stationsnummer": 136220,
   "Latitud": 63.3683,
   "Longitud": 16.9912,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vissefjärda",
   "Stationsnummer": 65310,
   "Latitud": 56.5124,
   "Longitud": 15.6235,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björkede",
   "Stationsnummer": 142030,
   "Latitud": 64.0432,
   "Longitud": 12.9414,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Malmö 2",
   "Stationsnummer": 53370,
   "Latitud": 55.6048,
   "Longitud": 12.9841,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Limmared",
   "Stationsnummer": 73320,
   "Latitud": 57.5415,
   "Longitud": 13.3433,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stenstugu Försöksgård",
   "Stationsnummer": 78360,
   "Latitud": 57.5979,
   "Longitud": 18.4507,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Knås",
   "Stationsnummer": 103570,
   "Latitud": 60.9676,
   "Longitud": 13.8985,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Liehittäjä",
   "Stationsnummer": 173780,
   "Latitud": 66.2668,
   "Longitud": 23.4184,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Örberga",
   "Stationsnummer": 84260,
   "Latitud": 58.4274,
   "Longitud": 14.826,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Finspång",
   "Stationsnummer": 85410,
   "Latitud": 58.7104,
   "Longitud": 15.8215,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Valdemarsvik",
   "Stationsnummer": 86130,
   "Latitud": 58.2148,
   "Longitud": 16.5828,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Örebro Flygplats",
   "Stationsnummer": 95140,
   "Latitud": 59.2334,
   "Longitud": 15.05,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Snöåby",
   "Stationsnummer": 104310,
   "Latitud": 60.5227,
   "Longitud": 14.4594,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norrköping-Sörby",
   "Stationsnummer": 86370,
   "Latitud": 58.6082,
   "Longitud": 16.1212,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bjärka-Säby",
   "Stationsnummer": 85160,
   "Latitud": 58.2662,
   "Longitud": 15.7431,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Myrheden",
   "Stationsnummer": 160790,
   "Latitud": 65.296,
   "Longitud": 20.2096,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nilivaara",
   "Stationsnummer": 181770,
   "Latitud": 67.226,
   "Longitud": 21.6072,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Österby",
   "Stationsnummer": 97410,
   "Latitud": 59.6563,
   "Longitud": 17.6469,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nautijaur",
   "Stationsnummer": 169960,
   "Latitud": 66.9044,
   "Longitud": 19.2446,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kummavuopio",
   "Stationsnummer": 190970,
   "Latitud": 68.9078,
   "Longitud": 20.867,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hjälmsäter",
   "Stationsnummer": 83350,
   "Latitud": 58.5829,
   "Longitud": 13.3398,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Granshult",
   "Stationsnummer": 75130,
   "Latitud": 57.2036,
   "Longitud": 15.0843,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högsjö",
   "Stationsnummer": 95020,
   "Latitud": 59.0297,
   "Longitud": 15.6858,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kiruna flygplats",
   "Stationsnummer": 180940,
   "Latitud": 67.827,
   "Longitud": 20.3387,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hakkas",
   "Stationsnummer": 171970,
   "Latitud": 66.9178,
   "Longitud": 21.5757,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sillre",
   "Stationsnummer": 126470,
   "Latitud": 62.7717,
   "Longitud": 16.7236,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ekorrträsk",
   "Stationsnummer": 149300,
   "Latitud": 64.5021,
   "Longitud": 19.0514,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mölndal",
   "Stationsnummer": 72390,
   "Latitud": 57.6595,
   "Longitud": 12.0368,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Friggestad",
   "Stationsnummer": 53550,
   "Latitud": 55.9032,
   "Longitud": 13.9336,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Koskats",
   "Stationsnummer": 170840,
   "Latitud": 66.5074,
   "Longitud": 20.2558,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tannåker",
   "Stationsnummer": 63570,
   "Latitud": 56.9577,
   "Longitud": 13.7741,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Frykfors",
   "Stationsnummer": 93320,
   "Latitud": 59.5307,
   "Longitud": 13.2566,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Svartå",
   "Stationsnummer": 94070,
   "Latitud": 59.126,
   "Longitud": 14.5278,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norrtälje-Väsby",
   "Stationsnummer": 98510,
   "Latitud": 59.8524,
   "Longitud": 18.7296,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mora",
   "Stationsnummer": 114010,
   "Latitud": 61.0025,
   "Longitud": 14.5874,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åkeboda",
   "Stationsnummer": 63020,
   "Latitud": 56.0308,
   "Longitud": 13.9281,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rundbacken",
   "Stationsnummer": 127430,
   "Latitud": 62.7101,
   "Longitud": 17.1765,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stora Blåsjön",
   "Stationsnummer": 144510,
   "Latitud": 64.8176,
   "Longitud": 14.1528,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Eket",
   "Stationsnummer": 84080,
   "Latitud": 58.1131,
   "Longitud": 14.076,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dunker",
   "Stationsnummer": 96120,
   "Latitud": 59.1469,
   "Longitud": 16.8536,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Alvhem",
   "Stationsnummer": 82000,
   "Latitud": 58.0067,
   "Longitud": 12.1454,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nybyholm",
   "Stationsnummer": 97310,
   "Latitud": 59.5296,
   "Longitud": 17.038,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sudok",
   "Stationsnummer": 170790,
   "Latitud": 66.3006,
   "Longitud": 20.424,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Älvsbyn M",
   "Stationsnummer": 160890,
   "Latitud": 65.6935,
   "Longitud": 20.9858,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Torneträsk",
   "Stationsnummer": 189760,
   "Latitud": 68.2201,
   "Longitud": 19.7123,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Glommen",
   "Stationsnummer": 62550,
   "Latitud": 56.9303,
   "Longitud": 12.3579,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dönje",
   "Stationsnummer": 116240,
   "Latitud": 61.395,
   "Longitud": 16.4145,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nidingen",
   "Stationsnummer": 71180,
   "Latitud": 57.3025,
   "Longitud": 11.9038,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dal",
   "Stationsnummer": 134420,
   "Latitud": 63.697,
   "Longitud": 14.1314,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Helsingborg",
   "Stationsnummer": 62030,
   "Latitud": 56.0431,
   "Longitud": 12.6906,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gävle",
   "Stationsnummer": 107400,
   "Latitud": 60.6537,
   "Longitud": 17.1693,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skråmforsen",
   "Stationsnummer": 94230,
   "Latitud": 59.3785,
   "Longitud": 14.6119,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storberg",
   "Stationsnummer": 158850,
   "Latitud": 65.5085,
   "Longitud": 18.9505,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Satis",
   "Stationsnummer": 178850,
   "Latitud": 67.5009,
   "Longitud": 18.3911,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skallböle",
   "Stationsnummer": 126220,
   "Latitud": 62.3642,
   "Longitud": 16.966,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Korpilombolo M",
   "Stationsnummer": 173960,
   "Latitud": 66.8542,
   "Longitud": 23.0571,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västervik",
   "Stationsnummer": 76470,
   "Latitud": 57.7213,
   "Longitud": 16.4683,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sandhammaren",
   "Stationsnummer": 54230,
   "Latitud": 55.3872,
   "Longitud": 14.1947,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Malexander",
   "Stationsnummer": 85040,
   "Latitud": 58.0729,
   "Longitud": 15.2352,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Backa",
   "Stationsnummer": 105550,
   "Latitud": 60.923,
   "Longitud": 15.1145,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lofsdalen",
   "Stationsnummer": 123070,
   "Latitud": 62.1132,
   "Longitud": 13.2841,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ölands Södra Udde",
   "Stationsnummer": 66120,
   "Latitud": 56.1957,
   "Longitud": 16.401,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Måseskär",
   "Stationsnummer": 81060,
   "Latitud": 58.0944,
   "Longitud": 11.3348,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Utvalnäs Aut",
   "Stationsnummer": 107450,
   "Latitud": 60.7547,
   "Longitud": 17.3574,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hölick",
   "Stationsnummer": 117370,
   "Latitud": 61.6239,
   "Longitud": 17.4401,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skagsudde",
   "Stationsnummer": 139110,
   "Latitud": 63.1885,
   "Longitud": 19.0194,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lycksele",
   "Stationsnummer": 148350,
   "Latitud": 64.5871,
   "Longitud": 18.6587,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Klimpfjäll",
   "Stationsnummer": 154720,
   "Latitud": 65.062,
   "Longitud": 14.7908,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Överkalix-Svartbyn",
   "Stationsnummer": 172790,
   "Latitud": 66.2646,
   "Longitud": 22.8365,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hamra",
   "Stationsnummer": 114400,
   "Latitud": 61.6577,
   "Longitud": 14.9943,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Delsbo",
   "Stationsnummer": 116480,
   "Latitud": 61.7854,
   "Longitud": 16.5505,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Föllinge-Vägskälet",
   "Stationsnummer": 134460,
   "Latitud": 63.7606,
   "Longitud": 14.4323,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Strömsund",
   "Stationsnummer": 135520,
   "Latitud": 63.8548,
   "Longitud": 15.5894,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vitemölla",
   "Stationsnummer": 54420,
   "Latitud": 55.6995,
   "Longitud": 14.204,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kristianstad everöd",
   "Stationsnummer": 54550,
   "Latitud": 55.9245,
   "Longitud": 14.0842,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vuoggatjålme",
   "Stationsnummer": 166870,
   "Latitud": 66.5759,
   "Longitud": 16.3511,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Älmhult",
   "Stationsnummer": 53520,
   "Latitud": 55.8656,
   "Longitud": 13.8741,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Spinkabo",
   "Stationsnummer": 74340,
   "Latitud": 57.5653,
   "Longitud": 14.4693,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Blomskog",
   "Stationsnummer": 92170,
   "Latitud": 59.2891,
   "Longitud": 12.0542,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Arvika",
   "Stationsnummer": 92400,
   "Latitud": 59.6658,
   "Longitud": 12.591,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Edsbyn",
   "Stationsnummer": 115230,
   "Latitud": 61.3784,
   "Longitud": 15.8352,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Klövsjö",
   "Stationsnummer": 124320,
   "Latitud": 62.5335,
   "Longitud": 14.2028,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fränsta II",
   "Stationsnummer": 126300,
   "Latitud": 62.5165,
   "Longitud": 16.2084,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fredrika",
   "Stationsnummer": 148050,
   "Latitud": 64.0763,
   "Longitud": 18.419,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fällfors",
   "Stationsnummer": 160740,
   "Latitud": 65.1317,
   "Longitud": 20.7891,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storöhamn",
   "Stationsnummer": 163920,
   "Latitud": 65.7306,
   "Longitud": 23.0924,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Landvetter Flygplats",
   "Stationsnummer": 72420,
   "Latitud": 57.6678,
   "Longitud": 12.2963,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Utö",
   "Stationsnummer": 88570,
   "Latitud": 58.9502,
   "Longitud": 18.2669,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ungskär",
   "Stationsnummer": 65020,
   "Latitud": 56.0419,
   "Longitud": 15.8081,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kalmar",
   "Stationsnummer": 66410,
   "Latitud": 56.727,
   "Longitud": 16.2944,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nässjö",
   "Stationsnummer": 74390,
   "Latitud": 57.6431,
   "Longitud": 14.6895,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ljungskile",
   "Stationsnummer": 81130,
   "Latitud": 58.2159,
   "Longitud": 11.9321,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Borgunda",
   "Stationsnummer": 83170,
   "Latitud": 58.288,
   "Longitud": 13.7995,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Asphyttan",
   "Stationsnummer": 94370,
   "Latitud": 59.6112,
   "Longitud": 14.1859,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Folkärna",
   "Stationsnummer": 106100,
   "Latitud": 60.169,
   "Longitud": 16.3125,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vintjärn",
   "Stationsnummer": 106500,
   "Latitud": 60.8321,
   "Longitud": 16.0581,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Singö",
   "Stationsnummer": 108100,
   "Latitud": 60.1595,
   "Longitud": 18.7436,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rörbäcksnäs",
   "Stationsnummer": 112080,
   "Latitud": 61.1269,
   "Longitud": 12.8226,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fjällnäs",
   "Stationsnummer": 122360,
   "Latitud": 62.5772,
   "Longitud": 12.2223,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storsjö Kapell",
   "Stationsnummer": 123480,
   "Latitud": 62.8016,
   "Longitud": 13.0731,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Finneby",
   "Stationsnummer": 125020,
   "Latitud": 62.0424,
   "Longitud": 15.4655,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stora Stensjön Aut",
   "Stationsnummer": 133570,
   "Latitud": 63.9687,
   "Longitud": 13.7251,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bastorp",
   "Stationsnummer": 82540,
   "Latitud": 58.904,
   "Longitud": 12.038,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åkershus",
   "Stationsnummer": 83540,
   "Latitud": 58.898,
   "Longitud": 13.2517,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fellingsbro-Finnåker",
   "Stationsnummer": 95320,
   "Latitud": 59.5345,
   "Longitud": 15.5857,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åmotsbruk",
   "Stationsnummer": 106580,
   "Latitud": 60.9645,
   "Longitud": 16.4631,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Idvattnet",
   "Stationsnummer": 147270,
   "Latitud": 64.4542,
   "Longitud": 17.0794,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vindel-Björkheden",
   "Stationsnummer": 156940,
   "Latitud": 65.8211,
   "Longitud": 16.7114,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Muodoslompolo",
   "Stationsnummer": 183980,
   "Latitud": 67.9443,
   "Longitud": 23.4441,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Naimakka",
   "Stationsnummer": 191900,
   "Latitud": 68.6779,
   "Longitud": 21.5277,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nattavaara-Vårsjö",
   "Stationsnummer": 170940,
   "Latitud": 66.7791,
   "Longitud": 20.581,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kramfors-Gistgårdsön",
   "Stationsnummer": 137040,
   "Latitud": 63.0502,
   "Longitud": 17.7658,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Alnarp Fruktavdelning",
   "Stationsnummer": 53390,
   "Latitud": 55.6571,
   "Longitud": 13.0923,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Älvdalen II",
   "Stationsnummer": 114160,
   "Latitud": 61.2555,
   "Longitud": 14.0375,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Järpen",
   "Stationsnummer": 133220,
   "Latitud": 63.3528,
   "Longitud": 13.4578,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Simrishamn",
   "Stationsnummer": 54330,
   "Latitud": 55.5449,
   "Longitud": 14.3578,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Singeshult",
   "Stationsnummer": 63450,
   "Latitud": 56.7429,
   "Longitud": 13.3608,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ramsele",
   "Stationsnummer": 136320,
   "Latitud": 63.4914,
   "Longitud": 16.4826,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mierkenies",
   "Stationsnummer": 166900,
   "Latitud": 66.6798,
   "Longitud": 16.1137,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Holma",
   "Stationsnummer": 86200,
   "Latitud": 58.3339,
   "Longitud": 16.8157,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Abelvattnet Aut",
   "Stationsnummer": 154860,
   "Latitud": 65.53,
   "Longitud": 14.97,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Branäs",
   "Stationsnummer": 113040,
   "Latitud": 61.0665,
   "Longitud": 13.4844,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Invik",
   "Stationsnummer": 138020,
   "Latitud": 63.0255,
   "Longitud": 18.172,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Abisko Aut",
   "Stationsnummer": 188790,
   "Latitud": 68.3555,
   "Longitud": 18.8211,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sävenfors",
   "Stationsnummer": 94530,
   "Latitud": 59.882,
   "Longitud": 14.5408,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Börtnan",
   "Stationsnummer": 123450,
   "Latitud": 62.729,
   "Longitud": 13.9111,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bredviken",
   "Stationsnummer": 91130,
   "Latitud": 59.2184,
   "Longitud": 11.9858,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Munsvattnet",
   "Stationsnummer": 144160,
   "Latitud": 64.2734,
   "Longitud": 14.451,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tossåsen",
   "Stationsnummer": 124430,
   "Latitud": 62.6967,
   "Longitud": 14.3927,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ruokojärvi",
   "Stationsnummer": 173880,
   "Latitud": 66.6127,
   "Longitud": 23.298,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stenfors",
   "Stationsnummer": 150120,
   "Latitud": 64.1909,
   "Longitud": 20.2977,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Älmeshult",
   "Stationsnummer": 75030,
   "Latitud": 57.0519,
   "Longitud": 15.198,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ovesholm",
   "Stationsnummer": 64000,
   "Latitud": 55.9901,
   "Longitud": 13.9934,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grimeton",
   "Stationsnummer": 72070,
   "Latitud": 57.1481,
   "Longitud": 12.4413,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hoting",
   "Stationsnummer": 146070,
   "Latitud": 64.1236,
   "Longitud": 16.2149,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Uppgränna",
   "Stationsnummer": 84030,
   "Latitud": 58.0671,
   "Longitud": 14.5322,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jonstorp",
   "Stationsnummer": 62560,
   "Latitud": 56.931,
   "Longitud": 12.5514,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bjuröklubb",
   "Stationsnummer": 151290,
   "Latitud": 64.4806,
   "Longitud": 21.5787,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lekeberga",
   "Stationsnummer": 94150,
   "Latitud": 59.2317,
   "Longitud": 14.8769,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fatmomakke",
   "Stationsnummer": 155740,
   "Latitud": 65.0915,
   "Longitud": 15.132,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stenkvista",
   "Stationsnummer": 96210,
   "Latitud": 59.3221,
   "Longitud": 16.5577,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ritsem",
   "Stationsnummer": 177920,
   "Latitud": 67.7261,
   "Longitud": 17.4718,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kullen",
   "Stationsnummer": 62190,
   "Latitud": 56.3012,
   "Longitud": 12.454,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grundsjön",
   "Stationsnummer": 64120,
   "Latitud": 56.129,
   "Longitud": 14.586,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Simontorp",
   "Stationsnummer": 53340,
   "Latitud": 55.5833,
   "Longitud": 13.5666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hallen",
   "Stationsnummer": 134120,
   "Latitud": 63.1776,
   "Longitud": 14.0918,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Harrsele",
   "Stationsnummer": 149010,
   "Latitud": 64.0193,
   "Longitud": 19.5682,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nyabyberg",
   "Stationsnummer": 75230,
   "Latitud": 57.3911,
   "Longitud": 15.2737,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gräsmark",
   "Stationsnummer": 92560,
   "Latitud": 59.9339,
   "Longitud": 12.8992,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Flaten",
   "Stationsnummer": 104390,
   "Latitud": 60.651,
   "Longitud": 14.4277,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Säby",
   "Stationsnummer": 81010,
   "Latitud": 58.0201,
   "Longitud": 11.6015,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gruvberget",
   "Stationsnummer": 116050,
   "Latitud": 61.1031,
   "Longitud": 16.1582,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skirknäs",
   "Stationsnummer": 156920,
   "Latitud": 65.7474,
   "Longitud": 16.1978,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Suddjavaara",
   "Stationsnummer": 192760,
   "Latitud": 68.2048,
   "Longitud": 22.7609,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lövåker",
   "Stationsnummer": 106420,
   "Latitud": 60.684,
   "Longitud": 16.3513,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Långvattnet",
   "Stationsnummer": 156730,
   "Latitud": 65.1049,
   "Longitud": 16.6919,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hyvlinge",
   "Stationsnummer": 97450,
   "Latitud": 59.7475,
   "Longitud": 17.0682,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västra Ärnäs",
   "Stationsnummer": 103550,
   "Latitud": 60.9069,
   "Longitud": 13.3756,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Björkvik",
   "Stationsnummer": 155850,
   "Latitud": 65.4987,
   "Longitud": 15.5589,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sollerön",
   "Stationsnummer": 104560,
   "Latitud": 60.938,
   "Longitud": 14.5908,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gysinge",
   "Stationsnummer": 106170,
   "Latitud": 60.2836,
   "Longitud": 16.8857,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stora Segerstad",
   "Stationsnummer": 73090,
   "Latitud": 57.1461,
   "Longitud": 13.5609,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Puoltsa",
   "Stationsnummer": 179940,
   "Latitud": 67.7989,
   "Longitud": 19.8596,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Roma Aut",
   "Stationsnummer": 78300,
   "Latitud": 57.4998,
   "Longitud": 18.4639,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Siksjö",
   "Stationsnummer": 147210,
   "Latitud": 64.3433,
   "Longitud": 17.7866,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Österåker",
   "Stationsnummer": 98300,
   "Latitud": 59.4897,
   "Longitud": 18.2937,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Understen",
   "Stationsnummer": 108170,
   "Latitud": 60.2761,
   "Longitud": 18.9227,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Långhult",
   "Stationsnummer": 63350,
   "Latitud": 56.585,
   "Longitud": 13.4582,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ohs",
   "Stationsnummer": 64500,
   "Latitud": 56.8371,
   "Longitud": 14.5852,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åseda",
   "Stationsnummer": 75100,
   "Latitud": 57.1462,
   "Longitud": 15.3987,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västerplana",
   "Stationsnummer": 83340,
   "Latitud": 58.5586,
   "Longitud": 13.3508,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Foskros",
   "Stationsnummer": 122010,
   "Latitud": 62.0016,
   "Longitud": 12.6708,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nikkaluokta",
   "Stationsnummer": 179950,
   "Latitud": 67.8488,
   "Longitud": 19.0233,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dikanäs Skansnäs",
   "Stationsnummer": 156790,
   "Latitud": 65.3235,
   "Longitud": 16.0353,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hörby",
   "Stationsnummer": 53500,
   "Latitud": 55.8506,
   "Longitud": 13.6672,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Korsselbränna",
   "Stationsnummer": 145280,
   "Latitud": 64.4571,
   "Longitud": 15.5423,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Väderöarna Aut",
   "Stationsnummer": 81350,
   "Latitud": 58.576,
   "Longitud": 11.0682,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lommaryd",
   "Stationsnummer": 74530,
   "Latitud": 57.8887,
   "Longitud": 14.7342,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Blaikliden",
   "Stationsnummer": 155710,
   "Latitud": 65.0464,
   "Longitud": 15.7486,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Joesjö",
   "Stationsnummer": 154920,
   "Latitud": 65.7306,
   "Longitud": 14.6303,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rebnisluspen",
   "Stationsnummer": 167820,
   "Latitud": 66.4051,
   "Longitud": 17.3331,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Pålkem M",
   "Stationsnummer": 171820,
   "Latitud": 66.3855,
   "Longitud": 21.6167,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åstrilt",
   "Stationsnummer": 62540,
   "Latitud": 56.8956,
   "Longitud": 12.96,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Runsa",
   "Stationsnummer": 97340,
   "Latitud": 59.5593,
   "Longitud": 17.8252,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Väring",
   "Stationsnummer": 83300,
   "Latitud": 58.519,
   "Longitud": 13.9805,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östmark-Röjdåsen",
   "Stationsnummer": 102210,
   "Latitud": 60.3548,
   "Longitud": 12.6491,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mettä-Dokkas",
   "Stationsnummer": 181720,
   "Latitud": 67.0676,
   "Longitud": 21.2885,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Untra",
   "Stationsnummer": 107270,
   "Latitud": 60.4393,
   "Longitud": 17.3409,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ransjö",
   "Stationsnummer": 123120,
   "Latitud": 62.1961,
   "Longitud": 13.8743,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jiltjaur",
   "Stationsnummer": 156860,
   "Latitud": 65.537,
   "Longitud": 16.982,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Raukasjö",
   "Stationsnummer": 144550,
   "Latitud": 64.9197,
   "Longitud": 14.5567,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Järnbergsås",
   "Stationsnummer": 103200,
   "Latitud": 60.3239,
   "Longitud": 13.1272,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gårdvik",
   "Stationsnummer": 105400,
   "Latitud": 60.7216,
   "Longitud": 15.8119,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ljungbyhed",
   "Stationsnummer": 63050,
   "Latitud": 56.0752,
   "Longitud": 13.2318,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gielas",
   "Stationsnummer": 155800,
   "Latitud": 65.3272,
   "Longitud": 15.0677,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Staloluokta",
   "Stationsnummer": 176800,
   "Latitud": 67.4083,
   "Longitud": 16.4199,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högsvedjan",
   "Stationsnummer": 126340,
   "Latitud": 62.5535,
   "Longitud": 16.6992,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Harstena",
   "Stationsnummer": 87150,
   "Latitud": 58.2502,
   "Longitud": 17.0095,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hylletofta",
   "Stationsnummer": 74260,
   "Latitud": 57.4399,
   "Longitud": 14.4729,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Trångmon",
   "Stationsnummer": 144380,
   "Latitud": 64.6315,
   "Longitud": 14.8619,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vellinge",
   "Stationsnummer": 53290,
   "Latitud": 55.4714,
   "Longitud": 13.0128,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Molla",
   "Stationsnummer": 73570,
   "Latitud": 57.936,
   "Longitud": 13.0668,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åtvidaberg",
   "Stationsnummer": 85130,
   "Latitud": 58.2022,
   "Longitud": 16.006,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skillingmark",
   "Stationsnummer": 92490,
   "Latitud": 59.8212,
   "Longitud": 11.9991,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sundby",
   "Stationsnummer": 96410,
   "Latitud": 59.6962,
   "Longitud": 16.6606,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kättbo",
   "Stationsnummer": 104510,
   "Latitud": 60.846,
   "Longitud": 14.1912,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bygdeå",
   "Stationsnummer": 150040,
   "Latitud": 64.055,
   "Longitud": 20.8763,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hemsjö",
   "Stationsnummer": 64210,
   "Latitud": 56.3248,
   "Longitud": 14.7138,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stensjö",
   "Stationsnummer": 136160,
   "Latitud": 63.2669,
   "Longitud": 16.4446,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Umfors",
   "Stationsnummer": 155980,
   "Latitud": 65.9473,
   "Longitud": 15.0362,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Genevad",
   "Stationsnummer": 63340,
   "Latitud": 56.5684,
   "Longitud": 13.0338,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Marviken",
   "Stationsnummer": 86330,
   "Latitud": 58.5491,
   "Longitud": 16.8157,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Djurskog",
   "Stationsnummer": 91370,
   "Latitud": 59.6072,
   "Longitud": 11.9321,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skogsforsen",
   "Stationsnummer": 72060,
   "Latitud": 57.0944,
   "Longitud": 12.8704,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dingle",
   "Stationsnummer": 81320,
   "Latitud": 58.5289,
   "Longitud": 11.5724,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Granåsen",
   "Stationsnummer": 146010,
   "Latitud": 64.0147,
   "Longitud": 16.807,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Barkåkra",
   "Stationsnummer": 62180,
   "Latitud": 56.29,
   "Longitud": 12.8463,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Svalöv",
   "Stationsnummer": 53560,
   "Latitud": 55.9315,
   "Longitud": 13.0545,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grönbo",
   "Stationsnummer": 95380,
   "Latitud": 59.6396,
   "Longitud": 15.418,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gransjö",
   "Stationsnummer": 147300,
   "Latitud": 64.4947,
   "Longitud": 17.4599,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nyluspen",
   "Stationsnummer": 146530,
   "Latitud": 64.8788,
   "Longitud": 16.7489,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Falkenberg",
   "Stationsnummer": 62520,
   "Latitud": 56.8994,
   "Longitud": 12.4798,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Toraliden",
   "Stationsnummer": 74140,
   "Latitud": 57.2295,
   "Longitud": 14.7471,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Getterum",
   "Stationsnummer": 76340,
   "Latitud": 57.5691,
   "Longitud": 16.2849,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Duved",
   "Stationsnummer": 132240,
   "Latitud": 63.3948,
   "Longitud": 12.9416,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Danasjö",
   "Stationsnummer": 156850,
   "Latitud": 65.5374,
   "Longitud": 16.5393,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norrköping",
   "Stationsnummer": 86360,
   "Latitud": 58.606,
   "Longitud": 16.2127,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Aluokta",
   "Stationsnummer": 178790,
   "Latitud": 67.3094,
   "Longitud": 18.9011,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ultuna",
   "Stationsnummer": 97490,
   "Latitud": 59.8139,
   "Longitud": 17.6469,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lidsjöberg",
   "Stationsnummer": 145180,
   "Latitud": 64.3013,
   "Longitud": 15.221,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lauker",
   "Stationsnummer": 159900,
   "Latitud": 65.6453,
   "Longitud": 19.8259,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Forshult",
   "Stationsnummer": 93580,
   "Latitud": 59.957,
   "Longitud": 13.5298,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hunge",
   "Stationsnummer": 125450,
   "Latitud": 62.754,
   "Longitud": 15.0921,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Johannisberg",
   "Stationsnummer": 158810,
   "Latitud": 65.3655,
   "Longitud": 18.2074,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Greningen",
   "Stationsnummer": 135200,
   "Latitud": 63.3271,
   "Longitud": 15.4054,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jock",
   "Stationsnummer": 172900,
   "Latitud": 66.6561,
   "Longitud": 22.7215,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kubbe",
   "Stationsnummer": 138320,
   "Latitud": 63.5173,
   "Longitud": 18.0691,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nattavaara by",
   "Stationsnummer": 171920,
   "Latitud": 66.7586,
   "Longitud": 21.0537,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gunnesbyn",
   "Stationsnummer": 81590,
   "Latitud": 58.9765,
   "Longitud": 11.6951,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Klocka",
   "Stationsnummer": 132190,
   "Latitud": 63.2983,
   "Longitud": 12.506,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Svartsjö",
   "Stationsnummer": 97220,
   "Latitud": 59.3628,
   "Longitud": 17.722,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kristinefors",
   "Stationsnummer": 102240,
   "Latitud": 60.3586,
   "Longitud": 12.943,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Söderhamn",
   "Stationsnummer": 117170,
   "Latitud": 61.3198,
   "Longitud": 17.0967,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Halmstad",
   "Stationsnummer": 62390,
   "Latitud": 56.675,
   "Longitud": 12.9247,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mörkö",
   "Stationsnummer": 73410,
   "Latitud": 57.6881,
   "Longitud": 13.7084,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sandbäckshult",
   "Stationsnummer": 76000,
   "Latitud": 56.9835,
   "Longitud": 16.283,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Simonstorp",
   "Stationsnummer": 83050,
   "Latitud": 58.0788,
   "Longitud": 13.3957,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Längjum",
   "Stationsnummer": 83130,
   "Latitud": 58.2212,
   "Longitud": 13.0607,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lövånger",
   "Stationsnummer": 151220,
   "Latitud": 64.3636,
   "Longitud": 21.3152,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stensele",
   "Stationsnummer": 157720,
   "Latitud": 65.0706,
   "Longitud": 17.1536,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ålloluokta",
   "Stationsnummer": 179740,
   "Latitud": 67.1261,
   "Longitud": 19.4976,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sösjö",
   "Stationsnummer": 125460,
   "Latitud": 62.7667,
   "Longitud": 15.4996,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ulvoberg",
   "Stationsnummer": 147460,
   "Latitud": 64.7627,
   "Longitud": 17.2165,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Uddabo",
   "Stationsnummer": 72520,
   "Latitud": 57.8701,
   "Longitud": 12.7074,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nyberget",
   "Stationsnummer": 95440,
   "Latitud": 59.7468,
   "Longitud": 14.9925,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Aneby",
   "Stationsnummer": 74510,
   "Latitud": 57.8232,
   "Longitud": 14.8913,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Naggen",
   "Stationsnummer": 126160,
   "Latitud": 62.279,
   "Longitud": 15.9986,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Urshult-Kunninge",
   "Stationsnummer": 64290,
   "Latitud": 56.4782,
   "Longitud": 14.8024,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Föra",
   "Stationsnummer": 76010,
   "Latitud": 57.0107,
   "Longitud": 16.8816,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bjurholm",
   "Stationsnummer": 139560,
   "Latitud": 63.9329,
   "Longitud": 19.22,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fjälltuna D",
   "Stationsnummer": 146250,
   "Latitud": 64.4181,
   "Longitud": 16.4191,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Strömsnäsbruk D",
   "Stationsnummer": 63330,
   "Latitud": 56.5583,
   "Longitud": 13.7372,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Treskog",
   "Stationsnummer": 92540,
   "Latitud": 59.8722,
   "Longitud": 12.6195,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Överäng",
   "Stationsnummer": 133470,
   "Latitud": 63.7788,
   "Longitud": 13.0734,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Törntorp",
   "Stationsnummer": 84600,
   "Latitud": 58.9849,
   "Longitud": 14.789,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gulsele",
   "Stationsnummer": 137490,
   "Latitud": 63.8159,
   "Longitud": 17.1282,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Stömne",
   "Stationsnummer": 92260,
   "Latitud": 59.436,
   "Longitud": 12.7631,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Liden D",
   "Stationsnummer": 126390,
   "Latitud": 62.6553,
   "Longitud": 16.888,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Frösön D",
   "Stationsnummer": 134130,
   "Latitud": 63.1947,
   "Longitud": 14.4898,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gullaskruv",
   "Stationsnummer": 65530,
   "Latitud": 56.874,
   "Longitud": 15.6841,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Telningsberg",
   "Stationsnummer": 104100,
   "Latitud": 60.1829,
   "Longitud": 14.6679,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Keinovuopio D",
   "Stationsnummer": 191960,
   "Latitud": 68.8663,
   "Longitud": 21.0337,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Säve",
   "Stationsnummer": 71470,
   "Latitud": 57.7786,
   "Longitud": 11.8824,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mjuamåla",
   "Stationsnummer": 65270,
   "Latitud": 56.4405,
   "Longitud": 15.3205,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fagered",
   "Stationsnummer": 72120,
   "Latitud": 57.1978,
   "Longitud": 12.8129,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bondstorp D",
   "Stationsnummer": 73340,
   "Latitud": 57.5892,
   "Longitud": 13.9285,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gotska Sandön",
   "Stationsnummer": 89240,
   "Latitud": 58.3928,
   "Longitud": 19.197,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gåxsjö D",
   "Stationsnummer": 135420,
   "Latitud": 63.6734,
   "Longitud": 15.1041,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hammarstrand D",
   "Stationsnummer": 136060,
   "Latitud": 63.1003,
   "Longitud": 16.3499,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rundvik D",
   "Stationsnummer": 139320,
   "Latitud": 63.5422,
   "Longitud": 19.4377,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Renstad",
   "Stationsnummer": 84210,
   "Latitud": 58.3097,
   "Longitud": 14.7236,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Högbo",
   "Stationsnummer": 106410,
   "Latitud": 60.6892,
   "Longitud": 16.8193,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vimmerby",
   "Stationsnummer": 75400,
   "Latitud": 57.6687,
   "Longitud": 15.8518,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Herrberga",
   "Stationsnummer": 85210,
   "Latitud": 58.3935,
   "Longitud": 15.2184,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västertåsjö D",
   "Stationsnummer": 145210,
   "Latitud": 64.3632,
   "Longitud": 15.7037,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hede",
   "Stationsnummer": 123250,
   "Latitud": 62.4107,
   "Longitud": 13.5184,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skärvången D",
   "Stationsnummer": 134440,
   "Latitud": 63.7506,
   "Longitud": 14.2938,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Drälinge",
   "Stationsnummer": 97590,
   "Latitud": 59.9923,
   "Longitud": 17.5736,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hedberg",
   "Stationsnummer": 158830,
   "Latitud": 65.4273,
   "Longitud": 18.8136,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Säve-Skålvisered",
   "Stationsnummer": 71500,
   "Latitud": 57.8305,
   "Longitud": 11.92,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skalmodalen",
   "Stationsnummer": 154840,
   "Latitud": 65.4485,
   "Longitud": 14.5157,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Holmögadd A",
   "Stationsnummer": 140360,
   "Latitud": 63.5949,
   "Longitud": 20.7565,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Holmögadd A",
   "Stationsnummer": 140360,
   "Latitud": 63.5949,
   "Longitud": 20.7565,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Horda",
   "Stationsnummer": 74020,
   "Latitud": 57.0252,
   "Longitud": 14.2936,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mitandersfors D",
   "Stationsnummer": 102050,
   "Latitud": 60.0854,
   "Longitud": 12.5198,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tjärnäs",
   "Stationsnummer": 106310,
   "Latitud": 60.5129,
   "Longitud": 16.4172,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Baksjönäset",
   "Stationsnummer": 132420,
   "Latitud": 63.7062,
   "Longitud": 12.6526,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Moskosel-Abmohed D",
   "Stationsnummer": 159950,
   "Latitud": 65.8549,
   "Longitud": 19.4654,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Åsträsk D",
   "Stationsnummer": 149370,
   "Latitud": 64.6139,
   "Longitud": 19.9778,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Milsbo D",
   "Stationsnummer": 105270,
   "Latitud": 60.4471,
   "Longitud": 15.6284,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Junsele",
   "Stationsnummer": 136420,
   "Latitud": 63.6845,
   "Longitud": 16.9508,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Karats",
   "Stationsnummer": 168910,
   "Latitud": 66.6485,
   "Longitud": 18.799,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Pajala",
   "Stationsnummer": 183760,
   "Latitud": 67.2101,
   "Longitud": 23.3928,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Torup",
   "Stationsnummer": 63600,
   "Latitud": 56.9632,
   "Longitud": 13.0712,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Flötningen",
   "Stationsnummer": 112510,
   "Latitud": 61.8408,
   "Longitud": 12.2944,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Karlstad Aut",
   "Stationsnummer": 93230,
   "Latitud": 59.361,
   "Longitud": 13.4728,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grecksåsar",
   "Stationsnummer": 94330,
   "Latitud": 59.5477,
   "Longitud": 14.8136,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kolbäck D",
   "Stationsnummer": 96330,
   "Latitud": 59.5554,
   "Longitud": 16.2875,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kvarnberg D",
   "Stationsnummer": 114270,
   "Latitud": 61.4398,
   "Longitud": 14.8738,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gäddede",
   "Stationsnummer": 144300,
   "Latitud": 64.5037,
   "Longitud": 14.1596,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västanträsk",
   "Stationsnummer": 150270,
   "Latitud": 64.4502,
   "Longitud": 20.4055,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Borlänge Aut",
   "Stationsnummer": 105280,
   "Latitud": 60.4889,
   "Longitud": 15.4324,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Karlstad",
   "Stationsnummer": 93250,
   "Latitud": 59.384,
   "Longitud": 13.4455,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Garn",
   "Stationsnummer": 82030,
   "Latitud": 58.0492,
   "Longitud": 12.1563,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hässleholm",
   "Stationsnummer": 63080,
   "Latitud": 56.1367,
   "Longitud": 13.7445,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Flen",
   "Stationsnummer": 96020,
   "Latitud": 59.0502,
   "Longitud": 16.6048,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Särvsjö D",
   "Stationsnummer": 123370,
   "Latitud": 62.6309,
   "Longitud": 13.1618,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Slagnäs",
   "Stationsnummer": 158880,
   "Latitud": 65.597,
   "Longitud": 18.1795,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sälen",
   "Stationsnummer": 113100,
   "Latitud": 61.1691,
   "Longitud": 13.2593,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rössjö",
   "Stationsnummer": 138130,
   "Latitud": 63.2203,
   "Longitud": 18.3119,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Skaulo",
   "Stationsnummer": 181830,
   "Latitud": 67.4152,
   "Longitud": 21.1195,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fjärdhundra D",
   "Stationsnummer": 96460,
   "Latitud": 59.7666,
   "Longitud": 16.9166,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hjorted",
   "Stationsnummer": 76370,
   "Latitud": 57.6215,
   "Longitud": 16.3117,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Morjärv",
   "Stationsnummer": 172720,
   "Latitud": 66.0728,
   "Longitud": 22.751,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ogestad",
   "Stationsnummer": 76530,
   "Latitud": 57.8748,
   "Longitud": 16.1689,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Biellojaure",
   "Stationsnummer": 155950,
   "Latitud": 65.7992,
   "Longitud": 15.7208,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grängesberg",
   "Stationsnummer": 105050,
   "Latitud": 60.0864,
   "Longitud": 15.0202,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Omne D",
   "Stationsnummer": 128570,
   "Latitud": 62.9513,
   "Longitud": 18.3643,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Femsjö",
   "Stationsnummer": 63540,
   "Latitud": 56.89,
   "Longitud": 13.3778,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Idkerberget",
   "Stationsnummer": 105230,
   "Latitud": 60.3758,
   "Longitud": 15.231,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Pärup D",
   "Stationsnummer": 53490,
   "Latitud": 55.8096,
   "Longitud": 13.7464,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bolmen",
   "Stationsnummer": 63490,
   "Latitud": 56.8145,
   "Longitud": 13.7003,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Herråkra",
   "Stationsnummer": 65560,
   "Latitud": 56.9255,
   "Longitud": 15.1688,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Överum",
   "Stationsnummer": 76590,
   "Latitud": 57.9912,
   "Longitud": 16.3059,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Såtenäs D",
   "Stationsnummer": 82250,
   "Latitud": 58.4397,
   "Longitud": 12.6928,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kiruna",
   "Stationsnummer": 180960,
   "Latitud": 67.85,
   "Longitud": 20.2451,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fägerhult",
   "Stationsnummer": 73390,
   "Latitud": 57.6468,
   "Longitud": 13.2369,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Transtrand D",
   "Stationsnummer": 113060,
   "Latitud": 61.0797,
   "Longitud": 13.3294,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Linneryd",
   "Stationsnummer": 65390,
   "Latitud": 56.6592,
   "Longitud": 15.1381,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Karlstorp D",
   "Stationsnummer": 75320,
   "Latitud": 57.5137,
   "Longitud": 15.507,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grövelsjön",
   "Stationsnummer": 122610,
   "Latitud": 62.0991,
   "Longitud": 12.3153,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Porjus",
   "Stationsnummer": 169980,
   "Latitud": 66.9594,
   "Longitud": 19.8259,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västansjö D",
   "Stationsnummer": 116530,
   "Latitud": 61.8774,
   "Longitud": 16.535,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ballastviken",
   "Stationsnummer": 166840,
   "Latitud": 66.49,
   "Longitud": 16.5346,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Järpliden",
   "Stationsnummer": 102470,
   "Latitud": 60.7798,
   "Longitud": 12.4593,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hörken",
   "Stationsnummer": 104020,
   "Latitud": 60.029,
   "Longitud": 14.9382,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fallvik D",
   "Stationsnummer": 85090,
   "Latitud": 58.1296,
   "Longitud": 15.8608,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Forserum",
   "Stationsnummer": 74430,
   "Latitud": 57.7038,
   "Longitud": 14.4685,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norrby Säteri",
   "Stationsnummer": 87530,
   "Latitud": 58.8907,
   "Longitud": 17.1932,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ammarnäs D",
   "Stationsnummer": 156990,
   "Latitud": 65.9621,
   "Longitud": 16.2184,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Byske-Vitsjön D",
   "Stationsnummer": 161700,
   "Latitud": 65.0143,
   "Longitud": 21.2468,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Blattnicksele",
   "Stationsnummer": 157800,
   "Latitud": 65.3371,
   "Longitud": 17.4606,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Brunnshult",
   "Stationsnummer": 63420,
   "Latitud": 56.7119,
   "Longitud": 13.1626,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Munktorp D",
   "Stationsnummer": 96300,
   "Latitud": 59.5238,
   "Longitud": 16.2093,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västerlösa",
   "Stationsnummer": 85270,
   "Latitud": 58.4447,
   "Longitud": 15.3772,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hjälta kraftverk",
   "Stationsnummer": 137120,
   "Latitud": 63.1845,
   "Longitud": 17.1039,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kårböle",
   "Stationsnummer": 115590,
   "Latitud": 61.9812,
   "Longitud": 15.3235,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norråker D",
   "Stationsnummer": 145260,
   "Latitud": 64.4331,
   "Longitud": 15.5985,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sjöberg",
   "Stationsnummer": 146500,
   "Latitud": 64.8273,
   "Longitud": 16.2655,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Storfors D",
   "Stationsnummer": 94320,
   "Latitud": 59.5271,
   "Longitud": 14.276,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lindesberg D",
   "Stationsnummer": 95350,
   "Latitud": 59.5941,
   "Longitud": 15.2352,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Habo",
   "Stationsnummer": 74550,
   "Latitud": 57.9097,
   "Longitud": 14.0833,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östhammar",
   "Stationsnummer": 108150,
   "Latitud": 60.26,
   "Longitud": 18.3696,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Västanbäck D",
   "Stationsnummer": 135120,
   "Latitud": 63.1988,
   "Longitud": 15.4774,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Orrbyn",
   "Stationsnummer": 162980,
   "Latitud": 65.9446,
   "Longitud": 22.116,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Övre Svartlå D",
   "Stationsnummer": 171700,
   "Latitud": 66.0213,
   "Longitud": 21.1727,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Indal D",
   "Stationsnummer": 127340,
   "Latitud": 62.5663,
   "Longitud": 17.1201,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hemling",
   "Stationsnummer": 138400,
   "Latitud": 63.6574,
   "Longitud": 18.5318,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Dikanäs",
   "Stationsnummer": 156770,
   "Latitud": 65.2337,
   "Longitud": 16.0018,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hallsberg D",
   "Stationsnummer": 95040,
   "Latitud": 59.0605,
   "Longitud": 15.0848,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Köping",
   "Stationsnummer": 96310,
   "Latitud": 59.5259,
   "Longitud": 16.0192,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östanå",
   "Stationsnummer": 98330,
   "Latitud": 59.5544,
   "Longitud": 18.5766,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Abild",
   "Stationsnummer": 62570,
   "Latitud": 56.9512,
   "Longitud": 12.7909,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Evertsberg",
   "Stationsnummer": 113080,
   "Latitud": 61.134,
   "Longitud": 13.9663,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lekvattnet D",
   "Stationsnummer": 102110,
   "Latitud": 60.1332,
   "Longitud": 12.7707,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gyngamåla",
   "Stationsnummer": 64220,
   "Latitud": 56.3463,
   "Longitud": 14.8219,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Herrvik D",
   "Stationsnummer": 78250,
   "Latitud": 57.422,
   "Longitud": 18.9091,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Bjuv D",
   "Stationsnummer": 62050,
   "Latitud": 56.0958,
   "Longitud": 12.8862,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sättra",
   "Stationsnummer": 97250,
   "Latitud": 59.4115,
   "Longitud": 17.4754,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Råda",
   "Stationsnummer": 103000,
   "Latitud": 59.9911,
   "Longitud": 13.5948,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rösta",
   "Stationsnummer": 134150,
   "Latitud": 63.2443,
   "Longitud": 14.5535,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Söderhamn A",
   "Stationsnummer": 117160,
   "Latitud": 61.2691,
   "Longitud": 17.0983,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Drageryd",
   "Stationsnummer": 75120,
   "Latitud": 57.2001,
   "Longitud": 15.9666,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ålberga",
   "Stationsnummer": 86450,
   "Latitud": 58.7462,
   "Longitud": 16.5557,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Katrineholm D",
   "Stationsnummer": 86590,
   "Latitud": 58.9773,
   "Longitud": 16.1896,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kaunisvaara",
   "Stationsnummer": 183810,
   "Latitud": 67.3612,
   "Longitud": 23.3185,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Paharova",
   "Stationsnummer": 172950,
   "Latitud": 66.8107,
   "Longitud": 22.3408,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vägersjön",
   "Stationsnummer": 136190,
   "Latitud": 63.3159,
   "Longitud": 16.4038,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Konga",
   "Stationsnummer": 65300,
   "Latitud": 56.4918,
   "Longitud": 15.1227,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Koppom D",
   "Stationsnummer": 92420,
   "Latitud": 59.7037,
   "Longitud": 12.151,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mjöhult",
   "Stationsnummer": 73110,
   "Latitud": 57.1858,
   "Longitud": 13.1854,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Målilla",
   "Stationsnummer": 75240,
   "Latitud": 57.3964,
   "Longitud": 15.8315,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Röstebo",
   "Stationsnummer": 116230,
   "Latitud": 61.3882,
   "Longitud": 16.4295,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Killingi",
   "Stationsnummer": 180860,
   "Latitud": 67.5199,
   "Longitud": 20.2736,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lisskogsåsen",
   "Stationsnummer": 103310,
   "Latitud": 60.5007,
   "Longitud": 13.4433,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sveg",
   "Stationsnummer": 124020,
   "Latitud": 62.0191,
   "Longitud": 14.1904,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Korså",
   "Stationsnummer": 106390,
   "Latitud": 60.638,
   "Longitud": 16.1451,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Örträsk",
   "Stationsnummer": 149080,
   "Latitud": 64.1337,
   "Longitud": 18.9892,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tjåmotis D",
   "Stationsnummer": 168970,
   "Latitud": 66.9181,
   "Longitud": 18.5363,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Rimbo",
   "Stationsnummer": 98440,
   "Latitud": 59.7487,
   "Longitud": 18.3535,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sörskog",
   "Stationsnummer": 105490,
   "Latitud": 60.821,
   "Longitud": 15.377,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Risbäck D",
   "Stationsnummer": 145420,
   "Latitud": 64.7067,
   "Longitud": 15.5385,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lansjärv",
   "Stationsnummer": 172890,
   "Latitud": 66.6575,
   "Longitud": 22.1935,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Karesuando",
   "Stationsnummer": 192830,
   "Latitud": 68.4421,
   "Longitud": 22.4502,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Solberg",
   "Stationsnummer": 137470,
   "Latitud": 63.787,
   "Longitud": 17.6517,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grundforsen",
   "Stationsnummer": 112170,
   "Latitud": 61.2797,
   "Longitud": 12.8568,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fagersta",
   "Stationsnummer": 105000,
   "Latitud": 60.0023,
   "Longitud": 15.8045,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Säter D",
   "Stationsnummer": 105210,
   "Latitud": 60.3438,
   "Longitud": 15.7611,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Svensbyn D",
   "Stationsnummer": 92200,
   "Latitud": 59.3252,
   "Longitud": 12.3087,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kroksjö",
   "Stationsnummer": 148300,
   "Latitud": 64.5073,
   "Longitud": 17.9934,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mariedal",
   "Stationsnummer": 62090,
   "Latitud": 56.1443,
   "Longitud": 12.7112,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hedemora",
   "Stationsnummer": 105160,
   "Latitud": 60.2783,
   "Longitud": 15.9872,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sölvesborg",
   "Stationsnummer": 64060,
   "Latitud": 56.0573,
   "Longitud": 14.5902,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Arlanda",
   "Stationsnummer": 97390,
   "Latitud": 59.66,
   "Longitud": 17.9208,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Djurås D",
   "Stationsnummer": 105330,
   "Latitud": 60.5581,
   "Longitud": 15.1182,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Ransaren D",
   "Stationsnummer": 155730,
   "Latitud": 65.1391,
   "Longitud": 15.0472,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vuonatjviken",
   "Stationsnummer": 167850,
   "Latitud": 66.4934,
   "Longitud": 17.2461,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Östmark-Lämbacken",
   "Stationsnummer": 102190,
   "Latitud": 60.306,
   "Longitud": 12.6977,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Marsliden",
   "Stationsnummer": 155720,
   "Latitud": 65.0251,
   "Longitud": 15.3668,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Klinte D",
   "Stationsnummer": 78220,
   "Latitud": 57.3719,
   "Longitud": 18.2463,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Visingsö D",
   "Stationsnummer": 84060,
   "Latitud": 58.0735,
   "Longitud": 14.3599,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Lisjö",
   "Stationsnummer": 96420,
   "Latitud": 59.7017,
   "Longitud": 16.0615,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Torsby",
   "Stationsnummer": 103080,
   "Latitud": 60.1075,
   "Longitud": 12.9908,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Häggsjön",
   "Stationsnummer": 132310,
   "Latitud": 63.5158,
   "Longitud": 12.7159,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Norrbäck",
   "Stationsnummer": 147430,
   "Latitud": 64.7112,
   "Longitud": 17.7154,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Risnäset D",
   "Stationsnummer": 146150,
   "Latitud": 64.2507,
   "Longitud": 16.4967,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sösdala",
   "Stationsnummer": 63030,
   "Latitud": 56.0355,
   "Longitud": 13.6939,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Forsnäset",
   "Stationsnummer": 136310,
   "Latitud": 63.5215,
   "Longitud": 16.6774,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vinslöv D",
   "Stationsnummer": 63040,
   "Latitud": 56.0996,
   "Longitud": 13.9244,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Brednoret D",
   "Stationsnummer": 140560,
   "Latitud": 63.929,
   "Longitud": 20.7805,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Eklången",
   "Stationsnummer": 96140,
   "Latitud": 59.2358,
   "Longitud": 16.7429,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vitsand D",
   "Stationsnummer": 103210,
   "Latitud": 60.3252,
   "Longitud": 13.0065,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Valla",
   "Stationsnummer": 96000,
   "Latitud": 59.0185,
   "Longitud": 16.3709,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gullringen",
   "Stationsnummer": 75490,
   "Latitud": 57.812,
   "Longitud": 15.6662,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Porjus2 D",
   "Stationsnummer": 169990,
   "Latitud": 66.9764,
   "Longitud": 19.8443,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Simonstorp",
   "Stationsnummer": 86470,
   "Latitud": 58.7847,
   "Longitud": 16.1544,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hoby",
   "Stationsnummer": 65150,
   "Latitud": 56.2163,
   "Longitud": 15.099,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tranås",
   "Stationsnummer": 84020,
   "Latitud": 58.0389,
   "Longitud": 14.9853,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Husarö",
   "Stationsnummer": 98290,
   "Latitud": 59.5052,
   "Longitud": 18.8417,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Laforsen",
   "Stationsnummer": 115570,
   "Latitud": 61.9445,
   "Longitud": 15.5013,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tvärforsen",
   "Stationsnummer": 126050,
   "Latitud": 62.0852,
   "Longitud": 16.2272,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fagerheden",
   "Stationsnummer": 160800,
   "Latitud": 65.3373,
   "Longitud": 20.9026,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gittun",
   "Stationsnummer": 168760,
   "Latitud": 66.3013,
   "Longitud": 18.5504,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gustavsnäs D",
   "Stationsnummer": 125490,
   "Latitud": 62.8108,
   "Longitud": 15.9333,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gustavsberg",
   "Stationsnummer": 98180,
   "Latitud": 59.3226,
   "Longitud": 18.3725,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grycksbo D",
   "Stationsnummer": 105420,
   "Latitud": 60.6907,
   "Longitud": 15.491,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Vikarbyn D",
   "Stationsnummer": 105560,
   "Latitud": 60.9189,
   "Longitud": 15.0329,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Snavlunda D",
   "Stationsnummer": 84580,
   "Latitud": 58.948,
   "Longitud": 14.9056,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Hassela D",
   "Stationsnummer": 126070,
   "Latitud": 62.1001,
   "Longitud": 16.7849,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Harbo",
   "Stationsnummer": 107080,
   "Latitud": 60.1364,
   "Longitud": 17.2382,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Järnboås D",
   "Stationsnummer": 94380,
   "Latitud": 59.6446,
   "Longitud": 14.8861,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kenttäsaari D",
   "Stationsnummer": 172960,
   "Latitud": 66.8155,
   "Longitud": 22.8944,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gunnarn",
   "Stationsnummer": 147570,
   "Latitud": 65.0099,
   "Longitud": 17.7014,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sturefors",
   "Stationsnummer": 85190,
   "Latitud": 58.3159,
   "Longitud": 15.7144,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Fjugesta D",
   "Stationsnummer": 94110,
   "Latitud": 59.1829,
   "Longitud": 14.8557,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Kasa D",
   "Stationsnummer": 139200,
   "Latitud": 63.3266,
   "Longitud": 19.0532,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Granhult D",
   "Stationsnummer": 181740,
   "Latitud": 67.1254,
   "Longitud": 21.7977,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Jäkkvik V",
   "Stationsnummer": 167800,
   "Latitud": 66.3242,
   "Longitud": 17.0944,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Havraryd D",
   "Stationsnummer": 63480,
   "Latitud": 56.7923,
   "Longitud": 13.1384,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Grindsjön",
   "Stationsnummer": 97050,
   "Latitud": 59.0809,
   "Longitud": 17.8617,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Gillinge D",
   "Stationsnummer": 98060,
   "Latitud": 59.1112,
   "Longitud": 18.6545,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Mårtensboda D",
   "Stationsnummer": 150280,
   "Latitud": 64.4489,
   "Longitud": 20.9446,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Tvingelshed",
   "Stationsnummer": 65200,
   "Latitud": 56.3254,
   "Longitud": 15.5793,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Sanne",
   "Stationsnummer": 81380,
   "Latitud": 58.6707,
   "Longitud": 11.8739,
   "Aktiv": 0
 },
 {
   "Stationsnamn": "Nyhyttan D",
   "Stationsnummer": 105190,
   "Latitud": 60.3217,
   "Longitud": 15.5566,
   "Aktiv": 0
 }
]
},{}],3:[function(require,module,exports){
module.exports={"type":"Feature","properties":{"scalerank":1,"labelrank":3,"sovereignt":"Sweden","sov_a3":"SWE","adm0_dif":0,"level":2,"type":"Sovereign country","admin":"Sweden","adm0_a3":"SWE","geou_dif":0,"geounit":"Sweden","gu_a3":"SWE","su_dif":0,"subunit":"Sweden","su_a3":"SWE","brk_diff":0,"name":"Sweden","name_long":"Sweden","brk_a3":"SWE","brk_name":"Sweden","brk_group":null,"abbrev":"Swe.","postal":"S","formal_en":"Kingdom of Sweden","formal_fr":null,"note_adm0":null,"note_brk":null,"name_sort":"Sweden","name_alt":null,"mapcolor7":1,"mapcolor8":4,"mapcolor9":2,"mapcolor13":4,"pop_est":9059651,"gdp_md_est":344300,"pop_year":-99,"lastcensus":-99,"gdp_year":-99,"economy":"2. Developed region: nonG7","income_grp":"1. High income: OECD","wikipedia":-99,"fips_10":null,"iso_a2":"SE","iso_a3":"SWE","iso_n3":"752","un_a3":"752","wb_a2":"SE","wb_a3":"SWE","woe_id":-99,"adm0_a3_is":"SWE","adm0_a3_us":"SWE","adm0_a3_un":-99,"adm0_a3_wb":-99,"continent":"Europe","region_un":"Europe","subregion":"Northern Europe","region_wb":"Europe & Central Asia","name_len":6,"long_len":6,"abbrev_len":4,"tiny":-99,"homepart":1,"featureclass":"Admin-0 country"},"geometry":{"type":"Polygon","coordinates":[[[22.18317345550193,65.72374054632017],[21.21351687997722,65.02600535751527],[21.369631381930958,64.41358795842429],[19.77887576669022,63.60955434839504],[17.84777916837521,62.74940013289681],[17.119554884518124,61.34116567651097],[17.83134606290639,60.63658336042741],[18.78772179533209,60.081914374422595],[17.86922488777634,58.9537661810587],[16.829185011470088,58.71982697207339],[16.447709588291474,57.041118069071885],[15.879785597403783,56.10430186626866],[14.666681349352075,56.200885118222175],[14.100721062891465,55.40778107362265],[12.942910597392057,55.36173737245058],[12.625100538797028,56.30708018658197],[11.787942335668674,57.44181712506307],[11.027368605196868,58.85614940045936],[11.468271925511146,59.43239329694604],[12.3003658382749,60.11793284773003],[12.631146681375185,61.293571682370136],[11.992064243221563,61.80036245385655],[11.930569288794231,63.12831757267698],[12.579935336973934,64.06621898055833],[13.571916131248713,64.04911408146971],[13.919905226302204,64.44542064071608],[13.55568973150909,64.78702769638151],[15.108411492583002,66.19386688909547],[16.108712192456778,67.30245555283689],[16.768878614985482,68.0139366726314],[17.729181756265348,68.01055186631628],[17.993868442464333,68.56739126247736],[19.878559604581255,68.40719432237258],[20.025268995857886,69.0651386583127],[20.645592889089528,69.10624726020087],[21.978534783626117,68.6168456081807],[23.53947309743444,67.93600861273525],[23.565879754335583,66.39605093043743],[23.903378533633802,66.00692739527962],[22.18317345550193,65.72374054632017]]]}}
},{}],4:[function(require,module,exports){
module.exports = function (canvas, name) {
  var link = document.createElement('a')
  link.href = '#'
  link.addEventListener('mousedown', function(ev) {
      link.href = canvas.toDataURL()
      link.download = name || 'unnamed.png'
      ev.preventDefault()
  }, false)

  return link
}

},{}],5:[function(require,module,exports){
'use strict';

var invariant = require('@turf/invariant');

// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

/**
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point resides inside the polygon. The polygon can
 * be convex or concave. The function accounts for holes.
 *
 * @name booleanPointInPolygon
 * @param {Coord} point input point
 * @param {Feature<Polygon|MultiPolygon>} polygon input polygon or multipolygon
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.ignoreBoundary=false] True if polygon boundary should be ignored when determining if the point is inside the polygon otherwise false.
 * @returns {boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 * @example
 * var pt = turf.point([-77, 44]);
 * var poly = turf.polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]]);
 *
 * turf.booleanPointInPolygon(pt, poly);
 * //= true
 */
function booleanPointInPolygon(point, polygon, options) {
    // Optional parameters
    options = options || {};
    if (typeof options !== 'object') throw new Error('options is invalid');
    var ignoreBoundary = options.ignoreBoundary;

    // validation
    if (!point) throw new Error('point is required');
    if (!polygon) throw new Error('polygon is required');

    var pt = invariant.getCoord(point);
    var polys = invariant.getCoords(polygon);
    var type = (polygon.geometry) ? polygon.geometry.type : polygon.type;
    var bbox = polygon.bbox;

    // Quick elimination if point is not inside bbox
    if (bbox && inBBox(pt, bbox) === false) return false;

    // normalize to multipolygon
    if (type === 'Polygon') polys = [polys];

    for (var i = 0, insidePoly = false; i < polys.length && !insidePoly; i++) {
        // check if it is in the outer ring first
        if (inRing(pt, polys[i][0], ignoreBoundary)) {
            var inHole = false;
            var k = 1;
            // check for the point in any of the holes
            while (k < polys[i].length && !inHole) {
                if (inRing(pt, polys[i][k], !ignoreBoundary)) {
                    inHole = true;
                }
                k++;
            }
            if (!inHole) insidePoly = true;
        }
    }
    return insidePoly;
}

/**
 * inRing
 *
 * @private
 * @param {Array<number>} pt [x,y]
 * @param {Array<Array<number>>} ring [[x,y], [x,y],..]
 * @param {boolean} ignoreBoundary ignoreBoundary
 * @returns {boolean} inRing
 */
function inRing(pt, ring, ignoreBoundary) {
    var isInside = false;
    if (ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]) ring = ring.slice(0, ring.length - 1);

    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0], yi = ring[i][1];
        var xj = ring[j][0], yj = ring[j][1];
        var onBoundary = (pt[1] * (xi - xj) + yi * (xj - pt[0]) + yj * (pt[0] - xi) === 0) &&
            ((xi - pt[0]) * (xj - pt[0]) <= 0) && ((yi - pt[1]) * (yj - pt[1]) <= 0);
        if (onBoundary) return !ignoreBoundary;
        var intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
}

/**
 * inBBox
 *
 * @private
 * @param {Position} pt point [x,y]
 * @param {BBox} bbox BBox [west, south, east, north]
 * @returns {boolean} true/false if point is inside BBox
 */
function inBBox(pt, bbox) {
    return bbox[0] <= pt[0] &&
           bbox[1] <= pt[1] &&
           bbox[2] >= pt[0] &&
           bbox[3] >= pt[1];
}

module.exports = booleanPointInPolygon;
module.exports.default = booleanPointInPolygon;

},{"@turf/invariant":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 */
var earthRadius = 6371008.8;

/**
 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
 */
var factors = {
    meters: earthRadius,
    metres: earthRadius,
    millimeters: earthRadius * 1000,
    millimetres: earthRadius * 1000,
    centimeters: earthRadius * 100,
    centimetres: earthRadius * 100,
    kilometers: earthRadius / 1000,
    kilometres: earthRadius / 1000,
    miles: earthRadius / 1609.344,
    nauticalmiles: earthRadius / 1852,
    inches: earthRadius * 39.370,
    yards: earthRadius / 1.0936,
    feet: earthRadius * 3.28084,
    radians: 1,
    degrees: earthRadius / 111325,
};

/**
 * Units of measurement factors based on 1 meter.
 */
var unitsFactors = {
    meters: 1,
    metres: 1,
    millimeters: 1000,
    millimetres: 1000,
    centimeters: 100,
    centimetres: 100,
    kilometers: 1 / 1000,
    kilometres: 1 / 1000,
    miles: 1 / 1609.344,
    nauticalmiles: 1 / 1852,
    inches: 39.370,
    yards: 1 / 1.0936,
    feet: 3.28084,
    radians: 1 / earthRadius,
    degrees: 1 / 111325,
};

/**
 * Area of measurement factors based on 1 square meter.
 */
var areaFactors = {
    meters: 1,
    metres: 1,
    millimeters: 1000000,
    millimetres: 1000000,
    centimeters: 10000,
    centimetres: 10000,
    kilometers: 0.000001,
    kilometres: 0.000001,
    acres: 0.000247105,
    miles: 3.86e-7,
    yards: 1.195990046,
    feet: 10.763910417,
    inches: 1550.003100006
};

/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geometry, properties, options) {
    // Optional Parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var bbox = options.bbox;
    var id = options.id;

    // Validation
    if (geometry === undefined) throw new Error('geometry is required');
    if (properties && properties.constructor !== Object) throw new Error('properties must be an Object');
    if (bbox) validateBBox(bbox);
    if (id !== 0 && id) validateId(id);

    // Main
    var feat = {type: 'Feature'};
    if (id === 0 || id) feat.id = id;
    if (bbox) feat.bbox = bbox;
    feat.properties = properties || {};
    feat.geometry = geometry;
    return feat;
}

/**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<number>} coordinates Coordinates
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Geometry
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = 'Point';
 * var coordinates = [110, 50];
 *
 * var geometry = turf.geometry(type, coordinates);
 *
 * //=geometry
 */
function geometry(type, coordinates, options) {
    // Optional Parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var bbox = options.bbox;

    // Validation
    if (!type) throw new Error('type is required');
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');
    if (bbox) validateBBox(bbox);

    // Main
    var geom;
    switch (type) {
    case 'Point': geom = point(coordinates).geometry; break;
    case 'LineString': geom = lineString(coordinates).geometry; break;
    case 'Polygon': geom = polygon(coordinates).geometry; break;
    case 'MultiPoint': geom = multiPoint(coordinates).geometry; break;
    case 'MultiLineString': geom = multiLineString(coordinates).geometry; break;
    case 'MultiPolygon': geom = multiPolygon(coordinates).geometry; break;
    default: throw new Error(type + ' is invalid');
    }
    if (bbox) geom.bbox = bbox;
    return geom;
}

/**
 * Creates a {@link Point} {@link Feature} from a Position.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
function point(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');
    if (coordinates.length < 2) throw new Error('coordinates must be at least 2 numbers long');
    if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) throw new Error('coordinates must contain numbers');

    return feature({
        type: 'Point',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
 *
 * @name points
 * @param {Array<Array<number>>} coordinates an array of Points
 * @param {Object} [properties={}] Translate these properties to each Feature
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Point>} Point Feature
 * @example
 * var points = turf.points([
 *   [-75, 39],
 *   [-80, 45],
 *   [-78, 50]
 * ]);
 *
 * //=points
 */
function points(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');

    return featureCollection(coordinates.map(function (coords) {
        return point(coords, properties);
    }), options);
}

/**
 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Polygon>} Polygon Feature
 * @example
 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
 *
 * //=polygon
 */
function polygon(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');

    for (var i = 0; i < coordinates.length; i++) {
        var ring = coordinates[i];
        if (ring.length < 4) {
            throw new Error('Each LinearRing of a Polygon must have 4 or more Positions.');
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            // Check if first point of Polygon contains two numbers
            if (i === 0 && j === 0 && !isNumber(ring[0][0]) || !isNumber(ring[0][1])) throw new Error('coordinates must contain numbers');
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error('First and last Position are not equivalent.');
            }
        }
    }

    return feature({
        type: 'Polygon',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
 *
 * @name polygons
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
 * @example
 * var polygons = turf.polygons([
 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
 * ]);
 *
 * //=polygons
 */
function polygons(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');

    return featureCollection(coordinates.map(function (coords) {
        return polygon(coords, properties);
    }), options);
}

/**
 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<LineString>} LineString Feature
 * @example
 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
 *
 * //=linestring1
 * //=linestring2
 */
function lineString(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');
    if (coordinates.length < 2) throw new Error('coordinates must be an array of two or more positions');
    // Check if first point of LineString contains two numbers
    if (!isNumber(coordinates[0][1]) || !isNumber(coordinates[0][1])) throw new Error('coordinates must contain numbers');

    return feature({
        type: 'LineString',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
 *
 * @name lineStrings
 * @param {Array<Array<number>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
 * @example
 * var linestrings = turf.lineStrings([
 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
 * ]);
 *
 * //=linestrings
 */
function lineStrings(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');

    return featureCollection(coordinates.map(function (coords) {
        return lineString(coords, properties);
    }), options);
}

/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {FeatureCollection} FeatureCollection of Features
 * @example
 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
 *
 * var collection = turf.featureCollection([
 *   locationA,
 *   locationB,
 *   locationC
 * ]);
 *
 * //=collection
 */
function featureCollection(features, options) {
    // Optional Parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var bbox = options.bbox;
    var id = options.id;

    // Validation
    if (!features) throw new Error('No features passed');
    if (!Array.isArray(features)) throw new Error('features must be an Array');
    if (bbox) validateBBox(bbox);
    if (id) validateId(id);

    // Main
    var fc = {type: 'FeatureCollection'};
    if (id) fc.id = id;
    if (bbox) fc.bbox = bbox;
    fc.features = features;
    return fc;
}

/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
function multiLineString(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');

    return feature({
        type: 'MultiLineString',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
function multiPoint(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');

    return feature({
        type: 'MultiPoint',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
function multiPolygon(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');

    return feature({
        type: 'MultiPolygon',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = {
 *     "type": "Point",
 *       "coordinates": [100, 0]
 *     };
 * var line = {
 *     "type": "LineString",
 *     "coordinates": [ [101, 0], [102, 1] ]
 *   };
 * var collection = turf.geometryCollection([pt, line]);
 *
 * //=collection
 */
function geometryCollection(geometries, properties, options) {
    if (!geometries) throw new Error('geometries is required');
    if (!Array.isArray(geometries)) throw new Error('geometries must be an Array');

    return feature({
        type: 'GeometryCollection',
        geometries: geometries
    }, properties, options);
}

/**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */
function round(num, precision) {
    if (num === undefined || num === null || isNaN(num)) throw new Error('num is required');
    if (precision && !(precision >= 0)) throw new Error('precision must be a positive number');
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(num * multiplier) / multiplier;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToLength
 * @param {number} radians in radians across the sphere
 * @param {string} [units='kilometers'] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} distance
 */
function radiansToLength(radians, units) {
    if (radians === undefined || radians === null) throw new Error('radians is required');

    if (units && typeof units !== 'string') throw new Error('units must be a string');
    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error(units + ' units is invalid');
    return radians * factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name lengthToRadians
 * @param {number} distance in real units
 * @param {string} [units='kilometers'] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} radians
 */
function lengthToRadians(distance, units) {
    if (distance === undefined || distance === null) throw new Error('distance is required');

    if (units && typeof units !== 'string') throw new Error('units must be a string');
    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error(units + ' units is invalid');
    return distance / factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name lengthToDegrees
 * @param {number} distance in real units
 * @param {string} [units='kilometers'] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} degrees
 */
function lengthToDegrees(distance, units) {
    return radiansToDegrees(lengthToRadians(distance, units));
}

/**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAzimuth
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */
function bearingToAzimuth(bearing) {
    if (bearing === null || bearing === undefined) throw new Error('bearing is required');

    var angle = bearing % 360;
    if (angle < 0) angle += 360;
    return angle;
}

/**
 * Converts an angle in radians to degrees
 *
 * @name radiansToDegrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
function radiansToDegrees(radians) {
    if (radians === null || radians === undefined) throw new Error('radians is required');

    var degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
}

/**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
function degreesToRadians(degrees) {
    if (degrees === null || degrees === undefined) throw new Error('degrees is required');

    var radians = degrees % 360;
    return radians * Math.PI / 180;
}

/**
 * Converts a length to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} length to be converted
 * @param {string} originalUnit of the length
 * @param {string} [finalUnit='kilometers'] returned unit
 * @returns {number} the converted length
 */
function convertLength(length, originalUnit, finalUnit) {
    if (length === null || length === undefined) throw new Error('length is required');
    if (!(length >= 0)) throw new Error('length must be a positive number');

    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit || 'kilometers');
}

/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches
 * @param {number} area to be converted
 * @param {string} [originalUnit='meters'] of the distance
 * @param {string} [finalUnit='kilometers'] returned unit
 * @returns {number} the converted distance
 */
function convertArea(area, originalUnit, finalUnit) {
    if (area === null || area === undefined) throw new Error('area is required');
    if (!(area >= 0)) throw new Error('area must be a positive number');

    var startFactor = areaFactors[originalUnit || 'meters'];
    if (!startFactor) throw new Error('invalid original units');

    var finalFactor = areaFactors[finalUnit || 'kilometers'];
    if (!finalFactor) throw new Error('invalid final units');

    return (area / startFactor) * finalFactor;
}

/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num);
}

/**
 * isObject
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false
 * @example
 * turf.isObject({elevation: 10})
 * //=true
 * turf.isObject('foo')
 * //=false
 */
function isObject(input) {
    return (!!input) && (input.constructor === Object);
}

/**
 * Validate BBox
 *
 * @private
 * @param {Array<number>} bbox BBox to validate
 * @returns {void}
 * @throws Error if BBox is not valid
 * @example
 * validateBBox([-180, -40, 110, 50])
 * //=OK
 * validateBBox([-180, -40])
 * //=Error
 * validateBBox('Foo')
 * //=Error
 * validateBBox(5)
 * //=Error
 * validateBBox(null)
 * //=Error
 * validateBBox(undefined)
 * //=Error
 */
function validateBBox(bbox) {
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) throw new Error('bbox must be an Array');
    if (bbox.length !== 4 && bbox.length !== 6) throw new Error('bbox must be an Array of 4 or 6 numbers');
    bbox.forEach(function (num) {
        if (!isNumber(num)) throw new Error('bbox must only contain numbers');
    });
}

/**
 * Validate Id
 *
 * @private
 * @param {string|number} id Id to validate
 * @returns {void}
 * @throws Error if Id is not valid
 * @example
 * validateId([-180, -40, 110, 50])
 * //=Error
 * validateId([-180, -40])
 * //=Error
 * validateId('Foo')
 * //=OK
 * validateId(5)
 * //=OK
 * validateId(null)
 * //=Error
 * validateId(undefined)
 * //=Error
 */
function validateId(id) {
    if (!id) throw new Error('id is required');
    if (['string', 'number'].indexOf(typeof id) === -1) throw new Error('id must be a number or a string');
}

// Deprecated methods
function radians2degrees() {
    throw new Error('method has been renamed to `radiansToDegrees`');
}

function degrees2radians() {
    throw new Error('method has been renamed to `degreesToRadians`');
}

function distanceToDegrees() {
    throw new Error('method has been renamed to `lengthToDegrees`');
}

function distanceToRadians() {
    throw new Error('method has been renamed to `lengthToRadians`');
}

function radiansToDistance() {
    throw new Error('method has been renamed to `radiansToLength`');
}

function bearingToAngle() {
    throw new Error('method has been renamed to `bearingToAzimuth`');
}

function convertDistance() {
    throw new Error('method has been renamed to `convertLength`');
}

exports.earthRadius = earthRadius;
exports.factors = factors;
exports.unitsFactors = unitsFactors;
exports.areaFactors = areaFactors;
exports.feature = feature;
exports.geometry = geometry;
exports.point = point;
exports.points = points;
exports.polygon = polygon;
exports.polygons = polygons;
exports.lineString = lineString;
exports.lineStrings = lineStrings;
exports.featureCollection = featureCollection;
exports.multiLineString = multiLineString;
exports.multiPoint = multiPoint;
exports.multiPolygon = multiPolygon;
exports.geometryCollection = geometryCollection;
exports.round = round;
exports.radiansToLength = radiansToLength;
exports.lengthToRadians = lengthToRadians;
exports.lengthToDegrees = lengthToDegrees;
exports.bearingToAzimuth = bearingToAzimuth;
exports.radiansToDegrees = radiansToDegrees;
exports.degreesToRadians = degreesToRadians;
exports.convertLength = convertLength;
exports.convertArea = convertArea;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.validateBBox = validateBBox;
exports.validateId = validateId;
exports.radians2degrees = radians2degrees;
exports.degrees2radians = degrees2radians;
exports.distanceToDegrees = distanceToDegrees;
exports.distanceToRadians = distanceToRadians;
exports.radiansToDistance = radiansToDistance;
exports.bearingToAngle = bearingToAngle;
exports.convertDistance = convertDistance;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var helpers = require('@turf/helpers');

/**
 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
 *
 * @name getCoord
 * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
 * @returns {Array<number>} coordinates
 * @example
 * var pt = turf.point([10, 10]);
 *
 * var coord = turf.getCoord(pt);
 * //= [10, 10]
 */
function getCoord(coord) {
    if (!coord) throw new Error('coord is required');
    if (coord.type === 'Feature' && coord.geometry !== null && coord.geometry.type === 'Point') return coord.geometry.coordinates;
    if (coord.type === 'Point') return coord.coordinates;
    if (Array.isArray(coord) && coord.length >= 2 && coord[0].length === undefined && coord[1].length === undefined) return coord;

    throw new Error('coord must be GeoJSON Point or an Array of numbers');
}

/**
 * Unwrap coordinates from a Feature, Geometry Object or an Array
 *
 * @name getCoords
 * @param {Array<any>|Geometry|Feature} coords Feature, Geometry Object or an Array
 * @returns {Array<any>} coordinates
 * @example
 * var poly = turf.polygon([[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]);
 *
 * var coords = turf.getCoords(poly);
 * //= [[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]
 */
function getCoords(coords) {
    if (!coords) throw new Error('coords is required');

    // Feature
    if (coords.type === 'Feature' && coords.geometry !== null) return coords.geometry.coordinates;

    // Geometry
    if (coords.coordinates) return coords.coordinates;

    // Array of numbers
    if (Array.isArray(coords)) return coords;

    throw new Error('coords must be GeoJSON Feature, Geometry Object or an Array');
}

/**
 * Checks if coordinates contains a number
 *
 * @name containsNumber
 * @param {Array<any>} coordinates GeoJSON Coordinates
 * @returns {boolean} true if Array contains a number
 */
function containsNumber(coordinates) {
    if (coordinates.length > 1 && helpers.isNumber(coordinates[0]) && helpers.isNumber(coordinates[1])) {
        return true;
    }

    if (Array.isArray(coordinates[0]) && coordinates[0].length) {
        return containsNumber(coordinates[0]);
    }
    throw new Error('coordinates must only contain numbers');
}

/**
 * Enforce expectations about types of GeoJSON objects for Turf.
 *
 * @name geojsonType
 * @param {GeoJSON} value any GeoJSON object
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function geojsonType(value, type, name) {
    if (!type || !name) throw new Error('type and name required');

    if (!value || value.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + value.type);
    }
}

/**
 * Enforce expectations about types of {@link Feature} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name featureOf
 * @param {Feature} feature a feature with an expected geometry type
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} error if value is not the expected type.
 */
function featureOf(feature, type, name) {
    if (!feature) throw new Error('No feature passed');
    if (!name) throw new Error('.featureOf() requires a name');
    if (!feature || feature.type !== 'Feature' || !feature.geometry) {
        throw new Error('Invalid input to ' + name + ', Feature with geometry required');
    }
    if (!feature.geometry || feature.geometry.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
    }
}

/**
 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name collectionOf
 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function collectionOf(featureCollection, type, name) {
    if (!featureCollection) throw new Error('No featureCollection passed');
    if (!name) throw new Error('.collectionOf() requires a name');
    if (!featureCollection || featureCollection.type !== 'FeatureCollection') {
        throw new Error('Invalid input to ' + name + ', FeatureCollection required');
    }
    for (var i = 0; i < featureCollection.features.length; i++) {
        var feature = featureCollection.features[i];
        if (!feature || feature.type !== 'Feature' || !feature.geometry) {
            throw new Error('Invalid input to ' + name + ', Feature with geometry required');
        }
        if (!feature.geometry || feature.geometry.type !== type) {
            throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
        }
    }
}

/**
 * Get Geometry from Feature or Geometry Object
 *
 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
 * @returns {Geometry|null} GeoJSON Geometry Object
 * @throws {Error} if geojson is not a Feature or Geometry Object
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getGeom(point)
 * //={"type": "Point", "coordinates": [110, 40]}
 */
function getGeom(geojson) {
    if (!geojson) throw new Error('geojson is required');
    if (geojson.geometry !== undefined) return geojson.geometry;
    if (geojson.coordinates || geojson.geometries) return geojson;
    throw new Error('geojson must be a valid Feature or Geometry Object');
}

/**
 * Get Geometry Type from Feature or Geometry Object
 *
 * @throws {Error} **DEPRECATED** in v5.0.0 in favor of getType
 */
function getGeomType() {
    throw new Error('invariant.getGeomType has been deprecated in v5.0 in favor of invariant.getType');
}

/**
 * Get GeoJSON object's type, Geometry type is prioritize.
 *
 * @param {GeoJSON} geojson GeoJSON object
 * @param {string} [name="geojson"] name of the variable to display in error message
 * @returns {string} GeoJSON type
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getType(point)
 * //="Point"
 */
function getType(geojson, name) {
    if (!geojson) throw new Error((name || 'geojson') + ' is required');
    // GeoJSON Feature & GeometryCollection
    if (geojson.geometry && geojson.geometry.type) return geojson.geometry.type;
    // GeoJSON Geometry & FeatureCollection
    if (geojson.type) return geojson.type;
    throw new Error((name || 'geojson') + ' is invalid');
}

exports.getCoord = getCoord;
exports.getCoords = getCoords;
exports.containsNumber = containsNumber;
exports.geojsonType = geojsonType;
exports.featureOf = featureOf;
exports.collectionOf = collectionOf;
exports.getGeom = getGeom;
exports.getGeomType = getGeomType;
exports.getType = getType;

},{"@turf/helpers":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 */
var earthRadius = 6371008.8;

/**
 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
 */
var factors = {
    meters: earthRadius,
    metres: earthRadius,
    millimeters: earthRadius * 1000,
    millimetres: earthRadius * 1000,
    centimeters: earthRadius * 100,
    centimetres: earthRadius * 100,
    kilometers: earthRadius / 1000,
    kilometres: earthRadius / 1000,
    miles: earthRadius / 1609.344,
    nauticalmiles: earthRadius / 1852,
    inches: earthRadius * 39.370,
    yards: earthRadius / 1.0936,
    feet: earthRadius * 3.28084,
    radians: 1,
    degrees: earthRadius / 111325,
};

/**
 * Units of measurement factors based on 1 meter.
 */
var unitsFactors = {
    meters: 1,
    metres: 1,
    millimeters: 1000,
    millimetres: 1000,
    centimeters: 100,
    centimetres: 100,
    kilometers: 1 / 1000,
    kilometres: 1 / 1000,
    miles: 1 / 1609.344,
    nauticalmiles: 1 / 1852,
    inches: 39.370,
    yards: 1 / 1.0936,
    feet: 3.28084,
    radians: 1 / earthRadius,
    degrees: 1 / 111325,
};

/**
 * Area of measurement factors based on 1 square meter.
 */
var areaFactors = {
    meters: 1,
    metres: 1,
    millimeters: 1000000,
    millimetres: 1000000,
    centimeters: 10000,
    centimetres: 10000,
    kilometers: 0.000001,
    kilometres: 0.000001,
    acres: 0.000247105,
    miles: 3.86e-7,
    yards: 1.195990046,
    feet: 10.763910417,
    inches: 1550.003100006
};

/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geometry, properties, options) {
    // Optional Parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var bbox = options.bbox;
    var id = options.id;

    // Validation
    if (geometry === undefined) throw new Error('geometry is required');
    if (properties && properties.constructor !== Object) throw new Error('properties must be an Object');
    if (bbox) validateBBox(bbox);
    if (id) validateId(id);

    // Main
    var feat = {type: 'Feature'};
    if (id) feat.id = id;
    if (bbox) feat.bbox = bbox;
    feat.properties = properties || {};
    feat.geometry = geometry;
    return feat;
}

/**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<number>} coordinates Coordinates
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Geometry
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = 'Point';
 * var coordinates = [110, 50];
 *
 * var geometry = turf.geometry(type, coordinates);
 *
 * //=geometry
 */
function geometry(type, coordinates, options) {
    // Optional Parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var bbox = options.bbox;

    // Validation
    if (!type) throw new Error('type is required');
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');
    if (bbox) validateBBox(bbox);

    // Main
    var geom;
    switch (type) {
    case 'Point': geom = point(coordinates).geometry; break;
    case 'LineString': geom = lineString(coordinates).geometry; break;
    case 'Polygon': geom = polygon(coordinates).geometry; break;
    case 'MultiPoint': geom = multiPoint(coordinates).geometry; break;
    case 'MultiLineString': geom = multiLineString(coordinates).geometry; break;
    case 'MultiPolygon': geom = multiPolygon(coordinates).geometry; break;
    default: throw new Error(type + ' is invalid');
    }
    if (bbox) geom.bbox = bbox;
    return geom;
}

/**
 * Creates a {@link Point} {@link Feature} from a Position.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
function point(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');
    if (coordinates.length < 2) throw new Error('coordinates must be at least 2 numbers long');
    if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) throw new Error('coordinates must contain numbers');

    return feature({
        type: 'Point',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
 *
 * @name points
 * @param {Array<Array<number>>} coordinates an array of Points
 * @param {Object} [properties={}] Translate these properties to each Feature
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Point>} Point Feature
 * @example
 * var points = turf.points([
 *   [-75, 39],
 *   [-80, 45],
 *   [-78, 50]
 * ]);
 *
 * //=points
 */
function points(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');

    return featureCollection(coordinates.map(function (coords) {
        return point(coords, properties);
    }), options);
}

/**
 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Polygon>} Polygon Feature
 * @example
 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
 *
 * //=polygon
 */
function polygon(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');

    for (var i = 0; i < coordinates.length; i++) {
        var ring = coordinates[i];
        if (ring.length < 4) {
            throw new Error('Each LinearRing of a Polygon must have 4 or more Positions.');
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            // Check if first point of Polygon contains two numbers
            if (i === 0 && j === 0 && !isNumber(ring[0][0]) || !isNumber(ring[0][1])) throw new Error('coordinates must contain numbers');
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error('First and last Position are not equivalent.');
            }
        }
    }

    return feature({
        type: 'Polygon',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
 *
 * @name polygons
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
 * @example
 * var polygons = turf.polygons([
 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
 * ]);
 *
 * //=polygons
 */
function polygons(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');

    return featureCollection(coordinates.map(function (coords) {
        return polygon(coords, properties);
    }), options);
}

/**
 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<LineString>} LineString Feature
 * @example
 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
 *
 * //=linestring1
 * //=linestring2
 */
function lineString(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');
    if (coordinates.length < 2) throw new Error('coordinates must be an array of two or more positions');
    // Check if first point of LineString contains two numbers
    if (!isNumber(coordinates[0][1]) || !isNumber(coordinates[0][1])) throw new Error('coordinates must contain numbers');

    return feature({
        type: 'LineString',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
 *
 * @name lineStrings
 * @param {Array<Array<number>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
 * @example
 * var linestrings = turf.lineStrings([
 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
 * ]);
 *
 * //=linestrings
 */
function lineStrings(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');
    if (!Array.isArray(coordinates)) throw new Error('coordinates must be an Array');

    return featureCollection(coordinates.map(function (coords) {
        return lineString(coords, properties);
    }), options);
}

/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {FeatureCollection} FeatureCollection of Features
 * @example
 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
 *
 * var collection = turf.featureCollection([
 *   locationA,
 *   locationB,
 *   locationC
 * ]);
 *
 * //=collection
 */
function featureCollection(features, options) {
    // Optional Parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var bbox = options.bbox;
    var id = options.id;

    // Validation
    if (!features) throw new Error('No features passed');
    if (!Array.isArray(features)) throw new Error('features must be an Array');
    if (bbox) validateBBox(bbox);
    if (id) validateId(id);

    // Main
    var fc = {type: 'FeatureCollection'};
    if (id) fc.id = id;
    if (bbox) fc.bbox = bbox;
    fc.features = features;
    return fc;
}

/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
function multiLineString(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');

    return feature({
        type: 'MultiLineString',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
function multiPoint(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');

    return feature({
        type: 'MultiPoint',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
function multiPolygon(coordinates, properties, options) {
    if (!coordinates) throw new Error('coordinates is required');

    return feature({
        type: 'MultiPolygon',
        coordinates: coordinates
    }, properties, options);
}

/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = {
 *     "type": "Point",
 *       "coordinates": [100, 0]
 *     };
 * var line = {
 *     "type": "LineString",
 *     "coordinates": [ [101, 0], [102, 1] ]
 *   };
 * var collection = turf.geometryCollection([pt, line]);
 *
 * //=collection
 */
function geometryCollection(geometries, properties, options) {
    if (!geometries) throw new Error('geometries is required');
    if (!Array.isArray(geometries)) throw new Error('geometries must be an Array');

    return feature({
        type: 'GeometryCollection',
        geometries: geometries
    }, properties, options);
}

/**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */
function round(num, precision) {
    if (num === undefined || num === null || isNaN(num)) throw new Error('num is required');
    if (precision && !(precision >= 0)) throw new Error('precision must be a positive number');
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(num * multiplier) / multiplier;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToLength
 * @param {number} radians in radians across the sphere
 * @param {string} [units='kilometers'] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} distance
 */
function radiansToLength(radians, units) {
    if (radians === undefined || radians === null) throw new Error('radians is required');

    if (units && typeof units !== 'string') throw new Error('units must be a string');
    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error(units + ' units is invalid');
    return radians * factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name lengthToRadians
 * @param {number} distance in real units
 * @param {string} [units='kilometers'] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} radians
 */
function lengthToRadians(distance, units) {
    if (distance === undefined || distance === null) throw new Error('distance is required');

    if (units && typeof units !== 'string') throw new Error('units must be a string');
    var factor = factors[units || 'kilometers'];
    if (!factor) throw new Error(units + ' units is invalid');
    return distance / factor;
}

/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name lengthToDegrees
 * @param {number} distance in real units
 * @param {string} [units='kilometers'] can be degrees, radians, miles, or kilometers inches, yards, metres, meters, kilometres, kilometers.
 * @returns {number} degrees
 */
function lengthToDegrees(distance, units) {
    return radiansToDegrees(lengthToRadians(distance, units));
}

/**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAzimuth
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */
function bearingToAzimuth(bearing) {
    if (bearing === null || bearing === undefined) throw new Error('bearing is required');

    var angle = bearing % 360;
    if (angle < 0) angle += 360;
    return angle;
}

/**
 * Converts an angle in radians to degrees
 *
 * @name radiansToDegrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
function radiansToDegrees(radians) {
    if (radians === null || radians === undefined) throw new Error('radians is required');

    var degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
}

/**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
function degreesToRadians(degrees) {
    if (degrees === null || degrees === undefined) throw new Error('degrees is required');

    var radians = degrees % 360;
    return radians * Math.PI / 180;
}

/**
 * Converts a length to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} length to be converted
 * @param {string} originalUnit of the length
 * @param {string} [finalUnit='kilometers'] returned unit
 * @returns {number} the converted length
 */
function convertLength(length, originalUnit, finalUnit) {
    if (length === null || length === undefined) throw new Error('length is required');
    if (!(length >= 0)) throw new Error('length must be a positive number');

    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit || 'kilometers');
}

/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches
 * @param {number} area to be converted
 * @param {string} [originalUnit='meters'] of the distance
 * @param {string} [finalUnit='kilometers'] returned unit
 * @returns {number} the converted distance
 */
function convertArea(area, originalUnit, finalUnit) {
    if (area === null || area === undefined) throw new Error('area is required');
    if (!(area >= 0)) throw new Error('area must be a positive number');

    var startFactor = areaFactors[originalUnit || 'meters'];
    if (!startFactor) throw new Error('invalid original units');

    var finalFactor = areaFactors[finalUnit || 'kilometers'];
    if (!finalFactor) throw new Error('invalid final units');

    return (area / startFactor) * finalFactor;
}

/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num);
}

/**
 * isObject
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false
 * @example
 * turf.isObject({elevation: 10})
 * //=true
 * turf.isObject('foo')
 * //=false
 */
function isObject(input) {
    return (!!input) && (input.constructor === Object);
}

/**
 * Validate BBox
 *
 * @private
 * @param {Array<number>} bbox BBox to validate
 * @returns {void}
 * @throws Error if BBox is not valid
 * @example
 * validateBBox([-180, -40, 110, 50])
 * //=OK
 * validateBBox([-180, -40])
 * //=Error
 * validateBBox('Foo')
 * //=Error
 * validateBBox(5)
 * //=Error
 * validateBBox(null)
 * //=Error
 * validateBBox(undefined)
 * //=Error
 */
function validateBBox(bbox) {
    if (!bbox) throw new Error('bbox is required');
    if (!Array.isArray(bbox)) throw new Error('bbox must be an Array');
    if (bbox.length !== 4 && bbox.length !== 6) throw new Error('bbox must be an Array of 4 or 6 numbers');
    bbox.forEach(function (num) {
        if (!isNumber(num)) throw new Error('bbox must only contain numbers');
    });
}

/**
 * Validate Id
 *
 * @private
 * @param {string|number} id Id to validate
 * @returns {void}
 * @throws Error if Id is not valid
 * @example
 * validateId([-180, -40, 110, 50])
 * //=Error
 * validateId([-180, -40])
 * //=Error
 * validateId('Foo')
 * //=OK
 * validateId(5)
 * //=OK
 * validateId(null)
 * //=Error
 * validateId(undefined)
 * //=Error
 */
function validateId(id) {
    if (!id) throw new Error('id is required');
    if (['string', 'number'].indexOf(typeof id) === -1) throw new Error('id must be a number or a string');
}

// Deprecated methods
function radians2degrees() {
    throw new Error('method has been renamed to `radiansToDegrees`');
}

function degrees2radians() {
    throw new Error('method has been renamed to `degreesToRadians`');
}

function distanceToDegrees() {
    throw new Error('method has been renamed to `lengthToDegrees`');
}

function distanceToRadians() {
    throw new Error('method has been renamed to `lengthToRadians`');
}

function radiansToDistance() {
    throw new Error('method has been renamed to `radiansToLength`');
}

function bearingToAngle() {
    throw new Error('method has been renamed to `bearingToAzimuth`');
}

function convertDistance() {
    throw new Error('method has been renamed to `convertLength`');
}

exports.earthRadius = earthRadius;
exports.factors = factors;
exports.unitsFactors = unitsFactors;
exports.areaFactors = areaFactors;
exports.feature = feature;
exports.geometry = geometry;
exports.point = point;
exports.points = points;
exports.polygon = polygon;
exports.polygons = polygons;
exports.lineString = lineString;
exports.lineStrings = lineStrings;
exports.featureCollection = featureCollection;
exports.multiLineString = multiLineString;
exports.multiPoint = multiPoint;
exports.multiPolygon = multiPolygon;
exports.geometryCollection = geometryCollection;
exports.round = round;
exports.radiansToLength = radiansToLength;
exports.lengthToRadians = lengthToRadians;
exports.lengthToDegrees = lengthToDegrees;
exports.bearingToAzimuth = bearingToAzimuth;
exports.radiansToDegrees = radiansToDegrees;
exports.degreesToRadians = degreesToRadians;
exports.convertLength = convertLength;
exports.convertArea = convertArea;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.validateBBox = validateBBox;
exports.validateId = validateId;
exports.radians2degrees = radians2degrees;
exports.degrees2radians = degrees2radians;
exports.distanceToDegrees = distanceToDegrees;
exports.distanceToRadians = distanceToRadians;
exports.radiansToDistance = radiansToDistance;
exports.bearingToAngle = bearingToAngle;
exports.convertDistance = convertDistance;

},{}],9:[function(require,module,exports){
'use strict';

module.exports = Delaunator;
module.exports.default = Delaunator;

function Delaunator(points, getX, getY) {

    if (!getX) getX = defaultGetX;
    if (!getY) getY = defaultGetY;

    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;

    var coords = this.coords = [];
    var ids = this.ids = new Uint32Array(points.length);

    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var x = getX(p);
        var y = getY(p);
        ids[i] = i;
        coords[2 * i] = x;
        coords[2 * i + 1] = y;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }

    var cx = (minX + maxX) / 2;
    var cy = (minY + maxY) / 2;

    var minDist = Infinity;
    var i0, i1, i2;

    // pick a seed point close to the centroid
    for (i = 0; i < points.length; i++) {
        var d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
        if (d < minDist) {
            i0 = i;
            minDist = d;
        }
    }

    minDist = Infinity;

    // find the point closest to the seed
    for (i = 0; i < points.length; i++) {
        if (i === i0) continue;
        d = dist(coords[2 * i0], coords[2 * i0 + 1], coords[2 * i], coords[2 * i + 1]);
        if (d < minDist && d > 0) {
            i1 = i;
            minDist = d;
        }
    }

    var minRadius = Infinity;

    // find the third point which forms the smallest circumcircle with the first two
    for (i = 0; i < points.length; i++) {
        if (i === i0 || i === i1) continue;

        var r = circumradius(
            coords[2 * i0], coords[2 * i0 + 1],
            coords[2 * i1], coords[2 * i1 + 1],
            coords[2 * i], coords[2 * i + 1]);

        if (r < minRadius) {
            i2 = i;
            minRadius = r;
        }
    }

    if (minRadius === Infinity) {
        throw new Error('No Delaunay triangulation exists for this input.');
    }

    // swap the order of the seed points for counter-clockwise orientation
    if (area(coords[2 * i0], coords[2 * i0 + 1],
        coords[2 * i1], coords[2 * i1 + 1],
        coords[2 * i2], coords[2 * i2 + 1]) < 0) {

        var tmp = i1;
        i1 = i2;
        i2 = tmp;
    }

    var i0x = coords[2 * i0];
    var i0y = coords[2 * i0 + 1];
    var i1x = coords[2 * i1];
    var i1y = coords[2 * i1 + 1];
    var i2x = coords[2 * i2];
    var i2y = coords[2 * i2 + 1];

    var center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
    this._cx = center.x;
    this._cy = center.y;

    // sort the points by distance from the seed triangle circumcenter
    quicksort(ids, coords, 0, ids.length - 1, center.x, center.y);

    // initialize a hash table for storing edges of the advancing convex hull
    this._hashSize = Math.ceil(Math.sqrt(points.length));
    this._hash = [];
    for (i = 0; i < this._hashSize; i++) this._hash[i] = null;

    // initialize a circular doubly-linked list that will hold an advancing convex hull
    var e = this.hull = insertNode(coords, i0);
    this._hashEdge(e);
    e.t = 0;
    e = insertNode(coords, i1, e);
    this._hashEdge(e);
    e.t = 1;
    e = insertNode(coords, i2, e);
    this._hashEdge(e);
    e.t = 2;

    var maxTriangles = 2 * points.length - 5;
    var triangles = this.triangles = new Uint32Array(maxTriangles * 3);
    var halfedges = this.halfedges = new Int32Array(maxTriangles * 3);

    this.trianglesLen = 0;

    this._addTriangle(i0, i1, i2, -1, -1, -1);

    var xp, yp;
    for (var k = 0; k < ids.length; k++) {
        i = ids[k];
        x = coords[2 * i];
        y = coords[2 * i + 1];

        // skip duplicate points
        if (x === xp && y === yp) continue;
        xp = x;
        yp = y;

        // skip seed triangle points
        if ((x === i0x && y === i0y) ||
            (x === i1x && y === i1y) ||
            (x === i2x && y === i2y)) continue;

        // find a visible edge on the convex hull using edge hash
        var startKey = this._hashKey(x, y);
        var key = startKey;
        var start;
        do {
            start = this._hash[key];
            key = (key + 1) % this._hashSize;
        } while ((!start || start.removed) && key !== startKey);

        e = start;
        while (area(x, y, e.x, e.y, e.next.x, e.next.y) >= 0) {
            e = e.next;
            if (e === start) {
                throw new Error('Something is wrong with the input points.');
            }
        }

        var walkBack = e === start;

        // add the first triangle from the point
        var t = this._addTriangle(e.i, i, e.next.i, -1, -1, e.t);

        e.t = t; // keep track of boundary triangles on the hull
        e = insertNode(coords, i, e);

        // recursively flip triangles from the point until they satisfy the Delaunay condition
        e.t = this._legalize(t + 2);
        if (e.prev.prev.t === halfedges[t + 1]) {
            e.prev.prev.t = t + 2;
        }

        // walk forward through the hull, adding more triangles and flipping recursively
        var q = e.next;
        while (area(x, y, q.x, q.y, q.next.x, q.next.y) < 0) {
            t = this._addTriangle(q.i, i, q.next.i, q.prev.t, -1, q.t);
            q.prev.t = this._legalize(t + 2);
            this.hull = removeNode(q);
            q = q.next;
        }

        if (walkBack) {
            // walk backward from the other side, adding more triangles and flipping
            q = e.prev;
            while (area(x, y, q.prev.x, q.prev.y, q.x, q.y) < 0) {
                t = this._addTriangle(q.prev.i, i, q.i, -1, q.t, q.prev.t);
                this._legalize(t + 2);
                q.prev.t = t;
                this.hull = removeNode(q);
                q = q.prev;
            }
        }

        // save the two new edges in the hash table
        this._hashEdge(e);
        this._hashEdge(e.prev);
    }

    // trim typed triangle mesh arrays
    this.triangles = triangles.subarray(0, this.trianglesLen);
    this.halfedges = halfedges.subarray(0, this.trianglesLen);
}

Delaunator.prototype = {

    _hashEdge: function (e) {
        this._hash[this._hashKey(e.x, e.y)] = e;
    },

    _hashKey: function (x, y) {
        var dx = x - this._cx;
        var dy = y - this._cy;
        // use pseudo-angle: a measure that monotonically increases
        // with real angle, but doesn't require expensive trigonometry
        var p = 1 - dx / (Math.abs(dx) + Math.abs(dy));
        return Math.floor((2 + (dy < 0 ? -p : p)) / 4 * this._hashSize);
    },

    _legalize: function (a) {
        var triangles = this.triangles;
        var coords = this.coords;
        var halfedges = this.halfedges;

        var b = halfedges[a];

        var a0 = a - a % 3;
        var b0 = b - b % 3;

        var al = a0 + (a + 1) % 3;
        var ar = a0 + (a + 2) % 3;
        var bl = b0 + (b + 2) % 3;

        var p0 = triangles[ar];
        var pr = triangles[a];
        var pl = triangles[al];
        var p1 = triangles[bl];

        var illegal = inCircle(
            coords[2 * p0], coords[2 * p0 + 1],
            coords[2 * pr], coords[2 * pr + 1],
            coords[2 * pl], coords[2 * pl + 1],
            coords[2 * p1], coords[2 * p1 + 1]);

        if (illegal) {
            triangles[a] = p1;
            triangles[b] = p0;

            this._link(a, halfedges[bl]);
            this._link(b, halfedges[ar]);
            this._link(ar, bl);

            var br = b0 + (b + 1) % 3;

            this._legalize(a);
            return this._legalize(br);
        }

        return ar;
    },

    _link: function (a, b) {
        this.halfedges[a] = b;
        if (b !== -1) this.halfedges[b] = a;
    },

    // add a new triangle given vertex indices and adjacent half-edge ids
    _addTriangle: function (i0, i1, i2, a, b, c) {
        var t = this.trianglesLen;

        this.triangles[t] = i0;
        this.triangles[t + 1] = i1;
        this.triangles[t + 2] = i2;

        this._link(t, a);
        this._link(t + 1, b);
        this._link(t + 2, c);

        this.trianglesLen += 3;

        return t;
    }
};

function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return dx * dx + dy * dy;
}

function area(px, py, qx, qy, rx, ry) {
    return (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
}

function inCircle(ax, ay, bx, by, cx, cy, px, py) {
    ax -= px;
    ay -= py;
    bx -= px;
    by -= py;
    cx -= px;
    cy -= py;

    var ap = ax * ax + ay * ay;
    var bp = bx * bx + by * by;
    var cp = cx * cx + cy * cy;

    return ax * (by * cp - bp * cy) -
           ay * (bx * cp - bp * cx) +
           ap * (bx * cy - by * cx) < 0;
}

function circumradius(ax, ay, bx, by, cx, cy) {
    bx -= ax;
    by -= ay;
    cx -= ax;
    cy -= ay;

    var bl = bx * bx + by * by;
    var cl = cx * cx + cy * cy;

    if (bl === 0 || cl === 0) return Infinity;

    var d = bx * cy - by * cx;
    if (d === 0) return Infinity;

    var x = (cy * bl - by * cl) * 0.5 / d;
    var y = (bx * cl - cx * bl) * 0.5 / d;

    return x * x + y * y;
}

function circumcenter(ax, ay, bx, by, cx, cy) {
    bx -= ax;
    by -= ay;
    cx -= ax;
    cy -= ay;

    var bl = bx * bx + by * by;
    var cl = cx * cx + cy * cy;

    var d = bx * cy - by * cx;

    var x = (cy * bl - by * cl) * 0.5 / d;
    var y = (bx * cl - cx * bl) * 0.5 / d;

    return {
        x: ax + x,
        y: ay + y
    };
}

// create a new node in a doubly linked list
function insertNode(coords, i, prev) {
    var node = {
        i: i,
        x: coords[2 * i],
        y: coords[2 * i + 1],
        t: 0,
        prev: null,
        next: null,
        removed: false
    };

    if (!prev) {
        node.prev = node;
        node.next = node;

    } else {
        node.next = prev.next;
        node.prev = prev;
        prev.next.prev = node;
        prev.next = node;
    }
    return node;
}

function removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.removed = true;
    return node.prev;
}

function quicksort(ids, coords, left, right, cx, cy) {
    var i, j, temp;

    if (right - left <= 20) {
        for (i = left + 1; i <= right; i++) {
            temp = ids[i];
            j = i - 1;
            while (j >= left && compare(coords, ids[j], temp, cx, cy) > 0) ids[j + 1] = ids[j--];
            ids[j + 1] = temp;
        }
    } else {
        var median = (left + right) >> 1;
        i = left + 1;
        j = right;
        swap(ids, median, i);
        if (compare(coords, ids[left], ids[right], cx, cy) > 0) swap(ids, left, right);
        if (compare(coords, ids[i], ids[right], cx, cy) > 0) swap(ids, i, right);
        if (compare(coords, ids[left], ids[i], cx, cy) > 0) swap(ids, left, i);

        temp = ids[i];
        while (true) {
            do i++; while (compare(coords, ids[i], temp, cx, cy) < 0);
            do j--; while (compare(coords, ids[j], temp, cx, cy) > 0);
            if (j < i) break;
            swap(ids, i, j);
        }
        ids[left + 1] = ids[j];
        ids[j] = temp;

        if (right - i + 1 >= j - left) {
            quicksort(ids, coords, i, right, cx, cy);
            quicksort(ids, coords, left, j - 1, cx, cy);
        } else {
            quicksort(ids, coords, left, j - 1, cx, cy);
            quicksort(ids, coords, i, right, cx, cy);
        }
    }
}

function compare(coords, i, j, cx, cy) {
    var d1 = dist(coords[2 * i], coords[2 * i + 1], cx, cy);
    var d2 = dist(coords[2 * j], coords[2 * j + 1], cx, cy);
    return (d1 - d2) || (coords[2 * i] - coords[2 * j]) || (coords[2 * i + 1] - coords[2 * j + 1]);
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function defaultGetX(p) {
    return p[0];
}
function defaultGetY(p) {
    return p[1];
}

},{}],10:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.proj4 = factory());
}(this, (function () { 'use strict';

	var globals = function(defs) {
	  defs('EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
	  defs('EPSG:4269', "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees");
	  defs('EPSG:3857', "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");

	  defs.WGS84 = defs['EPSG:4326'];
	  defs['EPSG:3785'] = defs['EPSG:3857']; // maintain backward compat, official code is 3857
	  defs.GOOGLE = defs['EPSG:3857'];
	  defs['EPSG:900913'] = defs['EPSG:3857'];
	  defs['EPSG:102113'] = defs['EPSG:3857'];
	};

	var PJD_3PARAM = 1;
	var PJD_7PARAM = 2;
	var PJD_WGS84 = 4; // WGS84 or equivalent
	var PJD_NODATUM = 5; // WGS84 or equivalent
	var SEC_TO_RAD = 4.84813681109535993589914102357e-6;
	var HALF_PI = Math.PI/2;
	// ellipoid pj_set_ell.c
	var SIXTH = 0.1666666666666666667;
	/* 1/6 */
	var RA4 = 0.04722222222222222222;
	/* 17/360 */
	var RA6 = 0.02215608465608465608;
	var EPSLN = 1.0e-10;
	// you'd think you could use Number.EPSILON above but that makes
	// Mollweide get into an infinate loop.

	var D2R = 0.01745329251994329577;
	var R2D = 57.29577951308232088;
	var FORTPI = Math.PI/4;
	var TWO_PI = Math.PI * 2;
	// SPI is slightly greater than Math.PI, so values that exceed the -180..180
	// degree range by a tiny amount don't get wrapped. This prevents points that
	// have drifted from their original location along the 180th meridian (due to
	// floating point error) from changing their sign.
	var SPI = 3.14159265359;

	var exports$1 = {};
	exports$1.greenwich = 0.0; //"0dE",
	exports$1.lisbon = -9.131906111111; //"9d07'54.862\"W",
	exports$1.paris = 2.337229166667; //"2d20'14.025\"E",
	exports$1.bogota = -74.080916666667; //"74d04'51.3\"W",
	exports$1.madrid = -3.687938888889; //"3d41'16.58\"W",
	exports$1.rome = 12.452333333333; //"12d27'8.4\"E",
	exports$1.bern = 7.439583333333; //"7d26'22.5\"E",
	exports$1.jakarta = 106.807719444444; //"106d48'27.79\"E",
	exports$1.ferro = -17.666666666667; //"17d40'W",
	exports$1.brussels = 4.367975; //"4d22'4.71\"E",
	exports$1.stockholm = 18.058277777778; //"18d3'29.8\"E",
	exports$1.athens = 23.7163375; //"23d42'58.815\"E",
	exports$1.oslo = 10.722916666667; //"10d43'22.5\"E"

	var units = {
	  ft: {to_meter: 0.3048},
	  'us-ft': {to_meter: 1200 / 3937}
	};

	var ignoredChar = /[\s_\-\/\(\)]/g;
	function match(obj, key) {
	  if (obj[key]) {
	    return obj[key];
	  }
	  var keys = Object.keys(obj);
	  var lkey = key.toLowerCase().replace(ignoredChar, '');
	  var i = -1;
	  var testkey, processedKey;
	  while (++i < keys.length) {
	    testkey = keys[i];
	    processedKey = testkey.toLowerCase().replace(ignoredChar, '');
	    if (processedKey === lkey) {
	      return obj[testkey];
	    }
	  }
	}

	var parseProj = function(defData) {
	  var self = {};
	  var paramObj = defData.split('+').map(function(v) {
	    return v.trim();
	  }).filter(function(a) {
	    return a;
	  }).reduce(function(p, a) {
	    var split = a.split('=');
	    split.push(true);
	    p[split[0].toLowerCase()] = split[1];
	    return p;
	  }, {});
	  var paramName, paramVal, paramOutname;
	  var params = {
	    proj: 'projName',
	    datum: 'datumCode',
	    rf: function(v) {
	      self.rf = parseFloat(v);
	    },
	    lat_0: function(v) {
	      self.lat0 = v * D2R;
	    },
	    lat_1: function(v) {
	      self.lat1 = v * D2R;
	    },
	    lat_2: function(v) {
	      self.lat2 = v * D2R;
	    },
	    lat_ts: function(v) {
	      self.lat_ts = v * D2R;
	    },
	    lon_0: function(v) {
	      self.long0 = v * D2R;
	    },
	    lon_1: function(v) {
	      self.long1 = v * D2R;
	    },
	    lon_2: function(v) {
	      self.long2 = v * D2R;
	    },
	    alpha: function(v) {
	      self.alpha = parseFloat(v) * D2R;
	    },
	    lonc: function(v) {
	      self.longc = v * D2R;
	    },
	    x_0: function(v) {
	      self.x0 = parseFloat(v);
	    },
	    y_0: function(v) {
	      self.y0 = parseFloat(v);
	    },
	    k_0: function(v) {
	      self.k0 = parseFloat(v);
	    },
	    k: function(v) {
	      self.k0 = parseFloat(v);
	    },
	    a: function(v) {
	      self.a = parseFloat(v);
	    },
	    b: function(v) {
	      self.b = parseFloat(v);
	    },
	    r_a: function() {
	      self.R_A = true;
	    },
	    zone: function(v) {
	      self.zone = parseInt(v, 10);
	    },
	    south: function() {
	      self.utmSouth = true;
	    },
	    towgs84: function(v) {
	      self.datum_params = v.split(",").map(function(a) {
	        return parseFloat(a);
	      });
	    },
	    to_meter: function(v) {
	      self.to_meter = parseFloat(v);
	    },
	    units: function(v) {
	      self.units = v;
	      var unit = match(units, v);
	      if (unit) {
	        self.to_meter = unit.to_meter;
	      }
	    },
	    from_greenwich: function(v) {
	      self.from_greenwich = v * D2R;
	    },
	    pm: function(v) {
	      var pm = match(exports$1, v);
	      self.from_greenwich = (pm ? pm : parseFloat(v)) * D2R;
	    },
	    nadgrids: function(v) {
	      if (v === '@null') {
	        self.datumCode = 'none';
	      }
	      else {
	        self.nadgrids = v;
	      }
	    },
	    axis: function(v) {
	      var legalAxis = "ewnsud";
	      if (v.length === 3 && legalAxis.indexOf(v.substr(0, 1)) !== -1 && legalAxis.indexOf(v.substr(1, 1)) !== -1 && legalAxis.indexOf(v.substr(2, 1)) !== -1) {
	        self.axis = v;
	      }
	    }
	  };
	  for (paramName in paramObj) {
	    paramVal = paramObj[paramName];
	    if (paramName in params) {
	      paramOutname = params[paramName];
	      if (typeof paramOutname === 'function') {
	        paramOutname(paramVal);
	      }
	      else {
	        self[paramOutname] = paramVal;
	      }
	    }
	    else {
	      self[paramName] = paramVal;
	    }
	  }
	  if(typeof self.datumCode === 'string' && self.datumCode !== "WGS84"){
	    self.datumCode = self.datumCode.toLowerCase();
	  }
	  return self;
	};

	var NEUTRAL = 1;
	var KEYWORD = 2;
	var NUMBER = 3;
	var QUOTED = 4;
	var AFTERQUOTE = 5;
	var ENDED = -1;
	var whitespace = /\s/;
	var latin = /[A-Za-z]/;
	var keyword = /[A-Za-z84]/;
	var endThings = /[,\]]/;
	var digets = /[\d\.E\-\+]/;
	// const ignoredChar = /[\s_\-\/\(\)]/g;
	function Parser(text) {
	  if (typeof text !== 'string') {
	    throw new Error('not a string');
	  }
	  this.text = text.trim();
	  this.level = 0;
	  this.place = 0;
	  this.root = null;
	  this.stack = [];
	  this.currentObject = null;
	  this.state = NEUTRAL;
	}
	Parser.prototype.readCharicter = function() {
	  var char = this.text[this.place++];
	  if (this.state !== QUOTED) {
	    while (whitespace.test(char)) {
	      if (this.place >= this.text.length) {
	        return;
	      }
	      char = this.text[this.place++];
	    }
	  }
	  switch (this.state) {
	    case NEUTRAL:
	      return this.neutral(char);
	    case KEYWORD:
	      return this.keyword(char)
	    case QUOTED:
	      return this.quoted(char);
	    case AFTERQUOTE:
	      return this.afterquote(char);
	    case NUMBER:
	      return this.number(char);
	    case ENDED:
	      return;
	  }
	};
	Parser.prototype.afterquote = function(char) {
	  if (char === '"') {
	    this.word += '"';
	    this.state = QUOTED;
	    return;
	  }
	  if (endThings.test(char)) {
	    this.word = this.word.trim();
	    this.afterItem(char);
	    return;
	  }
	  throw new Error('havn\'t handled "' +char + '" in afterquote yet, index ' + this.place);
	};
	Parser.prototype.afterItem = function(char) {
	  if (char === ',') {
	    if (this.word !== null) {
	      this.currentObject.push(this.word);
	    }
	    this.word = null;
	    this.state = NEUTRAL;
	    return;
	  }
	  if (char === ']') {
	    this.level--;
	    if (this.word !== null) {
	      this.currentObject.push(this.word);
	      this.word = null;
	    }
	    this.state = NEUTRAL;
	    this.currentObject = this.stack.pop();
	    if (!this.currentObject) {
	      this.state = ENDED;
	    }

	    return;
	  }
	};
	Parser.prototype.number = function(char) {
	  if (digets.test(char)) {
	    this.word += char;
	    return;
	  }
	  if (endThings.test(char)) {
	    this.word = parseFloat(this.word);
	    this.afterItem(char);
	    return;
	  }
	  throw new Error('havn\'t handled "' +char + '" in number yet, index ' + this.place);
	};
	Parser.prototype.quoted = function(char) {
	  if (char === '"') {
	    this.state = AFTERQUOTE;
	    return;
	  }
	  this.word += char;
	  return;
	};
	Parser.prototype.keyword = function(char) {
	  if (keyword.test(char)) {
	    this.word += char;
	    return;
	  }
	  if (char === '[') {
	    var newObjects = [];
	    newObjects.push(this.word);
	    this.level++;
	    if (this.root === null) {
	      this.root = newObjects;
	    } else {
	      this.currentObject.push(newObjects);
	    }
	    this.stack.push(this.currentObject);
	    this.currentObject = newObjects;
	    this.state = NEUTRAL;
	    return;
	  }
	  if (endThings.test(char)) {
	    this.afterItem(char);
	    return;
	  }
	  throw new Error('havn\'t handled "' +char + '" in keyword yet, index ' + this.place);
	};
	Parser.prototype.neutral = function(char) {
	  if (latin.test(char)) {
	    this.word = char;
	    this.state = KEYWORD;
	    return;
	  }
	  if (char === '"') {
	    this.word = '';
	    this.state = QUOTED;
	    return;
	  }
	  if (digets.test(char)) {
	    this.word = char;
	    this.state = NUMBER;
	    return;
	  }
	  if (endThings.test(char)) {
	    this.afterItem(char);
	    return;
	  }
	  throw new Error('havn\'t handled "' +char + '" in neutral yet, index ' + this.place);
	};
	Parser.prototype.output = function() {
	  while (this.place < this.text.length) {
	    this.readCharicter();
	  }
	  if (this.state === ENDED) {
	    return this.root;
	  }
	  throw new Error('unable to parse string "' +this.text + '". State is ' + this.state);
	};

	function parseString(txt) {
	  var parser = new Parser(txt);
	  return parser.output();
	}

	function mapit(obj, key, value) {
	  if (Array.isArray(key)) {
	    value.unshift(key);
	    key = null;
	  }
	  var thing = key ? {} : obj;

	  var out = value.reduce(function(newObj, item) {
	    sExpr(item, newObj);
	    return newObj
	  }, thing);
	  if (key) {
	    obj[key] = out;
	  }
	}

	function sExpr(v, obj) {
	  if (!Array.isArray(v)) {
	    obj[v] = true;
	    return;
	  }
	  var key = v.shift();
	  if (key === 'PARAMETER') {
	    key = v.shift();
	  }
	  if (v.length === 1) {
	    if (Array.isArray(v[0])) {
	      obj[key] = {};
	      sExpr(v[0], obj[key]);
	      return;
	    }
	    obj[key] = v[0];
	    return;
	  }
	  if (!v.length) {
	    obj[key] = true;
	    return;
	  }
	  if (key === 'TOWGS84') {
	    obj[key] = v;
	    return;
	  }
	  if (!Array.isArray(key)) {
	    obj[key] = {};
	  }

	  var i;
	  switch (key) {
	    case 'UNIT':
	    case 'PRIMEM':
	    case 'VERT_DATUM':
	      obj[key] = {
	        name: v[0].toLowerCase(),
	        convert: v[1]
	      };
	      if (v.length === 3) {
	        sExpr(v[2], obj[key]);
	      }
	      return;
	    case 'SPHEROID':
	    case 'ELLIPSOID':
	      obj[key] = {
	        name: v[0],
	        a: v[1],
	        rf: v[2]
	      };
	      if (v.length === 4) {
	        sExpr(v[3], obj[key]);
	      }
	      return;
	    case 'PROJECTEDCRS':
	    case 'PROJCRS':
	    case 'GEOGCS':
	    case 'GEOCCS':
	    case 'PROJCS':
	    case 'LOCAL_CS':
	    case 'GEODCRS':
	    case 'GEODETICCRS':
	    case 'GEODETICDATUM':
	    case 'EDATUM':
	    case 'ENGINEERINGDATUM':
	    case 'VERT_CS':
	    case 'VERTCRS':
	    case 'VERTICALCRS':
	    case 'COMPD_CS':
	    case 'COMPOUNDCRS':
	    case 'ENGINEERINGCRS':
	    case 'ENGCRS':
	    case 'FITTED_CS':
	    case 'LOCAL_DATUM':
	    case 'DATUM':
	      v[0] = ['name', v[0]];
	      mapit(obj, key, v);
	      return;
	    default:
	      i = -1;
	      while (++i < v.length) {
	        if (!Array.isArray(v[i])) {
	          return sExpr(v, obj[key]);
	        }
	      }
	      return mapit(obj, key, v);
	  }
	}

	var D2R$1 = 0.01745329251994329577;
	function rename(obj, params) {
	  var outName = params[0];
	  var inName = params[1];
	  if (!(outName in obj) && (inName in obj)) {
	    obj[outName] = obj[inName];
	    if (params.length === 3) {
	      obj[outName] = params[2](obj[outName]);
	    }
	  }
	}

	function d2r(input) {
	  return input * D2R$1;
	}

	function cleanWKT(wkt) {
	  if (wkt.type === 'GEOGCS') {
	    wkt.projName = 'longlat';
	  } else if (wkt.type === 'LOCAL_CS') {
	    wkt.projName = 'identity';
	    wkt.local = true;
	  } else {
	    if (typeof wkt.PROJECTION === 'object') {
	      wkt.projName = Object.keys(wkt.PROJECTION)[0];
	    } else {
	      wkt.projName = wkt.PROJECTION;
	    }
	  }
	  if (wkt.UNIT) {
	    wkt.units = wkt.UNIT.name.toLowerCase();
	    if (wkt.units === 'metre') {
	      wkt.units = 'meter';
	    }
	    if (wkt.UNIT.convert) {
	      if (wkt.type === 'GEOGCS') {
	        if (wkt.DATUM && wkt.DATUM.SPHEROID) {
	          wkt.to_meter = wkt.UNIT.convert*wkt.DATUM.SPHEROID.a;
	        }
	      } else {
	        wkt.to_meter = wkt.UNIT.convert, 10;
	      }
	    }
	  }
	  var geogcs = wkt.GEOGCS;
	  if (wkt.type === 'GEOGCS') {
	    geogcs = wkt;
	  }
	  if (geogcs) {
	    //if(wkt.GEOGCS.PRIMEM&&wkt.GEOGCS.PRIMEM.convert){
	    //  wkt.from_greenwich=wkt.GEOGCS.PRIMEM.convert*D2R;
	    //}
	    if (geogcs.DATUM) {
	      wkt.datumCode = geogcs.DATUM.name.toLowerCase();
	    } else {
	      wkt.datumCode = geogcs.name.toLowerCase();
	    }
	    if (wkt.datumCode.slice(0, 2) === 'd_') {
	      wkt.datumCode = wkt.datumCode.slice(2);
	    }
	    if (wkt.datumCode === 'new_zealand_geodetic_datum_1949' || wkt.datumCode === 'new_zealand_1949') {
	      wkt.datumCode = 'nzgd49';
	    }
	    if (wkt.datumCode === 'wgs_1984') {
	      if (wkt.PROJECTION === 'Mercator_Auxiliary_Sphere') {
	        wkt.sphere = true;
	      }
	      wkt.datumCode = 'wgs84';
	    }
	    if (wkt.datumCode.slice(-6) === '_ferro') {
	      wkt.datumCode = wkt.datumCode.slice(0, - 6);
	    }
	    if (wkt.datumCode.slice(-8) === '_jakarta') {
	      wkt.datumCode = wkt.datumCode.slice(0, - 8);
	    }
	    if (~wkt.datumCode.indexOf('belge')) {
	      wkt.datumCode = 'rnb72';
	    }
	    if (geogcs.DATUM && geogcs.DATUM.SPHEROID) {
	      wkt.ellps = geogcs.DATUM.SPHEROID.name.replace('_19', '').replace(/[Cc]larke\_18/, 'clrk');
	      if (wkt.ellps.toLowerCase().slice(0, 13) === 'international') {
	        wkt.ellps = 'intl';
	      }

	      wkt.a = geogcs.DATUM.SPHEROID.a;
	      wkt.rf = parseFloat(geogcs.DATUM.SPHEROID.rf, 10);
	    }
	    if (~wkt.datumCode.indexOf('osgb_1936')) {
	      wkt.datumCode = 'osgb36';
	    }
	    if (~wkt.datumCode.indexOf('osni_1952')) {
	      wkt.datumCode = 'osni52';
	    }
	    if (~wkt.datumCode.indexOf('tm65')
	      || ~wkt.datumCode.indexOf('geodetic_datum_of_1965')) {
	      wkt.datumCode = 'ire65';
	    }
	  }
	  if (wkt.b && !isFinite(wkt.b)) {
	    wkt.b = wkt.a;
	  }

	  function toMeter(input) {
	    var ratio = wkt.to_meter || 1;
	    return input * ratio;
	  }
	  var renamer = function(a) {
	    return rename(wkt, a);
	  };
	  var list = [
	    ['standard_parallel_1', 'Standard_Parallel_1'],
	    ['standard_parallel_2', 'Standard_Parallel_2'],
	    ['false_easting', 'False_Easting'],
	    ['false_northing', 'False_Northing'],
	    ['central_meridian', 'Central_Meridian'],
	    ['latitude_of_origin', 'Latitude_Of_Origin'],
	    ['latitude_of_origin', 'Central_Parallel'],
	    ['scale_factor', 'Scale_Factor'],
	    ['k0', 'scale_factor'],
	    ['latitude_of_center', 'Latitude_of_center'],
	    ['lat0', 'latitude_of_center', d2r],
	    ['longitude_of_center', 'Longitude_Of_Center'],
	    ['longc', 'longitude_of_center', d2r],
	    ['x0', 'false_easting', toMeter],
	    ['y0', 'false_northing', toMeter],
	    ['long0', 'central_meridian', d2r],
	    ['lat0', 'latitude_of_origin', d2r],
	    ['lat0', 'standard_parallel_1', d2r],
	    ['lat1', 'standard_parallel_1', d2r],
	    ['lat2', 'standard_parallel_2', d2r],
	    ['alpha', 'azimuth', d2r],
	    ['srsCode', 'name']
	  ];
	  list.forEach(renamer);
	  if (!wkt.long0 && wkt.longc && (wkt.projName === 'Albers_Conic_Equal_Area' || wkt.projName === 'Lambert_Azimuthal_Equal_Area')) {
	    wkt.long0 = wkt.longc;
	  }
	  if (!wkt.lat_ts && wkt.lat1 && (wkt.projName === 'Stereographic_South_Pole' || wkt.projName === 'Polar Stereographic (variant B)')) {
	    wkt.lat0 = d2r(wkt.lat1 > 0 ? 90 : -90);
	    wkt.lat_ts = wkt.lat1;
	  }
	}
	var wkt = function(wkt) {
	  var lisp = parseString(wkt);
	  var type = lisp.shift();
	  var name = lisp.shift();
	  lisp.unshift(['name', name]);
	  lisp.unshift(['type', type]);
	  var obj = {};
	  sExpr(lisp, obj);
	  cleanWKT(obj);
	  return obj;
	};

	function defs(name) {
	  /*global console*/
	  var that = this;
	  if (arguments.length === 2) {
	    var def = arguments[1];
	    if (typeof def === 'string') {
	      if (def.charAt(0) === '+') {
	        defs[name] = parseProj(arguments[1]);
	      }
	      else {
	        defs[name] = wkt(arguments[1]);
	      }
	    } else {
	      defs[name] = def;
	    }
	  }
	  else if (arguments.length === 1) {
	    if (Array.isArray(name)) {
	      return name.map(function(v) {
	        if (Array.isArray(v)) {
	          defs.apply(that, v);
	        }
	        else {
	          defs(v);
	        }
	      });
	    }
	    else if (typeof name === 'string') {
	      if (name in defs) {
	        return defs[name];
	      }
	    }
	    else if ('EPSG' in name) {
	      defs['EPSG:' + name.EPSG] = name;
	    }
	    else if ('ESRI' in name) {
	      defs['ESRI:' + name.ESRI] = name;
	    }
	    else if ('IAU2000' in name) {
	      defs['IAU2000:' + name.IAU2000] = name;
	    }
	    else {
	      console.log(name);
	    }
	    return;
	  }


	}
	globals(defs);

	function testObj(code){
	  return typeof code === 'string';
	}
	function testDef(code){
	  return code in defs;
	}
	 var codeWords = ['PROJECTEDCRS', 'PROJCRS', 'GEOGCS','GEOCCS','PROJCS','LOCAL_CS', 'GEODCRS', 'GEODETICCRS', 'GEODETICDATUM', 'ENGCRS', 'ENGINEERINGCRS']; 
	function testWKT(code){
	  return codeWords.some(function (word) {
	    return code.indexOf(word) > -1;
	  });
	}
	function testProj(code){
	  return code[0] === '+';
	}
	function parse(code){
	  if (testObj(code)) {
	    //check to see if this is a WKT string
	    if (testDef(code)) {
	      return defs[code];
	    }
	    if (testWKT(code)) {
	      return wkt(code);
	    }
	    if (testProj(code)) {
	      return parseProj(code);
	    }
	  }else{
	    return code;
	  }
	}

	var extend = function(destination, source) {
	  destination = destination || {};
	  var value, property;
	  if (!source) {
	    return destination;
	  }
	  for (property in source) {
	    value = source[property];
	    if (value !== undefined) {
	      destination[property] = value;
	    }
	  }
	  return destination;
	};

	var msfnz = function(eccent, sinphi, cosphi) {
	  var con = eccent * sinphi;
	  return cosphi / (Math.sqrt(1 - con * con));
	};

	var sign = function(x) {
	  return x<0 ? -1 : 1;
	};

	var adjust_lon = function(x) {
	  return (Math.abs(x) <= SPI) ? x : (x - (sign(x) * TWO_PI));
	};

	var tsfnz = function(eccent, phi, sinphi) {
	  var con = eccent * sinphi;
	  var com = 0.5 * eccent;
	  con = Math.pow(((1 - con) / (1 + con)), com);
	  return (Math.tan(0.5 * (HALF_PI - phi)) / con);
	};

	var phi2z = function(eccent, ts) {
	  var eccnth = 0.5 * eccent;
	  var con, dphi;
	  var phi = HALF_PI - 2 * Math.atan(ts);
	  for (var i = 0; i <= 15; i++) {
	    con = eccent * Math.sin(phi);
	    dphi = HALF_PI - 2 * Math.atan(ts * (Math.pow(((1 - con) / (1 + con)), eccnth))) - phi;
	    phi += dphi;
	    if (Math.abs(dphi) <= 0.0000000001) {
	      return phi;
	    }
	  }
	  //console.log("phi2z has NoConvergence");
	  return -9999;
	};

	function init() {
	  var con = this.b / this.a;
	  this.es = 1 - con * con;
	  if(!('x0' in this)){
	    this.x0 = 0;
	  }
	  if(!('y0' in this)){
	    this.y0 = 0;
	  }
	  this.e = Math.sqrt(this.es);
	  if (this.lat_ts) {
	    if (this.sphere) {
	      this.k0 = Math.cos(this.lat_ts);
	    }
	    else {
	      this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
	    }
	  }
	  else {
	    if (!this.k0) {
	      if (this.k) {
	        this.k0 = this.k;
	      }
	      else {
	        this.k0 = 1;
	      }
	    }
	  }
	}

	/* Mercator forward equations--mapping lat,long to x,y
	  --------------------------------------------------*/

	function forward(p) {
	  var lon = p.x;
	  var lat = p.y;
	  // convert to radians
	  if (lat * R2D > 90 && lat * R2D < -90 && lon * R2D > 180 && lon * R2D < -180) {
	    return null;
	  }

	  var x, y;
	  if (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
	    return null;
	  }
	  else {
	    if (this.sphere) {
	      x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
	      y = this.y0 + this.a * this.k0 * Math.log(Math.tan(FORTPI + 0.5 * lat));
	    }
	    else {
	      var sinphi = Math.sin(lat);
	      var ts = tsfnz(this.e, lat, sinphi);
	      x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
	      y = this.y0 - this.a * this.k0 * Math.log(ts);
	    }
	    p.x = x;
	    p.y = y;
	    return p;
	  }
	}

	/* Mercator inverse equations--mapping x,y to lat/long
	  --------------------------------------------------*/
	function inverse(p) {

	  var x = p.x - this.x0;
	  var y = p.y - this.y0;
	  var lon, lat;

	  if (this.sphere) {
	    lat = HALF_PI - 2 * Math.atan(Math.exp(-y / (this.a * this.k0)));
	  }
	  else {
	    var ts = Math.exp(-y / (this.a * this.k0));
	    lat = phi2z(this.e, ts);
	    if (lat === -9999) {
	      return null;
	    }
	  }
	  lon = adjust_lon(this.long0 + x / (this.a * this.k0));

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$1 = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "merc"];
	var merc = {
	  init: init,
	  forward: forward,
	  inverse: inverse,
	  names: names$1
	};

	function init$1() {
	  //no-op for longlat
	}

	function identity(pt) {
	  return pt;
	}
	var names$2 = ["longlat", "identity"];
	var longlat = {
	  init: init$1,
	  forward: identity,
	  inverse: identity,
	  names: names$2
	};

	var projs = [merc, longlat];
	var names$$1 = {};
	var projStore = [];

	function add(proj, i) {
	  var len = projStore.length;
	  if (!proj.names) {
	    console.log(i);
	    return true;
	  }
	  projStore[len] = proj;
	  proj.names.forEach(function(n) {
	    names$$1[n.toLowerCase()] = len;
	  });
	  return this;
	}

	function get(name) {
	  if (!name) {
	    return false;
	  }
	  var n = name.toLowerCase();
	  if (typeof names$$1[n] !== 'undefined' && projStore[names$$1[n]]) {
	    return projStore[names$$1[n]];
	  }
	}

	function start() {
	  projs.forEach(add);
	}
	var projections = {
	  start: start,
	  add: add,
	  get: get
	};

	var exports$2 = {};
	exports$2.MERIT = {
	  a: 6378137.0,
	  rf: 298.257,
	  ellipseName: "MERIT 1983"
	};

	exports$2.SGS85 = {
	  a: 6378136.0,
	  rf: 298.257,
	  ellipseName: "Soviet Geodetic System 85"
	};

	exports$2.GRS80 = {
	  a: 6378137.0,
	  rf: 298.257222101,
	  ellipseName: "GRS 1980(IUGG, 1980)"
	};

	exports$2.IAU76 = {
	  a: 6378140.0,
	  rf: 298.257,
	  ellipseName: "IAU 1976"
	};

	exports$2.airy = {
	  a: 6377563.396,
	  b: 6356256.910,
	  ellipseName: "Airy 1830"
	};

	exports$2.APL4 = {
	  a: 6378137,
	  rf: 298.25,
	  ellipseName: "Appl. Physics. 1965"
	};

	exports$2.NWL9D = {
	  a: 6378145.0,
	  rf: 298.25,
	  ellipseName: "Naval Weapons Lab., 1965"
	};

	exports$2.mod_airy = {
	  a: 6377340.189,
	  b: 6356034.446,
	  ellipseName: "Modified Airy"
	};

	exports$2.andrae = {
	  a: 6377104.43,
	  rf: 300.0,
	  ellipseName: "Andrae 1876 (Den., Iclnd.)"
	};

	exports$2.aust_SA = {
	  a: 6378160.0,
	  rf: 298.25,
	  ellipseName: "Australian Natl & S. Amer. 1969"
	};

	exports$2.GRS67 = {
	  a: 6378160.0,
	  rf: 298.2471674270,
	  ellipseName: "GRS 67(IUGG 1967)"
	};

	exports$2.bessel = {
	  a: 6377397.155,
	  rf: 299.1528128,
	  ellipseName: "Bessel 1841"
	};

	exports$2.bess_nam = {
	  a: 6377483.865,
	  rf: 299.1528128,
	  ellipseName: "Bessel 1841 (Namibia)"
	};

	exports$2.clrk66 = {
	  a: 6378206.4,
	  b: 6356583.8,
	  ellipseName: "Clarke 1866"
	};

	exports$2.clrk80 = {
	  a: 6378249.145,
	  rf: 293.4663,
	  ellipseName: "Clarke 1880 mod."
	};

	exports$2.clrk58 = {
	  a: 6378293.645208759,
	  rf: 294.2606763692654,
	  ellipseName: "Clarke 1858"
	};

	exports$2.CPM = {
	  a: 6375738.7,
	  rf: 334.29,
	  ellipseName: "Comm. des Poids et Mesures 1799"
	};

	exports$2.delmbr = {
	  a: 6376428.0,
	  rf: 311.5,
	  ellipseName: "Delambre 1810 (Belgium)"
	};

	exports$2.engelis = {
	  a: 6378136.05,
	  rf: 298.2566,
	  ellipseName: "Engelis 1985"
	};

	exports$2.evrst30 = {
	  a: 6377276.345,
	  rf: 300.8017,
	  ellipseName: "Everest 1830"
	};

	exports$2.evrst48 = {
	  a: 6377304.063,
	  rf: 300.8017,
	  ellipseName: "Everest 1948"
	};

	exports$2.evrst56 = {
	  a: 6377301.243,
	  rf: 300.8017,
	  ellipseName: "Everest 1956"
	};

	exports$2.evrst69 = {
	  a: 6377295.664,
	  rf: 300.8017,
	  ellipseName: "Everest 1969"
	};

	exports$2.evrstSS = {
	  a: 6377298.556,
	  rf: 300.8017,
	  ellipseName: "Everest (Sabah & Sarawak)"
	};

	exports$2.fschr60 = {
	  a: 6378166.0,
	  rf: 298.3,
	  ellipseName: "Fischer (Mercury Datum) 1960"
	};

	exports$2.fschr60m = {
	  a: 6378155.0,
	  rf: 298.3,
	  ellipseName: "Fischer 1960"
	};

	exports$2.fschr68 = {
	  a: 6378150.0,
	  rf: 298.3,
	  ellipseName: "Fischer 1968"
	};

	exports$2.helmert = {
	  a: 6378200.0,
	  rf: 298.3,
	  ellipseName: "Helmert 1906"
	};

	exports$2.hough = {
	  a: 6378270.0,
	  rf: 297.0,
	  ellipseName: "Hough"
	};

	exports$2.intl = {
	  a: 6378388.0,
	  rf: 297.0,
	  ellipseName: "International 1909 (Hayford)"
	};

	exports$2.kaula = {
	  a: 6378163.0,
	  rf: 298.24,
	  ellipseName: "Kaula 1961"
	};

	exports$2.lerch = {
	  a: 6378139.0,
	  rf: 298.257,
	  ellipseName: "Lerch 1979"
	};

	exports$2.mprts = {
	  a: 6397300.0,
	  rf: 191.0,
	  ellipseName: "Maupertius 1738"
	};

	exports$2.new_intl = {
	  a: 6378157.5,
	  b: 6356772.2,
	  ellipseName: "New International 1967"
	};

	exports$2.plessis = {
	  a: 6376523.0,
	  rf: 6355863.0,
	  ellipseName: "Plessis 1817 (France)"
	};

	exports$2.krass = {
	  a: 6378245.0,
	  rf: 298.3,
	  ellipseName: "Krassovsky, 1942"
	};

	exports$2.SEasia = {
	  a: 6378155.0,
	  b: 6356773.3205,
	  ellipseName: "Southeast Asia"
	};

	exports$2.walbeck = {
	  a: 6376896.0,
	  b: 6355834.8467,
	  ellipseName: "Walbeck"
	};

	exports$2.WGS60 = {
	  a: 6378165.0,
	  rf: 298.3,
	  ellipseName: "WGS 60"
	};

	exports$2.WGS66 = {
	  a: 6378145.0,
	  rf: 298.25,
	  ellipseName: "WGS 66"
	};

	exports$2.WGS7 = {
	  a: 6378135.0,
	  rf: 298.26,
	  ellipseName: "WGS 72"
	};

	var WGS84 = exports$2.WGS84 = {
	  a: 6378137.0,
	  rf: 298.257223563,
	  ellipseName: "WGS 84"
	};

	exports$2.sphere = {
	  a: 6370997.0,
	  b: 6370997.0,
	  ellipseName: "Normal Sphere (r=6370997)"
	};

	function eccentricity(a, b, rf, R_A) {
	  var a2 = a * a; // used in geocentric
	  var b2 = b * b; // used in geocentric
	  var es = (a2 - b2) / a2; // e ^ 2
	  var e = 0;
	  if (R_A) {
	    a *= 1 - es * (SIXTH + es * (RA4 + es * RA6));
	    a2 = a * a;
	    es = 0;
	  } else {
	    e = Math.sqrt(es); // eccentricity
	  }
	  var ep2 = (a2 - b2) / b2; // used in geocentric
	  return {
	    es: es,
	    e: e,
	    ep2: ep2
	  };
	}
	function sphere(a, b, rf, ellps, sphere) {
	  if (!a) { // do we have an ellipsoid?
	    var ellipse = match(exports$2, ellps);
	    if (!ellipse) {
	      ellipse = WGS84;
	    }
	    a = ellipse.a;
	    b = ellipse.b;
	    rf = ellipse.rf;
	  }

	  if (rf && !b) {
	    b = (1.0 - 1.0 / rf) * a;
	  }
	  if (rf === 0 || Math.abs(a - b) < EPSLN) {
	    sphere = true;
	    b = a;
	  }
	  return {
	    a: a,
	    b: b,
	    rf: rf,
	    sphere: sphere
	  };
	}

	var exports$3 = {};
	exports$3.wgs84 = {
	  towgs84: "0,0,0",
	  ellipse: "WGS84",
	  datumName: "WGS84"
	};

	exports$3.ch1903 = {
	  towgs84: "674.374,15.056,405.346",
	  ellipse: "bessel",
	  datumName: "swiss"
	};

	exports$3.ggrs87 = {
	  towgs84: "-199.87,74.79,246.62",
	  ellipse: "GRS80",
	  datumName: "Greek_Geodetic_Reference_System_1987"
	};

	exports$3.nad83 = {
	  towgs84: "0,0,0",
	  ellipse: "GRS80",
	  datumName: "North_American_Datum_1983"
	};

	exports$3.nad27 = {
	  nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
	  ellipse: "clrk66",
	  datumName: "North_American_Datum_1927"
	};

	exports$3.potsdam = {
	  towgs84: "606.0,23.0,413.0",
	  ellipse: "bessel",
	  datumName: "Potsdam Rauenberg 1950 DHDN"
	};

	exports$3.carthage = {
	  towgs84: "-263.0,6.0,431.0",
	  ellipse: "clark80",
	  datumName: "Carthage 1934 Tunisia"
	};

	exports$3.hermannskogel = {
	  towgs84: "653.0,-212.0,449.0",
	  ellipse: "bessel",
	  datumName: "Hermannskogel"
	};

	exports$3.osni52 = {
	  towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
	  ellipse: "airy",
	  datumName: "Irish National"
	};

	exports$3.ire65 = {
	  towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
	  ellipse: "mod_airy",
	  datumName: "Ireland 1965"
	};

	exports$3.rassadiran = {
	  towgs84: "-133.63,-157.5,-158.62",
	  ellipse: "intl",
	  datumName: "Rassadiran"
	};

	exports$3.nzgd49 = {
	  towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
	  ellipse: "intl",
	  datumName: "New Zealand Geodetic Datum 1949"
	};

	exports$3.osgb36 = {
	  towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
	  ellipse: "airy",
	  datumName: "Airy 1830"
	};

	exports$3.s_jtsk = {
	  towgs84: "589,76,480",
	  ellipse: 'bessel',
	  datumName: 'S-JTSK (Ferro)'
	};

	exports$3.beduaram = {
	  towgs84: '-106,-87,188',
	  ellipse: 'clrk80',
	  datumName: 'Beduaram'
	};

	exports$3.gunung_segara = {
	  towgs84: '-403,684,41',
	  ellipse: 'bessel',
	  datumName: 'Gunung Segara Jakarta'
	};

	exports$3.rnb72 = {
	  towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
	  ellipse: "intl",
	  datumName: "Reseau National Belge 1972"
	};

	function datum(datumCode, datum_params, a, b, es, ep2) {
	  var out = {};

	  if (datumCode === undefined || datumCode === 'none') {
	    out.datum_type = PJD_NODATUM;
	  } else {
	    out.datum_type = PJD_WGS84;
	  }

	  if (datum_params) {
	    out.datum_params = datum_params.map(parseFloat);
	    if (out.datum_params[0] !== 0 || out.datum_params[1] !== 0 || out.datum_params[2] !== 0) {
	      out.datum_type = PJD_3PARAM;
	    }
	    if (out.datum_params.length > 3) {
	      if (out.datum_params[3] !== 0 || out.datum_params[4] !== 0 || out.datum_params[5] !== 0 || out.datum_params[6] !== 0) {
	        out.datum_type = PJD_7PARAM;
	        out.datum_params[3] *= SEC_TO_RAD;
	        out.datum_params[4] *= SEC_TO_RAD;
	        out.datum_params[5] *= SEC_TO_RAD;
	        out.datum_params[6] = (out.datum_params[6] / 1000000.0) + 1.0;
	      }
	    }
	  }

	  out.a = a; //datum object also uses these values
	  out.b = b;
	  out.es = es;
	  out.ep2 = ep2;
	  return out;
	}

	function Projection$1(srsCode,callback) {
	  if (!(this instanceof Projection$1)) {
	    return new Projection$1(srsCode);
	  }
	  callback = callback || function(error){
	    if(error){
	      throw error;
	    }
	  };
	  var json = parse(srsCode);
	  if(typeof json !== 'object'){
	    callback(srsCode);
	    return;
	  }
	  var ourProj = Projection$1.projections.get(json.projName);
	  if(!ourProj){
	    callback(srsCode);
	    return;
	  }
	  if (json.datumCode && json.datumCode !== 'none') {
	    var datumDef = match(exports$3, json.datumCode);
	    if (datumDef) {
	      json.datum_params = datumDef.towgs84 ? datumDef.towgs84.split(',') : null;
	      json.ellps = datumDef.ellipse;
	      json.datumName = datumDef.datumName ? datumDef.datumName : json.datumCode;
	    }
	  }
	  json.k0 = json.k0 || 1.0;
	  json.axis = json.axis || 'enu';
	  json.ellps = json.ellps || 'wgs84';
	  var sphere_ = sphere(json.a, json.b, json.rf, json.ellps, json.sphere);
	  var ecc = eccentricity(sphere_.a, sphere_.b, sphere_.rf, json.R_A);
	  var datumObj = json.datum || datum(json.datumCode, json.datum_params, sphere_.a, sphere_.b, ecc.es, ecc.ep2);

	  extend(this, json); // transfer everything over from the projection because we don't know what we'll need
	  extend(this, ourProj); // transfer all the methods from the projection

	  // copy the 4 things over we calulated in deriveConstants.sphere
	  this.a = sphere_.a;
	  this.b = sphere_.b;
	  this.rf = sphere_.rf;
	  this.sphere = sphere_.sphere;

	  // copy the 3 things we calculated in deriveConstants.eccentricity
	  this.es = ecc.es;
	  this.e = ecc.e;
	  this.ep2 = ecc.ep2;

	  // add in the datum object
	  this.datum = datumObj;

	  // init the projection
	  this.init();

	  // legecy callback from back in the day when it went to spatialreference.org
	  callback(null, this);

	}
	Projection$1.projections = projections;
	Projection$1.projections.start();

	function compareDatums(source, dest) {
	  if (source.datum_type !== dest.datum_type) {
	    return false; // false, datums are not equal
	  } else if (source.a !== dest.a || Math.abs(source.es - dest.es) > 0.000000000050) {
	    // the tolerance for es is to ensure that GRS80 and WGS84
	    // are considered identical
	    return false;
	  } else if (source.datum_type === PJD_3PARAM) {
	    return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2]);
	  } else if (source.datum_type === PJD_7PARAM) {
	    return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2] && source.datum_params[3] === dest.datum_params[3] && source.datum_params[4] === dest.datum_params[4] && source.datum_params[5] === dest.datum_params[5] && source.datum_params[6] === dest.datum_params[6]);
	  } else {
	    return true; // datums are equal
	  }
	} // cs_compare_datums()

	/*
	 * The function Convert_Geodetic_To_Geocentric converts geodetic coordinates
	 * (latitude, longitude, and height) to geocentric coordinates (X, Y, Z),
	 * according to the current ellipsoid parameters.
	 *
	 *    Latitude  : Geodetic latitude in radians                     (input)
	 *    Longitude : Geodetic longitude in radians                    (input)
	 *    Height    : Geodetic height, in meters                       (input)
	 *    X         : Calculated Geocentric X coordinate, in meters    (output)
	 *    Y         : Calculated Geocentric Y coordinate, in meters    (output)
	 *    Z         : Calculated Geocentric Z coordinate, in meters    (output)
	 *
	 */
	function geodeticToGeocentric(p, es, a) {
	  var Longitude = p.x;
	  var Latitude = p.y;
	  var Height = p.z ? p.z : 0; //Z value not always supplied

	  var Rn; /*  Earth radius at location  */
	  var Sin_Lat; /*  Math.sin(Latitude)  */
	  var Sin2_Lat; /*  Square of Math.sin(Latitude)  */
	  var Cos_Lat; /*  Math.cos(Latitude)  */

	  /*
	   ** Don't blow up if Latitude is just a little out of the value
	   ** range as it may just be a rounding issue.  Also removed longitude
	   ** test, it should be wrapped by Math.cos() and Math.sin().  NFW for PROJ.4, Sep/2001.
	   */
	  if (Latitude < -HALF_PI && Latitude > -1.001 * HALF_PI) {
	    Latitude = -HALF_PI;
	  } else if (Latitude > HALF_PI && Latitude < 1.001 * HALF_PI) {
	    Latitude = HALF_PI;
	  } else if ((Latitude < -HALF_PI) || (Latitude > HALF_PI)) {
	    /* Latitude out of range */
	    //..reportError('geocent:lat out of range:' + Latitude);
	    return null;
	  }

	  if (Longitude > Math.PI) {
	    Longitude -= (2 * Math.PI);
	  }
	  Sin_Lat = Math.sin(Latitude);
	  Cos_Lat = Math.cos(Latitude);
	  Sin2_Lat = Sin_Lat * Sin_Lat;
	  Rn = a / (Math.sqrt(1.0e0 - es * Sin2_Lat));
	  return {
	    x: (Rn + Height) * Cos_Lat * Math.cos(Longitude),
	    y: (Rn + Height) * Cos_Lat * Math.sin(Longitude),
	    z: ((Rn * (1 - es)) + Height) * Sin_Lat
	  };
	} // cs_geodetic_to_geocentric()

	function geocentricToGeodetic(p, es, a, b) {
	  /* local defintions and variables */
	  /* end-criterium of loop, accuracy of sin(Latitude) */
	  var genau = 1e-12;
	  var genau2 = (genau * genau);
	  var maxiter = 30;

	  var P; /* distance between semi-minor axis and location */
	  var RR; /* distance between center and location */
	  var CT; /* sin of geocentric latitude */
	  var ST; /* cos of geocentric latitude */
	  var RX;
	  var RK;
	  var RN; /* Earth radius at location */
	  var CPHI0; /* cos of start or old geodetic latitude in iterations */
	  var SPHI0; /* sin of start or old geodetic latitude in iterations */
	  var CPHI; /* cos of searched geodetic latitude */
	  var SPHI; /* sin of searched geodetic latitude */
	  var SDPHI; /* end-criterium: addition-theorem of sin(Latitude(iter)-Latitude(iter-1)) */
	  var iter; /* # of continous iteration, max. 30 is always enough (s.a.) */

	  var X = p.x;
	  var Y = p.y;
	  var Z = p.z ? p.z : 0.0; //Z value not always supplied
	  var Longitude;
	  var Latitude;
	  var Height;

	  P = Math.sqrt(X * X + Y * Y);
	  RR = Math.sqrt(X * X + Y * Y + Z * Z);

	  /*      special cases for latitude and longitude */
	  if (P / a < genau) {

	    /*  special case, if P=0. (X=0., Y=0.) */
	    Longitude = 0.0;

	    /*  if (X,Y,Z)=(0.,0.,0.) then Height becomes semi-minor axis
	     *  of ellipsoid (=center of mass), Latitude becomes PI/2 */
	    if (RR / a < genau) {
	      Latitude = HALF_PI;
	      Height = -b;
	      return {
	        x: p.x,
	        y: p.y,
	        z: p.z
	      };
	    }
	  } else {
	    /*  ellipsoidal (geodetic) longitude
	     *  interval: -PI < Longitude <= +PI */
	    Longitude = Math.atan2(Y, X);
	  }

	  /* --------------------------------------------------------------
	   * Following iterative algorithm was developped by
	   * "Institut for Erdmessung", University of Hannover, July 1988.
	   * Internet: www.ife.uni-hannover.de
	   * Iterative computation of CPHI,SPHI and Height.
	   * Iteration of CPHI and SPHI to 10**-12 radian resp.
	   * 2*10**-7 arcsec.
	   * --------------------------------------------------------------
	   */
	  CT = Z / RR;
	  ST = P / RR;
	  RX = 1.0 / Math.sqrt(1.0 - es * (2.0 - es) * ST * ST);
	  CPHI0 = ST * (1.0 - es) * RX;
	  SPHI0 = CT * RX;
	  iter = 0;

	  /* loop to find sin(Latitude) resp. Latitude
	   * until |sin(Latitude(iter)-Latitude(iter-1))| < genau */
	  do {
	    iter++;
	    RN = a / Math.sqrt(1.0 - es * SPHI0 * SPHI0);

	    /*  ellipsoidal (geodetic) height */
	    Height = P * CPHI0 + Z * SPHI0 - RN * (1.0 - es * SPHI0 * SPHI0);

	    RK = es * RN / (RN + Height);
	    RX = 1.0 / Math.sqrt(1.0 - RK * (2.0 - RK) * ST * ST);
	    CPHI = ST * (1.0 - RK) * RX;
	    SPHI = CT * RX;
	    SDPHI = SPHI * CPHI0 - CPHI * SPHI0;
	    CPHI0 = CPHI;
	    SPHI0 = SPHI;
	  }
	  while (SDPHI * SDPHI > genau2 && iter < maxiter);

	  /*      ellipsoidal (geodetic) latitude */
	  Latitude = Math.atan(SPHI / Math.abs(CPHI));
	  return {
	    x: Longitude,
	    y: Latitude,
	    z: Height
	  };
	} // cs_geocentric_to_geodetic()

	/****************************************************************/
	// pj_geocentic_to_wgs84( p )
	//  p = point to transform in geocentric coordinates (x,y,z)


	/** point object, nothing fancy, just allows values to be
	    passed back and forth by reference rather than by value.
	    Other point classes may be used as long as they have
	    x and y properties, which will get modified in the transform method.
	*/
	function geocentricToWgs84(p, datum_type, datum_params) {

	  if (datum_type === PJD_3PARAM) {
	    // if( x[io] === HUGE_VAL )
	    //    continue;
	    return {
	      x: p.x + datum_params[0],
	      y: p.y + datum_params[1],
	      z: p.z + datum_params[2],
	    };
	  } else if (datum_type === PJD_7PARAM) {
	    var Dx_BF = datum_params[0];
	    var Dy_BF = datum_params[1];
	    var Dz_BF = datum_params[2];
	    var Rx_BF = datum_params[3];
	    var Ry_BF = datum_params[4];
	    var Rz_BF = datum_params[5];
	    var M_BF = datum_params[6];
	    // if( x[io] === HUGE_VAL )
	    //    continue;
	    return {
	      x: M_BF * (p.x - Rz_BF * p.y + Ry_BF * p.z) + Dx_BF,
	      y: M_BF * (Rz_BF * p.x + p.y - Rx_BF * p.z) + Dy_BF,
	      z: M_BF * (-Ry_BF * p.x + Rx_BF * p.y + p.z) + Dz_BF
	    };
	  }
	} // cs_geocentric_to_wgs84

	/****************************************************************/
	// pj_geocentic_from_wgs84()
	//  coordinate system definition,
	//  point to transform in geocentric coordinates (x,y,z)
	function geocentricFromWgs84(p, datum_type, datum_params) {

	  if (datum_type === PJD_3PARAM) {
	    //if( x[io] === HUGE_VAL )
	    //    continue;
	    return {
	      x: p.x - datum_params[0],
	      y: p.y - datum_params[1],
	      z: p.z - datum_params[2],
	    };

	  } else if (datum_type === PJD_7PARAM) {
	    var Dx_BF = datum_params[0];
	    var Dy_BF = datum_params[1];
	    var Dz_BF = datum_params[2];
	    var Rx_BF = datum_params[3];
	    var Ry_BF = datum_params[4];
	    var Rz_BF = datum_params[5];
	    var M_BF = datum_params[6];
	    var x_tmp = (p.x - Dx_BF) / M_BF;
	    var y_tmp = (p.y - Dy_BF) / M_BF;
	    var z_tmp = (p.z - Dz_BF) / M_BF;
	    //if( x[io] === HUGE_VAL )
	    //    continue;

	    return {
	      x: x_tmp + Rz_BF * y_tmp - Ry_BF * z_tmp,
	      y: -Rz_BF * x_tmp + y_tmp + Rx_BF * z_tmp,
	      z: Ry_BF * x_tmp - Rx_BF * y_tmp + z_tmp
	    };
	  } //cs_geocentric_from_wgs84()
	}

	function checkParams(type) {
	  return (type === PJD_3PARAM || type === PJD_7PARAM);
	}

	var datum_transform = function(source, dest, point) {
	  // Short cut if the datums are identical.
	  if (compareDatums(source, dest)) {
	    return point; // in this case, zero is sucess,
	    // whereas cs_compare_datums returns 1 to indicate TRUE
	    // confusing, should fix this
	  }

	  // Explicitly skip datum transform by setting 'datum=none' as parameter for either source or dest
	  if (source.datum_type === PJD_NODATUM || dest.datum_type === PJD_NODATUM) {
	    return point;
	  }

	  // If this datum requires grid shifts, then apply it to geodetic coordinates.

	  // Do we need to go through geocentric coordinates?
	  if (source.es === dest.es && source.a === dest.a && !checkParams(source.datum_type) &&  !checkParams(dest.datum_type)) {
	    return point;
	  }

	  // Convert to geocentric coordinates.
	  point = geodeticToGeocentric(point, source.es, source.a);
	  // Convert between datums
	  if (checkParams(source.datum_type)) {
	    point = geocentricToWgs84(point, source.datum_type, source.datum_params);
	  }
	  if (checkParams(dest.datum_type)) {
	    point = geocentricFromWgs84(point, dest.datum_type, dest.datum_params);
	  }
	  return geocentricToGeodetic(point, dest.es, dest.a, dest.b);

	};

	var adjust_axis = function(crs, denorm, point) {
	  var xin = point.x,
	    yin = point.y,
	    zin = point.z || 0.0;
	  var v, t, i;
	  var out = {};
	  for (i = 0; i < 3; i++) {
	    if (denorm && i === 2 && point.z === undefined) {
	      continue;
	    }
	    if (i === 0) {
	      v = xin;
	      t = 'x';
	    }
	    else if (i === 1) {
	      v = yin;
	      t = 'y';
	    }
	    else {
	      v = zin;
	      t = 'z';
	    }
	    switch (crs.axis[i]) {
	    case 'e':
	      out[t] = v;
	      break;
	    case 'w':
	      out[t] = -v;
	      break;
	    case 'n':
	      out[t] = v;
	      break;
	    case 's':
	      out[t] = -v;
	      break;
	    case 'u':
	      if (point[t] !== undefined) {
	        out.z = v;
	      }
	      break;
	    case 'd':
	      if (point[t] !== undefined) {
	        out.z = -v;
	      }
	      break;
	    default:
	      //console.log("ERROR: unknow axis ("+crs.axis[i]+") - check definition of "+crs.projName);
	      return null;
	    }
	  }
	  return out;
	};

	var toPoint = function (array){
	  var out = {
	    x: array[0],
	    y: array[1]
	  };
	  if (array.length>2) {
	    out.z = array[2];
	  }
	  if (array.length>3) {
	    out.m = array[3];
	  }
	  return out;
	};

	var checkSanity = function (point) {
	  checkCoord(point.x);
	  checkCoord(point.y);
	};
	function checkCoord(num) {
	  if (typeof Number.isFinite === 'function') {
	    if (Number.isFinite(num)) {
	      return;
	    }
	    throw new TypeError('coordinates must be finite numbers');
	  }
	  if (typeof num !== 'number' || num !== num || !isFinite(num)) {
	    throw new TypeError('coordinates must be finite numbers');
	  }
	}

	function checkNotWGS(source, dest) {
	  return ((source.datum.datum_type === PJD_3PARAM || source.datum.datum_type === PJD_7PARAM) && dest.datumCode !== 'WGS84') || ((dest.datum.datum_type === PJD_3PARAM || dest.datum.datum_type === PJD_7PARAM) && source.datumCode !== 'WGS84');
	}

	function transform(source, dest, point) {
	  var wgs84;
	  if (Array.isArray(point)) {
	    point = toPoint(point);
	  }
	  checkSanity(point);
	  // Workaround for datum shifts towgs84, if either source or destination projection is not wgs84
	  if (source.datum && dest.datum && checkNotWGS(source, dest)) {
	    wgs84 = new Projection$1('WGS84');
	    point = transform(source, wgs84, point);
	    source = wgs84;
	  }
	  // DGR, 2010/11/12
	  if (source.axis !== 'enu') {
	    point = adjust_axis(source, false, point);
	  }
	  // Transform source points to long/lat, if they aren't already.
	  if (source.projName === 'longlat') {
	    point = {
	      x: point.x * D2R,
	      y: point.y * D2R
	    };
	  }
	  else {
	    if (source.to_meter) {
	      point = {
	        x: point.x * source.to_meter,
	        y: point.y * source.to_meter
	      };
	    }
	    point = source.inverse(point); // Convert Cartesian to longlat
	  }
	  // Adjust for the prime meridian if necessary
	  if (source.from_greenwich) {
	    point.x += source.from_greenwich;
	  }

	  // Convert datums if needed, and if possible.
	  point = datum_transform(source.datum, dest.datum, point);

	  // Adjust for the prime meridian if necessary
	  if (dest.from_greenwich) {
	    point = {
	      x: point.x - dest.from_greenwich,
	      y: point.y
	    };
	  }

	  if (dest.projName === 'longlat') {
	    // convert radians to decimal degrees
	    point = {
	      x: point.x * R2D,
	      y: point.y * R2D
	    };
	  } else { // else project
	    point = dest.forward(point);
	    if (dest.to_meter) {
	      point = {
	        x: point.x / dest.to_meter,
	        y: point.y / dest.to_meter
	      };
	    }
	  }

	  // DGR, 2010/11/12
	  if (dest.axis !== 'enu') {
	    return adjust_axis(dest, true, point);
	  }

	  return point;
	}

	var wgs84 = Projection$1('WGS84');

	function transformer(from, to, coords) {
	  var transformedArray, out, keys;
	  if (Array.isArray(coords)) {
	    transformedArray = transform(from, to, coords);
	    if (coords.length === 3) {
	      return [transformedArray.x, transformedArray.y, transformedArray.z];
	    }
	    else {
	      return [transformedArray.x, transformedArray.y];
	    }
	  }
	  else {
	    out = transform(from, to, coords);
	    keys = Object.keys(coords);
	    if (keys.length === 2) {
	      return out;
	    }
	    keys.forEach(function (key) {
	      if (key === 'x' || key === 'y') {
	        return;
	      }
	      out[key] = coords[key];
	    });
	    return out;
	  }
	}

	function checkProj(item) {
	  if (item instanceof Projection$1) {
	    return item;
	  }
	  if (item.oProj) {
	    return item.oProj;
	  }
	  return Projection$1(item);
	}
	function proj4$1(fromProj, toProj, coord) {
	  fromProj = checkProj(fromProj);
	  var single = false;
	  var obj;
	  if (typeof toProj === 'undefined') {
	    toProj = fromProj;
	    fromProj = wgs84;
	    single = true;
	  }
	  else if (typeof toProj.x !== 'undefined' || Array.isArray(toProj)) {
	    coord = toProj;
	    toProj = fromProj;
	    fromProj = wgs84;
	    single = true;
	  }
	  toProj = checkProj(toProj);
	  if (coord) {
	    return transformer(fromProj, toProj, coord);
	  }
	  else {
	    obj = {
	      forward: function(coords) {
	        return transformer(fromProj, toProj, coords);
	      },
	      inverse: function(coords) {
	        return transformer(toProj, fromProj, coords);
	      }
	    };
	    if (single) {
	      obj.oProj = toProj;
	    }
	    return obj;
	  }
	}

	/**
	 * UTM zones are grouped, and assigned to one of a group of 6
	 * sets.
	 *
	 * {int} @private
	 */
	var NUM_100K_SETS = 6;

	/**
	 * The column letters (for easting) of the lower left value, per
	 * set.
	 *
	 * {string} @private
	 */
	var SET_ORIGIN_COLUMN_LETTERS = 'AJSAJS';

	/**
	 * The row letters (for northing) of the lower left value, per
	 * set.
	 *
	 * {string} @private
	 */
	var SET_ORIGIN_ROW_LETTERS = 'AFAFAF';

	var A = 65; // A
	var I = 73; // I
	var O = 79; // O
	var V = 86; // V
	var Z = 90; // Z
	var mgrs = {
	  forward: forward$1,
	  inverse: inverse$1,
	  toPoint: toPoint$1
	};
	/**
	 * Conversion of lat/lon to MGRS.
	 *
	 * @param {object} ll Object literal with lat and lon properties on a
	 *     WGS84 ellipsoid.
	 * @param {int} accuracy Accuracy in digits (5 for 1 m, 4 for 10 m, 3 for
	 *      100 m, 2 for 1000 m or 1 for 10000 m). Optional, default is 5.
	 * @return {string} the MGRS string for the given location and accuracy.
	 */
	function forward$1(ll, accuracy) {
	  accuracy = accuracy || 5; // default accuracy 1m
	  return encode(LLtoUTM({
	    lat: ll[1],
	    lon: ll[0]
	  }), accuracy);
	}

	/**
	 * Conversion of MGRS to lat/lon.
	 *
	 * @param {string} mgrs MGRS string.
	 * @return {array} An array with left (longitude), bottom (latitude), right
	 *     (longitude) and top (latitude) values in WGS84, representing the
	 *     bounding box for the provided MGRS reference.
	 */
	function inverse$1(mgrs) {
	  var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
	  if (bbox.lat && bbox.lon) {
	    return [bbox.lon, bbox.lat, bbox.lon, bbox.lat];
	  }
	  return [bbox.left, bbox.bottom, bbox.right, bbox.top];
	}

	function toPoint$1(mgrs) {
	  var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
	  if (bbox.lat && bbox.lon) {
	    return [bbox.lon, bbox.lat];
	  }
	  return [(bbox.left + bbox.right) / 2, (bbox.top + bbox.bottom) / 2];
	}
	/**
	 * Conversion from degrees to radians.
	 *
	 * @private
	 * @param {number} deg the angle in degrees.
	 * @return {number} the angle in radians.
	 */
	function degToRad(deg) {
	  return (deg * (Math.PI / 180.0));
	}

	/**
	 * Conversion from radians to degrees.
	 *
	 * @private
	 * @param {number} rad the angle in radians.
	 * @return {number} the angle in degrees.
	 */
	function radToDeg(rad) {
	  return (180.0 * (rad / Math.PI));
	}

	/**
	 * Converts a set of Longitude and Latitude co-ordinates to UTM
	 * using the WGS84 ellipsoid.
	 *
	 * @private
	 * @param {object} ll Object literal with lat and lon properties
	 *     representing the WGS84 coordinate to be converted.
	 * @return {object} Object literal containing the UTM value with easting,
	 *     northing, zoneNumber and zoneLetter properties, and an optional
	 *     accuracy property in digits. Returns null if the conversion failed.
	 */
	function LLtoUTM(ll) {
	  var Lat = ll.lat;
	  var Long = ll.lon;
	  var a = 6378137.0; //ellip.radius;
	  var eccSquared = 0.00669438; //ellip.eccsq;
	  var k0 = 0.9996;
	  var LongOrigin;
	  var eccPrimeSquared;
	  var N, T, C, A, M;
	  var LatRad = degToRad(Lat);
	  var LongRad = degToRad(Long);
	  var LongOriginRad;
	  var ZoneNumber;
	  // (int)
	  ZoneNumber = Math.floor((Long + 180) / 6) + 1;

	  //Make sure the longitude 180.00 is in Zone 60
	  if (Long === 180) {
	    ZoneNumber = 60;
	  }

	  // Special zone for Norway
	  if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
	    ZoneNumber = 32;
	  }

	  // Special zones for Svalbard
	  if (Lat >= 72.0 && Lat < 84.0) {
	    if (Long >= 0.0 && Long < 9.0) {
	      ZoneNumber = 31;
	    }
	    else if (Long >= 9.0 && Long < 21.0) {
	      ZoneNumber = 33;
	    }
	    else if (Long >= 21.0 && Long < 33.0) {
	      ZoneNumber = 35;
	    }
	    else if (Long >= 33.0 && Long < 42.0) {
	      ZoneNumber = 37;
	    }
	  }

	  LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin
	  // in middle of
	  // zone
	  LongOriginRad = degToRad(LongOrigin);

	  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

	  N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
	  T = Math.tan(LatRad) * Math.tan(LatRad);
	  C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
	  A = Math.cos(LatRad) * (LongRad - LongOriginRad);

	  M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256) * LatRad - (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad) + (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(4 * LatRad) - (35 * eccSquared * eccSquared * eccSquared / 3072) * Math.sin(6 * LatRad));

	  var UTMEasting = (k0 * N * (A + (1 - T + C) * A * A * A / 6.0 + (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A / 120.0) + 500000.0);

	  var UTMNorthing = (k0 * (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24.0 + (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A / 720.0)));
	  if (Lat < 0.0) {
	    UTMNorthing += 10000000.0; //10000000 meter offset for
	    // southern hemisphere
	  }

	  return {
	    northing: Math.round(UTMNorthing),
	    easting: Math.round(UTMEasting),
	    zoneNumber: ZoneNumber,
	    zoneLetter: getLetterDesignator(Lat)
	  };
	}

	/**
	 * Converts UTM coords to lat/long, using the WGS84 ellipsoid. This is a convenience
	 * class where the Zone can be specified as a single string eg."60N" which
	 * is then broken down into the ZoneNumber and ZoneLetter.
	 *
	 * @private
	 * @param {object} utm An object literal with northing, easting, zoneNumber
	 *     and zoneLetter properties. If an optional accuracy property is
	 *     provided (in meters), a bounding box will be returned instead of
	 *     latitude and longitude.
	 * @return {object} An object literal containing either lat and lon values
	 *     (if no accuracy was provided), or top, right, bottom and left values
	 *     for the bounding box calculated according to the provided accuracy.
	 *     Returns null if the conversion failed.
	 */
	function UTMtoLL(utm) {

	  var UTMNorthing = utm.northing;
	  var UTMEasting = utm.easting;
	  var zoneLetter = utm.zoneLetter;
	  var zoneNumber = utm.zoneNumber;
	  // check the ZoneNummber is valid
	  if (zoneNumber < 0 || zoneNumber > 60) {
	    return null;
	  }

	  var k0 = 0.9996;
	  var a = 6378137.0; //ellip.radius;
	  var eccSquared = 0.00669438; //ellip.eccsq;
	  var eccPrimeSquared;
	  var e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
	  var N1, T1, C1, R1, D, M;
	  var LongOrigin;
	  var mu, phi1Rad;

	  // remove 500,000 meter offset for longitude
	  var x = UTMEasting - 500000.0;
	  var y = UTMNorthing;

	  // We must know somehow if we are in the Northern or Southern
	  // hemisphere, this is the only time we use the letter So even
	  // if the Zone letter isn't exactly correct it should indicate
	  // the hemisphere correctly
	  if (zoneLetter < 'N') {
	    y -= 10000000.0; // remove 10,000,000 meter offset used
	    // for southern hemisphere
	  }

	  // There are 60 zones with zone 1 being at West -180 to -174
	  LongOrigin = (zoneNumber - 1) * 6 - 180 + 3; // +3 puts origin
	  // in middle of
	  // zone

	  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

	  M = y / k0;
	  mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256));

	  phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) + (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);
	  // double phi1 = ProjMath.radToDeg(phi1Rad);

	  N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
	  T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
	  C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
	  R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
	  D = x / (N1 * k0);

	  var lat = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
	  lat = radToDeg(lat);

	  var lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1Rad);
	  lon = LongOrigin + radToDeg(lon);

	  var result;
	  if (utm.accuracy) {
	    var topRight = UTMtoLL({
	      northing: utm.northing + utm.accuracy,
	      easting: utm.easting + utm.accuracy,
	      zoneLetter: utm.zoneLetter,
	      zoneNumber: utm.zoneNumber
	    });
	    result = {
	      top: topRight.lat,
	      right: topRight.lon,
	      bottom: lat,
	      left: lon
	    };
	  }
	  else {
	    result = {
	      lat: lat,
	      lon: lon
	    };
	  }
	  return result;
	}

	/**
	 * Calculates the MGRS letter designator for the given latitude.
	 *
	 * @private
	 * @param {number} lat The latitude in WGS84 to get the letter designator
	 *     for.
	 * @return {char} The letter designator.
	 */
	function getLetterDesignator(lat) {
	  //This is here as an error flag to show that the Latitude is
	  //outside MGRS limits
	  var LetterDesignator = 'Z';

	  if ((84 >= lat) && (lat >= 72)) {
	    LetterDesignator = 'X';
	  }
	  else if ((72 > lat) && (lat >= 64)) {
	    LetterDesignator = 'W';
	  }
	  else if ((64 > lat) && (lat >= 56)) {
	    LetterDesignator = 'V';
	  }
	  else if ((56 > lat) && (lat >= 48)) {
	    LetterDesignator = 'U';
	  }
	  else if ((48 > lat) && (lat >= 40)) {
	    LetterDesignator = 'T';
	  }
	  else if ((40 > lat) && (lat >= 32)) {
	    LetterDesignator = 'S';
	  }
	  else if ((32 > lat) && (lat >= 24)) {
	    LetterDesignator = 'R';
	  }
	  else if ((24 > lat) && (lat >= 16)) {
	    LetterDesignator = 'Q';
	  }
	  else if ((16 > lat) && (lat >= 8)) {
	    LetterDesignator = 'P';
	  }
	  else if ((8 > lat) && (lat >= 0)) {
	    LetterDesignator = 'N';
	  }
	  else if ((0 > lat) && (lat >= -8)) {
	    LetterDesignator = 'M';
	  }
	  else if ((-8 > lat) && (lat >= -16)) {
	    LetterDesignator = 'L';
	  }
	  else if ((-16 > lat) && (lat >= -24)) {
	    LetterDesignator = 'K';
	  }
	  else if ((-24 > lat) && (lat >= -32)) {
	    LetterDesignator = 'J';
	  }
	  else if ((-32 > lat) && (lat >= -40)) {
	    LetterDesignator = 'H';
	  }
	  else if ((-40 > lat) && (lat >= -48)) {
	    LetterDesignator = 'G';
	  }
	  else if ((-48 > lat) && (lat >= -56)) {
	    LetterDesignator = 'F';
	  }
	  else if ((-56 > lat) && (lat >= -64)) {
	    LetterDesignator = 'E';
	  }
	  else if ((-64 > lat) && (lat >= -72)) {
	    LetterDesignator = 'D';
	  }
	  else if ((-72 > lat) && (lat >= -80)) {
	    LetterDesignator = 'C';
	  }
	  return LetterDesignator;
	}

	/**
	 * Encodes a UTM location as MGRS string.
	 *
	 * @private
	 * @param {object} utm An object literal with easting, northing,
	 *     zoneLetter, zoneNumber
	 * @param {number} accuracy Accuracy in digits (1-5).
	 * @return {string} MGRS string for the given UTM location.
	 */
	function encode(utm, accuracy) {
	  // prepend with leading zeroes
	  var seasting = "00000" + utm.easting,
	    snorthing = "00000" + utm.northing;

	  return utm.zoneNumber + utm.zoneLetter + get100kID(utm.easting, utm.northing, utm.zoneNumber) + seasting.substr(seasting.length - 5, accuracy) + snorthing.substr(snorthing.length - 5, accuracy);
	}

	/**
	 * Get the two letter 100k designator for a given UTM easting,
	 * northing and zone number value.
	 *
	 * @private
	 * @param {number} easting
	 * @param {number} northing
	 * @param {number} zoneNumber
	 * @return the two letter 100k designator for the given UTM location.
	 */
	function get100kID(easting, northing, zoneNumber) {
	  var setParm = get100kSetForZone(zoneNumber);
	  var setColumn = Math.floor(easting / 100000);
	  var setRow = Math.floor(northing / 100000) % 20;
	  return getLetter100kID(setColumn, setRow, setParm);
	}

	/**
	 * Given a UTM zone number, figure out the MGRS 100K set it is in.
	 *
	 * @private
	 * @param {number} i An UTM zone number.
	 * @return {number} the 100k set the UTM zone is in.
	 */
	function get100kSetForZone(i) {
	  var setParm = i % NUM_100K_SETS;
	  if (setParm === 0) {
	    setParm = NUM_100K_SETS;
	  }

	  return setParm;
	}

	/**
	 * Get the two-letter MGRS 100k designator given information
	 * translated from the UTM northing, easting and zone number.
	 *
	 * @private
	 * @param {number} column the column index as it relates to the MGRS
	 *        100k set spreadsheet, created from the UTM easting.
	 *        Values are 1-8.
	 * @param {number} row the row index as it relates to the MGRS 100k set
	 *        spreadsheet, created from the UTM northing value. Values
	 *        are from 0-19.
	 * @param {number} parm the set block, as it relates to the MGRS 100k set
	 *        spreadsheet, created from the UTM zone. Values are from
	 *        1-60.
	 * @return two letter MGRS 100k code.
	 */
	function getLetter100kID(column, row, parm) {
	  // colOrigin and rowOrigin are the letters at the origin of the set
	  var index = parm - 1;
	  var colOrigin = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(index);
	  var rowOrigin = SET_ORIGIN_ROW_LETTERS.charCodeAt(index);

	  // colInt and rowInt are the letters to build to return
	  var colInt = colOrigin + column - 1;
	  var rowInt = rowOrigin + row;
	  var rollover = false;

	  if (colInt > Z) {
	    colInt = colInt - Z + A - 1;
	    rollover = true;
	  }

	  if (colInt === I || (colOrigin < I && colInt > I) || ((colInt > I || colOrigin < I) && rollover)) {
	    colInt++;
	  }

	  if (colInt === O || (colOrigin < O && colInt > O) || ((colInt > O || colOrigin < O) && rollover)) {
	    colInt++;

	    if (colInt === I) {
	      colInt++;
	    }
	  }

	  if (colInt > Z) {
	    colInt = colInt - Z + A - 1;
	  }

	  if (rowInt > V) {
	    rowInt = rowInt - V + A - 1;
	    rollover = true;
	  }
	  else {
	    rollover = false;
	  }

	  if (((rowInt === I) || ((rowOrigin < I) && (rowInt > I))) || (((rowInt > I) || (rowOrigin < I)) && rollover)) {
	    rowInt++;
	  }

	  if (((rowInt === O) || ((rowOrigin < O) && (rowInt > O))) || (((rowInt > O) || (rowOrigin < O)) && rollover)) {
	    rowInt++;

	    if (rowInt === I) {
	      rowInt++;
	    }
	  }

	  if (rowInt > V) {
	    rowInt = rowInt - V + A - 1;
	  }

	  var twoLetter = String.fromCharCode(colInt) + String.fromCharCode(rowInt);
	  return twoLetter;
	}

	/**
	 * Decode the UTM parameters from a MGRS string.
	 *
	 * @private
	 * @param {string} mgrsString an UPPERCASE coordinate string is expected.
	 * @return {object} An object literal with easting, northing, zoneLetter,
	 *     zoneNumber and accuracy (in meters) properties.
	 */
	function decode(mgrsString) {

	  if (mgrsString && mgrsString.length === 0) {
	    throw ("MGRSPoint coverting from nothing");
	  }

	  var length = mgrsString.length;

	  var hunK = null;
	  var sb = "";
	  var testChar;
	  var i = 0;

	  // get Zone number
	  while (!(/[A-Z]/).test(testChar = mgrsString.charAt(i))) {
	    if (i >= 2) {
	      throw ("MGRSPoint bad conversion from: " + mgrsString);
	    }
	    sb += testChar;
	    i++;
	  }

	  var zoneNumber = parseInt(sb, 10);

	  if (i === 0 || i + 3 > length) {
	    // A good MGRS string has to be 4-5 digits long,
	    // ##AAA/#AAA at least.
	    throw ("MGRSPoint bad conversion from: " + mgrsString);
	  }

	  var zoneLetter = mgrsString.charAt(i++);

	  // Should we check the zone letter here? Why not.
	  if (zoneLetter <= 'A' || zoneLetter === 'B' || zoneLetter === 'Y' || zoneLetter >= 'Z' || zoneLetter === 'I' || zoneLetter === 'O') {
	    throw ("MGRSPoint zone letter " + zoneLetter + " not handled: " + mgrsString);
	  }

	  hunK = mgrsString.substring(i, i += 2);

	  var set = get100kSetForZone(zoneNumber);

	  var east100k = getEastingFromChar(hunK.charAt(0), set);
	  var north100k = getNorthingFromChar(hunK.charAt(1), set);

	  // We have a bug where the northing may be 2000000 too low.
	  // How
	  // do we know when to roll over?

	  while (north100k < getMinNorthing(zoneLetter)) {
	    north100k += 2000000;
	  }

	  // calculate the char index for easting/northing separator
	  var remainder = length - i;

	  if (remainder % 2 !== 0) {
	    throw ("MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters" + mgrsString);
	  }

	  var sep = remainder / 2;

	  var sepEasting = 0.0;
	  var sepNorthing = 0.0;
	  var accuracyBonus, sepEastingString, sepNorthingString, easting, northing;
	  if (sep > 0) {
	    accuracyBonus = 100000.0 / Math.pow(10, sep);
	    sepEastingString = mgrsString.substring(i, i + sep);
	    sepEasting = parseFloat(sepEastingString) * accuracyBonus;
	    sepNorthingString = mgrsString.substring(i + sep);
	    sepNorthing = parseFloat(sepNorthingString) * accuracyBonus;
	  }

	  easting = sepEasting + east100k;
	  northing = sepNorthing + north100k;

	  return {
	    easting: easting,
	    northing: northing,
	    zoneLetter: zoneLetter,
	    zoneNumber: zoneNumber,
	    accuracy: accuracyBonus
	  };
	}

	/**
	 * Given the first letter from a two-letter MGRS 100k zone, and given the
	 * MGRS table set for the zone number, figure out the easting value that
	 * should be added to the other, secondary easting value.
	 *
	 * @private
	 * @param {char} e The first letter from a two-letter MGRS 100´k zone.
	 * @param {number} set The MGRS table set for the zone number.
	 * @return {number} The easting value for the given letter and set.
	 */
	function getEastingFromChar(e, set) {
	  // colOrigin is the letter at the origin of the set for the
	  // column
	  var curCol = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(set - 1);
	  var eastingValue = 100000.0;
	  var rewindMarker = false;

	  while (curCol !== e.charCodeAt(0)) {
	    curCol++;
	    if (curCol === I) {
	      curCol++;
	    }
	    if (curCol === O) {
	      curCol++;
	    }
	    if (curCol > Z) {
	      if (rewindMarker) {
	        throw ("Bad character: " + e);
	      }
	      curCol = A;
	      rewindMarker = true;
	    }
	    eastingValue += 100000.0;
	  }

	  return eastingValue;
	}

	/**
	 * Given the second letter from a two-letter MGRS 100k zone, and given the
	 * MGRS table set for the zone number, figure out the northing value that
	 * should be added to the other, secondary northing value. You have to
	 * remember that Northings are determined from the equator, and the vertical
	 * cycle of letters mean a 2000000 additional northing meters. This happens
	 * approx. every 18 degrees of latitude. This method does *NOT* count any
	 * additional northings. You have to figure out how many 2000000 meters need
	 * to be added for the zone letter of the MGRS coordinate.
	 *
	 * @private
	 * @param {char} n Second letter of the MGRS 100k zone
	 * @param {number} set The MGRS table set number, which is dependent on the
	 *     UTM zone number.
	 * @return {number} The northing value for the given letter and set.
	 */
	function getNorthingFromChar(n, set) {

	  if (n > 'V') {
	    throw ("MGRSPoint given invalid Northing " + n);
	  }

	  // rowOrigin is the letter at the origin of the set for the
	  // column
	  var curRow = SET_ORIGIN_ROW_LETTERS.charCodeAt(set - 1);
	  var northingValue = 0.0;
	  var rewindMarker = false;

	  while (curRow !== n.charCodeAt(0)) {
	    curRow++;
	    if (curRow === I) {
	      curRow++;
	    }
	    if (curRow === O) {
	      curRow++;
	    }
	    // fixing a bug making whole application hang in this loop
	    // when 'n' is a wrong character
	    if (curRow > V) {
	      if (rewindMarker) { // making sure that this loop ends
	        throw ("Bad character: " + n);
	      }
	      curRow = A;
	      rewindMarker = true;
	    }
	    northingValue += 100000.0;
	  }

	  return northingValue;
	}

	/**
	 * The function getMinNorthing returns the minimum northing value of a MGRS
	 * zone.
	 *
	 * Ported from Geotrans' c Lattitude_Band_Value structure table.
	 *
	 * @private
	 * @param {char} zoneLetter The MGRS zone to get the min northing for.
	 * @return {number}
	 */
	function getMinNorthing(zoneLetter) {
	  var northing;
	  switch (zoneLetter) {
	  case 'C':
	    northing = 1100000.0;
	    break;
	  case 'D':
	    northing = 2000000.0;
	    break;
	  case 'E':
	    northing = 2800000.0;
	    break;
	  case 'F':
	    northing = 3700000.0;
	    break;
	  case 'G':
	    northing = 4600000.0;
	    break;
	  case 'H':
	    northing = 5500000.0;
	    break;
	  case 'J':
	    northing = 6400000.0;
	    break;
	  case 'K':
	    northing = 7300000.0;
	    break;
	  case 'L':
	    northing = 8200000.0;
	    break;
	  case 'M':
	    northing = 9100000.0;
	    break;
	  case 'N':
	    northing = 0.0;
	    break;
	  case 'P':
	    northing = 800000.0;
	    break;
	  case 'Q':
	    northing = 1700000.0;
	    break;
	  case 'R':
	    northing = 2600000.0;
	    break;
	  case 'S':
	    northing = 3500000.0;
	    break;
	  case 'T':
	    northing = 4400000.0;
	    break;
	  case 'U':
	    northing = 5300000.0;
	    break;
	  case 'V':
	    northing = 6200000.0;
	    break;
	  case 'W':
	    northing = 7000000.0;
	    break;
	  case 'X':
	    northing = 7900000.0;
	    break;
	  default:
	    northing = -1.0;
	  }
	  if (northing >= 0.0) {
	    return northing;
	  }
	  else {
	    throw ("Invalid zone letter: " + zoneLetter);
	  }

	}

	function Point(x, y, z) {
	  if (!(this instanceof Point)) {
	    return new Point(x, y, z);
	  }
	  if (Array.isArray(x)) {
	    this.x = x[0];
	    this.y = x[1];
	    this.z = x[2] || 0.0;
	  } else if(typeof x === 'object') {
	    this.x = x.x;
	    this.y = x.y;
	    this.z = x.z || 0.0;
	  } else if (typeof x === 'string' && typeof y === 'undefined') {
	    var coords = x.split(',');
	    this.x = parseFloat(coords[0], 10);
	    this.y = parseFloat(coords[1], 10);
	    this.z = parseFloat(coords[2], 10) || 0.0;
	  } else {
	    this.x = x;
	    this.y = y;
	    this.z = z || 0.0;
	  }
	  console.warn('proj4.Point will be removed in version 3, use proj4.toPoint');
	}

	Point.fromMGRS = function(mgrsStr) {
	  return new Point(toPoint$1(mgrsStr));
	};
	Point.prototype.toMGRS = function(accuracy) {
	  return forward$1([this.x, this.y], accuracy);
	};

	var version = "2.4.4";

	var C00 = 1;
	var C02 = 0.25;
	var C04 = 0.046875;
	var C06 = 0.01953125;
	var C08 = 0.01068115234375;
	var C22 = 0.75;
	var C44 = 0.46875;
	var C46 = 0.01302083333333333333;
	var C48 = 0.00712076822916666666;
	var C66 = 0.36458333333333333333;
	var C68 = 0.00569661458333333333;
	var C88 = 0.3076171875;

	var pj_enfn = function(es) {
	  var en = [];
	  en[0] = C00 - es * (C02 + es * (C04 + es * (C06 + es * C08)));
	  en[1] = es * (C22 - es * (C04 + es * (C06 + es * C08)));
	  var t = es * es;
	  en[2] = t * (C44 - es * (C46 + es * C48));
	  t *= es;
	  en[3] = t * (C66 - es * C68);
	  en[4] = t * es * C88;
	  return en;
	};

	var pj_mlfn = function(phi, sphi, cphi, en) {
	  cphi *= sphi;
	  sphi *= sphi;
	  return (en[0] * phi - cphi * (en[1] + sphi * (en[2] + sphi * (en[3] + sphi * en[4]))));
	};

	var MAX_ITER = 20;

	var pj_inv_mlfn = function(arg, es, en) {
	  var k = 1 / (1 - es);
	  var phi = arg;
	  for (var i = MAX_ITER; i; --i) { /* rarely goes over 2 iterations */
	    var s = Math.sin(phi);
	    var t = 1 - es * s * s;
	    //t = this.pj_mlfn(phi, s, Math.cos(phi), en) - arg;
	    //phi -= t * (t * Math.sqrt(t)) * k;
	    t = (pj_mlfn(phi, s, Math.cos(phi), en) - arg) * (t * Math.sqrt(t)) * k;
	    phi -= t;
	    if (Math.abs(t) < EPSLN) {
	      return phi;
	    }
	  }
	  //..reportError("cass:pj_inv_mlfn: Convergence error");
	  return phi;
	};

	// Heavily based on this tmerc projection implementation
	// https://github.com/mbloch/mapshaper-proj/blob/master/src/projections/tmerc.js

	function init$2() {
	  this.x0 = this.x0 !== undefined ? this.x0 : 0;
	  this.y0 = this.y0 !== undefined ? this.y0 : 0;
	  this.long0 = this.long0 !== undefined ? this.long0 : 0;
	  this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

	  if (this.es) {
	    this.en = pj_enfn(this.es);
	    this.ml0 = pj_mlfn(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en);
	  }
	}

	/**
	    Transverse Mercator Forward  - long/lat to x/y
	    long/lat in radians
	  */
	function forward$2(p) {
	  var lon = p.x;
	  var lat = p.y;

	  var delta_lon = adjust_lon(lon - this.long0);
	  var con;
	  var x, y;
	  var sin_phi = Math.sin(lat);
	  var cos_phi = Math.cos(lat);

	  if (!this.es) {
	    var b = cos_phi * Math.sin(delta_lon);

	    if ((Math.abs(Math.abs(b) - 1)) < EPSLN) {
	      return (93);
	    }
	    else {
	      x = 0.5 * this.a * this.k0 * Math.log((1 + b) / (1 - b)) + this.x0;
	      y = cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - Math.pow(b, 2));
	      b = Math.abs(y);

	      if (b >= 1) {
	        if ((b - 1) > EPSLN) {
	          return (93);
	        }
	        else {
	          y = 0;
	        }
	      }
	      else {
	        y = Math.acos(y);
	      }

	      if (lat < 0) {
	        y = -y;
	      }

	      y = this.a * this.k0 * (y - this.lat0) + this.y0;
	    }
	  }
	  else {
	    var al = cos_phi * delta_lon;
	    var als = Math.pow(al, 2);
	    var c = this.ep2 * Math.pow(cos_phi, 2);
	    var cs = Math.pow(c, 2);
	    var tq = Math.abs(cos_phi) > EPSLN ? Math.tan(lat) : 0;
	    var t = Math.pow(tq, 2);
	    var ts = Math.pow(t, 2);
	    con = 1 - this.es * Math.pow(sin_phi, 2);
	    al = al / Math.sqrt(con);
	    var ml = pj_mlfn(lat, sin_phi, cos_phi, this.en);

	    x = this.a * (this.k0 * al * (1 +
	      als / 6 * (1 - t + c +
	      als / 20 * (5 - 18 * t + ts + 14 * c - 58 * t * c +
	      als / 42 * (61 + 179 * ts - ts * t - 479 * t))))) +
	      this.x0;

	    y = this.a * (this.k0 * (ml - this.ml0 +
	      sin_phi * delta_lon * al / 2 * (1 +
	      als / 12 * (5 - t + 9 * c + 4 * cs +
	      als / 30 * (61 + ts - 58 * t + 270 * c - 330 * t * c +
	      als / 56 * (1385 + 543 * ts - ts * t - 3111 * t)))))) +
	      this.y0;
	  }

	  p.x = x;
	  p.y = y;

	  return p;
	}

	/**
	    Transverse Mercator Inverse  -  x/y to long/lat
	  */
	function inverse$2(p) {
	  var con, phi;
	  var lat, lon;
	  var x = (p.x - this.x0) * (1 / this.a);
	  var y = (p.y - this.y0) * (1 / this.a);

	  if (!this.es) {
	    var f = Math.exp(x / this.k0);
	    var g = 0.5 * (f - 1 / f);
	    var temp = this.lat0 + y / this.k0;
	    var h = Math.cos(temp);
	    con = Math.sqrt((1 - Math.pow(h, 2)) / (1 + Math.pow(g, 2)));
	    lat = Math.asin(con);

	    if (y < 0) {
	      lat = -lat;
	    }

	    if ((g === 0) && (h === 0)) {
	      lon = 0;
	    }
	    else {
	      lon = adjust_lon(Math.atan2(g, h) + this.long0);
	    }
	  }
	  else { // ellipsoidal form
	    con = this.ml0 + y / this.k0;
	    phi = pj_inv_mlfn(con, this.es, this.en);

	    if (Math.abs(phi) < HALF_PI) {
	      var sin_phi = Math.sin(phi);
	      var cos_phi = Math.cos(phi);
	      var tan_phi = Math.abs(cos_phi) > EPSLN ? Math.tan(phi) : 0;
	      var c = this.ep2 * Math.pow(cos_phi, 2);
	      var cs = Math.pow(c, 2);
	      var t = Math.pow(tan_phi, 2);
	      var ts = Math.pow(t, 2);
	      con = 1 - this.es * Math.pow(sin_phi, 2);
	      var d = x * Math.sqrt(con) / this.k0;
	      var ds = Math.pow(d, 2);
	      con = con * tan_phi;

	      lat = phi - (con * ds / (1 - this.es)) * 0.5 * (1 -
	        ds / 12 * (5 + 3 * t - 9 * c * t + c - 4 * cs -
	        ds / 30 * (61 + 90 * t - 252 * c * t + 45 * ts + 46 * c -
	        ds / 56 * (1385 + 3633 * t + 4095 * ts + 1574 * ts * t))));

	      lon = adjust_lon(this.long0 + (d * (1 -
	        ds / 6 * (1 + 2 * t + c -
	        ds / 20 * (5 + 28 * t + 24 * ts + 8 * c * t + 6 * c -
	        ds / 42 * (61 + 662 * t + 1320 * ts + 720 * ts * t)))) / cos_phi));
	    }
	    else {
	      lat = HALF_PI * sign(y);
	      lon = 0;
	    }
	  }

	  p.x = lon;
	  p.y = lat;

	  return p;
	}

	var names$3 = ["Transverse_Mercator", "Transverse Mercator", "tmerc"];
	var tmerc = {
	  init: init$2,
	  forward: forward$2,
	  inverse: inverse$2,
	  names: names$3
	};

	var sinh = function(x) {
	  var r = Math.exp(x);
	  r = (r - 1 / r) / 2;
	  return r;
	};

	var hypot = function(x, y) {
	  x = Math.abs(x);
	  y = Math.abs(y);
	  var a = Math.max(x, y);
	  var b = Math.min(x, y) / (a ? a : 1);

	  return a * Math.sqrt(1 + Math.pow(b, 2));
	};

	var log1py = function(x) {
	  var y = 1 + x;
	  var z = y - 1;

	  return z === 0 ? x : x * Math.log(y) / z;
	};

	var asinhy = function(x) {
	  var y = Math.abs(x);
	  y = log1py(y * (1 + y / (hypot(1, y) + 1)));

	  return x < 0 ? -y : y;
	};

	var gatg = function(pp, B) {
	  var cos_2B = 2 * Math.cos(2 * B);
	  var i = pp.length - 1;
	  var h1 = pp[i];
	  var h2 = 0;
	  var h;

	  while (--i >= 0) {
	    h = -h2 + cos_2B * h1 + pp[i];
	    h2 = h1;
	    h1 = h;
	  }

	  return (B + h * Math.sin(2 * B));
	};

	var clens = function(pp, arg_r) {
	  var r = 2 * Math.cos(arg_r);
	  var i = pp.length - 1;
	  var hr1 = pp[i];
	  var hr2 = 0;
	  var hr;

	  while (--i >= 0) {
	    hr = -hr2 + r * hr1 + pp[i];
	    hr2 = hr1;
	    hr1 = hr;
	  }

	  return Math.sin(arg_r) * hr;
	};

	var cosh = function(x) {
	  var r = Math.exp(x);
	  r = (r + 1 / r) / 2;
	  return r;
	};

	var clens_cmplx = function(pp, arg_r, arg_i) {
	  var sin_arg_r = Math.sin(arg_r);
	  var cos_arg_r = Math.cos(arg_r);
	  var sinh_arg_i = sinh(arg_i);
	  var cosh_arg_i = cosh(arg_i);
	  var r = 2 * cos_arg_r * cosh_arg_i;
	  var i = -2 * sin_arg_r * sinh_arg_i;
	  var j = pp.length - 1;
	  var hr = pp[j];
	  var hi1 = 0;
	  var hr1 = 0;
	  var hi = 0;
	  var hr2;
	  var hi2;

	  while (--j >= 0) {
	    hr2 = hr1;
	    hi2 = hi1;
	    hr1 = hr;
	    hi1 = hi;
	    hr = -hr2 + r * hr1 - i * hi1 + pp[j];
	    hi = -hi2 + i * hr1 + r * hi1;
	  }

	  r = sin_arg_r * cosh_arg_i;
	  i = cos_arg_r * sinh_arg_i;

	  return [r * hr - i * hi, r * hi + i * hr];
	};

	// Heavily based on this etmerc projection implementation
	// https://github.com/mbloch/mapshaper-proj/blob/master/src/projections/etmerc.js

	function init$3() {
	  if (this.es === undefined || this.es <= 0) {
	    throw new Error('incorrect elliptical usage');
	  }

	  this.x0 = this.x0 !== undefined ? this.x0 : 0;
	  this.y0 = this.y0 !== undefined ? this.y0 : 0;
	  this.long0 = this.long0 !== undefined ? this.long0 : 0;
	  this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

	  this.cgb = [];
	  this.cbg = [];
	  this.utg = [];
	  this.gtu = [];

	  var f = this.es / (1 + Math.sqrt(1 - this.es));
	  var n = f / (2 - f);
	  var np = n;

	  this.cgb[0] = n * (2 + n * (-2 / 3 + n * (-2 + n * (116 / 45 + n * (26 / 45 + n * (-2854 / 675 ))))));
	  this.cbg[0] = n * (-2 + n * ( 2 / 3 + n * ( 4 / 3 + n * (-82 / 45 + n * (32 / 45 + n * (4642 / 4725))))));

	  np = np * n;
	  this.cgb[1] = np * (7 / 3 + n * (-8 / 5 + n * (-227 / 45 + n * (2704 / 315 + n * (2323 / 945)))));
	  this.cbg[1] = np * (5 / 3 + n * (-16 / 15 + n * ( -13 / 9 + n * (904 / 315 + n * (-1522 / 945)))));

	  np = np * n;
	  this.cgb[2] = np * (56 / 15 + n * (-136 / 35 + n * (-1262 / 105 + n * (73814 / 2835))));
	  this.cbg[2] = np * (-26 / 15 + n * (34 / 21 + n * (8 / 5 + n * (-12686 / 2835))));

	  np = np * n;
	  this.cgb[3] = np * (4279 / 630 + n * (-332 / 35 + n * (-399572 / 14175)));
	  this.cbg[3] = np * (1237 / 630 + n * (-12 / 5 + n * ( -24832 / 14175)));

	  np = np * n;
	  this.cgb[4] = np * (4174 / 315 + n * (-144838 / 6237));
	  this.cbg[4] = np * (-734 / 315 + n * (109598 / 31185));

	  np = np * n;
	  this.cgb[5] = np * (601676 / 22275);
	  this.cbg[5] = np * (444337 / 155925);

	  np = Math.pow(n, 2);
	  this.Qn = this.k0 / (1 + n) * (1 + np * (1 / 4 + np * (1 / 64 + np / 256)));

	  this.utg[0] = n * (-0.5 + n * ( 2 / 3 + n * (-37 / 96 + n * ( 1 / 360 + n * (81 / 512 + n * (-96199 / 604800))))));
	  this.gtu[0] = n * (0.5 + n * (-2 / 3 + n * (5 / 16 + n * (41 / 180 + n * (-127 / 288 + n * (7891 / 37800))))));

	  this.utg[1] = np * (-1 / 48 + n * (-1 / 15 + n * (437 / 1440 + n * (-46 / 105 + n * (1118711 / 3870720)))));
	  this.gtu[1] = np * (13 / 48 + n * (-3 / 5 + n * (557 / 1440 + n * (281 / 630 + n * (-1983433 / 1935360)))));

	  np = np * n;
	  this.utg[2] = np * (-17 / 480 + n * (37 / 840 + n * (209 / 4480 + n * (-5569 / 90720 ))));
	  this.gtu[2] = np * (61 / 240 + n * (-103 / 140 + n * (15061 / 26880 + n * (167603 / 181440))));

	  np = np * n;
	  this.utg[3] = np * (-4397 / 161280 + n * (11 / 504 + n * (830251 / 7257600)));
	  this.gtu[3] = np * (49561 / 161280 + n * (-179 / 168 + n * (6601661 / 7257600)));

	  np = np * n;
	  this.utg[4] = np * (-4583 / 161280 + n * (108847 / 3991680));
	  this.gtu[4] = np * (34729 / 80640 + n * (-3418889 / 1995840));

	  np = np * n;
	  this.utg[5] = np * (-20648693 / 638668800);
	  this.gtu[5] = np * (212378941 / 319334400);

	  var Z = gatg(this.cbg, this.lat0);
	  this.Zb = -this.Qn * (Z + clens(this.gtu, 2 * Z));
	}

	function forward$3(p) {
	  var Ce = adjust_lon(p.x - this.long0);
	  var Cn = p.y;

	  Cn = gatg(this.cbg, Cn);
	  var sin_Cn = Math.sin(Cn);
	  var cos_Cn = Math.cos(Cn);
	  var sin_Ce = Math.sin(Ce);
	  var cos_Ce = Math.cos(Ce);

	  Cn = Math.atan2(sin_Cn, cos_Ce * cos_Cn);
	  Ce = Math.atan2(sin_Ce * cos_Cn, hypot(sin_Cn, cos_Cn * cos_Ce));
	  Ce = asinhy(Math.tan(Ce));

	  var tmp = clens_cmplx(this.gtu, 2 * Cn, 2 * Ce);

	  Cn = Cn + tmp[0];
	  Ce = Ce + tmp[1];

	  var x;
	  var y;

	  if (Math.abs(Ce) <= 2.623395162778) {
	    x = this.a * (this.Qn * Ce) + this.x0;
	    y = this.a * (this.Qn * Cn + this.Zb) + this.y0;
	  }
	  else {
	    x = Infinity;
	    y = Infinity;
	  }

	  p.x = x;
	  p.y = y;

	  return p;
	}

	function inverse$3(p) {
	  var Ce = (p.x - this.x0) * (1 / this.a);
	  var Cn = (p.y - this.y0) * (1 / this.a);

	  Cn = (Cn - this.Zb) / this.Qn;
	  Ce = Ce / this.Qn;

	  var lon;
	  var lat;

	  if (Math.abs(Ce) <= 2.623395162778) {
	    var tmp = clens_cmplx(this.utg, 2 * Cn, 2 * Ce);

	    Cn = Cn + tmp[0];
	    Ce = Ce + tmp[1];
	    Ce = Math.atan(sinh(Ce));

	    var sin_Cn = Math.sin(Cn);
	    var cos_Cn = Math.cos(Cn);
	    var sin_Ce = Math.sin(Ce);
	    var cos_Ce = Math.cos(Ce);

	    Cn = Math.atan2(sin_Cn * cos_Ce, hypot(sin_Ce, cos_Ce * cos_Cn));
	    Ce = Math.atan2(sin_Ce, cos_Ce * cos_Cn);

	    lon = adjust_lon(Ce + this.long0);
	    lat = gatg(this.cgb, Cn);
	  }
	  else {
	    lon = Infinity;
	    lat = Infinity;
	  }

	  p.x = lon;
	  p.y = lat;

	  return p;
	}

	var names$4 = ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc"];
	var etmerc = {
	  init: init$3,
	  forward: forward$3,
	  inverse: inverse$3,
	  names: names$4
	};

	var adjust_zone = function(zone, lon) {
	  if (zone === undefined) {
	    zone = Math.floor((adjust_lon(lon) + Math.PI) * 30 / Math.PI) + 1;

	    if (zone < 0) {
	      return 0;
	    } else if (zone > 60) {
	      return 60;
	    }
	  }
	  return zone;
	};

	var dependsOn = 'etmerc';
	function init$4() {
	  var zone = adjust_zone(this.zone, this.long0);
	  if (zone === undefined) {
	    throw new Error('unknown utm zone');
	  }
	  this.lat0 = 0;
	  this.long0 =  ((6 * Math.abs(zone)) - 183) * D2R;
	  this.x0 = 500000;
	  this.y0 = this.utmSouth ? 10000000 : 0;
	  this.k0 = 0.9996;

	  etmerc.init.apply(this);
	  this.forward = etmerc.forward;
	  this.inverse = etmerc.inverse;
	}

	var names$5 = ["Universal Transverse Mercator System", "utm"];
	var utm = {
	  init: init$4,
	  names: names$5,
	  dependsOn: dependsOn
	};

	var srat = function(esinp, exp) {
	  return (Math.pow((1 - esinp) / (1 + esinp), exp));
	};

	var MAX_ITER$1 = 20;
	function init$6() {
	  var sphi = Math.sin(this.lat0);
	  var cphi = Math.cos(this.lat0);
	  cphi *= cphi;
	  this.rc = Math.sqrt(1 - this.es) / (1 - this.es * sphi * sphi);
	  this.C = Math.sqrt(1 + this.es * cphi * cphi / (1 - this.es));
	  this.phic0 = Math.asin(sphi / this.C);
	  this.ratexp = 0.5 * this.C * this.e;
	  this.K = Math.tan(0.5 * this.phic0 + FORTPI) / (Math.pow(Math.tan(0.5 * this.lat0 + FORTPI), this.C) * srat(this.e * sphi, this.ratexp));
	}

	function forward$5(p) {
	  var lon = p.x;
	  var lat = p.y;

	  p.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * lat + FORTPI), this.C) * srat(this.e * Math.sin(lat), this.ratexp)) - HALF_PI;
	  p.x = this.C * lon;
	  return p;
	}

	function inverse$5(p) {
	  var DEL_TOL = 1e-14;
	  var lon = p.x / this.C;
	  var lat = p.y;
	  var num = Math.pow(Math.tan(0.5 * lat + FORTPI) / this.K, 1 / this.C);
	  for (var i = MAX_ITER$1; i > 0; --i) {
	    lat = 2 * Math.atan(num * srat(this.e * Math.sin(p.y), - 0.5 * this.e)) - HALF_PI;
	    if (Math.abs(lat - p.y) < DEL_TOL) {
	      break;
	    }
	    p.y = lat;
	  }
	  /* convergence failed */
	  if (!i) {
	    return null;
	  }
	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$7 = ["gauss"];
	var gauss = {
	  init: init$6,
	  forward: forward$5,
	  inverse: inverse$5,
	  names: names$7
	};

	function init$5() {
	  gauss.init.apply(this);
	  if (!this.rc) {
	    return;
	  }
	  this.sinc0 = Math.sin(this.phic0);
	  this.cosc0 = Math.cos(this.phic0);
	  this.R2 = 2 * this.rc;
	  if (!this.title) {
	    this.title = "Oblique Stereographic Alternative";
	  }
	}

	function forward$4(p) {
	  var sinc, cosc, cosl, k;
	  p.x = adjust_lon(p.x - this.long0);
	  gauss.forward.apply(this, [p]);
	  sinc = Math.sin(p.y);
	  cosc = Math.cos(p.y);
	  cosl = Math.cos(p.x);
	  k = this.k0 * this.R2 / (1 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
	  p.x = k * cosc * Math.sin(p.x);
	  p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
	  p.x = this.a * p.x + this.x0;
	  p.y = this.a * p.y + this.y0;
	  return p;
	}

	function inverse$4(p) {
	  var sinc, cosc, lon, lat, rho;
	  p.x = (p.x - this.x0) / this.a;
	  p.y = (p.y - this.y0) / this.a;

	  p.x /= this.k0;
	  p.y /= this.k0;
	  if ((rho = Math.sqrt(p.x * p.x + p.y * p.y))) {
	    var c = 2 * Math.atan2(rho, this.R2);
	    sinc = Math.sin(c);
	    cosc = Math.cos(c);
	    lat = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
	    lon = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
	  }
	  else {
	    lat = this.phic0;
	    lon = 0;
	  }

	  p.x = lon;
	  p.y = lat;
	  gauss.inverse.apply(this, [p]);
	  p.x = adjust_lon(p.x + this.long0);
	  return p;
	}

	var names$6 = ["Stereographic_North_Pole", "Oblique_Stereographic", "Polar_Stereographic", "sterea","Oblique Stereographic Alternative"];
	var sterea = {
	  init: init$5,
	  forward: forward$4,
	  inverse: inverse$4,
	  names: names$6
	};

	function ssfn_(phit, sinphi, eccen) {
	  sinphi *= eccen;
	  return (Math.tan(0.5 * (HALF_PI + phit)) * Math.pow((1 - sinphi) / (1 + sinphi), 0.5 * eccen));
	}

	function init$7() {
	  this.coslat0 = Math.cos(this.lat0);
	  this.sinlat0 = Math.sin(this.lat0);
	  if (this.sphere) {
	    if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
	      this.k0 = 0.5 * (1 + sign(this.lat0) * Math.sin(this.lat_ts));
	    }
	  }
	  else {
	    if (Math.abs(this.coslat0) <= EPSLN) {
	      if (this.lat0 > 0) {
	        //North pole
	        //trace('stere:north pole');
	        this.con = 1;
	      }
	      else {
	        //South pole
	        //trace('stere:south pole');
	        this.con = -1;
	      }
	    }
	    this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e));
	    if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
	      this.k0 = 0.5 * this.cons * msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / tsfnz(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts));
	    }
	    this.ms1 = msfnz(this.e, this.sinlat0, this.coslat0);
	    this.X0 = 2 * Math.atan(this.ssfn_(this.lat0, this.sinlat0, this.e)) - HALF_PI;
	    this.cosX0 = Math.cos(this.X0);
	    this.sinX0 = Math.sin(this.X0);
	  }
	}

	// Stereographic forward equations--mapping lat,long to x,y
	function forward$6(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var sinlat = Math.sin(lat);
	  var coslat = Math.cos(lat);
	  var A, X, sinX, cosX, ts, rh;
	  var dlon = adjust_lon(lon - this.long0);

	  if (Math.abs(Math.abs(lon - this.long0) - Math.PI) <= EPSLN && Math.abs(lat + this.lat0) <= EPSLN) {
	    //case of the origine point
	    //trace('stere:this is the origin point');
	    p.x = NaN;
	    p.y = NaN;
	    return p;
	  }
	  if (this.sphere) {
	    //trace('stere:sphere case');
	    A = 2 * this.k0 / (1 + this.sinlat0 * sinlat + this.coslat0 * coslat * Math.cos(dlon));
	    p.x = this.a * A * coslat * Math.sin(dlon) + this.x0;
	    p.y = this.a * A * (this.coslat0 * sinlat - this.sinlat0 * coslat * Math.cos(dlon)) + this.y0;
	    return p;
	  }
	  else {
	    X = 2 * Math.atan(this.ssfn_(lat, sinlat, this.e)) - HALF_PI;
	    cosX = Math.cos(X);
	    sinX = Math.sin(X);
	    if (Math.abs(this.coslat0) <= EPSLN) {
	      ts = tsfnz(this.e, lat * this.con, this.con * sinlat);
	      rh = 2 * this.a * this.k0 * ts / this.cons;
	      p.x = this.x0 + rh * Math.sin(lon - this.long0);
	      p.y = this.y0 - this.con * rh * Math.cos(lon - this.long0);
	      //trace(p.toString());
	      return p;
	    }
	    else if (Math.abs(this.sinlat0) < EPSLN) {
	      //Eq
	      //trace('stere:equateur');
	      A = 2 * this.a * this.k0 / (1 + cosX * Math.cos(dlon));
	      p.y = A * sinX;
	    }
	    else {
	      //other case
	      //trace('stere:normal case');
	      A = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * sinX + this.cosX0 * cosX * Math.cos(dlon)));
	      p.y = A * (this.cosX0 * sinX - this.sinX0 * cosX * Math.cos(dlon)) + this.y0;
	    }
	    p.x = A * cosX * Math.sin(dlon) + this.x0;
	  }
	  //trace(p.toString());
	  return p;
	}

	//* Stereographic inverse equations--mapping x,y to lat/long
	function inverse$6(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;
	  var lon, lat, ts, ce, Chi;
	  var rh = Math.sqrt(p.x * p.x + p.y * p.y);
	  if (this.sphere) {
	    var c = 2 * Math.atan(rh / (0.5 * this.a * this.k0));
	    lon = this.long0;
	    lat = this.lat0;
	    if (rh <= EPSLN) {
	      p.x = lon;
	      p.y = lat;
	      return p;
	    }
	    lat = Math.asin(Math.cos(c) * this.sinlat0 + p.y * Math.sin(c) * this.coslat0 / rh);
	    if (Math.abs(this.coslat0) < EPSLN) {
	      if (this.lat0 > 0) {
	        lon = adjust_lon(this.long0 + Math.atan2(p.x, - 1 * p.y));
	      }
	      else {
	        lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
	      }
	    }
	    else {
	      lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(c), rh * this.coslat0 * Math.cos(c) - p.y * this.sinlat0 * Math.sin(c)));
	    }
	    p.x = lon;
	    p.y = lat;
	    return p;
	  }
	  else {
	    if (Math.abs(this.coslat0) <= EPSLN) {
	      if (rh <= EPSLN) {
	        lat = this.lat0;
	        lon = this.long0;
	        p.x = lon;
	        p.y = lat;
	        //trace(p.toString());
	        return p;
	      }
	      p.x *= this.con;
	      p.y *= this.con;
	      ts = rh * this.cons / (2 * this.a * this.k0);
	      lat = this.con * phi2z(this.e, ts);
	      lon = this.con * adjust_lon(this.con * this.long0 + Math.atan2(p.x, - 1 * p.y));
	    }
	    else {
	      ce = 2 * Math.atan(rh * this.cosX0 / (2 * this.a * this.k0 * this.ms1));
	      lon = this.long0;
	      if (rh <= EPSLN) {
	        Chi = this.X0;
	      }
	      else {
	        Chi = Math.asin(Math.cos(ce) * this.sinX0 + p.y * Math.sin(ce) * this.cosX0 / rh);
	        lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(ce), rh * this.cosX0 * Math.cos(ce) - p.y * this.sinX0 * Math.sin(ce)));
	      }
	      lat = -1 * phi2z(this.e, Math.tan(0.5 * (HALF_PI + Chi)));
	    }
	  }
	  p.x = lon;
	  p.y = lat;

	  //trace(p.toString());
	  return p;

	}

	var names$8 = ["stere", "Stereographic_South_Pole", "Polar Stereographic (variant B)"];
	var stere = {
	  init: init$7,
	  forward: forward$6,
	  inverse: inverse$6,
	  names: names$8,
	  ssfn_: ssfn_
	};

	/*
	  references:
	    Formules et constantes pour le Calcul pour la
	    projection cylindrique conforme à axe oblique et pour la transformation entre
	    des systèmes de référence.
	    http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/topics/survey/sys/refsys/switzerland.parsysrelated1.31216.downloadList.77004.DownloadFile.tmp/swissprojectionfr.pdf
	  */

	function init$8() {
	  var phy0 = this.lat0;
	  this.lambda0 = this.long0;
	  var sinPhy0 = Math.sin(phy0);
	  var semiMajorAxis = this.a;
	  var invF = this.rf;
	  var flattening = 1 / invF;
	  var e2 = 2 * flattening - Math.pow(flattening, 2);
	  var e = this.e = Math.sqrt(e2);
	  this.R = this.k0 * semiMajorAxis * Math.sqrt(1 - e2) / (1 - e2 * Math.pow(sinPhy0, 2));
	  this.alpha = Math.sqrt(1 + e2 / (1 - e2) * Math.pow(Math.cos(phy0), 4));
	  this.b0 = Math.asin(sinPhy0 / this.alpha);
	  var k1 = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2));
	  var k2 = Math.log(Math.tan(Math.PI / 4 + phy0 / 2));
	  var k3 = Math.log((1 + e * sinPhy0) / (1 - e * sinPhy0));
	  this.K = k1 - this.alpha * k2 + this.alpha * e / 2 * k3;
	}

	function forward$7(p) {
	  var Sa1 = Math.log(Math.tan(Math.PI / 4 - p.y / 2));
	  var Sa2 = this.e / 2 * Math.log((1 + this.e * Math.sin(p.y)) / (1 - this.e * Math.sin(p.y)));
	  var S = -this.alpha * (Sa1 + Sa2) + this.K;

	  // spheric latitude
	  var b = 2 * (Math.atan(Math.exp(S)) - Math.PI / 4);

	  // spheric longitude
	  var I = this.alpha * (p.x - this.lambda0);

	  // psoeudo equatorial rotation
	  var rotI = Math.atan(Math.sin(I) / (Math.sin(this.b0) * Math.tan(b) + Math.cos(this.b0) * Math.cos(I)));

	  var rotB = Math.asin(Math.cos(this.b0) * Math.sin(b) - Math.sin(this.b0) * Math.cos(b) * Math.cos(I));

	  p.y = this.R / 2 * Math.log((1 + Math.sin(rotB)) / (1 - Math.sin(rotB))) + this.y0;
	  p.x = this.R * rotI + this.x0;
	  return p;
	}

	function inverse$7(p) {
	  var Y = p.x - this.x0;
	  var X = p.y - this.y0;

	  var rotI = Y / this.R;
	  var rotB = 2 * (Math.atan(Math.exp(X / this.R)) - Math.PI / 4);

	  var b = Math.asin(Math.cos(this.b0) * Math.sin(rotB) + Math.sin(this.b0) * Math.cos(rotB) * Math.cos(rotI));
	  var I = Math.atan(Math.sin(rotI) / (Math.cos(this.b0) * Math.cos(rotI) - Math.sin(this.b0) * Math.tan(rotB)));

	  var lambda = this.lambda0 + I / this.alpha;

	  var S = 0;
	  var phy = b;
	  var prevPhy = -1000;
	  var iteration = 0;
	  while (Math.abs(phy - prevPhy) > 0.0000001) {
	    if (++iteration > 20) {
	      //...reportError("omercFwdInfinity");
	      return;
	    }
	    //S = Math.log(Math.tan(Math.PI / 4 + phy / 2));
	    S = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + b / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(phy)) / 2));
	    prevPhy = phy;
	    phy = 2 * Math.atan(Math.exp(S)) - Math.PI / 2;
	  }

	  p.x = lambda;
	  p.y = phy;
	  return p;
	}

	var names$9 = ["somerc"];
	var somerc = {
	  init: init$8,
	  forward: forward$7,
	  inverse: inverse$7,
	  names: names$9
	};

	/* Initialize the Oblique Mercator  projection
	    ------------------------------------------*/
	function init$9() {
	  this.no_off = this.no_off || false;
	  this.no_rot = this.no_rot || false;

	  if (isNaN(this.k0)) {
	    this.k0 = 1;
	  }
	  var sinlat = Math.sin(this.lat0);
	  var coslat = Math.cos(this.lat0);
	  var con = this.e * sinlat;

	  this.bl = Math.sqrt(1 + this.es / (1 - this.es) * Math.pow(coslat, 4));
	  this.al = this.a * this.bl * this.k0 * Math.sqrt(1 - this.es) / (1 - con * con);
	  var t0 = tsfnz(this.e, this.lat0, sinlat);
	  var dl = this.bl / coslat * Math.sqrt((1 - this.es) / (1 - con * con));
	  if (dl * dl < 1) {
	    dl = 1;
	  }
	  var fl;
	  var gl;
	  if (!isNaN(this.longc)) {
	    //Central point and azimuth method

	    if (this.lat0 >= 0) {
	      fl = dl + Math.sqrt(dl * dl - 1);
	    }
	    else {
	      fl = dl - Math.sqrt(dl * dl - 1);
	    }
	    this.el = fl * Math.pow(t0, this.bl);
	    gl = 0.5 * (fl - 1 / fl);
	    this.gamma0 = Math.asin(Math.sin(this.alpha) / dl);
	    this.long0 = this.longc - Math.asin(gl * Math.tan(this.gamma0)) / this.bl;

	  }
	  else {
	    //2 points method
	    var t1 = tsfnz(this.e, this.lat1, Math.sin(this.lat1));
	    var t2 = tsfnz(this.e, this.lat2, Math.sin(this.lat2));
	    if (this.lat0 >= 0) {
	      this.el = (dl + Math.sqrt(dl * dl - 1)) * Math.pow(t0, this.bl);
	    }
	    else {
	      this.el = (dl - Math.sqrt(dl * dl - 1)) * Math.pow(t0, this.bl);
	    }
	    var hl = Math.pow(t1, this.bl);
	    var ll = Math.pow(t2, this.bl);
	    fl = this.el / hl;
	    gl = 0.5 * (fl - 1 / fl);
	    var jl = (this.el * this.el - ll * hl) / (this.el * this.el + ll * hl);
	    var pl = (ll - hl) / (ll + hl);
	    var dlon12 = adjust_lon(this.long1 - this.long2);
	    this.long0 = 0.5 * (this.long1 + this.long2) - Math.atan(jl * Math.tan(0.5 * this.bl * (dlon12)) / pl) / this.bl;
	    this.long0 = adjust_lon(this.long0);
	    var dlon10 = adjust_lon(this.long1 - this.long0);
	    this.gamma0 = Math.atan(Math.sin(this.bl * (dlon10)) / gl);
	    this.alpha = Math.asin(dl * Math.sin(this.gamma0));
	  }

	  if (this.no_off) {
	    this.uc = 0;
	  }
	  else {
	    if (this.lat0 >= 0) {
	      this.uc = this.al / this.bl * Math.atan2(Math.sqrt(dl * dl - 1), Math.cos(this.alpha));
	    }
	    else {
	      this.uc = -1 * this.al / this.bl * Math.atan2(Math.sqrt(dl * dl - 1), Math.cos(this.alpha));
	    }
	  }

	}

	/* Oblique Mercator forward equations--mapping lat,long to x,y
	    ----------------------------------------------------------*/
	function forward$8(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var dlon = adjust_lon(lon - this.long0);
	  var us, vs;
	  var con;
	  if (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
	    if (lat > 0) {
	      con = -1;
	    }
	    else {
	      con = 1;
	    }
	    vs = this.al / this.bl * Math.log(Math.tan(FORTPI + con * this.gamma0 * 0.5));
	    us = -1 * con * HALF_PI * this.al / this.bl;
	  }
	  else {
	    var t = tsfnz(this.e, lat, Math.sin(lat));
	    var ql = this.el / Math.pow(t, this.bl);
	    var sl = 0.5 * (ql - 1 / ql);
	    var tl = 0.5 * (ql + 1 / ql);
	    var vl = Math.sin(this.bl * (dlon));
	    var ul = (sl * Math.sin(this.gamma0) - vl * Math.cos(this.gamma0)) / tl;
	    if (Math.abs(Math.abs(ul) - 1) <= EPSLN) {
	      vs = Number.POSITIVE_INFINITY;
	    }
	    else {
	      vs = 0.5 * this.al * Math.log((1 - ul) / (1 + ul)) / this.bl;
	    }
	    if (Math.abs(Math.cos(this.bl * (dlon))) <= EPSLN) {
	      us = this.al * this.bl * (dlon);
	    }
	    else {
	      us = this.al * Math.atan2(sl * Math.cos(this.gamma0) + vl * Math.sin(this.gamma0), Math.cos(this.bl * dlon)) / this.bl;
	    }
	  }

	  if (this.no_rot) {
	    p.x = this.x0 + us;
	    p.y = this.y0 + vs;
	  }
	  else {

	    us -= this.uc;
	    p.x = this.x0 + vs * Math.cos(this.alpha) + us * Math.sin(this.alpha);
	    p.y = this.y0 + us * Math.cos(this.alpha) - vs * Math.sin(this.alpha);
	  }
	  return p;
	}

	function inverse$8(p) {
	  var us, vs;
	  if (this.no_rot) {
	    vs = p.y - this.y0;
	    us = p.x - this.x0;
	  }
	  else {
	    vs = (p.x - this.x0) * Math.cos(this.alpha) - (p.y - this.y0) * Math.sin(this.alpha);
	    us = (p.y - this.y0) * Math.cos(this.alpha) + (p.x - this.x0) * Math.sin(this.alpha);
	    us += this.uc;
	  }
	  var qp = Math.exp(-1 * this.bl * vs / this.al);
	  var sp = 0.5 * (qp - 1 / qp);
	  var tp = 0.5 * (qp + 1 / qp);
	  var vp = Math.sin(this.bl * us / this.al);
	  var up = (vp * Math.cos(this.gamma0) + sp * Math.sin(this.gamma0)) / tp;
	  var ts = Math.pow(this.el / Math.sqrt((1 + up) / (1 - up)), 1 / this.bl);
	  if (Math.abs(up - 1) < EPSLN) {
	    p.x = this.long0;
	    p.y = HALF_PI;
	  }
	  else if (Math.abs(up + 1) < EPSLN) {
	    p.x = this.long0;
	    p.y = -1 * HALF_PI;
	  }
	  else {
	    p.y = phi2z(this.e, ts);
	    p.x = adjust_lon(this.long0 - Math.atan2(sp * Math.cos(this.gamma0) - vp * Math.sin(this.gamma0), Math.cos(this.bl * us / this.al)) / this.bl);
	  }
	  return p;
	}

	var names$10 = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "omerc"];
	var omerc = {
	  init: init$9,
	  forward: forward$8,
	  inverse: inverse$8,
	  names: names$10
	};

	function init$10() {

	  // array of:  r_maj,r_min,lat1,lat2,c_lon,c_lat,false_east,false_north
	  //double c_lat;                   /* center latitude                      */
	  //double c_lon;                   /* center longitude                     */
	  //double lat1;                    /* first standard parallel              */
	  //double lat2;                    /* second standard parallel             */
	  //double r_maj;                   /* major axis                           */
	  //double r_min;                   /* minor axis                           */
	  //double false_east;              /* x offset in meters                   */
	  //double false_north;             /* y offset in meters                   */

	  if (!this.lat2) {
	    this.lat2 = this.lat1;
	  } //if lat2 is not defined
	  if (!this.k0) {
	    this.k0 = 1;
	  }
	  this.x0 = this.x0 || 0;
	  this.y0 = this.y0 || 0;
	  // Standard Parallels cannot be equal and on opposite sides of the equator
	  if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
	    return;
	  }

	  var temp = this.b / this.a;
	  this.e = Math.sqrt(1 - temp * temp);

	  var sin1 = Math.sin(this.lat1);
	  var cos1 = Math.cos(this.lat1);
	  var ms1 = msfnz(this.e, sin1, cos1);
	  var ts1 = tsfnz(this.e, this.lat1, sin1);

	  var sin2 = Math.sin(this.lat2);
	  var cos2 = Math.cos(this.lat2);
	  var ms2 = msfnz(this.e, sin2, cos2);
	  var ts2 = tsfnz(this.e, this.lat2, sin2);

	  var ts0 = tsfnz(this.e, this.lat0, Math.sin(this.lat0));

	  if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
	    this.ns = Math.log(ms1 / ms2) / Math.log(ts1 / ts2);
	  }
	  else {
	    this.ns = sin1;
	  }
	  if (isNaN(this.ns)) {
	    this.ns = sin1;
	  }
	  this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
	  this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);
	  if (!this.title) {
	    this.title = "Lambert Conformal Conic";
	  }
	}

	// Lambert Conformal conic forward equations--mapping lat,long to x,y
	// -----------------------------------------------------------------
	function forward$9(p) {

	  var lon = p.x;
	  var lat = p.y;

	  // singular cases :
	  if (Math.abs(2 * Math.abs(lat) - Math.PI) <= EPSLN) {
	    lat = sign(lat) * (HALF_PI - 2 * EPSLN);
	  }

	  var con = Math.abs(Math.abs(lat) - HALF_PI);
	  var ts, rh1;
	  if (con > EPSLN) {
	    ts = tsfnz(this.e, lat, Math.sin(lat));
	    rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
	  }
	  else {
	    con = lat * this.ns;
	    if (con <= 0) {
	      return null;
	    }
	    rh1 = 0;
	  }
	  var theta = this.ns * adjust_lon(lon - this.long0);
	  p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
	  p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;

	  return p;
	}

	// Lambert Conformal Conic inverse equations--mapping x,y to lat/long
	// -----------------------------------------------------------------
	function inverse$9(p) {

	  var rh1, con, ts;
	  var lat, lon;
	  var x = (p.x - this.x0) / this.k0;
	  var y = (this.rh - (p.y - this.y0) / this.k0);
	  if (this.ns > 0) {
	    rh1 = Math.sqrt(x * x + y * y);
	    con = 1;
	  }
	  else {
	    rh1 = -Math.sqrt(x * x + y * y);
	    con = -1;
	  }
	  var theta = 0;
	  if (rh1 !== 0) {
	    theta = Math.atan2((con * x), (con * y));
	  }
	  if ((rh1 !== 0) || (this.ns > 0)) {
	    con = 1 / this.ns;
	    ts = Math.pow((rh1 / (this.a * this.f0)), con);
	    lat = phi2z(this.e, ts);
	    if (lat === -9999) {
	      return null;
	    }
	  }
	  else {
	    lat = -HALF_PI;
	  }
	  lon = adjust_lon(theta / this.ns + this.long0);

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$11 = ["Lambert Tangential Conformal Conic Projection", "Lambert_Conformal_Conic", "Lambert_Conformal_Conic_2SP", "lcc"];
	var lcc = {
	  init: init$10,
	  forward: forward$9,
	  inverse: inverse$9,
	  names: names$11
	};

	function init$11() {
	  this.a = 6377397.155;
	  this.es = 0.006674372230614;
	  this.e = Math.sqrt(this.es);
	  if (!this.lat0) {
	    this.lat0 = 0.863937979737193;
	  }
	  if (!this.long0) {
	    this.long0 = 0.7417649320975901 - 0.308341501185665;
	  }
	  /* if scale not set default to 0.9999 */
	  if (!this.k0) {
	    this.k0 = 0.9999;
	  }
	  this.s45 = 0.785398163397448; /* 45 */
	  this.s90 = 2 * this.s45;
	  this.fi0 = this.lat0;
	  this.e2 = this.es;
	  this.e = Math.sqrt(this.e2);
	  this.alfa = Math.sqrt(1 + (this.e2 * Math.pow(Math.cos(this.fi0), 4)) / (1 - this.e2));
	  this.uq = 1.04216856380474;
	  this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa);
	  this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2);
	  this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g;
	  this.k1 = this.k0;
	  this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2));
	  this.s0 = 1.37008346281555;
	  this.n = Math.sin(this.s0);
	  this.ro0 = this.k1 * this.n0 / Math.tan(this.s0);
	  this.ad = this.s90 - this.uq;
	}

	/* ellipsoid */
	/* calculate xy from lat/lon */
	/* Constants, identical to inverse transform function */
	function forward$10(p) {
	  var gfi, u, deltav, s, d, eps, ro;
	  var lon = p.x;
	  var lat = p.y;
	  var delta_lon = adjust_lon(lon - this.long0);
	  /* Transformation */
	  gfi = Math.pow(((1 + this.e * Math.sin(lat)) / (1 - this.e * Math.sin(lat))), (this.alfa * this.e / 2));
	  u = 2 * (Math.atan(this.k * Math.pow(Math.tan(lat / 2 + this.s45), this.alfa) / gfi) - this.s45);
	  deltav = -delta_lon * this.alfa;
	  s = Math.asin(Math.cos(this.ad) * Math.sin(u) + Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));
	  d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
	  eps = this.n * d;
	  ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(s / 2 + this.s45), this.n);
	  p.y = ro * Math.cos(eps) / 1;
	  p.x = ro * Math.sin(eps) / 1;

	  if (!this.czech) {
	    p.y *= -1;
	    p.x *= -1;
	  }
	  return (p);
	}

	/* calculate lat/lon from xy */
	function inverse$10(p) {
	  var u, deltav, s, d, eps, ro, fi1;
	  var ok;

	  /* Transformation */
	  /* revert y, x*/
	  var tmp = p.x;
	  p.x = p.y;
	  p.y = tmp;
	  if (!this.czech) {
	    p.y *= -1;
	    p.x *= -1;
	  }
	  ro = Math.sqrt(p.x * p.x + p.y * p.y);
	  eps = Math.atan2(p.y, p.x);
	  d = eps / Math.sin(this.s0);
	  s = 2 * (Math.atan(Math.pow(this.ro0 / ro, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45);
	  u = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(d));
	  deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
	  p.x = this.long0 - deltav / this.alfa;
	  fi1 = u;
	  ok = 0;
	  var iter = 0;
	  do {
	    p.y = 2 * (Math.atan(Math.pow(this.k, - 1 / this.alfa) * Math.pow(Math.tan(u / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(fi1)) / (1 - this.e * Math.sin(fi1)), this.e / 2)) - this.s45);
	    if (Math.abs(fi1 - p.y) < 0.0000000001) {
	      ok = 1;
	    }
	    fi1 = p.y;
	    iter += 1;
	  } while (ok === 0 && iter < 15);
	  if (iter >= 15) {
	    return null;
	  }

	  return (p);
	}

	var names$12 = ["Krovak", "krovak"];
	var krovak = {
	  init: init$11,
	  forward: forward$10,
	  inverse: inverse$10,
	  names: names$12
	};

	var mlfn = function(e0, e1, e2, e3, phi) {
	  return (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi));
	};

	var e0fn = function(x) {
	  return (1 - 0.25 * x * (1 + x / 16 * (3 + 1.25 * x)));
	};

	var e1fn = function(x) {
	  return (0.375 * x * (1 + 0.25 * x * (1 + 0.46875 * x)));
	};

	var e2fn = function(x) {
	  return (0.05859375 * x * x * (1 + 0.75 * x));
	};

	var e3fn = function(x) {
	  return (x * x * x * (35 / 3072));
	};

	var gN = function(a, e, sinphi) {
	  var temp = e * sinphi;
	  return a / Math.sqrt(1 - temp * temp);
	};

	var adjust_lat = function(x) {
	  return (Math.abs(x) < HALF_PI) ? x : (x - (sign(x) * Math.PI));
	};

	var imlfn = function(ml, e0, e1, e2, e3) {
	  var phi;
	  var dphi;

	  phi = ml / e0;
	  for (var i = 0; i < 15; i++) {
	    dphi = (ml - (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi))) / (e0 - 2 * e1 * Math.cos(2 * phi) + 4 * e2 * Math.cos(4 * phi) - 6 * e3 * Math.cos(6 * phi));
	    phi += dphi;
	    if (Math.abs(dphi) <= 0.0000000001) {
	      return phi;
	    }
	  }

	  //..reportError("IMLFN-CONV:Latitude failed to converge after 15 iterations");
	  return NaN;
	};

	function init$12() {
	  if (!this.sphere) {
	    this.e0 = e0fn(this.es);
	    this.e1 = e1fn(this.es);
	    this.e2 = e2fn(this.es);
	    this.e3 = e3fn(this.es);
	    this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
	  }
	}

	/* Cassini forward equations--mapping lat,long to x,y
	  -----------------------------------------------------------------------*/
	function forward$11(p) {

	  /* Forward equations
	      -----------------*/
	  var x, y;
	  var lam = p.x;
	  var phi = p.y;
	  lam = adjust_lon(lam - this.long0);

	  if (this.sphere) {
	    x = this.a * Math.asin(Math.cos(phi) * Math.sin(lam));
	    y = this.a * (Math.atan2(Math.tan(phi), Math.cos(lam)) - this.lat0);
	  }
	  else {
	    //ellipsoid
	    var sinphi = Math.sin(phi);
	    var cosphi = Math.cos(phi);
	    var nl = gN(this.a, this.e, sinphi);
	    var tl = Math.tan(phi) * Math.tan(phi);
	    var al = lam * Math.cos(phi);
	    var asq = al * al;
	    var cl = this.es * cosphi * cosphi / (1 - this.es);
	    var ml = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);

	    x = nl * al * (1 - asq * tl * (1 / 6 - (8 - tl + 8 * cl) * asq / 120));
	    y = ml - this.ml0 + nl * sinphi / cosphi * asq * (0.5 + (5 - tl + 6 * cl) * asq / 24);


	  }

	  p.x = x + this.x0;
	  p.y = y + this.y0;
	  return p;
	}

	/* Inverse equations
	  -----------------*/
	function inverse$11(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;
	  var x = p.x / this.a;
	  var y = p.y / this.a;
	  var phi, lam;

	  if (this.sphere) {
	    var dd = y + this.lat0;
	    phi = Math.asin(Math.sin(dd) * Math.cos(x));
	    lam = Math.atan2(Math.tan(x), Math.cos(dd));
	  }
	  else {
	    /* ellipsoid */
	    var ml1 = this.ml0 / this.a + y;
	    var phi1 = imlfn(ml1, this.e0, this.e1, this.e2, this.e3);
	    if (Math.abs(Math.abs(phi1) - HALF_PI) <= EPSLN) {
	      p.x = this.long0;
	      p.y = HALF_PI;
	      if (y < 0) {
	        p.y *= -1;
	      }
	      return p;
	    }
	    var nl1 = gN(this.a, this.e, Math.sin(phi1));

	    var rl1 = nl1 * nl1 * nl1 / this.a / this.a * (1 - this.es);
	    var tl1 = Math.pow(Math.tan(phi1), 2);
	    var dl = x * this.a / nl1;
	    var dsq = dl * dl;
	    phi = phi1 - nl1 * Math.tan(phi1) / rl1 * dl * dl * (0.5 - (1 + 3 * tl1) * dl * dl / 24);
	    lam = dl * (1 - dsq * (tl1 / 3 + (1 + 3 * tl1) * tl1 * dsq / 15)) / Math.cos(phi1);

	  }

	  p.x = adjust_lon(lam + this.long0);
	  p.y = adjust_lat(phi);
	  return p;

	}

	var names$13 = ["Cassini", "Cassini_Soldner", "cass"];
	var cass = {
	  init: init$12,
	  forward: forward$11,
	  inverse: inverse$11,
	  names: names$13
	};

	var qsfnz = function(eccent, sinphi) {
	  var con;
	  if (eccent > 1.0e-7) {
	    con = eccent * sinphi;
	    return ((1 - eccent * eccent) * (sinphi / (1 - con * con) - (0.5 / eccent) * Math.log((1 - con) / (1 + con))));
	  }
	  else {
	    return (2 * sinphi);
	  }
	};

	/*
	  reference
	    "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
	    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
	  */

	var S_POLE = 1;

	var N_POLE = 2;
	var EQUIT = 3;
	var OBLIQ = 4;

	/* Initialize the Lambert Azimuthal Equal Area projection
	  ------------------------------------------------------*/
	function init$13() {
	  var t = Math.abs(this.lat0);
	  if (Math.abs(t - HALF_PI) < EPSLN) {
	    this.mode = this.lat0 < 0 ? this.S_POLE : this.N_POLE;
	  }
	  else if (Math.abs(t) < EPSLN) {
	    this.mode = this.EQUIT;
	  }
	  else {
	    this.mode = this.OBLIQ;
	  }
	  if (this.es > 0) {
	    var sinphi;

	    this.qp = qsfnz(this.e, 1);
	    this.mmf = 0.5 / (1 - this.es);
	    this.apa = authset(this.es);
	    switch (this.mode) {
	    case this.N_POLE:
	      this.dd = 1;
	      break;
	    case this.S_POLE:
	      this.dd = 1;
	      break;
	    case this.EQUIT:
	      this.rq = Math.sqrt(0.5 * this.qp);
	      this.dd = 1 / this.rq;
	      this.xmf = 1;
	      this.ymf = 0.5 * this.qp;
	      break;
	    case this.OBLIQ:
	      this.rq = Math.sqrt(0.5 * this.qp);
	      sinphi = Math.sin(this.lat0);
	      this.sinb1 = qsfnz(this.e, sinphi) / this.qp;
	      this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1);
	      this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * sinphi * sinphi) * this.rq * this.cosb1);
	      this.ymf = (this.xmf = this.rq) / this.dd;
	      this.xmf *= this.dd;
	      break;
	    }
	  }
	  else {
	    if (this.mode === this.OBLIQ) {
	      this.sinph0 = Math.sin(this.lat0);
	      this.cosph0 = Math.cos(this.lat0);
	    }
	  }
	}

	/* Lambert Azimuthal Equal Area forward equations--mapping lat,long to x,y
	  -----------------------------------------------------------------------*/
	function forward$12(p) {

	  /* Forward equations
	      -----------------*/
	  var x, y, coslam, sinlam, sinphi, q, sinb, cosb, b, cosphi;
	  var lam = p.x;
	  var phi = p.y;

	  lam = adjust_lon(lam - this.long0);
	  if (this.sphere) {
	    sinphi = Math.sin(phi);
	    cosphi = Math.cos(phi);
	    coslam = Math.cos(lam);
	    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
	      y = (this.mode === this.EQUIT) ? 1 + cosphi * coslam : 1 + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
	      if (y <= EPSLN) {
	        return null;
	      }
	      y = Math.sqrt(2 / y);
	      x = y * cosphi * Math.sin(lam);
	      y *= (this.mode === this.EQUIT) ? sinphi : this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
	    }
	    else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
	      if (this.mode === this.N_POLE) {
	        coslam = -coslam;
	      }
	      if (Math.abs(phi + this.phi0) < EPSLN) {
	        return null;
	      }
	      y = FORTPI - phi * 0.5;
	      y = 2 * ((this.mode === this.S_POLE) ? Math.cos(y) : Math.sin(y));
	      x = y * Math.sin(lam);
	      y *= coslam;
	    }
	  }
	  else {
	    sinb = 0;
	    cosb = 0;
	    b = 0;
	    coslam = Math.cos(lam);
	    sinlam = Math.sin(lam);
	    sinphi = Math.sin(phi);
	    q = qsfnz(this.e, sinphi);
	    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
	      sinb = q / this.qp;
	      cosb = Math.sqrt(1 - sinb * sinb);
	    }
	    switch (this.mode) {
	    case this.OBLIQ:
	      b = 1 + this.sinb1 * sinb + this.cosb1 * cosb * coslam;
	      break;
	    case this.EQUIT:
	      b = 1 + cosb * coslam;
	      break;
	    case this.N_POLE:
	      b = HALF_PI + phi;
	      q = this.qp - q;
	      break;
	    case this.S_POLE:
	      b = phi - HALF_PI;
	      q = this.qp + q;
	      break;
	    }
	    if (Math.abs(b) < EPSLN) {
	      return null;
	    }
	    switch (this.mode) {
	    case this.OBLIQ:
	    case this.EQUIT:
	      b = Math.sqrt(2 / b);
	      if (this.mode === this.OBLIQ) {
	        y = this.ymf * b * (this.cosb1 * sinb - this.sinb1 * cosb * coslam);
	      }
	      else {
	        y = (b = Math.sqrt(2 / (1 + cosb * coslam))) * sinb * this.ymf;
	      }
	      x = this.xmf * b * cosb * sinlam;
	      break;
	    case this.N_POLE:
	    case this.S_POLE:
	      if (q >= 0) {
	        x = (b = Math.sqrt(q)) * sinlam;
	        y = coslam * ((this.mode === this.S_POLE) ? b : -b);
	      }
	      else {
	        x = y = 0;
	      }
	      break;
	    }
	  }

	  p.x = this.a * x + this.x0;
	  p.y = this.a * y + this.y0;
	  return p;
	}

	/* Inverse equations
	  -----------------*/
	function inverse$12(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;
	  var x = p.x / this.a;
	  var y = p.y / this.a;
	  var lam, phi, cCe, sCe, q, rho, ab;
	  if (this.sphere) {
	    var cosz = 0,
	      rh, sinz = 0;

	    rh = Math.sqrt(x * x + y * y);
	    phi = rh * 0.5;
	    if (phi > 1) {
	      return null;
	    }
	    phi = 2 * Math.asin(phi);
	    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
	      sinz = Math.sin(phi);
	      cosz = Math.cos(phi);
	    }
	    switch (this.mode) {
	    case this.EQUIT:
	      phi = (Math.abs(rh) <= EPSLN) ? 0 : Math.asin(y * sinz / rh);
	      x *= sinz;
	      y = cosz * rh;
	      break;
	    case this.OBLIQ:
	      phi = (Math.abs(rh) <= EPSLN) ? this.phi0 : Math.asin(cosz * this.sinph0 + y * sinz * this.cosph0 / rh);
	      x *= sinz * this.cosph0;
	      y = (cosz - Math.sin(phi) * this.sinph0) * rh;
	      break;
	    case this.N_POLE:
	      y = -y;
	      phi = HALF_PI - phi;
	      break;
	    case this.S_POLE:
	      phi -= HALF_PI;
	      break;
	    }
	    lam = (y === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ)) ? 0 : Math.atan2(x, y);
	  }
	  else {
	    ab = 0;
	    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
	      x /= this.dd;
	      y *= this.dd;
	      rho = Math.sqrt(x * x + y * y);
	      if (rho < EPSLN) {
	        p.x = 0;
	        p.y = this.phi0;
	        return p;
	      }
	      sCe = 2 * Math.asin(0.5 * rho / this.rq);
	      cCe = Math.cos(sCe);
	      x *= (sCe = Math.sin(sCe));
	      if (this.mode === this.OBLIQ) {
	        ab = cCe * this.sinb1 + y * sCe * this.cosb1 / rho;
	        q = this.qp * ab;
	        y = rho * this.cosb1 * cCe - y * this.sinb1 * sCe;
	      }
	      else {
	        ab = y * sCe / rho;
	        q = this.qp * ab;
	        y = rho * cCe;
	      }
	    }
	    else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
	      if (this.mode === this.N_POLE) {
	        y = -y;
	      }
	      q = (x * x + y * y);
	      if (!q) {
	        p.x = 0;
	        p.y = this.phi0;
	        return p;
	      }
	      ab = 1 - q / this.qp;
	      if (this.mode === this.S_POLE) {
	        ab = -ab;
	      }
	    }
	    lam = Math.atan2(x, y);
	    phi = authlat(Math.asin(ab), this.apa);
	  }

	  p.x = adjust_lon(this.long0 + lam);
	  p.y = phi;
	  return p;
	}

	/* determine latitude from authalic latitude */
	var P00 = 0.33333333333333333333;

	var P01 = 0.17222222222222222222;
	var P02 = 0.10257936507936507936;
	var P10 = 0.06388888888888888888;
	var P11 = 0.06640211640211640211;
	var P20 = 0.01641501294219154443;

	function authset(es) {
	  var t;
	  var APA = [];
	  APA[0] = es * P00;
	  t = es * es;
	  APA[0] += t * P01;
	  APA[1] = t * P10;
	  t *= es;
	  APA[0] += t * P02;
	  APA[1] += t * P11;
	  APA[2] = t * P20;
	  return APA;
	}

	function authlat(beta, APA) {
	  var t = beta + beta;
	  return (beta + APA[0] * Math.sin(t) + APA[1] * Math.sin(t + t) + APA[2] * Math.sin(t + t + t));
	}

	var names$14 = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];
	var laea = {
	  init: init$13,
	  forward: forward$12,
	  inverse: inverse$12,
	  names: names$14,
	  S_POLE: S_POLE,
	  N_POLE: N_POLE,
	  EQUIT: EQUIT,
	  OBLIQ: OBLIQ
	};

	var asinz = function(x) {
	  if (Math.abs(x) > 1) {
	    x = (x > 1) ? 1 : -1;
	  }
	  return Math.asin(x);
	};

	function init$14() {

	  if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
	    return;
	  }
	  this.temp = this.b / this.a;
	  this.es = 1 - Math.pow(this.temp, 2);
	  this.e3 = Math.sqrt(this.es);

	  this.sin_po = Math.sin(this.lat1);
	  this.cos_po = Math.cos(this.lat1);
	  this.t1 = this.sin_po;
	  this.con = this.sin_po;
	  this.ms1 = msfnz(this.e3, this.sin_po, this.cos_po);
	  this.qs1 = qsfnz(this.e3, this.sin_po, this.cos_po);

	  this.sin_po = Math.sin(this.lat2);
	  this.cos_po = Math.cos(this.lat2);
	  this.t2 = this.sin_po;
	  this.ms2 = msfnz(this.e3, this.sin_po, this.cos_po);
	  this.qs2 = qsfnz(this.e3, this.sin_po, this.cos_po);

	  this.sin_po = Math.sin(this.lat0);
	  this.cos_po = Math.cos(this.lat0);
	  this.t3 = this.sin_po;
	  this.qs0 = qsfnz(this.e3, this.sin_po, this.cos_po);

	  if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
	    this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1);
	  }
	  else {
	    this.ns0 = this.con;
	  }
	  this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
	  this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0;
	}

	/* Albers Conical Equal Area forward equations--mapping lat,long to x,y
	  -------------------------------------------------------------------*/
	function forward$13(p) {

	  var lon = p.x;
	  var lat = p.y;

	  this.sin_phi = Math.sin(lat);
	  this.cos_phi = Math.cos(lat);

	  var qs = qsfnz(this.e3, this.sin_phi, this.cos_phi);
	  var rh1 = this.a * Math.sqrt(this.c - this.ns0 * qs) / this.ns0;
	  var theta = this.ns0 * adjust_lon(lon - this.long0);
	  var x = rh1 * Math.sin(theta) + this.x0;
	  var y = this.rh - rh1 * Math.cos(theta) + this.y0;

	  p.x = x;
	  p.y = y;
	  return p;
	}

	function inverse$13(p) {
	  var rh1, qs, con, theta, lon, lat;

	  p.x -= this.x0;
	  p.y = this.rh - p.y + this.y0;
	  if (this.ns0 >= 0) {
	    rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
	    con = 1;
	  }
	  else {
	    rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
	    con = -1;
	  }
	  theta = 0;
	  if (rh1 !== 0) {
	    theta = Math.atan2(con * p.x, con * p.y);
	  }
	  con = rh1 * this.ns0 / this.a;
	  if (this.sphere) {
	    lat = Math.asin((this.c - con * con) / (2 * this.ns0));
	  }
	  else {
	    qs = (this.c - con * con) / this.ns0;
	    lat = this.phi1z(this.e3, qs);
	  }

	  lon = adjust_lon(theta / this.ns0 + this.long0);
	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	/* Function to compute phi1, the latitude for the inverse of the
	   Albers Conical Equal-Area projection.
	-------------------------------------------*/
	function phi1z(eccent, qs) {
	  var sinphi, cosphi, con, com, dphi;
	  var phi = asinz(0.5 * qs);
	  if (eccent < EPSLN) {
	    return phi;
	  }

	  var eccnts = eccent * eccent;
	  for (var i = 1; i <= 25; i++) {
	    sinphi = Math.sin(phi);
	    cosphi = Math.cos(phi);
	    con = eccent * sinphi;
	    com = 1 - con * con;
	    dphi = 0.5 * com * com / cosphi * (qs / (1 - eccnts) - sinphi / com + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
	    phi = phi + dphi;
	    if (Math.abs(dphi) <= 1e-7) {
	      return phi;
	    }
	  }
	  return null;
	}

	var names$15 = ["Albers_Conic_Equal_Area", "Albers", "aea"];
	var aea = {
	  init: init$14,
	  forward: forward$13,
	  inverse: inverse$13,
	  names: names$15,
	  phi1z: phi1z
	};

	/*
	  reference:
	    Wolfram Mathworld "Gnomonic Projection"
	    http://mathworld.wolfram.com/GnomonicProjection.html
	    Accessed: 12th November 2009
	  */
	function init$15() {

	  /* Place parameters in static storage for common use
	      -------------------------------------------------*/
	  this.sin_p14 = Math.sin(this.lat0);
	  this.cos_p14 = Math.cos(this.lat0);
	  // Approximation for projecting points to the horizon (infinity)
	  this.infinity_dist = 1000 * this.a;
	  this.rc = 1;
	}

	/* Gnomonic forward equations--mapping lat,long to x,y
	    ---------------------------------------------------*/
	function forward$14(p) {
	  var sinphi, cosphi; /* sin and cos value        */
	  var dlon; /* delta longitude value      */
	  var coslon; /* cos of longitude        */
	  var ksp; /* scale factor          */
	  var g;
	  var x, y;
	  var lon = p.x;
	  var lat = p.y;
	  /* Forward equations
	      -----------------*/
	  dlon = adjust_lon(lon - this.long0);

	  sinphi = Math.sin(lat);
	  cosphi = Math.cos(lat);

	  coslon = Math.cos(dlon);
	  g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
	  ksp = 1;
	  if ((g > 0) || (Math.abs(g) <= EPSLN)) {
	    x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon) / g;
	    y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon) / g;
	  }
	  else {

	    // Point is in the opposing hemisphere and is unprojectable
	    // We still need to return a reasonable point, so we project
	    // to infinity, on a bearing
	    // equivalent to the northern hemisphere equivalent
	    // This is a reasonable approximation for short shapes and lines that
	    // straddle the horizon.

	    x = this.x0 + this.infinity_dist * cosphi * Math.sin(dlon);
	    y = this.y0 + this.infinity_dist * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);

	  }
	  p.x = x;
	  p.y = y;
	  return p;
	}

	function inverse$14(p) {
	  var rh; /* Rho */
	  var sinc, cosc;
	  var c;
	  var lon, lat;

	  /* Inverse equations
	      -----------------*/
	  p.x = (p.x - this.x0) / this.a;
	  p.y = (p.y - this.y0) / this.a;

	  p.x /= this.k0;
	  p.y /= this.k0;

	  if ((rh = Math.sqrt(p.x * p.x + p.y * p.y))) {
	    c = Math.atan2(rh, this.rc);
	    sinc = Math.sin(c);
	    cosc = Math.cos(c);

	    lat = asinz(cosc * this.sin_p14 + (p.y * sinc * this.cos_p14) / rh);
	    lon = Math.atan2(p.x * sinc, rh * this.cos_p14 * cosc - p.y * this.sin_p14 * sinc);
	    lon = adjust_lon(this.long0 + lon);
	  }
	  else {
	    lat = this.phic0;
	    lon = 0;
	  }

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$16 = ["gnom"];
	var gnom = {
	  init: init$15,
	  forward: forward$14,
	  inverse: inverse$14,
	  names: names$16
	};

	var iqsfnz = function(eccent, q) {
	  var temp = 1 - (1 - eccent * eccent) / (2 * eccent) * Math.log((1 - eccent) / (1 + eccent));
	  if (Math.abs(Math.abs(q) - temp) < 1.0E-6) {
	    if (q < 0) {
	      return (-1 * HALF_PI);
	    }
	    else {
	      return HALF_PI;
	    }
	  }
	  //var phi = 0.5* q/(1-eccent*eccent);
	  var phi = Math.asin(0.5 * q);
	  var dphi;
	  var sin_phi;
	  var cos_phi;
	  var con;
	  for (var i = 0; i < 30; i++) {
	    sin_phi = Math.sin(phi);
	    cos_phi = Math.cos(phi);
	    con = eccent * sin_phi;
	    dphi = Math.pow(1 - con * con, 2) / (2 * cos_phi) * (q / (1 - eccent * eccent) - sin_phi / (1 - con * con) + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
	    phi += dphi;
	    if (Math.abs(dphi) <= 0.0000000001) {
	      return phi;
	    }
	  }

	  //console.log("IQSFN-CONV:Latitude failed to converge after 30 iterations");
	  return NaN;
	};

	/*
	  reference:
	    "Cartographic Projection Procedures for the UNIX Environment-
	    A User's Manual" by Gerald I. Evenden,
	    USGS Open File Report 90-284and Release 4 Interim Reports (2003)
	*/
	function init$16() {
	  //no-op
	  if (!this.sphere) {
	    this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
	  }
	}

	/* Cylindrical Equal Area forward equations--mapping lat,long to x,y
	    ------------------------------------------------------------*/
	function forward$15(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var x, y;
	  /* Forward equations
	      -----------------*/
	  var dlon = adjust_lon(lon - this.long0);
	  if (this.sphere) {
	    x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
	    y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
	  }
	  else {
	    var qs = qsfnz(this.e, Math.sin(lat));
	    x = this.x0 + this.a * this.k0 * dlon;
	    y = this.y0 + this.a * qs * 0.5 / this.k0;
	  }

	  p.x = x;
	  p.y = y;
	  return p;
	}

	/* Cylindrical Equal Area inverse equations--mapping x,y to lat/long
	    ------------------------------------------------------------*/
	function inverse$15(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;
	  var lon, lat;

	  if (this.sphere) {
	    lon = adjust_lon(this.long0 + (p.x / this.a) / Math.cos(this.lat_ts));
	    lat = Math.asin((p.y / this.a) * Math.cos(this.lat_ts));
	  }
	  else {
	    lat = iqsfnz(this.e, 2 * p.y * this.k0 / this.a);
	    lon = adjust_lon(this.long0 + p.x / (this.a * this.k0));
	  }

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$17 = ["cea"];
	var cea = {
	  init: init$16,
	  forward: forward$15,
	  inverse: inverse$15,
	  names: names$17
	};

	function init$17() {

	  this.x0 = this.x0 || 0;
	  this.y0 = this.y0 || 0;
	  this.lat0 = this.lat0 || 0;
	  this.long0 = this.long0 || 0;
	  this.lat_ts = this.lat_ts || 0;
	  this.title = this.title || "Equidistant Cylindrical (Plate Carre)";

	  this.rc = Math.cos(this.lat_ts);
	}

	// forward equations--mapping lat,long to x,y
	// -----------------------------------------------------------------
	function forward$16(p) {

	  var lon = p.x;
	  var lat = p.y;

	  var dlon = adjust_lon(lon - this.long0);
	  var dlat = adjust_lat(lat - this.lat0);
	  p.x = this.x0 + (this.a * dlon * this.rc);
	  p.y = this.y0 + (this.a * dlat);
	  return p;
	}

	// inverse equations--mapping x,y to lat/long
	// -----------------------------------------------------------------
	function inverse$16(p) {

	  var x = p.x;
	  var y = p.y;

	  p.x = adjust_lon(this.long0 + ((x - this.x0) / (this.a * this.rc)));
	  p.y = adjust_lat(this.lat0 + ((y - this.y0) / (this.a)));
	  return p;
	}

	var names$18 = ["Equirectangular", "Equidistant_Cylindrical", "eqc"];
	var eqc = {
	  init: init$17,
	  forward: forward$16,
	  inverse: inverse$16,
	  names: names$18
	};

	var MAX_ITER$2 = 20;

	function init$18() {
	  /* Place parameters in static storage for common use
	      -------------------------------------------------*/
	  this.temp = this.b / this.a;
	  this.es = 1 - Math.pow(this.temp, 2); // devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles
	  this.e = Math.sqrt(this.es);
	  this.e0 = e0fn(this.es);
	  this.e1 = e1fn(this.es);
	  this.e2 = e2fn(this.es);
	  this.e3 = e3fn(this.es);
	  this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0); //si que des zeros le calcul ne se fait pas
	}

	/* Polyconic forward equations--mapping lat,long to x,y
	    ---------------------------------------------------*/
	function forward$17(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var x, y, el;
	  var dlon = adjust_lon(lon - this.long0);
	  el = dlon * Math.sin(lat);
	  if (this.sphere) {
	    if (Math.abs(lat) <= EPSLN) {
	      x = this.a * dlon;
	      y = -1 * this.a * this.lat0;
	    }
	    else {
	      x = this.a * Math.sin(el) / Math.tan(lat);
	      y = this.a * (adjust_lat(lat - this.lat0) + (1 - Math.cos(el)) / Math.tan(lat));
	    }
	  }
	  else {
	    if (Math.abs(lat) <= EPSLN) {
	      x = this.a * dlon;
	      y = -1 * this.ml0;
	    }
	    else {
	      var nl = gN(this.a, this.e, Math.sin(lat)) / Math.tan(lat);
	      x = nl * Math.sin(el);
	      y = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, lat) - this.ml0 + nl * (1 - Math.cos(el));
	    }

	  }
	  p.x = x + this.x0;
	  p.y = y + this.y0;
	  return p;
	}

	/* Inverse equations
	  -----------------*/
	function inverse$17(p) {
	  var lon, lat, x, y, i;
	  var al, bl;
	  var phi, dphi;
	  x = p.x - this.x0;
	  y = p.y - this.y0;

	  if (this.sphere) {
	    if (Math.abs(y + this.a * this.lat0) <= EPSLN) {
	      lon = adjust_lon(x / this.a + this.long0);
	      lat = 0;
	    }
	    else {
	      al = this.lat0 + y / this.a;
	      bl = x * x / this.a / this.a + al * al;
	      phi = al;
	      var tanphi;
	      for (i = MAX_ITER$2; i; --i) {
	        tanphi = Math.tan(phi);
	        dphi = -1 * (al * (phi * tanphi + 1) - phi - 0.5 * (phi * phi + bl) * tanphi) / ((phi - al) / tanphi - 1);
	        phi += dphi;
	        if (Math.abs(dphi) <= EPSLN) {
	          lat = phi;
	          break;
	        }
	      }
	      lon = adjust_lon(this.long0 + (Math.asin(x * Math.tan(phi) / this.a)) / Math.sin(lat));
	    }
	  }
	  else {
	    if (Math.abs(y + this.ml0) <= EPSLN) {
	      lat = 0;
	      lon = adjust_lon(this.long0 + x / this.a);
	    }
	    else {

	      al = (this.ml0 + y) / this.a;
	      bl = x * x / this.a / this.a + al * al;
	      phi = al;
	      var cl, mln, mlnp, ma;
	      var con;
	      for (i = MAX_ITER$2; i; --i) {
	        con = this.e * Math.sin(phi);
	        cl = Math.sqrt(1 - con * con) * Math.tan(phi);
	        mln = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);
	        mlnp = this.e0 - 2 * this.e1 * Math.cos(2 * phi) + 4 * this.e2 * Math.cos(4 * phi) - 6 * this.e3 * Math.cos(6 * phi);
	        ma = mln / this.a;
	        dphi = (al * (cl * ma + 1) - ma - 0.5 * cl * (ma * ma + bl)) / (this.es * Math.sin(2 * phi) * (ma * ma + bl - 2 * al * ma) / (4 * cl) + (al - ma) * (cl * mlnp - 2 / Math.sin(2 * phi)) - mlnp);
	        phi -= dphi;
	        if (Math.abs(dphi) <= EPSLN) {
	          lat = phi;
	          break;
	        }
	      }

	      //lat=phi4z(this.e,this.e0,this.e1,this.e2,this.e3,al,bl,0,0);
	      cl = Math.sqrt(1 - this.es * Math.pow(Math.sin(lat), 2)) * Math.tan(lat);
	      lon = adjust_lon(this.long0 + Math.asin(x * cl / this.a) / Math.sin(lat));
	    }
	  }

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$19 = ["Polyconic", "poly"];
	var poly = {
	  init: init$18,
	  forward: forward$17,
	  inverse: inverse$17,
	  names: names$19
	};

	/*
	  reference
	    Department of Land and Survey Technical Circular 1973/32
	      http://www.linz.govt.nz/docs/miscellaneous/nz-map-definition.pdf
	    OSG Technical Report 4.1
	      http://www.linz.govt.nz/docs/miscellaneous/nzmg.pdf
	  */

	/**
	 * iterations: Number of iterations to refine inverse transform.
	 *     0 -> km accuracy
	 *     1 -> m accuracy -- suitable for most mapping applications
	 *     2 -> mm accuracy
	 */


	function init$19() {
	  this.A = [];
	  this.A[1] = 0.6399175073;
	  this.A[2] = -0.1358797613;
	  this.A[3] = 0.063294409;
	  this.A[4] = -0.02526853;
	  this.A[5] = 0.0117879;
	  this.A[6] = -0.0055161;
	  this.A[7] = 0.0026906;
	  this.A[8] = -0.001333;
	  this.A[9] = 0.00067;
	  this.A[10] = -0.00034;

	  this.B_re = [];
	  this.B_im = [];
	  this.B_re[1] = 0.7557853228;
	  this.B_im[1] = 0;
	  this.B_re[2] = 0.249204646;
	  this.B_im[2] = 0.003371507;
	  this.B_re[3] = -0.001541739;
	  this.B_im[3] = 0.041058560;
	  this.B_re[4] = -0.10162907;
	  this.B_im[4] = 0.01727609;
	  this.B_re[5] = -0.26623489;
	  this.B_im[5] = -0.36249218;
	  this.B_re[6] = -0.6870983;
	  this.B_im[6] = -1.1651967;

	  this.C_re = [];
	  this.C_im = [];
	  this.C_re[1] = 1.3231270439;
	  this.C_im[1] = 0;
	  this.C_re[2] = -0.577245789;
	  this.C_im[2] = -0.007809598;
	  this.C_re[3] = 0.508307513;
	  this.C_im[3] = -0.112208952;
	  this.C_re[4] = -0.15094762;
	  this.C_im[4] = 0.18200602;
	  this.C_re[5] = 1.01418179;
	  this.C_im[5] = 1.64497696;
	  this.C_re[6] = 1.9660549;
	  this.C_im[6] = 2.5127645;

	  this.D = [];
	  this.D[1] = 1.5627014243;
	  this.D[2] = 0.5185406398;
	  this.D[3] = -0.03333098;
	  this.D[4] = -0.1052906;
	  this.D[5] = -0.0368594;
	  this.D[6] = 0.007317;
	  this.D[7] = 0.01220;
	  this.D[8] = 0.00394;
	  this.D[9] = -0.0013;
	}

	/**
	    New Zealand Map Grid Forward  - long/lat to x/y
	    long/lat in radians
	  */
	function forward$18(p) {
	  var n;
	  var lon = p.x;
	  var lat = p.y;

	  var delta_lat = lat - this.lat0;
	  var delta_lon = lon - this.long0;

	  // 1. Calculate d_phi and d_psi    ...                          // and d_lambda
	  // For this algorithm, delta_latitude is in seconds of arc x 10-5, so we need to scale to those units. Longitude is radians.
	  var d_phi = delta_lat / SEC_TO_RAD * 1E-5;
	  var d_lambda = delta_lon;
	  var d_phi_n = 1; // d_phi^0

	  var d_psi = 0;
	  for (n = 1; n <= 10; n++) {
	    d_phi_n = d_phi_n * d_phi;
	    d_psi = d_psi + this.A[n] * d_phi_n;
	  }

	  // 2. Calculate theta
	  var th_re = d_psi;
	  var th_im = d_lambda;

	  // 3. Calculate z
	  var th_n_re = 1;
	  var th_n_im = 0; // theta^0
	  var th_n_re1;
	  var th_n_im1;

	  var z_re = 0;
	  var z_im = 0;
	  for (n = 1; n <= 6; n++) {
	    th_n_re1 = th_n_re * th_re - th_n_im * th_im;
	    th_n_im1 = th_n_im * th_re + th_n_re * th_im;
	    th_n_re = th_n_re1;
	    th_n_im = th_n_im1;
	    z_re = z_re + this.B_re[n] * th_n_re - this.B_im[n] * th_n_im;
	    z_im = z_im + this.B_im[n] * th_n_re + this.B_re[n] * th_n_im;
	  }

	  // 4. Calculate easting and northing
	  p.x = (z_im * this.a) + this.x0;
	  p.y = (z_re * this.a) + this.y0;

	  return p;
	}

	/**
	    New Zealand Map Grid Inverse  -  x/y to long/lat
	  */
	function inverse$18(p) {
	  var n;
	  var x = p.x;
	  var y = p.y;

	  var delta_x = x - this.x0;
	  var delta_y = y - this.y0;

	  // 1. Calculate z
	  var z_re = delta_y / this.a;
	  var z_im = delta_x / this.a;

	  // 2a. Calculate theta - first approximation gives km accuracy
	  var z_n_re = 1;
	  var z_n_im = 0; // z^0
	  var z_n_re1;
	  var z_n_im1;

	  var th_re = 0;
	  var th_im = 0;
	  for (n = 1; n <= 6; n++) {
	    z_n_re1 = z_n_re * z_re - z_n_im * z_im;
	    z_n_im1 = z_n_im * z_re + z_n_re * z_im;
	    z_n_re = z_n_re1;
	    z_n_im = z_n_im1;
	    th_re = th_re + this.C_re[n] * z_n_re - this.C_im[n] * z_n_im;
	    th_im = th_im + this.C_im[n] * z_n_re + this.C_re[n] * z_n_im;
	  }

	  // 2b. Iterate to refine the accuracy of the calculation
	  //        0 iterations gives km accuracy
	  //        1 iteration gives m accuracy -- good enough for most mapping applications
	  //        2 iterations bives mm accuracy
	  for (var i = 0; i < this.iterations; i++) {
	    var th_n_re = th_re;
	    var th_n_im = th_im;
	    var th_n_re1;
	    var th_n_im1;

	    var num_re = z_re;
	    var num_im = z_im;
	    for (n = 2; n <= 6; n++) {
	      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
	      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
	      th_n_re = th_n_re1;
	      th_n_im = th_n_im1;
	      num_re = num_re + (n - 1) * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
	      num_im = num_im + (n - 1) * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
	    }

	    th_n_re = 1;
	    th_n_im = 0;
	    var den_re = this.B_re[1];
	    var den_im = this.B_im[1];
	    for (n = 2; n <= 6; n++) {
	      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
	      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
	      th_n_re = th_n_re1;
	      th_n_im = th_n_im1;
	      den_re = den_re + n * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
	      den_im = den_im + n * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
	    }

	    // Complex division
	    var den2 = den_re * den_re + den_im * den_im;
	    th_re = (num_re * den_re + num_im * den_im) / den2;
	    th_im = (num_im * den_re - num_re * den_im) / den2;
	  }

	  // 3. Calculate d_phi              ...                                    // and d_lambda
	  var d_psi = th_re;
	  var d_lambda = th_im;
	  var d_psi_n = 1; // d_psi^0

	  var d_phi = 0;
	  for (n = 1; n <= 9; n++) {
	    d_psi_n = d_psi_n * d_psi;
	    d_phi = d_phi + this.D[n] * d_psi_n;
	  }

	  // 4. Calculate latitude and longitude
	  // d_phi is calcuated in second of arc * 10^-5, so we need to scale back to radians. d_lambda is in radians.
	  var lat = this.lat0 + (d_phi * SEC_TO_RAD * 1E5);
	  var lon = this.long0 + d_lambda;

	  p.x = lon;
	  p.y = lat;

	  return p;
	}

	var names$20 = ["New_Zealand_Map_Grid", "nzmg"];
	var nzmg = {
	  init: init$19,
	  forward: forward$18,
	  inverse: inverse$18,
	  names: names$20
	};

	/*
	  reference
	    "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
	    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
	  */


	/* Initialize the Miller Cylindrical projection
	  -------------------------------------------*/
	function init$20() {
	  //no-op
	}

	/* Miller Cylindrical forward equations--mapping lat,long to x,y
	    ------------------------------------------------------------*/
	function forward$19(p) {
	  var lon = p.x;
	  var lat = p.y;
	  /* Forward equations
	      -----------------*/
	  var dlon = adjust_lon(lon - this.long0);
	  var x = this.x0 + this.a * dlon;
	  var y = this.y0 + this.a * Math.log(Math.tan((Math.PI / 4) + (lat / 2.5))) * 1.25;

	  p.x = x;
	  p.y = y;
	  return p;
	}

	/* Miller Cylindrical inverse equations--mapping x,y to lat/long
	    ------------------------------------------------------------*/
	function inverse$19(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;

	  var lon = adjust_lon(this.long0 + p.x / this.a);
	  var lat = 2.5 * (Math.atan(Math.exp(0.8 * p.y / this.a)) - Math.PI / 4);

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$21 = ["Miller_Cylindrical", "mill"];
	var mill = {
	  init: init$20,
	  forward: forward$19,
	  inverse: inverse$19,
	  names: names$21
	};

	var MAX_ITER$3 = 20;
	function init$21() {
	  /* Place parameters in static storage for common use
	    -------------------------------------------------*/


	  if (!this.sphere) {
	    this.en = pj_enfn(this.es);
	  }
	  else {
	    this.n = 1;
	    this.m = 0;
	    this.es = 0;
	    this.C_y = Math.sqrt((this.m + 1) / this.n);
	    this.C_x = this.C_y / (this.m + 1);
	  }

	}

	/* Sinusoidal forward equations--mapping lat,long to x,y
	  -----------------------------------------------------*/
	function forward$20(p) {
	  var x, y;
	  var lon = p.x;
	  var lat = p.y;
	  /* Forward equations
	    -----------------*/
	  lon = adjust_lon(lon - this.long0);

	  if (this.sphere) {
	    if (!this.m) {
	      lat = this.n !== 1 ? Math.asin(this.n * Math.sin(lat)) : lat;
	    }
	    else {
	      var k = this.n * Math.sin(lat);
	      for (var i = MAX_ITER$3; i; --i) {
	        var V = (this.m * lat + Math.sin(lat) - k) / (this.m + Math.cos(lat));
	        lat -= V;
	        if (Math.abs(V) < EPSLN) {
	          break;
	        }
	      }
	    }
	    x = this.a * this.C_x * lon * (this.m + Math.cos(lat));
	    y = this.a * this.C_y * lat;

	  }
	  else {

	    var s = Math.sin(lat);
	    var c = Math.cos(lat);
	    y = this.a * pj_mlfn(lat, s, c, this.en);
	    x = this.a * lon * c / Math.sqrt(1 - this.es * s * s);
	  }

	  p.x = x;
	  p.y = y;
	  return p;
	}

	function inverse$20(p) {
	  var lat, temp, lon, s;

	  p.x -= this.x0;
	  lon = p.x / this.a;
	  p.y -= this.y0;
	  lat = p.y / this.a;

	  if (this.sphere) {
	    lat /= this.C_y;
	    lon = lon / (this.C_x * (this.m + Math.cos(lat)));
	    if (this.m) {
	      lat = asinz((this.m * lat + Math.sin(lat)) / this.n);
	    }
	    else if (this.n !== 1) {
	      lat = asinz(Math.sin(lat) / this.n);
	    }
	    lon = adjust_lon(lon + this.long0);
	    lat = adjust_lat(lat);
	  }
	  else {
	    lat = pj_inv_mlfn(p.y / this.a, this.es, this.en);
	    s = Math.abs(lat);
	    if (s < HALF_PI) {
	      s = Math.sin(lat);
	      temp = this.long0 + p.x * Math.sqrt(1 - this.es * s * s) / (this.a * Math.cos(lat));
	      //temp = this.long0 + p.x / (this.a * Math.cos(lat));
	      lon = adjust_lon(temp);
	    }
	    else if ((s - EPSLN) < HALF_PI) {
	      lon = this.long0;
	    }
	  }
	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$22 = ["Sinusoidal", "sinu"];
	var sinu = {
	  init: init$21,
	  forward: forward$20,
	  inverse: inverse$20,
	  names: names$22
	};

	function init$22() {}
	/* Mollweide forward equations--mapping lat,long to x,y
	    ----------------------------------------------------*/
	function forward$21(p) {

	  /* Forward equations
	      -----------------*/
	  var lon = p.x;
	  var lat = p.y;

	  var delta_lon = adjust_lon(lon - this.long0);
	  var theta = lat;
	  var con = Math.PI * Math.sin(lat);

	  /* Iterate using the Newton-Raphson method to find theta
	      -----------------------------------------------------*/
	  while (true) {
	    var delta_theta = -(theta + Math.sin(theta) - con) / (1 + Math.cos(theta));
	    theta += delta_theta;
	    if (Math.abs(delta_theta) < EPSLN) {
	      break;
	    }
	  }
	  theta /= 2;

	  /* If the latitude is 90 deg, force the x coordinate to be "0 + false easting"
	       this is done here because of precision problems with "cos(theta)"
	       --------------------------------------------------------------------------*/
	  if (Math.PI / 2 - Math.abs(lat) < EPSLN) {
	    delta_lon = 0;
	  }
	  var x = 0.900316316158 * this.a * delta_lon * Math.cos(theta) + this.x0;
	  var y = 1.4142135623731 * this.a * Math.sin(theta) + this.y0;

	  p.x = x;
	  p.y = y;
	  return p;
	}

	function inverse$21(p) {
	  var theta;
	  var arg;

	  /* Inverse equations
	      -----------------*/
	  p.x -= this.x0;
	  p.y -= this.y0;
	  arg = p.y / (1.4142135623731 * this.a);

	  /* Because of division by zero problems, 'arg' can not be 1.  Therefore
	       a number very close to one is used instead.
	       -------------------------------------------------------------------*/
	  if (Math.abs(arg) > 0.999999999999) {
	    arg = 0.999999999999;
	  }
	  theta = Math.asin(arg);
	  var lon = adjust_lon(this.long0 + (p.x / (0.900316316158 * this.a * Math.cos(theta))));
	  if (lon < (-Math.PI)) {
	    lon = -Math.PI;
	  }
	  if (lon > Math.PI) {
	    lon = Math.PI;
	  }
	  arg = (2 * theta + Math.sin(2 * theta)) / Math.PI;
	  if (Math.abs(arg) > 1) {
	    arg = 1;
	  }
	  var lat = Math.asin(arg);

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$23 = ["Mollweide", "moll"];
	var moll = {
	  init: init$22,
	  forward: forward$21,
	  inverse: inverse$21,
	  names: names$23
	};

	function init$23() {

	  /* Place parameters in static storage for common use
	      -------------------------------------------------*/
	  // Standard Parallels cannot be equal and on opposite sides of the equator
	  if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
	    return;
	  }
	  this.lat2 = this.lat2 || this.lat1;
	  this.temp = this.b / this.a;
	  this.es = 1 - Math.pow(this.temp, 2);
	  this.e = Math.sqrt(this.es);
	  this.e0 = e0fn(this.es);
	  this.e1 = e1fn(this.es);
	  this.e2 = e2fn(this.es);
	  this.e3 = e3fn(this.es);

	  this.sinphi = Math.sin(this.lat1);
	  this.cosphi = Math.cos(this.lat1);

	  this.ms1 = msfnz(this.e, this.sinphi, this.cosphi);
	  this.ml1 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat1);

	  if (Math.abs(this.lat1 - this.lat2) < EPSLN) {
	    this.ns = this.sinphi;
	  }
	  else {
	    this.sinphi = Math.sin(this.lat2);
	    this.cosphi = Math.cos(this.lat2);
	    this.ms2 = msfnz(this.e, this.sinphi, this.cosphi);
	    this.ml2 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat2);
	    this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1);
	  }
	  this.g = this.ml1 + this.ms1 / this.ns;
	  this.ml0 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
	  this.rh = this.a * (this.g - this.ml0);
	}

	/* Equidistant Conic forward equations--mapping lat,long to x,y
	  -----------------------------------------------------------*/
	function forward$22(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var rh1;

	  /* Forward equations
	      -----------------*/
	  if (this.sphere) {
	    rh1 = this.a * (this.g - lat);
	  }
	  else {
	    var ml = mlfn(this.e0, this.e1, this.e2, this.e3, lat);
	    rh1 = this.a * (this.g - ml);
	  }
	  var theta = this.ns * adjust_lon(lon - this.long0);
	  var x = this.x0 + rh1 * Math.sin(theta);
	  var y = this.y0 + this.rh - rh1 * Math.cos(theta);
	  p.x = x;
	  p.y = y;
	  return p;
	}

	/* Inverse equations
	  -----------------*/
	function inverse$22(p) {
	  p.x -= this.x0;
	  p.y = this.rh - p.y + this.y0;
	  var con, rh1, lat, lon;
	  if (this.ns >= 0) {
	    rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
	    con = 1;
	  }
	  else {
	    rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
	    con = -1;
	  }
	  var theta = 0;
	  if (rh1 !== 0) {
	    theta = Math.atan2(con * p.x, con * p.y);
	  }

	  if (this.sphere) {
	    lon = adjust_lon(this.long0 + theta / this.ns);
	    lat = adjust_lat(this.g - rh1 / this.a);
	    p.x = lon;
	    p.y = lat;
	    return p;
	  }
	  else {
	    var ml = this.g - rh1 / this.a;
	    lat = imlfn(ml, this.e0, this.e1, this.e2, this.e3);
	    lon = adjust_lon(this.long0 + theta / this.ns);
	    p.x = lon;
	    p.y = lat;
	    return p;
	  }

	}

	var names$24 = ["Equidistant_Conic", "eqdc"];
	var eqdc = {
	  init: init$23,
	  forward: forward$22,
	  inverse: inverse$22,
	  names: names$24
	};

	/* Initialize the Van Der Grinten projection
	  ----------------------------------------*/
	function init$24() {
	  //this.R = 6370997; //Radius of earth
	  this.R = this.a;
	}

	function forward$23(p) {

	  var lon = p.x;
	  var lat = p.y;

	  /* Forward equations
	    -----------------*/
	  var dlon = adjust_lon(lon - this.long0);
	  var x, y;

	  if (Math.abs(lat) <= EPSLN) {
	    x = this.x0 + this.R * dlon;
	    y = this.y0;
	  }
	  var theta = asinz(2 * Math.abs(lat / Math.PI));
	  if ((Math.abs(dlon) <= EPSLN) || (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN)) {
	    x = this.x0;
	    if (lat >= 0) {
	      y = this.y0 + Math.PI * this.R * Math.tan(0.5 * theta);
	    }
	    else {
	      y = this.y0 + Math.PI * this.R * -Math.tan(0.5 * theta);
	    }
	    //  return(OK);
	  }
	  var al = 0.5 * Math.abs((Math.PI / dlon) - (dlon / Math.PI));
	  var asq = al * al;
	  var sinth = Math.sin(theta);
	  var costh = Math.cos(theta);

	  var g = costh / (sinth + costh - 1);
	  var gsq = g * g;
	  var m = g * (2 / sinth - 1);
	  var msq = m * m;
	  var con = Math.PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq) * (gsq - msq))) / (msq + asq);
	  if (dlon < 0) {
	    con = -con;
	  }
	  x = this.x0 + con;
	  //con = Math.abs(con / (Math.PI * this.R));
	  var q = asq + g;
	  con = Math.PI * this.R * (m * q - al * Math.sqrt((msq + asq) * (asq + 1) - q * q)) / (msq + asq);
	  if (lat >= 0) {
	    //y = this.y0 + Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
	    y = this.y0 + con;
	  }
	  else {
	    //y = this.y0 - Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
	    y = this.y0 - con;
	  }
	  p.x = x;
	  p.y = y;
	  return p;
	}

	/* Van Der Grinten inverse equations--mapping x,y to lat/long
	  ---------------------------------------------------------*/
	function inverse$23(p) {
	  var lon, lat;
	  var xx, yy, xys, c1, c2, c3;
	  var a1;
	  var m1;
	  var con;
	  var th1;
	  var d;

	  /* inverse equations
	    -----------------*/
	  p.x -= this.x0;
	  p.y -= this.y0;
	  con = Math.PI * this.R;
	  xx = p.x / con;
	  yy = p.y / con;
	  xys = xx * xx + yy * yy;
	  c1 = -Math.abs(yy) * (1 + xys);
	  c2 = c1 - 2 * yy * yy + xx * xx;
	  c3 = -2 * c1 + 1 + 2 * yy * yy + xys * xys;
	  d = yy * yy / c3 + (2 * c2 * c2 * c2 / c3 / c3 / c3 - 9 * c1 * c2 / c3 / c3) / 27;
	  a1 = (c1 - c2 * c2 / 3 / c3) / c3;
	  m1 = 2 * Math.sqrt(-a1 / 3);
	  con = ((3 * d) / a1) / m1;
	  if (Math.abs(con) > 1) {
	    if (con >= 0) {
	      con = 1;
	    }
	    else {
	      con = -1;
	    }
	  }
	  th1 = Math.acos(con) / 3;
	  if (p.y >= 0) {
	    lat = (-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
	  }
	  else {
	    lat = -(-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
	  }

	  if (Math.abs(xx) < EPSLN) {
	    lon = this.long0;
	  }
	  else {
	    lon = adjust_lon(this.long0 + Math.PI * (xys - 1 + Math.sqrt(1 + 2 * (xx * xx - yy * yy) + xys * xys)) / 2 / xx);
	  }

	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$25 = ["Van_der_Grinten_I", "VanDerGrinten", "vandg"];
	var vandg = {
	  init: init$24,
	  forward: forward$23,
	  inverse: inverse$23,
	  names: names$25
	};

	function init$25() {
	  this.sin_p12 = Math.sin(this.lat0);
	  this.cos_p12 = Math.cos(this.lat0);
	}

	function forward$24(p) {
	  var lon = p.x;
	  var lat = p.y;
	  var sinphi = Math.sin(p.y);
	  var cosphi = Math.cos(p.y);
	  var dlon = adjust_lon(lon - this.long0);
	  var e0, e1, e2, e3, Mlp, Ml, tanphi, Nl1, Nl, psi, Az, G, H, GH, Hs, c, kp, cos_c, s, s2, s3, s4, s5;
	  if (this.sphere) {
	    if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
	      //North Pole case
	      p.x = this.x0 + this.a * (HALF_PI - lat) * Math.sin(dlon);
	      p.y = this.y0 - this.a * (HALF_PI - lat) * Math.cos(dlon);
	      return p;
	    }
	    else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
	      //South Pole case
	      p.x = this.x0 + this.a * (HALF_PI + lat) * Math.sin(dlon);
	      p.y = this.y0 + this.a * (HALF_PI + lat) * Math.cos(dlon);
	      return p;
	    }
	    else {
	      //default case
	      cos_c = this.sin_p12 * sinphi + this.cos_p12 * cosphi * Math.cos(dlon);
	      c = Math.acos(cos_c);
	      kp = c / Math.sin(c);
	      p.x = this.x0 + this.a * kp * cosphi * Math.sin(dlon);
	      p.y = this.y0 + this.a * kp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * Math.cos(dlon));
	      return p;
	    }
	  }
	  else {
	    e0 = e0fn(this.es);
	    e1 = e1fn(this.es);
	    e2 = e2fn(this.es);
	    e3 = e3fn(this.es);
	    if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
	      //North Pole case
	      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
	      Ml = this.a * mlfn(e0, e1, e2, e3, lat);
	      p.x = this.x0 + (Mlp - Ml) * Math.sin(dlon);
	      p.y = this.y0 - (Mlp - Ml) * Math.cos(dlon);
	      return p;
	    }
	    else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
	      //South Pole case
	      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
	      Ml = this.a * mlfn(e0, e1, e2, e3, lat);
	      p.x = this.x0 + (Mlp + Ml) * Math.sin(dlon);
	      p.y = this.y0 + (Mlp + Ml) * Math.cos(dlon);
	      return p;
	    }
	    else {
	      //Default case
	      tanphi = sinphi / cosphi;
	      Nl1 = gN(this.a, this.e, this.sin_p12);
	      Nl = gN(this.a, this.e, sinphi);
	      psi = Math.atan((1 - this.es) * tanphi + this.es * Nl1 * this.sin_p12 / (Nl * cosphi));
	      Az = Math.atan2(Math.sin(dlon), this.cos_p12 * Math.tan(psi) - this.sin_p12 * Math.cos(dlon));
	      if (Az === 0) {
	        s = Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
	      }
	      else if (Math.abs(Math.abs(Az) - Math.PI) <= EPSLN) {
	        s = -Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
	      }
	      else {
	        s = Math.asin(Math.sin(dlon) * Math.cos(psi) / Math.sin(Az));
	      }
	      G = this.e * this.sin_p12 / Math.sqrt(1 - this.es);
	      H = this.e * this.cos_p12 * Math.cos(Az) / Math.sqrt(1 - this.es);
	      GH = G * H;
	      Hs = H * H;
	      s2 = s * s;
	      s3 = s2 * s;
	      s4 = s3 * s;
	      s5 = s4 * s;
	      c = Nl1 * s * (1 - s2 * Hs * (1 - Hs) / 6 + s3 / 8 * GH * (1 - 2 * Hs) + s4 / 120 * (Hs * (4 - 7 * Hs) - 3 * G * G * (1 - 7 * Hs)) - s5 / 48 * GH);
	      p.x = this.x0 + c * Math.sin(Az);
	      p.y = this.y0 + c * Math.cos(Az);
	      return p;
	    }
	  }


	}

	function inverse$24(p) {
	  p.x -= this.x0;
	  p.y -= this.y0;
	  var rh, z, sinz, cosz, lon, lat, con, e0, e1, e2, e3, Mlp, M, N1, psi, Az, cosAz, tmp, A, B, D, Ee, F;
	  if (this.sphere) {
	    rh = Math.sqrt(p.x * p.x + p.y * p.y);
	    if (rh > (2 * HALF_PI * this.a)) {
	      return;
	    }
	    z = rh / this.a;

	    sinz = Math.sin(z);
	    cosz = Math.cos(z);

	    lon = this.long0;
	    if (Math.abs(rh) <= EPSLN) {
	      lat = this.lat0;
	    }
	    else {
	      lat = asinz(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
	      con = Math.abs(this.lat0) - HALF_PI;
	      if (Math.abs(con) <= EPSLN) {
	        if (this.lat0 >= 0) {
	          lon = adjust_lon(this.long0 + Math.atan2(p.x, - p.y));
	        }
	        else {
	          lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
	        }
	      }
	      else {
	        /*con = cosz - this.sin_p12 * Math.sin(lat);
	        if ((Math.abs(con) < EPSLN) && (Math.abs(p.x) < EPSLN)) {
	          //no-op, just keep the lon value as is
	        } else {
	          var temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
	          lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));
	        }*/
	        lon = adjust_lon(this.long0 + Math.atan2(p.x * sinz, rh * this.cos_p12 * cosz - p.y * this.sin_p12 * sinz));
	      }
	    }

	    p.x = lon;
	    p.y = lat;
	    return p;
	  }
	  else {
	    e0 = e0fn(this.es);
	    e1 = e1fn(this.es);
	    e2 = e2fn(this.es);
	    e3 = e3fn(this.es);
	    if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
	      //North pole case
	      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
	      rh = Math.sqrt(p.x * p.x + p.y * p.y);
	      M = Mlp - rh;
	      lat = imlfn(M / this.a, e0, e1, e2, e3);
	      lon = adjust_lon(this.long0 + Math.atan2(p.x, - 1 * p.y));
	      p.x = lon;
	      p.y = lat;
	      return p;
	    }
	    else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
	      //South pole case
	      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
	      rh = Math.sqrt(p.x * p.x + p.y * p.y);
	      M = rh - Mlp;

	      lat = imlfn(M / this.a, e0, e1, e2, e3);
	      lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
	      p.x = lon;
	      p.y = lat;
	      return p;
	    }
	    else {
	      //default case
	      rh = Math.sqrt(p.x * p.x + p.y * p.y);
	      Az = Math.atan2(p.x, p.y);
	      N1 = gN(this.a, this.e, this.sin_p12);
	      cosAz = Math.cos(Az);
	      tmp = this.e * this.cos_p12 * cosAz;
	      A = -tmp * tmp / (1 - this.es);
	      B = 3 * this.es * (1 - A) * this.sin_p12 * this.cos_p12 * cosAz / (1 - this.es);
	      D = rh / N1;
	      Ee = D - A * (1 + A) * Math.pow(D, 3) / 6 - B * (1 + 3 * A) * Math.pow(D, 4) / 24;
	      F = 1 - A * Ee * Ee / 2 - D * Ee * Ee * Ee / 6;
	      psi = Math.asin(this.sin_p12 * Math.cos(Ee) + this.cos_p12 * Math.sin(Ee) * cosAz);
	      lon = adjust_lon(this.long0 + Math.asin(Math.sin(Az) * Math.sin(Ee) / Math.cos(psi)));
	      lat = Math.atan((1 - this.es * F * this.sin_p12 / Math.sin(psi)) * Math.tan(psi) / (1 - this.es));
	      p.x = lon;
	      p.y = lat;
	      return p;
	    }
	  }

	}

	var names$26 = ["Azimuthal_Equidistant", "aeqd"];
	var aeqd = {
	  init: init$25,
	  forward: forward$24,
	  inverse: inverse$24,
	  names: names$26
	};

	function init$26() {
	  //double temp;      /* temporary variable    */

	  /* Place parameters in static storage for common use
	      -------------------------------------------------*/
	  this.sin_p14 = Math.sin(this.lat0);
	  this.cos_p14 = Math.cos(this.lat0);
	}

	/* Orthographic forward equations--mapping lat,long to x,y
	    ---------------------------------------------------*/
	function forward$25(p) {
	  var sinphi, cosphi; /* sin and cos value        */
	  var dlon; /* delta longitude value      */
	  var coslon; /* cos of longitude        */
	  var ksp; /* scale factor          */
	  var g, x, y;
	  var lon = p.x;
	  var lat = p.y;
	  /* Forward equations
	      -----------------*/
	  dlon = adjust_lon(lon - this.long0);

	  sinphi = Math.sin(lat);
	  cosphi = Math.cos(lat);

	  coslon = Math.cos(dlon);
	  g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
	  ksp = 1;
	  if ((g > 0) || (Math.abs(g) <= EPSLN)) {
	    x = this.a * ksp * cosphi * Math.sin(dlon);
	    y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
	  }
	  p.x = x;
	  p.y = y;
	  return p;
	}

	function inverse$25(p) {
	  var rh; /* height above ellipsoid      */
	  var z; /* angle          */
	  var sinz, cosz; /* sin of z and cos of z      */
	  var con;
	  var lon, lat;
	  /* Inverse equations
	      -----------------*/
	  p.x -= this.x0;
	  p.y -= this.y0;
	  rh = Math.sqrt(p.x * p.x + p.y * p.y);
	  z = asinz(rh / this.a);

	  sinz = Math.sin(z);
	  cosz = Math.cos(z);

	  lon = this.long0;
	  if (Math.abs(rh) <= EPSLN) {
	    lat = this.lat0;
	    p.x = lon;
	    p.y = lat;
	    return p;
	  }
	  lat = asinz(cosz * this.sin_p14 + (p.y * sinz * this.cos_p14) / rh);
	  con = Math.abs(this.lat0) - HALF_PI;
	  if (Math.abs(con) <= EPSLN) {
	    if (this.lat0 >= 0) {
	      lon = adjust_lon(this.long0 + Math.atan2(p.x, - p.y));
	    }
	    else {
	      lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
	    }
	    p.x = lon;
	    p.y = lat;
	    return p;
	  }
	  lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz), rh * this.cos_p14 * cosz - p.y * this.sin_p14 * sinz));
	  p.x = lon;
	  p.y = lat;
	  return p;
	}

	var names$27 = ["ortho"];
	var ortho = {
	  init: init$26,
	  forward: forward$25,
	  inverse: inverse$25,
	  names: names$27
	};

	// QSC projection rewritten from the original PROJ4
	// https://github.com/OSGeo/proj.4/blob/master/src/PJ_qsc.c

	/* constants */
	var FACE_ENUM = {
	    FRONT: 1,
	    RIGHT: 2,
	    BACK: 3,
	    LEFT: 4,
	    TOP: 5,
	    BOTTOM: 6
	};

	var AREA_ENUM = {
	    AREA_0: 1,
	    AREA_1: 2,
	    AREA_2: 3,
	    AREA_3: 4
	};

	function init$27() {

	  this.x0 = this.x0 || 0;
	  this.y0 = this.y0 || 0;
	  this.lat0 = this.lat0 || 0;
	  this.long0 = this.long0 || 0;
	  this.lat_ts = this.lat_ts || 0;
	  this.title = this.title || "Quadrilateralized Spherical Cube";

	  /* Determine the cube face from the center of projection. */
	  if (this.lat0 >= HALF_PI - FORTPI / 2.0) {
	    this.face = FACE_ENUM.TOP;
	  } else if (this.lat0 <= -(HALF_PI - FORTPI / 2.0)) {
	    this.face = FACE_ENUM.BOTTOM;
	  } else if (Math.abs(this.long0) <= FORTPI) {
	    this.face = FACE_ENUM.FRONT;
	  } else if (Math.abs(this.long0) <= HALF_PI + FORTPI) {
	    this.face = this.long0 > 0.0 ? FACE_ENUM.RIGHT : FACE_ENUM.LEFT;
	  } else {
	    this.face = FACE_ENUM.BACK;
	  }

	  /* Fill in useful values for the ellipsoid <-> sphere shift
	   * described in [LK12]. */
	  if (this.es !== 0) {
	    this.one_minus_f = 1 - (this.a - this.b) / this.a;
	    this.one_minus_f_squared = this.one_minus_f * this.one_minus_f;
	  }
	}

	// QSC forward equations--mapping lat,long to x,y
	// -----------------------------------------------------------------
	function forward$26(p) {
	  var xy = {x: 0, y: 0};
	  var lat, lon;
	  var theta, phi;
	  var t, mu;
	  /* nu; */
	  var area = {value: 0};

	  // move lon according to projection's lon
	  p.x -= this.long0;

	  /* Convert the geodetic latitude to a geocentric latitude.
	   * This corresponds to the shift from the ellipsoid to the sphere
	   * described in [LK12]. */
	  if (this.es !== 0) {//if (P->es != 0) {
	    lat = Math.atan(this.one_minus_f_squared * Math.tan(p.y));
	  } else {
	    lat = p.y;
	  }

	  /* Convert the input lat, lon into theta, phi as used by QSC.
	   * This depends on the cube face and the area on it.
	   * For the top and bottom face, we can compute theta and phi
	   * directly from phi, lam. For the other faces, we must use
	   * unit sphere cartesian coordinates as an intermediate step. */
	  lon = p.x; //lon = lp.lam;
	  if (this.face === FACE_ENUM.TOP) {
	    phi = HALF_PI - lat;
	    if (lon >= FORTPI && lon <= HALF_PI + FORTPI) {
	      area.value = AREA_ENUM.AREA_0;
	      theta = lon - HALF_PI;
	    } else if (lon > HALF_PI + FORTPI || lon <= -(HALF_PI + FORTPI)) {
	      area.value = AREA_ENUM.AREA_1;
	      theta = (lon > 0.0 ? lon - SPI : lon + SPI);
	    } else if (lon > -(HALF_PI + FORTPI) && lon <= -FORTPI) {
	      area.value = AREA_ENUM.AREA_2;
	      theta = lon + HALF_PI;
	    } else {
	      area.value = AREA_ENUM.AREA_3;
	      theta = lon;
	    }
	  } else if (this.face === FACE_ENUM.BOTTOM) {
	    phi = HALF_PI + lat;
	    if (lon >= FORTPI && lon <= HALF_PI + FORTPI) {
	      area.value = AREA_ENUM.AREA_0;
	      theta = -lon + HALF_PI;
	    } else if (lon < FORTPI && lon >= -FORTPI) {
	      area.value = AREA_ENUM.AREA_1;
	      theta = -lon;
	    } else if (lon < -FORTPI && lon >= -(HALF_PI + FORTPI)) {
	      area.value = AREA_ENUM.AREA_2;
	      theta = -lon - HALF_PI;
	    } else {
	      area.value = AREA_ENUM.AREA_3;
	      theta = (lon > 0.0 ? -lon + SPI : -lon - SPI);
	    }
	  } else {
	    var q, r, s;
	    var sinlat, coslat;
	    var sinlon, coslon;

	    if (this.face === FACE_ENUM.RIGHT) {
	      lon = qsc_shift_lon_origin(lon, +HALF_PI);
	    } else if (this.face === FACE_ENUM.BACK) {
	      lon = qsc_shift_lon_origin(lon, +SPI);
	    } else if (this.face === FACE_ENUM.LEFT) {
	      lon = qsc_shift_lon_origin(lon, -HALF_PI);
	    }
	    sinlat = Math.sin(lat);
	    coslat = Math.cos(lat);
	    sinlon = Math.sin(lon);
	    coslon = Math.cos(lon);
	    q = coslat * coslon;
	    r = coslat * sinlon;
	    s = sinlat;

	    if (this.face === FACE_ENUM.FRONT) {
	      phi = Math.acos(q);
	      theta = qsc_fwd_equat_face_theta(phi, s, r, area);
	    } else if (this.face === FACE_ENUM.RIGHT) {
	      phi = Math.acos(r);
	      theta = qsc_fwd_equat_face_theta(phi, s, -q, area);
	    } else if (this.face === FACE_ENUM.BACK) {
	      phi = Math.acos(-q);
	      theta = qsc_fwd_equat_face_theta(phi, s, -r, area);
	    } else if (this.face === FACE_ENUM.LEFT) {
	      phi = Math.acos(-r);
	      theta = qsc_fwd_equat_face_theta(phi, s, q, area);
	    } else {
	      /* Impossible */
	      phi = theta = 0;
	      area.value = AREA_ENUM.AREA_0;
	    }
	  }

	  /* Compute mu and nu for the area of definition.
	   * For mu, see Eq. (3-21) in [OL76], but note the typos:
	   * compare with Eq. (3-14). For nu, see Eq. (3-38). */
	  mu = Math.atan((12 / SPI) * (theta + Math.acos(Math.sin(theta) * Math.cos(FORTPI)) - HALF_PI));
	  t = Math.sqrt((1 - Math.cos(phi)) / (Math.cos(mu) * Math.cos(mu)) / (1 - Math.cos(Math.atan(1 / Math.cos(theta)))));

	  /* Apply the result to the real area. */
	  if (area.value === AREA_ENUM.AREA_1) {
	    mu += HALF_PI;
	  } else if (area.value === AREA_ENUM.AREA_2) {
	    mu += SPI;
	  } else if (area.value === AREA_ENUM.AREA_3) {
	    mu += 1.5 * SPI;
	  }

	  /* Now compute x, y from mu and nu */
	  xy.x = t * Math.cos(mu);
	  xy.y = t * Math.sin(mu);
	  xy.x = xy.x * this.a + this.x0;
	  xy.y = xy.y * this.a + this.y0;

	  p.x = xy.x;
	  p.y = xy.y;
	  return p;
	}

	// QSC inverse equations--mapping x,y to lat/long
	// -----------------------------------------------------------------
	function inverse$26(p) {
	  var lp = {lam: 0, phi: 0};
	  var mu, nu, cosmu, tannu;
	  var tantheta, theta, cosphi, phi;
	  var t;
	  var area = {value: 0};

	  /* de-offset */
	  p.x = (p.x - this.x0) / this.a;
	  p.y = (p.y - this.y0) / this.a;

	  /* Convert the input x, y to the mu and nu angles as used by QSC.
	   * This depends on the area of the cube face. */
	  nu = Math.atan(Math.sqrt(p.x * p.x + p.y * p.y));
	  mu = Math.atan2(p.y, p.x);
	  if (p.x >= 0.0 && p.x >= Math.abs(p.y)) {
	    area.value = AREA_ENUM.AREA_0;
	  } else if (p.y >= 0.0 && p.y >= Math.abs(p.x)) {
	    area.value = AREA_ENUM.AREA_1;
	    mu -= HALF_PI;
	  } else if (p.x < 0.0 && -p.x >= Math.abs(p.y)) {
	    area.value = AREA_ENUM.AREA_2;
	    mu = (mu < 0.0 ? mu + SPI : mu - SPI);
	  } else {
	    area.value = AREA_ENUM.AREA_3;
	    mu += HALF_PI;
	  }

	  /* Compute phi and theta for the area of definition.
	   * The inverse projection is not described in the original paper, but some
	   * good hints can be found here (as of 2011-12-14):
	   * http://fits.gsfc.nasa.gov/fitsbits/saf.93/saf.9302
	   * (search for "Message-Id: <9302181759.AA25477 at fits.cv.nrao.edu>") */
	  t = (SPI / 12) * Math.tan(mu);
	  tantheta = Math.sin(t) / (Math.cos(t) - (1 / Math.sqrt(2)));
	  theta = Math.atan(tantheta);
	  cosmu = Math.cos(mu);
	  tannu = Math.tan(nu);
	  cosphi = 1 - cosmu * cosmu * tannu * tannu * (1 - Math.cos(Math.atan(1 / Math.cos(theta))));
	  if (cosphi < -1) {
	    cosphi = -1;
	  } else if (cosphi > +1) {
	    cosphi = +1;
	  }

	  /* Apply the result to the real area on the cube face.
	   * For the top and bottom face, we can compute phi and lam directly.
	   * For the other faces, we must use unit sphere cartesian coordinates
	   * as an intermediate step. */
	  if (this.face === FACE_ENUM.TOP) {
	    phi = Math.acos(cosphi);
	    lp.phi = HALF_PI - phi;
	    if (area.value === AREA_ENUM.AREA_0) {
	      lp.lam = theta + HALF_PI;
	    } else if (area.value === AREA_ENUM.AREA_1) {
	      lp.lam = (theta < 0.0 ? theta + SPI : theta - SPI);
	    } else if (area.value === AREA_ENUM.AREA_2) {
	      lp.lam = theta - HALF_PI;
	    } else /* area.value == AREA_ENUM.AREA_3 */ {
	      lp.lam = theta;
	    }
	  } else if (this.face === FACE_ENUM.BOTTOM) {
	    phi = Math.acos(cosphi);
	    lp.phi = phi - HALF_PI;
	    if (area.value === AREA_ENUM.AREA_0) {
	      lp.lam = -theta + HALF_PI;
	    } else if (area.value === AREA_ENUM.AREA_1) {
	      lp.lam = -theta;
	    } else if (area.value === AREA_ENUM.AREA_2) {
	      lp.lam = -theta - HALF_PI;
	    } else /* area.value == AREA_ENUM.AREA_3 */ {
	      lp.lam = (theta < 0.0 ? -theta - SPI : -theta + SPI);
	    }
	  } else {
	    /* Compute phi and lam via cartesian unit sphere coordinates. */
	    var q, r, s;
	    q = cosphi;
	    t = q * q;
	    if (t >= 1) {
	      s = 0;
	    } else {
	      s = Math.sqrt(1 - t) * Math.sin(theta);
	    }
	    t += s * s;
	    if (t >= 1) {
	      r = 0;
	    } else {
	      r = Math.sqrt(1 - t);
	    }
	    /* Rotate q,r,s into the correct area. */
	    if (area.value === AREA_ENUM.AREA_1) {
	      t = r;
	      r = -s;
	      s = t;
	    } else if (area.value === AREA_ENUM.AREA_2) {
	      r = -r;
	      s = -s;
	    } else if (area.value === AREA_ENUM.AREA_3) {
	      t = r;
	      r = s;
	      s = -t;
	    }
	    /* Rotate q,r,s into the correct cube face. */
	    if (this.face === FACE_ENUM.RIGHT) {
	      t = q;
	      q = -r;
	      r = t;
	    } else if (this.face === FACE_ENUM.BACK) {
	      q = -q;
	      r = -r;
	    } else if (this.face === FACE_ENUM.LEFT) {
	      t = q;
	      q = r;
	      r = -t;
	    }
	    /* Now compute phi and lam from the unit sphere coordinates. */
	    lp.phi = Math.acos(-s) - HALF_PI;
	    lp.lam = Math.atan2(r, q);
	    if (this.face === FACE_ENUM.RIGHT) {
	      lp.lam = qsc_shift_lon_origin(lp.lam, -HALF_PI);
	    } else if (this.face === FACE_ENUM.BACK) {
	      lp.lam = qsc_shift_lon_origin(lp.lam, -SPI);
	    } else if (this.face === FACE_ENUM.LEFT) {
	      lp.lam = qsc_shift_lon_origin(lp.lam, +HALF_PI);
	    }
	  }

	  /* Apply the shift from the sphere to the ellipsoid as described
	   * in [LK12]. */
	  if (this.es !== 0) {
	    var invert_sign;
	    var tanphi, xa;
	    invert_sign = (lp.phi < 0 ? 1 : 0);
	    tanphi = Math.tan(lp.phi);
	    xa = this.b / Math.sqrt(tanphi * tanphi + this.one_minus_f_squared);
	    lp.phi = Math.atan(Math.sqrt(this.a * this.a - xa * xa) / (this.one_minus_f * xa));
	    if (invert_sign) {
	      lp.phi = -lp.phi;
	    }
	  }

	  lp.lam += this.long0;
	  p.x = lp.lam;
	  p.y = lp.phi;
	  return p;
	}

	/* Helper function for forward projection: compute the theta angle
	 * and determine the area number. */
	function qsc_fwd_equat_face_theta(phi, y, x, area) {
	  var theta;
	  if (phi < EPSLN) {
	    area.value = AREA_ENUM.AREA_0;
	    theta = 0.0;
	  } else {
	    theta = Math.atan2(y, x);
	    if (Math.abs(theta) <= FORTPI) {
	      area.value = AREA_ENUM.AREA_0;
	    } else if (theta > FORTPI && theta <= HALF_PI + FORTPI) {
	      area.value = AREA_ENUM.AREA_1;
	      theta -= HALF_PI;
	    } else if (theta > HALF_PI + FORTPI || theta <= -(HALF_PI + FORTPI)) {
	      area.value = AREA_ENUM.AREA_2;
	      theta = (theta >= 0.0 ? theta - SPI : theta + SPI);
	    } else {
	      area.value = AREA_ENUM.AREA_3;
	      theta += HALF_PI;
	    }
	  }
	  return theta;
	}

	/* Helper function: shift the longitude. */
	function qsc_shift_lon_origin(lon, offset) {
	  var slon = lon + offset;
	  if (slon < -SPI) {
	    slon += TWO_PI;
	  } else if (slon > +SPI) {
	    slon -= TWO_PI;
	  }
	  return slon;
	}

	var names$28 = ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"];
	var qsc = {
	  init: init$27,
	  forward: forward$26,
	  inverse: inverse$26,
	  names: names$28
	};

	var includedProjections = function(proj4){
	  proj4.Proj.projections.add(tmerc);
	  proj4.Proj.projections.add(etmerc);
	  proj4.Proj.projections.add(utm);
	  proj4.Proj.projections.add(sterea);
	  proj4.Proj.projections.add(stere);
	  proj4.Proj.projections.add(somerc);
	  proj4.Proj.projections.add(omerc);
	  proj4.Proj.projections.add(lcc);
	  proj4.Proj.projections.add(krovak);
	  proj4.Proj.projections.add(cass);
	  proj4.Proj.projections.add(laea);
	  proj4.Proj.projections.add(aea);
	  proj4.Proj.projections.add(gnom);
	  proj4.Proj.projections.add(cea);
	  proj4.Proj.projections.add(eqc);
	  proj4.Proj.projections.add(poly);
	  proj4.Proj.projections.add(nzmg);
	  proj4.Proj.projections.add(mill);
	  proj4.Proj.projections.add(sinu);
	  proj4.Proj.projections.add(moll);
	  proj4.Proj.projections.add(eqdc);
	  proj4.Proj.projections.add(vandg);
	  proj4.Proj.projections.add(aeqd);
	  proj4.Proj.projections.add(ortho);
	  proj4.Proj.projections.add(qsc);
	};

	proj4$1.defaultDatum = 'WGS84'; //default datum
	proj4$1.Proj = Projection$1;
	proj4$1.WGS84 = new proj4$1.Proj('WGS84');
	proj4$1.Point = Point;
	proj4$1.toPoint = toPoint;
	proj4$1.defs = defs;
	proj4$1.transform = transform;
	proj4$1.mgrs = mgrs;
	proj4$1.version = version;
	includedProjections(proj4$1);

	return proj4$1;

})));

},{}]},{},[1]);
