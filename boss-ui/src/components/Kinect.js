import React from 'react';
import Draggable, { DraggableCore } from 'react-draggable';
import cn from "classnames";

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
        this.refKinectRotateHandle = React.createRef();
        this.refKinectMoveHandle = React.createRef();
    }

    componentDidMount() {
        noTouchMove(this.refKinectRotateHandle.current);
        noTouchMove(this.refKinectMoveHandle.current);
    }

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
        this.props.kinectSelect();
        // console.log("h str", e, a);
        // this.props.kinectMove(1,a.)
    }

    handleMoveDrag(e, a) {
        // console.log("h dr", e, a);
        const { x, y } = a;
        const pos = encodePos(this.props.menu, { x, y });
        // const pos = encrypt1({ x, y });
        // const pos = { x, y };
        // Convert the values 

        this.props.kinectMove(pos);
        // this.setState({ pos });
    }

    handleMoveStop(e, a) {
    }

    // Rotate
    handleRotateStart(e, a) {
        this.props.kinectSelect();
    }

    handleRotateDrag(e, a) {
        const { x, y } = a;
        var rad = Math.atan2(y, x); // In radians
        var deg = encodeRot(rad * (180 / Math.PI));
        // var deg = rad * (180 / Math.PI);

        this.props.kinectRotate(deg);
    }

    handleRotateStop(e, a) {
        // console.log("hrlt stop", e, a);
    }

    render() {
        const kinect = this.props.kinect;
        const isActive = kinect.get("isActive");
        window.c_k9 = kinect;
        let pos = {x: 0, y:0};
        // let pos = decodePos(this.props.menu, kinect.get("pos").toJS());

        // let pos = decrypt1(kinect.get("pos").toJS());
        // let pos = kinect.get("pos").toJS();
        pos.x = isNaN(pos.x) || pos.x === "" ? 0 : pos.x;
        pos.y = isNaN(pos.y) || pos.y === "" ? 0 : pos.y;

        let rot = kinect.get("rot");
        rot = isNaN(rot) ? 0 : rot;
        rot = decodeRot(rot); // flip it so rotation is opposite direction.

        const selectedKinectIndex = this.props.menu.get("selectedKinectIndex");
        const isSelected = selectedKinectIndex === this.props.index;

        const isKinectRotatesHidden = this.props.menu.get("isKinectRotatesHidden");
        const isForceShowKinectRotatesOnSelect = this.props.menu.get("isForceShowKinectRotatesOnSelect");
        const isShowKinectRotator = !isKinectRotatesHidden || (isSelected && isForceShowKinectRotatesOnSelect);

        const kinectName = kinect.get("name");

        // Given the kinect is 100px 
        // and the actual kinect is 0.381 m (15')
        // When the scene scale is 100
        // set the transform:scale(X); to X = 0.381
        // When the scene scale is 200 (100 * 2)
        // set the transform:scale(X); to X = 0.381 * 2 = 0.762
        const kinectContainerScale = 0.381 * this.props.menu.get("scale") / 100
        const styleKinectContainer = {
            transform: `scale(${kinectContainerScale})`
        }
        return (
            <Draggable
                handle=".Kinect-move"
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
                    handle=".Kinect-rotate"
                    // onStart={this.handleRotateStart}
                    // onDrag={this.handleRotateDrag}
                    // onStop={this.handleRotateStop}
                    // onMouseDown= (e= MouseEvent) => void
                > */}

                <div ref={this.refKinect} id={`Kinect-${kinectName}`} className={cn("Kinect", { "Kinect--selected": isSelected, "Kinect--active" : isActive })} onClick={this.props.kinectSelect}>
                    <div className="Kinect-rotateContainer" style={{ transform: `rotate(${rot}deg)` }}>
                        <div style={styleKinectContainer} className="Kinect-container">
                            <div className="Kinect-octagon"></div>
                            {/* <div className="Kinect-name noselect">
                                {kinect.get("name")} : {kinect.getIn(["heads",0,"name"])}
                            </div> */}
                            {/* <div className="Kinect-select noselect" onClick={this.props.kinectKinect}>
                                    Select
                                </div> */}
                            <div className="Kinect-remove noselect" onClick={this.props.kinectRemove}>
                                X
                                </div>
                            <div ref={this.refKinectMoveHandle} className="Kinect-move noselect">
                                Move
                            </div>
                            <div className="Kinect-info noselect" onClick={this.togglePopupInfo}>
                                Info
                            </div>

                            { !isShowKinectRotator ? null :
                                <div className="Kinect-rotate noselect">
                                    {/* offset is used for the drag's reference */}
                                    <DraggableCore
                                        // allowAnyClick= boolean,
                                        // cancel= string,
                                        // disabled= boolean,
                                        // enableUserSelectHack= boolean,
                                        // offsetParent={this.refKinectRotateOffset.current} //HTMLElement,
                                        // grid= [number, number],
                                        handle=".Kinect-rotate-handle"
                                        onStart={this.handleRotateStart}
                                        onDrag={this.handleRotateDrag}
                                        onStop={this.handleRotateStop}
                                    // onMouseDown= (e= MouseEvent) => void
                                    >
                                        <div ref={this.refKinectRotateHandle} className="Kinect-rotate-handle"/>
                                    </DraggableCore>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}