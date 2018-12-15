"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGuidesToShowForResize = void 0;

var _corners = require("../../reference/corners");

var getGuidesToShowForResize = function getGuidesToShowForResize(_ref) {
  var guides = _ref.guides,
      rotation = _ref.rotation,
      newParams = _ref.newParams,
      magnetismGrid = _ref.magnetismGrid,
      disableGuides = _ref.disableGuides,
      movingCorner = _ref.movingCorner,
      zoom = _ref.zoom;
  var newX = newParams.x;
  var newY = newParams.y;
  var newWidth = newParams.width;
  var newHeight = newParams.height;
  var guidesToShow = [];

  if (disableGuides || Math.abs(rotation) !== 0) {
    return {
      guidesToShow: guidesToShow,
      newX: newX,
      newY: newY,
      newWidth: newWidth,
      newHeight: newHeight
    };
  }

  var theoreticalBottomRightCoords = {
    x: newX + newWidth,
    y: newY + newHeight
  };
  var theoreticalCenterCoords = {
    x: newX + newWidth / 2,
    y: newY + newHeight / 2
  };
  guides.forEach(function (guide, ind) {
    if (guide.orientation === 'vertical') {
      /* center guide */
      if (guide.magnetism === 'center' && Math.abs(theoreticalCenterCoords.x - guide.position.left * zoom) < magnetismGrid * zoom) {
        if (movingCorner === _corners.corners.bottomRight || movingCorner === _corners.corners.middleRight || movingCorner === _corners.corners.middleBottom || movingCorner === _corners.corners.topRight) {
          newWidth = 2 * (guide.position.left * zoom - newX);
        } else {
          newX = guide.position.left * zoom - (theoreticalBottomRightCoords.x - guide.position.left * zoom);
          newWidth = theoreticalBottomRightCoords.x - newX;
        }

        guidesToShow.push(ind);
      } else if (
      /* left guide */
      guide.magnetism === 'left' && (movingCorner === _corners.corners.topLeft || movingCorner === _corners.corners.middleLeft || movingCorner === _corners.corners.bottomLeft) && Math.abs(newX - guide.position.left * zoom) < magnetismGrid * zoom) {
        newX = guide.position.left * zoom;
        newWidth = theoreticalBottomRightCoords.x - newX;
        guidesToShow.push(ind);
      } else if (
      /* right guide */
      guide.magnetism === 'right' && (movingCorner === _corners.corners.topRight || movingCorner === _corners.corners.middleRight || movingCorner === _corners.corners.bottomRight) && Math.abs(theoreticalBottomRightCoords.x - guide.position.left * zoom) < magnetismGrid * zoom) {
        newWidth = guide.position.left * zoom - newX;
        guidesToShow.push(ind);
      }
    }

    if (guide.orientation === 'horizontal') {
      /* center guide */
      if (guide.magnetism === 'center' && Math.abs(theoreticalCenterCoords.y - guide.position.top * zoom) < magnetismGrid * zoom) {
        if (movingCorner === _corners.corners.bottomRight || movingCorner === _corners.corners.middleBottom || movingCorner === _corners.corners.bottomLeft) {
          newHeight = 2 * (guide.position.top * zoom - newY);
        } else {
          newY = guide.position.top * zoom - (theoreticalBottomRightCoords.y - guide.position.top * zoom);
          newHeight = theoreticalBottomRightCoords.y - newY;
        }

        guidesToShow.push(ind);
      } else if (
      /* top guide */
      guide.magnetism === 'top' && (movingCorner === _corners.corners.topLeft || movingCorner === _corners.corners.middleTop || movingCorner === _corners.corners.topRight) && Math.abs(newY - guide.position.top * zoom) < magnetismGrid * zoom) {
        newY = guide.position.top * zoom;
        newHeight = theoreticalBottomRightCoords.y - guide.position.top * zoom;
        guidesToShow.push(ind);
      } else if (
      /* bottom guide */
      guide.magnetism === 'bottom' && (movingCorner === _corners.corners.bottomLeft || movingCorner === _corners.corners.middleBottom || movingCorner === _corners.corners.bottomRight) && Math.abs(theoreticalBottomRightCoords.y - guide.position.top * zoom) < magnetismGrid * zoom) {
        newHeight = guide.position.top * zoom - newY;
        guidesToShow.push(ind);
      }
    }
  });
  return {
    guidesToShow: guidesToShow,
    newX: newX,
    newY: newY,
    newWidth: newWidth,
    newHeight: newHeight
  };
};

exports.getGuidesToShowForResize = getGuidesToShowForResize;