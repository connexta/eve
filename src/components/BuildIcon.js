import React from "react";
import GoodState from "@material-ui/icons/CheckCircleOutline";
import NeutralState from "@material-ui/icons/RemoveCircleOutline";
import BadState from "@material-ui/icons/HighlightOff";
import CardContent from "@material-ui/core/CardContent";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "../utils/Constants.js";

const styles = {
  cardContent: {
    padding: "4px",
    width: "14%"
  },
  date: {
    background: CX_OFF_WHITE,
    fontSize: "20px",
    color: BATMAN_GRAY,
    fontFamily: CX_FONT,
    fontStyle: "italic",
    marginLeft: "32px"
  }
};

class BuildIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      score: props.score,
      subtitle: props.subtitle
    };
  }

  render() {
    return this.state.score >= 80 ? (
      <CardContent style={styles.cardContent}>
        <GoodState
          fontSize="inherit"
          style={{
            color: "green",
            padding: "1 0",
            float: "left",
            transform: "scale(0.9)"
          }}
        />
        {this.state.name}
        <div style={styles.date}>{this.state.subtitle}</div>
      </CardContent>
    ) : this.state.score >= 40 ? (
      <CardContent style={styles.cardContent}>
        <NeutralState
          fontSize="inherit"
          style={{
            color: "orange",
            padding: "1 0",
            float: "left",
            transform: "scale(0.9)"
          }}
        />
        {this.state.name}
        <div style={styles.date}>{this.state.subtitle}</div>
      </CardContent>
    ) : (
      <CardContent style={styles.cardContent}>
        <BadState
          fontSize="inherit"
          style={{
            color: "red",
            padding: "1 0",
            float: "left",
            transform: "scale(0.9)"
          }}
        />
        {this.state.name}
        <div style={styles.date}>{this.state.subtitle}</div>
      </CardContent>
    );
  }
}

export default BuildIcon;
