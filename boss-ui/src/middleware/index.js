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

                switch (payloadType) {
                    case "draw":
                        let lineId = (new Date()).getTime() + "-" + i;
                        let tempData = payloadDataChunk.data ? payloadDataChunk.data : {};
                        let shape = tempData.shape;
                        let coords = tempData.coords;

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
                            } catch(e) {}

                            try {
                                rotation = payloadDataChunk.data.extra.rotation;
                                store.dispatch(headRotateByHeadName(headName, rotation));
                            } catch(e) {}                            

                            clearTimeout(timeoutSetActive[headName]);

                            var setToNotActiveAfterDur = 10 * 1000; // e.g. 10 seconds

                            timeoutSetActive[headName] = setTimeout(() => {
                                store.dispatch(standSetIsNotActive(headName));
                            },setToNotActiveAfterDur);
                        } catch(e) {}

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
