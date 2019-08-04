(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./src/App.css":
/*!************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-oneOf-3-1!./node_modules/postcss-loader/src??postcss!./src/App.css ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "body {\n  font-size: 14px;\n}\n\n.App {\n  text-align: center;\n}\n\n.App-logo {\n  -webkit-animation: App-logo-spin infinite 20s linear;\n          animation: App-logo-spin infinite 20s linear;\n  height: 40vmin;\n}\n\n.App-header {\n  background-color: #282c34;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  font-size: calc(10px + 2vmin);\n  color: white;\n}\n\n.App-link {\n  color: #61dafb;\n}\n\n@-webkit-keyframes App-logo-spin {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@keyframes App-logo-spin {\n  from {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n/* Menu */\n.Menu {\n  z-index: 20;\n  /* Higher than the Scene */\n  position: relative;\n  background: #EEE;\n  padding-bottom: 10px;\n  border-bottom: 1px solid black;\n  padding: 30px 10px 10px 60px;\n\n  /* padding-left: 60px; */\n  /* 30px + 10px */\n}\n\n.Menu-zoomer {\n  position: fixed;\n  z-index: 1;\n  top: 0;\n  left: 0;\n  width: 25px;\n  height: 100%;\n  background: grey;\n  bottom: 0;\n  /* padding: 20px 5px; */\n  box-sizing: border-box;\n}\n\n/* Hide this because we don't need it */\n.Menu-zoomer .rc-slider-mark {\n  display: none;\n}\n\n.Menu-zoomer .Menu-zoomer-scale .rc-slider-handle {\n  border-color: #006e80;\n}\n\n.Menu-zoomer .Menu-zoomer-scale .rc-slider-track {\n  background-color: #006e80;\n}\n\n.Menu-zoomer .Menu-zoomer-scale,\n.Menu-zoomer .Menu-zoomer-translateY {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  box-sizing: border-box;\n  height: 100%;\n  width: 25px;\n  background: grey;\n  padding: 15px 5px;\n}\n\n.Menu-zoomer .Menu-zoomer-translateY {\n  left: 25px;\n}\n\n.Menu-zoomer .Menu-zoomer-translateX {\n  position: absolute;\n  top: 0;\n  left: 50px;\n  width: calc(100vw - 50px);\n  height: 25px;\n  background: grey;\n  padding: 5px;\n  box-sizing: border-box;\n}\n\n.Menu label,\n.Menu-form-label {\n  display: inline-block;\n  margin-right: 10px;\n  min-width: 40px;\n  font-size: 14px;\n}\n\n.Menu-section {\n  float: left;\n  padding-left: 5px;\n  padding-right: 5px;\n}\n\n.Menu-bigButton {\n  display: inline-block;\n  padding: 20px;\n  border: 1px solid black;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);\n}\n\n.Menu-form-posType-X,\n.Menu-form-posType-Y {\n  width: 60px;\n}\n\n/* Stand */\n.Stand {\n  position: absolute;\n  opacity: 0.25;\n\n  /* width: 100px;\n  height: 100px;\n  transform: translate(0px,0px);\n  border: 1px solid black;\n  background : grey; */\n}\n\n.Stand-octagon {\n  box-sizing: border-box;\n  width: 100px;\n  height: 100px;\n  background: #6a6a6a;\n  position: relative;\n  border-right: 5px solid blue;\n  cursor: pointer;\n}\n\n.Stand-octagon:before {\n  /* display: none; */\n  box-sizing: border-box;\n  content: \"\";\n  width: 100px;\n  height: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  border-bottom: 29px solid #6a6a6a;\n  border-left: 29px solid #fff;\n  border-right: 29px solid #fff;\n}\n\n.Stand-octagon:after {\n  /* display: none; */\n  box-sizing: border-box;\n  content: \"\";\n  width: 100px;\n  height: 0;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  border-top: 29px solid #6a6a6a;\n  border-left: 29px solid #fff;\n  border-right: 29px solid #fff;\n}\n\n.Stand--selected .Stand-octagon {\n  background: #a52a79;\n  border-right: 5px solid #3333EE;\n}\n\n.Stand--selected .Stand-octagon:before {\n  border-bottom-color: #a52a79;\n}\n\n.Stand--selected .Stand-octagon:after {\n  border-top-color: #a52a79;\n}\n\n.Stand--active {\n  opacity: 1;\n}\n\n.Stand--selected {\n  z-index: 10;\n}\n\n/* Same height / width of Stand-container */\n.Stand-rotateContainer {\n  width: 100px;\n  height: 100px;\n  /* Use this so the origin is in the center */\n  margin-left: -50px;\n  margin-top: -50px;\n}\n\n.Stand-container {\n  position: absolute;\n  width: 100px;\n  height: 100px;\n  -webkit-transform: translate(0px, 0px);\n          transform: translate(0px, 0px);\n  /* border: 5px solid #444; */\n  /* background: #999; */\n  /* border-right: 5px solid blue; */\n}\n\n.Stand--selected .Stand-container {\n  /* border: 5px solid #f25; */\n  /* border-right: 5px solid blue; */\n}\n\n.Stand-name {\n  /* position: absolute;\n  top: -20px;\n  transform: rotate(-90deg) translate(-70px,-60px); Transform them to the top */\n  position: absolute;\n  top: 0;\n  -webkit-transform: rotate(-90deg) translate(-38px, -80px);\n  transform: rotate(-90deg) translate(-38px, -80px);\n  left: 1px;\n  width: 120px;\n}\n\n.Stand-remove {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  cursor: pointer;\n  border: 1px solid black;\n}\n\n/* .Stand-select {\n  position: absolute;\n  right: 0;\n  top: 0;\n  cursor: pointer;\n  border: 1px solid black;\n} */\n\n\n.Stand-info {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  border: 1px solid black;\n  cursor: pointer;\n}\n\n.PopupInfo {\n  position: absolute;\n  min-width: 160px;\n  /* height: 190px; */\n  top: 0;\n  left: 0;\n  background: white;\n  border: 1px solid black;\n  border-radius: 10px;\n  z-index: 99;\n  overflow: hidden;\n  /* display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  border: 1px solid black;\n  cursor: pointer; */\n}\n\n.PopupInfo-closeButton {\n  position: absolute;\n  /* bottom: 0;\n  left: 0; */\n  top: 0;\n  right: 0;\n  cursor: pointer;\n  border: 1px solid black;\n  padding: 5px;\n}\n\n\n.Stand-move {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  cursor: move;\n  border: 1px solid black;\n}\n\n.Stand-rotate {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n}\n\n/* .Stand-rotate-offset {\n  position: absolute;\n  left: -120px;\n  bottom: -20px;\n  background-color: blue;\n  width: 10px;\n  height: 10px;\n} */\n\n.Stand-rotate-handle {\n  width: 40px;\n  height: 40px;\n  background-color: blue;\n  border-radius: 50%;\n  position: relative;\n  top: 0;\n  left: 0;\n  /* transform: translate(-10px, -10px); */\n  border: 1px solid black;\n  cursor: alias;\n  margin-left: -45px;\n  margin-top: -20px;\n  /* top: -100px; */\n  left: 100px;\n\n  /* width: 40px;\n  height: 40px;\n  background-color: blue;\n  border-radius: 50%;\n  position: relative;\n  top: 0;\n  left: 0;\n  border: 1px solid black;\n  cursor: alias; */\n}\n\n.Stand-head,\n.Stand-camera {\n  position: relative;\n}\n\n/* HEADS */\n.Head {\n  width: 80px;\n  position: absolute;\n  top: 15px;\n  height: 68px;\n  left: 50%;\n  margin-left: -40px;\n}\n\n.Head-rotateContainer {\n  position: absolute;\n  top: 0;\n  left: 0;\n  border-radius: 50%;\n  border: 1px solid #840d00;\n}\n\n.Head-rotateContainer,\n.Head-container {\n  width: 100%;\n  height: 100%;\n  cursor: pointer;\n}\n\n\n.Head-img {\n  width: 100%;\n  height: 100%;\n}\n\n.Head-rotate {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n}\n\n/* .Stand-rotate-offset {\n  position: absolute;\n  left: -120px;\n  bottom: -20px;\n  background-color: blue;\n  width: 10px;\n  height: 10px;\n} */\n\n.Head-rotate-handle {\n  width: 40px;\n  height: 40px;\n  background-color: #840d00;\n  border-radius: 50%;\n  position: relative;\n  top: 0;\n  left: 0;\n  /* transform: translate(-10px, -10px); */\n  border: 1px solid black;\n  cursor: alias;\n  margin-left: -5px;\n  margin-top: -20px;\n  /* top: -100px; */\n  left: 100px;\n\n  /* width: 40px;\n  height: 40px;\n  background-color: blue;\n  border-radius: 50%;\n  position: relative;\n  top: 0;\n  left: 0;\n  border: 1px solid black;\n  cursor: alias; */\n}\n\n\n/* CAMERAS */\n.Camera {\n\n  /* width: 80px;\n  position: absolute;\n  top: 15px;\n  height: 68px;\n  left: 50%;\n  margin-left: -40px; */\n\n  position: absolute;\n  width: 0;\n  height: 0;\n  top: 50%;\n  left: 50%;\n  margin-left: -5px;\n  /* To make camera centered, via 1/2 size of camImg */\n  margin-top: -10px;\n  /* To make camera centered, via 1/2 size of camImg */\n}\n\n.Camera-rotateContainer {\n  position: relative;\n  /* top: -10px;\n  left: -5px; */\n  /* border-radius: 50%;\n  border: 1px solid #840d00; */\n}\n\n.Camera-rotateContainer,\n.Camera-container {\n  /* width: 100%;\n  height: 100%; */\n}\n\n.Camera-camImg {\n  position: relative;\n  height: 20px;\n  width: 10px;\n  background-color: green;\n  cursor: pointer;\n}\n\n.Camera--selected .Camera-camImg {\n  border: 2px solid #f25;\n  margin-left: -2px;\n  margin-top: -2px;\n}\n\n.Camera-camImg:after {\n  content: '';\n  position: absolute;\n  height: 10px;\n  width: 3px;\n  background-color: black;\n  top: 5px;\n  right: -2px;\n}\n\n\n.Camera-img {\n  width: 100%;\n  height: 100%;\n}\n\n.Camera-rotate {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n}\n\n/* .Stand-rotate-offset {\n  position: absolute;\n  left: -120px;\n  bottom: -20px;\n  background-color: blue;\n  width: 10px;\n  height: 10px;\n} */\n\n.Camera-rotate {\n  z-index: 10;\n}\n\n.Camera-rotate-handle {\n  width: 40px;\n  height: 40px;\n  background-color: GREEN;\n  /*#840d00;*/\n  border-radius: 50%;\n  position: relative;\n  top: 0;\n  left: 0;\n  /* transform: translate(-10px, -10px); */\n  border: 1px solid black;\n  cursor: alias;\n  margin-left: -60px;\n  margin-top: -20px;\n  /* top: -100px; */\n  left: 100px;\n\n  /* width: 40px;\n  height: 40px;\n  background-color: blue;\n  border-radius: 50%;\n  position: relative;\n  top: 0;\n  left: 0;\n  border: 1px solid black;\n  cursor: alias; */\n}\n\n.Camera--selected .Camera-rotate-handle {\n  border: 1px solid #f25;\n}\n\n\n/* KINECTS */\n.Kinect {\n\n  /* width: 80px;\n  position: absolute;\n  top: 15px;\n  height: 68px;\n  left: 50%;\n  margin-left: -40px; */\n\n  position: absolute;\n  width: 0;\n  height: 0;\n  top: 50%;\n  left: 50%;\n  margin-left: -5px;\n  /* To make kinect centered, via 1/2 size of camImg */\n  margin-top: -10px;\n  /* To make kinect centered, via 1/2 size of camImg */\n}\n\n.Kinect-rotateContainer {\n  position: relative;\n  /* top: -10px;\n  left: -5px; */\n  /* border-radius: 50%;\n  border: 1px solid #840d00; */\n}\n\n.Kinect-rotateContainer,\n.Kinect-container {\n  /* width: 100%;\n  height: 100%; */\n}\n\n.Kinect-camImg {\n  position: absolute;\n  height: 30px;\n  width: 20px;\n  margin-top: -15px;\n  margin-left: -20px;\n  background-color: rgb(130,0,200);\n  cursor: pointer;\n}\n\n.Kinect--selected .Kinect-camImg {\n  border: 2px solid rgb(200,0,250);\n  margin-left: -2px;\n  margin-top: -2px;\n}\n\n.Kinect-camImg:after {\n  content: '';\n  position: absolute;\n  height: 20px;\n  width: 3px;\n  background-color: black;\n  top: 5px;\n  right: -2px;\n}\n\n\n.Kinect-img {\n  width: 100%;\n  height: 100%;\n}\n\n.Kinect-rotate {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n}\n\n/* .Stand-rotate-offset {\n  position: absolute;\n  left: -120px;\n  bottom: -20px;\n  background-color: blue;\n  width: 10px;\n  height: 10px;\n} */\n\n.Kinect-rotate {\n  z-index: 10;\n}\n\n.Kinect-rotate-handle {\n  width: 40px;\n  height: 40px;\n  background-color: rgb(130,0,200);\n  /*#840d00;*/\n  border-radius: 50%;\n  position: relative;\n  top: 0;\n  left: 0;\n  /* transform: translate(-10px, -10px); */\n  border: 1px solid black;\n  cursor: alias;\n  margin-left: -60px;\n  margin-top: -20px;\n  /* top: -100px; */\n  left: 100px;\n\n  /* width: 40px;\n  height: 40px;\n  background-color: blue;\n  border-radius: 50%;\n  position: relative;\n  top: 0;\n  left: 0;\n  border: 1px solid black;\n  cursor: alias; */\n}\n\n.Kinect--selected .Kinect-rotate-handle {\n  border: 1px solid #f25;\n}\n\n\n/* .Kinects {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.Kinect {\n\n\n  position: absolute;\n  width: 0;\n  height: 0;\n  top: 50%;\n  left: 50%;\n  margin-left: -5px;\n  margin-top: -10px;\n}\n\n.Kinect-rotateContainer {\n  position: relative;\n}\n\n.Kinect-rotateContainer,\n.Kinect-container {\n}\n\n.Kinect-camImg {\n  position: relative;\n  height: 20px;\n  width: 10px;\n  background-color: green;\n  cursor: pointer;\n}\n\n.Kinect--selected .Kinect-camImg {\n  border: 2px solid #f25;\n  margin-left: -2px;\n  margin-top: -2px;\n}\n\n.Kinect-camImg:after {\n  content: '';\n  position: absolute;\n  height: 10px;\n  width: 3px;\n  background-color: black;\n  top: 5px;\n  right: -2px;\n}\n\n\n.Kinect-img {\n  width: 100%;\n  height: 100%;\n}\n\n.Kinect-rotate {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n}\n\n\n.Kinect-rotate {\n  z-index: 10;\n}\n\n.Kinect-rotate-handle {\n  width: 40px;\n  height: 40px;\n  background-color: GREEN;\n  border-radius: 50%;\n  position: relative;\n  top: 0;\n  left: 0;\n  border: 1px solid black;\n  cursor: alias;\n  margin-left: -60px;\n  margin-top: -20px;\n  left: 100px;\n\n}\n\n.Kinect--selected .Kinect-rotate-handle {\n  border: 1px solid #f25;\n}\n*/\n\n/* .Stand-rotate-offset {\n  position: absolute;\n  left: -120px;\n  bottom: -20px;\n  background-color: blue;\n  width: 10px;\n  height: 10px;\n} */\n\n/* Focal Point */\n.FocalPoint {\n  text-align: center;\n  position: absolute;\n}\n\n.FocalPoint-move-handle {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 40px;\n  height: 40px;\n  background-color: #7f848e;\n  /*#840d00;*/\n  border-radius: 50%;\n  position: relative;\n  top: 0;\n  left: 0;\n  /* transform: translate(-10px, -10px); */\n  border: 1px solid black;\n  cursor: move;\n  margin-left: -20px;\n  margin-top: -20px;\n  /* top: -100px; */\n  color: white !important;\n}\n\n/* .KinectFocalPoint */\n\n.KinectFocalPoints {\n  position: absolute;\n}\n\n.KinectFocalPoint {\n  position: absolute;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 40px;\n  height: 40px;\n  background-color: #8200c8;\n  /*#840d00;*/\n  border-radius: 50%;\n  \n  top: 0;\n  left: 0;\n  /* transform: translate(-10px, -10px); */\n  border: 1px solid black;\n  /* cursor: pointer; */\n  margin-left: -20px;\n  margin-top: -20px;\n  /* top: -100px; */\n  color: white !important;\n}\n\n/* Motion Lines */\n.GridLines {\n  position: absolute;\n  top: 0;\n  -webkit-transform-origin: top center;\n          transform-origin: top center;\n}\n\n.GridLines table {\n  border-collapse: collapse;\n  width: 100%;\n  height: 100%;\n}\n\n.GridLines table td {\n  border: 2px solid #efefef\n}\n\n.GridLines table td.GridLines-td--thickRight {\n  border-right: 2px solid #300!important;\n}\n\n.GridLines table td.GridLines-td--thickBottom {\n  border-bottom: 2px solid #300!important;\n}\n\n/* Motion Lines */\n.MotionLine {\n  opacity: 1;\n  /* -webkit-transition: opacity 1500ms;\n  transition: opacity 1500ms; */\n}\n\n.MotionLine.fadeOut {\n  -webkit-animation-name: fadeOutMotionLine;\n          animation-name: fadeOutMotionLine;\n  -webkit-animation-duration: 600ms;\n          animation-duration: 600ms;\n  /* NOTE: this 1500ms should be the same value as what's in ./middleware/index.js => customWebsocketMiddleware, for the setTimeout duration of the removal for the MotionLine */\n}\n\n@-webkit-keyframes fadeOutMotionLine {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n@keyframes fadeOutMotionLine {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n/* UTILS */\n.noselect {\n  -webkit-touch-callout: none;\n  /* iOS Safari */\n  -webkit-user-select: none;\n  /* Safari */\n  /* Konqueror HTML */\n  -moz-user-select: none;\n  /* Firefox */\n  -ms-user-select: none;\n  /* Internet Explorer/Edge */\n  user-select: none;\n  /* Non-prefixed version, currently\n                                  supported by Chrome and Opera */\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./src/index.css":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-oneOf-3-1!./node_modules/postcss-loader/src??postcss!./src/index.css ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "body {\n  margin: 0;\n  padding: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\",\n    \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\",\n    sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\ncode {\n  font-family: source-code-pro, Menlo, Monaco, Consolas, \"Courier New\",\n    monospace;\n}\n", ""]);

// exports


/***/ }),

/***/ "./src/App.css":
/*!*********************!*\
  !*** ./src/App.css ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/css-loader??ref--6-oneOf-3-1!../node_modules/postcss-loader/src??postcss!./App.css */ "./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./src/App.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../node_modules/css-loader??ref--6-oneOf-3-1!../node_modules/postcss-loader/src??postcss!./App.css */ "./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./src/App.css", function() {
		var newContent = __webpack_require__(/*! !../node_modules/css-loader??ref--6-oneOf-3-1!../node_modules/postcss-loader/src??postcss!./App.css */ "./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./src/App.css");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _containers_Menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./containers/Menu */ "./src/containers/Menu.js");
/* harmony import */ var _containers_Scene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./containers/Scene */ "./src/containers/Scene.js");
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./App.css */ "./src/App.css");
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var rc_slider_assets_index_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rc-slider/assets/index.css */ "./node_modules/rc-slider/assets/index.css");
/* harmony import */ var rc_slider_assets_index_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(rc_slider_assets_index_css__WEBPACK_IMPORTED_MODULE_4__);
var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/App.js";




 // import {scale, rotate, translate, compose, applyToPoint} from 'transformation-matrix';
// window.c_tm = {scale, rotate, translate, compose, applyToPoint};

var App = function App() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_containers_Menu__WEBPACK_IMPORTED_MODULE_1__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_containers_Scene__WEBPACK_IMPORTED_MODULE_2__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (App); // import React, { Component } from 'react';
// // import logo from './logo.svg';
// import './App.css';
// // Disable the scrolling of the page.
// const bodyScrollLock = require('body-scroll-lock');
// const disableBodyScroll = bodyScrollLock.disableBodyScroll;
// // const enableBodyScroll = bodyScrollLock.enableBodyScroll;
// // const targetElement = document.querySelector("html")
// disableBodyScroll(document.querySelector("html"));
// disableBodyScroll(document.querySelector("body"));
// class App extends Component {
//   render() {
//     return (
//       <div style={{textAlign: "left"}} className="App">
//         hi
//       </div>
//     );
//   }
// }
// export default App;

/***/ }),

/***/ "./src/actions/index.js":
/*!******************************!*\
  !*** ./src/actions/index.js ***!
  \******************************/
/*! exports provided: websocketConnect, websocketDisconnect, websocketSend, menuDeselectStandAndAll, menuSelectStand, menuSelectCamera, menuSelectKinect, menuSelectHead, menuSelectFocalPoint, menuHideAllRotates, menuShowAllRotates, menuEnableForceShowAllRotatesOnSelect, menuDisableForceShowAllRotatesOnSelect, menuToggleHideRotates, menuToggleForceShowRotatesOnSelect, sceneFetchFromUrl, standSetScene, menuSetScale, menuSetTranslateX, menuSetTranslateY, standAdd, standSetFieldByIndex, standSetInFieldsByIndex, standMoveByIndex, standRotateByIndex, standRemoveByIndex, standSetIsActive, standSetIsNotActive, kinectMoveByIndex, kinectRotateByIndex, kinectAddNew, kinectRemoveByIndex, kinectSetFocalPoints, kinectClearFocalPoints, headMoveByIndex, headRotateByHeadName, headRotateByIndex, headRotateStartByIndex, headRotateStopByIndex, cameraMoveByIndex, cameraRotateByIndex, cameraAddNew, cameraRemoveByIndex, popupInfoMove, popupInfoAddNew, popupInfoRemove, popupInfoRemoveAll, focalPointAdd, focalPointMoveByIndex, focalPointRemoveByIndex, focalPointSetIsActive, focalPointSetIsNotActive, motionLinesAddLine, motionLinesRemoveLine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "websocketConnect", function() { return websocketConnect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "websocketDisconnect", function() { return websocketDisconnect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "websocketSend", function() { return websocketSend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuDeselectStandAndAll", function() { return menuDeselectStandAndAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuSelectStand", function() { return menuSelectStand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuSelectCamera", function() { return menuSelectCamera; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuSelectKinect", function() { return menuSelectKinect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuSelectHead", function() { return menuSelectHead; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuSelectFocalPoint", function() { return menuSelectFocalPoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuHideAllRotates", function() { return menuHideAllRotates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuShowAllRotates", function() { return menuShowAllRotates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuEnableForceShowAllRotatesOnSelect", function() { return menuEnableForceShowAllRotatesOnSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuDisableForceShowAllRotatesOnSelect", function() { return menuDisableForceShowAllRotatesOnSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuToggleHideRotates", function() { return menuToggleHideRotates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuToggleForceShowRotatesOnSelect", function() { return menuToggleForceShowRotatesOnSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sceneFetchFromUrl", function() { return sceneFetchFromUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "standSetScene", function() { return standSetScene; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuSetScale", function() { return menuSetScale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuSetTranslateX", function() { return menuSetTranslateX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "menuSetTranslateY", function() { return menuSetTranslateY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "standAdd", function() { return standAdd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "standSetFieldByIndex", function() { return standSetFieldByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "standSetInFieldsByIndex", function() { return standSetInFieldsByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "standMoveByIndex", function() { return standMoveByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "standRotateByIndex", function() { return standRotateByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "standRemoveByIndex", function() { return standRemoveByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "standSetIsActive", function() { return standSetIsActive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "standSetIsNotActive", function() { return standSetIsNotActive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kinectMoveByIndex", function() { return kinectMoveByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kinectRotateByIndex", function() { return kinectRotateByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kinectAddNew", function() { return kinectAddNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kinectRemoveByIndex", function() { return kinectRemoveByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kinectSetFocalPoints", function() { return kinectSetFocalPoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kinectClearFocalPoints", function() { return kinectClearFocalPoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "headMoveByIndex", function() { return headMoveByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "headRotateByHeadName", function() { return headRotateByHeadName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "headRotateByIndex", function() { return headRotateByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "headRotateStartByIndex", function() { return headRotateStartByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "headRotateStopByIndex", function() { return headRotateStopByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cameraMoveByIndex", function() { return cameraMoveByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cameraRotateByIndex", function() { return cameraRotateByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cameraAddNew", function() { return cameraAddNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cameraRemoveByIndex", function() { return cameraRemoveByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "popupInfoMove", function() { return popupInfoMove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "popupInfoAddNew", function() { return popupInfoAddNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "popupInfoRemove", function() { return popupInfoRemove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "popupInfoRemoveAll", function() { return popupInfoRemoveAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focalPointAdd", function() { return focalPointAdd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focalPointMoveByIndex", function() { return focalPointMoveByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focalPointRemoveByIndex", function() { return focalPointRemoveByIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focalPointSetIsActive", function() { return focalPointSetIsActive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focalPointSetIsNotActive", function() { return focalPointSetIsNotActive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "motionLinesAddLine", function() { return motionLinesAddLine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "motionLinesRemoveLine", function() { return motionLinesRemoveLine; });
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @giantmachines/redux-websocket */ "./node_modules/@giantmachines/redux-websocket/dist/index.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_0__);
// WEBSOCKET

