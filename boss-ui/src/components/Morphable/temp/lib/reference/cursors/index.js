"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _corners = require("../corners");

//firefox bug: https://stackoverflow.com/questions/30676125/svg-as-data-uri-triggers-xml-parsing-error-in-firefox
var resize = function resize(rotation) {
  return "<svg width='20px' height='20px' transform='rotate(".concat(rotation, ")' viewBox='0 0 20 20' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><defs></defs><g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='resizeupdown' fill-rule='nonzero'><g id='bg-copy' opacity='0.00999999978' fill='%23FFFFFF'><rect id='bg' x='0' y='0' width='20' height='20'></rect></g><polygon id='resize-border' fill='%23FFFFFF' points='9.9883 1 4.5273 6.962 8.0053 6.962 8.0053 8 2.0003 8 2.0003 8.019 2.0003 11.961 2.0003 11.981 8.0053 11.981 8.0053 13.039 4.5393 13.039 10.0113 19 15.4733 13.039 11.9953 13.039 11.9953 11.981 18.0003 11.981 18.0003 8 11.9943 8 11.9943 6.962 15.4613 6.962'></polygon><polygon id='resize' fill='%23000000' points='16.9609 9.0195 10.9799 9.0195 10.9799 5.9805 13.2399 5.9805 9.9889 2.6615 6.7659 5.9805 9.0199 5.9805 9.0199 9.0195 3.0399 9.0195 3.0199 9.0195 3.0199 10.9805 3.0399 10.9805 9.0399 10.9805 9.0399 14.0195 6.7599 14.0195 10.0109 17.3395 13.2339 14.0195 10.9809 14.0195 10.9809 10.9805 16.9609 10.9805 16.9809 10.9805 16.9809 9.0195'></polygon></g></g></svg>");
};

var rotate = function rotate(rotation) {
  return "<svg width='20px' height='20px' transform='rotate(".concat(-90 + rotation, ")' viewBox='0 0 250 250' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><defs></defs><g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g id='rotate' transform='translate(-39.000000, -38.000000)'><g id='Group-4' transform='translate(39.000000, 38.000000)' opacity='0.00999999978' fill-rule='nonzero' fill='%23FFFFFF'><rect id='bg' x='0' y='0' width='250' height='250'></rect></g><path d='M118.743179,133.571646 C141.298009,135.369488 158.920665,142.752306 171.611144,155.7201 C184.301624,168.687894 191.730455,186.236703 193.897637,208.366529 L149.397568,208.366529 L214.027867,278.406331 L278.380005,208.366529 L233.396982,208.366529 C233.978666,176.143685 222.849342,148.940663 200.00901,126.757464 C177.168678,104.574265 150.080068,93.482665 118.743179,93.482665 L118.743179,48 L48,112.828291 L118.743179,177.983203 L118.743179,133.571646 Z' stroke='%23FFFFFF' stroke-width='13' fill='%23000000' transform='translate(163.190002, 163.203166) rotate(45.000000) translate(-163.190002, -163.203166) '></path></g></g></svg>");
};

var topLeft = function topLeft(_ref) {
  var rotation = _ref.rotation,
      handleDragFor = _ref.handleDragFor;
  return "url(\"data:image/svg+xml;utf8,".concat(handleDragFor === 'resize' ? resize(_corners.cornerAnglesForCursor.topLeft + rotation) : rotate(_corners.cornerAnglesForCursor.topLeft + rotation), "\") 10 10, auto");
};

var topRight = function topRight(_ref2) {
  var rotation = _ref2.rotation,
      handleDragFor = _ref2.handleDragFor;
  return "url(\"data:image/svg+xml;utf8,".concat(handleDragFor === 'resize' ? resize(_corners.cornerAnglesForCursor.topRight + rotation) : rotate(_corners.cornerAnglesForCursor.topRight + rotation), "\") 10 10, auto");
};

var bottomLeft = function bottomLeft(_ref3) {
  var rotation = _ref3.rotation,
      handleDragFor = _ref3.handleDragFor;
  return "url(\"data:image/svg+xml;utf8,".concat(handleDragFor === 'resize' ? resize(_corners.cornerAnglesForCursor.bottomLeft + rotation) : rotate(_corners.cornerAnglesForCursor.bottomLeft + rotation), "\") 10 10, auto");
};

var bottomRight = function bottomRight(_ref4) {
  var rotation = _ref4.rotation,
      handleDragFor = _ref4.handleDragFor;
  return "url(\"data:image/svg+xml;utf8,".concat(handleDragFor === 'resize' ? resize(_corners.cornerAnglesForCursor.bottomRight + rotation) : rotate(_corners.cornerAnglesForCursor.bottomRight + rotation), "\") 10 10, auto");
};

var middleTop = function middleTop(_ref5) {
  var rotation = _ref5.rotation,
      handleDragFor = _ref5.handleDragFor;
  return "url(\"data:image/svg+xml;utf8,".concat(handleDragFor === 'resize' ? resize(_corners.cornerAnglesForCursor.middleTop + rotation) : rotate(_corners.cornerAnglesForCursor.middleTop + rotation), "\") 10 10, auto");
};

var middleRight = function middleRight(_ref6) {
  var rotation = _ref6.rotation,
      handleDragFor = _ref6.handleDragFor;
  return "url(\"data:image/svg+xml;utf8,".concat(handleDragFor === 'resize' ? resize(_corners.cornerAnglesForCursor.middleRight + rotation) : rotate(_corners.cornerAnglesForCursor.middleRight + rotation), "\") 10 10, auto");
};

var middleBottom = function middleBottom(_ref7) {
  var rotation = _ref7.rotation,
      handleDragFor = _ref7.handleDragFor;
  return "url(\"data:image/svg+xml;utf8,".concat(handleDragFor === 'resize' ? resize(_corners.cornerAnglesForCursor.middleBottom + rotation) : rotate(_corners.cornerAnglesForCursor.middleBottom + rotation), "\") 10 10, auto");
};

var middleLeft = function middleLeft(_ref8) {
  var rotation = _ref8.rotation,
      handleDragFor = _ref8.handleDragFor;
  return "url(\"data:image/svg+xml;utf8,".concat(handleDragFor === 'resize' ? resize(_corners.cornerAnglesForCursor.middleLeft + rotation) : rotate(_corners.cornerAnglesForCursor.middleLeft + rotation), "\") 10 10, auto");
};

var _default = {
  topLeft: topLeft,
  topRight: topRight,
  bottomLeft: bottomLeft,
  bottomRight: bottomRight,
  middleTop: middleTop,
  middleRight: middleRight,
  middleBottom: middleBottom,
  middleLeft: middleLeft
};
exports.default = _default;