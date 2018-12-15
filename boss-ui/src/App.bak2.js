import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import Head from './components/Head';

// Disable the scrolling of the page.
const bodyScrollLock = require('body-scroll-lock');
const disableBodyScroll = bodyScrollLock.disableBodyScroll;
// const enableBodyScroll = bodyScrollLock.enableBodyScroll;

// const targetElement = document.querySelector("html")
disableBodyScroll(document.querySelector("html"));
disableBodyScroll(document.querySelector("body"));

// window.c_b = bodyScrollLock;

class App extends Component {
  // constructor() {
  //   super();

  //   // this.state = {
  //   //   heads : []
  //   // }
  //   // this.addHead = this.addHead.bind(this);
  // }

  // addHead() {
  //   const headNum = this.state.heads.length;
  //   const newHead = <Head key={headNum} name={`H${headNum}`} />
  //   this.setState({
  //     heads : this.state.heads.concat(newHead)
  //   });
  // }

  render() {
    return (
      <div style={{textAlign: "left"}} className="App">
        hi
      </div>
    );
  }
  // render() {
  //   return (
  //     <div style={{textAlign: "left"}} className="App">
  //       <div style={{position: "absolute", padding: "20px", "border": "1px solid blue"}} onClick={this.addHead}>+ head</div>
  //       <Heads/>
  //     </div>
  //   );
  // }
}

export default App;
