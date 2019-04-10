import { connect } from 'react-redux'
import { menuSetScale, menuSetTranslateX, menuSetTranslateY } from '../actions'
import GridLines from '../components/GridLines'

const mapStateToProps = (state, ownProps) =>
  ({
    menu: state.menu //ownProps.filter === state.visibilityFilter
  });

// const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;

const mapDispatchToProps = (dispatch, ownProps) => ({
  // standAdd: () => dispatch(standAdd(ownProps.filter)) 

  setScale: scale => dispatch(menuSetScale(scale)),
  setTranslateX: x => dispatch(menuSetTranslateX(x)),
  setTranslateY: y => dispatch(menuSetTranslateY(y))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridLines)