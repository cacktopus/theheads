"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGuidesToShowForRotation = void 0;

var getGuidesToShowForRotation = function getGuidesToShowForRotation(_ref) {
  var guides = _ref.guides,
      angle = _ref.angle,
      magnetismGrid = _ref.magnetismGrid,
      disableGuides = _ref.disableGuides,
      zoom = _ref.zoom;

  /*the transformation from zoomed ton non-zoomed is assumed by ElementRoot, not by Morphable*/

  /*therefore, apply the zoom in order to transform the non-zoomed dimensions into zoomed dimensions handled by Morphable*/

  /* zoomed dimensions: 
      
    non-zoomed dimensions: 
      guides
      magnetismGrid
  */
  var guidesToShow = [];
  var rotation = angle;

  if (disableGuides) {
    return {
      guidesToShow: guidesToShow,
      rotation: rotation
    };
  }

  guides.forEach(function (guide, ind) {
    if (guide.magnetism === 'rotation') {
      if (-angle > 90 - magnetismGrid * zoom && -angle < 90 + magnetismGrid * zoom && guide.orientation === 'vertical') {
        rotation = -90;
        guidesToShow.push(ind);
      }

      if (-angle > 270 - magnetismGrid * zoom && -angle < 270 + magnetismGrid * zoom && guide.orientation === 'vertical') {
        rotation = -270;
        guidesToShow.push(ind);
      }

      if (-angle > 180 - magnetismGrid * zoom && -angle < 180 + magnetismGrid * zoom && guide.orientation === 'horizontal') {
        rotation = -180;
        guidesToShow.push(ind);
      }

      if ((-angle > 360 - magnetismGrid * zoom || -angle < magnetismGrid * zoom) && guide.orientation === 'horizontal') {
        rotation = 0;
        guidesToShow.push(ind);
      }
    }
  });
  return {
    guidesToShow: guidesToShow,
    rotation: rotation
  };
};

exports.getGuidesToShowForRotation = getGuidesToShowForRotation;