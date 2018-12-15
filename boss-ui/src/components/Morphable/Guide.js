"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactJss = _interopRequireDefault(require("react-jss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var styles = {
  root: {
    border: '0.5px solid',
    position: 'absolute',
    zIndex: 1000,
    pointerEvents: 'none',
    borderColor: 'rgba(232,0,0,1.00)',
    height: '100%',
    width: '100%'
  }
};

var Guide = function Guide(_ref) {
  var classes = _ref.classes,
      className = _ref.className,
      orientation = _ref.orientation,
      magnetism = _ref.magnetism,
      position = _ref.position,
      motherWidth = _ref.motherWidth,
      motherHeight = _ref.motherHeight;
  var fullHeight = motherHeight;
  var fullWidth = motherWidth;
  return _react.default.createElement("div", {
    className: (0, _classnames.default)(classes.root, className),
    style: _objectSpread({
      top: 0,
      left: 0
    }, position, {
      height: orientation === 'vertical' ? "".concat(fullHeight, "px") : 0,
      width: orientation === 'horizontal' ? "".concat(fullWidth, "px") : 0
    })
  });
};

var _default = (0, _reactJss.default)(styles)(Guide);

exports.default = _default;