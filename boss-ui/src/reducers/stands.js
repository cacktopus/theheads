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

// Returns a new immutable object for a new stand
const createNewStand = ({
    name = undefined, 
    pos = { x: 0, y: 0},
    rot = 0, 
    cameras = [defaultCamera],
    heads = [defaultHead]
} = {}, state) => {

    if (!name) {
        name = getNewName(state);
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

const getNewName = state => {
    const stands = state.toJS();

    let maxStandNum = Math.max.apply(null, stands.map(st => st.name).filter(d => d.indexOf("stand") === 0 ).map(d => parseInt(d.replace("stand",""))).filter(d => !isNaN(d)))

    if (maxStandNum >= 0) {
        return `stand${maxStandNum + 1}`;
    } else {
        return `stand0`;
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
        default:
            return state;
    }
}

export default stands