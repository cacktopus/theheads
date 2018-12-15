"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkInsideTheBounds = void 0;

var _ = require("./");

var checkInsideTheBounds = function checkInsideTheBounds(_ref) {
  var disableBounds = _ref.disableBounds,
      bounds = _ref.bounds,
      x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height,
      centerCoords = _ref.centerCoords,
      ALPHA = _ref.ALPHA,
      status = _ref.status,
      rootTransformedBoundingsOffsetArg = _ref.rootTransformedBoundingsOffset;
  var xInsideBounds = x;
  var yInsideBounds = y;
  var widthInsideBounds = width;
  var heightInsideBounds = height;

  if (!bounds || disableBounds.forDrag && status === 'isDragging' || disableBounds.forResize && status === 'isResizing') {
    return {
      rootTransformedBoundingRect: null,
      xInsideBounds: xInsideBounds,
      yInsideBounds: yInsideBounds,
      widthInsideBounds: widthInsideBounds,
      heightInsideBounds: heightInsideBounds
    };
  }

  var rootTransformedBoundingRect = (0, _.calculateRootTransformedBoundingRect)({
    x: x,
    y: y,
    ALPHA: ALPHA,
    width: width,
    height: height,
    centerCoords: centerCoords
  });
  var rootTransformedBoundingsOffset;

  if (!rootTransformedBoundingsOffsetArg) {
    console.log(status);
    rootTransformedBoundingsOffset.top = rootTransformedBoundingRect.top - newPosition.y;
    rootTransformedBoundingsOffset.left = rootTransformedBoundingRect.left - newPosition.x;
    rootTransformedBoundingsOffset.bottom = rootTransformedBoundingRect.bottom - newPosition.y - newDimensions.height;
    rootTransformedBoundingsOffset.right = rootTransformedBoundingRect.right - newPosition.x - newDimensions.width;
  } else {
    rootTransformedBoundingsOffset = rootTransformedBoundingsOffsetArg;
  }

  var sidesOutsideBounds = Object.keys(rootTransformedBoundingRect).map(function (side) {
    return {
      side: side,
      goingOutsideTheBounds: side === 'top' || side === 'left' ? rootTransformedBoundingRect[side] < bounds[side] : rootTransformedBoundingRect[side] > bounds[side]
    };
  }).filter(function (side) {
    return side.goingOutsideTheBounds;
  });

  if (sidesOutsideBounds.length > 0) {
    sidesOutsideBounds.map(function (sideProps) {
      return sideProps.side;
    }).forEach(function (sideOutsideBounds) {
      switch (status) {
        case 'isDragging':
          {
            if (sideOutsideBounds === 'top') {
              yInsideBounds = bounds.top - rootTransformedBoundingsOffset.top;
            }

            if (sideOutsideBounds === 'left') {
              xInsideBounds = bounds.left - rootTransformedBoundingsOffset.left;
            }

            if (sideOutsideBounds === 'bottom') {
              yInsideBounds = bounds.bottom - rootTransformedBoundingsOffset.bottom - height;
            }

            if (sideOutsideBounds === 'right') {
              xInsideBounds = bounds.right - rootTransformedBoundingsOffset.right - width;
            }

            break;
          }

        case 'isResizing':
          {
            if (sideOutsideBounds === 'top') {}

            if (sideOutsideBounds === 'left') {}

            if (sideOutsideBounds === 'bottom') {}

            if (sideOutsideBounds === 'right') {}

            break;
          }

        default:
          break;
      }
    });
  }

  return {
    rootTransformedBoundingRect: rootTransformedBoundingRect,
    xInsideBounds: xInsideBounds,
    yInsideBounds: yInsideBounds,
    widthInsideBounds: widthInsideBounds,
    heightInsideBounds: heightInsideBounds
  };
};

exports.checkInsideTheBounds = checkInsideTheBounds;