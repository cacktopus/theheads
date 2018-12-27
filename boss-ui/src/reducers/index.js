import { combineReducers } from 'redux';
import menu from './menu';
import stands from './stands';
import motionLines from './motionLines';

export default combineReducers({
    menu,
    stands,
    motionLines
})