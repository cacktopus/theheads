"use strict";

var _interactionsHelpers = require("../../interactions-helpers");

var _corners = require("../../reference/corners");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var centerCoords = {
  X: 200,
  Y: 200
};
var topRight = {
  x: 400,
  y: 0,
  omega: Math.round(Math.PI / 4 * 100000) / 100000
};
var middleTop = {
  x: 200,
  y: 0,
  omega: Math.round(Math.PI / 2 * 100000) / 100000
};
var topLeft = {
  x: 0,
  y: 0,
  omega: Math.round(3 * Math.PI / 4 * 100000) / 100000
};
var middleLeft = {
  x: 0,
  y: 200,
  omega: Math.round(Math.PI * 100000) / 100000
};
var bottomLeft = {
  x: 0,
  y: 400,
  omega: Math.round(5 * Math.PI / 4 * 100000) / 100000
};
var middleBottom = {
  x: 200,
  y: 400,
  omega: Math.round(3 * Math.PI / 2 * 100000) / 100000
};
var bottomRight = {
  x: 400,
  y: 400,
  omega: Math.round(7 * Math.PI / 4 * 100000) / 100000
};
var middleRight = {
  x: 400,
  y: 200,
  omega: Math.round(0 * 100000) / 100000
};
describe('calculateRotateCoordsInSystem: change system coords from rotated to not-rotated', function () {
  describe('not rotated system', function () {
    it('top right corner', function () {
      var initParams = {
        initCoords: topRight,
        centerCoords: centerCoords,
        ALPHA: 0
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(topRight);
    });
    it('middle top', function () {
      var initParams = {
        initCoords: middleTop,
        centerCoords: centerCoords,
        ALPHA: 0
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleTop);
    });
    it('top left corner', function () {
      var initParams = {
        initCoords: topLeft,
        centerCoords: centerCoords,
        ALPHA: 0
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(topLeft);
    });
    it('middle left', function () {
      var initParams = {
        initCoords: middleLeft,
        centerCoords: centerCoords,
        ALPHA: 0
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleLeft);
    });
    it('bottom left corner', function () {
      var initParams = {
        initCoords: bottomLeft,
        centerCoords: centerCoords,
        ALPHA: 0
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(bottomLeft);
    });
    it('middle bottom', function () {
      var initParams = {
        initCoords: middleBottom,
        centerCoords: centerCoords,
        ALPHA: 0
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleBottom);
    });
    it('bottom right corner', function () {
      var initParams = {
        initCoords: bottomRight,
        centerCoords: centerCoords,
        ALPHA: 0
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(bottomRight);
    });
    it('middle right', function () {
      var initParams = {
        initCoords: middleRight,
        centerCoords: centerCoords,
        ALPHA: 0
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleRight);
    });
  });
  describe('90deg rotated system', function () {
    it('top right corner', function () {
      var initParams = {
        initCoords: topRight,
        centerCoords: centerCoords,
        ALPHA: 90 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(bottomRight);
    });
    it('middle top', function () {
      var initParams = {
        initCoords: middleTop,
        centerCoords: centerCoords,
        ALPHA: 90 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleRight);
    });
    it('top left corner', function () {
      var initParams = {
        initCoords: topLeft,
        centerCoords: centerCoords,
        ALPHA: 90 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(topRight);
    });
    it('middle left', function () {
      var initParams = {
        initCoords: middleLeft,
        centerCoords: centerCoords,
        ALPHA: 90 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleTop);
    });
    it('bottom left corner', function () {
      var initParams = {
        initCoords: bottomLeft,
        centerCoords: centerCoords,
        ALPHA: 90 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(topLeft);
    });
    it('middle bottom', function () {
      var initParams = {
        initCoords: middleBottom,
        centerCoords: centerCoords,
        ALPHA: 90 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleLeft);
    });
    it('bottom right corner', function () {
      var initParams = {
        initCoords: bottomRight,
        centerCoords: centerCoords,
        ALPHA: 90 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(bottomLeft);
    });
    it('middle right', function () {
      var initParams = {
        initCoords: middleRight,
        centerCoords: centerCoords,
        ALPHA: 90 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleBottom);
    });
  });
  describe('180deg rotated system', function () {
    it('top right corner', function () {
      var initParams = {
        initCoords: topRight,
        centerCoords: centerCoords,
        ALPHA: 180 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(bottomLeft);
    });
    it('middle top', function () {
      var initParams = {
        initCoords: middleTop,
        centerCoords: centerCoords,
        ALPHA: 180 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleBottom);
    });
    it('top left corner', function () {
      var initParams = {
        initCoords: topLeft,
        centerCoords: centerCoords,
        ALPHA: 180 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(bottomRight);
    });
    it('middle left', function () {
      var initParams = {
        initCoords: middleLeft,
        centerCoords: centerCoords,
        ALPHA: 180 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleRight);
    });
    it('bottom left corner', function () {
      var initParams = {
        initCoords: bottomLeft,
        centerCoords: centerCoords,
        ALPHA: 180 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(topRight);
    });
    it('middle bottom', function () {
      var initParams = {
        initCoords: middleBottom,
        centerCoords: centerCoords,
        ALPHA: 180 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleTop);
    });
    it('bottom right corner', function () {
      var initParams = {
        initCoords: bottomRight,
        centerCoords: centerCoords,
        ALPHA: 180 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(topLeft);
    });
    it('middle right', function () {
      var initParams = {
        initCoords: middleRight,
        centerCoords: centerCoords,
        ALPHA: 180 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleLeft);
    });
  });
  describe('270deg rotated system', function () {
    it('top right corner', function () {
      var initParams = {
        initCoords: topRight,
        centerCoords: centerCoords,
        ALPHA: 270 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(topLeft);
    });
    it('middle top', function () {
      var initParams = {
        initCoords: middleTop,
        centerCoords: centerCoords,
        ALPHA: 270 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleLeft);
    });
    it('top left corner', function () {
      var initParams = {
        initCoords: topLeft,
        centerCoords: centerCoords,
        ALPHA: 270 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(bottomLeft);
    });
    it('middle left', function () {
      var initParams = {
        initCoords: middleLeft,
        centerCoords: centerCoords,
        ALPHA: 270 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleBottom);
    });
    it('bottom left corner', function () {
      var initParams = {
        initCoords: bottomLeft,
        centerCoords: centerCoords,
        ALPHA: 270 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(bottomRight);
    });
    it('middle bottom', function () {
      var initParams = {
        initCoords: middleBottom,
        centerCoords: centerCoords,
        ALPHA: 270 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleRight);
    });
    it('bottom right corner', function () {
      var initParams = {
        initCoords: bottomRight,
        centerCoords: centerCoords,
        ALPHA: 270 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(topRight);
    });
    it('middle right', function () {
      var initParams = {
        initCoords: middleRight,
        centerCoords: centerCoords,
        ALPHA: 270 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleTop);
    });
  });
  describe('360deg rotated system', function () {
    it('top right corner', function () {
      var initParams = {
        initCoords: topRight,
        centerCoords: centerCoords,
        ALPHA: 360 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(topRight);
    });
    it('middle top', function () {
      var initParams = {
        initCoords: middleTop,
        centerCoords: centerCoords,
        ALPHA: 360 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleTop);
    });
    it('top left corner', function () {
      var initParams = {
        initCoords: topLeft,
        centerCoords: centerCoords,
        ALPHA: 360 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(topLeft);
    });
    it('middle left', function () {
      var initParams = {
        initCoords: middleLeft,
        centerCoords: centerCoords,
        ALPHA: 360 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleLeft);
    });
    it('bottom left corner', function () {
      var initParams = {
        initCoords: bottomLeft,
        centerCoords: centerCoords,
        ALPHA: 360 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(bottomLeft);
    });
    it('middle bottom', function () {
      var initParams = {
        initCoords: middleBottom,
        centerCoords: centerCoords,
        ALPHA: 360 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleBottom);
    });
    it('bottom right corner', function () {
      var initParams = {
        initCoords: bottomRight,
        centerCoords: centerCoords,
        ALPHA: 360 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(bottomRight);
    });
    it('middle right', function () {
      var initParams = {
        initCoords: middleRight,
        centerCoords: centerCoords,
        ALPHA: 360 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual(middleRight);
    });
  });
  describe('special cases', function () {
    it('rectangle 100 x 150 rotated 90deg position top left', function () {
      var initParams = {
        initCoords: {
          x: 125,
          y: -25
        },
        centerCoords: {
          X: 75,
          Y: 50
        },
        ALPHA: 2 * Math.PI - 90 * Math.PI / 180
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toEqual({
        x: 0,
        y: 0,
        omega: Math.round((Math.PI - Math.atan(50 / 75)) * 100000) / 100000
      });
    });
    it('rectangle 200 x 200 position middle left', function () {
      var initParams = {
        initCoords: {
          x: 0,
          y: 100
        },
        centerCoords: {
          X: 200,
          Y: 200
        },
        ALPHA: 0
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toMatchObject({
        x: 0,
        y: 100
      });
    });
    it('rectangle 200 x 200 position top left', function () {
      var initParams = {
        initCoords: {
          x: 0,
          y: 0
        },
        centerCoords: {
          X: 200,
          Y: 200
        },
        ALPHA: 0
      };
      expect((0, _interactionsHelpers.calculateRotateCoordsInSystem)(initParams)).toMatchObject({
        x: 0,
        y: 0
      });
    });
  });
});
describe('elementResizeGlobalMethod: get new position and dimension parameters for the element', function () {
  describe('not rotated system', function () {
    var initialState = {
      width: 100,
      height: 100,
      x: 10,
      y: 10,
      rotation: 0,
      lockAspectRatio: false,
      fixedWidth: false,
      fixedHeight: false,
      minHeight: 0,
      bounds: {
        top: -500,
        left: -500,
        right: 800,
        bottom: 750
      }
    };
    it('moving top left handle', function () {
      var movingCorner = _corners.corners.topLeft;
      var cursorPosition = {
        x: 4,
        y: 6
      };
      expect((0, _interactionsHelpers.elementResizeGlobalMethod)(_objectSpread({}, initialState, {
        movingCorner: movingCorner,
        cursorPosition: cursorPosition
      }))).toMatchObject({
        width: 106,
        height: 104,
        x: 4,
        y: 6,
        cursorPositionChecked: {
          x: 4,
          y: 6
        }
      });
    });
    describe('moving midle left handle', function () {
      it('lock aspect ratio', function () {
        var movingCorner = _corners.corners.middleLeft;
        var cursorPosition = {
          x: 15,
          y: 60
        };
        expect((0, _interactionsHelpers.elementResizeGlobalMethod)(_objectSpread({}, initialState, {
          movingCorner: movingCorner,
          cursorPosition: cursorPosition,
          lockAspectRatio: true
        }))).toMatchObject({
          width: 95,
          height: 95,
          x: 15,
          y: 12.5,
          cursorPositionChecked: {
            x: 15,
            y: 60.00025209103037
          }
        });
      });
      it('no lock aspect ratio', function () {
        var movingCorner = _corners.corners.middleLeft;
        var cursorPosition = {
          x: 15,
          y: 60
        };
        expect((0, _interactionsHelpers.elementResizeGlobalMethod)(_objectSpread({}, initialState, {
          movingCorner: movingCorner,
          cursorPosition: cursorPosition
        }))).toMatchObject({
          width: 95,
          height: 100,
          x: 15,
          y: 10,
          cursorPositionChecked: {
            x: 15,
            y: 10.000448831955119
          }
        });
      });
    });
    it('moving bottom left handle', function () {
      var movingCorner = _corners.corners.bottomLeft;
      var cursorPosition = {
        x: 4,
        y: 116
      };
      expect((0, _interactionsHelpers.elementResizeGlobalMethod)(_objectSpread({}, initialState, {
        movingCorner: movingCorner,
        cursorPosition: cursorPosition
      }))).toMatchObject({
        width: 106,
        height: 106,
        x: 4,
        y: 10,
        cursorPositionChecked: {
          x: 4,
          y: 116
        }
      });
    });
    it('moving bottom right handle', function () {
      var movingCorner = _corners.corners.bottomRight;
      var cursorPosition = {
        x: 114,
        y: 116
      };
      expect((0, _interactionsHelpers.elementResizeGlobalMethod)(_objectSpread({}, initialState, {
        movingCorner: movingCorner,
        cursorPosition: cursorPosition
      }))).toMatchObject({
        width: 104,
        height: 106,
        x: 10,
        y: 10,
        cursorPositionChecked: {
          x: 114,
          y: 116
        }
      });
    });
    it('moving top right handle', function () {
      var movingCorner = _corners.corners.topRight;
      var cursorPosition = {
        x: 114,
        y: 6
      };
      expect((0, _interactionsHelpers.elementResizeGlobalMethod)(_objectSpread({}, initialState, {
        movingCorner: movingCorner,
        cursorPosition: cursorPosition
      }))).toMatchObject({
        width: 104,
        height: 104,
        x: 10,
        y: 6,
        cursorPositionChecked: {
          x: 114,
          y: 6
        }
      });
    });
  });
  describe('90deg rotated system', function () {
    var initialState = {
      width: 100,
      height: 100,
      x: 10,
      y: 10,
      rotation: -90,
      lockAspectRatio: false,
      fixedWidth: false,
      fixedHeight: false,
      minHeight: 0,
      bounds: {
        top: -500,
        left: -500,
        right: 800,
        bottom: 750
      }
    };
    it('moving top left handle', function () {
      var movingCorner = _corners.corners.topLeft;
      var cursorPosition = {
        x: 4,
        y: 116
      };
      expect((0, _interactionsHelpers.elementResizeGlobalMethod)(_objectSpread({}, initialState, {
        movingCorner: movingCorner,
        cursorPosition: cursorPosition
      }))).toMatchObject({
        width: 106,
        height: 106,
        x: 4,
        y: 10,
        cursorPositionChecked: {
          x: 4,
          y: 116
        }
      });
    });
    it('moving bottom left handle', function () {
      var movingCorner = _corners.corners.bottomLeft;
      var cursorPosition = {
        x: 200,
        y: 150
      };
      expect((0, _interactionsHelpers.elementResizeGlobalMethod)(_objectSpread({}, initialState, {
        movingCorner: movingCorner,
        cursorPosition: cursorPosition
      }))).toMatchObject({
        width: 140,
        height: 190,
        x: 35,
        y: -15,
        cursorPositionChecked: {
          x: 200,
          y: 150
        }
      });
    });
    it('moving bottom right handle', function () {
      var movingCorner = _corners.corners.bottomRight;
      var cursorPosition = {
        x: 115,
        y: 5
      };
      expect((0, _interactionsHelpers.elementResizeGlobalMethod)(_objectSpread({}, initialState, {
        movingCorner: movingCorner,
        cursorPosition: cursorPosition
      }))).toMatchObject({
        width: 105,
        height: 105,
        x: 10,
        y: 5,
        cursorPositionChecked: {
          x: 115,
          y: 5
        }
      });
    });
    it('moving top right handle', function () {
      var movingCorner = _corners.corners.topRight;
      var cursorPosition = {
        x: 5,
        y: 5
      };
      expect((0, _interactionsHelpers.elementResizeGlobalMethod)(_objectSpread({}, initialState, {
        movingCorner: movingCorner,
        cursorPosition: cursorPosition
      }))).toMatchObject({
        width: 105,
        height: 105,
        x: 5,
        y: 5,
        cursorPositionChecked: {
          x: 5,
          y: 5
        }
      });
    });
  });
});