var websocketUrl = "ws://localhost:8081/ws";
var websocketConnect = function websocketConnect() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : websocketUrl;
  return {
    type: _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_0__["WEBSOCKET_CONNECT"],
    payload: {
      url: url
    }
  };
};
var websocketDisconnect = function websocketDisconnect() {
  return {
    type: _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_0__["WEBSOCKET_DISCONNECT"]
  };
};
var websocketSend = function websocketSend(payload) {
  // console.log('WEBSOCK SEND', payload);
  return {
    type: _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_0__["WEBSOCKET_SEND"],
    payload: payload
  };
}; // MENU

var menuDeselectStandAndAll = function menuDeselectStandAndAll() {
  return {
    type: 'MENU_DESELECT_STAND_AND_ALL'
  };
};
var menuSelectStand = function menuSelectStand(index) {
  return {
    type: 'MENU_SELECT_STAND',
    index: index
  };
};
var menuSelectCamera = function menuSelectCamera(_ref) {
  var standIndex = _ref.standIndex,
      cameraIndex = _ref.cameraIndex;
  return {
    type: 'MENU_SELECT_CAMERA',
    standIndex: standIndex,
    cameraIndex: cameraIndex
  };
};
var menuSelectKinect = function menuSelectKinect(kinectName) {
  return {
    type: 'MENU_SELECT_KINECT',
    kinectName: kinectName
  };
}; // export const menuSelectCamera = ({standIndex, cameraIndex}) => ({
//     type: 'MENU_SELECT_CAMERA',
//     standIndex,
//     cameraIndex
// })

var menuSelectHead = function menuSelectHead(_ref2) {
  var standIndex = _ref2.standIndex,
      headIndex = _ref2.headIndex;
  return {
    type: 'MENU_SELECT_HEAD',
    standIndex: standIndex,
    headIndex: headIndex
  };
};
var menuSelectFocalPoint = function menuSelectFocalPoint(index) {
  return {
    type: 'MENU_SELECT_FOCALPOINT',
    index: index
  };
};
var menuHideAllRotates = function menuHideAllRotates() {
  return {
    type: 'MENU_HIDE_ALL_ROTATES'
  };
};
var menuShowAllRotates = function menuShowAllRotates() {
  return {
    type: 'MENU_SHOW_ALL_ROTATES'
  };
};
var menuEnableForceShowAllRotatesOnSelect = function menuEnableForceShowAllRotatesOnSelect() {
  return {
    type: 'MENU_ENABLE_FORCE_SHOW_ALL_ROTATES_ON_SELECT'
  };
};
var menuDisableForceShowAllRotatesOnSelect = function menuDisableForceShowAllRotatesOnSelect() {
  return {
    type: 'MENU_DISABLE_FORCE_SHOW_ALL_ROTATES_ON_SELECT'
  };
};
var menuToggleHideRotates = function menuToggleHideRotates(rotateType) {
  return {
    type: 'MENU_TOGGLE_HIDE_ROTATES',
    rotateType: rotateType
  };
};
var menuToggleForceShowRotatesOnSelect = function menuToggleForceShowRotatesOnSelect(rotateType) {
  return {
    type: 'MENU_TOGGLE_FORCE_SHOW_ROTATES_ON_SELECT',
    rotateType: rotateType
  };
};
function sceneFetchFromUrl(sceneUrl) {
  return function (dispatch) {
    return fetch(sceneUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (typeof json === "object") {
        if (json.scale) {
          dispatch(menuSetScale(json.scale));
        }

        if (json.translate && json.translate.x && json.translate.y) {
          dispatch(menuSetTranslateX(json.translate.x));
          dispatch(menuSetTranslateY(json.translate.y));
        } // if (json.kinects) {
        //     console.log("kinnn");
        //     dispatch(kinectSetScene(json))
        // }

      }

      dispatch(standSetScene(json));
    }).catch(function (e) {
      return console.log(e);
    });
  };
}
var standSetScene = function standSetScene(sceneData) {
  return {
    type: 'STAND_SET_SCENE',
    sceneData: sceneData
  };
};
var menuSetScale = function menuSetScale(scale) {
  return {
    type: 'MENU_SET_SCALE',
    scale: scale
  };
};
var menuSetTranslateX = function menuSetTranslateX(x) {
  return {
    type: 'MENU_SET_TRANSLATE_X',
    x: x
  };
};
var menuSetTranslateY = function menuSetTranslateY(y) {
  return {
    type: 'MENU_SET_TRANSLATE_Y',
    y: y
  };
}; // STAND

var standAdd = function standAdd(options) {
  return {
    type: 'STAND_ADD',
    options: options
  };
};
var standSetFieldByIndex = function standSetFieldByIndex(standIndex, fieldName, value) {
  return {
    type: 'STAND_SET_FIELD_BY_INDEX',
    index: standIndex,
    fieldName: fieldName,
    value: value
  };
};
var standSetInFieldsByIndex = function standSetInFieldsByIndex(standIndex, fieldNames, value) {
  return {
    type: 'STAND_SETIN_FIELDS_BY_INDEX',
    index: standIndex,
    fieldNames: fieldNames,
    value: value
  };
};
var standMoveByIndex = function standMoveByIndex(standIndex, pos) {
  return {
    type: 'STAND_MOVE_BY_INDEX',
    index: standIndex,
    pos: pos
  };
};
var standRotateByIndex = function standRotateByIndex(standIndex, rot) {
  return {
    type: 'STAND_ROTATE_BY_INDEX',
    index: standIndex,
    rot: rot
  };
};
var standRemoveByIndex = function standRemoveByIndex(index) {
  return {
    type: 'STAND_REMOVE_BY_INDEX',
    index: index
  };
};
var standSetIsActive = function standSetIsActive(headName) {
  return {
    type: 'STAND_SET_IS_ACTIVE',
    headName: headName
  };
};
var standSetIsNotActive = function standSetIsNotActive(headName) {
  return {
    type: 'STAND_SET_IS_NOT_ACTIVE',
    headName: headName
  };
}; // KINECT

var kinectMoveByIndex = function kinectMoveByIndex(standIndex, kinectIndex, pos) {
  return {
    type: 'KINECT_MOVE_BY_INDEX',
    standIndex: standIndex,
    kinectIndex: kinectIndex,
    pos: pos
  };
};
var kinectRotateByIndex = function kinectRotateByIndex(standIndex, kinectIndex, rot) {
  return {
    type: 'KINECT_ROTATE_BY_INDEX',
    standIndex: standIndex,
    kinectIndex: kinectIndex,
    rot: rot
  };
};
var kinectAddNew = function kinectAddNew(standIndex) {
  return {
    type: 'KINECT_ADD_NEW',
    standIndex: standIndex
  };
};
var kinectRemoveByIndex = function kinectRemoveByIndex(standIndex, kinectIndex) {
  return {
    type: 'KINECT_REMOVE_BY_INDEX',
    standIndex: standIndex,
    kinectIndex: kinectIndex
  };
};
var kinectSetFocalPoints = function kinectSetFocalPoints(_ref3) {
  var kinectName = _ref3.kinectName,
      focalPoints = _ref3.focalPoints;
  return {
    type: 'KINECT_SET_FOCAL_POINTS',
    focalPoints: focalPoints,
    kinectName: kinectName
  };
};
var kinectClearFocalPoints = function kinectClearFocalPoints(_ref4) {
  var kinectName = _ref4.kinectName;
  return {
    type: 'KINECT_CLEAR_FOCAL_POINTS',
    kinectName: kinectName
  };
}; // export const kinectSetScene = (sceneData) => ({
//     type: 'KINECT_SET_SCENE',
//     sceneData
// });
// export const kinectMoveByName = ({kinectName, pos}) => ({
//     type: 'KINECT_MOVE_BY_NAME',
//     kinectName: kinectName,
//     pos
// })
// export const kinectRotateByName = ({kinectName, rot}) => ({
//     type: 'KINECT_ROTATE_BY_NAME',
//     kinectName,
//     rot
// })
// export const kinectClearFocalPoints = (kinectName) => ({
//     type: 'KINECT_CLEAR_FOCAL_POINTS',
//     kinectName
// })
// HEAD

var headMoveByIndex = function headMoveByIndex(standIndex, headIndex, pos) {
  return {
    type: 'HEAD_MOVE_BY_INDEX',
    standIndex: standIndex,
    headIndex: headIndex,
    pos: pos
  };
}; // Note this is similar to getting "head-positioned" from the websocket

var headRotateByHeadName = function headRotateByHeadName(headName, rotation) {
  return {
    type: 'HEAD_ROTATE_BY_HEADNAME',
    headName: headName,
    rotation: rotation
  };
};
var headRotateByIndex = function headRotateByIndex(standIndex, headIndex, rot) {
  return {
    type: 'HEAD_ROTATE_BY_INDEX',
    standIndex: standIndex,
    headIndex: headIndex,
    rot: rot
  };
};
var headRotateStartByIndex = function headRotateStartByIndex(standIndex, headIndex) {
  return {
    type: 'HEAD_ROTATE_START_BY_INDEX',
    standIndex: standIndex,
    headIndex: headIndex
  };
};
var headRotateStopByIndex = function headRotateStopByIndex(standIndex, headIndex) {
  return {
    type: 'HEAD_ROTATE_STOP_BY_INDEX',
    standIndex: standIndex,
    headIndex: headIndex
  };
}; // CAMERA

var cameraMoveByIndex = function cameraMoveByIndex(standIndex, cameraIndex, pos) {
  return {
    type: 'CAMERA_MOVE_BY_INDEX',
    standIndex: standIndex,
    cameraIndex: cameraIndex,
    pos: pos
  };
};
var cameraRotateByIndex = function cameraRotateByIndex(standIndex, cameraIndex, rot) {
  return {
    type: 'CAMERA_ROTATE_BY_INDEX',
    standIndex: standIndex,
    cameraIndex: cameraIndex,
    rot: rot
  };
};
var cameraAddNew = function cameraAddNew(standIndex) {
  return {
    type: 'CAMERA_ADD_NEW',
    standIndex: standIndex
  };
};
var cameraRemoveByIndex = function cameraRemoveByIndex(standIndex, cameraIndex) {
  return {
    type: 'CAMERA_REMOVE_BY_INDEX',
    standIndex: standIndex,
    cameraIndex: cameraIndex
  };
}; // POPUP

var popupInfoMove = function popupInfoMove(standIndex, pos) {
  return {
    type: 'POPUP_INFO_MOVE_BY_INDEX',
    // popupId: popupId,
    standIndex: standIndex,
    pos: pos
  };
};
var popupInfoAddNew = function popupInfoAddNew(standIndex, pos) {
  return {
    type: 'POPUP_INFO_ADD_NEW',
    standIndex: standIndex,
    // popupId,
    // popupType,
    pos: pos // payload

  };
};
var popupInfoRemove = function popupInfoRemove(standIndex) {
  return {
    type: 'POPUP_INFO_REMOVE',
    standIndex: standIndex
  };
};
var popupInfoRemoveAll = function popupInfoRemoveAll() {
  return {
    type: 'POPUP_INFO_REMOVE_ALL'
  };
}; // FOCAL POINTS

var focalPointAdd = function focalPointAdd(options) {
  return {
    type: 'FOCALPOINT_ADD',
    options: options
  };
}; // export const focalPointSetFieldByIndex = (focalPointIndex, fieldName, value) => ({
//     type: 'FOCALPOINT_SET_FIELD_BY_INDEX',
//     index: focalPointIndex,
//     fieldName,
//     value
// });
// export const focalPointSetInFieldsByIndex = (focalPointIndex, fieldNames, value) => ({
//     type: 'FOCALPOINT_SETIN_FIELDS_BY_INDEX',
//     index: focalPointIndex,
//     fieldNames,
//     value
// });

var focalPointMoveByIndex = function focalPointMoveByIndex(focalPointIndex, pos) {
  return {
    type: 'FOCALPOINT_MOVE_BY_INDEX',
    index: focalPointIndex,
    pos: pos
  };
};
var focalPointRemoveByIndex = function focalPointRemoveByIndex(index) {
  return {
    type: 'FOCALPOINT_REMOVE_BY_INDEX',
    index: index
  };
};
var focalPointSetIsActive = function focalPointSetIsActive(focalPointName) {
  return {
    type: 'FOCALPOINT_SET_IS_ACTIVE',
    focalPointName: focalPointName
  };
};
var focalPointSetIsNotActive = function focalPointSetIsNotActive(focalPointName) {
  return {
    type: 'FOCALPOINT_SET_IS_NOT_ACTIVE',
    focalPointName: focalPointName
  };
}; // export const standRemoveByIndex = index => ({
//     type: 'STAND_REMOVE_BY_INDEX',
//     index
// })
// WEBSOCKET - MOTION LINES

var motionLinesAddLine = function motionLinesAddLine(options) {
  var lineId = options.lineId,
      shape = options.shape,
      coords = options.coords;
  return {
    type: 'MOTIONLINES_ADD',
    lineId: lineId,
    shape: shape,
    coords: coords
  };
};
var motionLinesRemoveLine = function motionLinesRemoveLine(options) {
  var lineId = options.lineId;
  return {
    type: 'MOTIONLINES_REMOVE',
    lineId: lineId
  };
};

/***/ }),

/***/ "./src/components/Camera.js":
/*!**********************************!*\
  !*** ./src/components/Camera.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Camera; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-draggable */ "./node_modules/react-draggable/dist/react-draggable.js");
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_draggable__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_9__);






var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/Camera.js";
 //import Cameras from '../containers/Cameras'
// import Draggable from 'react-draggable'; 

 // import Draggable, {DraggableCore} from 'react-draggable'; 
// import Stand from '../containers/Stand';





var Camera =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Camera, _React$Component);

  function Camera(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Camera);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Camera).call(this, props));
    _this.state = {
      moveRelativeStartPos: {
        x: 0,
        y: 0
      } // pos : {x:0, y:0},
      // rotateRad : 0

    };
    _this.handleMoveStart = _this.handleMoveStart.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveDrag = _this.handleMoveDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveStop = _this.handleMoveStop.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateStart = _this.handleRotateStart.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateDrag = _this.handleRotateDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateStop = _this.handleRotateStop.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this))); // Refs

    _this.refCameraRotateHandle = react__WEBPACK_IMPORTED_MODULE_6___default.a.createRef();
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Camera, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["noTouchMove"])(this.refCameraRotateHandle.current);
    } // Move

  }, {
    key: "handleMoveStart",
    value: function handleMoveStart(e, a) {
      var curPos = this.getCurrentPos();
      var x = a.x,
          y = a.y;
      var pos = {
        x: x - curPos.x,
        y: y - curPos.y
      };
      this.setState({
        moveRelativeStartPos: pos
      });
      this.props.selectCamera();
    }
  }, {
    key: "handleMoveDrag",
    value: function handleMoveDrag(e, a) {
      var x = a.x,
          y = a.y;
      var pos = {
        x: x,
        y: y
      }; //: x - origin.x, y: y - origin.y };

      var rot = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["decodeRot"])(this.props.stand.get("rot"));
      var newPos = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["encodePosRelativeStand"])(this.props.menu, Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["rotateVector"])(pos, rot)); //, origin);

      this.props.cameraMove(newPos);
    } // handleMoveDragBLAHJ(e, a) {
    //     // console.log("h dr", e, a);
    //     const { x, y } = a;
    //     const pos = encodePosScale(this.props.menu, { x, y });
    //     // const pos = encrypt1({ x, y });
    //     // const pos = { x, y };
    //     // Convert the values 
    //     this.props.standMove(pos);
    //     // this.setState({ pos });
    // }

  }, {
    key: "handleMoveStop",
    value: function handleMoveStop(e, a) {} // this.props.cameraMove(pos);
    // console.log("h stop", e, a);
    // Rotate

  }, {
    key: "handleRotateStart",
    value: function handleRotateStart(e, a) {
      this.props.selectCamera(); // console.log("hrot str", e, a);
    }
  }, {
    key: "handleRotateDrag",
    value: function handleRotateDrag(e, a) {
      var x = a.x,
          y = a.y;
      var rad = Math.atan2(y, x); // In radians
      // Then you can convert it to degrees as easy as:

      var deg = rad * (180 / Math.PI);
      var standRot = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["decodeRot"])(this.props.stand.get("rot"));
      this.props.cameraRotate(Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["encodeRot"])(deg - standRot));
    }
  }, {
    key: "handleRotateStop",
    value: function handleRotateStop(e, a) {// console.log("hrlt stop", e, a);
    }
  }, {
    key: "getCurrentPos",
    value: function getCurrentPos() {
      var pos = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["decodePosRelativeStand"])(this.props.camera.get("pos").toJS());
      pos.x = isNaN(pos.x) ? 0 : pos.x;
      pos.y = isNaN(pos.y) ? 0 : pos.y;
      return pos;
    }
  }, {
    key: "render",
    value: function render() {
      var camera = this.props.camera;
      var pos = this.getCurrentPos();
      var rot = camera.get("rot");
      rot = isNaN(rot) ? 0 : rot;
      rot = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["decodeRot"])(rot);
      var selectedStandIndex = this.props.menu.get("selectedStandIndex");
      var selectedCameraIndex = this.props.menu.get("selectedCameraIndex");
      var isSelected = selectedStandIndex === this.props.standIndex && selectedCameraIndex === this.props.cameraIndex;
      var fov = camera.get("fov");
      var fovLength = 500;
      var fovHeight = 0;

      if (0 < fov && fov < 180) {
        var rad = fov / 2 * Math.PI / 180;
        fovHeight = fovLength * Math.tan(rad);
      }

      var topAdjust = 12; // This is related to the height of half the camera.

      var fovStyle = {
        width: 0,
        height: 0,
        borderTop: "".concat(fovHeight, "px solid transparent"),
        borderRight: "".concat(fovLength, "px solid rgba(0,100,0,0.1)"),
        borderBottom: "".concat(fovHeight, "px solid transparent"),
        position: "absolute",
        top: "-".concat(fovHeight - topAdjust, "px"),
        left: "12px",
        zIndex: 2,
        pointerEvents: "none" // https://stackoverflow.com/questions/3680429/click-through-a-div-to-underlying-elements

      };
      var isCameraRotatesHidden = this.props.menu.get("isCameraRotatesHidden");
      var isForceShowCameraRotatesOnSelect = this.props.menu.get("isForceShowCameraRotatesOnSelect");
      var isShowCameraRotator = !isCameraRotatesHidden || isSelected && isForceShowCameraRotatesOnSelect;
      return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("Camera", {
          "Camera--selected": isSelected
        }),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 143
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_draggable__WEBPACK_IMPORTED_MODULE_7__["DraggableCore"] // allowAnyClick= boolean,
      // cancel= string,
      // disabled= boolean,
      // enableUserSelectHack= boolean,
      // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
      // grid= [number, number],
      , {
        handle: ".Camera-camImg",
        onStart: this.handleMoveStart,
        onDrag: this.handleMoveDrag,
        onStop: this.handleMoveStop // onMouseDown= (e= MouseEvent) => void
        ,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 144
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Camera-container",
        style: {
          transform: "translate(".concat(pos.x, "px, ").concat(pos.y, "px)")
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 157
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Camera-rotateContainer",
        style: {
          transform: "rotate(".concat(rot, "deg)")
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 158
        },
        __self: this
      }, !isShowCameraRotator ? null : react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Camera-rotate noselect",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 161
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_draggable__WEBPACK_IMPORTED_MODULE_7__["DraggableCore"] // allowAnyClick= boolean,
      // cancel= string,
      // disabled= boolean,
      // enableUserSelectHack= boolean,
      // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
      // grid= [number, number],
      , {
        handle: ".Camera-rotate-handle",
        onStart: this.handleRotateStart,
        onDrag: this.handleRotateDrag,
        onStop: this.handleRotateStop // onMouseDown= (e= MouseEvent) => void
        ,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 163
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        ref: this.refCameraRotateHandle,
        className: "Camera-rotate-handle",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 176
        },
        __self: this
      }))), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Camera-camImg",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 181
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Camera-fov",
        style: fovStyle,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 183
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Camera-fov-1",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 184
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Camera-fov-2",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 185
        },
        __self: this
      }))))));
    }
  }]);

  return Camera;
}(react__WEBPACK_IMPORTED_MODULE_6___default.a.Component);



/***/ }),

/***/ "./src/components/Cameras.js":
/*!***********************************!*\
  !*** ./src/components/Cameras.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _containers_Camera__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../containers/Camera */ "./src/containers/Camera.js");





var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/Cameras.js";



var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {// pos : {x:0, y:0},
      // rotateRad : 0
    };
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var cameras = this.props.cameras || [];
      return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "Cameras",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        },
        __self: this
      }, cameras.map(function (camera, i) {
        return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_containers_Camera__WEBPACK_IMPORTED_MODULE_6__["default"], {
          key: i,
          camera: camera,
          cameraIndex: i,
          standIndex: _this2.props.standIndex,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 19
          },
          __self: this
        });
      }));
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_5___default.a.Component);



/***/ }),

/***/ "./src/components/FocalPoint.js":
/*!**************************************!*\
  !*** ./src/components/FocalPoint.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-draggable */ "./node_modules/react-draggable/dist/react-draggable.js");
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_draggable__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _containers_PopupInfo__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../containers/PopupInfo */ "./src/containers/PopupInfo.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.js");






var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/FocalPoint.js";
 //import Heads from '../containers/Heads'
// import Draggable from 'react-draggable'; 

 // import FocalPoint from '../containers/FocalPoint';





