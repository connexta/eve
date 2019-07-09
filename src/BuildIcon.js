import React from "react";
import styled from "styled-components";
import Done from "@material-ui/icons/Done";
import Clear from "@material-ui/icons/Clear";
import Remove from "@material-ui/icons/Remove";
import CardContent from "@material-ui/core/CardContent";
import { CX_GRAY_BLUE, BATMAN_GRAY, CX_OFF_WHITE } from "./Constants";

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const IconStyle = styled.div`
  border-radius: 50%;
  /* border: 1px solid black; */
  width: 60px;
  height: 60px;
  background-color: ${CX_OFF_WHITE};
  margin-left: 15px;
  color: green;

  vertical-align: baseline;

  /* display: flex;
  flex-direction: column;
  justify-content: center; */
`;

class BuildIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      score: props.score
    };
  }

  render() {
    return this.state.score == 100 ? (
      <CardContent>
        <Done fontSize="inherit" style={{ color: "green" }} />
        {this.state.name}
      </CardContent>
    ) : this.state.score > 50 ? (
      <CardContent fontSize="large">
        <Remove fontSize="inherit" style={{ color: "yellow" }} />
        {this.state.name}
      </CardContent>
    ) : (
      <CardContent style={{ fontSize: "50px", border: "1px solid black" }}>
        {/* <Done
          fontSize="inherit"
          style={{ color: "green", display: "inline" }}
        /> */}
        {/* <Remove fontSize="inherit" style={{ color: "orange" }} /> */}
        <Clear fontSize="inherit" style={{ color: "red" }} />
        {this.state.name}
      </CardContent>
    );
  }
}

export default BuildIcon;
