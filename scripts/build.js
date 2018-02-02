#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const browserify = require('browserify')

fs.readdir('./', (err, items) => {
  if (err) { return console.error(err) }  

  const descriptions = []

  items
    .map((item) => ({ entry: item, stat: fs.statSync(item) }))
    .filter(({entry, stat}) => stat.isDirectory() && /\d+/g.exec(entry))
    .forEach(({entry}) => {
      const descPath = path.join('.', entry, 'index.json')
      const srcPath = path.join('.', entry, 'index.js')
      const bundlePath = path.join('.', entry, 'bundle.js')
      const htmlPath = path.join('.', entry, 'built.html')
      const bundleStream = fs.createWriteStream(bundlePath)
      const htmlStream = fs.createWriteStream(htmlPath)

      try {
        descriptions[Number(entry) - 1] = JSON.parse(fs.readFileSync(descPath))
      } catch (e) {
        descriptions[Number(entry) - 1] = {title: 'unnamed', description: ''}
      }

      browserify()
        .add(srcPath)
        .bundle()
        .pipe(bundleStream)

      htmlStream.write(indexTemplate)
      htmlStream.end()
    })

    fs.writeFileSync('index.js', `window.descriptions = ${JSON.stringify(descriptions)}`)
});

const indexTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>Experiment</title>
  <meta name="viewport" content="initial-scale=1, maximum-scale=1">
  <style>
    body {
      background-color:black;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <script src="bundle.js"></script>
</body>
</html>
`
