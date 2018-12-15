import { connect } from 'react-redux'
import { headRotateByIndex} from '../actions'
// import { menuSelectHead, headRotateByIndex} from '../actions'
import Head from '../components/Head'

console.log(" THIS IS WHAT's in prog.. adding in the head");

const mapStateToProps = (state, ownProps) => {
    // const stands = state.stands;
    // const menu = state.menu;
    // let stand = {}; // The stand for the head
    // let heads;

    // if (stands && stands.get && stands.get(ownProps.standIndex)) {
    //     stand = stands.get(ownProps.standIndex);

    //     if (stand.get && stand.get("heads")) {
    //         heads = stand.get("heads");
    //     }
    // }


    return ({
        stands: state.stands, //ownProps.filter === state.visibilityFilter
        stand: state.stands.get(ownProps.standIndex),
        // heads: state.stands .get(ownProps.index),
        menu: state.menu
    });
}

// const mapStateToProps = (state, ownProps) => ({});
// // ({
// // //   active: ownProps.filter === state.visibilityFilter
// // })​;

const mapDispatchToProps = (dispatch, ownProps) => ({
    // standMove: (standIndex, pos) => dispatch(standMove(ownProps.filter)),
    // standHead: () => dispatch(menuSelectHead(ownProps.index)),
    // headSelect: () => dispatch(menuSelectHead(ownProps.standIndex, ownProps.index)),

    // standSetField: (fieldName, value) => dispatch(standSetFieldByIndex(ownProps.index, fieldName, value)), // pos = {x, y}
    // standSetInFields: (fieldNames, value) => dispatch(standSetInFieldsByIndex(ownProps.index, fieldNames, value)), // pos = {x, y}

    // standMove: (pos) => dispatch(standMoveByIndex(ownProps.index, pos)), // pos = {x, y}
    // standRemove: () => dispatch(standRemoveByIndex(ownProps.index)), // pos = {x, y}
    // headRotate: (rot) => dispatch(headRotateByIndex(ownProps.standIndex, ownProps.index, rot)) // rot = radian amount
    headRotate: (rot) => dispatch(headRotateByIndex(ownProps.standIndex, ownProps.headIndex, rot)) // rot = radian amount
    // standMoveByIndex: (standIndex, pos) => dispatch(standMoveByIndex(ownProps.index, pos)), // pos = {x, y}
    // standRotateByIndex: (standIndex, rot) => dispatch(standRotateByIndex(ownProps.index, rot)) // rot = radian amount
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Head)