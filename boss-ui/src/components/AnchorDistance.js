import React from "react";
//import Heads from '../containers/Heads'
// import Draggable from 'react-draggable';
// import Draggable, { DraggableCore } from "react-draggable";
// // import Anchor from '../containers/Anchor';
import cn from "classnames";
// import Heads from "./Heads";
// import Cameras from "./Cameras";
// import Kinects from "./Kinects";
// import PopDecodedupInfo from "../containers/PopDecodedupInfo";

import {
    // ANCHOR_WIDTH,
    // encodeRot,
    // decodeRot,
    encodePos,
    decodePos
    // noTouchMove
} from "../helpers";

const roundNum = (num, decimalPlaces) => {
    decimalPlaces = parseInt(decimalPlaces);
    if (isNaN(decimalPlaces) || num <= 0) {
        return num;
    }
    return Math.round(num * Math.pow(10,decimalPlaces)) / Math.pow(10,decimalPlaces);
} 

export default class Anchor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };
    }

    // Move
    handleAnchorClick(e, a) {
        console.log("clicked anchor");
        // this.props.anchorSelect();
        // this.togglePopDecodedupInfo(e);
        // // console.log("h str", e, a);
        // // this.props.anchorMove(1,a.)
    }

    onMouseEnter() {
        console.log("onMouseEnter");
    }

    onMouseLeave() {
        console.log("onMouseLeave");
    }

    render() {
        const anchorDistancesRound = this.props.menu.get("anchorDistancesRound");

        window.c_ad = this;
        if (
            this.props.anchorData &&
            this.props.anchorData.pos &&
            this.props.standData &&
            this.props.standData.pos
        ) {
            const posAnchor = this.props.anchorData.pos;
            const posTarget = this.props.standData.pos;

            const diffPos = {
                x: posAnchor.x - posTarget.x,
                y: posAnchor.y - posTarget.y
            };

            const hypoLength = Math.sqrt(
                diffPos.x * diffPos.x + diffPos.y * diffPos.y
            ); // Hypotenuse

            let posAnchorDecoded = decodePos(
                this.props.menu,
                this.props.anchorData.pos
            );

            let posTargetDecoded = decodePos(
                this.props.menu,
                this.props.standData.pos
            );

            posAnchorDecoded.x =
                isNaN(posAnchorDecoded.x) || posAnchorDecoded.x === ""
                    ? 0
                    : posAnchorDecoded.x;
            posAnchorDecoded.y =
                isNaN(posAnchorDecoded.y) || posAnchorDecoded.y === ""
                    ? 0
                    : posAnchorDecoded.y;

            posTargetDecoded.x =
                isNaN(posTargetDecoded.x) || posTargetDecoded.x === ""
                    ? 0
                    : posTargetDecoded.x;
            posTargetDecoded.y =
                isNaN(posTargetDecoded.y) || posTargetDecoded.y === ""
                    ? 0
                    : posTargetDecoded.y;

            const diffPosDecoded = {
                x: posAnchorDecoded.x - posTargetDecoded.x,
                y: posAnchorDecoded.y - posTargetDecoded.y
            };

            const opDecoded = diffPosDecoded.y; // Opposite
            const adjDecoded = diffPosDecoded.x; // Adjacent
            const hypoLengthDecoded = Math.sqrt(
                opDecoded * opDecoded + adjDecoded * adjDecoded
            ); // Hypotenuse

            let angleRad = 0;
            if (adjDecoded === 0) {
                if (opDecoded >= 0) {
                    angleRad = Math.PI / 2;
                } else {
                    angleRad = Math.PI / -2;
                }
            } else {
                angleRad = Math.atan(opDecoded / adjDecoded);
            }

            let flipTextUpsideDown = false;

            // If the stand is to the left of the anchor,
            // to deal with TOA trig quadrants, rotate an extra 180 degrees.
            if (diffPosDecoded.x > 0) {
                angleRad += Math.PI;
                flipTextUpsideDown = true;
            }

            const anchorDistanceStyle = {
                width: hypoLengthDecoded,
                border: "1px solid red",
                transform: `translate(${posAnchorDecoded.x}px, ${
                    posAnchorDecoded.y
                }px) rotate(${angleRad}rad)`
            };

            let displayedLength;

            const convertMetersToInches = (m) => {
                const inches = m * 39.370;
                return inches;
            }

            const convertInchesToFeetAndInches = (inches) => {
                const feet = Math.floor(inches / 12);
                const inchesLeft = roundNum(inches % 12, anchorDistancesRound);

                if (feet > 0) {
                    return `${feet}' ${inchesLeft}"`;
                } else {
                    return `${inchesLeft}"`;
                }
            }

            if (this.props.menu.get("anchorDistancesUnit") === "meters") {
                displayedLength = `${roundNum(hypoLength, anchorDistancesRound)}m`;
            } else {
                const inchesValue = convertMetersToInches(hypoLength);
                const feetAndInchesVal = convertInchesToFeetAndInches(inchesValue);

                displayedLength = feetAndInchesVal;
            }

            return (
                <div
                    style={anchorDistanceStyle}
                    className="AnchorDistance"
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                >
                    <div
                        className={cn("AnchorDistance-text", {
                            "AnchorDistance-text--flipped": flipTextUpsideDown
                        })}
                    >
                        {displayedLength}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}
