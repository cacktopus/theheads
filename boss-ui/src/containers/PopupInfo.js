import { connect } from 'react-redux'
import { popupInfoMove, popupInfoRemove, popupInfoSetStandAsAnchor } from '../actions'
import PopupInfo from '../components/PopupInfo'

const mapStateToProps = (state, ownProps) => {
    // const stands = state.stands;
    // const menu = state.menu;
    // let stand = {}; // The stand for the camera
    // let cameras;

    // if (stands && stands.get && stands.get(ownProps.standIndex)) {
    //     stand = stands.get(ownProps.standIndex);

    //     if (stand.get && stand.get("cameras")) {
    //         cameras = stand.get("cameras");
    //     }
    // }

    const standIndex = ownProps.standIndex;

    const stand = state.stands.get(standIndex);
    let headName;
    let headNames;

    let standHeads = state.stands.getIn([standIndex, "heads"]);

    if (standHeads && standHeads.size > 0) {
        headNames = Object.keys(standHeads.toJS());
        if (headNames && headNames.length > 0) {
            headName = standHeads.getIn([headNames[0], "name"]);
        }
    }

    return ({
        // stands: state.stands, //ownProps.filter === state.visibilityFilter
        stand, //: state.stands.get(ownProps.standIndex),
        popupInfo: state.stands.getIn([standIndex,"popupInfo"]),
        menu: state.menu,
        headName
    });
}

// const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;

const mapDispatchToProps = (dispatch, ownProps) => ({
    // selectCamera: () => dispatch(menuSelectCamera({standIndex : ownProps.standIndex, cameraIndex: ownProps.cameraIndex})),
    popupInfoMove: (pos) => dispatch(popupInfoMove(ownProps.standIndex, pos)),
    popupInfoRemove: (pos) => dispatch(popupInfoRemove(ownProps.standIndex)),
    setAsAnchor: (stand) => dispatch(popupInfoSetStandAsAnchor({
        pos: stand.get("pos").toJS(),
        standIndex : ownProps.standIndex,
        standName : stand.get("name")
    }))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PopupInfo)