// WEBSOCKET
import { WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket'

const websocketUrl = "ws://localhost:8081/ws";
export const websocketConnect = (url = websocketUrl) => {
    return {
        type: WEBSOCKET_CONNECT,
        payload: { url }
    }
}

export const websocketDisconnect = () => {
    return {
        type: WEBSOCKET_DISCONNECT,
    }
}

export const websocketSend = (payload) => {
    // console.log('WEBSOCK SEND', payload);
    return {
        type: WEBSOCKET_SEND,
        payload: payload
    }
}

// MENU
export const menuDeselectStandAndAll = () => ({
    type: 'MENU_DESELECT_STAND_AND_ALL',
})

export const menuSelectStand = index => ({
    type: 'MENU_SELECT_STAND',
    index
})

export const menuSelectCamera = ({ standIndex, cameraIndex }) => {
    return ({
        type: 'MENU_SELECT_CAMERA',
        standIndex,
        cameraIndex
    })
}

export const menuSelectKinect = kinectName => ({
    type: 'MENU_SELECT_KINECT',
    kinectName
})

// export const menuSelectCamera = ({standIndex, cameraIndex}) => ({
//     type: 'MENU_SELECT_CAMERA',
//     standIndex,
//     cameraIndex
// })

export const menuSelectHead = ({ standIndex, headIndex }) => ({
    type: 'MENU_SELECT_HEAD',
    standIndex,
    headIndex
})

export const menuSelectFocalPoint = index => ({
    type: 'MENU_SELECT_FOCALPOINT',
    index
})

export const menuHideAllRotates = () => ({
    type: 'MENU_HIDE_ALL_ROTATES'
})

export const menuShowAllRotates = () => ({
    type: 'MENU_SHOW_ALL_ROTATES'
})

export const menuEnableForceShowAllRotatesOnSelect = () => ({
    type: 'MENU_ENABLE_FORCE_SHOW_ALL_ROTATES_ON_SELECT'
})

export const menuDisableForceShowAllRotatesOnSelect = () => ({
    type: 'MENU_DISABLE_FORCE_SHOW_ALL_ROTATES_ON_SELECT'
})

export const menuToggleHideRotates = (rotateType) => ({
    type: 'MENU_TOGGLE_HIDE_ROTATES',
    rotateType
})

export const menuToggleForceShowRotatesOnSelect = (rotateType) => ({
    type: 'MENU_TOGGLE_FORCE_SHOW_ROTATES_ON_SELECT',
    rotateType
})

export function sceneFetchFromUrl(sceneUrl) {
    return dispatch => {
        return fetch(sceneUrl)
            .then(response => response.json())
            .then(json => {
                if (typeof json === "object") {
                    if (json.scale) {
                        dispatch(menuSetScale(json.scale));
                    }
                    if (json.translate && json.translate.x && json.translate.y) {
                        dispatch(menuSetTranslateX(json.translate.x));
                        dispatch(menuSetTranslateY(json.translate.y));
                    }
                    // if (json.kinects) {
                    //     console.log("kinnn");
                    //     dispatch(kinectSetScene(json))
                    // }
                }
                
                dispatch(standSetScene(json))
            })
            .catch(e => console.log(e))
    }
}

export const standSetScene = (sceneData) => ({
    type: 'STAND_SET_SCENE',
    sceneData
});

export const menuSetScale = (scale) => ({
    type: 'MENU_SET_SCALE',
    scale
});

export const menuSetTranslateX = (x) => ({
    type: 'MENU_SET_TRANSLATE_X',
    x
});

export const menuSetTranslateY = (y) => ({
    type: 'MENU_SET_TRANSLATE_Y',
    y
});

// STAND

export const standAdd = options => ({
    type: 'STAND_ADD',
    options
})

export const standSetFieldByIndex = (standIndex, fieldName, value) => ({
    type: 'STAND_SET_FIELD_BY_INDEX',
    index: standIndex,
    fieldName,
    value
});

export const standSetInFieldsByIndex = (standIndex, fieldNames, value) => ({
    type: 'STAND_SETIN_FIELDS_BY_INDEX',
    index: standIndex,
    fieldNames,
    value
});

export const standMoveByIndex = (standIndex, pos) => ({
    type: 'STAND_MOVE_BY_INDEX',
    index: standIndex,
    pos
})
export const standRotateByIndex = (standIndex, rot) => ({
    type: 'STAND_ROTATE_BY_INDEX',
    index: standIndex,
    rot
})

export const standRemoveByIndex = index => ({
    type: 'STAND_REMOVE_BY_INDEX',
    index
})

export const standSetIsActive = (headName) => ({
    type: 'STAND_SET_IS_ACTIVE',
    headName
})

export const standSetIsNotActive = (headName) => ({
    type: 'STAND_SET_IS_NOT_ACTIVE',
    headName
})

// KINECT
export const kinectMoveByIndex = (standIndex, kinectIndex, pos) => ({
    type: 'KINECT_MOVE_BY_INDEX',
    standIndex: standIndex,
    kinectIndex: kinectIndex,
    pos
})

export const kinectRotateByIndex = (standIndex, kinectIndex, rot) => ({
    type: 'KINECT_ROTATE_BY_INDEX',
    standIndex,
    kinectIndex,
    rot
})

export const kinectAddNew = (standIndex) => ({
    type: 'KINECT_ADD_NEW',
    standIndex
})

export const kinectRemoveByIndex = (standIndex, kinectIndex) => ({
    type: 'KINECT_REMOVE_BY_INDEX',
    standIndex,
    kinectIndex
})

export const kinectSetFocalPoints = ({kinectName, focalPoints}) => ({
    type: 'KINECT_SET_FOCAL_POINTS',
    focalPoints,
    kinectName
})

export const kinectClearFocalPoints = ({kinectName}) => ({
    type: 'KINECT_CLEAR_FOCAL_POINTS',
    kinectName
})

// export const kinectSetScene = (sceneData) => ({
//     type: 'KINECT_SET_SCENE',
//     sceneData
// });

// export const kinectMoveByName = ({kinectName, pos}) => ({
//     type: 'KINECT_MOVE_BY_NAME',
//     kinectName: kinectName,
//     pos
// })

// export const kinectRotateByName = ({kinectName, rot}) => ({
//     type: 'KINECT_ROTATE_BY_NAME',
//     kinectName,
//     rot
// })

// export const kinectClearFocalPoints = (kinectName) => ({
//     type: 'KINECT_CLEAR_FOCAL_POINTS',
//     kinectName
// })

// HEAD
export const headMoveByIndex = (standIndex, headIndex, pos) => ({
    type: 'HEAD_MOVE_BY_INDEX',
    standIndex: standIndex,
    headIndex: headIndex,
    pos
})

// Note this is similar to getting "head-positioned" from the websocket
export const headRotateByHeadName = (headName, rotation) => ({
    type: 'HEAD_ROTATE_BY_HEADNAME',
    headName,
    rotation
})

export const headRotateByIndex = (standIndex, headIndex, rot) => ({
    type: 'HEAD_ROTATE_BY_INDEX',
    standIndex,
    headIndex,
    rot
})

export const headRotateStartByIndex = (standIndex, headIndex) => ({
    type: 'HEAD_ROTATE_START_BY_INDEX',
    standIndex,
    headIndex
})
export const headRotateStopByIndex = (standIndex, headIndex) => ({
    type: 'HEAD_ROTATE_STOP_BY_INDEX',
    standIndex,
    headIndex
})

// CAMERA
export const cameraMoveByIndex = (standIndex, cameraIndex, pos) => ({
    type: 'CAMERA_MOVE_BY_INDEX',
    standIndex: standIndex,
    cameraIndex: cameraIndex,
    pos
})

export const cameraRotateByIndex = (standIndex, cameraIndex, rot) => ({
    type: 'CAMERA_ROTATE_BY_INDEX',
    standIndex,
    cameraIndex,
    rot
})

export const cameraAddNew = (standIndex) => ({
    type: 'CAMERA_ADD_NEW',
    standIndex
})

export const cameraRemoveByIndex = (standIndex, cameraIndex) => ({
    type: 'CAMERA_REMOVE_BY_INDEX',
    standIndex,
    cameraIndex
})

// POPUP
export const popupInfoMove = (standIndex, pos) => ({
    type: 'POPUP_INFO_MOVE_BY_INDEX',
    // popupId: popupId,
    standIndex,
    pos
})

export const popupInfoAddNew = (standIndex, pos) => ({
    type: 'POPUP_INFO_ADD_NEW',
    standIndex,
    // popupId,
    // popupType,
    pos,
    // payload
})

export const popupInfoRemove = (standIndex) => ({
    type: 'POPUP_INFO_REMOVE',
    standIndex
})

// FOCAL POINTS

export const focalPointAdd = options => ({
    type: 'FOCALPOINT_ADD',
    options
})

// export const focalPointSetFieldByIndex = (focalPointIndex, fieldName, value) => ({
//     type: 'FOCALPOINT_SET_FIELD_BY_INDEX',
//     index: focalPointIndex,
//     fieldName,
//     value
// });

// export const focalPointSetInFieldsByIndex = (focalPointIndex, fieldNames, value) => ({
//     type: 'FOCALPOINT_SETIN_FIELDS_BY_INDEX',
//     index: focalPointIndex,
//     fieldNames,
//     value
// });

export const focalPointMoveByIndex = (focalPointIndex, pos) => ({
    type: 'FOCALPOINT_MOVE_BY_INDEX',
    index: focalPointIndex,
    pos
})

export const focalPointRemoveByIndex = index => ({
    type: 'FOCALPOINT_REMOVE_BY_INDEX',
    index
})

export const focalPointSetIsActive = (focalPointName) => ({
    type: 'FOCALPOINT_SET_IS_ACTIVE',
    focalPointName
})

export const focalPointSetIsNotActive = (focalPointName) => ({
    type: 'FOCALPOINT_SET_IS_NOT_ACTIVE',
    focalPointName
})


// export const standRemoveByIndex = index => ({
//     type: 'STAND_REMOVE_BY_INDEX',
//     index
// })

// WEBSOCKET - MOTION LINES

export const motionLinesAddLine = (options) => {
    const { lineId, shape, coords } = options;

    return {
        type: 'MOTIONLINES_ADD',
        lineId,
        shape,
        coords
    }
}

export const motionLinesRemoveLine = (options) => {
    const { lineId } = options;
    return {
        type: 'MOTIONLINES_REMOVE',
        lineId,
    }
}