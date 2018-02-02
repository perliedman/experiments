var txtgen = require('txtgen')
var createLink = require('../lib/save-canvas-link')
var vintagejs = require('vintagejs')
var flatten = as => [].concat.apply([], as)

function wordWrap(ctx, text, maxWidth, scale, lineWidth) {
  var lines = []
  var words = text.split(' ')
  var currLine = ''
  var currWidth = 0
  for (var i = 0; i < words.length; i++) {
    var wordWidth = Math.max(lineWidth/4, ctx.measureText(words[i]).width * scale) + lineWidth * 1.5
    if (currWidth + wordWidth > maxWidth) {
      lines.push(currLine)
      currLine = ''
      currWidth = 0
    }
    currLine += (currLine ? ' ' : '') + words[i]
    currWidth += wordWidth
  }

  if (currLine) {
    lines.push(currLine)
  }

  return lines
}

function writeLine(ctx, x, y, text, scale, lineWidth) {
  var words = text.split(' ')

  if (words.length === 0 || (words.length === 1 && !words[0])) return

  for (var i = 0; i < words.length; i++) {
    var width = Math.max(lineWidth/4, ctx.measureText(words[i]).width * scale - lineWidth * 1.5)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + width, y)
    ctx.stroke()
    ctx.closePath()

    x += width + lineWidth*1.5
  }
}

var width = 512
var scale = 0.33
var margin = 32
var lineWidth = 8
var lineHeight = lineWidth * 1.67

var canvas = document.createElement('canvas')
canvas.width = width
canvas.height = width
var context = canvas.getContext('2d')
document.body.appendChild(canvas)
var saveLink = createLink(canvas, 'text.png')
saveLink.id = 'save'
saveLink.innerText = 'Save'
document.body.appendChild(saveLink)

context.fillRect(0, 0, width, width)

var article = txtgen.article()
console.log(article)
var lines = flatten(article.split('\n').map(paragraph => wordWrap(context, paragraph, (width - margin * 3), scale, lineWidth).concat([''])))

// Solarized
context.fillStyle = '#073642'
var colors = [
  '#b58900',
  '#cb4b16',
  '#dc322f',
  '#d33682',
  '#6c71c4',
  '#268bd2',
  '#2aa198',
  '#859900'
]

// Molokai
context.fillStyle = '#1B1D1E'
var colors = [
  '#AE81FF',
  '#E6DB74',
  '#F92672',
  '#AE81FF',
  '#BCA3A3',
  '#66D9EF',
  '#8F8F8F',
  '#A6E22E'
]

context.font = '24px sans-serif'
context.lineWidth = lineWidth
context.lineCap = 'round'

var y = margin
for (var i = 0; i < lines.length; i++) {
  context.strokeStyle = colors[i % colors.length]
  writeLine(context, margin, y, lines[i], scale, lineWidth)
  y += lineHeight
  if (y > width - margin) break
}

vintagejs(canvas, { brightness: 0.2 })
  .then(res => {
    context.drawImage(res.getCanvas(), 0, 0, canvas.width, canvas.height);
  });
