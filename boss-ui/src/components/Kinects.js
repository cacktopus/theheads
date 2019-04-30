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

        if (!kinects || kinects.size === 0) {
            if (typeof window !== 'undefined') {
                window.c__kinectno = kinects;
            }
            return <div className="Kinects Kinects--none"></div>
        } else {
            if (typeof window !== 'undefined') {
                window.c__kinectyes = kinects;
            }
            return <div className="Kinects">
                {kinects.map((kinect, i) => kinect ? <Kinect key={i} kinect={kinect} kinectIndex={i} standIndex={this.props.standIndex}/> : null)}
            </div>
        }
    }
}