"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cornerAnglesForRotation = exports.cornerAnglesForCursor = exports.corners = void 0;

var _cornerAnglesForCurso, _cornerAnglesForRotat;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var corners = {
  topLeft: 'topLeft',
  topRight: 'topRight',
  bottomLeft: 'bottomLeft',
  bottomRight: 'bottomRight',
  middleTop: 'middleTop',
  middleRight: 'middleRight',
  middleBottom: 'middleBottom',
  middleLeft: 'middleLeft',
  inside: 'inside'
};
exports.corners = corners;
var cornerAnglesForCursor = (_cornerAnglesForCurso = {}, _defineProperty(_cornerAnglesForCurso, corners.topLeft, 315), _defineProperty(_cornerAnglesForCurso, corners.topRight, 45), _defineProperty(_cornerAnglesForCurso, corners.bottomLeft, 225), _defineProperty(_cornerAnglesForCurso, corners.bottomRight, 135), _defineProperty(_cornerAnglesForCurso, corners.middleTop, 0), _defineProperty(_cornerAnglesForCurso, corners.middleRight, 90), _defineProperty(_cornerAnglesForCurso, corners.middleBottom, 180), _defineProperty(_cornerAnglesForCurso, corners.middleLeft, 270), _cornerAnglesForCurso);
exports.cornerAnglesForCursor = cornerAnglesForCursor;
var cornerAnglesForRotation = (_cornerAnglesForRotat = {}, _defineProperty(_cornerAnglesForRotat, corners.topLeft, 45), _defineProperty(_cornerAnglesForRotat, corners.topRight, 135), _defineProperty(_cornerAnglesForRotat, corners.bottomLeft, 225), _defineProperty(_cornerAnglesForRotat, corners.bottomRight, 315), _defineProperty(_cornerAnglesForRotat, corners.middleTop, 90), _defineProperty(_cornerAnglesForRotat, corners.middleRight, 0), _defineProperty(_cornerAnglesForRotat, corners.middleBottom, 270), _defineProperty(_cornerAnglesForRotat, corners.middleLeft, 180), _cornerAnglesForRotat);
exports.cornerAnglesForRotation = cornerAnglesForRotation;