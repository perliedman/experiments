module.exports = function (canvas, name) {
  var link = document.createElement('a')
  link.addEventListener('click', function(ev) {
      link.href = canvas.toDataURL()
      link.download = name || 'unnamed.png'
  }, false)

  return link
}
