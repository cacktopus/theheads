"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateRootTransformedBoundingRect = void 0;

var _corners = require("../../reference/corners");

var _ = require("./");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var calculateRootTransformedBoundingRect = function calculateRootTransformedBoundingRect(_ref) {
  var _cornerPositions;

  var x = _ref.x,
      y = _ref.y,
      ALPHA = _ref.ALPHA,
      width = _ref.width,
      height = _ref.height,
      centerCoords = _ref.centerCoords;
  var cornerPositions = (_cornerPositions = {}, _defineProperty(_cornerPositions, _corners.corners.topLeft, (0, _.calculateRotateCoordsInSystem)({
    initCoords: {
      x: x,
      y: y
    },
    centerCoords: centerCoords,
    ALPHA: ALPHA + 2 * Math.PI
  })), _defineProperty(_cornerPositions, _corners.corners.topRight, (0, _.calculateRotateCoordsInSystem)({
    initCoords: {
      x: x + width,
      y: y
    },
    centerCoords: centerCoords,
    ALPHA: ALPHA + 2 * Math.PI
  })), _defineProperty(_cornerPositions, _corners.corners.bottomRight, (0, _.calculateRotateCoordsInSystem)({
    initCoords: {
      x: x + width,
      y: y + height
    },
    centerCoords: centerCoords,
    ALPHA: ALPHA + 2 * Math.PI
  })), _defineProperty(_cornerPositions, _corners.corners.bottomLeft, (0, _.calculateRotateCoordsInSystem)({
    initCoords: {
      x: x,
      y: y + height
    },
    centerCoords: centerCoords,
    ALPHA: ALPHA + 2 * Math.PI
  })), _cornerPositions);
  var abcisses = Object.keys(cornerPositions).map(function (corner) {
    return cornerPositions[corner].x;
  });
  var ordinates = Object.keys(cornerPositions).map(function (corner) {
    return cornerPositions[corner].y;
  });
  return {
    top: Math.min.apply(Math, _toConsumableArray(ordinates)),
    left: Math.min.apply(Math, _toConsumableArray(abcisses)),
    bottom: Math.max.apply(Math, _toConsumableArray(ordinates)),
    right: Math.max.apply(Math, _toConsumableArray(abcisses))
  };
};

exports.calculateRootTransformedBoundingRect = calculateRootTransformedBoundingRect;