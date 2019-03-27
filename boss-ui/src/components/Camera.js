import React from 'react';
//import Cameras from '../containers/Cameras'
// import Draggable from 'react-draggable'; 
import { DraggableCore } from 'react-draggable';
// import Draggable, {DraggableCore} from 'react-draggable'; 
// import Stand from '../containers/Stand';
import { rotateVector } from '../helpers';
import cn from "classnames";

import {encodeRot, decodeRot, encodePosScale, decodePosScale, noTouchMove} from '../helpers';

export default class Camera extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            moveRelativeStartPos: { x: 0, y: 0 },
            // pos : {x:0, y:0},
            // rotateRad : 0
        };

        this.handleMoveStart = this.handleMoveStart.bind(this);
        this.handleMoveDrag = this.handleMoveDrag.bind(this);
        this.handleMoveStop = this.handleMoveStop.bind(this);

        this.handleRotateStart = this.handleRotateStart.bind(this);
        this.handleRotateDrag = this.handleRotateDrag.bind(this);
        this.handleRotateStop = this.handleRotateStop.bind(this);

        // Refs
        this.refCameraRotateHandle = React.createRef();
    }

    componentDidMount() {
        noTouchMove(this.refCameraRotateHandle.current);
    }

    // Move
    handleMoveStart(e, a) {
        const curPos = this.getCurrentPos();
        const { x, y } = a;
        const pos = { x: x - curPos.x, y: y - curPos.y };

        this.setState({ moveRelativeStartPos: pos });
        this.props.selectCamera();
    }

    handleMoveDrag(e, a) {
        const { x, y } = a;
        // const origin = this.state.moveRelativeStartPos;
        // const pos = { x: x - origin.x, y: y - origin.y };
        const pos = { x, y }; //: x - origin.x, y: y - origin.y };
        // const pos = { x, y }; //: x - origin.x, y: y - origin.y };
        const rot = decodeRot(this.props.stand.get("rot"));
        
        const newPos = encodePosScale(this.props.menu, rotateVector(pos, rot));//, origin);

        this.props.cameraMove(newPos);
    }

    handleMoveStop(e, a) {
        // this.props.cameraMove(pos);
        // console.log("h stop", e, a);
    }


    // Rotate
    handleRotateStart(e, a) {
        this.props.selectCamera();
        // console.log("hrot str", e, a);
    }

    handleRotateDrag(e, a) {
        const { x, y } = a;
        var rad = Math.atan2(y, x); // In radians
        // Then you can convert it to degrees as easy as:
        var deg = rad * (180 / Math.PI);

        const standRot = decodeRot(this.props.stand.get("rot"));
        this.props.cameraRotate(encodeRot(deg - standRot));
    }

    handleRotateStop(e, a) {
        // console.log("hrlt stop", e, a);
    }

    getCurrentPos() {
        let pos = this.props.camera.get("pos").toJS();
        pos.x = isNaN(pos.x) ? 0 : pos.x;
        pos.y = isNaN(pos.y) ? 0 : pos.y;

        return decodePosScale(this.props.menu, pos);
        // return pos;
    }

    render() {
        const camera = this.props.camera;

        let pos = this.getCurrentPos();

        let rot = camera.get("rot");
        rot = isNaN(rot) ? 0 : rot;
        rot = decodeRot(rot);

        const selectedStandIndex = this.props.menu.get("selectedStandIndex");
        const selectedCameraIndex = this.props.menu.get("selectedCameraIndex");

        const isSelected = selectedStandIndex === this.props.standIndex && selectedCameraIndex === this.props.cameraIndex;

        const fov = camera.get("fov");
        const fovLength = 500;
        let fovHeight = 0;

        if (0 < fov && fov < 180) {
            const rad = (fov/2 * Math.PI/180);
            fovHeight = fovLength * Math.tan(rad);
        }
        const topAdjust = 12; // This is related to the height of half the camera.
        const fovStyle = {
            width: 0,
            height: 0,
            borderTop: `${fovHeight}px solid transparent`,
            borderRight: `${fovLength}px solid rgba(0,100,0,0.1)`,
            borderBottom: `${fovHeight}px solid transparent`,
            position: "absolute",
            top: `-${fovHeight - topAdjust}px`,
            left: "12px",
            zIndex: 2,
            pointerEvents: "none" // https://stackoverflow.com/questions/3680429/click-through-a-div-to-underlying-elements
        }

        const isCameraRotatesHidden = this.props.menu.get("isCameraRotatesHidden");
        const isForceShowCameraRotatesOnSelect = this.props.menu.get("isForceShowCameraRotatesOnSelect");
        const isShowCameraRotator = !isCameraRotatesHidden || (isSelected && isForceShowCameraRotatesOnSelect);

        return (
            <div className={cn("Camera", { "Camera--selected": isSelected })} >
                <DraggableCore
                    // allowAnyClick= boolean,
                    // cancel= string,
                    // disabled= boolean,
                    // enableUserSelectHack= boolean,
                    // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
                    // grid= [number, number],
                    handle=".Camera-camImg"
                    onStart={this.handleMoveStart}
                    onDrag={this.handleMoveDrag}
                    onStop={this.handleMoveStop}
                // onMouseDown= (e= MouseEvent) => void
                >
                    <div className="Camera-container" style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
                        <div className="Camera-rotateContainer" style={{ transform: `rotate(${rot}deg)` }}>
                            { 
                                !isShowCameraRotator ? null : 
                                    <div className="Camera-rotate noselect">
                                        {/* offset is used for the drag's reference */}
                                        <DraggableCore
                                            // allowAnyClick= boolean,
                                            // cancel= string,
                                            // disabled= boolean,
                                            // enableUserSelectHack= boolean,
                                            // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
                                            // grid= [number, number],
                                            handle=".Camera-rotate-handle"
                                            onStart={this.handleRotateStart}
                                            onDrag={this.handleRotateDrag}
                                            onStop={this.handleRotateStop}
                                        // onMouseDown= (e= MouseEvent) => void
                                        >
                                            <div ref={this.refCameraRotateHandle} className="Camera-rotate-handle"></div>
                                        </DraggableCore>
                                    </div>
                            }

                            <div className="Camera-camImg"></div>

                            <div className="Camera-fov" style={fovStyle}>
                                <div className="Camera-fov-1"></div>
                                <div className="Camera-fov-2"></div>
                            </div>
                        </div>
                    </div>
                </DraggableCore>
            </div>
        );
    }
}