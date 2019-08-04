import {
    motionLinesAddLine,
    motionLinesRemoveLine,
    standSetIsActive,
    standSetIsNotActive,
    kinectSetFocalPoints,
    kinectClearFocalPoints,
    headRotateByHeadName
} from "../actions";
import { WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";
import { debounce } from 'throttle-debounce';

// const temp = [{
//     "type": "kinect",
//     "data": {
//         "name": "kinect-01",
//         "simplifiedBodies": [{
//             "bodyIndex": 0,
//             "tracked": false
//         }, {
//             "bodyIndex": 1,
//             "tracked": false
//         }, {
//             "bodyIndex": 2,
//             "tracked": true,
//             "joints": [{
//                 "cameraX": -0.3352165222167969,
//                 "cameraY": 0.6552982330322266,
//                 "cameraZ": 2.0847411155700684,
//                 "jointType": 3,
//                 "trackingState": 2
//             }]
//         }, {
//             "bodyIndex": 3,
//             "tracked": false
//         }, {
//             "bodyIndex": 4,
//             "tracked": false
//         }, {
//             "bodyIndex": 5,
//             "tracked": false
//         }],
//         "pos0": {
//             "x": 12.5,
//             "y": 12,
//             "z": 34
//         }
//     }
// }];

// const payloadDataChunkData_HARDCODED = temp[0].data;

// This is used as a timeout for specific headNames, to set a previously active head (stand) to isNotActive
let timeoutSetActive = {};


// Kinect related functions
function clearKinectFocalPoint(store, kinectName) {
    console.log('clearKinectFocalPoint!', kinectName);
    store.dispatch(kinectClearFocalPoints({ kinectName }));
}
const CLEAR_KINECT_FOCAL_POINTS_TIMEOUT = 5000; // Time of not getting message to then clear all focal points for that kinect.
let debouncedClearKinectFocalPointFns = {};

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
                    case "motion-line":
                        let lineId = (new Date()).getTime() + "-" + i;
                        let shape = "line"; //payloadDataChunkData.shape;
                        let coords = [];
                        
                        try {
                            coords = payloadDataChunkData.p0;
                            coords = coords.concat(payloadDataChunkData.p1);
                        } catch(e) {}

                        store.dispatch(motionLinesAddLine({
                            lineId,
                            shape,
                            coords
                        }))

                        setTimeout(() => {
                            store.dispatch(motionLinesRemoveLine({
                                lineId
                            }));
                        }, 600); // NOTE: this 1500ms should be the same value as what's in App.css for .MotionLine.fadeOut's keyframe animation
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
                        // window.c_kpl = payloadDataChunk;
                        try {
                            // payloadDataChunk.data.simplifiedBodies[0].tracked

                            var JOINT_NUM = { HEAD: 3 };
                            // var kinectName = payloadDataChunkData_HARDCODED.name;
                            // var simplifiedBodies = payloadDataChunkData_HARDCODED.simplifiedBodies;
                            var kinectName = payloadDataChunkData.name;
                            var simplifiedBodies = payloadDataChunkData.simplifiedBodies;
                            var validBodies = simplifiedBodies.filter(body => body.tracked);
                            const focalPoints = validBodies.map(body => {
                                var joint_pos = {};
                                if (body.joints && body.joints.length > 0) {
                                    // This is where we decide which of the joints to use as the 

                                    // var joint_pos = {};
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
                            window.c_kk3 = { kinect: true, name: kinectName, focalPoints, payloadDataChunkData };
                            store.dispatch(kinectSetFocalPoints({ kinectName, focalPoints }));

                            // A debounce function which will clear all focal points for this particular kinect name
                            // This ensure that if a kinect stores sending messages that we don't still consider 
                            // the focal points it last sent were still there.
                            if(!debouncedClearKinectFocalPointFns[kinectName]) {
                                debouncedClearKinectFocalPointFns[kinectName] = debounce(CLEAR_KINECT_FOCAL_POINTS_TIMEOUT, clearKinectFocalPoint);
                            }
                            debouncedClearKinectFocalPointFns[kinectName](store, kinectName);
                            
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
