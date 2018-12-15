import React from 'react';
import Head from '../containers/Head'

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pos : {x:0, y:0},
            // rotateRad : 0
        };
    }

    render() {
        window.c_HEADS = this;
        const heads = this.props.heads;

        // let pos = {x: 0, y:0};
        // let pos = stand.get("pos").toJS();
        // pos.x = isNaN(pos.x) ? 0 : pos.x;
        // pos.y = isNaN(pos.y) ? 0 : pos.y;
        
        // let rot = stand.get("rot");
        // rot = isNaN(rot) ? 0 : rot;

        // const selectedStandIndex = this.props.menu.get("selectedStandIndex");

        return (
            <div className="Heads">
                {heads.map((head, i) => <Head key={i} head={head} headIndex={i} standIndex={this.props.standIndex}/>)}
            </div>
        );
    }
}