import React from 'react'
//import Heads from '../containers/Heads'
// import Draggable, {DraggableCore} from 'react-draggable'; 
import Stand from '../containers/Stand';
// import FocalPoint from '../containers/FocalPoint';
import FocalPoints from '../containers/FocalPoints';
// import Popups from '../components/Popups';
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

    componentDidMount() {
        var html = document.getElementsByTagName("html")[0];


        html.addEventListener("mousedown", (e) => {
            if(e.target.tagName.toUpperCase() === "HTML") {
                this.props.menuDeselectStandAndAll();
            }
        })

        html.addEventListener("touchstart", (e) => {
            if(e.target.tagName.toUpperCase() === "HTML") {
                this.props.menuDeselectStandAndAll();
            }
        })
    }

    render() {
        // window.c_ko = this;

        const stands = this.props.stands.map((stand, i) => {
            return <Stand key={i} index={i} stand={stand}/>
        });

        const standsContainerStyle = {
            position: "relative"
        }

        return (
            <div id="Scene" className="Scene">
                <div style={standsContainerStyle}>
                    <UnderVisuals/>
                    <div className="Stands">
                        {stands}
                    </div>
                    <FocalPoints/>
                    {/* <Popups popups={this.props.popups}/> */}
                </div>
            </div>
        )
    }
}