"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateMiddleHandlesCursorCases = void 0;

var _corners = require("../../reference/corners");

var calculateMiddleHandlesCursorCases = function calculateMiddleHandlesCursorCases(_ref) {
  var omega = _ref.omega,
      widthTooLow = _ref.widthTooLow,
      heightTooLow = _ref.heightTooLow,
      movingCorner = _ref.movingCorner,
      cursorPosition = _ref.cursorPosition,
      diagonal = _ref.diagonal,
      height = _ref.height,
      width = _ref.width,
      ALPHA = _ref.ALPHA;

  switch (movingCorner) {
    case _corners.corners.middleTop:
      {
        if (heightTooLow) {
          return {
            cursorPositionChecked: cursorPosition,
            widthShouldBeConstant: true,
            heightShouldBeConstant: false
          };
        } else {
          /*fixed corner: bottomRight (cf getFixedCornerWhileResizing method)*/
          var projection = Math.PI / 2 - omega < 0 ? Math.sqrt(Math.pow(diagonal, 2) - Math.pow(diagonal * Math.cos(Math.PI / 2 - omega), 2)) : -Math.sqrt(Math.pow(diagonal, 2) - Math.pow(diagonal * Math.cos(Math.PI / 2 - omega), 2));
          var cursorPositionChecked = {
            x: cursorPosition.x + (heightTooLow ? -projection - width : projection - width) * Math.cos(ALPHA),
            y: cursorPosition.y - (heightTooLow ? projection - width : projection - width) * Math.sin(ALPHA)
          };
          return {
            cursorPositionChecked: cursorPositionChecked,
            widthShouldBeConstant: true,
            heightShouldBeConstant: false
          };
        }
      }

    case _corners.corners.middleRight:
      {
        if (widthTooLow) {
          return {
            cursorPositionChecked: cursorPosition,
            widthShouldBeConstant: false,
            heightShouldBeConstant: true
          };
        } else {
          /*fixed corner: topLeft (cf getFixedCornerWhileResizing method)*/
          var _projection = omega - Math.PI < 0 ? Math.sqrt(Math.pow(diagonal, 2) - Math.pow(diagonal * Math.cos(omega), 2)) : -Math.sqrt(Math.pow(diagonal, 2) - Math.pow(diagonal * Math.cos(omega), 2));

          var _cursorPositionChecked = {
            x: cursorPosition.x + (widthTooLow ? -_projection - height : _projection + height) * Math.sin(ALPHA),
            y: cursorPosition.y + (widthTooLow ? _projection - height : _projection + height) * Math.cos(ALPHA)
          };
          return {
            cursorPositionChecked: _cursorPositionChecked,
            widthShouldBeConstant: false,
            heightShouldBeConstant: true
          };
        }
      }

    case _corners.corners.middleBottom:
      {
        if (heightTooLow) {
          return {
            cursorPositionChecked: cursorPosition,
            widthShouldBeConstant: true,
            heightShouldBeConstant: false
          };
        } else {
          /*fixed corner: topLeft (cf getFixedCornerWhileResizing method)*/
          var _projection2 = 3 * Math.PI / 2 - omega > 0 ? Math.sqrt(Math.pow(diagonal, 2) - Math.pow(diagonal * Math.sin(2 * Math.PI - omega), 2)) : -Math.sqrt(Math.pow(diagonal, 2) - Math.pow(diagonal * Math.sin(2 * Math.PI - omega), 2));

          var _cursorPositionChecked2 = {
            x: cursorPosition.x + (heightTooLow ? -_projection2 + width : _projection2 + width) * Math.cos(ALPHA),
            y: cursorPosition.y - (heightTooLow ? _projection2 + width : _projection2 + width) * Math.sin(ALPHA)
          };
          return {
            cursorPositionChecked: _cursorPositionChecked2,
            widthShouldBeConstant: true,
            heightShouldBeConstant: false
          };
        }
      }

    case _corners.corners.middleLeft:
      {
        if (widthTooLow) {
          return {
            cursorPositionChecked: cursorPosition,
            widthShouldBeConstant: false,
            heightShouldBeConstant: true
          };
        } else {
          /*fixed corner: bottomRight (cf getFixedCornerWhileResizing method)*/
          var _projection3 = Math.PI - omega > 0 ? Math.sqrt(Math.pow(diagonal, 2) - Math.pow(diagonal * Math.cos(Math.PI - omega), 2)) : -Math.sqrt(Math.pow(diagonal, 2) - Math.pow(diagonal * Math.cos(Math.PI - omega), 2));

          var _cursorPositionChecked3 = {
            x: cursorPosition.x + (widthTooLow ? -_projection3 - height : _projection3 - height) * Math.sin(ALPHA),
            y: cursorPosition.y + (widthTooLow ? _projection3 - height : _projection3 - height) * Math.cos(ALPHA)
          };
          return {
            cursorPositionChecked: _cursorPositionChecked3,
            widthShouldBeConstant: false,
            heightShouldBeConstant: true
          };
        }
      }

    default:
      {
        return {
          cursorPositionChecked: cursorPosition,
          widthShouldBeConstant: false,
          heightShouldBeConstant: false
        };
      }
  }
};

exports.calculateMiddleHandlesCursorCases = calculateMiddleHandlesCursorCases;