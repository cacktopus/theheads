import {fromJS} from "immutable";

const initialState = {
    selectedStandIndex : 0,
    selectedCameraIndex : 0,
    selectedHeadIndex : 0
}

const stands = (state = fromJS(initialState), action) => {
    switch (action.type) {
        case 'MENU_SELECT_STAND':
            return state.set("selectedStandIndex", action.index);
        case 'MENU_SELECT_CAMERA':
            return state.set("selectedCameraIndex", action.index);
        case 'MENU_SELECT_HEAD':
            return state.set("selectedHeadIndex", action.index);
        default:
            return state;
    }
}

export default stands