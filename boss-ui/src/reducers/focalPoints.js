import { fromJS } from "immutable";
// https://www.npmjs.com/package/@giantmachines/redux-websocket
import { WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";
// import { WEBSOCKET_CONNECTING, WEBSOCKET_OPEN, WEBSOCKET_CLOSED, WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";

// Returns a new immutable object for a new focalPoint
const createNewFocalPoint = ({
    name = undefined,
    pos = { x: 0, y: 0 },
    isActive = false,
    isSelected = false, // Needed????
} = {}, state) => {

    // if (!name) {
    //     name = getNewName("focalPoint", state.toJS());
    // }

    return fromJS({
        name, 
        pos,
        isActive
    })

    // return {
    //     "name": "focalPoint0",
    //     "pos": {
    //         "x": 0,//-1.5,
    //         "y": 0
    //     },
    // }
}

// const getNewName = (prefix, arrayObj) => {
//     let maxFocalPointNum = Math.max.apply(null, arrayObj.map(st => st.name).filter(d => d.indexOf(prefix) === 0).map(d => parseInt(d.replace(prefix, ""))).filter(d => !isNaN(d)))

//     if (maxFocalPointNum >= 0) {
//         return `${prefix}${maxFocalPointNum + 1}`;
//     } else {
//         return `${prefix}0`;
//     }
// }

// const getFocalPointIndexFromHeadName = (state, headName) => {
//     var temp = state.findIndex(focalPoint => focalPoint.getIn(["heads",0, "name"]) === headName)
//     return temp;
// };

const processWebsocketData = (state, payloadDataChunk) => {
    let { type, data } = payloadDataChunk;
    // let headName, heads, focalPointIndex, headIndex, rotation;
    let newState = state;
    // let headName, position, heads, focalPointIndex, cameraIndex, headIndex, rotation;

    switch (type) {
        case "focalpoint-positioned":
            // headName = data.headName;
            // rotation = data.rotation;
            // // position = data.position;

            // focalPointIndex = state.findIndex(focalPoint => {

            //     heads = focalPoint.get("heads");
            //     if (heads && heads.size > 0) {
            //         headIndex = heads.findIndex((head, i) => {
            //             return head.get("name") === headName;
            //         })
            //     }

            //     if (headIndex >= 0) {

            //         return true;
            //     } else {
            //         headIndex = undefined;
            //         return false;
            //     }
            // })

            // if (focalPointIndex >= 0 && headIndex >= 0) {
            //     // Convert position (0-200) to degrees (0 - 360)
            //     // rotation = 360 * position / 200;

            //     newState = state.setIn([focalPointIndex, "heads", headIndex, "rot"], rotation);

            //     // If the head isn't manually moving, do not move the virtual rotation of the head.
            //     if (!newState.getIn([focalPointIndex, "isManualHeadMove"])) {
            //         return newState.setIn([focalPointIndex, "heads", headIndex, "vRot"], rotation);
            //     } else {
            //         // Ignore the messages if head is manually being rotated within the UI
            //         return newState;
            //     }
            // }

            break;
        default:
            break;
    }

    return state;
}

const focalPoints = (state = fromJS([]), action) => {
    window.c_sn_str = { state, action };
    let newState = state;
    let tempFocalPointIndex;

    switch (action.type) {
        // Websocket message
        // NOTE: This should probably be handles by the websocket middleware... which then sends specific dispatch (window.c_ )
        case WEBSOCKET_MESSAGE:
            let totalPayload;
            try {
                totalPayload = JSON.parse(action.payload.data);

                // For each payload data 
                totalPayload.forEach(payloadDataChunk => {
                    newState = processWebsocketData(newState, payloadDataChunk);
                });

                return newState;
            } catch (e) { }

            return state;
        case 'FOCALPOINT_ADD':
            console.log('FOCALPOINT_ADD');
            return state.push(createNewFocalPoint({}, state));
        case 'FOCALPOINT_SETIN_FIELDS_BY_INDEX':
            // return state.setIn([action.index,"pos"], fromJS(action.pos));
            let setInLocation = [action.index];
            setInLocation = setInLocation.concat(action.fieldNames);
            return state.setIn(setInLocation, fromJS(action.value));
        case 'FOCALPOINT_SET_FIELD_BY_INDEX':
            return state.setIn([action.index, action.fieldName], fromJS(action.value));
        case 'FOCALPOINT_MOVE_BY_INDEX':
            return state.setIn([action.index, "pos"], fromJS(action.pos));
        case 'FOCALPOINT_ROTATE_BY_INDEX':
            return state.setIn([action.index, "rot"], fromJS(action.rot));
        case 'FOCALPOINT_REMOVE_BY_INDEX':
            return state.remove(action.index);

        case 'FOCALPOINT_SET_SCENE':
            if (action.sceneData && action.sceneData.focalPoints && action.sceneData.focalPoints.length > 0) {
                return fromJS(action.sceneData.focalPoints);
            }
            return state;

        // // Active or not
        // case 'FOCALPOINT_SET_IS_ACTIVE':
        //     tempFocalPointIndex = getFocalPointIndexFromHeadName(state, action.headName);
            
        //     if (tempFocalPointIndex >= 0 ) {
        //         return state.setIn([tempFocalPointIndex, "isActive"], true);
        //     } else {
        //         return state;
        //     }
        // case 'FOCALPOINT_SET_IS_NOT_ACTIVE':
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

export default focalPoints