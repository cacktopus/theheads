"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateCropElementPosition = void 0;

var _interactionsHelpers = require("../../interactions-helpers");

var calculateCropElementPosition = function calculateCropElementPosition(_ref) {
  var picWhileCroppingProperties = _ref.picWhileCroppingProperties,
      width = _ref.width,
      height = _ref.height,
      x = _ref.x,
      y = _ref.y,
      rotation = _ref.rotation;
  var ALPHA = (0, _interactionsHelpers.fromCSSToTrigo)({
    rotation: rotation
  });
  /* 1. get the picture center in not rotated system */

  var picCenter = {
    x: picWhileCroppingProperties.x + picWhileCroppingProperties.width / 2,
    y: picWhileCroppingProperties.y + picWhileCroppingProperties.height / 2
  };
  /* 2. get the element center */

  var elementCenter = {
    X: x + width / 2,
    Y: y + height / 2
  };
  /* 3. get the picture center in rotated system*/

  var rotatedPicCenter = (0, _interactionsHelpers.calculateRotateCoordsInSystem)({
    initCoords: picCenter,
    centerCoords: elementCenter,
    ALPHA: -ALPHA
  });
  /* return the new position of picture */

  return {
    x: rotatedPicCenter.x - picWhileCroppingProperties.width / 2,
    y: rotatedPicCenter.y - picWhileCroppingProperties.height / 2
  };
};

exports.calculateCropElementPosition = calculateCropElementPosition;