"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateLockAspectRatioMinCursorPosition = void 0;

var _corners = require("../../reference/corners");

var calculateLockAspectRatioMinCursorPosition = function calculateLockAspectRatioMinCursorPosition(_ref) {
  var fixedCornerPositionRotated = _ref.fixedCornerPositionRotated,
      minHeight = _ref.minHeight,
      phi = _ref.phi,
      ALPHA = _ref.ALPHA,
      movingCorner = _ref.movingCorner;

  switch (movingCorner) {
    case _corners.corners.topRight:
      return {
        x: fixedCornerPositionRotated.x + minHeight / Math.sin(phi) * Math.cos(phi + ALPHA),
        y: fixedCornerPositionRotated.y - minHeight / Math.sin(phi) * Math.sin(phi + ALPHA)
      };

    case _corners.corners.topLeft:
      return {
        x: fixedCornerPositionRotated.x - minHeight / Math.sin(phi) * Math.cos(phi - ALPHA),
        y: fixedCornerPositionRotated.y - minHeight / Math.sin(phi) * Math.sin(phi - ALPHA)
      };

    case _corners.corners.bottomRight:
      return {
        x: fixedCornerPositionRotated.x + minHeight / Math.sin(phi) * Math.cos(phi - ALPHA),
        y: fixedCornerPositionRotated.y + minHeight / Math.sin(phi) * Math.sin(phi - ALPHA)
      };

    case _corners.corners.bottomLeft:
      return {
        x: fixedCornerPositionRotated.x - minHeight / Math.sin(phi) * Math.cos(phi + ALPHA),
        y: fixedCornerPositionRotated.y + minHeight / Math.sin(phi) * Math.sin(phi + ALPHA)
      };

    case _corners.corners.middleTop:
      return {
        x: fixedCornerPositionRotated.x - minHeight * Math.sin(ALPHA),
        y: fixedCornerPositionRotated.y - minHeight * Math.cos(ALPHA)
      };

    case _corners.corners.middleBottom:
      return {
        x: fixedCornerPositionRotated.x + minHeight * Math.sin(ALPHA),
        y: fixedCornerPositionRotated.y + minHeight * Math.cos(ALPHA)
      };

    case _corners.corners.middleRight:
      return {
        x: fixedCornerPositionRotated.x + minHeight / Math.tan(phi) * Math.cos(ALPHA),
        y: fixedCornerPositionRotated.y - minHeight / Math.tan(phi) * Math.sin(ALPHA)
      };

    case _corners.corners.middleLeft:
      return {
        x: fixedCornerPositionRotated.x - minHeight / Math.tan(phi) * Math.cos(ALPHA),
        y: fixedCornerPositionRotated.y + minHeight / Math.tan(phi) * Math.sin(ALPHA)
      };

    default:
      return undefined;
  }
};

exports.calculateLockAspectRatioMinCursorPosition = calculateLockAspectRatioMinCursorPosition;