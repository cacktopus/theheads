"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elementResizeGlobalMethod = void 0;

var _checkDimensionTooLow = require("./checkDimensionTooLow");

var _calculateExtremeCursorCases = require("./calculateExtremeCursorCases");

var _calculateMiddleHandlesCursorCases = require("./calculateMiddleHandlesCursorCases");

var _calculateNewPosition = require("./calculateNewPosition");

var _calculateNewDimensions = require("./calculateNewDimensions");

var _calculateLockAspectRatioCursorCases = require("./calculateLockAspectRatioCursorCases");

var _calculateLockAspectRatioMinCursorPosition = require("./calculateLockAspectRatioMinCursorPosition");

var _calculateLockAspectRatioDiagonalPerpendicular = require("./calculateLockAspectRatioDiagonalPerpendicular");

var _calculateLockAspectRatioDiagonal = require("./calculateLockAspectRatioDiagonal");

var _getCornerPositionNotRotated = require("./getCornerPositionNotRotated");

var _getFixedCornerWhileResizing = require("./getFixedCornerWhileResizing");

var _interactionsHelpers = require("../../interactions-helpers");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var elementResizeGlobalMethod = function elementResizeGlobalMethod(_ref) {
  var cursorPosition = _ref.cursorPosition,
      movingCorner = _ref.movingCorner,
      rotation = _ref.rotation,
      width = _ref.width,
      height = _ref.height,
      x = _ref.x,
      y = _ref.y,
      _ref$lockAspectRatio = _ref.lockAspectRatio,
      lockAspectRatio = _ref$lockAspectRatio === void 0 ? false : _ref$lockAspectRatio,
      phi = _ref.phi,
      minHeight = _ref.minHeight,
      bounds = _ref.bounds,
      disableBounds = _ref.disableBounds;

  /*
    INPUT:
    movingCorner: string,
    cursorPosition: { x: y: },
    ALPHA: rad
    width: px,
    height: px,
    x: px,
    y: px,
    lockAspectRatio: bool,
    minHeight: px,
    bounds: { top: bottom: right: left: },
    root: DOMElement
     OUTPUT
    {
      x: 
      y: 
      width:
      height:
      cursorPositionChecked: { x, y } (in order to debug the calculated new cursor position)
    }
  */

  /*1.1 get the fixed corner*/
  var fixedCorner = (0, _getFixedCornerWhileResizing.getFixedCornerWhileResizing)({
    handleClicked: movingCorner,
    lockAspectRatio: lockAspectRatio
  });
  /*1.2 get the fixed corner - css is clockwise, trigo is anti-clockwise */

  var ALPHA = (0, _interactionsHelpers.fromCSSToTrigo)({
    rotation: rotation
  });
  /*2 get fixed corner position not rotated first (this corner will move after resize)*/

  var fixedCornerPositionNotRotated = (0, _getCornerPositionNotRotated.getCornerPositionNotRotated)({
    x: x,
    y: y,
    width: width,
    height: height,
    corner: fixedCorner
  });
  /*3 get fixed corner position rotated (this corner will NOT move after resize)*/

  var centerNotRotated = {
    X: x + width / 2,
    Y: y + height / 2
  };
  var fixedCornerPositionRotated = (0, _interactionsHelpers.calculateRotateCoordsInSystem)({
    initCoords: fixedCornerPositionNotRotated,
    centerCoords: centerNotRotated,
    ALPHA: 2 * Math.PI - ALPHA
  });
  /*4. get the diagonal and the angle between the cursor, the fixed corner 
  and the side of element to check the extreme cases*/

  var diagonal = Math.sqrt( // pythagore
  Math.pow(fixedCornerPositionRotated.x - cursorPosition.x, 2) + Math.pow(fixedCornerPositionRotated.y - cursorPosition.y, 2));
  /*5. get the angle between the 'base line rotated' and the diagonal... */

  var _calculateRotateCoord = (0, _interactionsHelpers.calculateRotateCoordsInSystem)({
    initCoords: cursorPosition,
    centerCoords: {
      X: fixedCornerPositionRotated.x,
      Y: fixedCornerPositionRotated.y
    },
    ALPHA: ALPHA
  }),
      omega = _calculateRotateCoord.omega;
  /*... and the one between the minimum height diagonal and the 'base line rotated'*/


  var beta = Math.atan(minHeight / (diagonal * Math.cos(Math.PI - omega)));
  /*6. build the extreme cases (when lockAspectRatio === false)*/

  var widthTooLow = (0, _checkDimensionTooLow.checkWidthTooLow)({
    omega: omega,
    movingCorner: movingCorner
  });
  var heightTooLow = (0, _checkDimensionTooLow.checkHeightTooLow)({
    omega: omega,
    beta: beta,
    movingCorner: movingCorner
  });
  /*------------------------------------*/

  /*7. CURSOR POSITION RECALCULATION*/

  /*we update the cursor position if needed, to where it should be within several step:
      7.1 - If we are clicking on a middle handle
      7.2 - If widthTooLow or heightTooLow are true
       OR
       8. - If LockAspectRatio
      
      We separate the methods when lockAspectRatio === true or not;*/

  /*------------------------------------*/

  /*7.1 fixed width or fixed height / middle handles dragging:
  we make as if we were dragging a corner, but with a fixed width / fixed height*/

  var cursorPositionChecked = _objectSpread({}, cursorPosition);

  var widthShouldBeConstant = false;
  var heightShouldBeConstant = false;

  var _calculateMiddleHandl = (0, _calculateMiddleHandlesCursorCases.calculateMiddleHandlesCursorCases)({
    omega: omega,
    widthTooLow: widthTooLow,
    heightTooLow: heightTooLow,
    movingCorner: movingCorner,
    cursorPosition: cursorPositionChecked,
    diagonal: diagonal,
    height: height,
    width: width,
    ALPHA: ALPHA
  });

  cursorPositionChecked = _calculateMiddleHandl.cursorPositionChecked;
  widthShouldBeConstant = _calculateMiddleHandl.widthShouldBeConstant;
  heightShouldBeConstant = _calculateMiddleHandl.heightShouldBeConstant;

  var _calculateExtremeCurs = (0, _calculateExtremeCursorCases.calculateExtremeCursorCases)({
    fixedCornerPositionRotated: fixedCornerPositionRotated,
    cursorPosition: cursorPositionChecked,
    ALPHA: ALPHA,
    movingCorner: movingCorner,
    diagonal: diagonal,
    omega: omega,
    beta: beta,
    widthTooLow: widthTooLow,
    heightTooLow: heightTooLow,
    width: width,
    height: height,
    widthShouldBeConstant: widthShouldBeConstant,
    heightShouldBeConstant: heightShouldBeConstant,
    minHeight: minHeight
  });

  cursorPositionChecked = _calculateExtremeCurs.cursorPositionChecked;

  /*8. handle lock aspect ratio*/
  var lockAspectRatioDiagonalPerpendicular = undefined;
  var lockAspectRatioDiagonal = undefined;
  var minCursorPosition = undefined;

  if (lockAspectRatio) {
    /*for handling the lock aspect ratio, calculate the minimum position of the cursor*/
    minCursorPosition = (0, _calculateLockAspectRatioMinCursorPosition.calculateLockAspectRatioMinCursorPosition)({
      fixedCornerPositionRotated: fixedCornerPositionRotated,
      minHeight: minHeight,
      phi: phi,
      ALPHA: ALPHA,
      movingCorner: movingCorner
    });
    /*cf schéma : for debug, we want to show the perpendicular to the lock-aspect-ratio diagonal at minimum height, 
    because this is the limit of stop dimensionsTooLow*/

    lockAspectRatioDiagonalPerpendicular = (0, _calculateLockAspectRatioDiagonalPerpendicular.calculateLockAspectRatioDiagonalPerpendicular)({
      minCursorPosition: minCursorPosition,
      phi: phi,
      ALPHA: ALPHA,
      movingCorner: movingCorner
    });
    lockAspectRatioDiagonal = (0, _calculateLockAspectRatioDiagonal.calculateLockAspectRatioDiagonal)({
      minCursorPosition: minCursorPosition,
      phi: phi,
      ALPHA: ALPHA,
      movingCorner: movingCorner
    });
    widthShouldBeConstant = false;
    heightShouldBeConstant = false;

    var _calculateLockAspectR = (0, _calculateLockAspectRatioCursorCases.calculateLockAspectRatioCursorCases)({
      lockAspectRatio: lockAspectRatio,
      phi: phi,
      omega: omega,
      widthTooLow: widthTooLow,
      heightTooLow: heightTooLow,
      fixedCornerPositionRotated: fixedCornerPositionRotated,
      movingCorner: movingCorner,
      minHeight: minHeight,
      cursorPosition: cursorPosition,
      diagonal: diagonal,
      height: height,
      width: width,
      ALPHA: ALPHA,
      minCursorPosition: minCursorPosition
    });

    cursorPositionChecked = _calculateLockAspectR.cursorPositionChecked;
  }
  /*9. get the new center of the element rotated : 
    it is the middle of the line between fixed corner and moving one*/


  var newCenter = {
    X: (fixedCornerPositionRotated.x + cursorPositionChecked.x) / 2,
    Y: (fixedCornerPositionRotated.y + cursorPositionChecked.y) / 2
  };
  /*10. the new center is the same for rotated or non rotated element: 
      we get the new position of the non rotated fixed corner*/

  var newFixedCornerPositionNonRotated = (0, _interactionsHelpers.calculateRotateCoordsInSystem)({
    initCoords: fixedCornerPositionRotated,
    centerCoords: newCenter,
    ALPHA: ALPHA
  });
  /*11. the moving corner is the symetric of the fixed corner with respect to the new center*/

  var cursorPositionNotRotated = {
    x: newCenter.X + (newCenter.X - newFixedCornerPositionNonRotated.x),
    y: newCenter.Y + (newCenter.Y - newFixedCornerPositionNonRotated.y)
  };
  /*12. Get the new dimensions in non rotated new element*/

  var newDimensions = (0, _calculateNewDimensions.calculateNewDimensions)({
    widthShouldBeConstant: widthShouldBeConstant,
    heightShouldBeConstant: heightShouldBeConstant,
    cursorPositionNotRotated: cursorPositionNotRotated,
    newFixedCornerPositionNonRotated: newFixedCornerPositionNonRotated,
    width: width,
    height: height,
    lockAspectRatio: lockAspectRatio,
    movingCorner: movingCorner
  });
  /*14. New height can't be smaller than minimum height*/
  // newDimensions.height < minHeight && lockAspectRatio && (newDimensions.width = minHeight / Math.tan(phi));

  newDimensions.height < minHeight && (newDimensions.height = minHeight);
  /*15. Get new position in non rotated new element*/

  var newPosition = (0, _calculateNewPosition.calculateNewPosition)({
    x: x,
    y: y,
    newDimensions: newDimensions,
    fixedCorner: fixedCorner,
    newFixedCornerPositionNonRotated: newFixedCornerPositionNonRotated
  });
  /*16. check if everything is within the bounds*/

  var _checkInsideTheBounds = (0, _interactionsHelpers.checkInsideTheBounds)({
    bounds: bounds,
    x: newPosition.x,
    y: newPosition.y,
    width: newDimensions.width,
    height: newDimensions.height,
    ALPHA: ALPHA,
    centerCoords: newCenter,
    status: 'isResizing',
    disableBounds: disableBounds
  }),
      rootTransformedBoundingRect = _checkInsideTheBounds.rootTransformedBoundingRect,
      xInsideBounds = _checkInsideTheBounds.xInsideBounds,
      yInsideBounds = _checkInsideTheBounds.yInsideBounds,
      widthInsideBounds = _checkInsideTheBounds.widthInsideBounds,
      heightInsideBounds = _checkInsideTheBounds.heightInsideBounds;

  newPosition.x = xInsideBounds;
  newPosition.y = yInsideBounds;
  newDimensions.width = widthInsideBounds;
  newDimensions.height = heightInsideBounds;
  /*17. FINALLY, return proper values*/

  /*to avoid any bug, we put || 0*/

  if (widthTooLow && heightTooLow) {
    return {
      x: x || 0,
      y: y || 0,
      width: width || 0,
      height: height || 0,
      cursorPositionChecked: cursorPositionChecked,
      rootTransformedBoundingRect: rootTransformedBoundingRect,
      minCursorPosition: minCursorPosition,
      lockAspectRatioDiagonalPerpendicular: lockAspectRatioDiagonalPerpendicular,
      lockAspectRatioDiagonal: lockAspectRatioDiagonal
    };
  } else {
    return {
      x: newPosition.x || 0,
      y: newPosition.y || 0,
      width: newDimensions.width || 0,
      height: newDimensions.height || 0,
      cursorPositionChecked: cursorPositionChecked,
      rootTransformedBoundingRect: rootTransformedBoundingRect,
      minCursorPosition: minCursorPosition,
      lockAspectRatioDiagonalPerpendicular: lockAspectRatioDiagonalPerpendicular,
      lockAspectRatioDiagonal: lockAspectRatioDiagonal
    };
  }
};

exports.elementResizeGlobalMethod = elementResizeGlobalMethod;