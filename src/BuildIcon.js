import React from "react";
import GoodState from "@material-ui/icons/CheckCircleOutline";
import NeutralState from "@material-ui/icons/RemoveCircleOutline";
import BadState from "@material-ui/icons/HighlightOff";
import CardContent from "@material-ui/core/CardContent";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "./Constants.js";

const styles = {
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
      time: props.time
    };
  }

  render() {
    return this.state.score == 100 ? (
      <CardContent>
        <GoodState
          fontSize="inherit"
          style={{ color: "green", verticalAlign: "top" }}
        />
        {this.state.name}
        <div style={styles.date}>{this.state.time}</div>
      </CardContent>
    ) : this.state.score > 50 ? (
      <CardContent>
        <NeutralState
          fontSize="inherit"
          style={{ color: "orange", verticalAlign: "top" }}
        />
        {this.state.name}
        <div style={styles.date}>{this.state.time}</div>
      </CardContent>
    ) : (
      <CardContent>
        <BadState
          fontSize="inherit"
          style={{
            color: "red",
            verticalAlign: "top"
          }}
        />
        {this.state.name}
        <div style={styles.date}>{this.state.time}</div>
      </CardContent>
    );
  }
}

export default BuildIcon;
