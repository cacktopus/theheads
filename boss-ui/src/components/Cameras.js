import React from 'react';
import Camera from '../containers/Camera'

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };
    }

    render() {
        window.c_HEADS = this;
        const cameras = this.props.cameras;

        return (
            <div className="Cameras">
                {cameras.map((camera, i) => <Camera key={i} camera={camera} cameraIndex={i} standIndex={this.props.standIndex}/>)}
            </div>
        );
    }
}