import { connect } from 'react-redux'
import { popupAddNew, standRemoveByIndex, standMoveByIndex, standRotateByIndex, menuSelectStand } from '../actions'
import Stand from '../components/Stand'

const mapStateToProps = (state, ownProps) =>
({
  stands: state.stands, //ownProps.filter === state.visibilityFilter
  menu: state.menu
});

// const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;

const mapDispatchToProps = (dispatch, ownProps) => ({
    // standMove: (standIndex, pos) => dispatch(standMove(ownProps.filter)),
    standSelect: () => dispatch(menuSelectStand(ownProps.index)),

    // standSetField: (fieldName, value) => dispatch(standSetFieldByIndex(ownProps.index, fieldName, value)), // pos = {x, y}
    // standSetInFields: (fieldNames, value) => dispatch(standSetInFieldsByIndex(ownProps.index, fieldNames, value)), // pos = {x, y}

    standInfoPopup: (popupIndex, popupType) => { dispatch(popupAddNew(ownProps.standIndex, popupIndex, popupType)) }, //dispatch(standInfoPopup(ownProps.index, pos)), // pos = {x, y}

    standMove: (pos) => dispatch(standMoveByIndex(ownProps.index, pos)), // pos = {x, y}
    standRemove: () => dispatch(standRemoveByIndex(ownProps.index)), // pos = {x, y}
    standRotate: (rot) => dispatch(standRotateByIndex(ownProps.index, rot)) // rot = radian amount
    // standMoveByIndex: (standIndex, pos) => dispatch(standMoveByIndex(ownProps.index, pos)), // pos = {x, y}
    // standRotateByIndex: (standIndex, rot) => dispatch(standRotateByIndex(ownProps.index, rot)) // rot = radian amount
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Stand)