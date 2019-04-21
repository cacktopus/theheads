import { combineReducers } from 'redux';
import menu from './menu';
import stands from './stands';
import focalPoints from './focalPoints';
import motionLines from './motionLines';
import kinectFocalPoints from './kinectFocalPoints';

export default combineReducers({
    menu,
    stands,
    focalPoints,
    motionLines,
    kinectFocalPoints
})