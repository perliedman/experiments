(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var txtgen = require('txtgen')
var createLink = require('../lib/save-canvas-link')
// var vintagejs = require('vintagejs')
var flatten = as => [].concat.apply([], as)

var insertCss = require('insert-css')
insertCss(`
  body {
    display: flex;
    height: 100vh;
  }

  canvas {
    border: 4px solid white;
    margin: auto;  /* Magic! */
  }
`)

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

// vintagejs(canvas, { brightness: 0.2 })
//   .then(res => {
//     context.drawImage(res.getCanvas(), 0, 0, canvas.width, canvas.height);
//   });

},{"../lib/save-canvas-link":2,"insert-css":3,"txtgen":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var containers = []; // will store container HTMLElement references
var styleElements = []; // will store {prepend: HTMLElement, append: HTMLElement}

var usage = 'insert-css: You need to provide a CSS string. Usage: insertCss(cssString[, options]).';

function insertCss(css, options) {
    options = options || {};

    if (css === undefined) {
        throw new Error(usage);
    }

    var position = options.prepend === true ? 'prepend' : 'append';
    var container = options.container !== undefined ? options.container : document.querySelector('head');
    var containerId = containers.indexOf(container);

    // first time we see this container, create the necessary entries
    if (containerId === -1) {
        containerId = containers.push(container) - 1;
        styleElements[containerId] = {};
    }

    // try to get the correponding container + position styleElement, create it otherwise
    var styleElement;

    if (styleElements[containerId] !== undefined && styleElements[containerId][position] !== undefined) {
        styleElement = styleElements[containerId][position];
    } else {
        styleElement = styleElements[containerId][position] = createStyleElement();

        if (position === 'prepend') {
            container.insertBefore(styleElement, container.childNodes[0]);
        } else {
            container.appendChild(styleElement);
        }
    }

    // strip potential UTF-8 BOM if css was read from a file
    if (css.charCodeAt(0) === 0xFEFF) { css = css.substr(1, css.length); }

    // actually add the stylesheet
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText += css
    } else {
        styleElement.textContent += css;
    }

    return styleElement;
};

function createStyleElement() {
    var styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    return styleElement;
}

