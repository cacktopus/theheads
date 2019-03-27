import { connect } from 'react-redux'
import { menuDeselectStandAndAll } from '../actions'
import Scene from '../components/Scene'

const mapStateToProps = (state, ownProps) =>
  ({
    stands: state.stands,
    //   popups: state.popups //ownProps.filter === state.visibilityFilter
  });

// const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;

const mapDispatchToProps = (dispatch, ownProps) => ({
  menuDeselectStandAndAll: () => dispatch(menuDeselectStandAndAll())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scene)