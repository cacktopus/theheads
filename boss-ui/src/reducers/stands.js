import {fromJS} from "immutable";

const defaultCamera = 
{
    "name": "camera0",
    "pos": {
        "x": 0.1,
        "y": 0
    },
    "rot": 0,
    "fov": 60,
    "description": "Raspberry Pi PiNoir Camera V2 Video Module"
};

const defaultHead = {
    "name": "head0",
    "pos": {
        "x": 0,
        "y": 0
    },
    "rot": 0
};

const createNewCamera = ({
    name = undefined,
}, camerasArray) => {

    let camera = Object.assign({}, defaultCamera);
    camera.name = getNewName('camera', camerasArray);

    return camera;
}

// Returns a new immutable object for a new stand
const createNewStand = ({
    name = undefined, 
    pos = { x: 0, y: 0},
    rot = 0, 
    cameras = [defaultCamera],
    heads = [defaultHead]
} = {}, state) => {

    if (!name) {
        name = getNewName("stand", state.toJS());
    }

    return fromJS({
        "name": name,
        "pos": pos,
        "rot": rot,
        "cameras": cameras,
        "heads": heads
    })
    
    // return {
    //     "name": "stand0",
    //     "pos": {
    //         "x": 0,//-1.5,
    //         "y": 0
    //     },
    //     "rot": 0 //300,
    //     "cameras": [
    //         {
    //             "name": "camera0",
    //             "pos": {
    //                 "x": 0.1,
    //                 "y": 0
    //             },
    //             "rot": 0,
    //             "fov": 60,
    //             "description": "Raspberry Pi PiNoir Camera V2 Video Module"
    //         }
    //     ],
    //     "heads": [
    //         {
    //             "name": "head0",
    //             "pos": {
    //                 "x": 0,
    //                 "y": 0
    //             },
    //             "rot": 0
    //         }
    //     ]
    // }
}

const getNewName = (prefix, arrayObj) => {
    let maxStandNum = Math.max.apply(null, arrayObj.map(st => st.name).filter(d => d.indexOf(prefix) === 0 ).map(d => parseInt(d.replace(prefix,""))).filter(d => !isNaN(d)))

    if (maxStandNum >= 0) {
        return `${prefix}${maxStandNum + 1}`;
    } else {
        return `${prefix}0`;
    }
}

// const stands = (state = [], action) => {
const stands = (state = fromJS([]), action) => {
    window.c_sn_str = {state, action};

    switch (action.type) {
        case 'STAND_ADD':
            return state.push(createNewStand({}, state));
        case 'STAND_SETIN_FIELDS_BY_INDEX':
            // console.log("STAND_SETIN_FIELDS_BY_INDEX", action);
            // return state.setIn([action.index,"pos"], fromJS(action.pos));
            let setInLocation = [action.index];
            setInLocation = setInLocation.concat(action.fieldNames);
            return state.setIn(setInLocation, fromJS(action.value));
        case 'STAND_SET_FIELD_BY_INDEX':
            // console.log("STAND_SET_FIELD_BY_INDEX", action);
            return state.setIn([action.index,action.fieldName], fromJS(action.value));
        case 'STAND_MOVE_BY_INDEX':
            return state.setIn([action.index,"pos"], fromJS(action.pos));
        case 'STAND_ROTATE_BY_INDEX':
            // console.log("STAND_ROTATE_BY_INDEX", {state, action});
            return state.setIn([action.index,"rot"], fromJS(action.rot));
        case 'STAND_REMOVE_BY_INDEX':
            return state.remove(action.index);

        // Head
        case 'HEAD_MOVE_BY_INDEX':
            return state.setIn([action.standIndex,"heads",action.headIndex,"pos"], fromJS(action.pos));
        case 'HEAD_ROTATE_BY_INDEX':
            return state.setIn([action.standIndex,"heads",action.headIndex,"rot"], fromJS(action.rot));

        // Camera
        case 'CAMERA_MOVE_BY_INDEX':
            // console.log("CAMERA_MOVE_BY_INDEX", [action.standIndex,"cameras",action.cameraIndex,"pos"], fromJS(action.pos));
            // window.c_CAM342 = { arr: [action.standIndex,"cameras",action.cameraIndex,"pos"], pos: fromJS(action.pos)};
            return state.setIn([action.standIndex,"cameras",action.cameraIndex,"pos"], fromJS(action.pos));
        case 'CAMERA_ROTATE_BY_INDEX':
            return state.setIn([action.standIndex,"cameras",action.cameraIndex,"rot"], fromJS(action.rot));
        case 'CAMERA_ADD_NEW':
            let camerasList = state.getIn([action.standIndex,"cameras"]).toJS();
            return state.updateIn([action.standIndex,"cameras"], cameras => cameras.push(fromJS(createNewCamera({}, camerasList))))
        case 'CAMERA_REMOVE_BY_INDEX':
            return state.removeIn([action.standIndex,"cameras",action.cameraIndex]);
        case 'STAND_SET_SCENE':
            if (action.sceneData && action.sceneData.stands && action.sceneData.stands.length > 0) {
                return fromJS(action.sceneData.stands);
            }
            return state;
        // Default
        default:
            return state;
    }
}

export default stands