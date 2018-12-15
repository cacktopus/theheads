"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromCSSToTrigo = void 0;

//css is clockwise, trigo is anti-clockwise
//rotation is degrees, trigo is radians
var fromCSSToTrigo = function fromCSSToTrigo(_ref) {
  var rotation = _ref.rotation;
  return -(rotation * Math.PI) / 180;
};

exports.fromCSSToTrigo = fromCSSToTrigo;