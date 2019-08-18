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
import AnchorDistance from "../containers/AnchorDistance";

// import {
//     // ANCHOR_WIDTH,
//     // encodeRot,
//     // decodeRot,
//     // encodePos,
//     decodePos
//     // noTouchMove
// } from "../helpers";

export default class Anchor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };
    }

    // // Move
    // handleAnchorClick(e, a) {
    //     console.log("clicked anchor");
    //     // this.props.anchorSelect();
    //     // this.togglePopupInfo(e);
    //     // // console.log("h str", e, a);
    //     // // this.props.anchorMove(1,a.)
    // }

    render() {
        window.c_ads = this;

        // Check if a stand is selected
        const selectedStandIndex = this.props.menu.get("selectedStandIndex");
        let standData = {};
        if (this.props.stands && this.props.stands.get) {
            const selectedStand = this.props.stands.get(selectedStandIndex);
            if (selectedStand && selectedStand.toJS) {
                standData = selectedStand.toJS();
            }
        }

        if (this.props.menu.get("isShowDistances") && selectedStandIndex >= 0) {
            const anchorDistances = this.props.anchors.toJS().map( (anchor, i) => {
                return <AnchorDistance key={`AnchorDistance-${i}`} anchorData={anchor} standData={standData}/>
            });
            return <div className="AnchorDistances">{anchorDistances}</div>;
        } else {
            return (
                <div className="AnchorDistances AnchorDistances--noSelectedIndex" />
            );
        }
    }
}
