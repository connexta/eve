import React from "react";
import styled from "styled-components";
import { O_GRAPEFRUIT, O_FONT } from "../utils/Constants.js";
import LiveClock from "react-live-clock";

const ClockFullStyle = styled.div`
  display: flex;
  font-style: bold;
  color: ${O_GRAPEFRUIT};
  font-family: ${O_FONT};
`;

const ClockHrStyle = styled.div`
  font-size: 83px;
`;

const ClockMinAndPlace = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 5px;
`;

const ClockMinStyle = styled.div`
  font-size: 44px;
`;

const PlaceStyle = styled.div`
  font-size: 28px;
  margin-left: 14px;
  position: relative;
  top: 6px;
`;

const ClockHr = ({ timezone }) => {
  return (
    <ClockHrStyle>
      <LiveClock format={"HH"} ticking={true} timezone={timezone} />
    </ClockHrStyle>
  );
};

const ClockMin = ({ timezone }) => {
  return (
    <ClockMinStyle>
      <LiveClock format={":mm"} ticking={true} timezone={timezone} />
    </ClockMinStyle>
  );
};

const Clock = ({ timezone, place }) => {
  return (
    <ClockFullStyle>
      <ClockHr timezone={timezone} />
      <ClockMinAndPlace>
        <PlaceStyle>{place}</PlaceStyle>
        <ClockMin timezone={timezone} />
      </ClockMinAndPlace>
    </ClockFullStyle>
  );
};

export default Clock;
