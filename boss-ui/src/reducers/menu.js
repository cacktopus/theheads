import {fromJS} from "immutable";
import { setCookie, getCookie, getCookieAsBoolean } from '../helpers';
import { WEBSOCKET_CONNECTING, WEBSOCKET_OPEN, WEBSOCKET_CLOSED } from "@giantmachines/redux-websocket";
// NOTE: WEBSOCKET_MESSAGE is dealt within ../middleware/index.js
// ... which in turn handles the message and dispatches a specific type of dispatch message

const scale = getCookie("menu-scale");
const translateX = getCookie("menu-translateX");
const translateY = getCookie("menu-translateY");

// window.c_34 = {setCookie, getCookie};


const initialState = {
    selectedStandIndex : undefined,
    selectedCameraIndex : undefined,
    selectedHeadIndex : undefined,
    selectedFocalPointIndex : undefined,
    isRotatesHidden : getCookieAsBoolean("menu-isRotatesHidden") || 0,
    isStandRotatesHidden : getCookieAsBoolean("menu-isStandRotatesHidden") || 0,
    isHeadRotatesHidden : getCookieAsBoolean("menu-isHeadRotatesHidden") || 0,
    isCameraRotatesHidden : getCookieAsBoolean("menu-isCameraRotatesHidden") || 0,
    isShowDistances : typeof getCookieAsBoolean("menu-isShowDistances") !== "undefined" ? getCookieAsBoolean("menu-isShowDistances") : true,
    anchorDistancesRound : getCookie("menu-anchorDistancesRound") || 4,
    anchorDistancesUnit : getCookie("menu-anchorDistancesUnit") || "meters",
    isForceShowStandRotatesOnSelect : getCookieAsBoolean("menu-isForceShowStandRotatesOnSelect") || 0,
    isForceShowHeadRotatesOnSelect : getCookieAsBoolean("menu-isForceShowHeadRotatesOnSelect") || 0,
    isForceShowCameraRotatesOnSelect : getCookieAsBoolean("menu-isForceShowCameraRotatesOnSelect") || 0,
    scale: scale !== null ? scale : 1,
    translate: {
        x: translateX !== null ? translateX : 0,
        y: translateY !== null ? translateY : 0
    },
    websocketStatus: undefined
}

