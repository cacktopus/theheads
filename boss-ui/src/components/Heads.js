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
        const heads = this.props.heads;

        return (
            <div className="Heads">
                {heads.map((head, i) => <Head key={i} head={head} headIndex={i} standIndex={this.props.standIndex}/>)}
            </div>
        );
    }
}