"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.handleSize = exports.showDots = exports.borderRootWidth = exports.borderBoxWidth = exports.iconSize = void 0;
var iconSize = 20;
exports.iconSize = iconSize;
var borderBoxWidth = 1;
exports.borderBoxWidth = borderBoxWidth;
var borderRootWidth = 1; //debug

exports.borderRootWidth = borderRootWidth;
var showDots = false; //debug

exports.showDots = showDots;
var handleSize = 7;
exports.handleSize = handleSize;
var styles = {
  root: {
    position: 'absolute',
    display: 'flex',
    border: {
      style: 'solid',
      color: 'var(--color)'
    },
    pointerEvents: 'none',
    boxSizing: 'border-box',
    '& *': {
      boxSizing: 'border-box'
    },
    zIndex: 0
  },
  rootTransformed: {
    width: '100%',
    height: '100%',
    pointerEvents: 'initial',
    position: 'relative',
    zIndex: 0
  },
  corner: {
    position: 'absolute',
    width: handleSize,
    height: handleSize,
    backgroundColor: 'white',
    border: '1px solid black',
    // cursor: '-webkit-grab',
    display: 'none',
    zIndex: 1000
  },
  lockAspectRatioDiagonal: {
    position: 'absolute',
    zIndex: 1000,
    display: 'block',
    borderTop: '1px dashed rgba(232,206,42,1.00)'
  },
  insideBorders: {
    height: '100%',
    width: '100%',
    border: '1px dashed #000',
    boxSizing: 'border-box'
  },
  box: {
    boxSizing: 'border-box'
  },
  active: {
    // outline: `${borderBoxWidth}px dashed #000`, -> not worinking properly in Firefox
    '& $corner': {
      display: 'block'
    },
    //working properly everywhere
    '&:before': {
      content: '""',
      position: 'absolute',
      border: "".concat(borderBoxWidth, "px dashed #000"),

      /*adjust if needed if using border-box*/
      top: -borderBoxWidth,
      right: -borderBoxWidth,
      bottom: -borderBoxWidth,
      left: -borderBoxWidth,
      zIndex: -1
    }
  },
  isCropping: {
    '& $corner': {
      backgroundColor: 'black',
      borderColor: 'white'
    },
    boxShadow: "0 0 0 2000px rgba(255, 255, 255, 0.75)"
  },
  centerDot: {
    position: 'absolute',
    backgroundColor: showDots ? 'red' : 'transparent',
    pointerEvents: 'none',
    width: showDots ? 10 : 0,
    height: showDots ? 10 : 0,
    zIndex: 10000
  },
  topLeftOrigin: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: showDots ? 10 : 0,
    height: showDots ? 10 : 0,
    backgroundColor: showDots ? 'blue' : 'transparent',
    pointerEvents: 'none',
    zIndex: 100000
  },
  boxBottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: showDots ? 10 : 0,
    height: showDots ? 10 : 0,
    backgroundColor: showDots ? 'green' : 'transparent',
    pointerEvents: 'none',
    zIndex: 100000
  },
  topLeft: {
    top: -handleSize / 2,
    left: -handleSize / 2
  },
  topRight: {
    top: -handleSize / 2,
    right: -handleSize / 2 + borderBoxWidth
  },
  bottomLeft: {
    bottom: -handleSize / 2 + borderBoxWidth,
    left: -handleSize / 2
  },
  bottomRight: {
    bottom: -handleSize / 2 + borderBoxWidth,
    right: -handleSize / 2 + borderBoxWidth
  },
  middleTop: {
    top: -handleSize / 2,
    left: "calc(50% - ".concat(handleSize / 2, "px)")
  },
  middleTopAbove: {
    top: -20,
    left: "calc(50% - ".concat(handleSize / 2, "px)"),
    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: handleSize - borderBoxWidth,
      borderRight: '1px solid black',
      height: 20 - 3 * handleSize / 2,
      width: 0,
      left: '50%'
    }
  },
  middleRight: {
    right: -handleSize / 2 + borderBoxWidth,
    top: "calc(50% - ".concat(handleSize / 2, "px)")
  },
  middleBottom: {
    bottom: -handleSize / 2 + borderBoxWidth,
    left: "calc(50% - ".concat(handleSize / 2, "px)")
  },
  middleLeft: {
    left: -handleSize / 2,
    top: "calc(50% - ".concat(handleSize / 2, "px)")
  }
};
var _default = styles;
exports.default = _default;