var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {// pos : {x:0, y:0},
      // rotateRad : 0
    }; // this.onMouseDown = this.onMouseDown.bind(this);

    _this.togglePopupInfo = _this.togglePopupInfo.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveStart = _this.handleMoveStart.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveDrag = _this.handleMoveDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveStop = _this.handleMoveStop.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this))); // this.handleRotateStart = this.handleRotateStart.bind(this);
    // this.handleRotateDrag = this.handleRotateDrag.bind(this);
    // this.handleRotateStop = this.handleRotateStop.bind(this);

    _this.canDrag = _this.canDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this))); // this.handleMoveDragEnd = this.handleMoveDragEnd.bind(this);
    // this.handleMoveDragEnter = this.handleMoveDragEnter.bind(this);
    // this.handleMoveDragExit = this.handleMoveDragExit.bind(this);
    // this.handleMoveDragLeave = this.handleMoveDragLeave.bind(this);
    // this.handleMoveDragOver = this.handleMoveDragOver.bind(this);
    // this.handleMoveDragStart = this.handleMoveDragStart.bind(this);
    // Refs

    _this.FocalPointRotateHandle = react__WEBPACK_IMPORTED_MODULE_6___default.a.createRef();
    _this.FocalPointMoveHandle = react__WEBPACK_IMPORTED_MODULE_6___default.a.createRef();
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      Object(_helpers__WEBPACK_IMPORTED_MODULE_10__["noTouchMove"])(this.FocalPointRotateHandle.current);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_10__["noTouchMove"])(this.FocalPointMoveHandle.current);
    } // handleMoveDrag = {this.handleMoveDrag}
    // handleMoveDragEnd = {this.handleMoveDragEnd}
    // handleMoveDragEnter = {this.handleMoveDragEnter}
    // handleMoveDragExit = {this.handleMoveDragExit}
    // handleMoveDragLeave = {this.handleMoveDragLeave}
    // handleMoveDragOver = {this.handleMoveDragOver}
    // handleMoveDragStart = {this.handleMoveDragStart}
    // // If this is clicked in general
    // onMouseDown() {
    //     var FocalPoint = document.getElementsByClassName("FocalPoint");
    //     [...FocalPoints].forEach(FocalPoint => {
    //         FocalPoint.classList.remove("FocalPoint-highest");
    //     });
    // }

  }, {
    key: "togglePopupInfo",
    value: function togglePopupInfo(e) {
      if (!this.props.popupInfo) {
        // The x and y of the Scene
        var _document$getElementB = document.getElementById("Scene").getBoundingClientRect(),
            x = _document$getElementB.x,
            y = _document$getElementB.y;

        var clickPos = {
          x: e.nativeEvent.clientX - x,
          y: e.nativeEvent.clientY - y
        };
        this.props.popupInfoAddNew(clickPos);
      } else {
        this.props.popupInfoRemove();
      }
    }
  }, {
    key: "canDrag",
    value: function canDrag() {
      return this.props.focalPoint.get("type") !== "kinect";
    } // Move

  }, {
    key: "handleMoveStart",
    value: function handleMoveStart(e, a) {
      if (this.canDrag) {
        this.props.focalPointSelect();
      } // console.log("h str", e, a);
      // this.props.focalPointMove(1,a.)

    }
  }, {
    key: "handleMoveDrag",
    value: function handleMoveDrag(e, a) {
      if (this.canDrag) {
        // console.log("h dr", e, a);
        var x = a.x,
            y = a.y;
        var pos = Object(_helpers__WEBPACK_IMPORTED_MODULE_10__["encodePos"])(this.props.menu, {
          x: x,
          y: y
        }); // const pos = encrypt1({ x, y });
        // const pos = { x, y };
        // Convert the values 

        this.props.focalPointMove(pos); // this.setState({ pos });
      }
    }
  }, {
    key: "handleMoveStop",
    value: function handleMoveStop(e, a) {} // // Rotate
    // handleRotateStart(e, a) {
    //     if (this.canDrag) {
    //         this.props.focalPointSelect();
    //     }
    // }
    // handleRotateDrag(e, a) {
    //     const { x, y } = a;
    //     var rad = Math.atan2(y, x); // In radians
    //     var deg = encodeRot(rad * (180 / Math.PI));
    //     // var deg = rad * (180 / Math.PI);
    //     this.props.focalPointRotate(deg);
    // }
    // handleRotateStop(e, a) {
    //     // console.log("hrlt stop", e, a);
    // }

  }, {
    key: "render",
    value: function render() {
      if (typeof window !== 'undefined') {
        window.c__t234 = this;
      }

      var focalPoint = this.props.focalPoint;
      var isActive = focalPoint.get("isActive"); // let pos = {x: 0, y:0};

      var pos = Object(_helpers__WEBPACK_IMPORTED_MODULE_10__["decodePos"])(this.props.menu, focalPoint.get("pos").toJS()); // let pos = decrypt1(focalPoint.get("pos").toJS());
      // let pos = focalPoint.get("pos").toJS();

      pos.x = isNaN(pos.x) || pos.x === "" ? 0 : pos.x;
      pos.y = isNaN(pos.y) || pos.y === "" ? 0 : pos.y;
      var rot = focalPoint.get("rot");
      rot = isNaN(rot) ? 0 : rot;
      rot = Object(_helpers__WEBPACK_IMPORTED_MODULE_10__["decodeRot"])(rot); // flip it so rotation is opposite direction.

      var FocalPointIndex = this.props.menu.get("FocalPointIndex");
      var isSelected = FocalPointIndex === this.props.index;
      var heads = focalPoint.get("heads");
      var cameras = focalPoint.get("cameras"); // const focalPointStyle = {transform:`translate(${focalPoint.pos.x}px, ${focalPoint.pos.y}px)`}
      // console.log('ren');
      // try {
      //     pos = focalPoint.get("pos");
      // } catch(e) {}

      var popupInfo;

      if (this.props.popupInfo) {
        popupInfo = react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "FocalPoint-popupInfo",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 166
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_containers_PopupInfo__WEBPACK_IMPORTED_MODULE_9__["default"], {
          focalPointIndex: this.props.index,
          pos: this.props.popupInfo.get("pos"),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 167
          },
          __self: this
        }));
      }

      var FocalPointRotatesHidden = this.props.menu.get("FocalPointRotatesHidden");
      var FocalPointRotatesOnSelect = this.props.menu.get("FocalPointRotatesOnSelect");
      var FocalPointRotator = !FocalPointRotatesHidden || isSelected && FocalPointRotatesOnSelect;
      var focalPointName = focalPoint.get("name") || "FP".concat(this.props.index); // if (focalPoint.get("name")) {
      //     // console.log('name', focalPoint.get("name"));
      // } else {
      //     // console.log('noname', focalPoint.get("name"), focalPoint.toJS());
      // }

      var styleFocalPointHandle = {};

      if (focalPointName.indexOf("k") === 0) {
        styleFocalPointHandle.backgroundColor = "#8200C8";
      }

      return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("FocalPoint", {
          "FocalPoint--selected": isSelected,
          "FocalPoint--active": isActive
        }),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 190
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_draggable__WEBPACK_IMPORTED_MODULE_7___default.a, {
        disabled: !this.canDrag(),
        handle: ".FocalPoint-move-handle",
        defaultPosition: {
          x: 0,
          y: 0
        } // position={null}
        ,
        position: pos // grid={[25, 25]}
        ,
        onStart: this.handleMoveStart,
        onDrag: this.handleMoveDrag,
        onStop: this.handleMoveStop,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 191
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        style: styleFocalPointHandle,
        className: "FocalPoint-move-handle",
        onClick: this.props.focalPointSelect,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 203
        },
        __self: this
      }, focalPointName)));
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_6___default.a.Component);



/***/ }),

/***/ "./src/components/FocalPoints.js":
/*!***************************************!*\
  !*** ./src/components/FocalPoints.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _containers_FocalPoint__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../containers/FocalPoint */ "./src/containers/FocalPoint.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.js");






var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/FocalPoints.js";


 // import { isKeyed } from 'immutable';



var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {// pos : {x:0, y:0},
      // rotateRad : 0
    };
    _this.initKinect = _this.initKinect.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.kinectEventBodyFrame = _this.kinectEventBodyFrame.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.kinectMoveFocalPoint = _this.kinectMoveFocalPoint.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.convertToXYForScene = _this.convertToXYForScene.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    return _this;
  } // Note we're taking in the post calculated cameraX, cameraY


  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "kinectMoveFocalPoint",
    value: function kinectMoveFocalPoint(_ref) {
      var focalPointIndex = _ref.focalPointIndex,
          x = _ref.x,
          y = _ref.y;
      // console.log("h dr", e, a);
      // const { x, y } = a;
      var pos = {
        x: x,
        y: y // const pos = encodePos(this.props.menu, { x, y });
        // const pos = encrypt1({ x, y });
        // const pos = { x, y };
        // Convert the values 

      };
      this.props.focalPointMoveByIndex(focalPointIndex, pos); // this.setState({ pos });
    }
  }, {
    key: "kinectEventBodyFrame",
    value: function kinectEventBodyFrame(bodyFrame) {
      var _this2 = this;

      var JOINT_NUM = {
        SPINEBASE: 0,
        SPINEMID: 1,
        NECK: 2,
        HEAD: 3,
        SHOULDERLEFT: 4,
        ELBOWLEFT: 5,
        WRISTLEFT: 6,
        HANDLEFT: 7,
        SHOULDERRIGHT: 8,
        ELBOWRIGHT: 9,
        WRISTRIGHT: 10,
        HANDRIGHT: 11,
        HIPLEFT: 12,
        KNEELEFT: 13,
        ANKLELEFT: 14,
        FOOTLEFT: 15,
        HIPRIGHT: 16,
        KNEERIGHT: 17,
        ANKLERIGHT: 18,
        FOOTRIGHT: 19,
        SPINESHOULDER: 20,
        HANDTIPLEFT: 21,
        THUMBLEFT: 22,
        HANDTIPRIGHT: 23,
        THUMBRIGHT: 24
      };
      var headPosDiv = document.getElementById("headPos"); // ctx.clearRect(0, 0, canvas.width, canvas.height);

      var index = 0;
      bodyFrame.bodies.forEach(function (body) {
        if (body.tracked) {
          for (var jointType in body.joints) {
            var joint = body.joints[jointType];

            var _this2$convertToXYFor = _this2.convertToXYForScene(joint),
                x = _this2$convertToXYFor.x,
                y = _this2$convertToXYFor.y;

            if (parseInt(jointType) === JOINT_NUM.HEAD) {
              // ctx.fillStyle = colorsForHead[index];
              headPosDiv.innerHTML = "x: ".concat(joint.cameraX, "<br/>y: ").concat(joint.cameraY, "<br/>z: ").concat(joint.cameraZ);

              _this2.kinectMoveFocalPoint({
                focalPointIndex: index,
                x: x,
                y: y
              });
            } else {} // ctx.fillStyle = colors[index];
            // ctx.fillRect(joint.depthX * 512, joint.depthY * 424, 10, 10);

          } //draw hand states
          // updateHandState(body.leftHandState, body.joints[7]);
          // updateHandState(body.rightHandState, body.joints[11]);


          index++;
        }
      });
    }
  }, {
    key: "initKinect",
    value: function initKinect() {
      window.initKinect({
        socketUrl: 'http://10.0.1.38:8000/',
        events: {
          bodyFrame: this.kinectEventBodyFrame
        }
      });
    }
  }, {
    key: "convertToXYForScene",
    value: function convertToXYForScene(joint) {
      var xMul = -2;
      var yMul = xMul; //1.1;

      var xAdd = 0; //0.5;

      var yAdd = 0.5;
      var xOrigin = 0;
      var yOrigin = 2;
      return {
        x: (joint.cameraX + xAdd) * xMul + xOrigin,
        y: (joint.cameraZ + yAdd) * yMul + yOrigin
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var locatiobnUrl = new URL(document.location.href);

      if (locatiobnUrl.searchParams.get("kinect")) {
        this.initKinect();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var focalPoints = this.props.focalPoints.map(function (focalPoint, i) {
        return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_containers_FocalPoint__WEBPACK_IMPORTED_MODULE_7__["default"], {
          key: i,
          name: "fp".concat(i),
          index: i,
          focalPoint: focalPoint,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 128
          },
          __self: this
        });
      });
      return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "FocalPoints",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 132
        },
        __self: this
      }, focalPoints);
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_6___default.a.Component);



/***/ }),

/***/ "./src/components/GridLines.js":
/*!*************************************!*\
  !*** ./src/components/GridLines.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var throttle_debounce__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! throttle-debounce */ "./node_modules/throttle-debounce/dist/index.esm.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-draggable */ "./node_modules/react-draggable/dist/react-draggable.js");
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_draggable__WEBPACK_IMPORTED_MODULE_9__);






var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/GridLines.js";





var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {
      numTrs: 10,
      numTds: 10,
      additionalColsAbove: 0,
      calculatedGrid: false // initialDragPos: {x: 0, y: 0}

    };
    _this.refGridLines = react__WEBPACK_IMPORTED_MODULE_6___default.a.createRef();
    _this.initialDragPos = {
      x: 0,
      y: 0
    };
    _this.handleScroll = _this.handleScroll.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleOnWheel = _this.handleOnWheel.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this))); // this.handleOnWheel = throttle(60, this.handleOnWheel.bind(this));
    // this.recalcGrid = this.recalcGrid.bind(this);

    _this.recalcGrid = Object(throttle_debounce__WEBPACK_IMPORTED_MODULE_7__["throttle"])(200, _this.recalcGrid.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this))));
    _this.handleMoveStart = _this.handleMoveStart.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this))); // this.handleMoveDrag = this.handleMoveDrag.bind(this);

    _this.handleMoveDrag = Object(throttle_debounce__WEBPACK_IMPORTED_MODULE_7__["throttle"])(60, _this.handleMoveDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)))); // this.recalcGrid = throttle(200, this.recalcGrid.bind(this));

    _this.handleMoveStop = _this.handleMoveStop.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this))); // this.setScale = e => { props.setScale(e.target.value) };
    // this.setTranslateX = e => { props.setTranslateX(e.target.value) };
    // this.setTranslateY = e => { props.setTranslateY(e.target.value) };

    return _this;
  } // Rotate


  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "handleMoveStart",
    value: function handleMoveStart(e, a) {
      e.preventDefault();
      this.initialDragPos = {
        x: a.x,
        y: a.y
      };
    }
  }, {
    key: "handleMoveDrag",
    value: function handleMoveDrag(e, a) {
      e.preventDefault();
      var x = a.x,
          y = a.y;
      var newX = x - this.initialDragPos.x;
      var newY = y - this.initialDragPos.y;
      this.initialDragPos.x = x;
      this.initialDragPos.y = y; // this.props.setTranslateX(this.props.menu, deltaX);

      this.props.setTranslateX(parseFloat(this.props.menu.getIn(["translate", "x"])) + newX);
      this.props.setTranslateY(parseFloat(this.props.menu.getIn(["translate", "y"])) + newY); // this.props.setTranslateX(parseFloat(newX));
      // this.props.setTranslateY(parseFloat(newY));
      // var rad = Math.atan2(y, x); // In radians
      // // Then you can convert it to degrees as easy as:
      // var deg = rad * (180 / Math.PI);
      // const standRot = decodeRot(this.props.stand.get("rot"));
      // // const standRot = this.props.stand.get("rot");
      // this.props.headRotate(encodeRot(deg - standRot));
      // // this.props.headRotate(deg - standRot);
    }
  }, {
    key: "handleMoveStop",
    value: function handleMoveStop(e, a) {
      e.preventDefault(); // this.props.headRotateStop();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('scroll', this.handleScroll);
      this.refGridLines.current.addEventListener("wheel", this.handleOnWheel, {
        passive: false
      }); // window.addEventListener("wheel", this.handleOnWheel, { passive: false });

      this.recalcGrid();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      try {
        if (this.props.menu.getIn(["translate", "x"]) !== prevProps.menu.getIn(["translate", "x"]) || this.props.menu.getIn(["translate", "y"]) !== prevProps.menu.getIn(["translate", "y"]) || this.props.menu.getIn(["scale"]) !== prevProps.menu.getIn(["scale"])) {
          this.recalcGrid();
        }
      } catch (e) {}
    } // NOTE this is throttled

  }, {
    key: "recalcGrid",
    value: function recalcGrid() {
      // Menu Specified translate and scale
      var translateX = parseFloat(this.props.menu.getIn(["translate", "x"]));
      var translateY = parseFloat(this.props.menu.getIn(["translate", "y"]));
      var scale = parseFloat(this.props.menu.get("scale"));
      var additionalColsAbove = Math.ceil(translateY / scale) + 1; // Always add an extra 1 (just for smoother scrolls)
      // const additionalColsBelow = 5; //Math.ceil(translateY / scale) + 1; // Always add an extra 1 (just for smoother scrolls)

      this.setState({
        additionalColsAbove: additionalColsAbove
      }); // // cell dimensions: cw = cell width; ch = cell height
      // const cw = 100;
      // const ch = cw;
      // // Generic dimensions
      // const height = 1000;
      // const width = height;
      // const left = width / -2;
      // const top = 0;
      // // Grid transformations
      // const gridTranslateX = translateX;
      // const gridTranslateY = translateY;
      // const gridScale = scale / 100;
      // const gridHeight = 1000;
      // const gridWidth = height;
      // const gridLeft = width / -2;
      // const gridTop = 0;
      // // Table rows / columns
      // this.setState({
      //     translateX: gridTranslateX,
      //     translateY: gridTranslateY,
      //     scale: gridScale,
      //     height : gridHeight,
      //     width: gridWidth,
      //     top: gridTop,
      //     left: gridLeft,
      //     numTrs,
      //     numTds,
      //     calculatedGrid : true
      // });
    }
  }, {
    key: "handleScroll",
    value: function handleScroll(e) {
      // e.preventdefault();
      // console.log(e);
      // console.log(e.metaKey);
      this.recalcGrid(); // console.log('s');
      // newFn();
      // let scrollTop = event.srcElement.body.scrollTop;
      // let itemTranslate = Math.min(0, scrollTop/3 - 60);
      // this.setState({
      //   transform: itemTranslate
      // });
    }
  }, {
    key: "handleOnWheel",
    value: function handleOnWheel(e) {
      // // If the "Command" keyt is pressed
      if (e.metaKey) {
        e.stopPropagation();
        e.preventDefault();
        this.props.setScale(parseFloat(this.props.menu.getIn(["scale"])) - e.deltaY / 2);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var winH = window.innerHeight;
      var winW = window.innerWidth;
      var translateX = parseFloat(this.props.menu.getIn(["translate", "x"]));
      var translateY = parseFloat(this.props.menu.getIn(["translate", "y"]));
      var scale = parseFloat(this.props.menu.get("scale")); // const scale = parseFloat(this.props.menu.get("scale"));
      // const scale = parseFloat(this.props.menu.get("scale"));
      // default cell dimension (height &  width)

      var defaultCellDim;

      if (scale <= 10) {
        defaultCellDim = 1000;
      } else if (scale <= 16) {
        defaultCellDim = 500;
      } else {
        // This is the default value;
        defaultCellDim = 100;
      }

      if (scale < 10) {
        scale = 10;
      }

      var extraRows = 1;
      var numTrs = Math.ceil(winH / scale) + extraRows; // Always add an additional one

      var numTds = Math.ceil(winW / scale); // Ensure the num Tds is an odd number.

      if (numTds % 2 === 1) {
        numTds++;
      }

      var gridTranslateX = translateX;
      var gridTranslateY = translateY + this.state.additionalColsAbove * scale * -1;
      var gridScale = scale / 100; // const gridHeight = 1000;
      // const gridWidth = 1000;//numTds * scale;
      // const gridLeft = gridWidth / -2;
      // const gridTop = 0;

      var gridHeight = numTrs * defaultCellDim;
      var gridWidth = numTds * defaultCellDim;
      var gridLeft = gridWidth / -2;
      var gridTop = 0;
      var grid = {
        height: gridHeight,
        width: gridWidth,
        top: gridTop,
        left: gridLeft,
        translateX: gridTranslateX,
        translateY: gridTranslateY,
        scale: gridScale
      };
      var cells = Array.apply(null, Array(numTrs)).map(function (v, i) {
        return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("tr", {
          key: i,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 241
          },
          __self: this
        }, Array.apply(null, Array(numTds)).map(function (val2, j) {
          return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("td", {
            className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
              "GridLines-td--thickRight": j === numTds / 2 - 1,
              "GridLines-td--thickBottom": i === _this2.state.additionalColsAbove + extraRows - 2
            }),
            key: j,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 243
            },
            __self: this
          });
        }));
      });
      var styleGridLines = {
        height: "".concat(grid.height, "px"),
        width: "".concat(grid.width, "px"),
        top: "".concat(grid.top, "px"),
        left: "".concat(grid.left, "px"),
        transform: "translate(".concat(grid.translateX, "px, ").concat(grid.translateY, "px) scale(").concat(grid.scale, ")")
      };
      return (// <div onWheel={this.handleOnWheel}>
        react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 262
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_draggable__WEBPACK_IMPORTED_MODULE_9__["DraggableCore"] // allowAnyClick= boolean,
        // cancel= string,
        // disabled= boolean,
        // enableUserSelectHack= boolean,
        // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
        // grid= [number, number],
        , {
          handle: ".GridLines-table",
          onStart: this.handleMoveStart,
          onDrag: this.handleMoveDrag,
          onStop: this.handleMoveStop // onMouseDown= (e= MouseEvent) => void
          ,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 263
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          ref: this.refGridLines,
          className: "GridLines",
          style: styleGridLines,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 276
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("table", {
          className: "GridLines-table",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 277
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("tbody", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 278
          },
          __self: this
        }, cells)))))
      ); // return (
      //     <div className="GridLines" style={{position: "absolute"}}>
      //         <div style={{position: "absolute"}}>{displayedLines}</div>
      //     </div>
      // )
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_6___default.a.Component); // import React from 'react'
// import MotionLine from '../containers/MotionLine';
// export default class Menu extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//         };
//     }
//     render() {
//         // let linesJS; 
//         let displayedLines = [];
//         try {
//             // linesJS = this.props.motionLines.get("lines").toList().toJS();
//             // // console.log('linesJS', linesJS);
//             // if (linesJS.length >= 2) {
//             //     window.c_ljs = {linesJS, mls : this.props.motionLines};
//             // }
//             this.props.motionLines.get("lines").forEach((line, id) => { 
//                 const lineJS = line.toJS();
//                 displayedLines.push(<MotionLine key={id} coords={lineJS.coords} shape={lineJS.shape}/>)
//             })
//             // this.props.motionLines.get("lines").toJS().forEach((line, id) => {
//             //     displayedLines.push(<MotionLine key={id} coords={line.coords} shape={line.shape}/>)
//             // });
//             console.log(displayedLines);
//             // displayedLines = linesJS.map((line, i) => <MotionLine key={i} coords={line.coords} shape={line.shape}/>);
//             // showVals = linesJS.map((line, i) => <div key={i}>key={i} coords={line.coords.join(',')} shape={line.shape}</div>);
//             // shape = {this.props.shape}<br/>
//             //         coords = {this.props.coords.map(coord => <span>{coord},</span>)}<br/>
//             //         pos: {pos0.x}, {pos0.y} - {pos1.x}, {pos1.y}
//             // motionLines = this.props.motionLines.get("lines").toList().toJS().map((line, id) => {
//             //     return <div key={id}>{line.get("coords")}</div>
//             // }).toJS();
//         } catch(e) {
//             console.log('Error', e);
//         }
//         return (
//             <div className="GridLines" style={{position: "absolute"}}>
//                 <div style={{position: "absolute"}}>{displayedLines}</div>
//             </div>
//         )
//         // return (
//         //     <div className="GridLines" style={{position: "absolute"}}>
//         //         Motion lines: 
//         //         <div style={{position: "absolute"}}>{displayedLines}</div>
//         //         <div style={{position: "absolute"}}>{showVals}</div>
//         //     </div>
//         // )
//     }
// }




