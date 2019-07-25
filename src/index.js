import ReactDOM from "react-dom";
import React from "react";
import styled from "styled-components";
import {
  CX_DARK_BLUE,
  CX_GRAY_BLUE,
  CX_FONT,
  CX_OFF_WHITE
} from "./utils/Constants";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { wallboards } from "./wallboards/Home";
import NullWallboard from "./wallboards/NullWallboard";
import logo from "../resources/logo-offwhite.png";
import Clock from "./components/Clock";
import Grid from "@material-ui/core/Grid";

export const BANNER_HEIGHT = 124;

// const styles = {
//   root: {
//     height: "100%",
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     fontFamily: CX_FONT,
//     background: CX_GRAY_BLUE
//   },
//   banner: {
//     background: CX_DARK_BLUE,
//     height: BANNER_HEIGHT,
//     width: "100%",
//     margin: "0px",
//     padding: "0 40px 0 40px",
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center"
//   },
//   bottom: {
//     width: "100%",
//     position: "absolute",
//     top: BANNER_HEIGHT,
//     bottom: 0
//   },
//   logo: {
//     margin: "0 0 12px 0"
//   },
//   // For message in bottom left corner
//   DevMessage: {
//     color: CX_OFF_WHITE,
//     fontSize: "20px",
//     position: "absolute",
//     bottom: 0,
//     marginLeft: "24px"
//   }
// };

const RootGrid = styled(Grid)`
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  font-family: ${CX_FONT};
  background: ${CX_GRAY_BLUE};
`;

const BannerGrid = styled.div`
  background: ${CX_DARK_BLUE};
  height: ${BANNER_HEIGHT}px;
  width: 100%;
  margin: 0px;
  padding: 0 40px 0 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BottomGrid = styled(Grid)`
  background: ${CX_GRAY_BLUE};
  width: 100%;
  position: absolute;
  top: ${BANNER_HEIGHT}px;
  bottom: 0;
`;

const StyledLogo = styled.img`
  margin: 0 0 12px 0;
`;

const StyledDevMsg = styled.div`
  color: ${CX_OFF_WHITE};
  font-size: 20px;
  position: absolute;
  bottom: 0;
  margin-left: 24px;
`;

const Logo = () => {
  return <StyledLogo src={logo} alt="Logo" height="104px" />;
};

ReactDOM.render(
  <Router>
    <RootGrid container>
      <BannerGrid container>
        <Link to="/">
          <Logo />
        </Link>
        <Clock timezone="US/Arizona" place="PHX" />
        <Clock timezone="US/Mountain" place="DEN" />
        <Clock timezone="US/Eastern" place="BOS" />
        <Clock timezone="Europe/London" place="LON" />
        <Clock timezone="Australia/Melbourne" place="MEL" />
      </BannerGrid>
      <BottomGrid item>
        <Switch>
          {wallboards.map(wallboard => {
            return <Route {...wallboard} exact />;
          })}
          <Route component={NullWallboard} />
        </Switch>
        <StyledDevMsg>
          <p>Work in Progress, contact @vina, @matt or join #wallboard-dev</p>
        </StyledDevMsg>
      </BottomGrid>
    </RootGrid>
  </Router>,
  document.getElementById("iamroot")
);
