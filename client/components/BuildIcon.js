import React from "react";
import styled from "styled-components";
import GoodState from "@material-ui/icons/CheckCircleOutline";
import NeutralState from "@material-ui/icons/RemoveCircleOutline";
import BadState from "@material-ui/icons/HighlightOff";
import { CardContent, ListItem, TextField } from "@material-ui/core";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "../utils/Constants.js";

const StyledDate = styled.div`
  background: ${CX_OFF_WHITE};
  font-size: 20px;
  color: ${BATMAN_GRAY};
  font-family: ${CX_FONT};
  font-style: italic;
  margin-left: 32px;
`;

class BuildIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CardContent style={this.props.cardContentStyle}>
        <div>
          {this.props.score >= 80 ? (
            <GoodState
              fontSize="inherit"
              style={{
                color: "green",
                padding: "1 0",
                float: "left",
                transform: "scale(0.9)"
              }}
            />
          ) : this.props.score >= 40 ? (
            <NeutralState
              fontSize="inherit"
              style={{
                color: "orange",
                padding: "1 0",
                float: "left",
                transform: "scale(0.9)"
              }}
            />
          ) : (
            <BadState
              fontSize="inherit"
              style={{
                color: "red",
                padding: "1 0",
                float: "left",
                transform: "scale(0.9)"
              }}
            />
          )}
          {this.props.name}
          <StyledDate>{this.props.subtitle}</StyledDate>
        </div>
        <div>
          {this.props.isEditing ? (
            <StyledDate>
              Version:
              <TextField
                name={this.props.name.toString()}
                onChange={this.props.callback}
                defaultValue={this.props.version}
                variant="outlined"
              />
            </StyledDate>
          ) : (
            <StyledDate>Version: {this.props.version}</StyledDate>
          )}
        </div>
      </CardContent>
    );
  }
}

export default BuildIcon;
