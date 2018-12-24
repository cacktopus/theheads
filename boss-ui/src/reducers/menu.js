import {fromJS} from "immutable";
import { setCookie, getCookie } from '../helpers';

const scale = getCookie("menu-scale");
const translateX = getCookie("menu-translateX");
const translateY = getCookie("menu-translateY");

window.c_34 = {setCookie, getCookie};

const initialState = {
    selectedStandIndex : 0,
    selectedCameraIndex : 0,
    selectedHeadIndex : 0,
    areRotatesHidden : 0,
    scale: scale !== null ? scale : 1,
    translate: {
        x: translateX !== null ? translateX : 0,
        y: translateY !== null ? translateY : 0
    }
}

const stands = (state = fromJS(initialState), action) => {
    let newState = state;

    switch (action.type) {
        case 'MENU_SELECT_STAND':
            return state.set("selectedStandIndex", parseInt(action.index));
        case 'MENU_SELECT_CAMERA':
            console.log(action);
            newState = state.set("selectedCameraIndex", parseInt(action.cameraIndex));

            // If standIndex is defined set that as well
            if (action.standIndex) {
                newState = newState.set("selectedStandIndex", parseInt(action.standIndex));
            }
            return newState;
        case 'MENU_SELECT_HEAD':
            newState = state.set("selectedHeadIndex", parseInt(action.headIndex));

            // If standIndex is defined set that as well
            if (action.standIndex) {
                newState = newState.set("selectedStandIndex", parseInt(action.standIndex));
            }
            return newState;
        case 'MENU_TOGGLE_HIDE_ROTATES':
            return state.set("areRotatesHidden", !state.get("areRotatesHidden"));
        case 'MENU_SET_SCALE':
            setCookie("menu-scale", action.scale);
            return state.set("scale", action.scale);
        case 'MENU_SET_TRANSLATE_X':
            setCookie("menu-translateX", action.x);
            return state.setIn(["translate","x"], action.x);
        case 'MENU_SET_TRANSLATE_Y':
            setCookie("menu-translateY", action.y);
            return state.setIn(["translate","y"], action.y);
        // case 'MENU_SET_TRANSLATE':
        //     return state.setIn(["translate","y"], action.y);
        default:
            return state;
    }
}

export default stands