"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCursorOffsetFromHandle = void 0;

var _corners = require("../../reference/corners");

var getCursorOffsetFromHandle = function getCursorOffsetFromHandle(_ref) {
  var handleClicked = _ref.handleClicked,
      cursorPosition = _ref.cursorPosition,
      elementrootTransformedBoundingRect = _ref.elementrootTransformedBoundingRect;
  var top = elementrootTransformedBoundingRect.top,
      left = elementrootTransformedBoundingRect.left,
      width = elementrootTransformedBoundingRect.width,
      height = elementrootTransformedBoundingRect.height;

  switch (handleClicked) {
    case _corners.corners.topLeft:
      {
        return {
          X: cursorPosition.x - left,
          Y: cursorPosition.y - top
        };
      }

    case _corners.corners.topRight:
      {
        return {
          X: cursorPosition.x - (left + width),
          Y: cursorPosition.y - top
        };
      }

    case _corners.corners.bottomLeft:
      {
        return {
          X: cursorPosition.x - left,
          Y: cursorPosition.y - (top + height)
        };
      }

    case _corners.corners.bottomRight:
      {
        return {
          X: cursorPosition.x - (left + width),
          Y: cursorPosition.y - (top + height)
        };
      }

    case _corners.corners.middleTop:
      {
        return {
          X: cursorPosition.x - (left + width / 2),
          Y: cursorPosition.y - top
        };
      }

    case _corners.corners.middleRight:
      {
        return {
          X: cursorPosition.x - (left + width),
          Y: cursorPosition.y - (top + height / 2)
        };
      }

    case _corners.corners.middleBottom:
      {
        return {
          X: cursorPosition.x - (left + width / 2),
          Y: cursorPosition.y - (top + height)
        };
      }

    case _corners.corners.middleLeft:
      {
        return {
          X: cursorPosition.x - left,
          Y: cursorPosition.y - (top + height / 2)
        };
      }

    default:
      {
        return {
          X: null,
          Y: null
        };
      }
  }
};

exports.getCursorOffsetFromHandle = getCursorOffsetFromHandle;
