import React from 'react'
import Popup from '../containers/Popup'

export default class Popups extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // moveRelativeStartPos: { x: 0, y: 0 },
            // pos : {x:0, y:0},
            // rotateRad : 0
        };

        // this.handleMoveStart = this.handleMoveStart.bind(this);
        // this.handleMoveDrag = this.handleMoveDrag.bind(this);
        // this.handleMoveStop = this.handleMoveStop.bind(this);

        // this.handleRotateStart = this.handleRotateStart.bind(this);
        // this.handleRotateDrag = this.handleRotateDrag.bind(this);
        // this.handleRotateStop = this.handleRotateStop.bind(this);
    }


    render() {

        // const popups = this.props.popups.map((popup, i) => {
        //     return <div key={i}>opop</div>; ///<Popup key={i} index={i} popup={popup}/>
        // });
        
        window.c_pops = this.props.popups;
        const popups = undefined; //"hi";

        window.c_POPS = this;
        return (
            <div className="Popups">
                {popups}
            </div>
        );
    }
}