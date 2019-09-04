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
            channelData: "",
            jenkinstData: ""
        }
    }

    handleChange(event, type) {
        
        switch (type) {
            case "CHANNEL":
                this.setState({channelData: event.target.value})
                this.props.handleChannelChange(event.target.value.id);
                break;
            case "URL":
                this.setState({jenkinsData: event.target.value})
                this.props.handleJenkinsChange(event.target.value.name);
                break;
        }
    }

    displayMenuItems(type){
        switch (type){
            case "CHANNEL":
                return (
                    this.props.channelList.map(channelData => (
                    <MenuItem key={channelData.name} value={channelData}>
                        {channelData.name}
                    </MenuItem>
                )))
            case "URL":
                console.log("INSIDE DROPDOWN");
                console.log(this.props.jenkinsList);
                return (
                    this.props.jenkinsList.map(jenkinsData => (
                        <MenuItem key={jenkinsData.name} value={jenkinsData}>
                            {jenkinsData.name}
                        </MenuItem>
                )))
            default:
                return undefined;
        }
        // return (
        // this.props.channelList ?
        //     this.props.channelList.map(channelData => (
        //         <MenuItem key={channelData.name} value={channelData}>
        //             {channelData.name}
        //         </MenuItem>
        //     ))
        //     :
        //     undefined
        // )
    }

    render() {
        console.log("WHATS B TYPE")
        console.log(this.props.type)
        return (
            <StyleFormControl>
            <Select
                value={this.state.channelData}
                onChange={this.handleChange.bind(this, this.props.type)}
            >   
                {this.displayMenuItems(this.props.type)}
            </Select>
          </StyleFormControl>           
        )
    }
}

export default Dropdown;