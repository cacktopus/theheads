"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateRotateCoordsInSystem = void 0;

var calculateRotateCoordsInSystem = function calculateRotateCoordsInSystem(_ref) {
  var initCoords = _ref.initCoords,
      centerCoords = _ref.centerCoords,
      ALPHA = _ref.ALPHA;

  /*
    INPUT:
    initCoords: { x: y: },
    centerCoords: { X: Y: },
    ALPHA: rad
     OUTPUT
    {
      X: 
      Y: 
      omega: positive angle in degree, for testing only
    }
  */
  var rotatedCoordsInCenterSystem = {
    X: -centerCoords.X + initCoords.x,
    Y: centerCoords.Y - initCoords.y
  };

  if (rotatedCoordsInCenterSystem.X === 0 && rotatedCoordsInCenterSystem.Y === 0) {
    return {
      x: initCoords.x,
      y: initCoords.y,
      omega: 0
    };
  }

  var diag = Math.sqrt(Math.pow(rotatedCoordsInCenterSystem.X, 2) + Math.pow(rotatedCoordsInCenterSystem.Y, 2));
  var omega;

  if (rotatedCoordsInCenterSystem.X < 0) {
    if (rotatedCoordsInCenterSystem.Y >= 0) {
      /*en haut à gauche*/
      omega = Math.acos(rotatedCoordsInCenterSystem.X / diag) - ALPHA;
    } else {
      /*en bas à gauche*/
      omega = -Math.acos(rotatedCoordsInCenterSystem.X / diag) + 2 * Math.PI - ALPHA;
    }
  } else {
    if (rotatedCoordsInCenterSystem.Y >= 0) {
      /*en haut à droite*/
      omega = Math.acos(rotatedCoordsInCenterSystem.X / diag) - ALPHA;
    } else {
      /*en bas à droite*/
      omega = -Math.acos(rotatedCoordsInCenterSystem.X / diag) + 2 * Math.PI - ALPHA;
    }
  }

  var newX = Math.round((diag * Math.cos(omega) + centerCoords.X) * 10000) / 10000 === -0 // round with 2 decimals
  ? 0 : Math.round((diag * Math.cos(omega) + centerCoords.X) * 10000) / 10000;
  var newY = Math.round((-diag * Math.sin(omega) + centerCoords.Y) * 10000) / 10000 === -0 // round with 2 decimals
  ? 0 : Math.round((-diag * Math.sin(omega) + centerCoords.Y) * 10000) / 10000;
  var coordsOfElementNonRotated = {
    x: newX,
    y: newY,
    omega: Math.round((omega + 2 * Math.PI) % (2 * Math.PI) * 100000) / 100000
  };
  return coordsOfElementNonRotated;
};

exports.calculateRotateCoordsInSystem = calculateRotateCoordsInSystem;