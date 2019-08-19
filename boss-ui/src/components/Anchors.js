// NOTE: THIS HASN:T BEEN REALLY FIXED FROM FOCAL POINTS

import React from 'react';
import Anchor from '../containers/Anchor';
// import cn from "classnames";
// // import { isKeyed } from 'immutable';
// import { encodePos } from '../helpers';

export default class Anchors extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };

        this.initKinect = this.initKinect.bind(this);
        this.kinectEventBodyFrame = this.kinectEventBodyFrame.bind(this);
        this.kinectMoveAnchor = this.kinectMoveAnchor.bind(this);
        this.convertToXYForScene = this.convertToXYForScene.bind(this);
    }

    kinectEventBodyFrame(bodyFrame) {
        var JOINT_NUM = {
            SPINEBASE: 0,
            SPINEMID: 1,
            NECK: 2,
            HEAD: 3,
            SHOULDERLEFT: 4,
            ELBOWLEFT: 5,
            WRISTLEFT: 6,
            HANDLEFT: 7,
            SHOULDERRIGHT: 8,
            ELBOWRIGHT: 9,
            WRISTRIGHT: 10,
            HANDRIGHT: 11,
            HIPLEFT: 12,
            KNEELEFT: 13,
            ANKLELEFT: 14,
            FOOTLEFT: 15,
            HIPRIGHT: 16,
            KNEERIGHT: 17,
            ANKLERIGHT: 18,
            FOOTRIGHT: 19,
            SPINESHOULDER: 20,
            HANDTIPLEFT: 21,
            THUMBLEFT: 22,
            HANDTIPRIGHT: 23,
            THUMBRIGHT: 24
        }

        var headPosDiv = document.getElementById("headPos");

        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        var index = 0;
        bodyFrame.bodies.forEach(body => {
            if (body.tracked) {
                for (var jointType in body.joints) {
                    var joint = body.joints[jointType];

                    const {x, y} = this.convertToXYForScene(joint);

                    if (parseInt(jointType) === JOINT_NUM.HEAD) {
                        // ctx.fillStyle = colorsForHead[index];
                        headPosDiv.innerHTML = `x: ${joint.cameraX}<br/>y: ${joint.cameraY}<br/>z: ${joint.cameraZ}`;
                        this.kinectMoveAnchor({anchorIndex:index, x, y})
                    } else {
                        // ctx.fillStyle = colors[index];
                    }
                    // ctx.fillRect(joint.depthX * 512, joint.depthY * 424, 10, 10);
                }
                //draw hand states
                // updateHandState(body.leftHandState, body.joints[7]);
                // updateHandState(body.rightHandState, body.joints[11]);
                index++;
            }
        });
    }

    initKinect() {
        window.initKinect({
            socketUrl: 'http://10.0.1.38:8000/',
            events: {
                bodyFrame: this.kinectEventBodyFrame
            }
        });
    }

    convertToXYForScene(joint) {

        const xMul = -2;
        const yMul = xMul;//1.1;
        const xAdd = 0; //0.5;
        const yAdd = 0.5;
        const xOrigin = 0;
        const yOrigin = 2;

        return {
            x : (joint.cameraX + xAdd) * xMul + xOrigin,
            y : (joint.cameraZ + yAdd) * yMul + yOrigin
        }
    }

    componentDidMount() {
        const locatiobnUrl = new URL(document.location.href);
        if (locatiobnUrl.searchParams.get("kinect")) {
            this.initKinect();
        }
    }

    render() {
        const anchors = this.props.anchors.map((anchor, i) => {
            return <Anchor key={i} name={`fp${i}`} index={i} anchor={anchor} />
        });

        return (
            <div className="Anchors">
                {anchors}
            </div>
        );
    }
}