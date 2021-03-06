import React from "react";
//import Cameras from '../containers/Cameras'
// import Draggable from 'react-draggable';
// // -> Needed? import { DraggableCore } from 'react-draggable';
// import Draggable, {DraggableCore} from 'react-draggable';
// import Stand from '../containers/Stand';
import { rotateVector } from "../helpers";
// import cn from "classnames";
import axios from "axios";

import { decodeRot, encodePosScale, decodePosScale } from "../helpers";
// import {encodeRot, decodeRot, encodePosScale, decodePosScale} from '../helpers';

export default class Popup extends React.Component {
    constructor(props) {
        super(props);

        let cameraFeedEndpoints = [];
        
        try {
            const cams = props.stand.toJS().cameras;
            for (let cameraIndex in cams) {
                const cameraName = cams[cameraIndex].name;
                
                cameraFeedEndpoints.push({
                    label: `View ${cameraName} Feed`,
                    // port: 5000,
                    customUrl: `http://${cameraName}.camera.service.consul:5000/`,
                    isOpenNewWindow: true
                });
            }
        } catch(e) {
            console.log('error in PopupInfor: ', e);
        }

        this.state = {
            // moveRelativeStartPos: { x: 0, y: 0 },
            // pos : {x:0, y:0},
            // rotateRad : 0
        };

        this.handleMoveStart = this.handleMoveStart.bind(this);
        this.handleMoveDrag = this.handleMoveDrag.bind(this);
        this.handleMoveStop = this.handleMoveStop.bind(this);

        this.closePopupInfo = this.closePopupInfo.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
        this.getEndpoints = this.getEndpoints.bind(this);

        this.popupEndpoints = [
            {
                categoryName: "Head",
                endpoints: [
                    {
                        label: "Find Zero",
                        port: 8080,
                        route: "/find_zero"
                    },
                    {
                        label: "Motor Off",
                        port: 8080,
                        route: "/off"
                    }
                ]
            },
            {
                categoryName: "Leds",
                endpoints: [
                    {
                        label: "Rainbow",
                        port: 8082,
                        route: "/run/rainbow"
                    },
                    {
                        label: "Lowred",
                        port: 8082,
                        route: "/run/lowred"
                    },
                    {
                        label: "Bounce",
                        port: 8082,
                        route: "/run/bounce"
                    },
                    {
                        label: "Off",
                        port: 8082,
                        route: "/run/off"
                    }
                ]
            },
            {
                categoryName: "Sound",
                endpoints: [
                    {
                        label: "Random",
                        port: 3031,
                        route: "/random"
                    }
                ]
            },{
                categoryName: "Cameras",
                endpoints: cameraFeedEndpoints
            },{
                categoryName: "Host",
                endpoints: [
                    {
                        label: "Restart",
                        port: 80,
                        route: "/restart-host"
                    },
                    {
                        label: "Shutdown-host",
                        port: 80,
                        route: "/shutdown-host?pw=1199"
                    }
                ]
            }
        ];
        // this.handleRotateStart = this.handleRotateStart.bind(this);
        // this.handleRotateDrag = this.handleRotateDrag.bind(this);
        // this.handleRotateStop = this.handleRotateStop.bind(this);
    }

    makeRequest(url) {
        window.c_ww = this;
        
        axios
            .get(url)
            .then(data => {
                console.log(`Done ${url} `, JSON.stringify(data));
            })
            .catch(err => {
                console.log(`Err with request: ${err}`);
                alert(`Err with request: ${err}`);
            });
    }

    getEndpoints() {
        const getRequestButton = ({ label, port, route, customUrl, isOpenNewWindow }) => {
            const getUrl = customUrl ? customUrl : `http://${this.props.headName}.head.service.consul:${port}${route}`;   
            if (typeof window !== 'undefined') {
                window.c__ = { label, port, route, customUrl, isOpenNewWindow }
            }
            if (isOpenNewWindow) {
                if (typeof window !== 'undefined') {
                    window.c__url = {getUrl,  label, port, route, isOpenNewWindow};
                }
    
                return (
                    <button
                        style={{ marginRight: 15 }}
                        onClick={() => window.open(getUrl)}
                    >
                        {label}
                    </button>
                );
            } else {
                return (
                    <button
                        style={{ marginRight: 15 }}
                        onClick={this.makeRequest.bind(this, getUrl)}
                    >
                        {label}
                    </button>
                );
            }
        };

        return this.popupEndpoints.map(({ categoryName, endpoints }) => {
            // const { categoryName, endpoints } = endpointCategory;

            return (
                <>
                    <p>
                        {categoryName}
                        <br />
                        {endpoints.map(({ label, port, route, customUrl, isOpenNewWindow }) => {
                            // const {label, port, route} = endpoint
                            return getRequestButton({ label, port, route, customUrl, isOpenNewWindow });
                        })}
                    </p>
                </>
            );
        });
    }

