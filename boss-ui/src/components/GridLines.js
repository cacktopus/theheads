import React from 'react'
import { throttle } from 'throttle-debounce';
import cn from 'classnames'
import { DraggableCore } from 'react-draggable';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numTrs: 10,
            numTds: 10,
            additionalColsAbove: 0,
            calculatedGrid: false,
            // initialDragPos: {x: 0, y: 0}
        };

        this.refGridLines = React.createRef();

        this.initialDragPos = { x: 0, y: 0 };

        this.handleScroll = this.handleScroll.bind(this);
        this.handleOnWheel = this.handleOnWheel.bind(this);
        // this.handleOnWheel = throttle(60, this.handleOnWheel.bind(this));

        // this.recalcGrid = this.recalcGrid.bind(this);
        this.recalcGrid = throttle(200, this.recalcGrid.bind(this));
        this.handleMoveStart = this.handleMoveStart.bind(this);
        // this.handleMoveDrag = this.handleMoveDrag.bind(this);
        this.handleMoveDrag = throttle(60, this.handleMoveDrag.bind(this));
        // this.recalcGrid = throttle(200, this.recalcGrid.bind(this));
        this.handleMoveStop = this.handleMoveStop.bind(this);

        // this.setScale = e => { props.setScale(e.target.value) };
        // this.setTranslateX = e => { props.setTranslateX(e.target.value) };
        // this.setTranslateY = e => { props.setTranslateY(e.target.value) };

    }

    // Rotate
    handleMoveStart(e, a) {
        e.preventDefault();

        this.initialDragPos = {
            x: a.x,
            y: a.y
        };
    }

    handleMoveDrag(e, a) {
        e.preventDefault();

        const { x, y } = a;

        const newX = x - this.initialDragPos.x;
        const newY = y - this.initialDragPos.y;

        this.initialDragPos.x = x;
        this.initialDragPos.y = y;

        // this.props.setTranslateX(this.props.menu, deltaX);
        this.props.setTranslateX(parseFloat(this.props.menu.getIn(["translate", "x"])) + newX);
        this.props.setTranslateY(parseFloat(this.props.menu.getIn(["translate", "y"])) + newY);

        // this.props.setTranslateX(parseFloat(newX));
        // this.props.setTranslateY(parseFloat(newY));

        // var rad = Math.atan2(y, x); // In radians
        // // Then you can convert it to degrees as easy as:
        // var deg = rad * (180 / Math.PI);

        // const standRot = decodeRot(this.props.stand.get("rot"));
        // // const standRot = this.props.stand.get("rot");

        // this.props.headRotate(encodeRot(deg - standRot));
        // // this.props.headRotate(deg - standRot);
    }

    handleMoveStop(e, a) {
        e.preventDefault();
        // this.props.headRotateStop();
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.refGridLines.current.addEventListener("wheel", this.handleOnWheel, { passive: false });
        // window.addEventListener("wheel", this.handleOnWheel, { passive: false });
        this.recalcGrid();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate(prevProps, prevState) {
        try {
            if (this.props.menu.getIn(["translate", "x"]) !== prevProps.menu.getIn(["translate", "x"]) ||
                this.props.menu.getIn(["translate", "y"]) !== prevProps.menu.getIn(["translate", "y"]) ||
                this.props.menu.getIn(["scale"]) !== prevProps.menu.getIn(["scale"])
            ) {
                this.recalcGrid();
            }
        } catch (e) { }
    }

    // NOTE this is throttled
    recalcGrid() {
        // Menu Specified translate and scale
        const translateX = parseFloat(this.props.menu.getIn(["translate", "x"]));
        const translateY = parseFloat(this.props.menu.getIn(["translate", "y"]));
        const scale = parseFloat(this.props.menu.get("scale"));

        const additionalColsAbove = Math.ceil(translateY / scale) + 1; // Always add an extra 1 (just for smoother scrolls)
        // const additionalColsBelow = 5; //Math.ceil(translateY / scale) + 1; // Always add an extra 1 (just for smoother scrolls)

        this.setState({
            additionalColsAbove,
        });


        // // cell dimensions: cw = cell width; ch = cell height
        // const cw = 100;
        // const ch = cw;

        // // Generic dimensions
        // const height = 1000;
        // const width = height;
        // const left = width / -2;
        // const top = 0;

        // // Grid transformations
        // const gridTranslateX = translateX;
        // const gridTranslateY = translateY;
        // const gridScale = scale / 100;
        // const gridHeight = 1000;
        // const gridWidth = height;
        // const gridLeft = width / -2;
        // const gridTop = 0;

        // // Table rows / columns

        // this.setState({
        //     translateX: gridTranslateX,
        //     translateY: gridTranslateY,
        //     scale: gridScale,
        //     height : gridHeight,
        //     width: gridWidth,
        //     top: gridTop,
        //     left: gridLeft,
        //     numTrs,
        //     numTds,
        //     calculatedGrid : true
        // });
    }

    handleScroll(e) {

        // e.preventdefault();
        // console.log(e);
        // console.log(e.metaKey);
        this.recalcGrid();
        // console.log('s');
        // newFn();
        // let scrollTop = event.srcElement.body.scrollTop;
        // let itemTranslate = Math.min(0, scrollTop/3 - 60);

        // this.setState({
        //   transform: itemTranslate
        // });
    }

    handleOnWheel(e) {
        // // If the "Command" keyt is pressed
        if (e.metaKey) {
            e.stopPropagation();
            e.preventDefault();
            this.props.setScale(parseFloat(this.props.menu.getIn(["scale"])) - (e.deltaY/2));
        }
    }

    render() {
        const winH = window.innerHeight;
        const winW = window.innerWidth;

        const translateX = parseFloat(this.props.menu.getIn(["translate", "x"]));
        const translateY = parseFloat(this.props.menu.getIn(["translate", "y"]));
        let scale = parseFloat(this.props.menu.get("scale"));
        // const scale = parseFloat(this.props.menu.get("scale"));
        // const scale = parseFloat(this.props.menu.get("scale"));

        // default cell dimension (height &  width)
        let defaultCellDim;

        if (scale <= 10) {
            defaultCellDim = 1000;
        } else if (scale <= 16) {
            defaultCellDim = 500;
        } else {
            // This is the default value;
            defaultCellDim = 100;
        }

        if (scale < 10) {
            scale = 10;
        }

        const extraRows = 1;
        let numTrs = Math.ceil(winH / scale) + extraRows; // Always add an additional one
        let numTds = Math.ceil(winW / scale);

        // Ensure the num Tds is an odd number.
        if (numTds % 2 === 1) {
            numTds++;
        }

        const gridTranslateX = translateX;
        const gridTranslateY = translateY + this.state.additionalColsAbove * scale * -1;
        const gridScale = scale / 100;

        // const gridHeight = 1000;
        // const gridWidth = 1000;//numTds * scale;
        // const gridLeft = gridWidth / -2;
        // const gridTop = 0;
        const gridHeight = numTrs * defaultCellDim;
        const gridWidth = numTds * defaultCellDim;
        const gridLeft = gridWidth / -2;
        const gridTop = 0;

        const grid = {
            height: gridHeight,
            width: gridWidth,
            top: gridTop,
            left: gridLeft,
            translateX: gridTranslateX,
            translateY: gridTranslateY,
            scale: gridScale
        }

        const cells = Array.apply(null, Array(numTrs)).map((v, i) => {
            return (
                <tr key={i}>
                    {Array.apply(null, Array(numTds)).map((val2, j) => (
                        <td className={cn({
                            "GridLines-td--thickRight": j === numTds / 2 - 1,
                            "GridLines-td--thickBottom": i === this.state.additionalColsAbove + extraRows - 2
                        })} key={j}></td>
                    ))}
                </tr>
            );
        });

        const styleGridLines = {
            height: `${grid.height}px`,
            width: `${grid.width}px`,
            top: `${grid.top}px`,
            left: `${grid.left}px`,
            transform: `translate(${grid.translateX}px, ${grid.translateY}px) scale(${grid.scale})`
        }

        return (
            // <div onWheel={this.handleOnWheel}>
            <div >
                <DraggableCore
                    // allowAnyClick= boolean,
                    // cancel= string,
                    // disabled= boolean,
                    // enableUserSelectHack= boolean,
                    // offsetParent={this.refStandRotateOffset.current} //HTMLElement,
                    // grid= [number, number],
                    handle=".GridLines-table"
                    onStart={this.handleMoveStart}
                    onDrag={this.handleMoveDrag}
                    onStop={this.handleMoveStop}
                // onMouseDown= (e= MouseEvent) => void
                >
                    <div ref={this.refGridLines} className="GridLines" style={styleGridLines}>
                        <table className="GridLines-table">
                            <tbody>
                                {cells}
                            </tbody>
                        </table>
                    </div>
                </DraggableCore>
            </div>
        )
        // return (
        //     <div className="GridLines" style={{position: "absolute"}}>
        //         <div style={{position: "absolute"}}>{displayedLines}</div>
        //     </div>
        // )
    }
}

