import { connect } from 'react-redux'
// import { standsActions } from '../actions'
import MotionLines from '../components/MotionLines'

const mapStateToProps = (state, ownProps) =>
({
  motionLines: state.motionLines //ownProps.filter === state.visibilityFilter
});

// const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;

const mapDispatchToProps = (dispatch, ownProps) => ({
    // standAdd: () => dispatch(standAdd(ownProps.filter))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MotionLines)