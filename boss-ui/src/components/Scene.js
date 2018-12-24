import React from 'react'
//import Heads from '../containers/Heads'
// import Draggable, {DraggableCore} from 'react-draggable'; 
import Stand from '../containers/Stand';
import UnderVisuals from '../containers/UnderVisuals';

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

        const underVisuals = <UnderVisuals/>

        const stands = this.props.stands.map((stand, i) => {
            return <Stand key={i} index={i} stand={stand}/>
        });

        const standsContainerStyle = {
            position: "relative"
        }

        return (
            <div>
                <div style={standsContainerStyle}>
                    {underVisuals}
                    {stands}
                </div>
            </div>
        )
    }
}