/***/ }),

/***/ "./src/components/Head.js":
/*!********************************!*\
  !*** ./src/components/Head.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-draggable */ "./node_modules/react-draggable/dist/react-draggable.js");
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_draggable__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.js");






var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/Head.js";
 //import Heads from '../containers/Heads'
// import Draggable from 'react-draggable'; 

 // import Draggable, {DraggableCore} from 'react-draggable'; 
// import Stand from '../containers/Stand';




var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {// pos : {x:0, y:0},
      // rotateRad : 0
    };
    _this.handleRotateStart = _this.handleRotateStart.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateDrag = _this.handleRotateDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateStop = _this.handleRotateStop.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this))); // Refs

    _this.refHeadRotateHandle = react__WEBPACK_IMPORTED_MODULE_6___default.a.createRef();
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["noTouchMove"])(this.refHeadRotateHandle.current);
    }
    /*
        // Move
        handleMoveStart(e,a) {
            // console.log("h str", e, a);
            // this.props.standMove(1,a.)
        }
    
        handleMoveDrag(e,a) {
            // console.log("h dr", e, a);
            const {x,y} = a;
            const pos = {x,y};
            this.props.standMove(pos);
            // this.setState({ pos });
        }
    
        handleMoveStop(e,a) {
            // console.log("h stop", e, a);
        }
    */
    // Rotate

  }, {
    key: "handleRotateStart",
    value: function handleRotateStart(e, a) {
      e.preventDefault();
      this.props.headRotateStart();
    }
  }, {
    key: "handleRotateDrag",
    value: function handleRotateDrag(e, a) {
      e.preventDefault();
      var x = a.x,
          y = a.y;
      var rad = Math.atan2(y, x); // In radians
      // Then you can convert it to degrees as easy as:

      var deg = rad * (180 / Math.PI);
      var standRot = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["decodeRot"])(this.props.stand.get("rot")); // const standRot = this.props.stand.get("rot");

      this.props.headRotate(Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["encodeRot"])(deg - standRot)); // this.props.headRotate(deg - standRot);
    }
  }, {
    key: "handleRotateStop",
    value: function handleRotateStop(e, a) {
      e.preventDefault();
      this.props.headRotateStop();
    }
  }, {
    key: "render",
    value: function render() {
      var head = this.props.head; // let pos = stand.get("pos").toJS();
      // pos.x = isNaN(pos.x) ? 0 : pos.x;
      // pos.y = isNaN(pos.y) ? 0 : pos.y;

      var rot = head.get("rot");
      rot = isNaN(rot) ? 0 : rot;
      rot = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["decodeRot"])(rot);
      var vRot = head.get("vRot");
      vRot = isNaN(vRot) ? 0 : vRot;
      vRot = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["decodeRot"])(vRot);
      var selectedStandIndex = this.props.menu.get("selectedStandIndex");
      var selectedHeadIndex = this.props.menu.get("selectedHeadIndex");
      var isSelected = selectedStandIndex === this.props.standIndex && selectedHeadIndex === this.props.headIndex;
      var isHeadRotatesHidden = this.props.menu.get("isHeadRotatesHidden");
      var isForceShowHeadRotatesOnSelect = this.props.menu.get("isForceShowHeadRotatesOnSelect");
      var isShowHeadRotator = !isHeadRotatesHidden || isSelected && isForceShowHeadRotatesOnSelect;
      return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("Head noselect", {
          "Head--selected": isSelected
        }),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 101
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Head-rotateContainer",
        style: {
          transform: "rotate(".concat(rot, "deg)")
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 102
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Head-container",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 103
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("img", {
        alt: "head",
        className: "Head-img",
        src: "./media/head-arrow.png",
        draggable: "false",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 104
        },
        __self: this
      }))), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Head-rotateContainer",
        style: {
          transform: "rotate(".concat(vRot, "deg)")
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 107
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Head-container",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 108
        },
        __self: this
      }, !isShowHeadRotator ? null : react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Head-rotate noselect",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 112
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_draggable__WEBPACK_IMPORTED_MODULE_7__["DraggableCore"] // allowAnyClick= boolean,
      // cancel= string,
      // disabled= boolean,
      // enableUserSelectHack= boolean,
      // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
      // grid= [number, number],
      , {
        handle: ".Head-rotate-handle",
        onStart: this.handleRotateStart,
        onDrag: this.handleRotateDrag,
        onStop: this.handleRotateStop // onMouseDown= (e= MouseEvent) => void
        ,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 114
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        ref: this.refHeadRotateHandle,
        className: "Head-rotate-handle",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 127
        },
        __self: this
      }))))));
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_6___default.a.Component);



/***/ }),

/***/ "./src/components/Heads.js":
/*!*********************************!*\
  !*** ./src/components/Heads.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _containers_Head__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../containers/Head */ "./src/containers/Head.js");





var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/Heads.js";



var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {// pos : {x:0, y:0},
      // rotateRad : 0
    };
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var heads = this.props.heads;
      return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "Heads",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        },
        __self: this
      }, heads.map(function (head, i) {
        return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_containers_Head__WEBPACK_IMPORTED_MODULE_6__["default"], {
          key: i,
          head: head,
          headIndex: i,
          standIndex: _this2.props.standIndex,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 19
          },
          __self: this
        });
      }));
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_5___default.a.Component);



/***/ }),

/***/ "./src/components/Kinect.js":
/*!**********************************!*\
  !*** ./src/components/Kinect.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Kinect; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-draggable */ "./node_modules/react-draggable/dist/react-draggable.js");
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_draggable__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_9__);






var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/Kinect.js";
 //import Kinects from '../containers/Kinects'
// import Draggable from 'react-draggable'; 

 // import Draggable, {DraggableCore} from 'react-draggable'; 
// import Stand from '../containers/Stand';





var Kinect =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Kinect, _React$Component);

  function Kinect(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Kinect);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Kinect).call(this, props));
    _this.state = {
      moveRelativeStartPos: {
        x: 0,
        y: 0
      } // pos : {x:0, y:0},
      // rotateRad : 0

    };
    _this.handleMoveStart = _this.handleMoveStart.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveDrag = _this.handleMoveDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveStop = _this.handleMoveStop.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateStart = _this.handleRotateStart.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateDrag = _this.handleRotateDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateStop = _this.handleRotateStop.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this))); // Refs

    _this.refKinectRotateHandle = react__WEBPACK_IMPORTED_MODULE_6___default.a.createRef();
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Kinect, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["noTouchMove"])(this.refKinectRotateHandle.current);
    } // Move

  }, {
    key: "handleMoveStart",
    value: function handleMoveStart(e, a) {
      var curPos = this.getCurrentPos();
      var x = a.x,
          y = a.y;
      var pos = {
        x: x - curPos.x,
        y: y - curPos.y
      };
      this.setState({
        moveRelativeStartPos: pos
      });
      this.props.selectKinect();
    }
  }, {
    key: "handleMoveDrag",
    value: function handleMoveDrag(e, a) {
      var x = a.x,
          y = a.y;
      var pos = {
        x: x,
        y: y
      }; //: x - origin.x, y: y - origin.y };

      var rot = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["decodeRot"])(this.props.stand.get("rot"));
      var newPos = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["encodePosRelativeStand"])(this.props.menu, Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["rotateVector"])(pos, rot)); //, origin);

      this.props.kinectMove(newPos);
    }
  }, {
    key: "handleMoveStop",
    value: function handleMoveStop(e, a) {} // this.props.kinectMove(pos);
    // console.log("h stop", e, a);
    // Rotate

  }, {
    key: "handleRotateStart",
    value: function handleRotateStart(e, a) {
      this.props.selectKinect(); // console.log("hrot str", e, a);
    }
  }, {
    key: "handleRotateDrag",
    value: function handleRotateDrag(e, a) {
      var x = a.x,
          y = a.y;
      var rad = Math.atan2(y, x); // In radians
      // Then you can convert it to degrees as easy as:

      var deg = rad * (180 / Math.PI);
      var standRot = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["decodeRot"])(this.props.stand.get("rot"));
      this.props.kinectRotate(Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["encodeRot"])(deg - standRot));
    }
  }, {
    key: "handleRotateStop",
    value: function handleRotateStop(e, a) {// console.log("hrlt stop", e, a);
    }
  }, {
    key: "getCurrentPos",
    value: function getCurrentPos() {
      try {
        var pos = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["decodePosRelativeStand"])(this.props.kinect.get("pos").toJS());
        pos.x = isNaN(pos.x) ? 0 : pos.x;
        pos.y = isNaN(pos.y) ? 0 : pos.y;
        return pos;
      } catch (e) {
        console.log("error in getCurrentPos", e);
        return {
          x: 0,
          y: 0
        };
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var kinect = this.props.kinect;

      if (kinect && kinect.get) {
        var pos = this.getCurrentPos();
        var rot = kinect.get("rot");
        rot = isNaN(rot) ? 0 : rot;
        rot = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["decodeRot"])(rot);
        var selectedStandIndex = this.props.menu.get("selectedStandIndex");
        var selectedKinectIndex = this.props.menu.get("selectedKinectIndex");
        var isSelected = selectedStandIndex === this.props.standIndex && selectedKinectIndex === this.props.kinectIndex;
        var fov = kinect.get("fov");
        var fovLength = 1000; //1900;

        var fovHeight = 0;

        if (0 < fov && fov < 180) {
          var rad = fov / 2 * Math.PI / 180;
          fovHeight = fovLength * Math.tan(rad);
        }

        var topAdjust = 12; // This is related to the height of half the kinect.

        var fovStyle = {
          width: 0,
          height: 0,
          borderTop: "".concat(fovHeight, "px solid transparent"),
          borderRight: "".concat(fovLength, "px solid rgba(130,0,200,0.1)"),
          borderBottom: "".concat(fovHeight, "px solid transparent"),
          position: "absolute",
          top: "-".concat(fovHeight - topAdjust, "px"),
          // left: "12px",
          left: 0,
          zIndex: 2,
          marginTop: 3,
          pointerEvents: "none" // https://stackoverflow.com/questions/3680429/click-through-a-div-to-underlying-elements

        };
        var isKinectRotatesHidden = this.props.menu.get("isKinectRotatesHidden");
        var isForceShowKinectRotatesOnSelect = this.props.menu.get("isForceShowKinectRotatesOnSelect");
        var isShowKinectRotator = !isKinectRotatesHidden || isSelected && isForceShowKinectRotatesOnSelect;
        var kinectName = kinect.get("name");
        var kinectFocalPoints;
        var kinectFocalPointsForThisKinect;
        if (kinectName == "kinect-01") window.c_kfp = this;

        if (this.props.kinectFocalPoints && this.props.kinectFocalPoints.get) {
          kinectFocalPointsForThisKinect = this.props.kinectFocalPoints.get(kinectName);

          if (kinectFocalPointsForThisKinect && kinectFocalPointsForThisKinect.size > 0) {
            window.c_klfp2 = kinectFocalPointsForThisKinect;
            kinectFocalPoints = kinectFocalPointsForThisKinect.toJS().map(function (kfp, i) {
              var encPos = Object(_helpers__WEBPACK_IMPORTED_MODULE_8__["encodePosForKinectFocusPoint"])({
                x: kfp.z,
                y: kfp.x * -1
              });
              window.c_tra = {
                encPos: encPos
              };
              var styleKinectFocalPoint = {
                transform: "translate(".concat(encPos.x, "px, ").concat(encPos.y, "px)") // y: encodePosScale(this.props.menu, kfp.z)
                // window.c_kk2 = {kfp, enc;

              };
              return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
                key: i,
                style: styleKinectFocalPoint,
                className: "KinectFocalPoint bil KinectFocalPoint-".concat(_this2.props.kinectIndex),
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 160
                },
                __self: this
              }, "K", kfp.bodyIndex); // return <div key={i} class={`KinectFocalPoint KinectFocalPoint-${kinectName}` }>K{kfp.bodyIndex}</div>
            });
          }
        }

        return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: classnames__WEBPACK_IMPORTED_MODULE_9___default()("Kinect", {
            "Kinect--selected": isSelected
          }),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 167
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_draggable__WEBPACK_IMPORTED_MODULE_7__["DraggableCore"] // allowAnyClick= boolean,
        // cancel= string,
        // disabled= boolean,
        // enableUserSelectHack= boolean,
        // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
        // grid= [number, number],
        , {
          handle: ".Kinect-camImg",
          onStart: this.handleMoveStart,
          onDrag: this.handleMoveDrag,
          onStop: this.handleMoveStop // onMouseDown= (e= MouseEvent) => void
          ,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 168
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "Kinect-container",
          style: {
            transform: "translate(".concat(pos.x, "px, ").concat(pos.y, "px)")
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 181
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "Kinect-rotateContainer",
          style: {
            transform: "rotate(".concat(rot, "deg)")
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 182
          },
          __self: this
        }, !isShowKinectRotator ? null : react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "Kinect-rotate noselect",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 185
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_draggable__WEBPACK_IMPORTED_MODULE_7__["DraggableCore"] // allowAnyClick= boolean,
        // cancel= string,
        // disabled= boolean,
        // enableUserSelectHack= boolean,
        // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
        // grid= [number, number],
        , {
          handle: ".Kinect-rotate-handle",
          onStart: this.handleRotateStart,
          onDrag: this.handleRotateDrag,
          onStop: this.handleRotateStop // onMouseDown= (e= MouseEvent) => void
          ,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 187
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          ref: this.refKinectRotateHandle,
          className: "Kinect-rotate-handle",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 200
          },
          __self: this
        }))), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "Kinect-camImg",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 205
          },
          __self: this
        }), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "Kinect-fov",
          style: fovStyle,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 207
          },
          __self: this
        }), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "Kinect-focalPoints KinectFocalPoints",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 212
          },
          __self: this
        }, kinectFocalPoints)))));
      } else {
        window.c_whynokin = this;
        return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "NoKinect",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 222
          },
          __self: this
        });
      }
    }
  }]);

  return Kinect;
}(react__WEBPACK_IMPORTED_MODULE_6___default.a.Component);



/***/ }),

/***/ "./src/components/Kinects.js":
/*!***********************************!*\
  !*** ./src/components/Kinects.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _containers_Kinect__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../containers/Kinect */ "./src/containers/Kinect.js");





var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/Kinects.js";



var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {// pos : {x:0, y:0},
      // rotateRad : 0
    };
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var kinects = this.props.kinects;

      if (!kinects || kinects.size === 0) {
        if (typeof window !== 'undefined') {
          window.c__kinectno = kinects;
        }

        return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
          className: "Kinects Kinects--none",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 21
          },
          __self: this
        });
      } else {
        if (typeof window !== 'undefined') {
          window.c__kinectyes = kinects;
        }

        return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
          className: "Kinects",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 26
          },
          __self: this
        }, kinects.map(function (kinect, i) {
          return kinect ? react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_containers_Kinect__WEBPACK_IMPORTED_MODULE_6__["default"], {
            key: i,
            kinect: kinect,
            kinectIndex: i,
            standIndex: _this2.props.standIndex,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 27
            },
            __self: this
          }) : null;
        }));
      }
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_5___default.a.Component);



/***/ }),

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
      }, "Websocket Url:"), react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement("span", {
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



/***/ }),

/***/ "./src/components/MotionLine.js":
/*!**************************************!*\
  !*** ./src/components/MotionLine.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.js");





var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/MotionLine.js";


 // import {encodeRot, decodeRot, encodePos, decodePos} from '../helpers';

var lineStyle = function lineStyle(x1, y1, x2, y2, startFade) {
  var distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  var xMid = (x1 + x2) / 2;
  var yMid = (y1 + y2) / 2;
  var slopInRad = Math.atan2(y1 - y2, x1 - x2); // const salopeInDegrees = (slopInRad * 180) / Math.PI;

  var style = {
    position: "absolute",
    width: distance,
    marginLeft: distance / -2,
    left: xMid,
    top: yMid,
    transform: "rotate(".concat(slopInRad, "rad)"),
    border: "1.5px solid #f224f5" // opacity: startFade ? 0.9 : 1

  };
  return style;
};

var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {
      startFade: false
    };
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        startFade: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      window.c_ML1 = {
        thi: this,
        menu: this.props.menu,
        decodePos: _helpers__WEBPACK_IMPORTED_MODULE_7__["decodePos"]
      };
      var pos0 = Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["decodePos"])(this.props.menu, {
        x: this.props.coords[0],
        y: this.props.coords[1]
      });
      var pos1 = Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["decodePos"])(this.props.menu, {
        x: this.props.coords[2],
        y: this.props.coords[3]
      }); // let delta = {x : pos1.x - pos0.x, y: pos1.y - pos0.y};

      var style = lineStyle(pos0.x, pos0.y, pos1.x, pos1.y, this.state.startFade); // return (
      //     <div className="MotionLine" >
      //         <div style={style}>
      //             shape = {this.props.shape}<br/>
      //             pos: ({pos0.x}, {pos0.y}) -> {pos1.x}, {pos1.y}
      //         </div>
      //     </div>
      // )

      return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_6___default()("MotionLine", {
          fadeOut: this.state.startFade
        }),
        style: style,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 63
        },
        __self: this
      }); // return (
      //     <div className="MotionLine" style={{position: "absolute"}}>
      //         shape = {this.props.shape}<br/>
      //         coords = {this.props.coords.map(coord => <span>{coord},</span>)}<br/>
      //         pos: {pos0.x}, {pos0.y} - {pos1.x}, {pos1.y}
      //         <Line x1={pos0.x} y1={pos0.y} x2={pos1.x} y2={pos1.y}/>
      //     </div>
      // )
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_5___default.a.Component);



/***/ }),

/***/ "./src/components/MotionLines.js":
/*!***************************************!*\
  !*** ./src/components/MotionLines.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _containers_MotionLine__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../containers/MotionLine */ "./src/containers/MotionLine.js");





var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/MotionLines.js";



var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {};
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "render",
    value: function render() {
      // let linesJS; 
      var displayedLines = [];

      try {
        // linesJS = this.props.motionLines.get("lines").toList().toJS();
        // // console.log('linesJS', linesJS);
        // if (linesJS.length >= 2) {
        //     window.c_ljs = {linesJS, mls : this.props.motionLines};
        // }
        this.props.motionLines.get("lines").forEach(function (line, id) {
          var lineJS = line.toJS();
          displayedLines.push(react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_containers_MotionLine__WEBPACK_IMPORTED_MODULE_6__["default"], {
            key: id,
            coords: lineJS.coords,
            shape: lineJS.shape,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 26
            },
            __self: this
          }));
        }); // this.props.motionLines.get("lines").toJS().forEach((line, id) => {
        //     displayedLines.push(<MotionLine key={id} coords={line.coords} shape={line.shape}/>)
        // });
        // console.log(displayedLines);
        // displayedLines = linesJS.map((line, i) => <MotionLine key={i} coords={line.coords} shape={line.shape}/>);
        // showVals = linesJS.map((line, i) => <div key={i}>key={i} coords={line.coords.join(',')} shape={line.shape}</div>);
        // shape = {this.props.shape}<br/>
        //         coords = {this.props.coords.map(coord => <span>{coord},</span>)}<br/>
        //         pos: {pos0.x}, {pos0.y} - {pos1.x}, {pos1.y}
        // motionLines = this.props.motionLines.get("lines").toList().toJS().map((line, id) => {
        //     return <div key={id}>{line.get("coords")}</div>
        // }).toJS();
      } catch (e) {
        console.log('Error', e);
      }

      return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "MotionLines",
        style: {
          position: "absolute"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 55
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        style: {
          position: "absolute"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 56
        },
        __self: this
      }, displayedLines)); // return (
      //     <div className="MotionLines" style={{position: "absolute"}}>
      //         Motion lines: 
      //         <div style={{position: "absolute"}}>{displayedLines}</div>
      //         <div style={{position: "absolute"}}>{showVals}</div>
      //     </div>
      // )
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_5___default.a.Component);



/***/ }),

