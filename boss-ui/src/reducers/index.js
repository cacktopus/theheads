import { combineReducers } from 'redux';
import menu from './menu';
import stands from './stands';
import motionLines from './motionLines';
import popups from './popups';

export default combineReducers({
    menu,
    stands,
    motionLines,
    popups
})