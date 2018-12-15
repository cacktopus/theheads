import React from 'react'
// import Footer from './Footer'
import Menu from './containers/Menu'
import Stands from './containers/Stands'
// import VisibleTodoList from '../containers/VisibleTodoList'
import './App.css';

const App = () => (
  <div>
    <Menu />
    <Stands />
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


