// import {fromJS} from "immutable";
// // https://www.npmjs.com/package/@giantmachines/redux-websocket
// // import { WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";
// // import { WEBSOCKET_CONNECTING, WEBSOCKET_OPEN, WEBSOCKET_CLOSED, WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";

// const initialState = {};

// const stands = (state = fromJS(initialState), action) => {
    
//     let newState = state;
//     console.log('pop actions', action.type);

//     switch (action.type) {

//         // Popup
//         case 'POPUP_MOVE_BY_INDEX':
//             return state; //state.setIn(["popups", action.popupId], {type: action.popupType});
//         case 'POPUP_ADD_NEW':
//             console.log("ACTIN=",action);
//             return state.set(action.popupId, {type: action.popupType, standIndex: action.standIndex});
//         case 'POPUP_REMOVE':
//             return state.remove(action.popupId);

//         // Default
//         default:
//             return state;
//     }
// }

// export default stands