/***/ "./src/components/PopupInfo.js":
/*!*************************************!*\
  !*** ./src/components/PopupInfo.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Popup; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_8__);






var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/PopupInfo.js";
 //import Cameras from '../containers/Cameras'
// import Draggable from 'react-draggable';
// // -> Needed? import { DraggableCore } from 'react-draggable';
// import Draggable, {DraggableCore} from 'react-draggable';
// import Stand from '../containers/Stand';

 // import cn from "classnames";


 // import {encodeRot, decodeRot, encodePosScale, decodePosScale} from '../helpers';

window.c_a = axios__WEBPACK_IMPORTED_MODULE_8___default.a;

var Popup =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Popup, _React$Component);

  function Popup(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Popup);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Popup).call(this, props));
    _this.state = {// moveRelativeStartPos: { x: 0, y: 0 },
      // pos : {x:0, y:0},
      // rotateRad : 0
    };
    _this.handleMoveStart = _this.handleMoveStart.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveDrag = _this.handleMoveDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveStop = _this.handleMoveStop.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.closePopupInfo = _this.closePopupInfo.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.makeRequest = _this.makeRequest.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.getEndpoints = _this.getEndpoints.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.popupEndpoints = [{
      categoryName: "Head",
      endpoints: [{
        label: "Find Zero",
        port: 8080,
        route: "/find_zero"
      }]
    }, {
      categoryName: "Leds",
      endpoints: [{
        label: "Rainbow",
        port: 8082,
        route: "/run/rainbow"
      }, {
        label: "Lowred",
        port: 8082,
        route: "/run/lowred"
      }, {
        label: "Bounce",
        port: 8082,
        route: "/run/bounce"
      }, {
        label: "Off",
        port: 8082,
        route: "/run/off"
      }]
    }, {
      categoryName: "Host",
      endpoints: [{
        label: "Restart",
        port: 80,
        route: "/restart-host"
      }, {
        label: "Shutdown-host",
        port: 80,
        route: "/shutdown-host?pw=1199"
      }]
    }]; // this.handleRotateStart = this.handleRotateStart.bind(this);
    // this.handleRotateDrag = this.handleRotateDrag.bind(this);
    // this.handleRotateStop = this.handleRotateStop.bind(this);

    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Popup, [{
    key: "makeRequest",
    value: function makeRequest(url) {
      window.c_ww = this;
      axios__WEBPACK_IMPORTED_MODULE_8___default.a.get(url).then(function (data) {
        console.log("Done ".concat(url, " "), JSON.stringify(data));
      }).catch(function (err) {
        console.log("Err with request: ".concat(err));
        alert("Err with request: ".concat(err));
      });
    }
  }, {
    key: "getEndpoints",
    value: function getEndpoints() {
      var _this2 = this;

      var getRequestButton = function getRequestButton(_ref) {
        var label = _ref.label,
            port = _ref.port,
            route = _ref.route;
        console.log({
          label: label,
          port: port,
          route: route
        });
        var getUrl = "http://".concat(_this2.props.headName, ".head.service.consul:").concat(port).concat(route);
        return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("button", {
          style: {
            marginRight: 15
          },
          onClick: _this2.makeRequest.bind(_this2, getUrl),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 111
          },
          __self: this
        }, label);
      };

      return this.popupEndpoints.map(function (_ref2) {
        var categoryName = _ref2.categoryName,
            endpoints = _ref2.endpoints;
        // const { categoryName, endpoints } = endpointCategory;
        return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_6___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("p", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 125
          },
          __self: this
        }, categoryName, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("br", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 127
          },
          __self: this
        }), endpoints.map(function (_ref3) {
          var label = _ref3.label,
              port = _ref3.port,
              route = _ref3.route;
          // const {label, port, route} = endpoint
          return getRequestButton({
            label: label,
            port: port,
            route: route
          });
        })));
      });
    }
  }, {
    key: "closePopupInfo",
    value: function closePopupInfo() {
      this.props.popupInfoRemove();
    } // Move

  }, {
    key: "handleMoveStart",
    value: function handleMoveStart(e, a) {
      var curPos = this.getCurrentPos();
      var x = a.x,
          y = a.y;
      var pos = {
        x: x - curPos.x,
        y: y - curPos.y
      };
      this.setState({
        moveRelativeStartPos: pos
      }); // this.props.selectCamera();
    }
  }, {
    key: "handleMoveDrag",
    value: function handleMoveDrag(e, a) {
      var x = a.x,
          y = a.y; // const origin = this.state.moveRelativeStartPos;
      // const pos = { x: x - origin.x, y: y - origin.y };

      var pos = {
        x: x,
        y: y
      }; //: x - origin.x, y: y - origin.y };
      // const pos = { x, y }; //: x - origin.x, y: y - origin.y };

      var rot = Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["decodeRot"])(this.props.stand.get("rot"));
      var newPos = Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["encodePosScale"])(this.props.menu, Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["rotateVector"])(pos, rot)); //, origin);

      this.props.popupInfoMove(newPos);
    }
  }, {
    key: "handleMoveStop",
    value: function handleMoveStop(e, a) {} // this.props.cameraMove(pos);
    // console.log("h stop", e, a);
    // // Rotate
    // handleRotateStart(e, a) {
    //     this.props.selectCamera();
    //     // console.log("hrot str", e, a);
    // }
    // handleRotateDrag(e, a) {
    //     const { x, y } = a;
    //     var rad = Math.atan2(y, x); // In radians
    //     // Then you can convert it to degrees as easy as:
    //     var deg = rad * (180 / Math.PI);
    //     const standRot = decodeRot(this.props.stand.get("rot"));
    //     this.props.cameraRotate(encodeRot(deg - standRot));
    // }
    // handleRotateStop(e, a) {
    //     // console.log("hrlt stop", e, a);
    // }

  }, {
    key: "getCurrentPos",
    value: function getCurrentPos() {
      // let pos = this.props.get("pos").toJS();
      var pos = this.props.popupInfo.get("pos").toJS();
      pos.x = isNaN(pos.x) ? 0 : pos.x;
      pos.y = isNaN(pos.y) ? 0 : pos.y;
      return Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["decodePosScale"])(this.props.menu, pos); // return pos;
    }
  }, {
    key: "render",
    value: function render() {
      // let pos = this.getCurrentPos();
      var rootVal = "http://consul-fe.service.consul"; // if (typeof window !== 'undefined') {
      //     rootVal = typeof location !== "undefined" && location.host === "127.0.0.1:8081" ? document.location.hostname : "http://consul-fe.service.consul";
      // } else {

      if (typeof window !== "undefined" && document && document.location && document.location.hostname) {
        rootVal = document.location.hostname === "127.0.0.1" ? document.location.hostname : "http://consul-fe.service.consul";
      } // }


      var consulInstallationUrl = "".concat(rootVal, ":8500/ui/dc1/kv/the-heads/"); // installation

      if (typeof window !== "undefined") {
        window.c__t23 = this;
      }

      var standName = this.props.stand.get("name"); // // const heads = this.props.stand.getIn(["heads"]);
      // // const headRefName = heads ? heads.keySeq().first() : "";
      // const headName = "asd";//this.props.stand.getIn(["heads", 0, headRefName]);
      // // const cameras = this.props.stand.getIn(["cameras"]);
      // // const cameraRefName = cameras ? cameras.keySeq().first() : "";
      // // // const cameraName = this.props.stand.getIn(["cameras"]).keySeq().first();
      // const cameraName = "ds"; //this.props.stand.getIn(["cameras", 0, cameraRefName]);
      // // // const kinectName = this.props.stand.getIn(["kinects", 0, "name"]);
      // // const kinects = this.props.stand.getIn(["kinects"]);
      // // const kinectRefName = kinects ? kinects : kinects.keySeq().first();
      // const kinectName = "dfa"; //this.props.stand.getIn(["kinects", 0, kinectRefName]);

      var heads = this.props.stand.getIn(["heads"]);
      var headRefName = heads && heads.keySeq ? heads.keySeq().first() : "";
      var headName = this.props.stand.getIn(["heads", 0, headRefName]);
      var cameras = this.props.stand.getIn(["cameras"]); // const cameraRefName = cameras && cameras.keySeq ? cameras.keySeq().first() : "";

      var cameraName = this.props.stand.getIn(["cameras"]).keySeq().first(); // const cameraName = this.props.stand.getIn(["cameras", 0, cameraRefName]);

      var kinects = this.props.stand.getIn(["kinects"]);
      var kinectName = this.props.stand.getIn(["kinects", 0, "name"]); // const kinectRefName = kinects && kinects.keySeq ? kinects : kinects.keySeq().first();
      // const kinectName = this.props.stand.getIn(["kinects", 0, kinectRefName]);
      // const kinectName = this.props.stand.getIn(["kinects", 0, kinectRefName]);

      function getLink(type, name) {
        if (name) {
          return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("a", {
            style: {
              display: "block"
            },
            target: "_blank",
            href: "http://".concat(consulInstallationUrl, "/").concat(type, "/").concat(name, ".yaml/edit"),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 261
            },
            __self: this
          }, name);
        } else {
          return undefined;
        }
      }

      var standLink = getLink("stands", standName);
      var headLink = getLink("heads", headName);
      var cameraLink = getLink("cameras", cameraName);
      var kinectLink = getLink("kinects", kinectName);
      var endpoints = this.getEndpoints();
      return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "PopupInfo",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 282
        },
        __self: this
      }, "Links:", standLink, headLink, cameraLink, kinectLink, endpoints, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "PopupInfo-closeButton",
        onClick: this.closePopupInfo,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 289
        },
        __self: this
      }, "X")); // let rot = camera.get("rot");
      // rot = isNaN(rot) ? 0 : rot;
      // rot = decodeRot(rot);
      // const selectedStandIndex = this.props.menu.get("selectedStandIndex");
      // const selectedCameraIndex = this.props.menu.get("selectedCameraIndex");
      // const isSelected = selectedStandIndex === this.props.standIndex && selectedCameraIndex === this.props.cameraIndex;
      // const fov = camera.get("fov");
      // const fovLength = 500;
      // let fovHeight = 0;
      // if (0 < fov && fov < 180) {
      //     const rad = (fov/2 * Math.PI/180);
      //     fovHeight = fovLength * Math.tan(rad);
      // }
      // const topAdjust = 12; // This is related to the height of half the camera.
      // const fovStyle = {
      //     width: 0,
      //     height: 0,
      //     borderTop: `${fovHeight}px solid transparent`,
      //     borderRight: `${fovLength}px solid rgba(0,100,0,0.1)`,
      //     borderBottom: `${fovHeight}px solid transparent`,
      //     position: "absolute",
      //     top: `-${fovHeight - topAdjust}px`,
      //     left: "12px",
      //     zIndex: 2,
      //     pointerEvents: "none" // https://stackoverflow.com/questions/3680429/click-through-a-div-to-underlying-elements
      // }
      // window.c_fov = {fovHeight, fovLength, fov, fovStyle};
      // const areRotatesHidden = this.props.menu.get("areRotatesHidden");
      // return (
      //     <div className={cn("Camera", { "Camera--selected": isSelected })} >
      //         <DraggableCore
      //             // allowAnyClick= boolean,
      //             // cancel= string,
      //             // disabled= boolean,
      //             // enableUserSelectHack= boolean,
      //             // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
      //             // grid= [number, number],
      //             handle=".Camera-camImg"
      //             onStart={this.handleMoveStart}
      //             onDrag={this.handleMoveDrag}
      //             onStop={this.handleMoveStop}
      //         // onMouseDown= (e= MouseEvent) => void
      //         >
      //             <div className="Camera-container" style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
      //                 <div className="Camera-rotateContainer" style={{ transform: `rotate(${rot}deg)` }}>
      //                     {
      //                         areRotatesHidden ? null :
      //                             <div className="Camera-rotate noselect">
      //                                 {/* offset is used for the drag's reference */}
      //                                 <DraggableCore
      //                                     // allowAnyClick= boolean,
      //                                     // cancel= string,
      //                                     // disabled= boolean,
      //                                     // enableUserSelectHack= boolean,
      //                                     // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
      //                                     // grid= [number, number],
      //                                     handle=".Camera-rotate-handle"
      //                                     onStart={this.handleRotateStart}
      //                                     onDrag={this.handleRotateDrag}
      //                                     onStop={this.handleRotateStop}
      //                                 // onMouseDown= (e= MouseEvent) => void
      //                                 >
      //                                     <div className="Camera-rotate-handle"></div>
      //                                 </DraggableCore>
      //                             </div>
      //                     }
      //                     <div className="Camera-camImg"></div>
      //                     <div className="Camera-fov" style={fovStyle}>
      //                         <div className="Camera-fov-1"></div>
      //                         <div className="Camera-fov-2"></div>
      //                     </div>
      //                 </div>
      //             </div>
      //         </DraggableCore>
      //     </div>
      // );
    }
  }]);

  return Popup;
}(react__WEBPACK_IMPORTED_MODULE_6___default.a.Component);



/***/ }),

/***/ "./src/components/Scene.js":
/*!*********************************!*\
  !*** ./src/components/Scene.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _containers_Stand__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../containers/Stand */ "./src/containers/Stand.js");
/* harmony import */ var _containers_FocalPoints__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../containers/FocalPoints */ "./src/containers/FocalPoints.js");
/* harmony import */ var _containers_UnderVisuals__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../containers/UnderVisuals */ "./src/containers/UnderVisuals.js");





var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/Scene.js";
 //import Heads from '../containers/Heads'
// import Draggable, {DraggableCore} from 'react-draggable'; 

 // import FocalPoint from '../containers/FocalPoint';

 // import Popups from '../components/Popups';



var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {}; // this.handleDrag = this.handleDrag.bind(this);
    // this.handleDragEnd = this.handleDragEnd.bind(this);
    // this.handleDragEnter = this.handleDragEnter.bind(this);
    // this.handleDragExit = this.handleDragExit.bind(this);
    // this.handleDragLeave = this.handleDragLeave.bind(this);
    // this.handleDragOver = this.handleDragOver.bind(this);
    // this.handleDragStart = this.handleDragStart.bind(this);

    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var html = document.getElementsByTagName("html")[0];
      html.addEventListener("mousedown", function (e) {
        if (e.target.tagName.toUpperCase() === "HTML") {
          _this2.props.menuDeselectStandAndAll();
        }
      });
      html.addEventListener("touchstart", function (e) {
        if (e.target.tagName.toUpperCase() === "HTML") {
          _this2.props.menuDeselectStandAndAll();
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      window.c_ko = this;
      var stands = this.props.stands.map(function (stand, i) {
        return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_containers_Stand__WEBPACK_IMPORTED_MODULE_6__["default"], {
          key: i,
          index: i,
          stand: stand,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 48
          },
          __self: this
        });
      });
      var standsContainerStyle = {
        position: "relative" // let kinects = [];
        // try {
        //     var tempKinectsImmObj = this.props.kinects.get("kinects");
        //     // var tempKinectsJSObj = tempKinectsImmObj.toJS();
        //     // for (var kinectName in tempKinectsJSObj) {
        //     // tempKinectsImmObj.keyName
        //     tempKinectsImmObj.keySeq().forEach((kinectName,i) => {
        //         kinects.push(<Kinect key={kinectName} kinectName={kinectName} kinect={tempKinectsImmObj.get(kinectName)}/>) 
        //     });
        //     // kinects = this.props.kinects.get("kinects");
        //     // kinects.map((kinect, i) => <Kinect key={i} index={i} kinect={kinect}/>);
        // } catch(e) {}
        // const scale = this.props.menu.get("scale");
        // const translateX = this.props.menu.getIn(["translate", "x"]);
        // const translateY = this.props.menu.getIn(["translate", "y"]);
        // const styleKinects = {
        //     transform: `translate(${translateX}px, ${translateY}px) scale(${scale/100})`
        //     // transform: `translate(${translateX*scale/100}px, ${translateY*scale/100}px) scale(${scale/100})`
        // }
        // window.c_sds = { 
        //     scale,
        //     translateX,
        //     translateY,
        //     styleKinects
        // }

      };
      return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        id: "Scene",
        className: "Scene",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 87
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        style: standsContainerStyle,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 88
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_containers_UnderVisuals__WEBPACK_IMPORTED_MODULE_8__["default"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 89
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "Stands",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 90
        },
        __self: this
      }, stands), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_containers_FocalPoints__WEBPACK_IMPORTED_MODULE_7__["default"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 93
        },
        __self: this
      })));
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_5___default.a.Component);



/***/ }),

/***/ "./src/components/Stand.js":
/*!*********************************!*\
  !*** ./src/components/Stand.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-draggable */ "./node_modules/react-draggable/dist/react-draggable.js");
/* harmony import */ var react_draggable__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_draggable__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _Heads__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Heads */ "./src/components/Heads.js");
/* harmony import */ var _Cameras__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Cameras */ "./src/components/Cameras.js");
/* harmony import */ var _Kinects__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Kinects */ "./src/components/Kinects.js");
/* harmony import */ var _containers_PopupInfo__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../containers/PopupInfo */ "./src/containers/PopupInfo.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.js");






var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/Stand.js";
 //import Heads from '../containers/Heads'
// import Draggable from 'react-draggable'; 

 // import Stand from '../containers/Stand';








var Menu =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Menu, _React$Component);

  function Menu(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Menu);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(Menu).call(this, props));
    _this.state = {// pos : {x:0, y:0},
      // rotateRad : 0
    }; // this.onMouseDown = this.onMouseDown.bind(this);

    _this.togglePopupInfo = _this.togglePopupInfo.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveStart = _this.handleMoveStart.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveDrag = _this.handleMoveDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleMoveStop = _this.handleMoveStop.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateStart = _this.handleRotateStart.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateDrag = _this.handleRotateDrag.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleRotateStop = _this.handleRotateStop.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this)));
    _this.handleStandClick = _this.handleStandClick.bind(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_5__["default"])(_this))); // this.handleMoveDragEnd = this.handleMoveDragEnd.bind(this);
    // this.handleMoveDragEnter = this.handleMoveDragEnter.bind(this);
    // this.handleMoveDragExit = this.handleMoveDragExit.bind(this);
    // this.handleMoveDragLeave = this.handleMoveDragLeave.bind(this);
    // this.handleMoveDragOver = this.handleMoveDragOver.bind(this);
    // this.handleMoveDragStart = this.handleMoveDragStart.bind(this);
    // Refs

    _this.refStandRotateHandle = react__WEBPACK_IMPORTED_MODULE_6___default.a.createRef();
    _this.refStandMoveHandle = react__WEBPACK_IMPORTED_MODULE_6___default.a.createRef();
    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Menu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      Object(_helpers__WEBPACK_IMPORTED_MODULE_13__["noTouchMove"])(this.refStandRotateHandle.current);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_13__["noTouchMove"])(this.refStandMoveHandle.current);
    } // handleMoveDrag = {this.handleMoveDrag}
    // handleMoveDragEnd = {this.handleMoveDragEnd}
    // handleMoveDragEnter = {this.handleMoveDragEnter}
    // handleMoveDragExit = {this.handleMoveDragExit}
    // handleMoveDragLeave = {this.handleMoveDragLeave}
    // handleMoveDragOver = {this.handleMoveDragOver}
    // handleMoveDragStart = {this.handleMoveDragStart}
    // // If this is clicked in general
    // onMouseDown() {
    //     var highestStand = document.getElementsByClassName("Stand");
    //     [...Stands].forEach(Stand => {
    //         Stand.classList.remove("Stand-highest");
    //     });
    // }

  }, {
    key: "togglePopupInfo",
    value: function togglePopupInfo(e) {
      if (!this.props.popupInfo) {
        // The x and y of the Scene
        var _document$getElementB = document.getElementById("Scene").getBoundingClientRect(),
            x = _document$getElementB.x,
            y = _document$getElementB.y;

        var clickPos = {
          x: e.nativeEvent.clientX - x,
          y: e.nativeEvent.clientY - y
        };
        this.props.popupInfoRemoveAll();
        this.props.popupInfoAddNew(clickPos);
      } //  else {
      //     this.props.popupInfoRemove();
      // }

    } // Move

  }, {
    key: "handleStandClick",
    value: function handleStandClick(e, a) {
      this.props.standSelect();
      this.togglePopupInfo(e); // console.log("h str", e, a);
      // this.props.standMove(1,a.)
    } // Move

  }, {
    key: "handleMoveStart",
    value: function handleMoveStart(e, a) {
      this.props.standSelect(); // console.log("h str", e, a);
      // this.props.standMove(1,a.)
    }
  }, {
    key: "handleMoveDrag",
    value: function handleMoveDrag(e, a) {
      // console.log("h dr", e, a);
      var x = a.x,
          y = a.y;
      var pos = Object(_helpers__WEBPACK_IMPORTED_MODULE_13__["encodePos"])(this.props.menu, {
        x: x,
        y: y
      }); // const pos = encrypt1({ x, y });
      // const pos = { x, y };
      // Convert the values 

      this.props.standMove(pos); // this.setState({ pos });
    }
  }, {
    key: "handleMoveStop",
    value: function handleMoveStop(e, a) {} // Rotate

  }, {
    key: "handleRotateStart",
    value: function handleRotateStart(e, a) {
      this.props.standSelect();
    }
  }, {
    key: "handleRotateDrag",
    value: function handleRotateDrag(e, a) {
      var x = a.x,
          y = a.y;
      var rad = Math.atan2(y, x); // In radians

      var deg = Object(_helpers__WEBPACK_IMPORTED_MODULE_13__["encodeRot"])(rad * (180 / Math.PI)); // var deg = rad * (180 / Math.PI);

      this.props.standRotate(deg);
    }
  }, {
    key: "handleRotateStop",
    value: function handleRotateStop(e, a) {// console.log("hrlt stop", e, a);
    }
  }, {
    key: "render",
    value: function render() {
      var stand = this.props.stand;
      var isActive = stand.get("isActive"); // let pos = {x: 0, y:0};

      var pos = Object(_helpers__WEBPACK_IMPORTED_MODULE_13__["decodePos"])(this.props.menu, stand.get("pos").toJS()); // let pos = decrypt1(stand.get("pos").toJS());
      // let pos = stand.get("pos").toJS();

      pos.x = isNaN(pos.x) || pos.x === "" ? 0 : pos.x;
      pos.y = isNaN(pos.y) || pos.y === "" ? 0 : pos.y;
      var rot = stand.get("rot");
      rot = isNaN(rot) ? 0 : rot;
      rot = Object(_helpers__WEBPACK_IMPORTED_MODULE_13__["decodeRot"])(rot); // flip it so rotation is opposite direction.

      var selectedStandIndex = this.props.menu.get("selectedStandIndex");
      var isSelected = selectedStandIndex === this.props.index;
      var heads = stand.get("heads");
      var cameras = stand.get("cameras");
      var kinects = stand.get("kinects"); // const standStyle = {transform:`translate(${stand.pos.x}px, ${stand.pos.y}px)`}
      // console.log('ren');
      // try {
      //     pos = stand.get("pos");
      // } catch(e) {}

      var popupInfo;

      if (this.props.popupInfo) {
        popupInfo = react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
          className: "Stand-popupInfo",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 166
          },
          __self: this
        }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_containers_PopupInfo__WEBPACK_IMPORTED_MODULE_12__["default"], {
          standIndex: this.props.index,
          pos: this.props.popupInfo.get("pos"),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 167
          },
          __self: this
        }));
      }

      var isStandRotatesHidden = this.props.menu.get("isStandRotatesHidden");
      var isForceShowStandRotatesOnSelect = this.props.menu.get("isForceShowStandRotatesOnSelect");
      var isShowStandRotator = !isStandRotatesHidden || isSelected && isForceShowStandRotatesOnSelect;
      var standName = stand.get("name"); // Given the stand is 100px 
      // and the actual stand is 0.381 m (15')
      // When the scene scale is 100
      // set the transform:scale(X); to X = 0.381
      // When the scene scale is 200 (100 * 2)
      // set the transform:scale(X); to X = 0.381 * 2 = 0.762

      var standContainerScale = _helpers__WEBPACK_IMPORTED_MODULE_13__["STAND_WIDTH"] * this.props.menu.get("scale") / 100;
      var styleStandContainer = {
        transform: "scale(".concat(standContainerScale, ")")
      };
      return react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_draggable__WEBPACK_IMPORTED_MODULE_7___default.a, {
        handle: ".Stand-move",
        defaultPosition: {
          x: 0,
          y: 0
        } // position={null}
        ,
        position: pos // grid={[25, 25]}
        ,
        onStart: this.handleMoveStart,
        onDrag: this.handleMoveDrag,
        onStop: this.handleMoveStop,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 189
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        ref: this.refStand,
        id: "Stand-".concat(standName),
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()("Stand", {
          "Stand--selected": isSelected,
          "Stand--active": isActive
        }),
        onClick: this.handleStandClick,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 213
        },
        __self: this
      }, popupInfo, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Stand-rotateContainer",
        style: {
          transform: "rotate(".concat(rot, "deg)")
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 215
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        style: styleStandContainer,
        className: "Stand-container",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 216
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Stand-octagon",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 217
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Stand-name noselect",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 218
        },
        __self: this
      }, stand.get("name"), " : ", stand.getIn(["heads", 0, "name"])), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        ref: this.refStandMoveHandle,
        className: "Stand-move noselect",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 227
        },
        __self: this
      }, "Move"), !isShowStandRotator ? null : react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Stand-rotate noselect",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 235
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_draggable__WEBPACK_IMPORTED_MODULE_7__["DraggableCore"] // allowAnyClick= boolean,
      // cancel= string,
      // disabled= boolean,
      // enableUserSelectHack= boolean,
      // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
      // grid= [number, number],
      , {
        handle: ".Stand-rotate-handle",
        onStart: this.handleRotateStart,
        onDrag: this.handleRotateDrag,
        onStop: this.handleRotateStop // onMouseDown= (e= MouseEvent) => void
        ,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 237
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        ref: this.refStandRotateHandle,
        className: "Stand-rotate-handle",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 250
        },
        __self: this
      }))), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Stand-heads",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 255
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_Heads__WEBPACK_IMPORTED_MODULE_9__["default"], {
        heads: heads,
        standIndex: this.props.index,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 256
        },
        __self: this
      })), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Stand-cameras",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 258
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_Cameras__WEBPACK_IMPORTED_MODULE_10__["default"], {
        cameras: cameras,
        standIndex: this.props.index,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 259
        },
        __self: this
      })), react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
        className: "Stand-kinects",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 261
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_Kinects__WEBPACK_IMPORTED_MODULE_11__["default"], {
        kinects: kinects,
        standIndex: this.props.index,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 262
        },
        __self: this
      }))))));
    }
  }]);

  return Menu;
}(react__WEBPACK_IMPORTED_MODULE_6___default.a.Component);



/***/ }),

/***/ "./src/components/UnderVisuals.js":
/*!****************************************!*\
  !*** ./src/components/UnderVisuals.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UnderVisuals; });
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _containers_MotionLines__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../containers/MotionLines */ "./src/containers/MotionLines.js");
/* harmony import */ var _containers_GridLines__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../containers/GridLines */ "./src/containers/GridLines.js");





var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/components/UnderVisuals.js";




