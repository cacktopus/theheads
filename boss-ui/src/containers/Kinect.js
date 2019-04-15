import { connect } from 'react-redux'
import { kinectMoveByName, kinectRotateByName, menuSelectKinectByName } from '../actions'
import Kinect from '../components/Kinect'

const mapStateToProps = (state, ownProps) =>
({
  kinects: state.kinects, //ownProps.filter === state.visibilityFilter
  menu: state.menu,
});

// const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;

const mapDispatchToProps = (dispatch, ownProps) => ({
    // kinectMove: (kinectIndex, pos) => dispatch(kinectMove(ownProps.filter)),
    kinectSelect: () => dispatch(menuSelectKinectByName(ownProps.kinectName)),

    // kinectSetField: (fieldName, value) => dispatch(kinectSetFieldByName(ownProps.index, fieldName, value)), // pos = {x, y}
    // kinectSetInFields: (fieldNames, value) => dispatch(kinectSetInFieldsByName(ownProps.index, fieldNames, value)), // pos = {x, y}

    kinectMove: (pos) => dispatch(kinectMoveByName({kinectName: ownProps.kinectName, pos})), // pos = {x, y}
    // kinectRemove: () => dispatch(kinectRemoveByName(ownProps.index)), // pos = {x, y}
    kinectRotate: (rot) => dispatch(kinectRotateByName({kinectName: ownProps.kinectName, rot})) // rot = radian amount
    // kinectMoveByName: (kinectIndex, pos) => dispatch(kinectMoveByName(ownProps.index, pos)), // pos = {x, y}
    // kinectRotateByName: (kinectIndex, rot) => dispatch(kinectRotateByName(ownProps.index, rot)) // rot = radian amount
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Kinect)