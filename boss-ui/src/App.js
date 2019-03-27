import React from 'react'
import Menu from './containers/Menu'
import Scene from './containers/Scene'
import './App.css';
// import {scale, rotate, translate, compose, applyToPoint} from 'transformation-matrix';
// window.c_tm = {scale, rotate, translate, compose, applyToPoint};

const App = () => (
  <div>
    <Menu />
    <Scene />
  </div>
)

export default App

// import React, { Component } from 'react';
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


