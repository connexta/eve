import React from "react";
import { CX_OFF_WHITE, CX_FONT } from "../utils/Constants.js";
import LiveClock from "react-live-clock";

const styles = {
  ClockFullStyle: {
    display: "flex",
    fontStyle: "bold",
    color: CX_OFF_WHITE,
    fontFamily: CX_FONT,
    position: "relative",
    bottom: "10px"
  },
  ClockHrStyle: {
    fontSize: "83px"
  },
  ClockMinAndDay: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "4px"
  },
  ClockMinStyle: {
    fontSize: "44px"
  },
  PlaceStyle: {
    fontSize: "22px",
    color: CX_OFF_WHITE,
    position: "relative",
    top: "7px",
    left: "5px",
    textAlign: "justify",
    textJustify: "distribute"
  },
  daystyle: {
    fontSize: "28px",
    position: "relative",
    top: "7px"
  }
};

const ClockHr = ({ timezone }) => {
  return (
    <nav style={styles.ClockHrStyle}>
      <LiveClock format={"HH"} ticking={true} timezone={timezone} />
    </nav>
  );
};

const ClockMin = ({ timezone }) => {
  return (
    <nav style={styles.ClockMinStyle}>
      <LiveClock format={":mm"} ticking={true} timezone={timezone} />
    </nav>
  );
};

const Day = ({ timezone }) => {
  return (
    <div style={styles.daystyle}>
      <LiveClock
        format={"ddd"}
        ticking={true}
        timezone={timezone}
        style={{ textTransform: "uppercase" }}
      />
    </div>
  );
};

const Clock = ({ timezone, place }) => {
  return (
    <div style={styles.ClockDayContainer}>
      <div style={styles.PlaceStyle}>{place}</div>
      <div style={styles.ClockFullStyle}>
        <ClockHr timezone={timezone} />
        <div style={styles.ClockMinAndDay}>
          <Day timezone={timezone} />
          <ClockMin timezone={timezone} />
        </div>
      </div>
    </div>
  );
};

export default Clock;
