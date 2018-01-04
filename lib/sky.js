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
