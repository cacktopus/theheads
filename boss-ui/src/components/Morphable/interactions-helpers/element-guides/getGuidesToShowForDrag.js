"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGuidesToShowForDrag = void 0;

var getGuidesToShowForDrag = function getGuidesToShowForDrag(_ref) {
  var guides = _ref.guides,
      theoreticalTopLeftCoords = _ref.theoreticalTopLeftCoords,
      theoreticalCenterCoords = _ref.theoreticalCenterCoords,
      theoreticalBottomRightCoords = _ref.theoreticalBottomRightCoords,
      rotation = _ref.rotation,
      width = _ref.width,
      height = _ref.height,
      magnetismGrid = _ref.magnetismGrid,
      disableGuides = _ref.disableGuides,
      zoom = _ref.zoom;

  /*the transformation from zoomed ton non-zoomed is assumed by ElementRoot, not by Morphable*/

  /*therefore, apply the zoom in order to transform the non-zoomed dimensions into zoomed dimensions handled by Morphable*/

  /* zoomed dimensions: 
      theoreticalTopLeftCoords
      theoreticalCenterCoords
      theoreticalBottomRightCoords
    non-zoomed dimensions: 
      guides
      width
      height
      magnetismGrid
  */
  var newX = theoreticalTopLeftCoords.x;
  var newY = theoreticalTopLeftCoords.y;
  var guidesToShow = [];

  if (disableGuides) {
    return {
      guidesToShow: guidesToShow,
      newX: newX,
      newY: newY
    };
  }

  guides.forEach(function (guide, ind) {
    if (guide.orientation === 'vertical') {
      /* center guide */
      if (guide.magnetism === 'center' && Math.abs(theoreticalCenterCoords.x - guide.position.left * zoom) < magnetismGrid * zoom) {
        newX = (guide.position.left - width / 2) * zoom;
        guidesToShow.push(ind);
      }
      /* left guide */


      if (guide.magnetism === 'left' && rotation === 0 && Math.abs(theoreticalTopLeftCoords.x - guide.position.left * zoom) < magnetismGrid * zoom) {
        newX = guide.position.left * zoom;
        guidesToShow.push(ind);
      }
      /* right guide */


      if (guide.magnetism === 'right' && rotation === 0 && Math.abs(theoreticalBottomRightCoords.x - guide.position.left * zoom) < magnetismGrid * zoom) {
        newX = (guide.position.left - width) * zoom;
        guidesToShow.push(ind);
      }
    }

    if (guide.orientation === 'horizontal') {
      /* center guide */
      if (guide.magnetism === 'center' && Math.abs(theoreticalCenterCoords.y - guide.position.top * zoom) < magnetismGrid * zoom) {
        newY = (guide.position.top - height / 2) * zoom;
        guidesToShow.push(ind);
      }
      /* top guide */


      if (guide.magnetism === 'top' && rotation === 0 && Math.abs(theoreticalTopLeftCoords.y - guide.position.top * zoom) < magnetismGrid * zoom) {
        newY = guide.position.top * zoom;
        guidesToShow.push(ind);
      }
      /* bottom guide */


      if (guide.magnetism === 'bottom' && rotation === 0 && Math.abs(theoreticalBottomRightCoords.y - guide.position.top * zoom) < magnetismGrid * zoom) {
        newY = (guide.position.top - height) * zoom;
        guidesToShow.push(ind);
      }
    }
  });
  return {
    guidesToShow: guidesToShow,
    newX: newX,
    newY: newY
  };
};

exports.getGuidesToShowForDrag = getGuidesToShowForDrag;