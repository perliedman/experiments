(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Sky = require('../lib/sky')
var Delaunator = require('delaunator')
var createLink = require('../lib/save-canvas-link')

var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var context = canvas.getContext('2d')
var imageData = context.createImageData(canvas.width, canvas.height)

document.body.appendChild(canvas)
var saveLink = createLink(canvas, 'frosted-glass.png')
saveLink.id = 'save'
saveLink.innerText = 'Save'
document.body.appendChild(saveLink)

var sky = new Sky(3, 1.45, Math.PI/2)

var points = [[0, 0], [0, canvas.height], [canvas.width, 0], [canvas.width, canvas.height]]
for (var i = 0; i < 1000; i++) {
  points.push([
    Math.round(Math.random() * canvas.width),
    Math.round(Math.random() * canvas.height),
  ])
}
var delaunay = new Delaunator(points)
var triangles = delaunay.triangles
var ratio = canvas.height / canvas.width
var sx = Math.PI / canvas.width*3
var sy = Math.PI/4 / canvas.height / ratio
var ox = -canvas.width * 1
var oy = canvas.height * 1

function up () {
  var t = +new Date() / 2000
  var dx = (canvas.width * 0.25) * Math.sin(t*0.233)
  var dy = (canvas.width * 0.25) * Math.cos(t)
  var r = Math.PI/4 * Math.cos(t*0.067)

  var solarZenith = 1.45+Math.cos(t) * Math.PI/16
  sky.setSolarPos(3, solarZenith, Math.PI/2)

  for (i = 0; i < triangles.length; i += 3) {
    var cx =
      (points[triangles[i]][0] +
      points[triangles[i + 1]][0] +
      points[triangles[i + 2]][0]) / 3 + dx
    var cy =
      (points[triangles[i]][1] +
      points[triangles[i + 1]][1] +
      points[triangles[i + 2]][1]) / 3 + dy
    var x = (cx + ox) * sx
    var y = (-cy - oy) * sy

    var azimuth = x * Math.cos(r) + y * Math.sin(r)
    var zenith = x * Math.sin(r) - y * Math.cos(r)

    var rgba = sky.rgba(azimuth, Math.max(-0.5*Math.PI, zenith))
    rgba.forEach(function(v, i) {rgba[i] = Math.round(v * 255)})

    context.fillStyle = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`
    context.strokeStyle = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${Math.round(rgba[3]*0.5)})`
    context.beginPath()
    context.moveTo(points[triangles[i]][0], points[triangles[i]][1])
    context.lineTo(points[triangles[i + 1]][0], points[triangles[i + 1]][1])
    context.lineTo(points[triangles[i + 2]][0], points[triangles[i + 2]][1])
    context.closePath()
    context.stroke()
    context.fill()
  }

  requestAnimationFrame(up)
}

up()

},{"../lib/save-canvas-link":2,"../lib/sky":3,"delaunator":4}],2:[function(require,module,exports){
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
/*
  This is more or less a straight port of the codeb by
  Nico Schertler found on
  https://nicoschertler.wordpress.com/2013/04/03/simulating-a-days-sky/

  License unknown, but I assume it's free to use.

  The code is based on the paper "A Practical Analytic Model for Daylight"
  by A. J. Preetham, Peter Shirley, Brian Smits
  http://www.cs.utah.edu/~shirley/papers/sunsky/sunsky.pdf
*/

function Sky(turbidity, solarZenith, solarAzimuth) {
  this.setSolarPos(turbidity, solarZenith, solarAzimuth)
}

module.exports = Sky

Sky.prototype = {
  setSolarPos: function (turbidity, solarZenith, solarAzimuth) {
    this.turbidity = turbidity
    this.solarZenith = solarZenith
    this.solarAzimuth = solarAzimuth

    this.calculateZenitalAbsolutes()
    this.calculateCoefficents()
  },

  calculateZenitalAbsolutes: function () {
    var turbidity = this.turbidity
    var Y = function (e) {
      return (4.0453 * turbidity - 4.9710) * Math.tan((4.0 / 9 - turbidity / 120) * e) - 0.2155 * turbidity + 2.4192
    }

    var solarZenith = this.solarZenith

    var Yz = Y(Math.PI - 2 * solarZenith)
    var Y0 = Y(Math.PI)
    this.Yz = (Yz / Y0)
 
    var z3 = Math.pow(solarZenith, 3);
    var z2 = solarZenith * solarZenith;
    var z = solarZenith;
    var T_vec = [turbidity * turbidity, turbidity, 1];
    var z_vec = [z3, z2, z, 1]
 
    var x = mul([
        [0.00166, -0.00375, 0.00209, 0],
        [-0.02903, 0.06377, -0.03202, 0.00394],
        [0.11693, -0.21196, 0.06052, 0.25886],
        [0, 0, 0, 0]
      ],
      z_vec);
    var xz = dot(T_vec, x);
    this.xz = xz;
 
    var y = mul([
        [0.00275, -0.00610, 0.00317, 0],
        [-0.04214, 0.08970, -0.04153, 0.00516],
        [0.15346, -0.26756, 0.06670, 0.26688],
        [0, 0, 0, 0]
      ],
      z_vec);
    var yz = dot(T_vec, y);
    this.yz = yz;
  },

  calculateCoefficents: function () {
    var turbidity = this.turbidity
    this.coeffs = {
      coeffsY: {
        A: 0.1787 * turbidity - 1.4630,
        B: -0.3554 * turbidity + 0.4275,
        C: -0.0227 * turbidity + 5.3251,
        D: 0.1206 * turbidity - 2.5771,
        E: -0.0670 * turbidity + 0.3703,
      },
      coeffsx: {
        A: -0.0193 * turbidity - 0.2592,
        B: -0.0665 * turbidity + 0.0008,
        C: -0.0004 * turbidity + 0.2125,
        D: -0.0641 * turbidity - 0.8989,
        E: -0.0033 * turbidity + 0.0452,
      },
      coeffsy: {
        A: -0.0167 * turbidity - 0.2608,
        B: -0.0950 * turbidity + 0.0092,
        C: -0.0079 * turbidity + 0.2102,
        D: -0.0441 * turbidity - 1.6537,
        E: -0.0109 * turbidity + 0.0529,
      }
    }
  },

  perez: function (zenith, gamma, coeffs) {
    return (1 + coeffs.A*Math.exp(coeffs.B/Math.cos(zenith)))*
      (1 + coeffs.C*Math.exp(coeffs.D*gamma)+coeffs.E*Math.pow(Math.cos(gamma),2))
  },

  cieToRgb: function (Y, x, y) {
    var X = x/y*Y;
    var Z = (1-x-y)/y*Y;
    return mul([
        [3.2406, - 1.5372, -0.4986, 0],
        [-0.9689, 1.8758, 0.0415, 0],
        [0.0557, -0.2040, 1.0570, 0],
        [0, 0, 0, 1]
      ],
      [X, Y, Z, 1])
  },

  gamma: function (zenith, azimuth) {
    var solarZenith = this.solarZenith
    return Math.acos(Math.sin(solarZenith)*Math.sin(zenith)*Math.cos(azimuth-this.solarAzimuth)+Math.cos(solarZenith)*Math.cos(zenith))
  },

  rgba: function (azimuth, zenith) {
    var solarZenith = this.solarZenith;

    var g = this.gamma(zenith, azimuth);
    zenith = Math.min(zenith, Math.PI/2.0);
    var Yp = this.Yz * this.perez(zenith, g, this.coeffs.coeffsY) / this.perez(0, solarZenith, this.coeffs.coeffsY);
    var xp = this.xz * this.perez(zenith, g, this.coeffs.coeffsx) / this.perez(0, solarZenith, this.coeffs.coeffsx);
    var yp = this.yz * this.perez(zenith, g, this.coeffs.coeffsy) / this.perez(0, solarZenith, this.coeffs.coeffsy);

    return this.cieToRgb(Yp, xp, yp);
  }
}

function dot(v1, v2) {
  return v1.reduce(function(a, c, i) { return a + c*v2[i]; }, 0);
}

function mul(mat, v) {
  return mat.map(function (r) { return dot(r, v) })
}

},{}],4:[function(require,module,exports){
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

},{}]},{},[1]);
