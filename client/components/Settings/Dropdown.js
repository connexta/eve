import React from "react";
import styled from "styled-components";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const StyleFormControl = styled(FormControl)`
  min-width: 120px;
`;

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
  }

  //update the current data & call parent handleChange function
  handleChange(event) {
    this.setState({ data: event.target.value });
    this.props.handleChange(
      event.target.value,
      this.props.index,
      this.props.type === "LASTURL"
    );
  }

  //based on the input type, display different format of menu item.
  displayMenuItems() {
    return this.props.list ? (
      this.props.list.map(data => (
        <MenuItem key={data.name} value={data}>
          {data.name}
        </MenuItem>
      ))
    ) : (
      <MenuItem />
    );
  }

  render() {
    return this.props.list ? (
      <StyleFormControl>
        <Select value={this.state.data} onChange={this.handleChange.bind(this)}>
          {this.displayMenuItems()}
        </Select>
      </StyleFormControl>
    ) : (
      <></>
    );
  }
}

export default Dropdown;
