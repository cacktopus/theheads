"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateLockAspectRatioDiagonalPerpendicular = void 0;

var _corners = require("../../reference/corners");

var calculateLockAspectRatioDiagonalPerpendicular = function calculateLockAspectRatioDiagonalPerpendicular(_ref) {
  var minCursorPosition = _ref.minCursorPosition,
      phi = _ref.phi,
      ALPHA = _ref.ALPHA,
      movingCorner = _ref.movingCorner;

  switch (movingCorner) {
    case _corners.corners.topRight:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 500,
        width: 1000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA + phi + Math.PI / 2), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    case _corners.corners.topLeft:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 500,
        width: 1000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA - phi - Math.PI / 2), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    case _corners.corners.bottomRight:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 500,
        width: 1000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA - phi + Math.PI / 2), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    case _corners.corners.bottomLeft:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 500,
        width: 1000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA + phi - Math.PI / 2), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    case _corners.corners.middleTop:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 500,
        width: 1000,
        height: 0,
        transform: "rotate(".concat(-ALPHA, "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    case _corners.corners.middleBottom:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 500,
        width: 1000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA + Math.PI), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    case _corners.corners.middleRight:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 500,
        width: 1000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA + Math.PI / 2), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    case _corners.corners.middleLeft:
      return {
        top: minCursorPosition.y,
        left: minCursorPosition.x - 500,
        width: 1000,
        height: 0,
        transform: "rotate(".concat(-(ALPHA + 3 * Math.PI / 2), "rad)") //trigo is anti-clockwise, CSS is clockwise

      };

    default:
      return undefined;
  }
};

exports.calculateLockAspectRatioDiagonalPerpendicular = calculateLockAspectRatioDiagonalPerpendicular;