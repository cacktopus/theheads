"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateExtremeCursorCases = void 0;

var _corners = require("../../reference/corners");

var calculateExtremeCursorCases = function calculateExtremeCursorCases(_ref) {
  var omega = _ref.omega,
      widthTooLow = _ref.widthTooLow,
      heightTooLow = _ref.heightTooLow,
      width = _ref.width,
      height = _ref.height,
      fixedCornerPositionRotated = _ref.fixedCornerPositionRotated,
      cursorPosition = _ref.cursorPosition,
      ALPHA = _ref.ALPHA,
      movingCorner = _ref.movingCorner,
      diagonal = _ref.diagonal,
      widthShouldBeConstant = _ref.widthShouldBeConstant,
      heightShouldBeConstant = _ref.heightShouldBeConstant,
      minHeight = _ref.minHeight;
  var cornerIsOneOfMiddleCorner = widthShouldBeConstant || heightShouldBeConstant;
  /*calculate the updated cursor position: 
  the idea is that if the cursor falls outside of the element, 
  the updated cursor will be the orthogonal projection of the real cursor on the side of the element*/

  var cursorPositionChecked = cursorPosition;

  if (cornerIsOneOfMiddleCorner) {
    if (widthTooLow) {
      switch (movingCorner) {
        case _corners.corners.middleRight:
          {
            cursorPositionChecked = {
              x: fixedCornerPositionRotated.x + height * Math.sin(ALPHA),
              y: fixedCornerPositionRotated.y + height * Math.cos(ALPHA)
            };
            break;
          }

        case _corners.corners.middleLeft:
          {
            cursorPositionChecked = {
              x: fixedCornerPositionRotated.x - height * Math.sin(ALPHA),
              y: fixedCornerPositionRotated.y - height * Math.cos(ALPHA)
            };
            break;
          }

        default:
          {
            cursorPositionChecked = {
              x: cursorPosition.x,
              y: cursorPosition.y
            };
            break;
          }
      }
    } else if (heightTooLow) {
      var beta = Math.atan(minHeight / width);

      var _diagonal = Math.sqrt(Math.pow(minHeight, 2) + Math.pow(width, 2));

      switch (movingCorner) {
        case _corners.corners.middleTop:
          {
            cursorPositionChecked = {
              x: fixedCornerPositionRotated.x - _diagonal * Math.cos(ALPHA - beta),
              y: fixedCornerPositionRotated.y + _diagonal * Math.sin(ALPHA - beta)
            };
            break;
          }

        case _corners.corners.middleBottom:
          {
            cursorPositionChecked = {
              x: fixedCornerPositionRotated.x + _diagonal * Math.cos(ALPHA - beta),
              y: fixedCornerPositionRotated.y - _diagonal * Math.sin(ALPHA - beta)
            };
            break;
          }

        default:
          {
            cursorPositionChecked = {
              x: cursorPosition.x,
              y: cursorPosition.y
            };
            break;
          }
      }
    } else {
      cursorPositionChecked = {
        x: cursorPosition.x,
        y: cursorPosition.y
      };
    }
  } else {
    if (widthTooLow) {
      var projection = Math.sin(Math.PI / 2 - omega) * diagonal;
      cursorPositionChecked = {
        x: cursorPosition.x - projection * Math.cos(ALPHA),
        y: cursorPosition.y + projection * Math.sin(ALPHA)
      };
    } else if (heightTooLow) {
      var _projection;

      switch (movingCorner) {
        case _corners.corners.topLeft:
          {
            _projection = Math.sin(-omega) * diagonal + minHeight;
            break;
          }

        case _corners.corners.topRight:
          {
            _projection = Math.sin(-omega) * diagonal + minHeight;
            break;
          }

        case _corners.corners.bottomRight:
          {
            _projection = Math.sin(-omega) * diagonal - minHeight;
            break;
          }

        case _corners.corners.bottomLeft:
          {
            _projection = Math.sin(-omega) * diagonal - minHeight;
            break;
          }

        default:
          {
            _projection = Math.sin(-omega) * diagonal + minHeight;
            break;
          }
      }

      cursorPositionChecked = {
        x: cursorPosition.x - _projection * Math.cos(Math.PI / 2 - ALPHA),
        y: cursorPosition.y - _projection * Math.sin(Math.PI / 2 - ALPHA)
      };
    } else {
      cursorPositionChecked = {
        x: cursorPosition.x,
        y: cursorPosition.y
      };
    }
  }

  return {
    cursorPositionChecked: cursorPositionChecked
  };
};

exports.calculateExtremeCursorCases = calculateExtremeCursorCases;