webpackHotUpdate("main",{

/***/ "./src/components/Menu.js":
/*!********************************!*\
  !*** ./src/components/Menu.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var rc_slider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rc-slider */ "./node_modules/rc-slider/es/index.js");







var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/Menu.js";
// https://redux.js.org/basics/exampletodolist#entry-point
// http://localhost:3000/
 // import { fromJS } from 'immutable';
// import Slider, { Range } from 'rc-slider';


var exportSceneMsgTimeout;
var defaultWebsocketUrl;
var defaultSceneUrl;

if (window.location.hostname === "localhost" && window.location.port === "3000") {
  defaultWebsocketUrl = "ws://localhost:8081/ws";
  defaultSceneUrl = "json/temp.json";
} else {
  defaultWebsocketUrl = 'ws://' + window.location.hostname + ":" + window.location.port + '/ws';
  defaultSceneUrl = "/installation/dev/scene.json";
}

var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu).call(this, props));
    _this.state = {
      sceneUrl: defaultSceneUrl,
      // sceneUrl : "/build/json/temp.json",
      websocketUrl: defaultWebsocketUrl //"ws://localhost:8081/ws"
      // sceneUrl : "/json/temp.json"
      // sceneUrl : "/json/temp2.json"

    };
    _this.addStand = _this.addStand.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.addFocalPoint = _this.addFocalPoint.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.setLoadSceneUrl = _this.setLoadSceneUrl.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.loadScene = _this.loadScene.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.loadTempSceneJson = _this.loadTempSceneJson.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.loadRegSceneJson = _this.loadRegSceneJson.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.addNewCamera = _this.addNewCamera.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.removeCurrentCamera = _this.removeCurrentCamera.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.exportSceneToJSON = _this.exportSceneToJSON.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));

    _this.setScale = function (e) {
      props.setScale(e.target.value);
    };

    _this.setTranslateX = function (e) {
      props.setTranslateX(e.target.value);
    };

    _this.setTranslateY = function (e) {
      props.setTranslateY(e.target.value);
    }; // Focal Point


    _this.addFocalPoint = _this.addFocalPoint.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));

    _this.setWebsocketUrl = function (e) {
      _this.setState({
        websocketUrl: e.target.value
      });
    };

    _this.websocketConnect = _this.websocketConnect.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.websocketDisconnect = _this.websocketDisconnect.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.websocketLoadLocalhostUrl = _this.websocketLoadLocalhostUrl.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    _this.websocketLoadOtherUrl = _this.websocketLoadOtherUrl.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this)));
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Menu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadScene();
      this.websocketConnect();
    }
  }, {
    key: "addStand",
    value: function addStand() {
      this.props.addStand({});
    }
  }, {
    key: "addFocalPoint",
    value: function addFocalPoint() {
      this.props.addFocalPoint({});
    }
  }, {
    key: "setLoadSceneUrl",
    value: function setLoadSceneUrl(e) {
      var sceneUrl = e.target.value;
      this.setState({
        sceneUrl: sceneUrl
      });
    }
  }, {
    key: "exportSceneToJSON",
    value: function exportSceneToJSON() {
      var stands = this.props.stands.toJS();
      var scene = JSON.stringify({
        name: "export",
        stands: stands
      }); // document.create

      var el = document.getElementById("clipboard-input");
      el.value = scene;
      el.select();
      document.execCommand("copy");
      var msg = document.getElementById("clipboard-msg");
      msg.innerText = "Copied";
      clearTimeout(exportSceneMsgTimeout);
      exportSceneMsgTimeout = setTimeout(function () {
        msg.innerText = "";
      }, 1000);
    }
  }, {
    key: "loadScene",
    value: function loadScene() {
      this.props.loadSceneFromUrl(this.state.sceneUrl);
    }
  }, {
    key: "loadTempSceneJson",
    value: function loadTempSceneJson() {
      this.setState({
        sceneUrl: "json/temp.json"
      });
    }
  }, {
    key: "loadRegSceneJson",
    value: function loadRegSceneJson() {
      this.setState({
        sceneUrl: "/installation/dev/scene.json"
      });
    }
  }, {
    key: "addNewCamera",
    value: function addNewCamera() {
      this.props.cameraAddNew(this.props.selectedStandIndex);
    }
  }, {
    key: "removeCurrentCamera",
    value: function removeCurrentCamera() {
      console.log('c_ 12');
      this.props.cameraRemove(this.props.selectedStandIndex, this.props.selectedCameraIndex);
    } // Web socket connection

  }, {
    key: "websocketConnect",
    value: function websocketConnect() {
      this.props.websocketConnect(this.state.websocketUrl);
    }
  }, {
    key: "websocketDisconnect",
    value: function websocketDisconnect() {
      this.props.websocketDisconnect();
    }
  }, {
    key: "websocketLoadLocalhostUrl",
    value: function websocketLoadLocalhostUrl() {
      this.setState({
        websocketUrl: "ws://localhost:8081/ws"
      });
    }
  }, {
    key: "websocketLoadOtherUrl",
    value: function websocketLoadOtherUrl() {}
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      // {
      //     "name": "stand0",
      //     "pos": {
      //         "x": 54,
      //         "y": 13
      //     },
      //     "rot": 0,
      //     "cameras": [
      //         {
      //             "name": "camera0",
      //             "pos": {
      //                 "x": 0.1,
      //                 "y": 0
      //             },
      //             "rot": 0,
      //             "fov": 60,
      //             "description": "Raspberry Pi PiNoir Camera V2 Video Module"
      //         }
      //     ],
      //     "heads": [
      //         {
      //             "name": "head0",
      //             "pos": {
      //                 "x": 0,
      //                 "y": 0
      //             },
      //             "rot": 0
      //         }
      //     ]
      // }"
      var standSchema = {
        "name": {
          type: "text"
        },
        "pos": {
          type: "pos" // type: "obj",
          // obj : { 
          //     x: {type: 'number'},
          //     y: {type: 'number'}
          // }

        },
        "rot": {
          type: "number",
          min: -1 * Math.PI,
          max: Math.PI
        }
      };
      var cameraSchema = {
        "name": {
          type: "text"
        },
        "pos": {
          type: "pos" // type: "obj",
          // obj : { 
          //     x: {type: 'number'},
          //     y: {type: 'number'}
          // }

        },
        "rot": {
          type: "number",
          min: -1 * Math.PI,
          max: Math.PI
        },
        "fov": {
          type: "number"
        },
        "description": {
          type: "text" // "name" : {type: "text"},
          // "pos": {
          //     type: "pos"
          //     // type: "obj",
          //     // obj: {
          //     //     "x": { type: "number" },
          //     //     "y": { type: "number" }
          //     // }
          // },
          // "rot": { type: "number", min: -1 * Math.PI, max: Math.PI },
          // "fov": { type: "number" },
          // "description": { type: "text" }

        }
      };
      var headSchema = {
        "name": {
          type: "text"
        },
        "pos": {
          type: "pos" // type: "obj",
          // obj: {
          //     "x": { type: "number" },
          //     "y": { type: "number" }
          // }

        },
        "rot": {
          type: "number",
          min: -1 * Math.PI,
          max: Math.PI
        }
      }; // `fieldNames` param is of type array. e.g. fieldNames = [0, "heads", 0, "rot"]

      var inputHandler = function inputHandler(fieldNames) {
        return function (e) {
          var value = e.target.value;

          _this2.props.standSetInFields(_this2.props.selectedStandIndex, fieldNames, value); // this.props.standSetField(this.props.selectedStandIndex, fieldName, value);

        };
      }; // // `fieldNames` param is of type array. e.g. fieldNames = [0, "heads", 0, "rot"]
      // const inputHandlerForFieldNames = fieldNames => {
      //     return (e) => {
      //         const value = e.target.value;
      //         this.props.standSetInFields(this.props.selectedStandIndex, fieldNames, value);
      //     }
      // }


      var posHandler = function posHandler(fieldNames, axis) {
        return function (e) {
          var value = parseFloat(e.target.value);

          if (isNaN(value)) {
            value = "";
          } // console.log("====", this.props.selectedStandIndex, fieldName, axis, value);


          _this2.props.standSetInFields(_this2.props.selectedStandIndex, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(fieldNames).concat([axis]), value);
        };
      }; // const getTextInput = ({label, name, value, onChange}) => {


      var getTextInput = function getTextInput(_ref) {
        var fieldName = _ref.fieldName,
            fieldVal = _ref.fieldVal,
            parentFieldNames = _ref.parentFieldNames;
        return getInput({
          fieldName: fieldName,
          fieldVal: fieldVal,
          type: "text",
          parentFieldNames: parentFieldNames
        });
      };

      var getNumberInput = function getNumberInput(_ref2) {
        var fieldName = _ref2.fieldName,
            fieldVal = _ref2.fieldVal,
            parentFieldNames = _ref2.parentFieldNames;
        return getInput({
          fieldName: fieldName,
          fieldVal: fieldVal,
          type: "number",
          parentFieldNames: parentFieldNames
        });
      };

      var getPosInput = function getPosInput(_ref3) {
        var fieldName = _ref3.fieldName,
            fieldVal = _ref3.fieldVal,
            parentFieldNames = _ref3.parentFieldNames;

        var _ref4 = fieldVal && fieldVal.toJS ? fieldVal.toJS() : {
          x: 0,
          y: 0
        },
            x = _ref4.x,
            y = _ref4.y;

        var fieldNameX = "".concat(fieldName, ".x");
        var fieldNameY = "".concat(fieldName, ".y");
        window.c_sdfa2 = {
          fieldName: fieldName,
          fieldVal: fieldVal
        };

        var fieldNames = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(parentFieldNames).concat([fieldName]);

        return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          className: "Menu-form-posType",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 275
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 276
          },
          __self: this
        }, "X"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
          className: "Menu-form-posType-X",
          name: fieldNameX,
          type: "number",
          onChange: posHandler(fieldNames, "x"),
          value: x,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 277
          },
          __self: this
        }), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
          style: {
            minWidth: 0
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 278
          },
          __self: this
        }, "Y"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
          className: "Menu-form-posType-Y",
          name: fieldNameY,
          type: "number",
          onChange: posHandler(fieldNames, "y"),
          value: y,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 279
          },
          __self: this
        }));
      };

      var getInput = function getInput(_ref5) {
        var fieldName = _ref5.fieldName,
            fieldVal = _ref5.fieldVal,
            type = _ref5.type,
            parentFieldNames = _ref5.parentFieldNames;

        var fieldNames = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(parentFieldNames).concat([fieldName]);

        return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 287
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
          htmlFor: fieldName,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 288
          },
          __self: this
        }, fieldName), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
          name: fieldName,
          type: type,
          onChange: inputHandler(fieldNames),
          value: fieldVal,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 289
          },
          __self: this
        }));
      }; // Got through each for schema... then get associated to object
      // The parent field names is in case the onChange needs to pass along more field names for the stand


      var getInputsBySchema = function getInputsBySchema(_ref6) {
        var schema = _ref6.schema,
            immutableObj = _ref6.immutableObj,
            _ref6$parentFieldName = _ref6.parentFieldNames,
            parentFieldNames = _ref6$parentFieldName === void 0 ? [] : _ref6$parentFieldName;

        if (!immutableObj || !immutableObj.get) {
          return null;
        }

        var fields = Object.keys(schema);
        return fields.map(function (fieldName) {
          var fieldVal = immutableObj.get(fieldName); // const type = fields[fieldName] ? fields[fieldName].type : "";
          // console.log("fieldVal", fieldVal)

          switch (schema[fieldName].type) {
            case "text":
              return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("span", {
                key: fieldName,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 311
                },
                __self: this
              }, getTextInput({
                fieldName: fieldName,
                fieldVal: fieldVal,
                parentFieldNames: parentFieldNames
              }));

            case "number":
              return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("span", {
                key: fieldName,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 313
                },
                __self: this
              }, getNumberInput({
                fieldName: fieldName,
                fieldVal: fieldVal,
                parentFieldNames: parentFieldNames
              }));
            // case "array":
            //     break;

            case "pos":
              return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("span", {
                key: fieldName,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 317
                },
                __self: this
              }, getPosInput({
                fieldName: fieldName,
                fieldVal: fieldVal,
                parentFieldNames: parentFieldNames
              }));

            case "obj":
              return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
                key: fieldName,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 319
                },
                __self: this
              }, "OBJ - ", fieldName);

            default:
              return null;
          }
        });
      }; // const standSchema = {
      //     "name": { type: "text" },
      //     "pos": { type: "obj", obj : { x: {type: 'number', y: {type: 'number'}}} },
      //     "rot": { type: "number"},
      //     "cameras": {
      //         type: "array", 
      //         arrayObj : {
      //             "name" : {type: "text"},
      //             "pos": {
      //                 type: "obj",
      //                 obj: {
      //                     "x": { type: "number" },
      //                     "y": { type: "number" }
      //                 }
      //             },
      //             "rot": { type: "number" },
      //             "fov": { type: "number" },
      //             "description": { type: "text" }
      //         }
      //     },
      //     "heads": {
      //         type: "array",
      //         arrayObj : {
      //             "name" : {type: "text"},
      //             "pos": {
      //                 type: "obj",
      //                 obj: {
      //                     "x": { type: "number" },
      //                     "y": { type: "number" }
      //                 }
      //             },
      //             "rot": { type: "number" },
      //         }
      //     }
      // };


      var stands = this.props.stands;
      var menu = this.props.menu;
      var selectedStandIndex = this.props.selectedStandIndex;
      var selectedHeadIndex = menu.get("selectedHeadIndex");
      var selectedCameraIndex = menu.get("selectedCameraIndex");
      var scale = menu.get("scale");
      var translateX = menu.getIn(["translate", "x"]);
      var translateY = menu.getIn(["translate", "y"]);

      var getStandInfo = function getStandInfo() {
        if (stands.size > 0 && stands.get) {
          var stand = stands.get(selectedStandIndex);

          if (stand) {
            return {
              selectedStand: stand,
              cameras: stand && stand.get ? stand.get("cameras") : [],
              heads: stand && stand.get ? stand.get("heads") : []
            };
          }
        }

        return {
          selectedStand: {},
          cameras: [],
          heads: []
        };
      };

      var _getStandInfo = getStandInfo(),
          selectedStand = _getStandInfo.selectedStand,
          cameras = _getStandInfo.cameras,
          heads = _getStandInfo.heads;

      var standOptions = stands.map(function (stand, i) {
        return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("option", {
          key: i,
          value: i,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 393
          },
          __self: this
        }, i, " - ", stand.get("name"));
      });
      var defaultStandOption = react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("option", {
        key: "no selection",
        value: "",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 396
        },
        __self: this
      }, "None selected");
      standOptions = [defaultStandOption].concat(standOptions);
      var cameraOptions;

      if (cameras) {
        cameraOptions = cameras.map(function (camera, i) {
          return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("option", {
            key: i,
            value: i,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 403
            },
            __self: this
          }, i, " - ", camera.get("name"));
        });
      }

      var headOptions = heads.map(function (head, i) {
        return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("option", {
          key: i,
          value: i,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 408
          },
          __self: this
        }, i, " - ", head.get("name"));
      });

      var getStandForm = function getStandForm() {
        return getInputsBySchema({
          schema: standSchema,
          immutableObj: selectedStand
        });
      };

      var getHeadForm = function getHeadForm() {
        var selectedHead = heads && heads.get ? heads.get(selectedHeadIndex) : undefined;

        if (selectedHead !== undefined) {
          return getInputsBySchema({
            schema: headSchema,
            immutableObj: selectedHead,
            parentFieldNames: ["heads", selectedHeadIndex]
          });
        } else {
          return undefined;
        }
      };

      var getCameraForm = function getCameraForm() {
        var selectedCamera = cameras && cameras.get ? cameras.get(selectedCameraIndex) : undefined;

        if (selectedCamera !== undefined) {
          return getInputsBySchema({
            schema: cameraSchema,
            immutableObj: selectedCamera,
            parentFieldNames: ["cameras", selectedCameraIndex]
          });
        } else {
          return undefined;
        }
      };

      var standInputs = getStandForm();
      var headInputs = getHeadForm();
      var cameraInputs = getCameraForm();
      var isStandRotatesHidden = this.props.menu.get("isStandRotatesHidden");
      var isCameraRotatesHidden = this.props.menu.get("isCameraRotatesHidden");
      var isHeadRotatesHidden = this.props.menu.get("isHeadRotatesHidden");
      var isForceShowStandRotatesOnSelect = this.props.menu.get("isForceShowStandRotatesOnSelect");
      var isForceShowHeadRotatesOnSelect = this.props.menu.get("isForceShowHeadRotatesOnSelect");
      var isForceShowCameraRotatesOnSelect = this.props.menu.get("isForceShowCameraRotatesOnSelect");
      var transformLabelStyles = {
        width: 120
      }; // Websocket connection buttons

      var websocketStatus = this.props.menu.get("websocketStatus");
      var websocketConnectionButton;

      if (websocketStatus === "open") {
        websocketConnectionButton = react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
          onClick: this.websocketDisconnect,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 454
          },
          __self: this
        }, "Disconnect");
      } else if (websocketStatus === "connecting") {
        websocketConnectionButton = react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
          disabled: true,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 456
          },
          __self: this
        }, "Connecting");
      } else {
        websocketConnectionButton = react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
          onClick: this.websocketConnect,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 458
          },
          __self: this
        }, "Connect");
      } // Inputs for stand, head, camera


      var standDetails;

      if (selectedStandIndex >= 0) {
        standDetails = react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 466
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          className: "Menu-section Menu-section--stand",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 467
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 468
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
          className: "Menu-form-label",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 469
          },
          __self: this
        }, "Stand"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("br", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 469
          },
          __self: this
        }), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("select", {
          value: selectedStandIndex,
          onChange: function onChange(e) {
            return _this2.props.selectStand(e.target.value);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 470
          },
          __self: this
        }, standOptions))), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          className: "Menu-section Menu-section--standInputs",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 475
          },
          __self: this
        }, standInputs), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          className: "Menu-section Menu-section--camera",
          style: {
            paddingLeft: "20px",
            float: "left"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 478
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 479
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
          className: "Menu-form-label",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 480
          },
          __self: this
        }, "Camera"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("br", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 480
          },
          __self: this
        }), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("select", {
          value: selectedCameraIndex,
          onChange: function onChange(e) {
            return _this2.props.selectCamera(e.target.value);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 481
          },
          __self: this
        }, cameraOptions)), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 485
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
          onClick: this.addNewCamera,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 486
          },
          __self: this
        }, "Add New")), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 488
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
          onClick: this.removeCurrentCamera,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 489
          },
          __self: this
        }, "Remove Current"))), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          className: "Menu-section Menu-section--cameraInputs",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 492
          },
          __self: this
        }, cameraInputs), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          className: "Menu-section Menu-section--head",
          style: {
            paddingLeft: "20px",
            float: "left"
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 496
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 497
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
          className: "Menu-form-label",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 498
          },
          __self: this
        }, "Head"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("br", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 498
          },
          __self: this
        }), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("select", {
          value: this.props.menu.get("selectedHeadIndex"),
          onChange: function onChange(e) {
            return _this2.props.selectHead(e.target.value);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 499
          },
          __self: this
        }, headOptions))), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
          className: "Menu-section Menu-section--headInputs",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 504
          },
          __self: this
        }, headInputs));
      } // Focal Point details


      var focalPointDetails;
      return react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 515
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-zoomer",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 516
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-zoomer-scale",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 517
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(rc_slider__WEBPACK_IMPORTED_MODULE_8__["default"], {
        min: 1,
        max: 400,
        vertical: true,
        onChange: this.props.setScale,
        value: parseFloat(scale),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 518
        },
        __self: this
      })), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-zoomer-translateY",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 526
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(rc_slider__WEBPACK_IMPORTED_MODULE_8__["default"], {
        min: -3000,
        max: 3000,
        vertical: true,
        onChange: function onChange(val) {
          return _this2.props.setTranslateY(val);
        },
        value: parseFloat(translateY),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 527
        },
        __self: this
      })), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-zoomer-translateX",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 535
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(rc_slider__WEBPACK_IMPORTED_MODULE_8__["default"], {
        min: -1500,
        max: 3000,
        onChange: this.props.setTranslateX,
        value: parseFloat(translateX),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 536
        },
        __self: this
      }))), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 544
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-section",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 545
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-bigButton",
        onClick: this.addStand,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 546
        },
        __self: this
      }, "Add Stand")), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-section",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 548
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-bigButton",
        onClick: this.addFocalPoint,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 549
        },
        __self: this
      }, "Add Focal Point")), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-section",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 551
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("a", {
        href: "http://".concat(document.location.hostname, ":8000/restart?service=boss"),
        target: "_blank",
        style: {
          cursor: "pointer"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 553
        },
        __self: this
      }, "restart"), "\xA0 \xA0 \xA0", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("a", {
        href: "http://".concat(document.location.hostname, ":8000/stop?service=boss"),
        target: "_blank",
        style: {
          marginLeft: 20,
          cursor: "pointer"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 554
        },
        __self: this
      }, "stop")), standDetails, focalPointDetails, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        style: {
          clear: "both"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 558
        },
        __self: this
      })), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        style: {
          marginTop: 15
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 560
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        style: {
          display: "inline-block",
          background: "#FBB",
          padding: "5px"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 561
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-loadScene",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 562
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 563
        },
        __self: this
      }, "Import Scene:"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        style: {
          width: 200
        },
        placeholder: "Scene Url",
        value: this.state.sceneUrl,
        onChange: this.setLoadSceneUrl,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 564
        },
        __self: this
      }), "\xA0", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
        onClick: this.loadScene,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 565
        },
        __self: this
      }, "Load"), "\xA0", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
        onClick: this.loadTempSceneJson,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 565
        },
        __self: this
      }, "Temp"), "\xA0", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
        onClick: this.loadRegSceneJson,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 565
        },
        __self: this
      }, "Reg")), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-getScene",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 566
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 567
        },
        __self: this
      }, "Export Scene:"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        id: "clipboard-input",
        style: {
          width: 200
        },
        placeholder: "This will be populated on 'Copy to clipboard'.",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 568
        },
        __self: this
      }), "\xA0", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
        onClick: this.exportSceneToJSON,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 569
        },
        __self: this
      }, "Copy to clipboard"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("span", {
        id: "clipboard-msg",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 570
        },
        __self: this
      }))), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        style: {
          display: "inline-block",
          background: "#BFB",
          padding: "5px"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 573
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-scaleScene",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 574
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
        style: transformLabelStyles,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 575
        },
        __self: this
      }, "Scale Scene:"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        type: "number",
        style: {
          width: 100
        },
        placeholder: "Scale",
        value: scale,
        onChange: this.setScale,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 576
        },
        __self: this
      }), "\xA0"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-translateScene",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 578
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
        style: transformLabelStyles,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 579
        },
        __self: this
      }, "Translate Scene:"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        type: "number",
        style: {
          width: 45
        },
        placeholder: "x",
        value: translateX,
        onChange: this.setTranslateX,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 580
        },
        __self: this
      }), "\xA0", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        type: "number",
        style: {
          width: 45
        },
        placeholder: "y",
        value: translateY,
        onChange: this.setTranslateY,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 581
        },
        __self: this
      }), "\xA0")), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        style: {
          display: "inline-block",
          background: "#BBF",
          padding: "5px"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 584
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        className: "Menu-websocket",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 585
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("label", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 586
        },
        __self: this
      }, "Websocket Url!:"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("span", {
        id: "websocket-msg",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 586
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("br", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 586
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        type: "text",
        style: {
          width: 200
        },
        placeholder: "Websocket Url",
        value: this.state.websocketUrl,
        onChange: this.setWebsocketUrl,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 587
        },
        __self: this
      }), "\xA0", websocketConnectionButton, "\xA0", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
        onClick: this.websocketLoadLocalhostUrl,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 590
        },
        __self: this
      }, "Autofill localhost:8081"), "\xA0"))), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        style: {
          display: "inline-block",
          background: "#FFFFEE",
          padding: "5px"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 595
        },
        __self: this
      }, "Show Rotates:\xA0", "Stand", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        name: "Stand",
        type: "checkbox",
        checked: !isStandRotatesHidden,
        onChange: this.props.menuToggleHideStandRotates,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 601
        },
        __self: this
      }), "\xA0 Head", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        name: "Head",
        type: "checkbox",
        checked: !isHeadRotatesHidden,
        onChange: this.props.menuToggleHideHeadRotates,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 602
        },
        __self: this
      }), "\xA0 Camera", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        name: "Camera",
        type: "checkbox",
        checked: !isCameraRotatesHidden,
        onChange: this.props.menuToggleHideCameraRotates,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 603
        },
        __self: this
      }), "\xA0", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
        onClick: this.props.menuShowAllRotates,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 604
        },
        __self: this
      }, "Show All"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
        onClick: this.props.menuHideAllRotates,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 605
        },
        __self: this
      }, "Hide All")), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("div", {
        style: {
          display: "inline-block",
          background: "#FFEEFF",
          padding: "5px"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 608
        },
        __self: this
      }, "Force Show On Select:\xA0 Stand", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        name: "Stand",
        type: "checkbox",
        checked: isForceShowStandRotatesOnSelect,
        onChange: this.props.menuToggleForceShowStandRotatesOnSelect,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 610
        },
        __self: this
      }), "\xA0 Head", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        name: "Head",
        type: "checkbox",
        checked: isForceShowHeadRotatesOnSelect,
        onChange: this.props.menuToggleForceShowHeadRotatesOnSelect,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 611
        },
        __self: this
      }), "\xA0 Camera", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("input", {
        name: "Camera",
        type: "checkbox",
        checked: isForceShowCameraRotatesOnSelect,
        onChange: this.props.menuToggleForceShowCameraRotatesOnSelect,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 612
        },
        __self: this
      }), "\xA0", react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
        onClick: this.props.menuEnableForceShowAllRotatesOnSelect,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 613
        },
        __self: this
      }, "Show All"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("button", {
        onClick: this.props.menuDisableForceShowAllRotatesOnSelect,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 614
        },
        __self: this
      }, "Hide All")));
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_7___default.a.Component);



/***/ })

})
//# sourceMappingURL=main.f2ad94e158928ae2093a.hot-update.js.map