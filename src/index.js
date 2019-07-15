import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { CX_DARK_BLUE } from "./Constants";
import logo from "../resources/logo-white.png";
import ClockFull from "./clock.js";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

// Wallboards
import Home from "./wallboards/Home";
import TVWallboard from "./wallboards/TVWallboard";
import AirforceWallboard from "./wallboards/AirforceWallboard";
import GSRWallboard from "./wallboards/GSRWallboard";
import NullWallboard from "./wallboards/NullWallboard";

const Banner = styled.nav`
  background: ${CX_DARK_BLUE};
  padding-left: 40px;
  padding-right: 40px;
  margin: 0%;
  border-bottom: solid black 3px;
  border-top: solid black 3px;
  height: 125px;
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
    <Router>
      <MainGridVert>
        <Banner>
          <BannerGrid>
            <Link to="/">
              <Logo />
            </Link>
            <ClockFull timezone="US/Arizona" place="PHX" />
            <ClockFull timezone="US/Mountain" place="DEN" />
            <ClockFull timezone="US/Eastern" place="BOS/DC" />
            <ClockFull timezone="Australia/Melbourne" place="MEL (+1)" />
          </BannerGrid>
        </Banner>
        <Switch>
          {/* Place new wallboard layouts here */}
          <Route path="/" exact component={Home} />
          <Route path="/tv/" exact component={TVWallboard} />
          <Route path="/airforce/" exact component={AirforceWallboard} />
          <Route path="/gsr/" exact component={GSRWallboard} />
          <Route component={NullWallboard} />
        </Switch>
      </MainGridVert>
    </Router>
  </div>,

  document.getElementById("iamroot")
);
