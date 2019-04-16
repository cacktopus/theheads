import { connect } from 'react-redux'
import { menuSelectKinect, kinectMoveByIndex, kinectRotateByIndex} from '../actions'
import Kinect from '../components/Kinect'

const mapStateToProps = (state, ownProps) => {

    return ({
        stands: state.stands, //ownProps.filter === state.visibilityFilter
        stand: state.stands.get(ownProps.standIndex),
        // kinects: state.stands .get(ownProps.index),
        menu: state.menu
    });
}

// const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;

const mapDispatchToProps = (dispatch, ownProps) => ({
    selectKinect: () => dispatch(menuSelectKinect({standIndex : ownProps.standIndex, kinectIndex: ownProps.kinectIndex})),
    kinectMove: (pos) => dispatch(kinectMoveByIndex(ownProps.standIndex, ownProps.kinectIndex, pos)),
    kinectRotate: (rot) => dispatch(kinectRotateByIndex(ownProps.standIndex, ownProps.kinectIndex, rot))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Kinect)


// import { connect } from 'react-redux'
// import { kinectRemoveByName, kinectMoveByName, kinectRotateByName, menuSelectKinectByName } from '../actions'
// import Kinect from '../components/Kinect'

// const mapStateToProps = (state, ownProps) =>
// ({
//   kinects: state.kinects,
//   menu: state.menu,
// });

// // const mapStateToProps = (state, ownProps) => ({});
// // // ({
// // // //   active: ownProps.filter === state.visibilityFilter
// // // })​;

// const mapDispatchToProps = (dispatch, ownProps) => ({
//     kinectSelect: () => dispatch(menuSelectKinectByName(ownProps.kinectName)),
//     kinectMove: (pos) => dispatch(kinectMoveByName({kinectName: ownProps.kinectName, pos})), // pos = {x, y}
//     // kinectRemove: () => dispatch(kinectRemoveByName(ownProps.kinectName)), // pos = {x, y}
//     kinectRotate: (rot) => dispatch(kinectRotateByName({kinectName: ownProps.kinectName, rot})) // rot = radian amount
// });

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Kinect)



// // import { connect } from 'react-redux'
// // import { kinectMoveByName, kinectRotateByName, menuSelectKinectByName } from '../actions'
// // import Kinect from '../components/Kinect'

// // const mapStateToProps = (state, ownProps) =>
// // ({
// //   kinects: state.kinects, //ownProps.filter === state.visibilityFilter
// //   menu: state.menu,
// // });

// // // const mapStateToProps = (state, ownProps) => ({});
// // // // ({
// // // // //   active: ownProps.filter === state.visibilityFilter
// // // // })​;

// // const mapDispatchToProps = (dispatch, ownProps) => ({
// //     // kinectMove: (kinectIndex, pos) => dispatch(kinectMove(ownProps.filter)),
// //     kinectSelect: () => dispatch(menuSelectKinectByName(ownProps.kinectName)),

// //     // kinectSetField: (fieldName, value) => dispatch(kinectSetFieldByName(ownProps.kinectName, fieldName, value)), // pos = {x, y}
// //     // kinectSetInFields: (fieldNames, value) => dispatch(kinectSetInFieldsByName(ownProps.kinectName, fieldNames, value)), // pos = {x, y}

// //     kinectMove: (pos) => dispatch(kinectMoveByName({kinectName: ownProps.kinectName, pos})), // pos = {x, y}
// //     // kinectRemove: () => dispatch(kinectRemoveByName(ownProps.kinectName)), // pos = {x, y}
// //     kinectRotate: (rot) => dispatch(kinectRotateByName({kinectName: ownProps.kinectName, rot})) // rot = radian amount
// //     // kinectMoveByName: (kinectIndex, pos) => dispatch(kinectMoveByName(ownProps.kinectName, pos)), // pos = {x, y}
// //     // kinectRotateByName: (kinectIndex, rot) => dispatch(kinectRotateByName(ownProps.kinectName, rot)) // rot = radian amount
// // });

// // export default connect(
// //     mapStateToProps,
// //     mapDispatchToProps
// // )(Kinect)