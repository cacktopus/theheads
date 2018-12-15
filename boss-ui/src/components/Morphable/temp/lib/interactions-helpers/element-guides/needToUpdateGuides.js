"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.needToUpdateGuides = void 0;

var needToUpdateGuides = function needToUpdateGuides(_ref) {
  var currentGuides = _ref.currentGuides,
      guidesToShow = _ref.guidesToShow;
  var needToUpdateGuides = false;
  guidesToShow && guidesToShow.length < currentGuides.length ? needToUpdateGuides = true : guidesToShow.forEach(function (guide, i) {
    return (guide !== currentGuides[i] || currentGuides[i].length === 0) && (needToUpdateGuides = true);
  });
  return needToUpdateGuides;
};

exports.needToUpdateGuides = needToUpdateGuides;