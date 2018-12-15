"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBgProperties = void 0;

var _interactionsHelpers = require("../../interactions-helpers");

var debug = false;

var getBgProperties = function getBgProperties(_ref) {
  var elementPosition = _ref.elementPosition,
      imagePosition = _ref.imagePosition,
      rotation = _ref.rotation;
  debug && console.log({
    elementPosition: elementPosition,
    imagePosition: imagePosition,
    rotation: rotation
  });
  var ALPHA = (0, _interactionsHelpers.fromCSSToTrigo)({
    rotation: rotation
  });
  debug && console.log('ALPHA', ALPHA * 180 / Math.PI);
  /* cf schéma */

  var imageCoordsInElementSystem = {
    x: elementPosition.x - imagePosition.x,
    y: elementPosition.y - imagePosition.y
  };
  var diagonal = Math.sqrt(Math.pow(imageCoordsInElementSystem.x, 2) + Math.pow(imageCoordsInElementSystem.y, 2));
  debug && console.log('imageCoordsInElementSystem', imageCoordsInElementSystem);

  if (imageCoordsInElementSystem.x < 0) {
    if (imageCoordsInElementSystem.y < 0) {// diagonal = diagonal;
    } else {// diagonal = diagonal;
      }
  } else {
    if (imageCoordsInElementSystem.y < 0) {
      diagonal = -diagonal;
    } else {
      diagonal = -diagonal;
    }
  }

  debug && console.log('diagonal', diagonal);
  var beta = imageCoordsInElementSystem.x === 0 ? 0 : Math.atan(imageCoordsInElementSystem.y / imageCoordsInElementSystem.x);
  debug && console.log('beta', beta * 180 / Math.PI);
  return {
    x: Math.abs(diagonal * Math.cos(ALPHA + beta)) === 0 ? 0 : Math.round(diagonal * Math.cos(ALPHA + beta) * 10000) / 10000,
    y: Math.abs(diagonal * Math.sin(ALPHA + beta)) === 0 ? 0 : Math.round(diagonal * Math.sin(ALPHA + beta) * 10000) / 10000
  };
};

exports.getBgProperties = getBgProperties;