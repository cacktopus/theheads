import React from "react";
//import Heads from '../containers/Heads'
// import Draggable from 'react-draggable';
// import Draggable, { DraggableCore } from "react-draggable";
// // import Anchor from '../containers/Anchor';
import cn from "classnames";
// import Heads from "./Heads";
// import Cameras from "./Cameras";
// import Kinects from "./Kinects";
// import PopupInfo from "../containers/PopupInfo";

import {
    ANCHOR_WIDTH,
    // encodeRot,
    // decodeRot,
    // encodePos,
    decodePos
    // noTouchMove
} from "../helpers";

export default class Anchor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };

        // // this.onMouseDown = this.onMouseDown.bind(this);

        // this.togglePopupInfo = this.togglePopupInfo.bind(this);

        // this.handleMoveStart = this.handleMoveStart.bind(this);
        // this.handleMoveDrag = this.handleMoveDrag.bind(this);
        // this.handleMoveStop = this.handleMoveStop.bind(this);

        // this.handleRotateStart = this.handleRotateStart.bind(this);
        // this.handleRotateDrag = this.handleRotateDrag.bind(this);
        // this.handleRotateStop = this.handleRotateStop.bind(this);

        // this.anchorClick = this.anchorClick.bind(this);

        // // this.handleMoveDragEnd = this.handleMoveDragEnd.bind(this);
        // // this.handleMoveDragEnter = this.handleMoveDragEnter.bind(this);
        // // this.handleMoveDragExit = this.handleMoveDragExit.bind(this);
        // // this.handleMoveDragLeave = this.handleMoveDragLeave.bind(this);
        // // this.handleMoveDragOver = this.handleMoveDragOver.bind(this);
        // // this.handleMoveDragStart = this.handleMoveDragStart.bind(this);

        // // Refs
        // this.refAnchorRotateHandle = React.createRef();
        // this.refAnchorMoveHandle = React.createRef();
    }

    // componentDidMount() {
    //     noTouchMove(this.refAnchorRotateHandle.current);
    //     noTouchMove(this.refAnchorMoveHandle.current);
    // }

    // togglePopupInfo(e) {
    //     if (!this.props.popupInfo) {
    //         // The x and y of the Scene
    //         var {x, y} = document.getElementById("Scene").getBoundingClientRect();

    //         const clickPos = { x: e.nativeEvent.clientX - x, y: e.nativeEvent.clientY - y };

    //         this.props.popupInfoRemoveAll();
    //         this.props.popupInfoAddNew(clickPos);
    //     }
    //     //  else {
    //     //     this.props.popupInfoRemove();
    //     // }
    // }

    // Move
    handleAnchorClick(e, a) {
        console.log("clicked anchor");
        // this.props.anchorSelect();
        // this.togglePopupInfo(e);
        // // console.log("h str", e, a);
        // // this.props.anchorMove(1,a.)
    }

    render() {
        const anchor = this.props.anchor;
        const anchorName = anchor.get("name");
        const isActive = anchor.get("isActive");
        const isSelected = anchor.get("isSelected");

        // const AnchorIndex = this.props.menu.get("AnchorIndex");
        // const isSelected = AnchorIndex === this.props.index;

        // let pos = {x: 0, y:0};
        let pos = decodePos(this.props.menu, anchor.get("pos").toJS());

        // let pos = decrypt1(anchor.get("pos").toJS());
        // let pos = anchor.get("pos").toJS();
        pos.x = isNaN(pos.x) || pos.x === "" ? 0 : pos.x;
        pos.y = isNaN(pos.y) || pos.y === "" ? 0 : pos.y;

        const anchorContainerScale =
            (ANCHOR_WIDTH * this.props.menu.get("scale")) / 100;
        const styleAnchorContainer = {
            transform: `scale(${anchorContainerScale})`
        };

        console.log('test', pos);
        window.c_anc = { t8: this, pos };

        const anchorStyle = {
            position: "absoulte",
            top: 0,
            left: 0,
            transform: `translate(${pos.x}px, ${pos.y}px)`
        };

        return (
            <div
                ref={this.refAnchor}
                id={`Anchor-${anchorName}`}
                className={cn("Anchor", {
                    "Anchor--selected": isSelected,
                    "Anchor--active": isActive
                })}
                onClick={this.handleAnchorClick}
                style={anchorStyle}
            >
                <div style={styleAnchorContainer} className="Anchor-container">
                    ANC
                    {/* <div className="Anchor-octagon"></div> */}
                    {/* <div className="Anchor-name noselect">
                            {anchor.get("name")} : {anchor.getIn(["heads",0,"name"])}
                        </div> */}
                </div>
            </div>
        );
    }
    // render() {
    //     const anchor = this.props.anchor;
    //     const isActive = anchor.get("isActive");
    //     // let pos = {x: 0, y:0};
    //     let pos = decodePos(this.props.menu, anchor.get("pos").toJS());

    //     // let pos = decrypt1(anchor.get("pos").toJS());
    //     // let pos = anchor.get("pos").toJS();
    //     pos.x = isNaN(pos.x) || pos.x === "" ? 0 : pos.x;
    //     pos.y = isNaN(pos.y) || pos.y === "" ? 0 : pos.y;

    //     let rot = anchor.get("rot");
    //     rot = isNaN(rot) ? 0 : rot;
    //     rot = decodeRot(rot); // flip it so rotation is opposite direction.

    //     const AnchorIndex = this.props.menu.get("AnchorIndex");
    //     const isSelected = AnchorIndex === this.props.index;

    //     const heads = anchor.get("heads");
    //     const cameras = anchor.get("cameras");
    //     const kinects = anchor.get("kinects");

    //     // const anchorStyle = {transform:`translate(${anchor.pos.x}px, ${anchor.pos.y}px)`}
    //     // console.log('ren');

    //     // try {
    //     //     pos = anchor.get("pos");
    //     // } catch(e) {}

    //     let popupInfo;

    //     if (this.props.popupInfo) {
    //         popupInfo = (
    //             <div className="Anchor-popupInfo">
    //                 <PopupInfo anchorIndex={this.props.index} pos={this.props.popupInfo.get("pos")}/>
    //             </div>
    //         );
    //     }

    //     const AnchorRotatesHidden = this.props.menu.get("AnchorRotatesHidden");
    //     const AnchorRotatesOnSelect = this.props.menu.get("AnchorRotatesOnSelect");
    //     const AnchorRotator = !AnchorRotatesHidden || (isSelected && AnchorRotatesOnSelect);

    //     const anchorName = anchor.get("name");

    //     // Given the anchor is 100px
    //     // and the actual anchor is 0.381 m (15')
    //     // When the scene scale is 100
    //     // set the transform:scale(X); to X = 0.381
    //     // When the scene scale is 200 (100 * 2)
    //     // set the transform:scale(X); to X = 0.381 * 2 = 0.762
    //     const anchorContainerScale = ANCHOR_WIDTH * this.props.menu.get("scale") / 100
    //     const AnchorContainer = {
    //         transform: `scale(${anchorContainerScale})`
    //     }
    //     return (
    //         <Draggable
    //             handle=".Anchor-move"
    //             defaultPosition={{ x: 0, y: 0 }}
    //             // position={null}
    //             position={pos}
    //             // grid={[25, 25]}
    //             onStart={this.handleMoveStart}
    //             onDrag={this.handleMoveDrag}
    //             onStop={this.handleMoveStop}
    //         >
    //             {/* <DraggableCore
    //                 // allowAnyClick= boolean,
    //                 // cancel= string,
    //                 // disabled= boolean,
    //                 // enableUserSelectHack= boolean,
    //                 // offsetParent= HTMLElement,
    //                 // grid= [number, number],
    //                 handle=".Anchor-rotate"
    //                 // onStart={this.handleRotateStart}
    //                 // onDrag={this.handleRotateDrag}
    //                 // onStop={this.handleRotateStop}
    //                 // onMouseDown= (e= MouseEvent) => void
    //             > */}

    //             <div ref={this.refAnchor} id={`Anchor-${anchorName}`} className={cn("Anchor", { "Anchor--selected": isSelected, "Anchor--active" : isActive })} onClick={this.anchorClick}>
    //                 {popupInfo}
    //                 <div className="Anchor-rotateContainer" style={{ transform: `rotate(${rot}deg)` }}>
    //                     <div style={AnchorContainer} className="Anchor-container">
    //                         <div className="Anchor-octagon"></div>
    //                         <div className="Anchor-name noselect">
    //                             {anchor.get("name")} : {anchor.getIn(["heads",0,"name"])}
    //                         </div>
    //                         {/* <div className="Anchor-select noselect" onClick={this.props.Anchor}>
    //                                 Select
    //                             </div> */}
    //                         {/* <div className="Anchor-remove noselect" onClick={this.props.anchorRemove}>
    //                             X
    //                             </div> */}
    //                         <div ref={this.refAnchorMoveHandle} className="Anchor-move noselect">
    //                             Move
    //                         </div>
    //                         {/* <div className="Anchor-info noselect" onClick={this.togglePopupInfo}>
    //                             Info
    //                         </div> */}

    //                         { !AnchorRotator ? null :
    //                             <div className="Anchor-rotate noselect">
    //                                 {/* offset is used for the drag's reference */}
    //                                 <DraggableCore
    //                                     // allowAnyClick= boolean,
    //                                     // cancel= string,
    //                                     // disabled= boolean,
    //                                     // enableUserSelectHack= boolean,
    //                                     // offsetParent={this.refAnchorRotateOffset.current} //HTMLElement,
    //                                     // grid= [number, number],
    //                                     handle=".Anchor-rotate-handle"
    //                                     onStart={this.handleRotateStart}
    //                                     onDrag={this.handleRotateDrag}
    //                                     onStop={this.handleRotateStop}
    //                                 // onMouseDown= (e= MouseEvent) => void
    //                                 >
    //                                     <div ref={this.refAnchorRotateHandle} className="Anchor-rotate-handle"/>
    //                                 </DraggableCore>
    //                             </div>
    //                         }

    //                         <div className="Anchor-heads">
    //                             <Heads heads={heads} anchorIndex={this.props.index} />
    //                         </div>
    //                         <div className="Anchor-cameras">
    //                             <Cameras cameras={cameras} anchorIndex={this.props.index} />
    //                         </div>
    //                         <div className="Anchor-kinects">
    //                             <Kinects kinects={kinects} anchorIndex={this.props.index} />
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </Draggable>
    //     );
    // }
}
