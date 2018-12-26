import {fromJS} from "immutable";

// lines have a lineId and value of { shape: "draw", coords: [1,2,3,4]}
const initialState = {
    lines: {}
    // lines: {
    //     "temp123" : {shape: "line", coords: [-0.75, 0, 0.906222523654036, -4.717724764347858]}
    // },
}

const stands = (state = fromJS(initialState), action) => {
    switch (action.type) {
        case 'MOTIONLINES_ADD': 
            return state.setIn(["lines",action.lineId], fromJS({shape: action.shape, coords: action.coords}));
        case 'MOTIONLINES_REMOVE': 
            return state.removeIn(["lines",action.lineId]);
        default:
            return state;
    }
}

export default stands