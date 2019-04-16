import React from 'react';
//import Kinects from '../containers/Kinects'
// import Draggable from 'react-draggable'; 
import { DraggableCore } from 'react-draggable';
// import Draggable, {DraggableCore} from 'react-draggable'; 
// import Stand from '../containers/Stand';
import { rotateVector } from '../helpers';
import cn from "classnames";

import {encodeRot, decodeRot, encodePosRelativeStand, encodePosScale, decodePosRelativeStand, decodePosScale, noTouchMove} from '../helpers';

export default class Kinect extends React.Component {
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
        this.refKinectRotateHandle = React.createRef();
    }

    componentDidMount() {
        noTouchMove(this.refKinectRotateHandle.current);
    }

    // Move
    handleMoveStart(e, a) {
        const curPos = this.getCurrentPos();
        const { x, y } = a;
        const pos = { x: x - curPos.x, y: y - curPos.y };

        this.setState({ moveRelativeStartPos: pos });
        this.props.selectKinect();
    }

    handleMoveDrag(e, a) {
        const { x, y } = a;
        const pos = { x, y }; //: x - origin.x, y: y - origin.y };
        const rot = decodeRot(this.props.stand.get("rot"));
        const newPos = encodePosRelativeStand(this.props.menu, rotateVector(pos, rot));//, origin);
        this.props.kinectMove(newPos);
    }

    handleMoveStop(e, a) {
        // this.props.kinectMove(pos);
        // console.log("h stop", e, a);
    }


    // Rotate
    handleRotateStart(e, a) {
        this.props.selectKinect();
        // console.log("hrot str", e, a);
    }

    handleRotateDrag(e, a) {
        const { x, y } = a;
        var rad = Math.atan2(y, x); // In radians
        // Then you can convert it to degrees as easy as:
        var deg = rad * (180 / Math.PI);

        const standRot = decodeRot(this.props.stand.get("rot"));
        this.props.kinectRotate(encodeRot(deg - standRot));
    }

    handleRotateStop(e, a) {
        // console.log("hrlt stop", e, a);
    }

    getCurrentPos() {
        let pos = decodePosRelativeStand(this.props.kinect.get("pos").toJS());
        pos.x = isNaN(pos.x) ? 0 : pos.x;
        pos.y = isNaN(pos.y) ? 0 : pos.y;

        return pos;
    }

    render() {
        const kinect = this.props.kinect;

        let pos = this.getCurrentPos();

        let rot = kinect.get("rot");
        rot = isNaN(rot) ? 0 : rot;
        rot = decodeRot(rot);

        const selectedStandIndex = this.props.menu.get("selectedStandIndex");
        const selectedKinectIndex = this.props.menu.get("selectedKinectIndex");

        const isSelected = selectedStandIndex === this.props.standIndex && selectedKinectIndex === this.props.kinectIndex;

        const fov = kinect.get("fov");
        const fovLength = 1000;//1900;
        let fovHeight = 0;

        if (0 < fov && fov < 180) {
            const rad = (fov/2 * Math.PI/180);
            fovHeight = fovLength * Math.tan(rad);
        }
        const topAdjust = 12; // This is related to the height of half the kinect.
        const fovStyle = {
            width: 0,
            height: 0,
            borderTop: `${fovHeight}px solid transparent`,
            borderRight: `${fovLength}px solid rgba(130,0,200,0.1)`,
            borderBottom: `${fovHeight}px solid transparent`,
            position: "absolute",
            top: `-${fovHeight - topAdjust}px`,
            left: "12px",
            zIndex: 2,
            pointerEvents: "none" // https://stackoverflow.com/questions/3680429/click-through-a-div-to-underlying-elements
        }

        const isKinectRotatesHidden = this.props.menu.get("isKinectRotatesHidden");
        const isForceShowKinectRotatesOnSelect = this.props.menu.get("isForceShowKinectRotatesOnSelect");
        const isShowKinectRotator = !isKinectRotatesHidden || (isSelected && isForceShowKinectRotatesOnSelect);

        return (
            <div className={cn("Kinect", { "Kinect--selected": isSelected })} >
                <DraggableCore
                    // allowAnyClick= boolean,
                    // cancel= string,
                    // disabled= boolean,
                    // enableUserSelectHack= boolean,
                    // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
                    // grid= [number, number],
                    handle=".Kinect-camImg"
                    onStart={this.handleMoveStart}
                    onDrag={this.handleMoveDrag}
                    onStop={this.handleMoveStop}
                // onMouseDown= (e= MouseEvent) => void
                >
                    <div className="Kinect-container" style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
                        <div className="Kinect-rotateContainer" style={{ transform: `rotate(${rot}deg)` }}>
                            { 
                                !isShowKinectRotator ? null : 
                                    <div className="Kinect-rotate noselect">
                                        {/* offset is used for the drag's reference */}
                                        <DraggableCore
                                            // allowAnyClick= boolean,
                                            // cancel= string,
                                            // disabled= boolean,
                                            // enableUserSelectHack= boolean,
                                            // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
                                            // grid= [number, number],
                                            handle=".Kinect-rotate-handle"
                                            onStart={this.handleRotateStart}
                                            onDrag={this.handleRotateDrag}
                                            onStop={this.handleRotateStop}
                                        // onMouseDown= (e= MouseEvent) => void
                                        >
                                            <div ref={this.refKinectRotateHandle} className="Kinect-rotate-handle"></div>
                                        </DraggableCore>
                                    </div>
                            }

                            <div className="Kinect-camImg"></div>

                            <div className="Kinect-fov" style={fovStyle}>
                                {/* <div className="Kinect-fov-1"></div>
                                <div className="Kinect-fov-2"></div> */}
                            </div>
                        </div>
                    </div>
                </DraggableCore>
            </div>
        );
    }
}