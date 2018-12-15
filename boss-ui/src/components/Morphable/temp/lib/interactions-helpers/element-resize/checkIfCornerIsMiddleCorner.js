"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIfCornerIsMiddleCorner = void 0;

var _corners = require("../../reference/corners");

var checkIfCornerIsMiddleCorner = function checkIfCornerIsMiddleCorner(_ref) {
  var movingCorner = _ref.movingCorner;

  switch (movingCorner) {
    case _corners.corners.middleTop:
      {
        return true;
      }

    case _corners.corners.middleRight:
      {
        return true;
      }

    case _corners.corners.middleBottom:
      {
        return true;
      }

    case _corners.corners.middleLeft:
      {
        return true;
      }

    default:
      {
        return null;
      }
  }
};

exports.checkIfCornerIsMiddleCorner = checkIfCornerIsMiddleCorner;