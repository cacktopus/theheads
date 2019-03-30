import React from 'react';
//import Heads from '../containers/Heads'
// import Draggable from 'react-draggable'; 
import Draggable, { DraggableCore } from 'react-draggable';
// import FocalPoint from '../containers/FocalPoint';
import cn from "classnames";
import PopupInfo from '../containers/PopupInfo';

import {encodeRot, decodeRot, encodePos, decodePos, noTouchMove} from '../helpers';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };

        // this.onMouseDown = this.onMouseDown.bind(this);

        this.togglePopupInfo = this.togglePopupInfo.bind(this);

        this.handleMoveStart = this.handleMoveStart.bind(this);
        this.handleMoveDrag = this.handleMoveDrag.bind(this);
        this.handleMoveStop = this.handleMoveStop.bind(this);

        this.handleRotateStart = this.handleRotateStart.bind(this);
        this.handleRotateDrag = this.handleRotateDrag.bind(this);
        this.handleRotateStop = this.handleRotateStop.bind(this);

        // this.handleMoveDragEnd = this.handleMoveDragEnd.bind(this);
        // this.handleMoveDragEnter = this.handleMoveDragEnter.bind(this);
        // this.handleMoveDragExit = this.handleMoveDragExit.bind(this);
        // this.handleMoveDragLeave = this.handleMoveDragLeave.bind(this);
        // this.handleMoveDragOver = this.handleMoveDragOver.bind(this);
        // this.handleMoveDragStart = this.handleMoveDragStart.bind(this);

        // Refs
        this.FocalPointRotateHandle = React.createRef();
        this.FocalPointMoveHandle = React.createRef();
    }

    componentDidMount() {
        noTouchMove(this.FocalPointRotateHandle.current);
        noTouchMove(this.FocalPointMoveHandle.current);
    }

    // handleMoveDrag = {this.handleMoveDrag}
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

    togglePopupInfo(e) {
        if (!this.props.popupInfo) {
            // The x and y of the Scene
            var {x, y} = document.getElementById("Scene").getBoundingClientRect();

            const clickPos = { x: e.nativeEvent.clientX - x, y: e.nativeEvent.clientY - y };

            this.props.popupInfoAddNew(clickPos);
        } else {
            this.props.popupInfoRemove();
        }
    }

    // Move
    handleMoveStart(e, a) {
        this.props.focalPointSelect();
        // console.log("h str", e, a);
        // this.props.focalPointMove(1,a.)
    }

    handleMoveDrag(e, a) {
        // console.log("h dr", e, a);
        const { x, y } = a;
        const pos = encodePos(this.props.menu, { x, y });
        // const pos = encrypt1({ x, y });
        // const pos = { x, y };
        // Convert the values 

        this.props.focalPointMove(pos);
        // this.setState({ pos });
    }

    handleMoveStop(e, a) {
    }

    // Rotate
    handleRotateStart(e, a) {
        this.props.focalPointSelect();
    }

    handleRotateDrag(e, a) {
        const { x, y } = a;
        var rad = Math.atan2(y, x); // In radians
        var deg = encodeRot(rad * (180 / Math.PI));
        // var deg = rad * (180 / Math.PI);

        this.props.focalPointRotate(deg);
    }

    handleRotateStop(e, a) {
        // console.log("hrlt stop", e, a);
    }

    render() {
        const focalPoint = this.props.focalPoint;
        const isActive = focalPoint.get("isActive");
        // let pos = {x: 0, y:0};
        let pos = decodePos(this.props.menu, focalPoint.get("pos").toJS());

        // let pos = decrypt1(focalPoint.get("pos").toJS());
        // let pos = focalPoint.get("pos").toJS();
        pos.x = isNaN(pos.x) || pos.x === "" ? 0 : pos.x;
        pos.y = isNaN(pos.y) || pos.y === "" ? 0 : pos.y;

        let rot = focalPoint.get("rot");
        rot = isNaN(rot) ? 0 : rot;
        rot = decodeRot(rot); // flip it so rotation is opposite direction.

        const FocalPointIndex = this.props.menu.get("FocalPointIndex");
        const isSelected = FocalPointIndex === this.props.index;

        const heads = focalPoint.get("heads");
        const cameras = focalPoint.get("cameras");

        // const focalPointStyle = {transform:`translate(${focalPoint.pos.x}px, ${focalPoint.pos.y}px)`}
        // console.log('ren');

        // try {
        //     pos = focalPoint.get("pos");
        // } catch(e) {}

        let popupInfo;

        if (this.props.popupInfo) {
            popupInfo = (
                <div className="FocalPoint-popupInfo">
                    <PopupInfo focalPointIndex={this.props.index} pos={this.props.popupInfo.get("pos")}/>
                </div>
            );
        }

        const FocalPointRotatesHidden = this.props.menu.get("FocalPointRotatesHidden");
        const FocalPointRotatesOnSelect = this.props.menu.get("FocalPointRotatesOnSelect");
        const FocalPointRotator = !FocalPointRotatesHidden || (isSelected && FocalPointRotatesOnSelect);

        const focalPointName = focalPoint.get("name");

        return (
            <div className={cn("FocalPoint", { "FocalPoint--selected": isSelected, "FocalPoint--active" : isActive })} >
                <Draggable
                    handle=".FocalPoint-move-handle"
                    defaultPosition={{ x: 0, y: 0 }}
                    // position={null}
                    position={pos}
                    // grid={[25, 25]}
                    onStart={this.handleMoveStart}
                    onDrag={this.handleMoveDrag}
                    onStop={this.handleMoveStop}
                >
                    {/* <DraggableCore
                        // allowAnyClick= boolean,
                        // cancel= string,
                        // disabled= boolean,
                        // enableUserSelectHack= boolean,
                        // offsetParent= HTMLElement,
                        // grid= [number, number],
                        handle=".FocalPoint-rotate"
                        // onStart={this.handleRotateStart}
                        // onDrag={this.handleRotateDrag}
                        // onStop={this.handleRotateStop}
                        // onMouseDown= (e= MouseEvent) => void
                    > */}

                    <div className="FocalPoint-move-handle" onClick={this.props.focalPointSelect}>FP{this.props.index}</div>

                    {/* <div ref={this.FocalPoint} className={cn("FocalPoint", { "FocalPoint--selected": isSelected, "FocalPoint--active" : isActive })} onClick={this.props.focalPointSelect}> */}
                    {/* <div ref={this.FocalPoint} id={`FocalPoint-${focalPointName}`} className={cn("FocalPoint", { "FocalPoint--selected": isSelected, "FocalPoint--active" : isActive })} onClick={this.props.focalPointSelect}> */}

                </Draggable>
            </div>
        );
        // return (
        //     <Draggable
        //         handle=".FocalPoint-move"
        //         defaultPosition={{ x: 0, y: 0 }}
        //         // position={null}
        //         position={pos}
        //         // grid={[25, 25]}
        //         onStart={this.handleMoveStart}
        //         onDrag={this.handleMoveDrag}
        //         onStop={this.handleMoveStop}
        //     >
        //         {/* <DraggableCore
        //             // allowAnyClick= boolean,
        //             // cancel= string,
        //             // disabled= boolean,
        //             // enableUserSelectHack= boolean,
        //             // offsetParent= HTMLElement,
        //             // grid= [number, number],
        //             handle=".FocalPoint-rotate"
        //             // onStart={this.handleRotateStart}
        //             // onDrag={this.handleRotateDrag}
        //             // onStop={this.handleRotateStop}
        //             // onMouseDown= (e= MouseEvent) => void
        //         > */}

        //         <div ref={this.FocalPoint} id={`FocalPoint-${focalPointName}`} className={cn("FocalPoint", { "FocalPoint--selected": isSelected, "FocalPoint--active" : isActive })} onClick={this.props.focalPointSelect}>
        //             {popupInfo}
        //             <div className="FocalPoint-rotateContainer" style={{ transform: `rotate(${rot}deg)` }}>
        //                 <div className="FocalPoint-container">
        //                     <div className="FocalPoint-name noselect">
        //                         {focalPoint.get("name")} : {focalPoint.getIn(["heads",0,"name"])}
        //                     </div>
        //                     {/* <div className="FocalPoint-select noselect" onClick={this.props.FocalPoint}>
        //                             Select
        //                         </div> */}
        //                     <div className="FocalPoint-remove noselect" onClick={this.props.focalPointRemove}>
        //                         X
        //                         </div>
        //                     <div ref={this.FocalPointMoveHandle} className="FocalPoint-move noselect">
        //                         Move
        //                     </div>
        //                     <div className="FocalPoint-info noselect" onClick={this.togglePopupInfo}>
        //                         Info
        //                     </div>

        //                     { !FocalPointRotator ? null :
        //                         <div className="FocalPoint-rotate noselect">
        //                             {/* offset is used for the drag's reference */}
        //                             <DraggableCore
        //                                 // allowAnyClick= boolean,
        //                                 // cancel= string,
        //                                 // disabled= boolean,
        //                                 // enableUserSelectHack= boolean,
        //                                 // offsetParent={this.FocalPointRotateOffset.current} //HTMLElement,
        //                                 // grid= [number, number],
        //                                 handle=".FocalPoint-rotate-handle"
        //                                 onStart={this.handleRotateStart}
        //                                 onDrag={this.handleRotateDrag}
        //                                 onStop={this.handleRotateStop}
        //                             // onMouseDown= (e= MouseEvent) => void
        //                             >
        //                                 <div ref={this.FocalPointRotateHandle} className="FocalPoint-rotate-handle"/>
        //                             </DraggableCore>
        //                         </div>
        //                     }

        //                     <div className="FocalPoint-heads">
        //                         <Heads heads={heads} focalPointIndex={this.props.index} />
        //                     </div>
        //                     <div className="FocalPoint-cameras">
        //                         <Cameras cameras={cameras} focalPointIndex={this.props.index} />
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </Draggable>
        // );
    }
}