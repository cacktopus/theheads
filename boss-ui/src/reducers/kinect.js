import { fromJS } from "immutable";

const initialState = {
    // e.g. { "kinect-01" : { focalPoints, pos: {x: _, y: _}, rot: -90 }}
}

const kinect = (state = fromJS(initialState), action) => {
    window.c_KK123 = { state, action };
    // let newState = state; 
    // let tempFocalPointIndex; 

    switch (action.type) {
        // Websocket message
        // NOTE: This should probably be handles by the websocket middleware... which then sends specific dispatch (window.c_ )
        // case WEBSOCKET_MESSAGE:
        //     let totalPayload;
        //     try {
        //         totalPayload = JSON.parse(action.payload.data);

        //         // For each payload data 
        //         totalPayload.forEach(payloadDataChunk => {
        //             newState = processWebsocketData(newState, payloadDataChunk);
        //         });

        //         return newState;
        //     } catch (e) { }

        //     return state;
        case 'KINECT_SET_FOCAL_POINTS':
            return state.setIn([action.kinectName, "focalPoints"], fromJS(action.focalPoints));
            // push(createNewFocalPoint({}, state));
        // case 'KINECT_SETIN_FIELDS_BY_INDEX':
        //     // return state.setIn([action.index,"pos"], fromJS(action.pos));
        //     let setInLocation = [action.index];
        //     setInLocation = setInLocation.concat(action.fieldNames);
        //     return state.setIn(setInLocation, fromJS(action.value));
        // case 'KINECT_SET_FIELD_BY_INDEX':
        //     return state.setIn([action.index, action.fieldName], fromJS(action.value));
        case 'KINECT_MOVE_BY_NAME':
            return state.setIn([action.kinectName, "pos"], fromJS(action.pos));
        case 'KINECT_ROTATE_BY_NAME':
            return state.setIn([action.kinectName, "rot"], fromJS(action.rot));
        case 'KINECT_REMOVE_BY_NAME':
            return state.remove(action.kinectName);

        case 'KINECT_SET_SCENE':
            if (action.sceneData && action.sceneData.focalPoints && action.sceneData.focalPoints.length > 0) {
                return fromJS(action.sceneData.focalPoints);
            }
            return state;

        // // Active or not
        // case 'KINECT_SET_IS_ACTIVE':
        //     tempFocalPointIndex = getFocalPointIndexFromHeadName(state, action.headName);
            
        //     if (tempFocalPointIndex >= 0 ) {
        //         return state.setIn([tempFocalPointIndex, "isActive"], true);
        //     } else {
        //         return state;
        //     }
        // case 'KINECT_SET_IS_NOT_ACTIVE':
        //     tempFocalPointIndex = getFocalPointIndexFromHeadName(state, action.headName);

        //     if (tempFocalPointIndex >= 0 ) {
        //         return state.setIn([tempFocalPointIndex, "isActive"], false);
        //     } else {
        //         return state;
        //     }

        // Default
        default:
            return state;
    }
}

export default kinect