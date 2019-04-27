import React from 'react';
import Kinect from '../containers/Kinect'

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };
    }

    render() {
        const kinects = this.props.kinects;
        console.log('render <Kinects');

        if (!kinects || kinects.size === 0) {
            if (typeof window !== 'undefined') {
                console.log('c__kinectno');
                window.c__kinectno = kinects;
            }
            console.log('Kinects no kinects');
            return <div className="Kinects Kinects--none"></div>
        } else {
            if (typeof window !== 'undefined') {
                console.log('c__kinectyes');
                window.c__kinectyes = kinects;
            }
            console.log('Kinects doing it');
            return <div className="Kinects">
                {kinects.map((kinect, i) => kinect ? <Kinect key={i} kinect={kinect} kinectIndex={i} standIndex={this.props.standIndex}/> : null)}
            </div>
        }
    }
}