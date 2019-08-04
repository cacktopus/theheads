import { fromJS } from "immutable";
// https://www.npmjs.com/package/@giantmachines/redux-websocket

// const createNewAnchor = ({
//     name = undefined,
//     pos = { x: 0, y: 0 },
//     isSelected = false
// } = {}, state) => {

//     return fromJS({
//         name,
//         pos,
//         isSelected
//     })
// }

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
            window.c_aaa = action.sceneData;
            // eval('debugger');
            if (action.sceneData && action.sceneData.anchors && action.sceneData.anchors.length > 0) {
                return fromJS(action.sceneData.anchors);
            }
            return state;

        // // Active or not
        // case 'ANCHOR_SET_IS_ACTIVE':
        //     tempStandIndex = getStandIndexFromHeadName(state, action.headName);

        //     if (tempStandIndex >= 0) {
        //         return state.setIn([tempStandIndex, "isActive"], true);
        //     } else {
        //         return state;
        //     }
        // case 'ANCHOR_SET_IS_NOT_ACTIVE':
        //     tempStandIndex = getStandIndexFromHeadName(state, action.headName);

        //     if (tempStandIndex >= 0) {
        //         return state.setIn([tempStandIndex, "isActive"], false);
        //     } else {
        //         return state;
        //     }

        // Default
        default:
            return state;
    }
}

export default anchors