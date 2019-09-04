import React from 'react';
import { SketchPicker } from 'react-color'

class ColorPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            color: {
                r: '0',
                g: '173',
                b: '210',
                a: '1'
            }
        }
    }

    handleChange(color) {
        this.setState({color: color.rgb});
        this.props.handleColorChange(color);
    }

    render() {
        return (
            <SketchPicker color={this.state.color} onChange={this.handleChange.bind(this)} />                
        )
    }
}

export default ColorPicker;