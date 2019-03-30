import { connect } from 'react-redux'
// import { focalPointRemoveByIndex, focalPointMoveByIndex, focalPointRotateByIndex, menuSelectFocalPoint } from '../actions'
import { focalPointMoveByIndex } from '../actions'
import FocalPoints from '../components/FocalPoints'

const mapStateToProps = (state, ownProps) =>
({
  focalPoints: state.focalPoints, //ownProps.filter === state.visibilityFilter
  menu: state.menu,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    // focalPointSelect: () => dispatch(menuSelectFocalPoint(ownProps.index)),
    // focalPointMove: (pos) => dispatch(focalPointMoveByIndex(ownProps.index, pos)), 
    // focalPointRemove: () => dispatch(focalPointRemoveByIndex(ownProps.index))
    focalPointMoveByIndex: (index, pos) => dispatch(focalPointMoveByIndex(index, pos)), 
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FocalPoints)