var UnderVisuals =
/*#__PURE__*/
function (_React$Component) {
  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(UnderVisuals, _React$Component);

  function UnderVisuals(props) {
    var _this;

    Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, UnderVisuals);

    _this = Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(UnderVisuals).call(this, props));
    _this.state = {}; // this.handleMoveStart = this.handleMoveStart.bind(this);

    return _this;
  }

  Object(_Users_aj_Work_code_heads_heads2_heads_boss_ui_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(UnderVisuals, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 19
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_containers_MotionLines__WEBPACK_IMPORTED_MODULE_6__["default"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 20
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_containers_GridLines__WEBPACK_IMPORTED_MODULE_7__["default"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 21
        },
        __self: this
      }));
    }
  }]);

  return UnderVisuals;
}(react__WEBPACK_IMPORTED_MODULE_5___default.a.Component);



/***/ }),

/***/ "./src/containers/Camera.js":
/*!**********************************!*\
  !*** ./src/containers/Camera.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _components_Camera__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Camera */ "./src/components/Camera.js");




var mapStateToProps = function mapStateToProps(state, ownProps) {
  // const stands = state.stands;
  // const menu = state.menu;
  // let stand = {}; // The stand for the camera
  // let cameras;
  // if (stands && stands.get && stands.get(ownProps.standIndex)) {
  //     stand = stands.get(ownProps.standIndex);
  //     if (stand.get && stand.get("cameras")) {
  //         cameras = stand.get("cameras");
  //     }
  // }
  return {
    stands: state.stands,
    //ownProps.filter === state.visibilityFilter
    stand: state.stands.get(ownProps.standIndex),
    // cameras: state.stands .get(ownProps.index),
    menu: state.menu
  };
}; // const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;


var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    selectCamera: function selectCamera() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSelectCamera"])({
        standIndex: ownProps.standIndex,
        cameraIndex: ownProps.cameraIndex
      }));
    },
    cameraMove: function cameraMove(pos) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["cameraMoveByIndex"])(ownProps.standIndex, ownProps.cameraIndex, pos));
    },
    cameraRotate: function cameraRotate(rot) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["cameraRotateByIndex"])(ownProps.standIndex, ownProps.cameraIndex, rot));
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_Camera__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./src/containers/FocalPoint.js":
/*!**************************************!*\
  !*** ./src/containers/FocalPoint.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _components_FocalPoint__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/FocalPoint */ "./src/components/FocalPoint.js");




var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    focalPoints: state.focalPoints,
    //ownProps.filter === state.visibilityFilter
    menu: state.menu
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    focalPointSelect: function focalPointSelect() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSelectFocalPoint"])(ownProps.index));
    },
    // focalPointMove: (pos) => dispatch(focalPointMoveByIndex(ownProps.index, pos)),
    focalPointMove: function focalPointMove(pos) {
      // dispatch(headRotateByIndex(ownProps.standIndex, ownProps.headIndex, rot));
      // const websocketPayload = {
      //   "type": "fp-location",
      //   "data": {
      //     "fpName": ownProps.get("name"),
      //     "location": rot
      //   }
      // }
      // dispatch(focalPointMoveByIndex(ownProps.index, pos));
      // dispatch(headRotateByIndex(ownProps.standIndex, ownProps.headIndex, rot));
      dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["focalPointMoveByIndex"])(ownProps.index, pos));
      var websocketPayload = {
        "type": "focal-point-location",
        "data": {
          "focalPointName": ownProps.name,
          "location": pos
        }
      };
      dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["websocketSend"])(websocketPayload));
    },
    focalPointRemove: function focalPointRemove() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["focalPointRemoveByIndex"])(ownProps.index));
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_FocalPoint__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./src/containers/FocalPoints.js":
/*!***************************************!*\
  !*** ./src/containers/FocalPoints.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _components_FocalPoints__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/FocalPoints */ "./src/components/FocalPoints.js");
 // import { focalPointRemoveByIndex, focalPointMoveByIndex, focalPointRotateByIndex, menuSelectFocalPoint } from '../actions'




var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    focalPoints: state.focalPoints,
    //ownProps.filter === state.visibilityFilter
    menu: state.menu
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    // focalPointSelect: () => dispatch(menuSelectFocalPoint(ownProps.index)),
    // focalPointMove: (pos) => dispatch(focalPointMoveByIndex(ownProps.index, pos)), 
    // focalPointRemove: () => dispatch(focalPointRemoveByIndex(ownProps.index))
    focalPointMoveByIndex: function focalPointMoveByIndex(index, pos) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["focalPointMoveByIndex"])(index, pos));
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_FocalPoints__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./src/containers/GridLines.js":
/*!*************************************!*\
  !*** ./src/containers/GridLines.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _components_GridLines__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/GridLines */ "./src/components/GridLines.js");




var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    menu: state.menu //ownProps.filter === state.visibilityFilter

  };
}; // const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;


var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    // standAdd: () => dispatch(standAdd(ownProps.filter)) 
    setScale: function setScale(scale) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSetScale"])(scale));
    },
    setTranslateX: function setTranslateX(x) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSetTranslateX"])(x));
    },
    setTranslateY: function setTranslateY(y) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSetTranslateY"])(y));
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_GridLines__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./src/containers/Head.js":
/*!********************************!*\
  !*** ./src/containers/Head.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _components_Head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Head */ "./src/components/Head.js");

 // import { menuSelectHead, headRotateByIndex} from '../actions'



var mapStateToProps = function mapStateToProps(state, ownProps) {
  // const stands = state.stands;
  // const menu = state.menu;
  // let stand = {}; // The stand for the head
  // let heads;
  // if (stands && stands.get && stands.get(ownProps.standIndex)) {
  //     stand = stands.get(ownProps.standIndex);
  //     if (stand.get && stand.get("heads")) {
  //         heads = stand.get("heads");
  //     }
  // }
  return {
    stands: state.stands,
    //ownProps.filter === state.visibilityFilter
    stand: state.stands.get(ownProps.standIndex),
    // heads: state.stands .get(ownProps.index),
    menu: state.menu
  };
}; // const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;


var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    // standMove: (standIndex, pos) => dispatch(standMove(ownProps.filter)),
    // standHead: () => dispatch(menuSelectHead(ownProps.index)),
    // headSelect: () => dispatch(menuSelectHead(ownProps.standIndex, ownProps.index)),
    // standSetField: (fieldName, value) => dispatch(standSetFieldByIndex(ownProps.index, fieldName, value)), // pos = {x, y}
    // standSetInFields: (fieldNames, value) => dispatch(standSetInFieldsByIndex(ownProps.index, fieldNames, value)), // pos = {x, y}
    // standMove: (pos) => dispatch(standMoveByIndex(ownProps.index, pos)), // pos = {x, y}
    // standRemove: () => dispatch(standRemoveByIndex(ownProps.index)), // pos = {x, y}
    // headRotate: (rot) => dispatch(headRotateByIndex(ownProps.standIndex, ownProps.index, rot)) // rot = radian amount
    headRotateStart: function headRotateStart() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["headRotateStartByIndex"])(ownProps.standIndex, ownProps.index));
    },
    headRotateStop: function headRotateStop() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["headRotateStopByIndex"])(ownProps.standIndex, ownProps.index));
    },
    headRotate: function headRotate(rot) {
      dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["headRotateByIndex"])(ownProps.standIndex, ownProps.headIndex, rot));
      var websocketPayload = {
        "type": "head-rotation",
        "data": {
          "headName": ownProps.head.get("name"),
          "rotation": rot
        }
      };
      dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["websocketSend"])(websocketPayload));
    } // rot = radian amount
    // standMoveByIndex: (standIndex, pos) => dispatch(standMoveByIndex(ownProps.index, pos)), // pos = {x, y}
    // standRotateByIndex: (standIndex, rot) => dispatch(standRotateByIndex(ownProps.index, rot)) // rot = radian amount

  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_Head__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./src/containers/Kinect.js":
/*!**********************************!*\
  !*** ./src/containers/Kinect.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _components_Kinect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Kinect */ "./src/components/Kinect.js");




var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    stands: state.stands,
    //ownProps.filter === state.visibilityFilter
    stand: state.stands.get(ownProps.standIndex),
    kinectFocalPoints: state.kinectFocalPoints,
    // kinects: state.stands .get(ownProps.index),
    menu: state.menu
  };
}; // const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;


var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    selectKinect: function selectKinect() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSelectKinect"])({
        standIndex: ownProps.standIndex,
        kinectIndex: ownProps.kinectIndex
      }));
    },
    kinectMove: function kinectMove(pos) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["kinectMoveByIndex"])(ownProps.standIndex, ownProps.kinectIndex, pos));
    },
    kinectRotate: function kinectRotate(rot) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["kinectRotateByIndex"])(ownProps.standIndex, ownProps.kinectIndex, rot));
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_Kinect__WEBPACK_IMPORTED_MODULE_2__["default"])); // import { connect } from 'react-redux'
// import { kinectRemoveByName, kinectMoveByName, kinectRotateByName, menuSelectKinectByName } from '../actions'
// import Kinect from '../components/Kinect'
// const mapStateToProps = (state, ownProps) =>
// ({
//   kinects: state.kinects,
//   menu: state.menu,
// });
// // const mapStateToProps = (state, ownProps) => ({});
// // // ({
// // // //   active: ownProps.filter === state.visibilityFilter
// // // })​;
// const mapDispatchToProps = (dispatch, ownProps) => ({
//     kinectSelect: () => dispatch(menuSelectKinectByName(ownProps.kinectName)),
//     kinectMove: (pos) => dispatch(kinectMoveByName({kinectName: ownProps.kinectName, pos})), // pos = {x, y}
//     // kinectRemove: () => dispatch(kinectRemoveByName(ownProps.kinectName)), // pos = {x, y}
//     kinectRotate: (rot) => dispatch(kinectRotateByName({kinectName: ownProps.kinectName, rot})) // rot = radian amount
// });
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Kinect)
// // import { connect } from 'react-redux'
// // import { kinectMoveByName, kinectRotateByName, menuSelectKinectByName } from '../actions'
// // import Kinect from '../components/Kinect'
// // const mapStateToProps = (state, ownProps) =>
// // ({
// //   kinects: state.kinects, //ownProps.filter === state.visibilityFilter
// //   menu: state.menu,
// // });
// // // const mapStateToProps = (state, ownProps) => ({});
// // // // ({
// // // // //   active: ownProps.filter === state.visibilityFilter
// // // // })​;
// // const mapDispatchToProps = (dispatch, ownProps) => ({
// //     // kinectMove: (kinectIndex, pos) => dispatch(kinectMove(ownProps.filter)),
// //     kinectSelect: () => dispatch(menuSelectKinectByName(ownProps.kinectName)),
// //     // kinectSetField: (fieldName, value) => dispatch(kinectSetFieldByName(ownProps.kinectName, fieldName, value)), // pos = {x, y}
// //     // kinectSetInFields: (fieldNames, value) => dispatch(kinectSetInFieldsByName(ownProps.kinectName, fieldNames, value)), // pos = {x, y}
// //     kinectMove: (pos) => dispatch(kinectMoveByName({kinectName: ownProps.kinectName, pos})), // pos = {x, y}
// //     // kinectRemove: () => dispatch(kinectRemoveByName(ownProps.kinectName)), // pos = {x, y}
// //     kinectRotate: (rot) => dispatch(kinectRotateByName({kinectName: ownProps.kinectName, rot})) // rot = radian amount
// //     // kinectMoveByName: (kinectIndex, pos) => dispatch(kinectMoveByName(ownProps.kinectName, pos)), // pos = {x, y}
// //     // kinectRotateByName: (kinectIndex, rot) => dispatch(kinectRotateByName(ownProps.kinectName, rot)) // rot = radian amount
// // });
// // export default connect(
// //     mapStateToProps,
// //     mapDispatchToProps
// // )(Kinect)

/***/ }),

/***/ "./src/containers/Menu.js":
/*!********************************!*\
  !*** ./src/containers/Menu.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _components_Menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Menu */ "./src/components/Menu.js");




var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    stands: state.stands,
    menu: state.menu,
    selectedStandIndex: state.menu && state.menu.get ? state.menu.get("selectedStandIndex") : 0,
    selectedCameraIndex: state.menu && state.menu.get ? state.menu.get("selectedCameraIndex") : 0 //   selectedHeadIndex: state.menu && state.menu.get ? state.menu.get("selectedHeadIndex") : 0

  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    addStand: function addStand() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["standAdd"])());
    },
    addFocalPoint: function addFocalPoint() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["focalPointAdd"])());
    },
    loadSceneFromUrl: function loadSceneFromUrl(sceneUrl) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["sceneFetchFromUrl"])(sceneUrl));
    },
    selectStand: function selectStand(index) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSelectStand"])(index));
    },
    selectCamera: function selectCamera(cameraIndex) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSelectCamera"])({
        cameraIndex: cameraIndex
      }));
    },
    // selectCamera: (cameraIndex) => dispatch(menuSelectCamera({cameraIndex})),
    // selectCamera: (standIndex, cameraIndex) => dispatch(menuSelectCamera(standIndex, cameraIndex)),
    selectHead: function selectHead(headIndex) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSelectHead"])({
        headIndex: headIndex
      }));
    },
    // selectHead: (standIndex, headIndex)  => dispatch(menuSelectHead(standIndex, headIndex)),
    standSetField: function standSetField(index, fieldName, value) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["standSetFieldByIndex"])(index, fieldName, value));
    },
    // pos = {x, y}
    standSetInFields: function standSetInFields(index, fieldNames, value) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["standSetInFieldsByIndex"])(index, fieldNames, value));
    },
    // pos = {x, y}
    cameraAddNew: function cameraAddNew(standIndex) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["cameraAddNew"])(standIndex));
    },
    cameraRemove: function cameraRemove(standIndex, cameraIndex) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["cameraRemoveByIndex"])(standIndex, cameraIndex));
    },
    setScale: function setScale(scale) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSetScale"])(scale));
    },
    setTranslateX: function setTranslateX(x) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSetTranslateX"])(x));
    },
    setTranslateY: function setTranslateY(y) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSetTranslateY"])(y));
    },
    menuToggleHideCameraRotates: function menuToggleHideCameraRotates() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuToggleHideRotates"])("camera"));
    },
    menuToggleHideStandRotates: function menuToggleHideStandRotates() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuToggleHideRotates"])("stand"));
    },
    menuToggleHideHeadRotates: function menuToggleHideHeadRotates() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuToggleHideRotates"])("head"));
    },
    menuHideAllRotates: function menuHideAllRotates() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuHideAllRotates"])());
    },
    menuShowAllRotates: function menuShowAllRotates() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuShowAllRotates"])());
    },
    menuToggleForceShowCameraRotatesOnSelect: function menuToggleForceShowCameraRotatesOnSelect() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuToggleForceShowRotatesOnSelect"])("camera"));
    },
    menuToggleForceShowStandRotatesOnSelect: function menuToggleForceShowStandRotatesOnSelect() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuToggleForceShowRotatesOnSelect"])("stand"));
    },
    menuToggleForceShowHeadRotatesOnSelect: function menuToggleForceShowHeadRotatesOnSelect() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuToggleForceShowRotatesOnSelect"])("head"));
    },
    menuDisableForceShowAllRotatesOnSelect: function menuDisableForceShowAllRotatesOnSelect() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuDisableForceShowAllRotatesOnSelect"])());
    },
    menuEnableForceShowAllRotatesOnSelect: function menuEnableForceShowAllRotatesOnSelect() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuEnableForceShowAllRotatesOnSelect"])());
    },
    websocketConnect: function websocketConnect(url) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["websocketConnect"])(url));
    },
    websocketDisconnect: function websocketDisconnect() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["websocketDisconnect"])());
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_Menu__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./src/containers/MotionLine.js":
/*!**************************************!*\
  !*** ./src/containers/MotionLine.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _components_MotionLine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/MotionLine */ "./src/components/MotionLine.js");
 // import { standsActions } from '../actions'



var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    menu: state.menu //ownProps.filter === state.visibilityFilter

  };
}; // const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;


var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {// standAdd: () => dispatch(standAdd(ownProps.filter))
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_MotionLine__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./src/containers/MotionLines.js":
/*!***************************************!*\
  !*** ./src/containers/MotionLines.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _components_MotionLines__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/MotionLines */ "./src/components/MotionLines.js");
 // import { standsActions } from '../actions'



var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    motionLines: state.motionLines //ownProps.filter === state.visibilityFilter

  };
}; // const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;


var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {// standAdd: () => dispatch(standAdd(ownProps.filter))
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_MotionLines__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./src/containers/PopupInfo.js":
/*!*************************************!*\
  !*** ./src/containers/PopupInfo.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _components_PopupInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/PopupInfo */ "./src/components/PopupInfo.js");




var mapStateToProps = function mapStateToProps(state, ownProps) {
  // const stands = state.stands;
  // const menu = state.menu;
  // let stand = {}; // The stand for the camera
  // let cameras;
  // if (stands && stands.get && stands.get(ownProps.standIndex)) {
  //     stand = stands.get(ownProps.standIndex);
  //     if (stand.get && stand.get("cameras")) {
  //         cameras = stand.get("cameras");
  //     }
  // }
  var standIndex = ownProps.standIndex;
  var stand = state.stands.get(standIndex);
  var headName;
  var headNames;
  var standHeads = state.stands.getIn([standIndex, "heads"]);

  if (standHeads && standHeads.size > 0) {
    headNames = Object.keys(standHeads.toJS());

    if (headNames && headNames.length > 0) {
      headName = standHeads.getIn([headNames[0], "name"]);
    }
  }

  return {
    // stands: state.stands, //ownProps.filter === state.visibilityFilter
    stand: stand,
    //: state.stands.get(ownProps.standIndex),
    popupInfo: state.stands.getIn([standIndex, "popupInfo"]),
    menu: state.menu,
    headName: headName
  };
}; // const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;


var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    // selectCamera: () => dispatch(menuSelectCamera({standIndex : ownProps.standIndex, cameraIndex: ownProps.cameraIndex})),
    popupInfoMove: function popupInfoMove(pos) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["popupInfoMove"])(ownProps.standIndex, pos));
    },
    popupInfoRemove: function popupInfoRemove(pos) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["popupInfoRemove"])(ownProps.standIndex));
    } // cameraRotate: (rot) => dispatch(cameraRotateByIndex(ownProps.standIndex, ownProps.cameraIndex, rot))

  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_PopupInfo__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./src/containers/Scene.js":
/*!*********************************!*\
  !*** ./src/containers/Scene.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _components_Scene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Scene */ "./src/components/Scene.js");




var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    stands: state.stands,
    kinects: state.kinects,
    focalPoints: state.focalPoints,
    menu: state.menu //   popups: state.popups //ownProps.filter === state.visibilityFilter

  };
}; // const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;


var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    menuDeselectStandAndAll: function menuDeselectStandAndAll() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuDeselectStandAndAll"])());
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_Scene__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./src/containers/Stand.js":
/*!*********************************!*\
  !*** ./src/containers/Stand.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _components_Stand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Stand */ "./src/components/Stand.js");




var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    stands: state.stands,
    //ownProps.filter === state.visibilityFilter
    menu: state.menu,
    popupInfo: state.stands.getIn([ownProps.index, "popupInfo"])
  };
}; // const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;


var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    // standMove: (standIndex, pos) => dispatch(standMove(ownProps.filter)),
    standSelect: function standSelect() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["menuSelectStand"])(ownProps.index));
    },
    // standSetField: (fieldName, value) => dispatch(standSetFieldByIndex(ownProps.index, fieldName, value)), // pos = {x, y}
    // standSetInFields: (fieldNames, value) => dispatch(standSetInFieldsByIndex(ownProps.index, fieldNames, value)), // pos = {x, y}
    popupInfoAddNew: function popupInfoAddNew(clickPos) {
      dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["popupInfoAddNew"])(ownProps.index, clickPos));
    },
    popupInfoRemove: function popupInfoRemove() {
      dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["popupInfoRemove"])(ownProps.index));
    },
    popupInfoRemoveAll: function popupInfoRemoveAll() {
      dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["popupInfoRemoveAll"])());
    },
    standMove: function standMove(pos) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["standMoveByIndex"])(ownProps.index, pos));
    },
    // pos = {x, y}
    standRemove: function standRemove() {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["standRemoveByIndex"])(ownProps.index));
    },
    // pos = {x, y}
    standRotate: function standRotate(rot) {
      return dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_1__["standRotateByIndex"])(ownProps.index, rot));
    } // rot = radian amount
    // standMoveByIndex: (standIndex, pos) => dispatch(standMoveByIndex(ownProps.index, pos)), // pos = {x, y}
    // standRotateByIndex: (standIndex, rot) => dispatch(standRotateByIndex(ownProps.index, rot)) // rot = radian amount

  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_Stand__WEBPACK_IMPORTED_MODULE_2__["default"]));

/***/ }),

/***/ "./src/containers/UnderVisuals.js":
/*!****************************************!*\
  !*** ./src/containers/UnderVisuals.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _components_UnderVisuals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/UnderVisuals */ "./src/components/UnderVisuals.js");
 // import { menuSelectCamera, cameraMoveByIndex, cameraRotateByIndex} from '../actions'



var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    stands: state.stands,
    //ownProps.filter === state.visibilityFilter
    menu: state.menu
  };
}; // const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;


var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {// selectCamera: () => dispatch(menuSelectCamera({standIndex : ownProps.standIndex, cameraIndex: ownProps.cameraIndex})),
    // cameraMove: (pos) => dispatch(cameraMoveByIndex(ownProps.standIndex, ownProps.cameraIndex, pos)),
    // cameraRotate: (rot) => dispatch(cameraRotateByIndex(ownProps.standIndex, ownProps.cameraIndex, rot))
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_redux__WEBPACK_IMPORTED_MODULE_0__["connect"])(mapStateToProps, mapDispatchToProps)(_components_UnderVisuals__WEBPACK_IMPORTED_MODULE_1__["default"]));

/***/ }),

/***/ "./src/helpers/index.js":
/*!******************************!*\
  !*** ./src/helpers/index.js ***!
  \******************************/
/*! exports provided: STAND_WIDTH, rotateVector, encodePosForKinectFocusPoint, encodePosRelativeStand, decodePosRelativeStand, encodePos, decodePos, encodePosScale, decodePosScale, encodeRot, decodeRot, setCookie, getCookieAsBoolean, getCookie, eraseCookie, noTouchMove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STAND_WIDTH", function() { return STAND_WIDTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rotateVector", function() { return rotateVector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodePosForKinectFocusPoint", function() { return encodePosForKinectFocusPoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodePosRelativeStand", function() { return encodePosRelativeStand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodePosRelativeStand", function() { return decodePosRelativeStand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodePos", function() { return encodePos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodePos", function() { return decodePos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodePosScale", function() { return encodePosScale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodePosScale", function() { return decodePosScale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeRot", function() { return encodeRot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeRot", function() { return decodeRot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCookie", function() { return setCookie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCookieAsBoolean", function() { return getCookieAsBoolean; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCookie", function() { return getCookie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eraseCookie", function() { return eraseCookie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "noTouchMove", function() { return noTouchMove; });
/* harmony import */ var transformation_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! transformation-matrix */ "./node_modules/transformation-matrix/build-umd/transformation-matrix.min.js");
/* harmony import */ var transformation_matrix__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__);
// From: https://www.npmjs.com/package/transformation-matrix
 // import { scale, rotate, translate, compose, applyToPoint } from 'transformation-matrix';

var STAND_WIDTH = 0.381; // E.g.: rotateVector([0,1], 90); for point 0,1 rotate by 90degrees.

