"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var guides = function guides(_ref) {
  var motherHeight = _ref.motherHeight,
      motherWidth = _ref.motherWidth,
      motherBorderWidth = _ref.motherBorderWidth,
      x = _ref.x,
      y = _ref.y,
      height = _ref.height,
      width = _ref.width;
  return [//Center of element with center of mother
  {
    orientation: 'horizontal',
    magnetism: 'center',
    position: {
      top: motherHeight / 2 - motherBorderWidth
    }
  }, {
    orientation: 'vertical',
    magnetism: 'center',
    position: {
      left: motherWidth / 2 - motherBorderWidth
    }
  }, //Block effect when getting out of mother
  {
    orientation: 'horizontal',
    magnetism: 'top',
    position: {
      top: 0
    }
  }, {
    orientation: 'horizontal',
    magnetism: 'bottom',
    position: {
      top: motherHeight - 2 * motherBorderWidth
    }
  }, {
    orientation: 'vertical',
    magnetism: 'right',
    position: {
      left: motherWidth - 2 * motherBorderWidth
    }
  }, {
    orientation: 'vertical',
    magnetism: 'left',
    position: {
      left: 0
    }
  }];
};

var _default = guides;
exports.default = _default;