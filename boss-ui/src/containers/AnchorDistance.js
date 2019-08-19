import { connect } from 'react-redux'
// import { popupInfoAddNew, popupInfoRemove, popupInfoRemoveAll, anchorRemoveByIndex, anchorMoveByIndex, anchorRotateByIndex, menuSelectAnchor } from '../actions'
// import { popupInfoAddNew, popupInfoRemove, popupInfoRemoveAll, anchorRemoveByIndex, anchorMoveByIndex, anchorRotateByIndex, menuSelectAnchor } from '../actions'
import AnchorDistance from '../components/AnchorDistance'

const mapStateToProps = (state, ownProps) =>
({
  anchors: state.anchors, //ownProps.filter === state.visibilityFilter
  menu: state.menu,
  stands: state.stands
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    // anchorSelect: () => dispatch(menuSelectAnchor(ownProps.index)),

    // anchorMove: (pos) => dispatch(anchorMoveByIndex(ownProps.index, pos)), // pos = {x, y}
    // anchorRemove: () => dispatch(anchorRemoveByIndex(ownProps.index)), // pos = {x, y}
    // anchorRotate: (rot) => dispatch(anchorRotateByIndex(ownProps.index, rot)) // rot = radian amount
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnchorDistance)