import { connect } from 'react-redux'
// import { standsActions } from '../actions'
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GridLines)