// import React from 'react'
// import MotionLine from '../containers/MotionLine';

// export default class Menu extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {

//         };
//     }

//     render() {
//         // let linesJS; 
//         let displayedLines = [];

//         try {
//             // linesJS = this.props.motionLines.get("lines").toList().toJS();
//             // // console.log('linesJS', linesJS);
//             // if (linesJS.length >= 2) {
//             //     window.c_ljs = {linesJS, mls : this.props.motionLines};
//             // }

//             this.props.motionLines.get("lines").forEach((line, id) => { 
//                 const lineJS = line.toJS();
//                 displayedLines.push(<MotionLine key={id} coords={lineJS.coords} shape={lineJS.shape}/>)
//             })

//             // this.props.motionLines.get("lines").toJS().forEach((line, id) => {
//             //     displayedLines.push(<MotionLine key={id} coords={line.coords} shape={line.shape}/>)
//             // });

//             console.log(displayedLines);

//             // displayedLines = linesJS.map((line, i) => <MotionLine key={i} coords={line.coords} shape={line.shape}/>);

//             // showVals = linesJS.map((line, i) => <div key={i}>key={i} coords={line.coords.join(',')} shape={line.shape}</div>);


//             // shape = {this.props.shape}<br/>
//             //         coords = {this.props.coords.map(coord => <span>{coord},</span>)}<br/>
//             //         pos: {pos0.x}, {pos0.y} - {pos1.x}, {pos1.y}


//             // motionLines = this.props.motionLines.get("lines").toList().toJS().map((line, id) => {
//             //     return <div key={id}>{line.get("coords")}</div>
//             // }).toJS();

//         } catch(e) {
//             console.log('Error', e);
//         }


//         return (
//             <div className="GridLines" style={{position: "absolute"}}>
//                 <div style={{position: "absolute"}}>{displayedLines}</div>
//             </div>
//         )
//         // return (
//         //     <div className="GridLines" style={{position: "absolute"}}>
//         //         Motion lines: 
//         //         <div style={{position: "absolute"}}>{displayedLines}</div>
//         //         <div style={{position: "absolute"}}>{showVals}</div>
//         //     </div>
//         // )
//     }
// }