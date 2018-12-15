"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFixedCornerWhileResizing = void 0;

var _corners = require("../../reference/corners");

var getFixedCornerWhileResizing = function getFixedCornerWhileResizing(_ref) {
  var handleClicked = _ref.handleClicked,
      lockAspectRatio = _ref.lockAspectRatio;

  /*store which corner won't move*/
  switch (handleClicked) {
    case _corners.corners.topLeft:
      {
        return _corners.corners.bottomRight;
      }

    case _corners.corners.topRight:
      {
        return _corners.corners.bottomLeft;
      }

    case _corners.corners.bottomLeft:
      {
        return _corners.corners.topRight;
      }

    case _corners.corners.bottomRight:
      {
        return _corners.corners.topLeft;
      }

    case _corners.corners.middleTop:
      {
        /*when it's a "middle corner" moving, three corners will stay fixed. we choose one convenient*/
        if (lockAspectRatio) {
          return _corners.corners.middleBottom;
        } else {
          return _corners.corners.bottomRight;
        }
      }

    case _corners.corners.middleRight:
      {
        if (lockAspectRatio) {
          return _corners.corners.middleLeft;
        } else {
          return _corners.corners.topLeft;
        }
      }

    case _corners.corners.middleBottom:
      {
        if (lockAspectRatio) {
          return _corners.corners.middleTop;
        } else {
          return _corners.corners.topLeft;
        }
      }

    case _corners.corners.middleLeft:
      {
        if (lockAspectRatio) {
          return _corners.corners.middleRight;
        } else {
          return _corners.corners.bottomRight;
        }
      }

    default:
      {
        return null;
      }
  }
};

exports.getFixedCornerWhileResizing = getFixedCornerWhileResizing;