module.exports = insertCss;
module.exports.insertCss = insertCss;

},{}],4:[function(require,module,exports){
// txtgen@2.0.01, by @ndaidong - built on Thu, 15 Jun 2017 15:35:10 GMT - published under MIT license
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.txtgen=e.txtgen||{})}(this,function(e){"use strict";var n=function(e){for(var n=[],t=0;t<e.length;t++)-1===n.indexOf(e[t])&&n.push(e[t]);return n},t=function(e,n){var t=e,a=n-e+1;return Math.floor(Math.random()*a)+t},a=function(e){for(var n=void 0;!n;)n=e[t(0,e.length-1)];return n},i=function(){var e=".......!?!?;...".split("");return a(e)},o=function(e){return e.endsWith("s")?e:(e.match(/(ss|ish|ch|x|us)$/)?e+="e":e.endsWith("y")&&!c.includes(e.charAt(e.length-2))&&(e=e.slice(0,e.length-1),e+="ie"),e+"s")},r=function(e){var n="a";return e.match(/^(a|e|i|o)/)&&(n="an"),n+" "+e},s=["alligator","ant","bear","bee","bird","camel","cat","cheetah","chicken","chimpanzee","cow","crocodile","deer","dog","dolphin","duck","eagle","elephant","fish","fly","fox","frog","giraffe","goat","goldfish","hamster","hippopotamus","horse","kangaroo","kitten","lion","lobster","monkey","octopus","owl","panda","pig","puppy","rabbit","rat","scorpion","seal","shark","sheep","snail","snake","spider","squirrel","tiger","turtle","wolf","zebra","apple","apricot","banana","blackberry","blueberry","cherry","cranberry","currant","fig","grape","grapefruit","grapes","kiwi","kumquat","lemon","lime","melon","nectarine","orange","peach","pear","persimmon","pineapple","plum","pomegranate","prune","raspberry","strawberry","tangerine","watermelon"],u=["adaptable","adventurous","affable","affectionate","agreeable","alert","alluring","ambitious","ambitious","amiable","amicable","amused","amusing","boundless","brave","brave","bright","bright","broad-minded","calm","calm","capable","careful","charming","charming","cheerful","coherent","comfortable","communicative","compassionate","confident","conscientious","considerate","convivial","cooperative","courageous","courageous","courteous","creative","credible","cultured","dashing","dazzling","debonair","decisive","decisive","decorous","delightful","detailed","determined","determined","diligent","diligent","diplomatic","discreet","discreet","dynamic","dynamic","eager","easygoing","efficient","elated","eminent","emotional","enchanting","encouraging","endurable","energetic","energetic","entertaining","enthusiastic","enthusiastic","excellent","excited","exclusive","exuberant","exuberant","fabulous","fair","fair-minded","faithful","faithful","fantastic","fearless","fearless","fine","forceful","frank","frank","friendly","friendly","funny","funny","generous","generous","gentle","gentle","glorious","good","good","gregarious","happy","hard-working","harmonious","helpful","helpful","hilarious","honest","honorable","humorous","imaginative","impartial","impartial","independent","industrious","instinctive","intellectual","intelligent","intuitive","inventive","jolly","joyous","kind","kind","kind-hearted","knowledgeable","level","likeable","lively","lovely","loving","loving","loyal","lucky","mature","modern","modest","neat","nice","nice","obedient","optimistic","painstaking","passionate","patient","peaceful","perfect","persistent","philosophical","pioneering","placid","placid","plausible","pleasant","plucky","plucky","polite","powerful","practical","pro-active","productive","protective","proud","punctual","quick-witted","quiet","quiet","rational","receptive","reflective","reliable","relieved","reserved","resolute","resourceful","responsible","rhetorical","righteous","romantic","romantic","sedate","seemly","selective","self-assured","self-confident","self-disciplined","sensible","sensitive","sensitive","shrewd","shy","silly","sincere","sincere","skillful","smiling","sociable","splendid","steadfast","stimulating","straightforward","successful","succinct","sympathetic","talented","thoughtful","thoughtful","thrifty","tidy","tough","tough","trustworthy","unassuming","unbiased","understanding","unusual","upbeat","versatile","vigorous","vivacious","warm","warmhearted","willing","willing","wise","witty","witty","wonderful"],c=["a","e","i","o","u","y"],l=["the {{noun}} is {{a_noun}}","{{a_noun}} is {{an_adjective}} {{noun}}","the first {{adjective}} {{noun}} is, in its own way, {{a_noun}}","their {{noun}} was, in this moment, {{an_adjective}} {{noun}}","{{a_noun}} is {{a_noun}} from the right perspective","the literature would have us believe that {{an_adjective}} {{noun}} is not but {{a_noun}}","{{an_adjective}} {{noun}} is {{a_noun}} of the mind","the {{adjective}} {{noun}} reveals itself as {{an_adjective}} {{noun}} to those who look","authors often misinterpret the {{noun}} as {{an_adjective}} {{noun}}, when in actuality it feels more like {{an_adjective}} {{noun}}","we can assume that any instance of {{a_noun}} can be construed as {{an_adjective}} {{noun}}","they were lost without the {{adjective}} {{noun}} that composed their {{noun}}","the {{adjective}} {{noun}} comes from {{an_adjective}} {{noun}}","{{a_noun}} can hardly be considered {{an_adjective}} {{noun}} without also being {{a_noun}}","few can name {{an_adjective}} {{noun}} that isn't {{an_adjective}} {{noun}}","some posit the {{adjective}} {{noun}} to be less than {{adjective}}","{{a_noun}} of the {{noun}} is assumed to be {{an_adjective}} {{noun}}","{{a_noun}} sees {{a_noun}} as {{an_adjective}} {{noun}}","the {{noun}} of {{a_noun}} becomes {{an_adjective}} {{noun}}","{{a_noun}} is {{a_noun}}'s {{noun}}","{{a_noun}} is the {{noun}} of {{a_noun}}","{{an_adjective}} {{noun}}'s {{noun}} comes with it the thought that the {{adjective}} {{noun}} is {{a_noun}}","{{nouns}} are {{adjective}} {{nouns}}","{{adjective}} {{nouns}} show us how {{nouns}} can be {{nouns}}","before {{nouns}}, {{nouns}} were only {{nouns}}","those {{nouns}} are nothing more than {{nouns}}","some {{adjective}} {{nouns}} are thought of simply as {{nouns}}","one cannot separate {{nouns}} from {{adjective}} {{nouns}}","the {{nouns}} could be said to resemble {{adjective}} {{nouns}}","{{an_adjective}} {{noun}} without {{nouns}} is truly a {{noun}} of {{adjective}} {{nouns}}"],d=["to be more specific, ","in recent years, ","however, ","by the way","of course, ","some assert that ","if this was somewhat unclear, ","unfortunately, that is wrong; on the contrary, ","it's very tricky, if not impossible, ","this could be, or perhaps ","this is not to discredit the idea that ","we know that ","it's an undeniable fact, really; ","framed in a different way, ","what we don't know for sure is whether or not ","as far as we can estimate, ","as far as he is concerned, ","the zeitgeist contends that ","though we assume the latter, ","far from the truth, ","extending this logic, ","nowhere is it disputed that ","in modern times ","in ancient times ","recent controversy aside, ","washing and polishing the car,","having been a gymnast, ","after a long day at school and work, ","waking to the buzz of the alarm clock, ","draped neatly on a hanger, ","shouting with happiness, "],h=["noun","a_noun","nouns","adjective","an_adjective"],f={noun:function(){return a(s)},a_noun:function(){return r(a(s))},nouns:function(){return o(a(s))},adjective:function(){return a(u)},an_adjective:function(){return r(a(u))}},p=function(e){return e.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").replace(/\r?\n|\r/g," ").replace(/\s\s+|\r/g," ")},g=function(e){var n=e,t=e.match(/\{\{(.+?)\}\}/g);if(t&&t.length)for(var a=0;a<t.length;a++){var i=p(t[a].replace("{{","").replace("}}","")),o=void 0;h.includes(i)&&(o=f[i]()),n=n.replace(t[a],o)}return n},v=function(){return Math.random()<.33?a(d):""},m=function(){return g(a(l))},b=function(){var e=v()+m();return e=e.charAt(0).toUpperCase()+e.slice(1),e+=i()},y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;e||(e=t(3,10));for(var n=Math.min(e,15),a=[];a.length<n;){var i=b();a.push(i)}return a.join(" ")};e.sentence=b,e.paragraph=y,e.article=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;e||(e=t(3,10));for(var n=Math.min(e,15),a=[];a.length<n;){var i=y();a.push(i)}return a.join("\n\n")},e.addNouns=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=s.concat(e);return(s=n(t)).length},e.addAdjectives=function(e){var t=u.concat(e);return(u=n(t)).length},e.addTemplates=function(e){var t=l.concat(e);return(l=n(t)).length},Object.defineProperty(e,"__esModule",{value:!0})});
},{}]},{},[1]);
