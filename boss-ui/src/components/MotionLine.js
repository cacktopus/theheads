import React from 'react'
import cn from 'classnames'
import {decodePos} from '../helpers';
// import {encodeRot, decodeRot, encodePos, decodePos} from '../helpers';

const lineStyle = (x1, y1, x2, y2, startFade) => {
    const distance = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));

    const xMid = (x1+x2)/2;
    const yMid = (y1+y2)/2;

    const slopInRad = Math.atan2(y1 - y2, x1 - x2);
    // const salopeInDegrees = (slopInRad * 180) / Math.PI;

    const style = {
        position: "absolute",
        width : distance,
        marginLeft : distance / -2,
        left: xMid,
        top: yMid,
        transform: `rotate(${slopInRad}rad)`,
        border: "1.5px solid #f224f5",
        // opacity: startFade ? 0.9 : 1
    }

    return style;
}


export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startFade : false
        };
    }

    componentDidMount() {
        this.setState({
            startFade: true
        })
        
    }

    render() {
        window.c_ML1 = { thi: this, menu : this.props.menu, decodePos};

        let pos0 = decodePos(this.props.menu, {x: this.props.coords[0], y: this.props.coords[1]});
        let pos1 = decodePos(this.props.menu, {x: this.props.coords[2], y: this.props.coords[3]});
        // let delta = {x : pos1.x - pos0.x, y: pos1.y - pos0.y};
        let style = lineStyle(pos0.x, pos0.y, pos1.x, pos1.y, this.state.startFade);

        // return (
        //     <div className="MotionLine" >
        //         <div style={style}>
        //             shape = {this.props.shape}<br/>
        //             pos: ({pos0.x}, {pos0.y}) -> {pos1.x}, {pos1.y}
        //         </div>
        //     </div>
        // )
        return (
            <div className={cn("MotionLine", {fadeOut : this.state.startFade})} style={style}/>
        )
        // return (
        //     <div className="MotionLine" style={{position: "absolute"}}>
        //         shape = {this.props.shape}<br/>
        //         coords = {this.props.coords.map(coord => <span>{coord},</span>)}<br/>
        //         pos: {pos0.x}, {pos0.y} - {pos1.x}, {pos1.y}
        //         <Line x1={pos0.x} y1={pos0.y} x2={pos1.x} y2={pos1.y}/>
        //     </div>
        // )
    }
}