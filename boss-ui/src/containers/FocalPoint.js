import { connect } from 'react-redux'
import { focalPointRemoveByIndex, focalPointMoveByIndex, focalPointRotateByIndex, menuSelectFocalPoint } from '../actions'
import FocalPoint from '../components/FocalPoint'

const mapStateToProps = (state, ownProps) =>
({
  focalPoints: state.focalPoints, //ownProps.filter === state.visibilityFilter
  menu: state.menu,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    focalPointSelect: () => dispatch(menuSelectFocalPoint(ownProps.index)),
    focalPointMove: (pos) => dispatch(focalPointMoveByIndex(ownProps.index, pos)), 
    focalPointRemove: () => dispatch(focalPointRemoveByIndex(ownProps.index))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FocalPoint)