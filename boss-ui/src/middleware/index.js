import { motionLinesAddLine, motionLinesRemoveLine, standSetIsActive, standSetIsNotActive, kinectSetFocalPoints, headRotateByHeadName } from "../actions";
import { WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";

const temp = [{
    "type": "kinect",
    "data": {
        "name": "kinect-01",
        "simplifiedBodies": [{
            "bodyIndex": 0,
            "tracked": false
        }, {
            "bodyIndex": 1,
            "tracked": false
        }, {
            "bodyIndex": 2,
            "tracked": true,
            "joints": [{
                "cameraX": -0.3352165222167969,
                "cameraY": 0.6552982330322266,
                "cameraZ": 2.0847411155700684,
                "jointType": 3,
                "trackingState": 2
            }]
        }, {
            "bodyIndex": 3,
            "tracked": false
        }, {
            "bodyIndex": 4,
            "tracked": false
        }, {
            "bodyIndex": 5,
            "tracked": false
        }],
        "pos0": {
            "x": 12.5,
            "y": 12,
            "z": 34
        }
    }
}];
const payloadDataChunkData2 = temp[0].data;

// This is used as a timeout for specific headNames, to set a previously active head (stand) to isNotActive
let timeoutSetActive = {};


console.log('EDIT THE SHIT HERE... for kinect message');

export const customWebsocketMiddleware = store => next => action => {
    if (action.type === WEBSOCKET_MESSAGE) {
        let totalPayload; // parse through each payload
        try {
            totalPayload = JSON.parse(action.payload.data);

            // For each payload data 
            totalPayload.forEach((payloadDataChunk, i) => {

                const payloadType = payloadDataChunk.type;
                const payloadDataChunkData = payloadDataChunk.data ? payloadDataChunk.data : {};

                switch (payloadType) {
                    case "draw":
                        let lineId = (new Date()).getTime() + "-" + i;
                        let shape = payloadDataChunkData.shape;
                        let coords = payloadDataChunkData.coords;

                        store.dispatch(motionLinesAddLine({
                            lineId,
                            shape,
                            coords

                        }))
                        setTimeout(() => {
                            store.dispatch(motionLinesRemoveLine({
                                lineId
                            }));
                        }, 1500); // NOTE: this 1500ms should be the same value as what's in App.css for .MotionLine.fadeOut's keyframe animation
                        break;
                    case "active":
                        try {
                            var headName;
                            var rotation;

                            try {
                                headName = payloadDataChunk.data.name;
                                store.dispatch(standSetIsActive(headName));
                            } catch (e) { }

                            try {
                                rotation = payloadDataChunk.data.extra.rotation;
                                store.dispatch(headRotateByHeadName(headName, rotation));
                            } catch (e) { }

                            clearTimeout(timeoutSetActive[headName]);

                            var setToNotActiveAfterDur = 10 * 1000; // e.g. 10 seconds

                            timeoutSetActive[headName] = setTimeout(() => {
                                store.dispatch(standSetIsNotActive(headName));
                            }, setToNotActiveAfterDur);
                        } catch (e) { }
                        break;
                    case "kinect":
                        try {
                            var JOINT_NUM = { HEAD: 3 };
                            var kinectName = payloadDataChunkData2.name;
                            var simplifiedBodies = payloadDataChunkData2.simplifiedBodies;
                            // var kinectName = payloadDataChunkData.name;
                            // var simplifiedBodies = payloadDataChunkData.simplifiedBodies;
                            var validBodies = simplifiedBodies.filter(body => body.tracked);
                            const focalPoints = validBodies.map(body => {
                                var joint_pos = {};
                                if (body.joints && body.joints.length > 0) {
                                    // This is where we decide which of the joints to use as the 

                                    var joint_pos = {};
                                    body.joints.filter(joint => joint.jointType === JOINT_NUM.HEAD).forEach(joint => {
                                        joint_pos = {
                                            x: joint.cameraX,
                                            y: joint.cameraY,
                                            z: joint.cameraZ,
                                            bodyIndex: body.bodyIndex
                                        }
                                    });
                                }
                                return joint_pos;
                            });
                            window.c_kk = { kinect: true, name: kinectName, focalPoints, payloadDataChunkData2 };
                            // console.log({ focalPoints: JSON.stringify(focalPoints) });
                            store.dispatch(kinectSetFocalPoints({ kinectName, focalPoints }));
                            // console.log({ kinect: true, nane: kinectName, focalPoints });
                        } catch (e) { console.log(e) }
                        break;
                    default:
                        break;
                }
            });
        } catch (e) { }
    }
    // window.c_cm = {
    //     store,
    //     next,
    //     action
    // };

    next(action);
}
