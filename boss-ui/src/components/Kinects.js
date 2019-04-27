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
        const kinects = this.props.kinects || [];

        if (typeof window !== 'undefined') {
            console.log('c__kinects');
            window.c__kinects2 = kinects;
        }

        return (
            <div className="Kinects">
                {kinects.map((kinect, i) => kinect ? <Kinect key={i} kinect={kinect} kinectIndex={i} standIndex={this.props.standIndex}/> : null)}
            </div>
        );
    }
}