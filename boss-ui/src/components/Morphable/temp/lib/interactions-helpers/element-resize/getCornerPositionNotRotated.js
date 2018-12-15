"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCornerPositionNotRotated = void 0;

var _corners = require("../../reference/corners");

var getCornerPositionNotRotated = function getCornerPositionNotRotated(_ref) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      corner = _ref.corner;

  switch (corner) {
    case _corners.corners.topRight:
      return {
        x: x + width,
        y: y
      };

    case _corners.corners.topLeft:
      return {
        x: x,
        y: y
      };

    case _corners.corners.bottomRight:
      return {
        x: x + width,
        y: y + height
      };

    case _corners.corners.bottomLeft:
      return {
        x: x,
        y: y + height
      };

    /*useful for lock aspect ratio only*/

    case _corners.corners.middleTop:
      return {
        x: x + width / 2,
        y: y
      };

    case _corners.corners.middleBottom:
      return {
        x: x + width / 2,
        y: y + height
      };

    case _corners.corners.middleLeft:
      return {
        x: x,
        y: y + height / 2
      };

    case _corners.corners.middleRight:
      return {
        x: x + width,
        y: y + height / 2
      };

    default:
      return {
        x: null,
        y: null
      };
  }
};

exports.getCornerPositionNotRotated = getCornerPositionNotRotated;