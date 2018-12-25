import {fromJS} from "immutable";
import { WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";

const initialState = {
    lines: [],
}

const stands = (state = fromJS(initialState), action) => {
    let newState = state;

    switch (action.type) {
        case WEBSOCKET_MESSAGE:
            console.log(`Motion lines`, action);
            return state;
        default:
            return state;
    }
}

export default stands