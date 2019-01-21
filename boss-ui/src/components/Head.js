import React from 'react';
//import Heads from '../containers/Heads'
// import Draggable from 'react-draggable'; 
import { DraggableCore } from 'react-draggable';
// import Draggable, {DraggableCore} from 'react-draggable'; 
// import Stand from '../containers/Stand';
import cn from "classnames";

import {encodeRot, decodeRot } from '../helpers';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };

        this.handleRotateStart = this.handleRotateStart.bind(this);
        this.handleRotateDrag = this.handleRotateDrag.bind(this);
        this.handleRotateStop = this.handleRotateStop.bind(this);
    }
    /*
        // Move
        handleMoveStart(e,a) {
            // console.log("h str", e, a);
            // this.props.standMove(1,a.)
        }
    
        handleMoveDrag(e,a) {
            // console.log("h dr", e, a);
            const {x,y} = a;
            const pos = {x,y};
            this.props.standMove(pos);
            // this.setState({ pos });
        }
    
        handleMoveStop(e,a) {
            // console.log("h stop", e, a);
        }
    */

    // Rotate
    handleRotateStart(e, a) {
        console.log("hrot str", e, a);
        this.props.headRotateStart();
    }

    handleRotateDrag(e, a) {
        const { x, y } = a;
        var rad = Math.atan2(y, x); // In radians
        // Then you can convert it to degrees as easy as:
        var deg = rad * (180 / Math.PI);

        const standRot = decodeRot(this.props.stand.get("rot"));
        // const standRot = this.props.stand.get("rot");

        this.props.headRotate(encodeRot(deg - standRot));
        // this.props.headRotate(deg - standRot);
    }

    handleRotateStop(e, a) {
        console.log("hrot stoppp", e, a);
        this.props.headRotateStop();
        // console.log("hrlt stop", e, a);
    }

    render() {
        window.c_STN = this;
        const head = this.props.head;

        // let pos = stand.get("pos").toJS();
        // pos.x = isNaN(pos.x) ? 0 : pos.x;
        // pos.y = isNaN(pos.y) ? 0 : pos.y;

        let rot = head.get("rot");
        rot = isNaN(rot) ? 0 : rot;
        rot = decodeRot(rot);

        const selectedStandIndex = this.props.menu.get("selectedStandIndex");
        const selectedHeadIndex = this.props.menu.get("selectedHeadIndex");

        const isSelected = selectedStandIndex === this.props.standIndex && selectedHeadIndex === this.props.headIndex;

        // const standStyle = {transform:`translate(${stand.pos.x}px, ${stand.pos.y}px)`}
        // console.log('ren');

        // try {
        //     pos = stand.get("pos");
        // } catch(e) {}

        const areRotatesHidden = this.props.menu.get("areRotatesHidden");

        return (
            <div className={cn("Head", { "Head--selected": isSelected })}>
                <div className="Head-rotateContainer" style={{ transform: `rotate(${rot}deg)` }}>
                    <div className="Head-container">
                        <img alt="head" className="Head-img" src="./media/head-arrow.png" draggable="false" />

                        {areRotatesHidden ? null :
                            <div className="Head-rotate noselect">
                                {/* offset is used for the drag's reference */}
                                <DraggableCore
                                    // allowAnyClick= boolean,
                                    // cancel= string,
                                    // disabled= boolean,
                                    // enableUserSelectHack= boolean,
                                    // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
                                    // grid= [number, number],
                                    handle=".Head-rotate-handle"
                                    onStart={this.handleRotateStart}
                                    onDrag={this.handleRotateDrag}
                                    onStop={this.handleRotateStop}
                                // onMouseDown= (e= MouseEvent) => void
                                >
                                    <div className="Head-rotate-handle"></div>
                                </DraggableCore>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}