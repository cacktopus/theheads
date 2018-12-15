"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateInitRotationOfHandleInRad = void 0;

var _corners = require("../../reference/corners");

var calculateInitRotationOfHandleInRad = function calculateInitRotationOfHandleInRad(_ref) {
  var width = _ref.width,
      height = _ref.height,
      borderWidth = _ref.borderWidth,
      handleClicked = _ref.handleClicked,
      rootCenterCoords = _ref.rootCenterCoords,
      elementRoot = _ref.elementRoot;

  /*the rotation is calculated from the horizontal center axis of the div at rotation = 0.*/

  /*Get the constant angle between the handle with 0 rotation and the horizontal center axis*/
  var handleClickedCoords;

  switch (handleClicked) {
    case _corners.corners.topLeft:
      {
        handleClickedCoords = {
          X: elementRoot.getBoundingClientRect().left,
          Y: elementRoot.getBoundingClientRect().top
        };
        break;
      }

    case _corners.corners.topRight:
      {
        handleClickedCoords = {
          X: elementRoot.getBoundingClientRect().left + width,
          Y: elementRoot.getBoundingClientRect().top
        };
        break;
      }

    case _corners.corners.bottomLeft:
      {
        handleClickedCoords = {
          X: elementRoot.getBoundingClientRect().left,
          Y: elementRoot.getBoundingClientRect().top + height
        };
        break;
      }

    case _corners.corners.bottomRight:
      {
        handleClickedCoords = {
          X: elementRoot.getBoundingClientRect().left + width,
          Y: elementRoot.getBoundingClientRect().top + height
        };
        break;
      }

    case _corners.corners.middleTop:
      {
        handleClickedCoords = {
          X: elementRoot.getBoundingClientRect().left + width / 2,
          Y: elementRoot.getBoundingClientRect().top
        };
        break;
      }

    case _corners.corners.middleRight:
      {
        handleClickedCoords = {
          X: elementRoot.getBoundingClientRect().left + width,
          Y: elementRoot.getBoundingClientRect().top + height / 2
        };
        break;
      }

    case _corners.corners.middleBottom:
      {
        handleClickedCoords = {
          X: elementRoot.getBoundingClientRect().left + width / 2,
          Y: elementRoot.getBoundingClientRect().top + height
        };
        break;
      }

    case _corners.corners.middleLeft:
      {
        handleClickedCoords = {
          X: elementRoot.getBoundingClientRect().left,
          Y: elementRoot.getBoundingClientRect().top + height / 2
        };
        break;
      }

    default:
      {
        handleClickedCoords = {
          X: 0,
          Y: 0
        };
        break;
      }
  }

  var relativeX = handleClickedCoords.X - rootCenterCoords.X;
  var relativeY = -handleClickedCoords.Y + rootCenterCoords.Y;
  var diagCenterTopLeft = Math.sqrt(Math.pow(relativeX, 2) + Math.pow(relativeY, 2));
  var halfBoxWidth = width / 2 - (borderWidth ? borderWidth : 0);
  var initRotationOfHandleInRad;

  switch (handleClicked) {
    case _corners.corners.topLeft:
      {
        initRotationOfHandleInRad = Math.PI - Math.acos(halfBoxWidth / diagCenterTopLeft);
        break;
      }

    case _corners.corners.topRight:
      {
        initRotationOfHandleInRad = Math.acos(halfBoxWidth / diagCenterTopLeft);
        break;
      }

    case _corners.corners.bottomLeft:
      {
        initRotationOfHandleInRad = Math.PI + Math.acos(halfBoxWidth / diagCenterTopLeft);
        break;
      }

    case _corners.corners.bottomRight:
      {
        initRotationOfHandleInRad = 2 * Math.PI - Math.acos(halfBoxWidth / diagCenterTopLeft);
        break;
      }

    case _corners.corners.middleTop:
      {
        initRotationOfHandleInRad = Math.PI / 2;
        break;
      }

    case _corners.corners.middleRight:
      {
        initRotationOfHandleInRad = 0;
        break;
      }

    case _corners.corners.middleBottom:
      {
        initRotationOfHandleInRad = 3 * Math.PI / 2;
        break;
      }

    case _corners.corners.middleLeft:
      {
        initRotationOfHandleInRad = Math.PI;
        break;
      }

    default:
      {
        initRotationOfHandleInRad = 0;
        break;
      }
  }

  return initRotationOfHandleInRad;
};

exports.calculateInitRotationOfHandleInRad = calculateInitRotationOfHandleInRad;