import React from "react";
import styled from "styled-components";
import GoodState from "@material-ui/icons/CheckCircleOutline";
import NeutralState from "@material-ui/icons/RemoveCircleOutline";
import BadState from "@material-ui/icons/HighlightOff";
import CardContent from "@material-ui/core/CardContent";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "../utils/Constants.js";

const StyledCardContent = styled(CardContent)`
  /* Force priority over .MuiCardContent-root:last-child */
  && {
    padding: 4px;
  }
`;

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
    return this.props.score >= 80 ? (
      <StyledCardContent>
        <GoodState
          fontSize="inherit"
          style={{
            color: "green",
            padding: "1 0",
            float: "left",
            transform: "scale(0.9)"
          }}
        />
        {this.props.name}
        <StyledDate>{this.props.subtitle}</StyledDate>
      </StyledCardContent>
    ) : this.props.score >= 40 ? (
      <StyledCardContent>
        <NeutralState
          fontSize="inherit"
          style={{
            color: "orange",
            padding: "1 0",
            float: "left",
            transform: "scale(0.9)"
          }}
        />
        {this.props.name}
        <StyledDate>{this.props.subtitle}</StyledDate>
      </StyledCardContent>
    ) : (
      <StyledCardContent>
        <BadState
          fontSize="inherit"
          style={{
            color: "red",
            padding: "1 0",
            float: "left",
            transform: "scale(0.9)"
          }}
        />
        {this.props.name}
        <StyledDate>{this.props.subtitle}</StyledDate>
      </StyledCardContent>
    );
  }
}

export default BuildIcon;
