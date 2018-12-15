"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateLockAspectRatioDiagonal = void 0;

var _corners = require("../../reference/corners");

var calculateLockAspectRatioDiagonal = function calculateLockAspectRatioDiagonal(_ref) {
  var minCursorPosition = _ref.minCursorPosition,
      phi = _ref.phi,
      ALPHA = _ref.ALPHA,
      movingCorner = _ref.movingCorner;

  switch (movingCorner) {
    case _corners.corners.topRight:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 1000,
        width: 2000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA + phi), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    case _corners.corners.topLeft:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 1000,
        width: 2000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA - phi), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    case _corners.corners.bottomRight:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 1000,
        width: 2000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA - phi), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    case _corners.corners.bottomLeft:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 1000,
        width: 2000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA + phi), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    default:
      return undefined;
  }
};

exports.calculateLockAspectRatioDiagonal = calculateLockAspectRatioDiagonal;