var rotateVector = function rotateVector(vec, ang, origin) {
  ang = -ang * (Math.PI / 180);
  var cos = Math.cos(ang);
  var sin = Math.sin(ang);

  if (!origin) {
    origin = {
      x: 0,
      y: 0
    };
  } // Only rotate from the origin


  var vecFromOrg = {
    x: vec.x - origin.x,
    y: vec.y - origin.y
  };
  var rotatedPos = {
    x: Math.round(10000 * (vecFromOrg.x * cos - vecFromOrg.y * sin)) / 10000,
    y: Math.round(10000 * (vecFromOrg.x * sin + vecFromOrg.y * cos)) / 10000 // x: Math.round(10000*(vec.x * cos - vec.y * sin))/10000,
    // y: Math.round(10000*(vec.x * sin + vec.y * cos))/10000

  };
  return {
    x: rotatedPos.x + origin.x,
    y: rotatedPos.y + origin.y // NOTE: below is using arrays instead of pos objects
    // ang = -ang * (Math.PI/180);
    // var cos = Math.cos(ang);
    // var sin = Math.sin(ang);
    // return new Array(Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);

  };
}; // NOTE. I don't know if this should be encode or decode :)

var encodePosForKinectFocusPoint = function encodePosForKinectFocusPoint(pos) {
  // Because the Kinect has already been scaled 
  // we just need to undo the adjustment do to the stand width
  return {
    x: 100 / STAND_WIDTH * pos.x,
    y: 100 / STAND_WIDTH * pos.y
  };
};
var encodePosRelativeStand = function encodePosRelativeStand(menu, pos) {
  var scaleVal = Math.max(1, menu.get("scale"));
  return {
    x: pos.x / scaleVal,
    y: pos.y / scaleVal
  };
};
var decodePosRelativeStand = function decodePosRelativeStand(pos) {
  return {
    x: 100 / STAND_WIDTH * pos.x,
    y: 100 / STAND_WIDTH * pos.y
  };
};
var encodePos = function encodePos(menu, pos) {
  var scaleVal = menu.get("scale");
  var translateX = parseFloat(menu.getIn(["translate", "x"]));
  var translateY = parseFloat(menu.getIn(["translate", "y"]));
  var matrix = Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["compose"])(Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["scale"])(1 / scaleVal, -1 / scaleVal), // rotate(Math.PI/2),
  Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["translate"])(-1 * translateX, -1 * translateY));
  var newPos = Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["applyToPoint"])(matrix, pos);
  return newPos;
};
var decodePos = function decodePos(menu, pos) {
  var scaleVal = menu.get("scale");
  var translateX = parseFloat(menu.getIn(["translate", "x"]));
  var translateY = parseFloat(menu.getIn(["translate", "y"]));
  var matrix = Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["compose"])(Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["translate"])(translateX, translateY), // rotate(-1*Math.PI/2),
  Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["scale"])(scaleVal, -1 * scaleVal));
  var newPos = Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["applyToPoint"])(matrix, pos);
  return newPos;
};
var encodePosScale = function encodePosScale(menu, pos) {
  var scaleVal = menu.get("scale");
  var matrix = Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["compose"])(Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["scale"])(scaleVal, -1 * scaleVal));
  var newPos = Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["applyToPoint"])(matrix, pos);
  return newPos;
};
var decodePosScale = function decodePosScale(menu, pos) {
  var scaleVal = menu.get("scale");
  var matrix = Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["compose"])(Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["scale"])(1 / scaleVal, -1 / scaleVal));
  var newPos = Object(transformation_matrix__WEBPACK_IMPORTED_MODULE_0__["applyToPoint"])(matrix, pos);
  return newPos;
};
var encodeRot = function encodeRot(rot) {
  return -1 * rot;
};
var decodeRot = function decodeRot(rot) {
  return -1 * rot;
}; // Cookies

var setCookie = function setCookie(name, value, days) {
  var expires = "";

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};
var getCookieAsBoolean = function getCookieAsBoolean(cookieName) {
  var val = getCookie(cookieName);

  if (typeof val === 'boolean') {
    return val;
  } else if (val === 'true' || val === 1) {
    return true;
  } else {
    return false;
  }
};
var getCookie = function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
};
var eraseCookie = function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;';
};
var noTouchMove = function noTouchMove(elem) {
  if (elem && elem.addEventListener) {
    elem.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);
  }
};

/***/ }),

/***/ "./src/index.css":
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/css-loader??ref--6-oneOf-3-1!../node_modules/postcss-loader/src??postcss!./index.css */ "./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./src/index.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../node_modules/css-loader??ref--6-oneOf-3-1!../node_modules/postcss-loader/src??postcss!./index.css */ "./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./src/index.css", function() {
		var newContent = __webpack_require__(/*! !../node_modules/css-loader??ref--6-oneOf-3-1!../node_modules/postcss-loader/src??postcss!./index.css */ "./node_modules/css-loader/index.js?!./node_modules/postcss-loader/src/index.js?!./src/index.css");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.css */ "./src/index.css");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./App */ "./src/App.js");
/* harmony import */ var _serviceWorker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./serviceWorker */ "./src/serviceWorker.js");
/* harmony import */ var redux_thunk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! redux-thunk */ "./node_modules/redux-thunk/es/index.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @giantmachines/redux-websocket */ "./node_modules/@giantmachines/redux-websocket/dist/index.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./reducers */ "./src/reducers/index.js");
/* harmony import */ var _middleware__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./middleware */ "./src/middleware/index.js");
var _jsxFileName = "/Users/aj/Work/code/heads/heads2/heads/boss-ui/src/index.js";




 // Redux related







var store = Object(redux__WEBPACK_IMPORTED_MODULE_8__["createStore"])(_reducers__WEBPACK_IMPORTED_MODULE_9__["default"], Object(redux__WEBPACK_IMPORTED_MODULE_8__["applyMiddleware"])( // socketMiddleware,
// socketIoMiddleware,
_giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_6___default.a, redux_thunk__WEBPACK_IMPORTED_MODULE_5__["default"], // lets us dispatch() functions
_middleware__WEBPACK_IMPORTED_MODULE_10__["customWebsocketMiddleware"] // loggerMiddleware // neat middleware that logs actions
)); // // Connect to the websocket;
// store.dispatch(websocketConnect())
// window.c_ts = () => {
//     console.log("going it");
//     store.dispatch(websocketSend("hi there"));
// }

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_redux__WEBPACK_IMPORTED_MODULE_7__["Provider"], {
  store: store,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 38
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_App__WEBPACK_IMPORTED_MODULE_3__["default"], {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 39
  },
  __self: undefined
})), document.getElementById('root')); // If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

_serviceWorker__WEBPACK_IMPORTED_MODULE_4__["unregister"]();

/***/ }),

/***/ "./src/middleware/index.js":
/*!*********************************!*\
  !*** ./src/middleware/index.js ***!
  \*********************************/
/*! exports provided: customWebsocketMiddleware */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "customWebsocketMiddleware", function() { return customWebsocketMiddleware; });
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions */ "./src/actions/index.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @giantmachines/redux-websocket */ "./node_modules/@giantmachines/redux-websocket/dist/index.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var throttle_debounce__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! throttle-debounce */ "./node_modules/throttle-debounce/dist/index.esm.js");



var temp = [{
  "type": "kinect",
  "data": {
    "name": "kinect-01",
    "simplifiedBodies": [{
      "bodyIndex": 0,
      "tracked": false
    }, {
      "bodyIndex": 1,
      "tracked": false
    }, {
      "bodyIndex": 2,
      "tracked": true,
      "joints": [{
        "cameraX": -0.3352165222167969,
        "cameraY": 0.6552982330322266,
        "cameraZ": 2.0847411155700684,
        "jointType": 3,
        "trackingState": 2
      }]
    }, {
      "bodyIndex": 3,
      "tracked": false
    }, {
      "bodyIndex": 4,
      "tracked": false
    }, {
      "bodyIndex": 5,
      "tracked": false
    }],
    "pos0": {
      "x": 12.5,
      "y": 12,
      "z": 34
    }
  }
}];

// var payloadDataChunkData_HARDCODED = temp[0].data; // This is used as a timeout for specific headNames, to set a previously active head (stand) to isNotActive

var timeoutSetActive = {}; // Kinect related functions

function clearKinectFocalPoint(store, kinectName) {
  console.log('clearKinectFocalPoint!', kinectName);
  store.dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_0__["kinectClearFocalPoints"])({
    kinectName: kinectName
  }));
}

var CLEAR_KINECT_FOCAL_POINTS_TIMEOUT = 5000; // Time of not getting message to then clear all focal points for that kinect.

var debouncedClearKinectFocalPointFns = {};
var customWebsocketMiddleware = function customWebsocketMiddleware(store) {
  return function (next) {
    return function (action) {
      if (action.type === _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1__["WEBSOCKET_MESSAGE"]) {
        var totalPayload; // parse through each payload

        try {
          totalPayload = JSON.parse(action.payload.data); // For each payload data 

          totalPayload.forEach(function (payloadDataChunk, i) {
            var payloadType = payloadDataChunk.type;
            var payloadDataChunkData = payloadDataChunk.data ? payloadDataChunk.data : {};

            switch (payloadType) {
              case "motion-line":
                var lineId = new Date().getTime() + "-" + i;
                var shape = "line"; //payloadDataChunkData.shape;

                var coords = [];

                try {
                  coords = payloadDataChunkData.p0;
                  coords = coords.concat(payloadDataChunkData.p1);
                } catch (e) {}

                store.dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_0__["motionLinesAddLine"])({
                  lineId: lineId,
                  shape: shape,
                  coords: coords
                }));
                setTimeout(function () {
                  store.dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_0__["motionLinesRemoveLine"])({
                    lineId: lineId
                  }));
                }, 600); // NOTE: this 1500ms should be the same value as what's in App.css for .MotionLine.fadeOut's keyframe animation

                break;

              case "active":
                try {
                  var headName;
                  var rotation;

                  try {
                    headName = payloadDataChunk.data.name;
                    store.dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_0__["standSetIsActive"])(headName));
                  } catch (e) {}

                  try {
                    rotation = payloadDataChunk.data.extra.rotation;
                    store.dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_0__["headRotateByHeadName"])(headName, rotation));
                  } catch (e) {}

                  clearTimeout(timeoutSetActive[headName]);
                  var setToNotActiveAfterDur = 10 * 1000; // e.g. 10 seconds

                  timeoutSetActive[headName] = setTimeout(function () {
                    store.dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_0__["standSetIsNotActive"])(headName));
                  }, setToNotActiveAfterDur);
                } catch (e) {}

                break;

              case "kinect":
                // window.c_kpl = payloadDataChunk;
                try {
                  // payloadDataChunk.data.simplifiedBodies[0].tracked
                  var JOINT_NUM = {
                    HEAD: 3
                  }; // var kinectName = payloadDataChunkData_HARDCODED.name;
                  // var simplifiedBodies = payloadDataChunkData_HARDCODED.simplifiedBodies;

                  var kinectName = payloadDataChunkData.name;
                  var simplifiedBodies = payloadDataChunkData.simplifiedBodies;
                  var validBodies = simplifiedBodies.filter(function (body) {
                    return body.tracked;
                  });
                  var focalPoints = validBodies.map(function (body) {
                    var joint_pos = {};

                    if (body.joints && body.joints.length > 0) {
                      // This is where we decide which of the joints to use as the 
                      var joint_pos = {};
                      body.joints.filter(function (joint) {
                        return joint.jointType === JOINT_NUM.HEAD;
                      }).forEach(function (joint) {
                        joint_pos = {
                          x: joint.cameraX,
                          y: joint.cameraY,
                          z: joint.cameraZ,
                          bodyIndex: body.bodyIndex
                        };
                      });
                    }

                    return joint_pos;
                  });
                  window.c_kk3 = {
                    kinect: true,
                    name: kinectName,
                    focalPoints: focalPoints,
                    payloadDataChunkData: payloadDataChunkData
                  };
                  store.dispatch(Object(_actions__WEBPACK_IMPORTED_MODULE_0__["kinectSetFocalPoints"])({
                    kinectName: kinectName,
                    focalPoints: focalPoints
                  })); // A debounce function which will clear all focal points for this particular kinect name
                  // This ensure that if a kinect stores sending messages that we don't still consider 
                  // the focal points it last sent were still there.

                  if (!debouncedClearKinectFocalPointFns[kinectName]) {
                    debouncedClearKinectFocalPointFns[kinectName] = Object(throttle_debounce__WEBPACK_IMPORTED_MODULE_2__["debounce"])(CLEAR_KINECT_FOCAL_POINTS_TIMEOUT, clearKinectFocalPoint);
                  }

                  debouncedClearKinectFocalPointFns[kinectName](store, kinectName);
                } catch (e) {
                  console.log(e);
                }

                break;

              default:
                break;
            }
          });
        } catch (e) {}
      } // window.c_cm = {
      //     store,
      //     next,
      //     action
      // };


      next(action);
    };
  };
};

/***/ }),

/***/ "./src/reducers/focalPoints.js":
/*!*************************************!*\
  !*** ./src/reducers/focalPoints.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! immutable */ "./node_modules/immutable/dist/immutable.es.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @giantmachines/redux-websocket */ "./node_modules/@giantmachines/redux-websocket/dist/index.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1__);
 // https://www.npmjs.com/package/@giantmachines/redux-websocket

 // import { WEBSOCKET_CONNECTING, WEBSOCKET_OPEN, WEBSOCKET_CLOSED, WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";
// Returns a new immutable object for a new focalPoint

var createNewFocalPoint = function createNewFocalPoint() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? undefined : _ref$name,
      _ref$pos = _ref.pos,
      pos = _ref$pos === void 0 ? {
    x: 0,
    y: 0
  } : _ref$pos,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? "default" : _ref$type,
      _ref$isActive = _ref.isActive,
      isActive = _ref$isActive === void 0 ? false : _ref$isActive,
      _ref$isSelected = _ref.isSelected,
      isSelected = _ref$isSelected === void 0 ? false : _ref$isSelected;

  var state = arguments.length > 1 ? arguments[1] : undefined;
  return Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])({
    name: name,
    pos: pos,
    isActive: isActive,
    type: type
  }); // return {
  //     "name": "focalPoint0",
  //     "pos": {
  //         "x": 0,//-1.5,
  //         "y": 0
  //     },
  // }
}; // const getNewName = (prefix, arrayObj) => {
//     let maxFocalPointNum = Math.max.apply(null, arrayObj.map(st => st.name).filter(d => d.indexOf(prefix) === 0).map(d => parseInt(d.replace(prefix, ""))).filter(d => !isNaN(d)))
//     if (maxFocalPointNum >= 0) {
//         return `${prefix}${maxFocalPointNum + 1}`;
//     } else {
//         return `${prefix}0`;
//     }
// }
// const getFocalPointIndexFromHeadName = (state, headName) => {
//     var temp = state.findIndex(focalPoint => focalPoint.getIn(["heads",0, "name"]) === headName)
//     return temp;
// };


var findFocalIndexByName = function findFocalIndexByName(state, name) {
  if (state) {
    return state.findIndex(function (fp) {
      return fp.get("name") === name;
    });
  }

  return -1;
};

var processWebsocketData = function processWebsocketData(state, payloadDataChunk) {
  var type = payloadDataChunk.type,
      data = payloadDataChunk.data; // let headName, heads, focalPointIndex, headIndex, rotation;

  var newState;

  switch (type) {
    case "focal-points":
      if (state.size > 30) return state;
      newState = state;

      if (typeof window !== 'undefined') {
        window.c__st824 = {
          state: state,
          data: data,
          type: type
        };
      } // Remove all focal points that aren't 'ui'


      newState = newState.filter(function (fp) {
        return fp.get('type') === 'ui';
      }); // Remove all focal points that are kinect
      // newState = newState.filter(fp => !fp.get('name') || fp.get('name').indexOf("k") !== 0);

      if (data && data.focal_points) {
        var _focalPoints = data.focal_points;

        if (_focalPoints.length > 0) {
          _focalPoints.forEach(function (fp) {
            var name = fp.name;
            var pos = fp.pos;
            var ttl = fp.ttl;
            var type = fp.fp_type || "kinect";
            var focalIndex;

            try {
              focalIndex = findFocalIndexByName(newState, name);
            } catch (e) {
              console.log('Error: focalPoint processWebsocketData. e: ', e);
            }

            ;

            if (focalIndex >= 0) {
              newState = newState.setIn([focalIndex, "pos"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(pos));
              newState = newState.setIn([focalIndex, "ttl"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(ttl));
            } else {
              newState = newState.push(createNewFocalPoint({
                name: name,
                pos: pos,
                type: type
              }, state));
            }
          });

          return newState;
        } //  else {
        //     //console.log("focal points, no payload", data);
        // }

      }

      return newState;
      break;

    case "focalpoint-positioned":
      // headName = data.headName;
      // rotation = data.rotation;
      // // position = data.position;
      // focalPointIndex = state.findIndex(focalPoint => {
      //     heads = focalPoint.get("heads");
      //     if (heads && heads.size > 0) {
      //         headIndex = heads.findIndex((head, i) => {
      //             return head.get("name") === headName;
      //         })
      //     }
      //     if (headIndex >= 0) {
      //         return true;
      //     } else {
      //         headIndex = undefined;
      //         return false;
      //     }
      // })
      // if (focalPointIndex >= 0 && headIndex >= 0) {
      //     // Convert position (0-200) to degrees (0 - 360)
      //     // rotation = 360 * position / 200;
      //     newState = state.setIn([focalPointIndex, "heads", headIndex, "rot"], rotation);
      //     // If the head isn't manually moving, do not move the virtual rotation of the head.
      //     if (!newState.getIn([focalPointIndex, "isManualHeadMove"])) {
      //         return newState.setIn([focalPointIndex, "heads", headIndex, "vRot"], rotation);
      //     } else {
      //         // Ignore the messages if head is manually being rotated within the UI
      //         return newState;
      //     }
      // }
      break;

    default:
      break;
  }

  return state;
};

var focalPoints = function focalPoints() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])([]);
  var action = arguments.length > 1 ? arguments[1] : undefined;
  window.c_sn_str = {
    state: state,
    action: action
  };
  var newState = state;
  var tempFocalPointIndex;

  switch (action.type) {
    // Websocket message
    // NOTE: This should probably be handles by the websocket middleware... which then sends specific dispatch (window.c_ )
    case _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1__["WEBSOCKET_MESSAGE"]:
      var totalPayload;

      try {
        totalPayload = JSON.parse(action.payload.data); // For each payload data 

        totalPayload.forEach(function (payloadDataChunk) {
          newState = processWebsocketData(newState, payloadDataChunk);
        });
        return newState;
      } catch (e) {}

      return state;

    case 'FOCALPOINT_ADD':
      return state.push(createNewFocalPoint({
        type: 'ui',
        name: "fp".concat(state.size)
      }, state));

    case 'FOCALPOINT_SETIN_FIELDS_BY_INDEX':
      // return state.setIn([action.index,"pos"], fromJS(action.pos));
      var setInLocation = [action.index];
      setInLocation = setInLocation.concat(action.fieldNames);
      return state.setIn(setInLocation, Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.value));

    case 'FOCALPOINT_SET_FIELD_BY_INDEX':
      return state.setIn([action.index, action.fieldName], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.value));

    case 'FOCALPOINT_MOVE_BY_INDEX':
      return state.setIn([action.index, "pos"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.pos));

    case 'FOCALPOINT_ROTATE_BY_INDEX':
      return state.setIn([action.index, "rot"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.rot));

    case 'FOCALPOINT_REMOVE_BY_INDEX':
      return state.remove(action.index);

    case 'FOCALPOINT_SET_SCENE':
      if (action.sceneData && action.sceneData.focalPoints && action.sceneData.focalPoints.length > 0) {
        return Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.sceneData.focalPoints);
      }

      return state;
    // // Active or not
    // case 'FOCALPOINT_SET_IS_ACTIVE':
    //     tempFocalPointIndex = getFocalPointIndexFromHeadName(state, action.headName);
    //     if (tempFocalPointIndex >= 0 ) {
    //         return state.setIn([tempFocalPointIndex, "isActive"], true);
    //     } else {
    //         return state;
    //     }
    // case 'FOCALPOINT_SET_IS_NOT_ACTIVE':
    //     tempFocalPointIndex = getFocalPointIndexFromHeadName(state, action.headName);
    //     if (tempFocalPointIndex >= 0 ) {
    //         return state.setIn([tempFocalPointIndex, "isActive"], false);
    //     } else {
    //         return state;
    //     }
    // Default

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (focalPoints);

/***/ }),

/***/ "./src/reducers/index.js":
/*!*******************************!*\
  !*** ./src/reducers/index.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu */ "./src/reducers/menu.js");
/* harmony import */ var _stands__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stands */ "./src/reducers/stands.js");
/* harmony import */ var _focalPoints__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./focalPoints */ "./src/reducers/focalPoints.js");
/* harmony import */ var _motionLines__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./motionLines */ "./src/reducers/motionLines.js");
/* harmony import */ var _kinectFocalPoints__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./kinectFocalPoints */ "./src/reducers/kinectFocalPoints.js");






/* harmony default export */ __webpack_exports__["default"] = (Object(redux__WEBPACK_IMPORTED_MODULE_0__["combineReducers"])({
  menu: _menu__WEBPACK_IMPORTED_MODULE_1__["default"],
  stands: _stands__WEBPACK_IMPORTED_MODULE_2__["default"],
  focalPoints: _focalPoints__WEBPACK_IMPORTED_MODULE_3__["default"],
  motionLines: _motionLines__WEBPACK_IMPORTED_MODULE_4__["default"],
  kinectFocalPoints: _kinectFocalPoints__WEBPACK_IMPORTED_MODULE_5__["default"]
}));

/***/ }),

/***/ "./src/reducers/kinectFocalPoints.js":
/*!*******************************************!*\
  !*** ./src/reducers/kinectFocalPoints.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! immutable */ "./node_modules/immutable/dist/immutable.es.js");

var initialState = {// e.g. { "kinect-01" : [ {x: _, y: _}, bodyIndex: 2  }}
  // // NOT THIS OLD ONE: e.g. { "kinect-01" : { focalPoints, pos: {x: _, y: _}, rot: -90 }}
};
console.log("**NEED TO SETUP A TIMEOUT IF WE GET NO MESSAGE FROM KINECT**");

