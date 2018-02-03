module.exports = function(url, cb) {
  var img = document.createElement('img')
  img.src = url
  img.onload = function() {
    cb(null, img)
  }
}
