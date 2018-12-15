import React from 'react';
//import Heads from '../containers/Heads'
// import Draggable from 'react-draggable'; 
import Draggable, {DraggableCore} from 'react-draggable'; 
// import Stand from '../containers/Stand';
import cn from "classnames";
import Heads from './Heads';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };

        // this.onMouseDown = this.onMouseDown.bind(this);

        this.handleMoveStart = this.handleMoveStart.bind(this);
        this.handleMoveDrag = this.handleMoveDrag.bind(this);
        this.handleMoveStop = this.handleMoveStop.bind(this);

        this.handleRotateStart = this.handleRotateStart.bind(this);
        this.handleRotateDrag = this.handleRotateDrag.bind(this);
        this.handleRotateStop = this.handleRotateStop.bind(this);

        // this.handleMoveDragEnd = this.handleMoveDragEnd.bind(this);
        // this.handleMoveDragEnter = this.handleMoveDragEnter.bind(this);
        // this.handleMoveDragExit = this.handleMoveDragExit.bind(this);
        // this.handleMoveDragLeave = this.handleMoveDragLeave.bind(this);
        // this.handleMoveDragOver = this.handleMoveDragOver.bind(this);
        // this.handleMoveDragStart = this.handleMoveDragStart.bind(this);
    }

    // handleMoveDrag = {this.handleMoveDrag}
    // handleMoveDragEnd = {this.handleMoveDragEnd}
    // handleMoveDragEnter = {this.handleMoveDragEnter}
    // handleMoveDragExit = {this.handleMoveDragExit}
    // handleMoveDragLeave = {this.handleMoveDragLeave}
    // handleMoveDragOver = {this.handleMoveDragOver}
    // handleMoveDragStart = {this.handleMoveDragStart}

    // // If this is clicked in general
    // onMouseDown() {
    //     var highestStand = document.getElementsByClassName("Stand");
    //     [...Stands].forEach(Stand => {
    //         Stand.classList.remove("Stand-highest");
    //     });
    // }

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

    // Rotate
    handleRotateStart(e,a) {
        // console.log("hrot str", e, a);
    }

    handleRotateDrag(e,a) {
        window.c_kk = {e,a};
        const {x,y} = a;
        var rad = Math.atan2(y, x); // In radians
        // Then you can convert it to degrees as easy as:
        // var deg = rad * (180 / Math.PI);

        this.props.standRotate(rad);

        // // console.log(deg);
        // // console.log("hrpt dr", e, a, rad);
        // this.setState({
        //     rotateRad: rad
        // });
    }

    handleRotateStop(e,a) {
        // console.log("hrlt stop", e, a);
    }

    render() {
        window.c_STN = this;
        const stand = this.props.stand;
        // let pos = {x: 0, y:0};
        let pos = stand.get("pos").toJS();
        pos.x = isNaN(pos.x) || pos.x === "" ? 0 : pos.x;
        pos.y = isNaN(pos.y) || pos.y === "" ? 0 : pos.y;
        
        let rot = stand.get("rot");
        rot = isNaN(rot) ? 0 : rot;

        const selectedStandIndex = this.props.menu.get("selectedStandIndex");

        const heads = stand.get("heads");
        // const cameras = stand.get("cameras");

        // const standStyle = {transform:`translate(${stand.pos.x}px, ${stand.pos.y}px)`}
        // console.log('ren');
        
        // try {
        //     pos = stand.get("pos");
        // } catch(e) {}

        return (
            <Draggable
                handle=".Stand-move"
                defaultPosition={{x: 0, y: 0}}
                // position={null}
                position={pos}
                // grid={[25, 25]}
                onStart={this.handleMoveStart}
                onDrag={this.handleMoveDrag}
                onStop={this.handleMoveStop}
            >
                {/* <DraggableCore
                    // allowAnyClick= boolean,
                    // cancel= string,
                    // disabled= boolean,
                    // enableUserSelectHack= boolean,
                    // offsetParent= HTMLElement,
                    // grid= [number, number],
                    handle=".Stand-rotate"
                    // onStart={this.handleRotateStart}
                    // onDrag={this.handleRotateDrag}
                    // onStop={this.handleRotateStop}
                    // onMouseDown= (e= MouseEvent) => void
                > */}
                
                    <div className={cn("Stand", {"Stand--selected" : selectedStandIndex === this.props.index})} onClick={this.props.standSelect}>
                        <div className="Stand-rotateContainer" style={{transform: `rotate(${rot}rad)`}}>
                            <div className="Stand-container">
                                <div className="Stand-name noselect">
                                    {stand.get("name")}
                                </div>
                                {/* <div className="Stand-select noselect" onClick={this.props.standStand}>
                                    Select
                                </div> */}
                                <div className="Stand-remove noselect" onClick={this.props.standRemove}>
                                    X
                                </div>
                                <div className="Stand-move noselect">
                                    Move
                                </div>
                                
                                <div className="Stand-rotate noselect">
                                    {/* offset is used for the drag's reference */}
                                    <DraggableCore
                                        // allowAnyClick= boolean,
                                        // cancel= string,
                                        // disabled= boolean,
                                        // enableUserSelectHack= boolean,
                                        // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
                                        // grid= [number, number],
                                        handle=".Stand-rotate-handle"
                                        onStart={this.handleRotateStart}
                                        onDrag={this.handleRotateDrag}
                                        onStop={this.handleRotateStop}
                                        // onMouseDown= (e= MouseEvent) => void
                                    >
                                        <div className="Stand-rotate-handle"></div>
                                    </DraggableCore>
                                </div>
                                <div className="Stand-heads">
                                    <Heads heads={heads} standIndex={this.props.index}/>
                                </div>
                            </div>
                        </div>
                    </div>
            </Draggable>
        );
    }
}