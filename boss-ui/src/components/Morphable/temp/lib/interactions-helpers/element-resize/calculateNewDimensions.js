"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateNewDimensions = void 0;

var _corners = require("../../reference/corners");

var calculateNewDimensions = function calculateNewDimensions(_ref) {
  var widthShouldBeConstant = _ref.widthShouldBeConstant,
      heightShouldBeConstant = _ref.heightShouldBeConstant,
      cursorPositionNotRotated = _ref.cursorPositionNotRotated,
      newFixedCornerPositionNonRotated = _ref.newFixedCornerPositionNonRotated,
      width = _ref.width,
      height = _ref.height,
      lockAspectRatio = _ref.lockAspectRatio,
      movingCorner = _ref.movingCorner;
  var newWidth = Math.abs(cursorPositionNotRotated.x - newFixedCornerPositionNonRotated.x);
  var newHeight = Math.abs(cursorPositionNotRotated.y - newFixedCornerPositionNonRotated.y);

  if (lockAspectRatio) {
    switch (movingCorner) {
      case _corners.corners.middleTop:
        return {
          width: width * newHeight / height,
          height: newHeight
        };

      case _corners.corners.middleBottom:
        return {
          width: width * newHeight / height,
          height: newHeight
        };

      case _corners.corners.middleLeft:
        return {
          width: newWidth,
          height: height * newWidth / width
        };

      case _corners.corners.middleRight:
        return {
          width: newWidth,
          height: height * newWidth / width
        };

      default:
        return {
          width: widthShouldBeConstant ? width : newWidth,
          height: heightShouldBeConstant ? height : newHeight
        };
    }
  }

  return {
    width: widthShouldBeConstant ? width : newWidth,
    height: heightShouldBeConstant ? height : newHeight
  };
};

exports.calculateNewDimensions = calculateNewDimensions;