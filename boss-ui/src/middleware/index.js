import { motionLinesAddLine, motionLinesRemoveLine, standSetIsActive, standSetIsNotActive, headRotateByHeadName } from "../actions";
import { WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";


// This is used as a timeout for specific headNames, to set a previously active head (stand) to isNotActive
let timeoutSetActive = {};

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
                        var JOINT_NUM = { HEAD: 3 };
                        var kinectName = payloadDataChunkData.name;
                        var simplifiedBodies = payloadDataChunkData.simplifiedBodies;
                        var validBodies = simplifiedBodies.filter(body => body.tracked);

                        const focalPoints = validBodies.forEach(body => {
                            var joint_pos = {};
                            if (body.joints && body.joints.length > 0) {
                                var joint_pos = body.joints.filter(joint => joint.jointType === JOINT_NUM.HEAD)[0].map(joint => {
                                    return {
                                        x: joint.cameraX,
                                        y: joint.cameraY,
                                        z: joint.cameraZ,
                                    }
                                });;
                            }
                            return joint_pos;
                        });
                        window.c_kk = { kinect: true, name: kinectName, focalPoints };
                        console.log({ kinect: true, nane: kinectName, focalPoints });
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
