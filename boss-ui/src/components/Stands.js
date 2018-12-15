import React from 'react'
//import Heads from '../containers/Heads'
// import Draggable, {DraggableCore} from 'react-draggable'; 
import Stand from '../containers/Stand';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        // this.handleDrag = this.handleDrag.bind(this);
        // this.handleDragEnd = this.handleDragEnd.bind(this);
        // this.handleDragEnter = this.handleDragEnter.bind(this);
        // this.handleDragExit = this.handleDragExit.bind(this);
        // this.handleDragLeave = this.handleDragLeave.bind(this);
        // this.handleDragOver = this.handleDragOver.bind(this);
        // this.handleDragStart = this.handleDragStart.bind(this);
    }

    // handleDrag = {this.handleDrag}
    // handleDragEnd = {this.handleDragEnd}
    // handleDragEnter = {this.handleDragEnter}
    // handleDragExit = {this.handleDragExit}
    // handleDragLeave = {this.handleDragLeave}
    // handleDragOver = {this.handleDragOver}
    // handleDragStart = {this.handleDragStart}

    render() {
        window.c_ko = this;

        // <Draggable
        //     axis="x"
        //     handle=".handle"
        //     defaultPosition={{x: 0, y: 0}}
        //     position={null}
        //     grid={[25, 25]}
        //     onStart={this.handleStart}
        //     onDrag={this.handleDrag}
        //     onStop={this.handleStop}
        // >
        //     <div>
        //     <div className="handle">Drag from here</div>
        //     <div>This readme is really dragging on...</div>
        //     </div>
        // </Draggable>

        const stands = this.props.stands.map((stand, i) => {
            return <Stand key={i} index={i} stand={stand}/>


            // const standStyle = {transform:`translate(${stand.pos.x}px, ${stand.pos.y}px)`}
            // return (
            //     <div key={i} className="Stand" style={standStyle}>
            //         {stand.name}
            //         <div className="Stand-move noselect"
            //             // handleDrag = {this.handleDrag}
            //             // handleDragEnd = {this.handleDragEnd}
            //             // handleDragEnter = {this.handleDragEnter}
            //             // handleDragExit = {this.handleDragExit}
            //             // handleDragLeave = {this.handleDragLeave}
            //             // handleDragOver = {this.handleDragOver}
            //             // handleDragStart = {this.handleDragStart}
            //         >
            //             Move
            //         </div>
            //     </div>
            // );
        });

        const standsContainerStyle = {
            position: "relative"
        }

        return (
            <div>
                <div style={standsContainerStyle}>
                    {stands}
                </div>
            </div>
        )
    }
}