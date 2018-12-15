"use strict";

var _ = require("./");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('getBgProperties: calculate background properties when cropping is finished', function () {
  var defaultState = {
    elementPosition: {
      x: 10,
      y: 30
    },
    imagePosition: {
      x: 10,
      y: 30
    },
    rotation: 0
  };
  it('no rotation, no image cropped', function () {
    expect((0, _.getBgProperties)(defaultState)).toEqual({
      x: 0,
      y: 0
    });
  });
  it('any rotation, no image cropped', function () {
    var rotation = Math.random() * 360;

    var initialState = _objectSpread({}, defaultState, {
      rotation: rotation
    });

    expect((0, _.getBgProperties)(initialState)).toEqual({
      x: 0,
      y: 0
    });
  });
  it('no rotation, image cropped from anywhere', function () {
    var x = Math.round(Math.random() * 1000);
    var y = Math.round(Math.random() * 1000);

    var initialState = _objectSpread({}, defaultState, {
      imagePosition: {
        x: x,
        y: y
      }
    });

    expect((0, _.getBgProperties)(initialState)).toEqual({
      x: x - 10,
      y: y - 30
    });
  });
  it('rotation and image cropped', function () {
    var initialState = _objectSpread({}, defaultState, {
      imagePosition: {
        x: 45.32,
        y: 34.22
      },
      rotation: 45
    });

    expect((0, _.getBgProperties)(initialState)).toEqual({
      x: 27.959,
      y: -21.991
    });
  });
});