const stands = (state = fromJS(initialState), action) => {
    let newState = state;

    switch (action.type) {
        case 'MENU_DESELECT_STAND_AND_ALL':
            newState = newState.set("selectedStandIndex", undefined);
            newState = newState.set("selectedHeadIndex", undefined);
            return newState.set("selectedCameraIndex", undefined);
        case 'MENU_SELECT_STAND':
            newState = newState.set("selectedStandIndex", parseInt(action.index));
            newState = newState.set("selectedHeadIndex", 0);
            return newState.set("selectedCameraIndex", 0);
        case 'MENU_SELECT_CAMERA':
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
        case 'MENU_HIDE_ALL_ROTATES':
            setCookie("menu-isStandRotatesHidden", true);
            setCookie("menu-isHeadRotatesHidden", true);
            setCookie("menu-isCameraRotatesHidden", true);
            newState = state.set("isStandRotatesHidden", true);
            newState = newState.set("isHeadRotatesHidden", true);
            return newState.set("isCameraRotatesHidden", true);
            
        case 'MENU_SHOW_ALL_ROTATES':
            setCookie("menu-isStandRotatesHidden", false);
            setCookie("menu-isHeadRotatesHidden", false);
            setCookie("menu-isCameraRotatesHidden", false);
            newState = state.set("isStandRotatesHidden", false);
            newState = newState.set("isHeadRotatesHidden", false);
            return newState.set("isCameraRotatesHidden", false);

        case 'MENU_HIDE_ALL_DISTANCES':
            setCookie("menu-isShowDistances", false);
            // setCookie("menu-isHeadRotatesHidden", true);
            // setCookie("menu-isCameraRotatesHidden", true);
            newState = state.set("isShowDistances", false);
            return newState;
            // newState = newState.set("isHeadRotatesHidden", true);
            // return newState.set("isCameraRotatesHidden", true);

        case 'MENU_SET_ANCHOR_DISTANCES_ROUND':
            setCookie("menu-anchorDistancesRound", action.value);
            newState = state.set("anchorDistancesRound", action.value);
            return newState;

        case 'MENU_SET_ANCHOR_DISTANCES_UNIT':
            setCookie("menu-anchorDistancesUnit", action.value);
            newState = state.set("anchorDistancesUnit", action.value);
            return newState;

        case 'MENU_SHOW_ALL_DISTANCES':
            setCookie("menu-isShowDistances", true);
            newState = state.set("isShowDistances", true);
            return newState;
            // setCookie("menu-isHeadRotatesHidden", false);
            // setCookie("menu-isCameraRotatesHidden", false);
            // newState = state.set("isStandRotatesHidden", false);
            // newState = newState.set("isHeadRotatesHidden", false);
            // return newState.set("isCameraRotatesHidden", false);

        case 'MENU_TOGGLE_HIDE_ROTATES':
            if (action.rotateType === "stand") {
                setCookie("menu-isStandRotatesHidden", !state.get("isStandRotatesHidden"));
                return state.set("isStandRotatesHidden", !state.get("isStandRotatesHidden"));
            } else if (action.rotateType === "head") {
                setCookie("menu-isHeadRotatesHidden", !state.get("isHeadRotatesHidden"));
                return state.set("isHeadRotatesHidden", !state.get("isHeadRotatesHidden"));
            } else if (action.rotateType === "camera") {
                setCookie("menu-isCameraRotatesHidden", !state.get("isCameraRotatesHidden"));
                return state.set("isCameraRotatesHidden", !state.get("isCameraRotatesHidden"));
            }
            break;
        case 'MENU_ENABLE_FORCE_SHOW_ALL_ROTATES_ON_SELECT':
            setCookie("menu-isForceShowStandRotatesOnSelect", true);
            setCookie("menu-isForceShowHeadRotatesOnSelect", true);
            setCookie("menu-isForceShowCameraRotatesOnSelect", true);
            newState = state.set("isForceShowStandRotatesOnSelect", true);
            newState = newState.set("isForceShowHeadRotatesOnSelect", true);
            return newState.set("isForceShowCameraRotatesOnSelect", true);
        case 'MENU_DISABLE_FORCE_SHOW_ALL_ROTATES_ON_SELECT':
            setCookie("menu-isForceShowStandRotatesOnSelect", false);
            setCookie("menu-isForceShowHeadRotatesOnSelect", false);
            setCookie("menu-isForceShowCameraRotatesOnSelect", false);
            newState = state.set("isForceShowStandRotatesOnSelect", false);
            newState = newState.set("isForceShowHeadRotatesOnSelect", false);
            return newState.set("isForceShowCameraRotatesOnSelect", false);           
        case 'MENU_TOGGLE_FORCE_SHOW_ROTATES_ON_SELECT':
            if (action.rotateType === "stand") {
                setCookie("menu-isForceShowStandRotatesOnSelect", !state.get("isForceShowStandRotatesOnSelect"));
                return state.set("isForceShowStandRotatesOnSelect", !state.get("isForceShowStandRotatesOnSelect"));
            } else if (action.rotateType === "head") {
                setCookie("menu-isForceShowHeadRotatesOnSelect", !state.get("isForceShowHeadRotatesOnSelect"));
                return state.set("isForceShowHeadRotatesOnSelect", !state.get("isForceShowHeadRotatesOnSelect"));
            } else if (action.rotateType === "camera") {
                setCookie("menu-isForceShowCameraRotatesOnSelect", !state.get("isForceShowCameraRotatesOnSelect"));
                return state.set("isForceShowCameraRotatesOnSelect", !state.get("isForceShowCameraRotatesOnSelect"));
            }
            break;
        case 'MENU_SET_SCALE':
            const scaleVal = Math.max(1, action.scale);
            setCookie("menu-scale", scaleVal);
            return state.set("scale", scaleVal);
        case 'MENU_SET_TRANSLATE_X':
            setCookie("menu-translateX", action.x);
            return state.setIn(["translate","x"], action.x);
        case 'MENU_SET_TRANSLATE_Y':
            setCookie("menu-translateY", action.y);
            return state.setIn(["translate","y"], action.y);
        // case 'MENU_SET_TRANSLATE':
        //     return state.setIn(["translate","y"], action.y);
        case WEBSOCKET_CONNECTING:
            return state.set("websocketStatus", "connecting");
        case WEBSOCKET_OPEN:
            return state.set("websocketStatus", "open");
        case WEBSOCKET_CLOSED:
            return state.set("websocketStatus", undefined);
        default:
            return state;
    }
}

export default stands