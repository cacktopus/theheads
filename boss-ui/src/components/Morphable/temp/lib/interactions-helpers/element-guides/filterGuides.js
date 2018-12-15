"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterGuides = void 0;

var filterGuides = function filterGuides(_ref) {
  var guides = _ref.guides,
      guidesToShow = _ref.guidesToShow;

  /* if several same direction guides are in conflict with center guide, we choose to chow center guide only */
  return guidesToShow.filter(function (ind) {
    return guides[ind].orientation === 'horizontal' && guides[ind].magnetism !== 'center' && guidesToShow.filter(function (ind2) {
      return guides[ind2].orientation === 'horizontal' && guides[ind2].magnetism === 'center';
    }).length === 0 || guides[ind].orientation === 'vertical' && guides[ind].magnetism !== 'center' && guidesToShow.filter(function (ind2) {
      return guides[ind2].orientation === 'vertical' && guides[ind2].magnetism === 'center';
    }).length === 0 || guides[ind].magnetism === 'center';
  });
};

exports.filterGuides = filterGuides;