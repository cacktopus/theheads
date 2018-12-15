import { connect } from 'react-redux'
import { standAdd, menuSelectStand, menuSelectCamera, menuSelectHead, standSetFieldByIndex, standSetInFieldsByIndex } from '../actions'
import Menu from '../components/Menu'

const mapStateToProps = (state, ownProps) =>
({
  stands: state.stands,
  menu: state.menu,
  selectedStandIndex: state.menu && state.menu.get ? state.menu.get("selectedStandIndex") : 0
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    addStand: () => dispatch(standAdd()),
    selectStand: index => dispatch(menuSelectStand(index)),
    selectCamera: index => dispatch(menuSelectCamera(index)),
    selectHead: index => dispatch(menuSelectHead(index)),
    standSetField: (index, fieldName, value) => dispatch(standSetFieldByIndex(index, fieldName, value)), // pos = {x, y}
    standSetInFields: (index, fieldNames, value) => dispatch(standSetInFieldsByIndex(index, fieldNames, value)), // pos = {x, y}

})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu)