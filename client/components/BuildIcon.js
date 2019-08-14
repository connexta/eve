import React from "react";
import styled from "styled-components";
import GoodState from "@material-ui/icons/CheckCircleOutline";
import NeutralState from "@material-ui/icons/RemoveCircleOutline";
import BadState from "@material-ui/icons/HighlightOff";
import CardContent from "@material-ui/core/CardContent";
import { FlexRowSubHeading } from "../styles/styles";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "../utils/Constants.js";

class BuildIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.score >= 80 ? (
      <CardContent style={this.props.cardContentStyle}>
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
      </CardContent>
    ) : this.props.score >= 40 ? (
      <CardContent style={this.props.cardContentStyle}>
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
      </CardContent>
    ) : (
      <CardContent style={this.props.cardContentStyle}>
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
      </CardContent>
    );
  }
}

export default BuildIcon;
