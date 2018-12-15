"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames2 = _interopRequireDefault(require("classnames"));

var _morphableStyles = _interopRequireDefault(require("./morphableStyles"));

var _reactJss = _interopRequireDefault(require("react-jss"));

var _corners = require("./reference/corners");

var _cursors = _interopRequireDefault(require("./reference/cursors"));

var _Guide = _interopRequireDefault(require("./Guide"));

var _guides2 = _interopRequireDefault(require("./reference/guides"));

var _magnetismGrids = _interopRequireDefault(require("./reference/magnetismGrids"));

var _interactionsHelpers = require("./interactions-helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var MorphableCore =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MorphableCore, _React$Component);

  function MorphableCore(props) {
    var _this;

    _classCallCheck(this, MorphableCore);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MorphableCore).call(this, props));
    _this.state = {
      handleDragFor: 'resize',
      lockAspectRatioDiagonal: undefined,
      guides: undefined,
      disableGuides: _this.props.disableGuides,
      cursorPositionChecked: undefined,
      //for debug only
      rootTransformedBoundingRect: undefined,
      //for debug only
      goingOutsideTheBounds: undefined,
      //for debug only
      minCursorPosition: undefined,
      //for debug only
      lockAspectRatioDiagonalPerpendicular: undefined //for debug only

    };
    _this.handleShortcuts = _this.handleShortcuts.bind(_assertThisInitialized(_assertThisInitialized(_this)));
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

  _createClass(MorphableCore, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      /* init shortcuts */
      window.addEventListener('keydown', this.handleShortcuts);
      window.addEventListener('keyup', this.handleShortcuts);
      this.guidesToShow = [];
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.disableResize && !this.props.disableResize) {
        this.setState({
          handleDragFor: 'resize'
        });
      }

      if (!prevProps.disableResize && this.props.disableResize) {
        this.setState({
          handleDragFor: 'rotate'
        });
      }

      if (prevState.guides === undefined) {
        /* init guides */
        if (this.parentRef) {
          this.setState({
            guides: _toConsumableArray(this.props.guides({
              motherWidth: this.motherWidth,
              motherHeight: this.motherHeight,
              motherBorderWidth: this.motherBorderWidth
            }))
          });
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.props.disableDrag) {
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.onDragStop);
      }

      if (!this.props.disableResize) {
        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('mouseup', this.onResizeStop);
      }

      if (!this.props.disableRotation) {
        document.removeEventListener('mousemove', this.onRotate);
        document.removeEventListener('mouseup', this.onRotateEnd);
      }

      window.removeEventListener('keydown', this.handleShortcuts);
      window.removeEventListener('keyup', this.handleShortcuts);
    }
    /*------------------------------------*/

    /*TOGGLE RESIZE OR ROTATE METHODS*/

    /*------------------------------------*/

  }, {
    key: "handleShortcuts",
    value: function handleShortcuts(e) {
      var _this$props = this.props,
          isMorphable = _this$props.isMorphable,
          keyboardShortcuts = _this$props.keyboardShortcuts;

      if (!isMorphable) {
        return;
      }
      /* toggle rotate or resize */


      if (keyboardShortcuts.toggleRotateResize.includes(e.key)) {
        if (this.props.disableRotation) {
          return;
        } else if (e.type === 'keydown') {
          this.setState({
            handleDragFor: 'rotate'
          });
        } else {
          this.state.handleDragFor !== 'resize' && this.setState({
            handleDragFor: 'resize'
          });
        }
      }
      /* toggle lock aspect ratio */


      if (keyboardShortcuts.lockAspectRatio.includes(e.key)) {
        if (e.type === 'keydown') {
          if (!this.state.lockAspectRatioTemporary) {
            this.setState({
              lockAspectRatioTemporary: true
            });
            var _this$props$size = this.props.size,
                width = _this$props$size.width,
                height = _this$props$size.height;
            this.constantAngleLockAspectRatio = Math.atan(height / width);
          } else {
            return;
          }
        } else {
          this.setState({
            lockAspectRatioTemporary: false
          });
          var _this$props$size2 = this.props.size,
              _width = _this$props$size2.width,
              _height = _this$props$size2.height;
          this.constantAngleLockAspectRatio = Math.atan(_height / _width);
        }
      }
    }
  }, {
    key: "onHandleMouseDown",

    /*------------------------------------*/

    /*START MORPHISM*/

    /*------------------------------------*/
    value: function onHandleMouseDown(e) {
      e.preventDefault();
      /*
       LAUNCHING THE PROPER INTERACTION HANDLER
      */

      this.props.onHandleMouseDown(e);

      if (this.props.isMorphable) {
        if (e.target.dataset.corner === _corners.corners.inside) {
          this.onDragStart(e);
        } else if (e.target.dataset.corner !== undefined) {
          this.state.handleDragFor === 'resize' && this.onResizeStart(e);
          this.state.handleDragFor === 'rotate' && this.onRotateStart(e);
        }
      }
    }
  }, {
    key: "onDragStart",

    /*------------------------------------*/

    /*DRAG METHODS*/

    /*------------------------------------*/
    value: function onDragStart(e) {
      if (this.props.disableDrag) {
        return;
      }

      ;
      this.props.debug && console.log('onDragStart');
      e.persist();
      e.stopPropagation();
      /*
       GETTING SOME INITIAL DATA TO SHOW / HIDE GUIDES
      */

      var _this$props2 = this.props,
          _this$props2$size = _this$props2.size,
          width = _this$props2$size.width,
          height = _this$props2$size.height,
          onDragStart = _this$props2.onDragStart,
          zoom = _this$props2.zoom,
          _this$props2$position = _this$props2.position,
          x = _this$props2$position.x,
          y = _this$props2$position.y,
          rotation = _this$props2.rotation;
      this.dragPointerOffsetToCenter = {
        X: e.clientX - (this.elementRoot.getBoundingClientRect().left + width * zoom / 2)
        /*on the drag handle: negative*/
        ,
        Y: e.clientY - (this.elementRoot.getBoundingClientRect().top + height * zoom / 2)
        /*on the drag handle: negative*/

      };
      this.dragPointerOffsetToTopLeft = {
        X: e.clientX - this.elementRoot.getBoundingClientRect().left
        /*positive*/
        ,
        Y: e.clientY - this.elementRoot.getBoundingClientRect().top
        /*positive*/

      };
      this.dragPointerOffsetToBottomRight = {
        X: e.clientX - this.elementRoot.getBoundingClientRect().right
        /*negative*/
        ,
        Y: e.clientY - this.elementRoot.getBoundingClientRect().bottom
        /*negative*/

      };
      this.parentTopLeftOrigin = {
        X: this.parentRef.getBoundingClientRect().left,
        Y: this.parentRef.getBoundingClientRect().top
      };
      this.rootTransformedBoundingRect = (0, _interactionsHelpers.calculateRootTransformedBoundingRect)({
        x: x,
        y: y,
        ALPHA: -(rotation * Math.PI) / 180,
        //css is clockwise, trigo is anti-clockwise
        width: width,
        height: height,
        centerCoords: {
          X: x + width / 2,
          Y: y + height / 2
        }
      });
      this.rootTransformedBoundingsOffset = {
        top: this.rootTransformedBoundingRect.top - y,
        left: this.rootTransformedBoundingRect.left - x,
        bottom: this.rootTransformedBoundingRect.bottom - y - height,
        right: this.rootTransformedBoundingRect.right - x - width
        /*tell the parent we start the drag*/

      };
      onDragStart({
        e: e
      });
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.onDragStop);
    }
  }, {
    key: "onDrag",
    value: function onDrag(e) {
      e.stopPropagation();
      e.preventDefault();
      var _this$props3 = this.props,
          isMorphable = _this$props3.isMorphable,
          _this$props3$size = _this$props3.size,
          width = _this$props3$size.width,
          height = _this$props3$size.height,
          rotation = _this$props3.rotation,
          bounds = _this$props3.bounds,
          _this$props3$position = _this$props3.position,
          x = _this$props3$position.x,
          y = _this$props3$position.y,
          onDrag = _this$props3.onDrag,
          magnetismGrids = _this$props3.magnetismGrids,
          disableBounds = _this$props3.disableBounds,
          zoom = _this$props3.zoom,
          disableGuides = _this$props3.disableGuides;
      var guides = this.state.guides;
      /*prevent dragging by mistake*/

      if (!isMorphable) {
        return;
      }
      /*get theoretical coordoninates*/


      var theoreticalCenterCoords = {
        x: e.clientX - this.dragPointerOffsetToCenter.X - this.parentTopLeftOrigin.X - this.motherBorderWidth * zoom,
        y: e.clientY - this.dragPointerOffsetToCenter.Y - this.parentTopLeftOrigin.Y - this.motherBorderWidth * zoom
      };
      var theoreticalTopLeftCoords = {
        x: e.clientX - this.dragPointerOffsetToTopLeft.X - this.parentTopLeftOrigin.X - this.motherBorderWidth * zoom,
        y: e.clientY - this.dragPointerOffsetToTopLeft.Y - this.parentTopLeftOrigin.Y - this.motherBorderWidth * zoom
      };
      var theoreticalBottomRightCoords = {
        x: e.clientX - this.dragPointerOffsetToBottomRight.X - this.parentTopLeftOrigin.X - this.motherBorderWidth * zoom,
        y: e.clientY - this.dragPointerOffsetToBottomRight.Y - this.parentTopLeftOrigin.Y - this.motherBorderWidth * zoom
      };
      /*get guides to show and real new coordinates*/

      var _getGuidesToShowForDr = (0, _interactionsHelpers.getGuidesToShowForDrag)({
        guides: guides,
        theoreticalCenterCoords: theoreticalCenterCoords,
        theoreticalTopLeftCoords: theoreticalTopLeftCoords,
        theoreticalBottomRightCoords: theoreticalBottomRightCoords,
        width: width,
        height: height,
        rotation: rotation,
        magnetismGrid: magnetismGrids.drag,
        disableGuides: disableGuides,
        zoom: zoom
      }),
          guidesToShow = _getGuidesToShowForDr.guidesToShow,
          newX = _getGuidesToShowForDr.newX,
          newY = _getGuidesToShowForDr.newY;
      /*check if new coordinates are outside the bounds*/


      var _checkInsideTheBounds = (0, _interactionsHelpers.checkInsideTheBounds)({
        bounds: bounds !== undefined ? {
          top: bounds.top,
          left: bounds.left,
          right: this.motherWidth - bounds.right - 2 * this.motherBorderWidth,
          bottom: this.motherHeight - bounds.bottom - 2 * this.motherBorderWidth
        } : undefined,
        disableBounds: disableBounds,
        x: newX,
        y: newY,
        width: width,
        height: height,
        centerCoords: {
          X: newX + width / 2,
          Y: newY + height / 2
        },
        ALPHA: -(rotation * Math.PI) / 180,
        //css is clockwise, trigo is anti-clockwise
        status: 'isDragging',
        rootTransformedBoundingsOffset: this.rootTransformedBoundingsOffset
      }),
          goingOutsideTheBounds = _checkInsideTheBounds.goingOutsideTheBounds,
          xInsideBounds = _checkInsideTheBounds.xInsideBounds,
          yInsideBounds = _checkInsideTheBounds.yInsideBounds;

      if ((0, _interactionsHelpers.needToUpdateGuides)({
        guidesToShow: guidesToShow,
        currentGuides: this.guidesToShow
      })) {
        this.setState({
          guidesToShow: guidesToShow
        });
        this.guidesToShow = guidesToShow;
      }
      /*update the component*/


      onDrag({
        e: e,
        x: xInsideBounds,
        y: yInsideBounds
      });
    }
  }, {
    key: "onDragStop",
    value: function onDragStop(e) {
      this.props.debug && console.log('onDragStop');
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        guidesToShow: undefined
      });
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.onDragStop);
      var _this$props4 = this.props,
          isMorphable = _this$props4.isMorphable,
          onDragStop = _this$props4.onDragStop;

      if (isMorphable) {
        onDragStop({
          e: e
        });
      }

      return false;
    }
  }, {
    key: "onResizeStart",

    /*------------------------------------*/

    /*RESIZE METHODS*/

    /*------------------------------------*/
    value: function onResizeStart(e) {
      if (this.props.disableResize) {
        return;
      }

      this.props.debug && console.log('onResizeStart');
      e.stopPropagation();
      var _this$props5 = this.props,
          _this$props5$size = _this$props5.size,
          width = _this$props5$size.width,
          height = _this$props5$size.height,
          onResizeStart = _this$props5.onResizeStart;
      /*store which corner has been triggered*/

      this.movingCorner = e.target.dataset.corner;
      this.constantAngleLockAspectRatio = Math.atan(height / width);
      /*tell the parent component we start the resize*/

      onResizeStart({
        e: e
      });
      document.addEventListener('mousemove', this.onResize);
      document.addEventListener('mouseup', this.onResizeStop);
    }
  }, {
    key: "onResize",
    value: function onResize(e) {
      e.stopPropagation();
      var _this$props6 = this.props,
          _this$props6$position = _this$props6.position,
          x = _this$props6$position.x,
          y = _this$props6$position.y,
          _this$props6$size = _this$props6.size,
          width = _this$props6$size.width,
          height = _this$props6$size.height,
          lockAspectRatio = _this$props6.lockAspectRatio,
          rotation = _this$props6.rotation,
          bounds = _this$props6.bounds,
          disableBounds = _this$props6.disableBounds,
          minHeight = _this$props6.minHeight,
          onResize = _this$props6.onResize,
          magnetismGrids = _this$props6.magnetismGrids,
          disableGuides = _this$props6.disableGuides,
          zoom = _this$props6.zoom;
      var cursorPosition = {
        x: e.clientX - this.parentRef.getBoundingClientRect().x - this.motherBorderWidth * zoom,
        y: e.clientY - this.parentRef.getBoundingClientRect().y - this.motherBorderWidth * zoom
      };
      var _this$state = this.state,
          lockAspectRatioTemporary = _this$state.lockAspectRatioTemporary,
          guides = _this$state.guides;
      var newParams = (0, _interactionsHelpers.elementResizeGlobalMethod)({
        cursorPosition: cursorPosition,
        movingCorner: this.movingCorner,
        width: width * zoom,
        height: height * zoom,
        x: x * zoom,
        y: y * zoom,
        rotation: rotation,
        lockAspectRatio: lockAspectRatioTemporary ? !lockAspectRatio : lockAspectRatio,
        phi: this.constantAngleLockAspectRatio,
        minHeight: Math.max(minHeight, 1) * zoom,
        bounds: bounds,
        disableBounds: disableBounds
      });
      /*get guides to show and real new coordinates*/

      var _getGuidesToShowForRe = (0, _interactionsHelpers.getGuidesToShowForResize)({
        guides: guides,
        newParams: newParams,
        rotation: rotation,
        magnetismGrid: magnetismGrids.resize,
        disableGuides: disableGuides,
        movingCorner: this.movingCorner,
        zoom: zoom
      }),
          guidesToShow = _getGuidesToShowForRe.guidesToShow,
          newX = _getGuidesToShowForRe.newX,
          newY = _getGuidesToShowForRe.newY,
          newWidth = _getGuidesToShowForRe.newWidth,
          newHeight = _getGuidesToShowForRe.newHeight;

      if ((0, _interactionsHelpers.needToUpdateGuides)({
        guidesToShow: guidesToShow,
        currentGuides: this.guidesToShow
      })) {
        this.setState({
          guidesToShow: guidesToShow
        });
        this.guidesToShow = guidesToShow;
      }

      onResize({
        e: e,
        height: newHeight,
        width: newWidth,
        x: newX,
        y: newY
      });
      var lockAspectRatioDiagonal;

      if (newParams.lockAspectRatioDiagonal !== undefined) {
        lockAspectRatioDiagonal = _objectSpread({}, newParams.lockAspectRatioDiagonal, {
          top: newParams.lockAspectRatioDiagonal.top / zoom,
          left: newParams.lockAspectRatioDiagonal.left / zoom,
          width: newParams.lockAspectRatioDiagonal.width / zoom,
          height: newParams.lockAspectRatioDiagonal.height / zoom
        });
      }

      this.setState({
        lockAspectRatioDiagonal: lockAspectRatioDiagonal,
        cursorPositionChecked: newParams.cursorPositionChecked,
        //for debug only
        rootTransformedBoundingRect: newParams.rootTransformedBoundingRect,
        //for debug only
        goingOutsideTheBounds: newParams.goingOutsideTheBounds,
        //for debug only
        minCursorPosition: newParams.minCursorPosition,
        //for debug only
        lockAspectRatioDiagonalPerpendicular: newParams.lockAspectRatioDiagonalPerpendicular //for debug only

      });
    }
  }, {
    key: "onResizeStop",
    value: function onResizeStop(e) {
      this.props.debug && console.log('onResizeStop');
      e && e.stopPropagation();
      this.props.onResizeStop({
        e: e
      });
      this.setState({
        lockAspectRatioDiagonal: undefined,
        guidesToShow: undefined
      });
      document.removeEventListener('mousemove', this.onResize);
      document.removeEventListener('mouseup', this.onResizeStop);
    }
  }, {
    key: "onRotateStart",

    /*------------------------------------*/

    /*ROTATE*/

    /*------------------------------------*/
    value: function onRotateStart(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.debug && console.log('onRotateStart');
      var _this$props7 = this.props,
          _this$props7$size = _this$props7.size,
          width = _this$props7$size.width,
          height = _this$props7$size.height,
          onRotateStart = _this$props7.onRotateStart,
          zoom = _this$props7.zoom,
          position = _this$props7.position,
          size = _this$props7.size,
          disableRotation = _this$props7.disableRotation,
          disableGuides = _this$props7.disableGuides;

      if (disableRotation) {
        return;
      }
      /*the rotation is calculated from the horizontal center axis of the div at rotation = 0.*/

      /*1. Get the constant angle between the handle with 0 rotation and the horizontal center axis*/


      this.rootCenterCoords = {
        X: this.elementRoot.getBoundingClientRect().left + width * zoom / 2,
        Y: this.elementRoot.getBoundingClientRect().top + height * zoom / 2
      };
      this.initRotationOfHandleInRad = (0, _interactionsHelpers.calcInitRotation)({
        width: width * zoom,
        height: height * zoom,
        borderWidth: this.motherBorderWidth * zoom,
        handleClicked: e.target.dataset.corner,
        rootCenterCoords: this.rootCenterCoords,
        elementRoot: this.elementRoot
      });
      /*set rotation guides if needed*/

      if (!disableGuides) {
        var _guides = _toConsumableArray(this.state.guides.filter(function (guide) {
          return guide.magnetism !== 'rotation';
        })).concat([{
          orientation: 'vertical',
          magnetism: 'rotation',
          position: {
            left: position.x + size.width / 2
          }
        }, {
          orientation: 'horizontal',
          magnetism: 'rotation',
          position: {
            top: position.y + size.height / 2
          }
        }]);

        this.setState({
          guides: _guides
        });
      }
      /*tell the parent component we start the resize*/


      onRotateStart({
        e: e
      });
      document.addEventListener('mousemove', this.onRotate);
      document.addEventListener('mouseup', this.onRotateEnd);
    }
  }, {
    key: "onRotate",
    value: function onRotate(e) {
      e.stopPropagation();
      var _this$props8 = this.props,
          disableGuides = _this$props8.disableGuides,
          magnetismGrids = _this$props8.magnetismGrids,
          onRotate = _this$props8.onRotate,
          zoom = _this$props8.zoom;
      var guides = this.state.guides;
      var rotation = (0, _interactionsHelpers.calcRot)({
        e: e,
        rootCenterCoords: this.rootCenterCoords,
        initRotationOfHandleInRad: this.initRotationOfHandleInRad
      });
      var guidesToShow = [];

      var _getGuidesToShowForRo = (0, _interactionsHelpers.getGuidesToShowForRotation)({
        angle: rotation,
        guides: guides,
        magnetismGrid: magnetismGrids.rotation,
        disableGuides: disableGuides,
        zoom: zoom
      });

      guidesToShow = _getGuidesToShowForRo.guidesToShow;
      rotation = _getGuidesToShowForRo.rotation;

      if ((0, _interactionsHelpers.needToUpdateGuides)({
        guidesToShow: guidesToShow,
        currentGuides: this.guidesToShow
      })) {
        this.setState({
          guidesToShow: guidesToShow
        });
        this.guidesToShow = guidesToShow;
      }

      onRotate({
        e: e,
        rotation: rotation
      });
    }
  }, {
    key: "onRotateEnd",
    value: function onRotateEnd(e) {
      this.props.debug && console.log('onRotateEnd');
      e.stopPropagation();
      this.props.onRotateEnd({
        e: e
      });
      this.setState({
        guidesToShow: undefined
      });
      document.removeEventListener('mousemove', this.onRotate);
      document.removeEventListener('mouseup', this.onRotateEnd);
    }
  }, {
    key: "render",

    /*------------------------------------*/

    /*RENDER*/

    /*------------------------------------*/
    value: function render() {
      var _this2 = this;

      var _this$props9 = this.props,
          classes = _this$props9.classes,
          type = _this$props9.type,
          isMorphable = _this$props9.isMorphable,
          children = _this$props9.children,
          _this$props9$position = _this$props9.position,
          x = _this$props9$position.x,
          y = _this$props9$position.y,
          rotation = _this$props9.rotation,
          zoom = _this$props9.zoom,
          _this$props9$size = _this$props9.size,
          width = _this$props9$size.width,
          height = _this$props9$size.height,
          disableRotation = _this$props9.disableRotation,
          disableResize = _this$props9.disableResize,
          disableGuides = _this$props9.disableGuides,
          transformOrigin = _this$props9.transformOrigin,
          styles = _this$props9.styles,
          classProps = _this$props9.classProps,
          debug = _this$props9.debug;
      var _this$state2 = this.state,
          handleDragFor = _this$state2.handleDragFor,
          guidesToShow = _this$state2.guidesToShow,
          guides = _this$state2.guides;
      /*if child needs to interact too with morphable functions*/

      var newProps = {
        handleDragStart: this.onMouseDown
      };

      var childrenWithProps = _react.default.Children.map(children, function (child) {
        return !child ? null : _react.default.cloneElement(child, newProps);
      });

      return _react.default.createElement(_react.default.Fragment, null, !disableGuides && guidesToShow && guidesToShow.map(function (indexOfGuide, i) {
        return _react.default.createElement(_Guide.default, _extends({
          key: "".concat(guides[indexOfGuide].orientation).concat(guides[indexOfGuide].magnetism).concat(i)
        }, guides[indexOfGuide]));
      }), _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.root, classProps.root),
        style: _objectSpread({
          left: x,
          top: y,
          width: width,
          height: height,
          minHeight: type === 'text' && 20,
          borderWidth: debug ? 1 : 0
        }, styles.root),
        onMouseDown: this.onHandleMouseDown,
        "data-corner": _corners.corners.inside,
        ref: function ref(elementRoot) {
          _this2.elementRoot = elementRoot;

          if (elementRoot) {
            _this2.parentRef = elementRoot.parentNode;
            _this2.motherWidth = elementRoot.parentNode.getBoundingClientRect().width;
            _this2.motherHeight = elementRoot.parentNode.getBoundingClientRect().height;
            _this2.motherBorderWidth = parseInt(window.getComputedStyle(_this2.parentRef).borderWidth.replace('px', ''), 10);
          }
        }
      }, _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.rootTransformed, classProps.rootTransformed, _defineProperty({}, classes.active, isMorphable)),
        style: _objectSpread({
          transform: "rotate(".concat(rotation, "deg)"),
          transformOrigin: transformOrigin.x && transformOrigin.y ? "".concat(transformOrigin.x, "px ").concat(transformOrigin.y, "px") : transformOrigin
        }, styles.rootTransformed),
        "data-corner": _corners.corners.inside
      }, childrenWithProps, isMorphable && (!disableRotation || !disableResize) && _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner, classProps.corner, classes.topLeft, classProps.topLeft),
        style: _objectSpread({
          cursor: _cursors.default.topLeft({
            rotation: rotation,
            handleDragFor: handleDragFor
          }),
          transform: "scale(".concat(1 / zoom, ")")
        }, styles.corner, styles.topLeftCorner),
        onMouseDown: this.onHandleMouseDown,
        "data-corner": _corners.corners.topLeft,
        ref: function ref(topLeftCorner) {
          return _this2.topLeftCorner = topLeftCorner;
        }
      }), _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner, classProps.corner, classes.topRight, classProps.topRight),
        style: _objectSpread({
          cursor: _cursors.default.topRight({
            rotation: rotation,
            handleDragFor: handleDragFor
          }),
          transform: "scale(".concat(1 / zoom, ")")
        }, styles.corner, styles.topRightCorner),
        onMouseDown: this.onHandleMouseDown,
        "data-corner": _corners.corners.topRight,
        ref: function ref(topRightCorner) {
          return _this2.topRightCorner = topRightCorner;
        }
      }), _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner, classProps.corner, classes.bottomLeft, classProps.bottomLeft),
        style: _objectSpread({
          cursor: _cursors.default.bottomLeft({
            rotation: rotation,
            handleDragFor: handleDragFor
          }),
          transform: "scale(".concat(1 / zoom, ")")
        }, styles.corner, styles.bottomLeftCorner),
        onMouseDown: this.onHandleMouseDown,
        "data-corner": _corners.corners.bottomLeft,
        ref: function ref(bottomLeftCorner) {
          return _this2.bottomLeftCorner = bottomLeftCorner;
        }
      }), _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner, classProps.corner, classes.bottomRight, classProps.bottomRight),
        style: _objectSpread({
          cursor: _cursors.default.bottomRight({
            rotation: rotation,
            handleDragFor: handleDragFor
          }),
          transform: "scale(".concat(1 / zoom, ")")
        }, styles.corner, styles.bottomRightCorner),
        onMouseDown: this.onHandleMouseDown,
        "data-corner": _corners.corners.bottomRight,
        ref: function ref(bottomRightCorner) {
          return _this2.bottomRightCorner = bottomRightCorner;
        }
      }), _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner, classProps.corner, classes.middleTop, classProps.middleTop),
        style: _objectSpread({
          cursor: _cursors.default.middleTop({
            rotation: rotation,
            handleDragFor: handleDragFor
          }),
          transform: "scale(".concat(1 / zoom, ")")
        }, styles.corner, styles.middleTopCorner),
        onMouseDown: this.onHandleMouseDown,
        "data-corner": _corners.corners.middleTop,
        ref: function ref(middleTopCorner) {
          return _this2.middleTopCorner = middleTopCorner;
        }
      }), _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner, classProps.corner, classes.middleRight, classProps.middleRight),
        style: _objectSpread({
          cursor: _cursors.default.middleRight({
            rotation: rotation,
            handleDragFor: handleDragFor
          }),
          transform: "scale(".concat(1 / zoom, ")")
        }, styles.corner, styles.middleRightCorner),
        onMouseDown: this.onHandleMouseDown,
        "data-corner": _corners.corners.middleRight,
        ref: function ref(middleRightCorner) {
          return _this2.middleRightCorner = middleRightCorner;
        }
      }), _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner, classProps.corner, classes.middleBottom, classProps.middleBottom),
        style: _objectSpread({
          cursor: _cursors.default.middleBottom({
            rotation: rotation,
            handleDragFor: handleDragFor
          }),
          transform: "scale(".concat(1 / zoom, ")")
        }, styles.corner, styles.middleBottomCorner),
        onMouseDown: this.onHandleMouseDown,
        "data-corner": _corners.corners.middleBottom,
        ref: function ref(middleBottomCorner) {
          return _this2.middleBottomCorner = middleBottomCorner;
        }
      }), _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner, classProps.corner, classes.middleLeft, classProps.middleLeft),
        style: _objectSpread({
          cursor: _cursors.default.middleLeft({
            rotation: rotation,
            handleDragFor: handleDragFor
          }),
          transform: "scale(".concat(1 / zoom, ")")
        }, styles.corner, styles.middleLeftCorner),
        onMouseDown: this.onHandleMouseDown,
        "data-corner": _corners.corners.middleLeft,
        ref: function ref(middleLeftCorner) {
          return _this2.middleLeftCorner = middleLeftCorner;
        }
      }), !disableRotation && _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner, classProps.corner, classes.middleTopAbove, classProps.middleTopAbove),
        style: _objectSpread({
          cursor: _cursors.default.middleTop({
            rotation: rotation,
            handleDragFor: 'rotation'
          }),
          transform: "scale(".concat(1 / zoom, ")"),
          top: -20 * 1 / zoom
        }, styles.corner, styles.middleTopAboveCorner),
        onMouseDown: this.onRotateStart,
        "data-corner": _corners.corners.middleTop,
        ref: function ref(middleTopCorner) {
          return _this2.middleTopCorner = middleTopCorner;
        }
      })))), debug && this.state.cursorPositionChecked && _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner),
        style: {
          cursor: _cursors.default.middleLeft({
            rotation: rotation,
            handleDragFor: handleDragFor
          }),
          transform: "scale(".concat(1 / zoom, ")"),
          left: this.state.cursorPositionChecked.x,
          top: this.state.cursorPositionChecked.y,
          backgroundColor: 'red',
          display: 'block'
        }
      }), debug && this.state.minCursorPosition && _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner),
        style: {
          cursor: _cursors.default.middleLeft({
            rotation: rotation,
            handleDragFor: handleDragFor
          }),
          transform: "scale(".concat(1 / zoom, ")"),
          left: this.state.minCursorPosition.x,
          top: this.state.minCursorPosition.y,
          backgroundColor: 'blue',
          borderRadius: '50%',
          display: 'block'
        }
      }), debug && this.state.rootTransformedBoundingRect && _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner),
        style: {
          left: this.state.rootTransformedBoundingRect.left,
          top: this.state.rootTransformedBoundingRect.top,
          width: this.state.rootTransformedBoundingRect.right - this.state.rootTransformedBoundingRect.left,
          height: this.state.rootTransformedBoundingRect.bottom - this.state.rootTransformedBoundingRect.top,
          border: "".concat(this.state.goingOutsideTheBounds ? 10 : 1, "px solid ").concat(this.state.goingOutsideTheBounds ? 'red' : 'green'),
          backgroundColor: 'transparent',
          display: 'block',
          pointerEvents: 'none'
        }
      }), debug && this.state.lockAspectRatioDiagonalPerpendicular && _react.default.createElement("div", {
        className: (0, _classnames2.default)(classes.corner),
        style: _objectSpread({}, this.state.lockAspectRatioDiagonalPerpendicular, {
          display: 'block',
          border: 'none',
          borderTop: '1px solid black'
        })
      }));
    }
  }]);

  return MorphableCore;
}(_react.default.Component);