var kinect = function kinect() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(initialState);
  var action = arguments.length > 1 ? arguments[1] : undefined;
  window.c_KK123 = {
    state: state,
    action: action
  };
  var newState = state; // let tempFocalPointIndex; 

  switch (action.type) {
    // Websocket message
    // NOTE: This should probably be handles by the websocket middleware... which then sends specific dispatch (window.c_ )
    // case WEBSOCKET_MESSAGE:
    //     let totalPayload;
    //     try {
    //         totalPayload = JSON.parse(action.payload.data);
    //         // For each payload data 
    //         totalPayload.forEach(payloadDataChunk => {
    //             newState = processWebsocketData(newState, payloadDataChunk);
    //         });
    //         return newState;
    //     } catch (e) { }
    //     return state;
    case 'KINECT_SET_FOCAL_POINTS':
      window.c_s89 = {
        state: state,
        action: action
      };
      return state.set(action.kinectName, Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.focalPoints));

    case 'KINECT_CLEAR_FOCAL_POINTS':
      return state.set(action.kinectName, Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])([]));
    // return state.setIn([action.kinectName, "focalPoints"], fromJS(action.focalPoints));
    // case 'KINECT_SET_SCENE':
    //     console.log("setting kinect scene");
    //     window.c_aa4 = action;
    //     try {
    //         let kinects = action.sceneData.kinects;
    //         kinects.forEach(kinect => {
    //             newState = newState.setIn(["kinects",kinect.name], fromJS(kinect))
    //         });
    //         return newState;
    //     } catch (e) {
    //         console.log(`error with KINECT_SET_SCENE`, e);
    //     }
    // // push(createNewFocalPoint({}, state));
    // // case 'KINECT_SETIN_FIELDS_BY_INDEX':
    // //     // return state.setIn([action.index,"pos"], fromJS(action.pos));
    // //     let setInLocation = [action.index];
    // //     setInLocation = setInLocation.concat(action.fieldNames);
    // //     return state.setIn(setInLocation, fromJS(action.value));
    // // case 'KINECT_SET_FIELD_BY_INDEX':
    // //     return state.setIn([action.index, action.fieldName], fromJS(action.value));
    // case 'KINECT_MOVE_BY_NAME':
    //     return state.setIn([action.kinectName, "pos"], fromJS(action.pos));
    // case 'KINECT_ROTATE_BY_NAME':
    //     return state.setIn([action.kinectName, "rot"], fromJS(action.rot));
    // case 'KINECT_REMOVE_BY_NAME':
    //     return state.remove(action.kinectName);
    // case 'KINECT_SET_SCENE':
    //     if (action.sceneData && action.sceneData.focalPoints && action.sceneData.focalPoints.length > 0) {
    //         return fromJS(action.sceneData.focalPoints);
    //     }
    //     return state;
    // // // Active or not
    // // case 'KINECT_SET_IS_ACTIVE':
    // //     tempFocalPointIndex = getFocalPointIndexFromHeadName(state, action.headName);
    // //     if (tempFocalPointIndex >= 0 ) {
    // //         return state.setIn([tempFocalPointIndex, "isActive"], true);
    // //     } else {
    // //         return state;
    // //     }
    // // case 'KINECT_SET_IS_NOT_ACTIVE':
    // //     tempFocalPointIndex = getFocalPointIndexFromHeadName(state, action.headName);
    // //     if (tempFocalPointIndex >= 0 ) {
    // //         return state.setIn([tempFocalPointIndex, "isActive"], false);
    // //     } else {
    // //         return state;
    // //     }
    // Default

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (kinect);

/***/ }),

/***/ "./src/reducers/menu.js":
/*!******************************!*\
  !*** ./src/reducers/menu.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! immutable */ "./node_modules/immutable/dist/immutable.es.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @giantmachines/redux-websocket */ "./node_modules/@giantmachines/redux-websocket/dist/index.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_2__);


 // NOTE: WEBSOCKET_MESSAGE is dealt within ../middleware/index.js
// ... which in turn handles the message and dispatches a specific type of dispatch message

var scale = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getCookie"])("menu-scale");
var translateX = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getCookie"])("menu-translateX");
var translateY = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getCookie"])("menu-translateY"); // window.c_34 = {setCookie, getCookie};

var initialState = {
  selectedStandIndex: undefined,
  selectedCameraIndex: undefined,
  selectedHeadIndex: undefined,
  selectedFocalPointIndex: undefined,
  isRotatesHidden: Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getCookieAsBoolean"])("menu-isRotatesHidden") || 0,
  isStandRotatesHidden: Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getCookieAsBoolean"])("menu-isStandRotatesHidden") || 0,
  isHeadRotatesHidden: Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getCookieAsBoolean"])("menu-isHeadRotatesHidden") || 0,
  isCameraRotatesHidden: Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getCookieAsBoolean"])("menu-isCameraRotatesHidden") || 0,
  isForceShowStandRotatesOnSelect: Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getCookieAsBoolean"])("menu-isForceShowStandRotatesOnSelect") || 0,
  isForceShowHeadRotatesOnSelect: Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getCookieAsBoolean"])("menu-isForceShowHeadRotatesOnSelect") || 0,
  isForceShowCameraRotatesOnSelect: Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["getCookieAsBoolean"])("menu-isForceShowCameraRotatesOnSelect") || 0,
  scale: scale !== null ? scale : 1,
  translate: {
    x: translateX !== null ? translateX : 0,
    y: translateY !== null ? translateY : 0
  },
  websocketStatus: undefined
};

var stands = function stands() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(initialState);
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var newState = state;

  switch (action.type) {
    case 'MENU_DESELECT_STAND_AND_ALL':
      newState = newState.set("selectedStandIndex", undefined);
      newState = newState.set("selectedHeadIndex", undefined);
      return newState.set("selectedCameraIndex", undefined);

    case 'MENU_SELECT_STAND':
      newState = newState.set("selectedStandIndex", parseInt(action.index));
      newState = newState.set("selectedHeadIndex", 0);
      return newState.set("selectedCameraIndex", 0);

    case 'MENU_SELECT_CAMERA':
      newState = state.set("selectedCameraIndex", parseInt(action.cameraIndex)); // If standIndex is defined set that as well

      if (action.standIndex) {
        newState = newState.set("selectedStandIndex", parseInt(action.standIndex));
      }

      return newState;

    case 'MENU_SELECT_HEAD':
      newState = state.set("selectedHeadIndex", parseInt(action.headIndex)); // If standIndex is defined set that as well

      if (action.standIndex) {
        newState = newState.set("selectedStandIndex", parseInt(action.standIndex));
      }

      return newState;

    case 'MENU_HIDE_ALL_ROTATES':
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isStandRotatesHidden", true);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isHeadRotatesHidden", true);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isCameraRotatesHidden", true);
      newState = state.set("isStandRotatesHidden", true);
      newState = newState.set("isHeadRotatesHidden", true);
      return newState.set("isCameraRotatesHidden", true);

    case 'MENU_SHOW_ALL_ROTATES':
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isStandRotatesHidden", false);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isHeadRotatesHidden", false);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isCameraRotatesHidden", false);
      newState = state.set("isStandRotatesHidden", false);
      newState = newState.set("isHeadRotatesHidden", false);
      return newState.set("isCameraRotatesHidden", false);

    case 'MENU_TOGGLE_HIDE_ROTATES':
      if (action.rotateType === "stand") {
        Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isStandRotatesHidden", !state.get("isStandRotatesHidden"));
        return state.set("isStandRotatesHidden", !state.get("isStandRotatesHidden"));
      } else if (action.rotateType === "head") {
        Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isHeadRotatesHidden", !state.get("isHeadRotatesHidden"));
        return state.set("isHeadRotatesHidden", !state.get("isHeadRotatesHidden"));
      } else if (action.rotateType === "camera") {
        Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isCameraRotatesHidden", !state.get("isCameraRotatesHidden"));
        return state.set("isCameraRotatesHidden", !state.get("isCameraRotatesHidden"));
      }

      break;

    case 'MENU_ENABLE_FORCE_SHOW_ALL_ROTATES_ON_SELECT':
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isForceShowStandRotatesOnSelect", true);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isForceShowHeadRotatesOnSelect", true);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isForceShowCameraRotatesOnSelect", true);
      newState = state.set("isForceShowStandRotatesOnSelect", true);
      newState = newState.set("isForceShowHeadRotatesOnSelect", true);
      return newState.set("isForceShowCameraRotatesOnSelect", true);

    case 'MENU_DISABLE_FORCE_SHOW_ALL_ROTATES_ON_SELECT':
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isForceShowStandRotatesOnSelect", false);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isForceShowHeadRotatesOnSelect", false);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isForceShowCameraRotatesOnSelect", false);
      newState = state.set("isForceShowStandRotatesOnSelect", false);
      newState = newState.set("isForceShowHeadRotatesOnSelect", false);
      return newState.set("isForceShowCameraRotatesOnSelect", false);

    case 'MENU_TOGGLE_FORCE_SHOW_ROTATES_ON_SELECT':
      if (action.rotateType === "stand") {
        Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isForceShowStandRotatesOnSelect", !state.get("isForceShowStandRotatesOnSelect"));
        return state.set("isForceShowStandRotatesOnSelect", !state.get("isForceShowStandRotatesOnSelect"));
      } else if (action.rotateType === "head") {
        Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isForceShowHeadRotatesOnSelect", !state.get("isForceShowHeadRotatesOnSelect"));
        return state.set("isForceShowHeadRotatesOnSelect", !state.get("isForceShowHeadRotatesOnSelect"));
      } else if (action.rotateType === "camera") {
        Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-isForceShowCameraRotatesOnSelect", !state.get("isForceShowCameraRotatesOnSelect"));
        return state.set("isForceShowCameraRotatesOnSelect", !state.get("isForceShowCameraRotatesOnSelect"));
      }

      break;

    case 'MENU_SET_SCALE':
      var scaleVal = Math.max(1, action.scale);
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-scale", scaleVal);
      return state.set("scale", scaleVal);

    case 'MENU_SET_TRANSLATE_X':
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-translateX", action.x);
      return state.setIn(["translate", "x"], action.x);

    case 'MENU_SET_TRANSLATE_Y':
      Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["setCookie"])("menu-translateY", action.y);
      return state.setIn(["translate", "y"], action.y);
    // case 'MENU_SET_TRANSLATE':
    //     return state.setIn(["translate","y"], action.y);

    case _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_2__["WEBSOCKET_CONNECTING"]:
      return state.set("websocketStatus", "connecting");

    case _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_2__["WEBSOCKET_OPEN"]:
      return state.set("websocketStatus", "open");

    case _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_2__["WEBSOCKET_CLOSED"]:
      return state.set("websocketStatus", undefined);

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (stands);

/***/ }),

/***/ "./src/reducers/motionLines.js":
/*!*************************************!*\
  !*** ./src/reducers/motionLines.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! immutable */ "./node_modules/immutable/dist/immutable.es.js");
 // lines have a lineId and value of { shape: "draw", coords: [1,2,3,4]}

var initialState = {
  lines: {} // lines: {
  //     "temp123" : {shape: "line", coords: [-0.75, 0, 0.906222523654036, -4.717724764347858]}
  // },

};

var stands = function stands() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(initialState);
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'MOTIONLINES_ADD':
      return state.setIn(["lines", action.lineId], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])({
        shape: action.shape,
        coords: action.coords
      }));

    case 'MOTIONLINES_REMOVE':
      return state.removeIn(["lines", action.lineId]);

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (stands);

/***/ }),

/***/ "./src/reducers/stands.js":
/*!********************************!*\
  !*** ./src/reducers/stands.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! immutable */ "./node_modules/immutable/dist/immutable.es.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @giantmachines/redux-websocket */ "./node_modules/@giantmachines/redux-websocket/dist/index.js");
/* harmony import */ var _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1__);
 // https://www.npmjs.com/package/@giantmachines/redux-websocket

 // import { WEBSOCKET_CONNECTING, WEBSOCKET_OPEN, WEBSOCKET_CLOSED, WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";

var defaultCamera = {
  "name": "camera0",
  "pos": {
    "x": 0.1,
    "y": 0
  },
  "rot": 0,
  "fov": 60,
  "description": "Raspberry Pi PiNoir Camera V2 Video Module"
};
var defaultHead = {
  "name": "head0",
  "pos": {
    "x": 0,
    "y": 0
  },
  "rot": 0,
  "vRot": 0 // Virtual rotation (i.e. the manual rotation of the head)

};

var createNewCamera = function createNewCamera(_ref, camerasArray) {
  var _ref$name = _ref.name,
      name = _ref$name === void 0 ? undefined : _ref$name;
  var camera = Object.assign({}, defaultCamera);
  camera.name = getNewName('camera', camerasArray);
  return camera;
}; // Returns a new immutable object for a new stand


var createNewStand = function createNewStand() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$name = _ref2.name,
      name = _ref2$name === void 0 ? undefined : _ref2$name,
      _ref2$pos = _ref2.pos,
      pos = _ref2$pos === void 0 ? {
    x: 0,
    y: 0
  } : _ref2$pos,
      _ref2$rot = _ref2.rot,
      rot = _ref2$rot === void 0 ? 0 : _ref2$rot,
      _ref2$cameras = _ref2.cameras,
      cameras = _ref2$cameras === void 0 ? [defaultCamera] : _ref2$cameras,
      _ref2$kinects = _ref2.kinects,
      kinects = _ref2$kinects === void 0 ? [] : _ref2$kinects,
      _ref2$heads = _ref2.heads,
      heads = _ref2$heads === void 0 ? [defaultHead] : _ref2$heads,
      _ref2$popupInfo = _ref2.popupInfo,
      popupInfo = _ref2$popupInfo === void 0 ? undefined : _ref2$popupInfo,
      _ref2$isActive = _ref2.isActive,
      isActive = _ref2$isActive === void 0 ? false : _ref2$isActive,
      _ref2$isManualHeadMov = _ref2.isManualHeadMove,
      isManualHeadMove = _ref2$isManualHeadMov === void 0 ? false : _ref2$isManualHeadMov;

  var state = arguments.length > 1 ? arguments[1] : undefined;

  if (!name) {
    name = getNewName("stand", state.toJS());
  }

  return Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])({
    name: name,
    pos: pos,
    rot: rot,
    cameras: cameras,
    kinects: kinects,
    heads: heads,
    popupInfo: popupInfo,
    isActive: isActive,
    isManualHeadMove: isManualHeadMove
  }); // return {
  //     "name": "stand0",
  //     "pos": {
  //         "x": 0,//-1.5,
  //         "y": 0
  //     },
  //     "rot": 0 //300,
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
  // }
};

var getNewName = function getNewName(prefix, arrayObj) {
  var maxStandNum = Math.max.apply(null, arrayObj.map(function (st) {
    return st.name;
  }).filter(function (d) {
    return d.indexOf(prefix) === 0;
  }).map(function (d) {
    return parseInt(d.replace(prefix, ""));
  }).filter(function (d) {
    return !isNaN(d);
  }));

  if (maxStandNum >= 0) {
    return "".concat(prefix).concat(maxStandNum + 1);
  } else {
    return "".concat(prefix, "0");
  }
};

var getStandIndexFromHeadName = function getStandIndexFromHeadName(state, headName) {
  var temp = state.findIndex(function (stand) {
    return stand.getIn(["heads", 0, "name"]) === headName;
  });
  return temp;
};

function rotateHeadByHeadName(_ref3) {
  var state = _ref3.state,
      headName = _ref3.headName,
      rotation = _ref3.rotation;
  var heads, standIndex, headIndex;
  var newState = state;
  standIndex = state.findIndex(function (stand) {
    heads = stand.get("heads");

    if (heads && heads.size > 0) {
      headIndex = heads.findIndex(function (head, i) {
        return head.get("name") === headName;
      });
    }

    if (headIndex >= 0) {
      return true;
    } else {
      headIndex = undefined;
      return false;
    }
  });

  if (standIndex >= 0 && headIndex >= 0) {
    // Convert position (0-200) to degrees (0 - 360)
    // rotation = 360 * position / 200;
    newState = state.setIn([standIndex, "heads", headIndex, "rot"], rotation); // If the head isn't manually moving, do not move the virtual rotation of the head.

    if (!newState.getIn([standIndex, "isManualHeadMove"])) {
      return newState.setIn([standIndex, "heads", headIndex, "vRot"], rotation);
    } else {
      // Ignore the messages if head is manually being rotated within the UI
      return newState;
    }
  }

  return state;
}

var processWebsocketData = function processWebsocketData(state, payloadDataChunk) {
  var type = payloadDataChunk.type,
      data = payloadDataChunk.data;
  var headName, heads, standIndex, headIndex, rotation; // let newState = state;
  // let headName, position, heads, standIndex, cameraIndex, headIndex, rotation;

  switch (type) {
    case "head-positioned":
      headName = data.headName;
      rotation = data.rotation;
      return rotateHeadByHeadName({
        state: state,
        headName: headName,
        rotation: rotation
      });
      break;

    default:
      break;
  }

  return state;
};

var stands = function stands() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])([]);
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var newState;
  var tempStandIndex;

  switch (action.type) {
    // Websocket message
    // NOTE: This should probably be handles by the websocket middleware... which then sends specific dispatch (window.c_ )
    case _giantmachines_redux_websocket__WEBPACK_IMPORTED_MODULE_1__["WEBSOCKET_MESSAGE"]:
      newState = state;
      var totalPayload;

      try {
        totalPayload = JSON.parse(action.payload.data); // For each payload data 

        totalPayload.forEach(function (payloadDataChunk) {
          newState = processWebsocketData(newState, payloadDataChunk);
        });
        return newState;
      } catch (e) {
        return state;
      }

    case 'STAND_ADD':
      return state.push(createNewStand({}, state));

    case 'STAND_SETIN_FIELDS_BY_INDEX':
      // return state.setIn([action.index,"pos"], fromJS(action.pos));
      var setInLocation = [action.index];
      setInLocation = setInLocation.concat(action.fieldNames);
      return state.setIn(setInLocation, Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.value));

    case 'STAND_SET_FIELD_BY_INDEX':
      return state.setIn([action.index, action.fieldName], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.value));

    case 'STAND_MOVE_BY_INDEX':
      return state.setIn([action.index, "pos"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.pos));

    case 'STAND_ROTATE_BY_INDEX':
      return state.setIn([action.index, "rot"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.rot));

    case 'STAND_REMOVE_BY_INDEX':
      return state.remove(action.index);
    // Head

    case 'HEAD_MOVE_BY_INDEX':
      return state.setIn([action.standIndex, "heads", action.headIndex, "pos"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.pos));

    case 'HEAD_ROTATE_BY_HEADNAME':
      return rotateHeadByHeadName({
        state: state,
        headName: action.headName,
        rotation: action.rotation
      });
    // console.log('HEAD_ROTATE_BY_HEADNAME');
    // // Get stand and head index with the headname
    // let standIndex = getStandIndexFromHeadName(state, action.headName);
    // let headIndex = 0;
    // return newState.setIn([standIndex, "heads", headIndex, "vRot"], fromJS(action.rot));
    // // newState = newState.setIn([standIndex, "heads", headIndex, "vRot"], fromJS(action.rot));
    // // return newState.setIn([standIndex, "heads", headIndex, "rot"], fromJS(action.rot));

    case 'HEAD_ROTATE_BY_INDEX':
      return state.setIn([action.standIndex, "heads", action.headIndex, "vRot"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.rot));
    // newState = state.setIn([action.standIndex, "heads", action.headIndex, "rot"], fromJS(action.rot));
    // return newState.setIn([action.standIndex, "heads", action.headIndex, "rot"], fromJS(action.rot));

    case 'HEAD_ROTATE_START_BY_INDEX':
      return state.setIn([action.standIndex, "isManualHeadMove"], true);

    case 'HEAD_ROTATE_STOP_BY_INDEX':
      return state.setIn([action.standIndex, "isManualHeadMove"], false);
    // Camera

    case 'CAMERA_MOVE_BY_INDEX':
      // window.c_CAM342 = { arr: [action.standIndex,"cameras",action.cameraIndex,"pos"], pos: fromJS(action.pos)};
      return state.setIn([action.standIndex, "cameras", action.cameraIndex, "pos"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.pos));

    case 'CAMERA_ROTATE_BY_INDEX':
      return state.setIn([action.standIndex, "cameras", action.cameraIndex, "rot"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.rot));

    case 'CAMERA_ADD_NEW':
      var camerasList = state.getIn([action.standIndex, "cameras"]).toJS();
      return state.updateIn([action.standIndex, "cameras"], function (cameras) {
        return cameras.push(Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(createNewCamera({}, camerasList)));
      });

    case 'CAMERA_REMOVE_BY_INDEX':
      console.log("rem", action.standIndex, action.cameraIndex);
      return state.removeIn([action.standIndex, "cameras", action.cameraIndex]);
    // Kinect

    case 'KINECT_MOVE_BY_INDEX':
      return state.setIn([action.standIndex, "kinects", action.kinectIndex, "pos"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.pos));

    case 'KINECT_ROTATE_BY_INDEX':
      return state.setIn([action.standIndex, "kinects", action.kinectIndex, "rot"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.rot));
    // Scene

    case 'STAND_SET_SCENE':
      if (action.sceneData && action.sceneData.stands && action.sceneData.stands.length > 0) {
        return Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])(action.sceneData.stands);
      }

      return state;
    // Active or not

    case 'STAND_SET_IS_ACTIVE':
      tempStandIndex = getStandIndexFromHeadName(state, action.headName);

      if (tempStandIndex >= 0) {
        return state.setIn([tempStandIndex, "isActive"], true);
      } else {
        return state;
      }

    case 'STAND_SET_IS_NOT_ACTIVE':
      tempStandIndex = getStandIndexFromHeadName(state, action.headName);

      if (tempStandIndex >= 0) {
        return state.setIn([tempStandIndex, "isActive"], false);
      } else {
        return state;
      }

    // Popup

    case 'POPUP_INFO_MOVE_BY_INDEX':
      return state;
    //state.setIn(["popups", action.popupId], {type: action.popupType});

    case 'POPUP_INFO_ADD_NEW':
      return state.setIn([action.standIndex, "popupInfo"], Object(immutable__WEBPACK_IMPORTED_MODULE_0__["fromJS"])({
        pos: action.pos
      }));

    case 'POPUP_INFO_REMOVE':
      return state.removeIn([action.standIndex, "popupInfo"]);

    case 'POPUP_INFO_REMOVE_ALL':
      newState = state;

      for (var i = 0; i < state.size; i++) {
        newState = newState.removeIn([i, "popupInfo"]);
      }

      return newState;
    // Default

    default:
      return state;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (stands);

/***/ }),

/***/ "./src/serviceWorker.js":
/*!******************************!*\
  !*** ./src/serviceWorker.js ***!
  \******************************/
/*! exports provided: register, unregister */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register", function() { return register; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unregister", function() { return unregister; });
// This optional code is used to register a service worker.
// register() is not called by default.
// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.
// To learn more about the benefits of this model and instructions on how to
// opt-in, read http://bit.ly/CRA-PWA
var isLocalhost = Boolean(window.location.hostname === 'localhost' || // [::1] is the IPv6 localhost address.
window.location.hostname === '[::1]' || // 127.0.0.1/8 is considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
function register(config) {
  if (false) { var publicUrl; }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker.register(swUrl).then(function (registration) {
    registration.onupdatefound = function () {
      var installingWorker = registration.installing;

      if (installingWorker == null) {
        return;
      }

      installingWorker.onstatechange = function () {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // At this point, the updated precached content has been fetched,
            // but the previous service worker will still serve the older
            // content until all client tabs are closed.
            console.log('New content is available and will be used when all ' + 'tabs for this page are closed. See http://bit.ly/CRA-PWA.'); // Execute callback

            if (config && config.onUpdate) {
              config.onUpdate(registration);
            }
          } else {
            // At this point, everything has been precached.
            // It's the perfect time to display a
            // "Content is cached for offline use." message.
            console.log('Content is cached for offline use.'); // Execute callback

            if (config && config.onSuccess) {
              config.onSuccess(registration);
            }
          }
        }
      };
    };
  }).catch(function (error) {
    console.error('Error during service worker registration:', error);
  });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl).then(function (response) {
    // Ensure service worker exists, and that we really are getting a JS file.
    var contentType = response.headers.get('content-type');

    if (response.status === 404 || contentType != null && contentType.indexOf('javascript') === -1) {
      // No service worker found. Probably a different app. Reload the page.
      navigator.serviceWorker.ready.then(function (registration) {
        registration.unregister().then(function () {
          window.location.reload();
        });
      });
    } else {
      // Service worker found. Proceed as normal.
      registerValidSW(swUrl, config);
    }
  }).catch(function () {
    console.log('No internet connection found. App is running in offline mode.');
  });
}

function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.unregister();
    });
  }
}

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/aj/Work/code/heads/heads2/heads/boss-ui/src/index.js */"./src/index.js");


/***/ })

},[[0,"runtime~main",0]]]);
//# sourceMappingURL=main.chunk.js.map