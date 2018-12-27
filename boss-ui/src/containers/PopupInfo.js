import { connect } from 'react-redux'
import { popupInfoMove, popupInfoRemove } from '../actions'
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


    return ({
        // stands: state.stands, //ownProps.filter === state.visibilityFilter
        stand: state.stands.get(ownProps.standIndex),
        popupInfo: state.stands.getIn([ownProps.standIndex,"popupInfo"]),
        menu: state.menu
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
    // cameraRotate: (rot) => dispatch(cameraRotateByIndex(ownProps.standIndex, ownProps.cameraIndex, rot))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PopupInfo)