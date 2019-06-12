import React from "react";
import styled from "styled-components";
import * as consts from "./Constants.js";
import Clock from "react-live-clock";

const FONT_STYLE = "bold";

const ClockHrStyle = styled.nav`
  font-size: 6em;
  color: ${consts.CX_OFF_WHITE};
  font-family: ${consts.CX_FONT};
  font-style: ${FONT_STYLE};
`;

const ClockHr = ({ timezone }) => {
  return (
    <ClockHrStyle>
      <Clock format={"HH"} ticking={true} timezone={timezone} />
    </ClockHrStyle>
  );
};

const ClockMinStyle = styled.nav`
  font-size: 3em;
  color: ${consts.CX_OFF_WHITE};
  font-family: ${consts.CX_FONT};
  font-style: ${FONT_STYLE};
`;

const ClockMin = ({ timezone }) => {
  return (
    <ClockMinStyle>
      <Clock format={":mm"} ticking={true} timezone={timezone} />
    </ClockMinStyle>
  );
};

const ClockMinAndPlace = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 5px;
`;

const ClockFullStyle = styled.div`
  display: flex;
`;

const PlaceStyle = styled.div`
  font-size: 2em;
  color: ${consts.CX_OFF_WHITE};
  font-family: ${consts.CX_FONT};
  font-style: ${FONT_STYLE};
`;

const ClockFull = ({ timezone, place }) => {
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

export default ClockFull;
