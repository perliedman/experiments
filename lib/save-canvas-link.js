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
