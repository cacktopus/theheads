import { connect } from 'react-redux'
// import { anchorsRemoveByIndex, anchorsMoveByIndex, anchorsRotateByIndex, menuSelectAnchor } from '../actions'
// import { anchorsMoveByIndex } from '../actions'
import Anchors from '../components/Anchors'

const mapStateToProps = (state, ownProps) =>
({
  anchors: state.anchors, //ownProps.filter === state.visibilityFilter
  menu: state.menu,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    // anchorsSelect: () => dispatch(menuSelectAnchor(ownProps.index)),
    // anchorsMove: (pos) => dispatch(anchorsMoveByIndex(ownProps.index, pos)), 
    // anchorsRemove: () => dispatch(anchorsRemoveByIndex(ownProps.index))
    // anchorsMoveByIndex: (index, pos) => dispatch(anchorsMoveByIndex(index, pos)), 
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Anchors)