MorphableCore.propTypes = {
  minHeight: _propTypes.default.number,
  isMorphable: _propTypes.default.bool,
  bounds: _propTypes.default.shape({
    top: _propTypes.default.number.isRequired,
    left: _propTypes.default.number.isRequired,
    right: _propTypes.default.number.isRequired,
    bottom: _propTypes.default.number.isRequired
  }),
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
  guides: _propTypes.default.func,
  size: _propTypes.default.shape({
    width: _propTypes.default.number.isRequired,
    height: _propTypes.default.number.isRequired
  }).isRequired,
  rotation: _propTypes.default.number,
  position: _propTypes.default.shape({
    x: _propTypes.default.number.isRequired,
    y: _propTypes.default.number.isRequired
  }).isRequired,
  magnetismGrids: _propTypes.default.shape({
    rotation: _propTypes.default.number,
    drag: _propTypes.default.number,
    resize: _propTypes.default.number
  }),
  lockAspectRatio: _propTypes.default.bool,
  disableDrag: _propTypes.default.bool,
  disableResize: _propTypes.default.bool,
  disableRotation: _propTypes.default.bool,
  disableBounds: _propTypes.default.shape({
    forDrag: _propTypes.default.bool.isRequired,
    forResize: _propTypes.default.bool.isRequired
  }),
  disableGuides: _propTypes.default.bool,
  debug: _propTypes.default.bool,
  zoom: _propTypes.default.number,
  keyboardShortcuts: _propTypes.default.shape({
    toggleRotateResize: _propTypes.default.array.isRequired,
    lockAspectRatio: _propTypes.default.array.isRequired
  }),
  styles: _propTypes.default.shape({
    root: _propTypes.default.object,
    rootTransformed: _propTypes.default.object,
    corner: _propTypes.default.object,
    topLeftCorner: _propTypes.default.object,
    topRightCorner: _propTypes.default.object,
    bottomLeftCorner: _propTypes.default.object,
    bottomRightCorner: _propTypes.default.object,
    middleTopCorner: _propTypes.default.object,
    middleRightCorner: _propTypes.default.object,
    middleBottomCorner: _propTypes.default.object,
    middleLeftCorner: _propTypes.default.object,
    middleTopAboveCorner: _propTypes.default.object
  }),
  classProps: _propTypes.default.shape({
    root: _propTypes.default.object,
    rootTransformed: _propTypes.default.object,
    corner: _propTypes.default.object,
    topLeftCorner: _propTypes.default.object,
    topRightCorner: _propTypes.default.object,
    bottomLeftCorner: _propTypes.default.object,
    bottomRightCorner: _propTypes.default.object,
    middleTopCorner: _propTypes.default.object,
    middleRightCorner: _propTypes.default.object,
    middleBottomCorner: _propTypes.default.object,
    middleLeftCorner: _propTypes.default.object,
    middleTopAboveCorner: _propTypes.default.object
  })
};
MorphableCore.defaultProps = {
  rotation: 0,
  size: {
    height: 100,
    width: 150
  },
  position: {
    x: 0,
    y: 0
  },
  minHeight: 0,
  isMorphable: true,
  lockAspectRatio: false,
  magnetismGrids: _magnetismGrids.default,
  guides: _guides2.default,
  bounds: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  disableDrag: false,
  disableResize: false,
  disableRotation: false,
  disableBounds: {
    forDrag: false,
    forResize: false
  },
  disableGuides: true,
  debug: false,
  transformOrigin: 'center center',
  zoom: 1,
  keyboardShortcuts: {
    toggleRotateResize: ['Meta'],
    lockAspectRatio: ['l']
  },
  styles: {},
  classProps: {},
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

var _default = (0, _reactJss.default)(_morphableStyles.default)(MorphableCore);

exports.default = _default;