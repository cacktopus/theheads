import { connect } from 'react-redux'
// import { standsActions } from '../actions'
import Stands from '../components/Stands'


const mapStateToProps = (state, ownProps) =>
({
  stands: state.stands //ownProps.filter === state.visibilityFilter
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
)(Stands)