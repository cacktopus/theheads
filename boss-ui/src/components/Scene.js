import React from 'react'
//import Heads from '../containers/Heads'
// import Draggable, {DraggableCore} from 'react-draggable'; 
import Stand from '../containers/Stand';
import Anchor from '../containers/Anchor';
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
            if (e.target.tagName.toUpperCase() === "HTML") {
                this.props.menuDeselectStandAndAll();
            }
        })

        html.addEventListener("touchstart", (e) => {
            if (e.target.tagName.toUpperCase() === "HTML") {
                this.props.menuDeselectStandAndAll();
            }
        })
    }

    render() {
        window.c_ko = this;

        const stands = this.props.stands.map((stand, i) => {
            return <Stand key={i} index={i} stand={stand} />
        });

        const standsContainerStyle = {
            position: "relative"
        }

        const anchors = this.props.anchors.map((anchor, i) => {
            return <Anchor key={i} index={i} anchor={anchor} />
        });

        // let kinects = [];
        // try {
        //     var tempKinectsImmObj = this.props.kinects.get("kinects");
        //     // var tempKinectsJSObj = tempKinectsImmObj.toJS();
            
        //     // for (var kinectName in tempKinectsJSObj) {
        //     // tempKinectsImmObj.keyName
        //     tempKinectsImmObj.keySeq().forEach((kinectName,i) => {
        //         kinects.push(<Kinect key={kinectName} kinectName={kinectName} kinect={tempKinectsImmObj.get(kinectName)}/>) 
        //     });
        //     // kinects = this.props.kinects.get("kinects");
        //     // kinects.map((kinect, i) => <Kinect key={i} index={i} kinect={kinect}/>);
        // } catch(e) {}

        
        // const scale = this.props.menu.get("scale");
        // const translateX = this.props.menu.getIn(["translate", "x"]);
        // const translateY = this.props.menu.getIn(["translate", "y"]);
        
        // const styleKinects = {
        //     transform: `translate(${translateX}px, ${translateY}px) scale(${scale/100})`
        //     // transform: `translate(${translateX*scale/100}px, ${translateY*scale/100}px) scale(${scale/100})`
        // }

        // window.c_sds = { 
        //     scale,
        //     translateX,
        //     translateY,
        //     styleKinects
        // }

        return (
            <div id="Scene" className="Scene">
                <div style={standsContainerStyle}>
                    <UnderVisuals />
                    <div className="Stands">
                        {stands}
                    </div>
                    <div className="Anchors">
                        {anchors}
                    </div>
                    <FocalPoints />
                    {/* <Popups popups={this.props.popups}/> */}
                </div>
            </div>
        )
    }
}