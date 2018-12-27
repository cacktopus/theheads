import React from 'react';
//import Heads from '../containers/Heads'
// import Draggable from 'react-draggable'; 
import Draggable, { DraggableCore } from 'react-draggable';
// import Stand from '../containers/Stand';
import cn from "classnames";
import Heads from './Heads';
import Cameras from './Cameras';

import {encodeRot, decodeRot, encodePos, decodePos} from '../helpers';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };

        // this.onMouseDown = this.onMouseDown.bind(this);

        this.toggleInfoPopup = this.toggleInfoPopup.bind(this);
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
    //     var highestStand = document.getElementsByClassName("Stand");
    //     [...Stands].forEach(Stand => {
    //         Stand.classList.remove("Stand-highest");
    //     });
    // }

    toggleInfoPopup(e) {
        // The x and y of the Scene
        var {x, y} = document.getElementById("Scene").getBoundingClientRect();

        const clickPos = { x: e.nativeEvent.clientX - x, y: e.nativeEvent.clientY - y };
        console.log(clickPos);

        // e.persist();
        // window.c_ee = e;
        
        // console.log(e);

        const popupIndex = "pop" + (new Date()).getTime();
        const popupType = "info";

        this.props.standInfoPopup(popupIndex, popupType, clickPos);
    }

    // Move
    handleMoveStart(e, a) {
        this.props.standSelect();
        // console.log("h str", e, a);
        // this.props.standMove(1,a.)
    }

    handleMoveDrag(e, a) {
        // console.log("h dr", e, a);
        const { x, y } = a;
        const pos = encodePos(this.props.menu, { x, y });
        // const pos = encrypt1({ x, y });
        // const pos = { x, y };
        // Convert the values 

        this.props.standMove(pos);
        // this.setState({ pos });
    }

    handleMoveStop(e, a) {
    }

    // Rotate
    handleRotateStart(e, a) {
        this.props.standSelect();
    }

    handleRotateDrag(e, a) {
        const { x, y } = a;
        var rad = Math.atan2(y, x); // In radians
        var deg = encodeRot(rad * (180 / Math.PI));
        // var deg = rad * (180 / Math.PI);

        this.props.standRotate(deg);
    }

    handleRotateStop(e, a) {
        // console.log("hrlt stop", e, a);
    }

    render() {
        window.c_STN = this;
        const stand = this.props.stand;
        // let pos = {x: 0, y:0};
        let pos = decodePos(this.props.menu, stand.get("pos").toJS());

        // let pos = decrypt1(stand.get("pos").toJS());
        // let pos = stand.get("pos").toJS();
        pos.x = isNaN(pos.x) || pos.x === "" ? 0 : pos.x;
        pos.y = isNaN(pos.y) || pos.y === "" ? 0 : pos.y;

        let rot = stand.get("rot");
        rot = isNaN(rot) ? 0 : rot;
        rot = decodeRot(rot); // flip it so rotation is opposite direction.

        const selectedStandIndex = this.props.menu.get("selectedStandIndex");
        const isSelected = selectedStandIndex === this.props.index;

        const heads = stand.get("heads");
        const cameras = stand.get("cameras");

        // const standStyle = {transform:`translate(${stand.pos.x}px, ${stand.pos.y}px)`}
        // console.log('ren');

        // try {
        //     pos = stand.get("pos");
        // } catch(e) {}

        const areRotatesHidden = this.props.menu.get("areRotatesHidden");

        return (
            <Draggable
                handle=".Stand-move"
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
                    handle=".Stand-rotate"
                    // onStart={this.handleRotateStart}
                    // onDrag={this.handleRotateDrag}
                    // onStop={this.handleRotateStop}
                    // onMouseDown= (e= MouseEvent) => void
                > */}

                <div className={cn("Stand", { "Stand--selected": isSelected })} onClick={this.props.standSelect}>
                    <div className="Stand-rotateContainer" style={{ transform: `rotate(${rot}deg)` }}>
                        <div className="Stand-container">
                            <div className="Stand-name noselect">
                                {stand.get("name")} : {stand.getIn(["heads",0,"name"])}
                            </div>
                            {/* <div className="Stand-select noselect" onClick={this.props.standStand}>
                                    Select
                                </div> */}
                            <div className="Stand-remove noselect" onClick={this.props.standRemove}>
                                X
                                </div>
                            <div className="Stand-move noselect">
                                Move
                                </div>
                            <div className="Stand-info noselect" onClick={this.toggleInfoPopup}>
                                Info
                            </div>

                            {areRotatesHidden ? null :
                                <div className="Stand-rotate noselect">
                                    {/* offset is used for the drag's reference */}
                                    <DraggableCore
                                        // allowAnyClick= boolean,
                                        // cancel= string,
                                        // disabled= boolean,
                                        // enableUserSelectHack= boolean,
                                        // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
                                        // grid= [number, number],
                                        handle=".Stand-rotate-handle"
                                        onStart={this.handleRotateStart}
                                        onDrag={this.handleRotateDrag}
                                        onStop={this.handleRotateStop}
                                    // onMouseDown= (e= MouseEvent) => void
                                    >
                                        <div className="Stand-rotate-handle"></div>
                                    </DraggableCore>
                                </div>
                            }

                            <div className="Stand-heads">
                                <Heads heads={heads} standIndex={this.props.index} />
                            </div>
                            <div className="Stand-cameras">
                                <Cameras cameras={cameras} standIndex={this.props.index} />
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}