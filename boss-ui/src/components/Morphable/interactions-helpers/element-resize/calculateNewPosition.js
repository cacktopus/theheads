"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateNewPosition = void 0;

var _corners = require("../../reference/corners");

var _minDimensions = require("../../reference/minDimensions");

var calculateNewPosition = function calculateNewPosition(_ref) {
  var minHeight = _ref.minHeight,
      x = _ref.x,
      y = _ref.y,
      newDimensions = _ref.newDimensions,
      fixedCorner = _ref.fixedCorner,
      newFixedCornerPositionNonRotated = _ref.newFixedCornerPositionNonRotated;

  /*FIXME*/
  switch (fixedCorner) {
    case _corners.corners.topRight:
      return {
        x: newDimensions.width <= _minDimensions.minWidth ? x : newFixedCornerPositionNonRotated.x - newDimensions.width,
        y: newDimensions.height <= minHeight ? y : newFixedCornerPositionNonRotated.y
      };

    case _corners.corners.topLeft:
      return {
        x: newDimensions.width <= _minDimensions.minWidth ? x : newFixedCornerPositionNonRotated.x,
        y: newDimensions.height <= minHeight ? y : newFixedCornerPositionNonRotated.y
      };

    case _corners.corners.bottomRight:
      return {
        x: newFixedCornerPositionNonRotated.x - newDimensions.width,
        y: newFixedCornerPositionNonRotated.y - newDimensions.height
      };

    case _corners.corners.bottomLeft:
      return {
        x: newDimensions.width <= _minDimensions.minWidth ? x : newFixedCornerPositionNonRotated.x,
        y: newDimensions.height <= minHeight ? y : newFixedCornerPositionNonRotated.y - newDimensions.height
      };

    case _corners.corners.middleBottom:
      return {
        x: newDimensions.width <= _minDimensions.minWidth ? x : newFixedCornerPositionNonRotated.x - newDimensions.width / 2,
        y: newDimensions.height <= minHeight ? y : newFixedCornerPositionNonRotated.y - newDimensions.height
      };

    case _corners.corners.middleTop:
      return {
        x: newDimensions.width <= _minDimensions.minWidth ? x : newFixedCornerPositionNonRotated.x - newDimensions.width / 2,
        y: newDimensions.height <= minHeight ? y : newFixedCornerPositionNonRotated.y
      };

    case _corners.corners.middleLeft:
      return {
        x: newDimensions.width <= _minDimensions.minWidth ? x : newFixedCornerPositionNonRotated.x,
        y: newDimensions.height <= minHeight ? y : newFixedCornerPositionNonRotated.y - newDimensions.height / 2
      };

    case _corners.corners.middleRight:
      return {
        x: newDimensions.width <= _minDimensions.minWidth ? x : newFixedCornerPositionNonRotated.x - newDimensions.width,
        y: newDimensions.height <= minHeight ? y : newFixedCornerPositionNonRotated.y - newDimensions.height / 2
      };

    default:
      return {
        x: null,
        y: null
      };
  }
};

exports.calculateNewPosition = calculateNewPosition;