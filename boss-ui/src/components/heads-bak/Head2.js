// // // https://github.com/nowgoant/react-rnd
// // // https://www.npmjs.com/package/react-rnd-rotate#install
// // // https://codesandbox.io/s/y3997qply9

// // import React, { Component } from 'react'
// // import Rnd from 'react-rnd-rotate';

// // const style = {
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     border: "solid 1px #ddd",
// //     background: "#f0f0f0"
// // };

// // class Head extends Component {
// //     render() {
// //         return (
// //             <Rnd
// //                 style={style}
// //                 default={{
// //                     x: 0,
// //                     y: 0,
// //                     width: 100,
// //                     height: 100,
// //                 }}
                
// //                 enableResizing={{ 
// //                     // top: false,
// //                     // right: false,
// //                     // bottom: false,
// //                     // left: false,
// //                     // topRight: false,
// //                     // bottomRight: false,
// //                     // bottomLeft: false,
// //                     // topLeft: false,
// //                     rotate: true
// //                 }}

// //                 onResizeStart={(obj)=> { console.log('start', obj); window.c_ost = obj }}
// //                 onResize={(obj)=> { console.log(obj); window.c_o = obj }}
// //                 onResizeStop={(obj)=> { console.log('stop', obj); window.c_osp = obj }}

// //                 // handleDrag={(obj)=> { console.log(obj); window.c_dr = obj }}
// //             >
// //                 {this.props.name}
// //             </Rnd>
// //         );
// //     }
// // }

// // export default Head;

// // -----------
// // https://github.com/nowgoant/react-rnd
// // https://www.npmjs.com/package/react-rnd-rotate#install
// // https://codesandbox.io/s/y3997qply9

// // https://github.com/mockingbot/react-resizable-rotatable-draggable#readme
// // https://www.npmjs.com/package/react-resizable-rotatable-draggable

// import React, { Component } from 'react'
// import Draggable from 'react-draggable';
// // import 'react-rotatable/dist/css/rotatable.min.css';

// class Head extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             vals : "nothing"
//         }
//         this.handleStart = this.handleStart.bind(this);
//         this.handleDrag = this.handleDrag.bind(this);
//         this.handleStop = this.handleStop.bind(this);

//         // onTouchCancel onTouchEnd onTouchMove onTouchStart
//         this.handleTouchCancel = this.handleTouchCancel.bind(this);
//         this.handleTouchStart = this.handleTouchStart.bind(this);
//         this.handleTouchMove = this.handleTouchMove.bind(this);
//         this.handleTouchEnd = this.handleTouchEnd.bind(this);

//         this.handleDrag = this.handleDrag.bind(this);
//         this.handleDragEnd = this.handleDragEnd.bind(this);
//         this.handleDragEnter = this.handleDragEnter.bind(this);
//         this.handleDragExit = this.handleDragExit.bind(this);
//         this.handleDragLeave = this.handleDragLeave.bind(this);
//         this.handleDragOver = this.handleDragOver.bind(this);
//         this.handleDragStart = this.handleDragStart.bind(this);
//     }

//     eventLogger = (e, data) => {
//         console.log('Event: ', e);
//         console.log('Data: ', data);
//     };

//     handleStart(e, data) {
//         console.log("Jimc");
//     }
//     // handleDrag(e, data) {
//     //     console.log("Jimb");
//     // }
//     handleStop(e, data) {
//         console.log("Jima");
//     }

//     // Touch
//     handleTouchCancel(e, data) {
//         console.log("can",e, data);
//     } 
//     handleTouchEnd(e, data) {
//         console.log("end",e, data);
//     } 
//     handleTouchMove(e, data) {
//         console.log("move",e, data);
//     } 
//     handleTouchStart(e, data) {
//         console.log("start",e, data);
//     }

//     // mouse
//     handleDrag(e, data) {
//         console.log("drag", e, data);
//     }
//     handleDragEnd(e, data) {
//         console.log("dragEnd", e, data);
//     }
//     handleDragEnter(e, data) {
//         console.log("dragEnter", e, data);
//     }
//     handleDragExit(e, data) {
//         console.log("drag Exit", e, data);
//     }
//     handleDragLeave(e, data) {
//         console.log("drag Leave", e, data);
//     }
//     handleDragOver(e, data) {
//         console.log("drag Over", e, data);
//     }
//     handleDragStart(e, data) {
//         console.log("drag Start", e, data);
//     }

//     render() {
//       const style = {
//         position: 'relative',
//         width: '100px',
//         height: '100px',
//         border: '1px solid black',
//         // position: 'absolute',
//         top: '100px',
//         left: '100px',
//       };

//       const style_handle = {
//           width: '50px',
//           height: '50px',
//           border: '1px solid blue'
//       }

//       const style_handle_rotate = {
//         position: "absolute",
//         width: "50px",
//         height: "50px",
//         border: '1px solid blue',
//         top: '0',
//         left: '50%',
//         marginLeft: '-25px',
//         marginTop: '-50px',
//         padding: '0',
//       }
  
//       return (
//         <div>
//             <div style={{position: 'absolute', top: 0, right: 0 }}>{this.state.vals}</div>
//             <Draggable
//                 // axis="x"
//                 handle=".handle"
//                 // defaultPosition={{x: 0, y: 0}}
//                 // position={null}
//                 // grid={[25, 25]}
//                 // onStart={this.handleStart}
//                 // handleDrag={this.handleDrag}
//                 // onStop={this.handleStop}
//                 >
//             <div style={style}>
//                 <div className="handle" style={style_handle}>HAN</div>
//                 <div className="handleRotate noselect" 
//                     style={style_handle_rotate}
//                     onTouchStart={this.handleTouchStart}
//                     onTouchMove={this.handleTouchMove}
//                     onTouchEnd={this.handleTouchEnd}
//                     onTouchCancel={this.handleTouchCancel}

//                     draggable="true"
//                     onDrag = {this.handleDrag}
//                     onDragEnd = {this.handleDragEnd}
//                     onDragEnter = {this.handleDragEnter}
//                     onDragExit = {this.handleDragExit}
//                     onDragLeave = {this.handleDragLeave}
//                     onDragOver = {this.handleDragOver}
//                     onDragStart = {this.handleDragStart}

//                     onMouseDown = {() => console.log('down')}
//                     onMouseUp = {() => console.log('up')}
//                     onMouseEnter = {()=> console.log('enter')}
//                     onMouseLeave = {()=> console.log('le')}
//                 >ROT</div>
//                 Rotate me
//             </div>
//             </Draggable>
//         </div>
//       );
//     }
//   }

// export default Head;