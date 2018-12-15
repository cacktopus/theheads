"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkHeightTooLow = exports.checkWidthTooLow = void 0;

var _corners = require("../../reference/corners");

var checkWidthTooLow = function checkWidthTooLow(_ref) {
  var omega = _ref.omega,
      movingCorner = _ref.movingCorner;

  switch (movingCorner) {
    case _corners.corners.topRight:
      return omega >= Math.PI / 2 && omega <= 3 * Math.PI / 2;

    case _corners.corners.topLeft:
      return omega <= Math.PI / 2 || omega >= 3 * Math.PI / 2;

    case _corners.corners.middleLeft:
      return Math.abs(Math.PI - omega) > Math.PI / 2;

    case _corners.corners.bottomRight:
      return omega >= Math.PI / 2 && omega <= 3 * Math.PI / 2;

    case _corners.corners.middleRight:
      return omega >= Math.PI / 2 && omega <= 3 * Math.PI / 2;

    case _corners.corners.bottomLeft:
      return omega >= 3 * Math.PI / 2 || omega <= Math.PI / 2;

    default:
      return undefined;
  }
};

exports.checkWidthTooLow = checkWidthTooLow;

var checkHeightTooLow = function checkHeightTooLow(_ref2) {
  var lockAspectRatio = _ref2.lockAspectRatio,
      diagonal = _ref2.diagonal,
      phi = _ref2.phi,
      minHeight = _ref2.minHeight,
      omega = _ref2.omega,
      beta = _ref2.beta,
      movingCorner = _ref2.movingCorner;

  if (lockAspectRatio) {
    switch (movingCorner) {
      case _corners.corners.topRight:
        return;

      case _corners.corners.topLeft:
        // console.log(heightTooLow, "diagonal", diagonal, "(minHeight / Math.sin(phi))", (minHeight / Math.sin(phi)));
        return diagonal <= minHeight / Math.sin(phi);

      case _corners.corners.middleTop:
        return;

      case _corners.corners.bottomRight:
        return;

      case _corners.corners.middleBottom:
        return;

      case _corners.corners.bottomLeft:
        return;

      default:
        return undefined;
    }
  } else {
    switch (movingCorner) {
      case _corners.corners.topRight:
        return (omega + beta + 2 * Math.PI) % (2 * Math.PI) >= Math.PI;

      case _corners.corners.topLeft:
        return (omega + beta + 2 * Math.PI) % (2 * Math.PI) >= Math.PI;

      case _corners.corners.middleTop:
        return (omega + beta + 2 * Math.PI) % (2 * Math.PI) >= Math.PI;

      case _corners.corners.bottomRight:
        return (omega - beta + 2 * Math.PI) % (2 * Math.PI) <= Math.PI;

      case _corners.corners.middleBottom:
        return (omega - beta + 2 * Math.PI) % (2 * Math.PI) <= Math.PI;

      case _corners.corners.bottomLeft:
        return (omega - beta + 2 * Math.PI) % (2 * Math.PI) <= Math.PI;

      default:
        return undefined;
    }
  }
};

exports.checkHeightTooLow = checkHeightTooLow;