
import React from 'react'
import MotionLines from '../containers/MotionLines'

export default class UnderVisuals extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        // this.handleMoveStart = this.handleMoveStart.bind(this);
    }

    render() {
        return (
            <div>
                <MotionLines/>
            </div>
        );
    }
}