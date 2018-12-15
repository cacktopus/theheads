"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _MorphableCore = _interopRequireDefault(require("./MorphableCore"));

var _magnetismGrids = _interopRequireDefault(require("./reference/magnetismGrids"));

var _reactJss = _interopRequireDefault(require("react-jss"));

var _morphableStyles = _interopRequireDefault(require("./morphableStyles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var Morphable =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Morphable, _React$Component);

  function Morphable(props) {
    var _this;

    _classCallCheck(this, Morphable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Morphable).call(this, props));
    _this.state = {
      position: {
        x: props.position.x,
        y: props.position.y
      },
      size: {
        height: props.size.height,
        width: props.size.width
      },
      rotation: props.rotation
    };
    _this.onHandleMouseDown = _this.onHandleMouseDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onDragStart = _this.onDragStart.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onDrag = _this.onDrag.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onDragStop = _this.onDragStop.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onResizeStart = _this.onResizeStart.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onResizeStop = _this.onResizeStop.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onRotateStart = _this.onRotateStart.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onRotate = _this.onRotate.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onRotateEnd = _this.onRotateEnd.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }
  /*------------------------------------*/

  /*START MORPHISM*/

  /*------------------------------------*/


  _createClass(Morphable, [{
    key: "onHandleMouseDown",
    value: function onHandleMouseDown(_ref) {
      var e = _ref.e;
      this.props.onHandleMouseDown({
        e: e
      });
    }
  }, {
    key: "onDragStart",

    /*------------------------------------*/

    /*DRAG METHODS*/

    /*------------------------------------*/
    value: function onDragStart(_ref2) {
      var e = _ref2.e;
      this.props.onDragStart({
        e: e
      });
    }
  }, {
    key: "onDrag",
    value: function onDrag(_ref3) {
      var e = _ref3.e,
          x = _ref3.x,
          y = _ref3.y,
          guidesToShow = _ref3.guidesToShow;
      this.setState({
        position: {
          x: x,
          y: y
        }
      });
      this.props.onDrag({
        e: e,
        x: x,
        y: y,
        guidesToShow: guidesToShow
      });
    }
  }, {
    key: "onDragStop",
    value: function onDragStop(_ref4) {
      var e = _ref4.e;
      this.props.onDragStop({
        e: e
      });
    }
  }, {
    key: "onResizeStart",

    /*------------------------------------*/

    /*RESIZE METHODS*/

    /*------------------------------------*/
    value: function onResizeStart(_ref5) {
      var e = _ref5.e;
      this.props.onResizeStart({
        e: e
      });
    }
  }, {
    key: "onResize",
    value: function onResize(_ref6) {
      var e = _ref6.e,
          x = _ref6.x,
          y = _ref6.y,
          height = _ref6.height,
          width = _ref6.width,
          guidesToShow = _ref6.guidesToShow;
      this.setState({
        position: {
          x: x,
          y: y
        },
        size: {
          height: height,
          width: width
        }
      });
      this.props.onResize({
        e: e,
        height: height,
        width: width,
        x: x,
        y: y,
        guidesToShow: guidesToShow
      });
    }
  }, {
    key: "onResizeStop",
    value: function onResizeStop(_ref7) {
      var e = _ref7.e;
      this.props.onResizeStop({
        e: e
      });
    }
  }, {
    key: "onRotateStart",

    /*------------------------------------*/

    /*ROTATE*/

    /*------------------------------------*/
    value: function onRotateStart(_ref8) {
      var e = _ref8.e;
      this.props.onRotateStart({
        e: e
      });
    }
  }, {
    key: "onRotate",
    value: function onRotate(_ref9) {
      var e = _ref9.e,
          guidesToShow = _ref9.guidesToShow,
          rotation = _ref9.rotation;
      this.setState({
        rotation: rotation
      });
      this.props.onRotate({
        e: e,
        guidesToShow: guidesToShow,
        rotation: rotation
      });
    }
  }, {
    key: "onRotateEnd",
    value: function onRotateEnd(_ref10) {
      var e = _ref10.e;
      this.props.onRotateEnd({
        e: e
      });
    }
  }, {
    key: "render",

    /*------------------------------------*/

    /*RENDER*/

    /*------------------------------------*/
    value: function render() {
      var _this$state = this.state,
          position = _this$state.position,
          size = _this$state.size,
          rotation = _this$state.rotation;
      return _react.default.createElement(_MorphableCore.default, _extends({
        position: position,
        size: size,
        rotation: rotation
      }, this.props));
    }
  }]);

  return Morphable;
}(_react.default.Component);

Morphable.propTypes = {
  size: _propTypes.default.shape({
    width: _propTypes.default.number.isRequired,
    height: _propTypes.default.number.isRequired
  }).isRequired,
  rotation: _propTypes.default.number,
  position: _propTypes.default.shape({
    x: _propTypes.default.number.isRequired,
    y: _propTypes.default.number.isRequired
  }).isRequired,
  onHandleMouseDown: _propTypes.default.func,
  onDragStart: _propTypes.default.func,
  onDrag: _propTypes.default.func,
  onDragStop: _propTypes.default.func,
  onResizeStart: _propTypes.default.func,
  onResize: _propTypes.default.func,
  onResizeStop: _propTypes.default.func,
  onRotateStart: _propTypes.default.func,
  onRotate: _propTypes.default.func,
  onRotateEnd: _propTypes.default.func,
  guides: _propTypes.default.array
};
Morphable.defaultProps = {
  rotation: 0,
  size: {
    height: 100,
    width: 150
  },
  position: {
    x: 0,
    y: 0
  },
  onHandleMouseDown: function onHandleMouseDown() {
    return;
  },
  onDragStart: function onDragStart() {
    return;
  },
  onDrag: function onDrag() {
    return;
  },
  onDragStop: function onDragStop() {
    return;
  },
  onResizeStart: function onResizeStart() {
    return;
  },
  onResize: function onResize() {
    return;
  },
  onResizeStop: function onResizeStop() {
    return;
  },
  onRotateStart: function onRotateStart() {
    return;
  },
  onRotate: function onRotate() {
    return;
  },
  onRotateEnd: function onRotateEnd() {
    return;
  }
};

var _default = (0, _reactJss.default)(_morphableStyles.default)(Morphable);

exports.default = _default;