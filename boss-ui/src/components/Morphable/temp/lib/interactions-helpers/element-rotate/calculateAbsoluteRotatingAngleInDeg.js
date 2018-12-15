"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateAbsoluteRotatingAngleInDeg = void 0;

var calculateAbsoluteRotatingAngleInDeg = function calculateAbsoluteRotatingAngleInDeg(_ref) {
  var e = _ref.e,
      rootCenterCoords = _ref.rootCenterCoords,
      initRotationOfHandleInRad = _ref.initRotationOfHandleInRad;
  var relativeX = e.clientX - rootCenterCoords.X;
  var relativeY = rootCenterCoords.Y - e.clientY;
  var brutAngle = Math.atan(relativeY / relativeX);
  var adjustedAngle;

  if (relativeX >= 0) {
    if (relativeY >= 0) {
      adjustedAngle = brutAngle;
    } else {
      adjustedAngle = brutAngle + 2 * Math.PI;
    }
  } else {
    if (relativeY >= 0) {
      adjustedAngle = brutAngle + Math.PI;
    } else {
      adjustedAngle = brutAngle + Math.PI;
    }
  }

  var absoluteAngle = (adjustedAngle - initRotationOfHandleInRad + 2 * Math.PI) % (2 * Math.PI);
  /*rotation CSS is clockwise in degrees, whereas trigonometry is counter-clockwise in radians*/

  return -(absoluteAngle * 180 / Math.PI);
};

exports.calculateAbsoluteRotatingAngleInDeg = calculateAbsoluteRotatingAngleInDeg;