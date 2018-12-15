"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateLockAspectRatioCursorCases = void 0;

var _corners = require("../../reference/corners");

var calculateLockAspectRatioCursorCases = function calculateLockAspectRatioCursorCases(_ref) {
  var lockAspectRatio = _ref.lockAspectRatio,
      phi = _ref.phi,
      omega = _ref.omega,
      widthTooLow = _ref.widthTooLow,
      heightTooLow = _ref.heightTooLow,
      widthShouldBeConstantToCheck = _ref.widthShouldBeConstantToCheck,
      heightShouldBeConstantToCheck = _ref.heightShouldBeConstantToCheck,
      movingCorner = _ref.movingCorner,
      fixedCornerPositionRotated = _ref.fixedCornerPositionRotated,
      cursorPosition = _ref.cursorPosition,
      diagonal = _ref.diagonal,
      height = _ref.height,
      width = _ref.width,
      minHeight = _ref.minHeight,
      ALPHA = _ref.ALPHA,
      minCursorPosition = _ref.minCursorPosition;
  var cursorPositionChecked = cursorPosition;
  var diagOrthoWithHorizontalAngle = 0;
  var tooSmall = false;

  switch (movingCorner) {
    case _corners.corners.topLeft:
      diagOrthoWithHorizontalAngle = (ALPHA - phi + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI); //cf schéma

      tooSmall = diagOrthoWithHorizontalAngle < Math.PI / 2 || diagOrthoWithHorizontalAngle > 3 * Math.PI / 2 ? (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) > -cursorPosition.y + minCursorPosition.y : (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) < -cursorPosition.y + minCursorPosition.y;

      if (tooSmall) {
        cursorPositionChecked = minCursorPosition;
      } else {
        var projection = diagonal * Math.sin(Math.PI - omega - phi); //cf schéma: BD

        cursorPositionChecked = {
          x: cursorPosition.x - projection * Math.sin(phi - ALPHA),
          y: cursorPosition.y + projection * Math.cos(phi - ALPHA)
        };
      }

      break;

    case _corners.corners.topRight:
      diagOrthoWithHorizontalAngle = (ALPHA + phi + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI); //cf schéma

      tooSmall = diagOrthoWithHorizontalAngle > Math.PI / 2 && diagOrthoWithHorizontalAngle < 3 * Math.PI / 2 ? (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) > -cursorPosition.y + minCursorPosition.y : (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) < -cursorPosition.y + minCursorPosition.y;

      if (tooSmall) {
        cursorPositionChecked = minCursorPosition;
      } else {
        var _projection = diagonal * Math.sin(omega - phi); //cf schéma: BD


        cursorPositionChecked = {
          x: cursorPosition.x + _projection * Math.cos(Math.PI / 2 - phi - ALPHA),
          y: cursorPosition.y + _projection * Math.sin(Math.PI / 2 - phi - ALPHA)
        };
      }

      break;

    case _corners.corners.bottomLeft:
      diagOrthoWithHorizontalAngle = (ALPHA + phi + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI); //cf schéma

      tooSmall = diagOrthoWithHorizontalAngle < Math.PI / 2 || diagOrthoWithHorizontalAngle > 3 * Math.PI / 2 ? (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) > -cursorPosition.y + minCursorPosition.y : (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) < -cursorPosition.y + minCursorPosition.y;

      if (tooSmall) {
        cursorPositionChecked = minCursorPosition;
      } else {
        var _projection2 = diagonal * Math.sin(omega - phi); //cf schéma: BD


        cursorPositionChecked = {
          x: cursorPosition.x + _projection2 * Math.cos(Math.PI / 2 - phi - ALPHA),
          y: cursorPosition.y + _projection2 * Math.sin(Math.PI / 2 - phi - ALPHA)
        };
      }

      break;

    case _corners.corners.bottomRight:
      diagOrthoWithHorizontalAngle = (ALPHA - phi + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI); //cf schéma

      tooSmall = diagOrthoWithHorizontalAngle > Math.PI / 2 && diagOrthoWithHorizontalAngle < 3 * Math.PI / 2 ? (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) > -cursorPosition.y + minCursorPosition.y : (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) < -cursorPosition.y + minCursorPosition.y;

      if (tooSmall) {
        cursorPositionChecked = minCursorPosition;
      } else {
        var _projection3 = diagonal * Math.sin(2 * Math.PI - omega - phi); //cf schéma: BD


        cursorPositionChecked = {
          x: cursorPosition.x + _projection3 * Math.sin(phi - ALPHA),
          y: cursorPosition.y - _projection3 * Math.cos(phi - ALPHA)
        };
      }

      break;

    case _corners.corners.middleTop:
      diagOrthoWithHorizontalAngle = (ALPHA + 2 * Math.PI) % (2 * Math.PI); //cf schéma

      tooSmall = diagOrthoWithHorizontalAngle < Math.PI / 2 || diagOrthoWithHorizontalAngle > 3 * Math.PI / 2 ? (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) > -cursorPosition.y + minCursorPosition.y : (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) < -cursorPosition.y + minCursorPosition.y;

      if (tooSmall) {
        cursorPositionChecked = minCursorPosition;
      } else {
        var _projection4 = diagonal * Math.sin(omega - Math.PI / 2); //cf schéma: BD


        cursorPositionChecked = {
          x: cursorPosition.x + _projection4 * Math.cos(ALPHA),
          y: cursorPosition.y - _projection4 * Math.sin(ALPHA)
        };
      }

      break;

    case _corners.corners.middleBottom:
      diagOrthoWithHorizontalAngle = (ALPHA + 2 * Math.PI) % (2 * Math.PI); //cf schéma

      tooSmall = diagOrthoWithHorizontalAngle > Math.PI / 2 && diagOrthoWithHorizontalAngle < 3 * Math.PI / 2 ? (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) > -cursorPosition.y + minCursorPosition.y : (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) < -cursorPosition.y + minCursorPosition.y;

      if (tooSmall) {
        cursorPositionChecked = minCursorPosition;
      } else {
        var _projection5 = diagonal * Math.sin(omega - Math.PI / 2); //cf schéma: BD


        cursorPositionChecked = {
          x: cursorPosition.x + _projection5 * Math.cos(ALPHA),
          y: cursorPosition.y - _projection5 * Math.sin(ALPHA)
        };
      }

      break;

    case _corners.corners.middleRight:
      diagOrthoWithHorizontalAngle = (ALPHA + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI); //cf schéma

      tooSmall = diagOrthoWithHorizontalAngle > Math.PI / 2 && diagOrthoWithHorizontalAngle < 3 * Math.PI / 2 ? (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) > -cursorPosition.y + minCursorPosition.y : (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) < -cursorPosition.y + minCursorPosition.y;

      if (tooSmall) {
        cursorPositionChecked = minCursorPosition;
      } else {
        var _projection6 = diagonal * Math.sin(omega); //cf schéma: BD


        cursorPositionChecked = {
          x: cursorPosition.x + _projection6 * Math.sin(ALPHA),
          y: cursorPosition.y + _projection6 * Math.cos(ALPHA)
        };
      }

      break;

    case _corners.corners.middleLeft:
      diagOrthoWithHorizontalAngle = (ALPHA + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI); //cf schéma

      tooSmall = diagOrthoWithHorizontalAngle <= Math.PI / 2 || diagOrthoWithHorizontalAngle >= 3 * Math.PI / 2 ? (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) > -cursorPosition.y + minCursorPosition.y : (cursorPosition.x - minCursorPosition.x) * Math.tan(diagOrthoWithHorizontalAngle) < -cursorPosition.y + minCursorPosition.y;

      if (tooSmall) {
        cursorPositionChecked = minCursorPosition;
      } else {
        var _projection7 = diagonal * Math.sin(omega); //cf schéma: BD


        cursorPositionChecked = {
          x: cursorPosition.x + _projection7 * Math.sin(ALPHA),
          y: cursorPosition.y + _projection7 * Math.cos(ALPHA)
        };
      }

      break;

    default:
      break;
  }

  return {
    cursorPositionChecked: cursorPositionChecked
  };
};

exports.calculateLockAspectRatioCursorCases = calculateLockAspectRatioCursorCases;