    closePopupInfo() {
        this.props.popupInfoRemove();
    }

    // Move
    handleMoveStart(e, a) {
        const curPos = this.getCurrentPos();
        const { x, y } = a;
        const pos = { x: x - curPos.x, y: y - curPos.y };

        this.setState({ moveRelativeStartPos: pos });
        // this.props.selectCamera();
    }

    handleMoveDrag(e, a) {
        const { x, y } = a;
        // const origin = this.state.moveRelativeStartPos;
        // const pos = { x: x - origin.x, y: y - origin.y };
        const pos = { x, y }; //: x - origin.x, y: y - origin.y };
        // const pos = { x, y }; //: x - origin.x, y: y - origin.y };
        const rot = decodeRot(this.props.stand.get("rot"));

        const newPos = encodePosScale(this.props.menu, rotateVector(pos, rot)); //, origin);

        this.props.popupInfoMove(newPos);
    }

    handleMoveStop(e, a) {
        // this.props.cameraMove(pos);
        // console.log("h stop", e, a);
    }

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

    getCurrentPos() {
        // let pos = this.props.get("pos").toJS();
        let pos = this.props.popupInfo.get("pos").toJS();
        pos.x = isNaN(pos.x) ? 0 : pos.x;
        pos.y = isNaN(pos.y) ? 0 : pos.y;

        return decodePosScale(this.props.menu, pos);
        // return pos;
    }

    render() {
        // let pos = this.getCurrentPos();

        let rootVal = "http://consul-fe.service.consul";
        // if (typeof window !== 'undefined') {
        //     rootVal = typeof location !== "undefined" && location.host === "127.0.0.1:8081" ? document.location.hostname : "http://consul-fe.service.consul";
        // } else {
        if (
            typeof window !== "undefined" &&
            document &&
            document.location &&
            document.location.hostname
        ) {
            rootVal =
                document.location.hostname === "127.0.0.1"
                    ? document.location.hostname
                    : "http://consul-fe.service.consul";
        }
        // }

        const consulInstallationUrl = `${rootVal}:8500/ui/dc1/kv/the-heads`;
        // installation

        if (typeof window !== "undefined") {
            window.c__t23 = this;
        }

        const standName = this.props.stand.get("name");

        // // const heads = this.props.stand.getIn(["heads"]);
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

        const heads = this.props.stand.getIn(["heads"]);
        const headRefName = heads && heads.keySeq ? heads.keySeq().first() : "";
        const headName = this.props.stand.getIn(["heads", 0, headRefName]);

        // const cameras = this.props.stand.getIn(["cameras"]);
        // const cameraRefName = cameras && cameras.keySeq ? cameras.keySeq().first() : "";
        const cameraName = this.props.stand.getIn(["cameras"]).keySeq().first();
        // const cameraName = this.props.stand.getIn(["cameras", 0, cameraRefName]);

        // const kinects = this.props.stand.getIn(["kinects"]);
        const kinectName = this.props.stand.getIn(["kinects", 0, "name"]);
        // const kinectRefName = kinects && kinects.keySeq ? kinects : kinects.keySeq().first();
        // const kinectName = this.props.stand.getIn(["kinects", 0, kinectRefName]);
        // const kinectName = this.props.stand.getIn(["kinects", 0, kinectRefName]);

        function getLink(type, name) {
            if (name) {
                return (
                    <a
                        style={{ display: "block" }}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${consulInstallationUrl}/${type}/${name}.yaml/edit`}
                    >
                        {name}
                    </a>
                );
            } else {
                return undefined;
            }
        }

        let standLink = getLink("stands", standName);
        let headLink = getLink("heads", headName);
        let cameraLink = getLink("cameras", cameraName);
        let kinectLink = getLink("kinects", kinectName);

        let endpoints = this.getEndpoints();

        const anchorPoint = <button onClick={this.props.setAsAnchor.bind(this, this.props.stand)}>Set As Anchor</button>

        return (
            <div className="PopupInfo">
                Links:
                {standLink}
                {headLink}
                {cameraLink}
                {kinectLink}
                {anchorPoint}
                {endpoints}
                <div
                    className="PopupInfo-closeButton"
                    onClick={this.closePopupInfo}
                >
                    X
                </div>
            </div>
        );

        // let rot = camera.get("rot");
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
}
