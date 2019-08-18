import { connect } from 'react-redux'
import {
    menuDisableForceShowAllRotatesOnSelect,
    menuEnableForceShowAllRotatesOnSelect,
    menuToggleForceShowRotatesOnSelect,
    menuDeselectStandAndPopupInfoAll,
    menuHideAllRotates,
    menuShowAllRotates,
    menuShowAllDistances,
    menuHideAllDistances,
    menuSetAnchorDistancesRound,
    menuSetAnchorDistancesUnit,
    popupInfoClearAllStandAnchors,
    menuToggleHideRotates,
    sceneFetchFromUrl,
    cameraAddNew,
    cameraRemoveByIndex,
    standAdd,
    focalPointAdd,
    menuSelectStand,
    menuSelectCamera,
    menuSelectHead,
    standSetFieldByIndex,
    standSetInFieldsByIndex,
    menuSetScale,
    menuSetTranslateX,
    menuSetTranslateY,
    websocketConnect,
    websocketDisconnect
} from '../actions';

import Menu from '../components/Menu'

const mapStateToProps = (state, ownProps) =>
    ({
        stands: state.stands,
        menu: state.menu,
        selectedStandIndex: state.menu && state.menu.get ? state.menu.get("selectedStandIndex") : 0,
        selectedCameraIndex: state.menu && state.menu.get ? state.menu.get("selectedCameraIndex") : 0,
        //   selectedHeadIndex: state.menu && state.menu.get ? state.menu.get("selectedHeadIndex") : 0
    });

const mapDispatchToProps = (dispatch, ownProps) => ({
    addStand: () => dispatch(standAdd()),
    addFocalPoint: () => dispatch(focalPointAdd()),
    loadSceneFromUrl: (sceneUrl) => dispatch(sceneFetchFromUrl(sceneUrl)),
    selectStand: index => dispatch(menuSelectStand(index)),
    selectCamera: (cameraIndex) => dispatch(menuSelectCamera({ cameraIndex })),
    // selectCamera: (cameraIndex) => dispatch(menuSelectCamera({cameraIndex})),
    // selectCamera: (standIndex, cameraIndex) => dispatch(menuSelectCamera(standIndex, cameraIndex)),
    selectHead: (headIndex) => dispatch(menuSelectHead({ headIndex })),
    menuDeselectStandAndPopupInfoAll: () => dispatch(menuDeselectStandAndPopupInfoAll()),

    // selectHead: (standIndex, headIndex)  => dispatch(menuSelectHead(standIndex, headIndex)),
    standSetField: (index, fieldName, value) => dispatch(standSetFieldByIndex(index, fieldName, value)), // pos = {x, y}
    standSetInFields: (index, fieldNames, value) => dispatch(standSetInFieldsByIndex(index, fieldNames, value)), // pos = {x, y}
    cameraAddNew: (standIndex) => dispatch(cameraAddNew(standIndex)),
    cameraRemove: (standIndex, cameraIndex) => dispatch(cameraRemoveByIndex(standIndex, cameraIndex)),

    setScale: scale => dispatch(menuSetScale(scale)),
    setTranslateX: x => dispatch(menuSetTranslateX(x)),
    setTranslateY: y => dispatch(menuSetTranslateY(y)),

    menuToggleHideCameraRotates: () => dispatch(menuToggleHideRotates("camera")),
    menuToggleHideStandRotates: () => dispatch(menuToggleHideRotates("stand")),
    menuToggleHideHeadRotates: () => dispatch(menuToggleHideRotates("head")),
    menuHideAllRotates: () => dispatch(menuHideAllRotates()),
    menuShowAllRotates: () => dispatch(menuShowAllRotates()),
    menuShowAllDistances: () => dispatch(menuShowAllDistances()),
    menuHideAllDistances: () => dispatch(menuHideAllDistances()),
    menuSetAnchorDistancesRound: (value) => dispatch(menuSetAnchorDistancesRound(value)),
    menuSetAnchorDistancesUnit: (value) => dispatch(menuSetAnchorDistancesUnit(value)),
    popupInfoClearAllStandAnchors: () => dispatch(popupInfoClearAllStandAnchors()),

    menuToggleForceShowCameraRotatesOnSelect: () => dispatch(menuToggleForceShowRotatesOnSelect("camera")),
    menuToggleForceShowStandRotatesOnSelect: () => dispatch(menuToggleForceShowRotatesOnSelect("stand")),
    menuToggleForceShowHeadRotatesOnSelect: () => dispatch(menuToggleForceShowRotatesOnSelect("head")),
    menuDisableForceShowAllRotatesOnSelect: () => dispatch(menuDisableForceShowAllRotatesOnSelect()),
    menuEnableForceShowAllRotatesOnSelect: () => dispatch(menuEnableForceShowAllRotatesOnSelect()),

    websocketConnect: (url) => dispatch(websocketConnect(url)),
    websocketDisconnect: () => dispatch(websocketDisconnect()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu)