import React from "react";
import styled from "styled-components";
import GoodState from "@material-ui/icons/CheckCircleOutline";
import NeutralState from "@material-ui/icons/RemoveCircleOutline";
import BadState from "@material-ui/icons/HighlightOff";
import CardContent from "@material-ui/core/CardContent";
import { FlexRowSubHeading } from "../styles/styles";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "../utils/Constants.js";

const StyledCardContent = styled(CardContent)`
  /* Force priority over .MuiCardContent-root:last-child */
  && {
    padding: 4px;
  }
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
        <FlexRowSubHeading>{this.props.subtitle}</FlexRowSubHeading>
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
        <FlexRowSubHeading>{this.props.subtitle}</FlexRowSubHeading>
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
        <FlexRowSubHeading>{this.props.subtitle}</FlexRowSubHeading>
      </StyledCardContent>
    );
  }
}

export default BuildIcon;
