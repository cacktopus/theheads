import { connect } from 'react-redux'
import { websocketSend, focalPointRemoveByIndex, focalPointMoveByIndex, menuSelectFocalPoint } from '../actions'
// import { websocketSend, focalPointRemoveByIndex, focalPointMoveByIndex, focalPointRotateByIndex, menuSelectFocalPoint } from '../actions'
import FocalPoint from '../components/FocalPoint'

const mapStateToProps = (state, ownProps) =>
  ({
    focalPoints: state.focalPoints, //ownProps.filter === state.visibilityFilter
    menu: state.menu,
  });

const mapDispatchToProps = (dispatch, ownProps) => ({
  focalPointSelect: () => dispatch(menuSelectFocalPoint(ownProps.index)),
  // focalPointMove: (pos) => dispatch(focalPointMoveByIndex(ownProps.index, pos)),
  focalPointMove: (pos) => {
    // dispatch(headRotateByIndex(ownProps.standIndex, ownProps.headIndex, rot));
    // const websocketPayload = {
    //   "type": "fp-location",
    //   "data": {
    //     "fpName": ownProps.get("name"),
    //     "location": rot
    //   }
    // }
    // dispatch(focalPointMoveByIndex(ownProps.index, pos));

    // dispatch(headRotateByIndex(ownProps.standIndex, ownProps.headIndex, rot));
    dispatch(focalPointMoveByIndex(ownProps.index, pos));

    const websocketPayload = {
      "type": "focal-point-location",
      "data": {
        "focalPointName": ownProps.name,
        "location": pos
      }
    }
    dispatch(websocketSend(websocketPayload));
  },
  focalPointRemove: () => dispatch(focalPointRemoveByIndex(ownProps.index))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FocalPoint)