import { fromJS } from "immutable";
// https://www.npmjs.com/package/@giantmachines/redux-websocket

const createNewAnchor = ({
    name = undefined,
    pos = { x: 0, y: 0 },
    standIndex = undefined
} = {}, state) => {

    return fromJS({
        name,
        pos,
        standIndex
    })
}

const anchors = (state = fromJS([]), action) => {    
    // let newState;

    switch (action.type) {

        // case 'ANCHOR_ADD':
        //     return state.push(createNewAnchor({}, state));

        // case 'ANCHOR_SETIN_FIELDS_BY_INDEX':
        //     // return state.setIn([action.index,"pos"], fromJS(action.pos));
        //     let setInLocation = [action.index];
        //     setInLocation = setInLocation.concat(action.fieldNames);
        //     return state.setIn(setInLocation, fromJS(action.value));
        // case 'ANCHOR_SET_FIELD_BY_INDEX':
        //     return state.setIn([action.index, action.fieldName], fromJS(action.value));

        // Scene
        case 'ANCHOR_SET_SCENE':
            if (action.sceneData && action.sceneData.anchors && action.sceneData.anchors.length > 0) {
                return fromJS(action.sceneData.anchors);
            }
            return state;

        // Active or not
        case 'POPUP_INFO_SET_STAND_AS_ANCHOR':
            return state.push(createNewAnchor({
                pos: action.pos,
                standIndex: action.standIndex,
                name: `anchor-stand-${action.standName}`
            }));

        // Remove all stand related anchors
        case 'POPUP_INFO_CLEAR_ALL_STAND_ANCHORS':
            return state.filter(a => a.get("standIndex") === undefined)

        // Default
        default:
            return state;
    }
}

export default anchors