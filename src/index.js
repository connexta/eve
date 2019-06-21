import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { CX_OFF_WHITE, CX_DARK_BLUE, CX_GRAY_BLUE } from "./Constants";
import logo from "../resources/logo-white.png";
import ClockFull from "./clock.js";
import BuildStatus from "./BuildStatus";
import SlackComponent from "./SlackComponent";

const Banner = styled.nav`
  background: ${CX_DARK_BLUE};
  padding-left: 40px;
  padding-right: 40px;
  margin: 0%;
  border-bottom: solid black 3px;
  border-top: solid black 3px;
  height: 125px;
`;

const RightBox = styled.nav`
  background: ${CX_OFF_WHITE};
  padding: 0%;
  font-size: 30px;
  border-left: solid black 3px;

  position: absolute;
  top: 131px;
  bottom: 0;
  left: 66vw;
  right: 0;
  overflow: hidden;
`;

const LeftBox = styled.nav`
  background: ${CX_GRAY_BLUE};
  padding: 3%;
  font-size: 30px;
  border-right: solid black 3px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  position: absolute;
  top: 131px;
  bottom: 0;
  left: 0;
  right: 33vw;
`;

const ContentHorz = styled.div`
  display: flex;
  flex-direction: row;
`;

const MainGridVert = styled.div`
  display: flex;
  flex-direction: column;
`;

const BannerGrid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
`;

const Logo = () => {
  return <img src={logo} alt="Logo" height="100vh" />;
};

ReactDOM.render(
  <div>
    <MainGridVert>
      <Banner>
        <BannerGrid>
          <Logo />
          <ClockFull timezone="US/Arizona" place="PHX" />
          <ClockFull timezone="US/Mountain" place="DEN" />
          <ClockFull timezone="US/Eastern" place="BOS/DC" />
          <ClockFull timezone="Australia/Sydney" place="MEL (+1)" />
        </BannerGrid>
      </Banner>
      <ContentHorz>
        <LeftBox>
          {/* Left box content */}
          <BuildStatus />
        </LeftBox>
        <RightBox>
          {/* Right box content */}
          <SlackComponent />
        </RightBox>
      </ContentHorz>
    </MainGridVert>
  </div>,

  document.getElementById("iamroot")
);
