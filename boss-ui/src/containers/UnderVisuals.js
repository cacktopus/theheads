import { connect } from 'react-redux'
// import { menuSelectCamera, cameraMoveByIndex, cameraRotateByIndex} from '../actions'
import UnderVisuals from '../components/UnderVisuals'

const mapStateToProps = (state, ownProps) => {
    return ({
        stands: state.stands, //ownProps.filter === state.visibilityFilter
        menu: state.menu
    });
}

// const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;

const mapDispatchToProps = (dispatch, ownProps) => ({
    // selectCamera: () => dispatch(menuSelectCamera({standIndex : ownProps.standIndex, cameraIndex: ownProps.cameraIndex})),
    // cameraMove: (pos) => dispatch(cameraMoveByIndex(ownProps.standIndex, ownProps.cameraIndex, pos)),
    // cameraRotate: (rot) => dispatch(cameraRotateByIndex(ownProps.standIndex, ownProps.cameraIndex, rot))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UnderVisuals)