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
    var solarZenith = this.solarZenith

    var Yz = (4.0453 * turbidity - 4.9710) * Math.tan((4.0 / 9 - turbidity / 120) * (Math.PI - 2 * solarZenith)) - 0.2155 * turbidity + 2.4192;
    var Y0 = (4.0453 * turbidity - 4.9710) * Math.tan((4.0 / 9 - turbidity / 120) * (Math.PI)) - 0.2155 * turbidity + 2.4192; ;
    this.Yz = (Yz / Y0);
 
    var z3 = Math.pow(solarZenith, 3);
    var z2 = solarZenith * solarZenith;
    var z = solarZenith;
    var T_vec = [turbidity * turbidity, turbidity, 1];
 
    var x = [
        0.00166 * z3 - 0.00375 * z2 + 0.00209 * z,
        -0.02903 * z3 + 0.06377 * z2 - 0.03202 * z + 0.00394,
        0.11693 * z3 - 0.21196 * z2 + 0.06052 * z + 0.25886];
    var xz = dot(T_vec, x);
    this.xz = xz;
 
    var y = [
        0.00275 * z3 - 0.00610 * z2 + 0.00317 * z,
        -0.04214 * z3 + 0.08970 * z2 - 0.04153 * z + 0.00516,
        0.15346 * z3 - 0.26756 * z2 + 0.06670 * z + 0.26688];
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

  RGB: function (Y, x, y) {
    var X = x/y*Y;
    var Z = (1-x-y)/y*Y;
    return [
      3.2406 * X - 1.5372 * Y - 0.4986 * Z,
      -0.9689 * X + 1.8758 * Y + 0.0415 * Z,
      0.0557 * X - 0.2040 * Y + 1.0570 * Z,
      1
    ]
  },

  gamma: function (zenith, azimuth) {
    var solarZenith = this.solarZenith
    return Math.acos(Math.sin(solarZenith)*Math.sin(zenith)*Math.cos(azimuth-this.solarAzimuth)+Math.cos(solarZenith)*Math.cos(zenith))
  },

  sky: function (x, y) {
    var azimuth = Math.acos(Math.cos(x / 700))+Math.PI*0.24;
    var zenith = Math.asin(Math.sin(y / 800))+Math.PI*0.34;
    var solarZenith = this.solarZenith;

    var g = this.gamma(zenith, azimuth);
    zenith = Math.min(zenith, Math.PI/2.0);
    var Yp = this.Yz * this.perez(zenith, g, this.coeffs.coeffsY) / this.perez(0, solarZenith, this.coeffs.coeffsY);
    var xp = this.xz * this.perez(zenith, g, this.coeffs.coeffsx) / this.perez(0, solarZenith, this.coeffs.coeffsx);
    var yp = this.yz * this.perez(zenith, g, this.coeffs.coeffsy) / this.perez(0, solarZenith, this.coeffs.coeffsy);

    return this.RGB(Yp, xp, yp);
  }
}

function dot(v1, v2) {
  return v1.reduce(function(a, c, i) { return a + c*v2[i]; }, 0);
}
