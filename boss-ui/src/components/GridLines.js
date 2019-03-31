import React from 'react'
// import MotionLine from '../containers/MotionLine';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        const numTrs = 10;
        const numTds = 10;

        // const cells = Array.apply(null, Array(numTrs)).map((v,i) => {
        //     return (
        //         <td key={i}>{i}</td>
        //     );
        // });

        const cells = Array.apply(null, Array(numTrs)).map((v,i) => {
            return (
                <tr key={i}>
                    {/* <tr>jim</tr> */}
                    {Array.apply(null, Array(numTds)).map((val2,j) => <td key={j}></td>)}
                </tr>
            );
        });
        
        return (
            <div className="GridLines" style={{position: "absolute"}}>
                <table>
                    <tbody>
                        {cells}
                    </tbody>
                </table>
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