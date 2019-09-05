import React from 'react';
import styled from "styled-components";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const StyleFormControl = styled(FormControl)`
    min-width: 120px;
`;

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ""
        }
    }

    handleChange(type, event) {
        this.setState({data: event.target.value});
        switch (type) {
            case "CHANNEL":
                this.props.handleChannelChange(event.target.value.id);
                break;
            case "MAINURL":
                this.props.handleJenkinsNameChange(event.target.value, this.props.index);
                break;
            case "SUBURL":
                this.props.handleJenkinsURLChange(event.target.value, this.props.index);
                break;
        }
    }

    //based on the input type, display different format of menu item.
    displayMenuItems(type){
        switch (type){
            case "CHANNEL":
            case "MAINURL":
            case "SUBURL":
                return (
                    this.props.list ?
                    this.props.list.map(data => (
                    <MenuItem key={data.name} value={data}>
                        {data.name}
                    </MenuItem>
                ))
                :
                <MenuItem/>
                )
            default:
                return undefined;
        }
    }

    render() {
        return (
            <StyleFormControl>
            <Select
                value={this.state.data}
                onChange={this.handleChange.bind(this, this.props.type)}
            >   
                {this.displayMenuItems(this.props.type)}
            </Select>
          </StyleFormControl>           
        )
    }
}

export default Dropdown;