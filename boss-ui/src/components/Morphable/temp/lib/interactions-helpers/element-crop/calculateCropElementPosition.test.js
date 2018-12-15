"use strict";

var _ = require("./");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('calculateCropElementPosition: calculate image position when start cropping', function () {
  var defaultState = {
    picWhileCroppingProperties: {
      width: 200,
      height: 100,
      x: 10,
      y: 30,
      rotation: 0
    },
    width: 200,
    height: 100,
    x: 10,
    y: 30,
    rotation: 0
  };
  it('no rotation, no image cropped', function () {
    expect((0, _.calculateCropElementPosition)(defaultState)).toEqual({
      x: 10,
      y: 30
    });
  });
  it('any rotation, no image cropped', function () {
    var rotation = Math.random() * 360;

    var initialState = _objectSpread({}, defaultState, {
      picWhileCroppingProperties: _objectSpread({}, defaultState.picWhileCroppingProperties, {
        rotation: rotation
      }),
      rotation: rotation
    });

    expect((0, _.calculateCropElementPosition)(initialState)).toEqual({
      x: 10,
      y: 30
    });
  });
  it('no rotation, image cropped from anywhere', function () {
    var x = Math.round(Math.random() * 1000);
    var y = Math.round(Math.random() * 1000);
    var width = Math.round(Math.random() * 1000);
    var height = Math.round(Math.random() * 1000);

    var initialState = _objectSpread({}, defaultState, {
      picWhileCroppingProperties: _objectSpread({}, defaultState.picWhileCroppingProperties, {
        x: x,
        y: y,
        width: width,
        height: height
      })
    });

    expect((0, _.calculateCropElementPosition)(initialState)).toEqual({
      x: x,
      y: y
    });
  });
  it('rotation and image cropped', function () {
    var initialState = _objectSpread({}, defaultState, {
      picWhileCroppingProperties: {
        x: 30,
        y: 40,
        width: 100,
        height: 50,
        rotation: 45
      },
      rotation: 45
    });

    expect((0, _.calculateCropElementPosition)(initialState)).toEqual({
      x: 49.3934,
      y: 23.1802
    });
  });
});