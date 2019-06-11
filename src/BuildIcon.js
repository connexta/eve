import React from 'react';
import sun from '../resources/sun.png'
import cloud from '../resources/sun_cloud.png'
import storm from '../resources/thunder.png'

class BuildIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            score: '',
        }
    }

    render() {
        console.log(this.state.score);
        return (
            (this.state.score == 100) ?
                <div>{this.state.score} <img src={sun} alt="sun"/></div>
            : (this.state.score > 50) ?
                <div>{this.state.score} <img src={cloud} alt="cloud"/></div>
            :
                <div>{this.state.score} <img src={storm} alt="storm"/></div>
        );
    }
}

export default BuildIcon;