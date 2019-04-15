import { combineReducers } from 'redux';
import menu from './menu';
import stands from './stands';
import focalPoints from './focalPoints';
import motionLines from './motionLines';
import kinect from './kinect';

export default combineReducers({
    menu,
    stands,
    focalPoints,
    motionLines,
    kinect
})