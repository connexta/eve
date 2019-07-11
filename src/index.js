import ReactDOM from "react-dom";
import React from "react";
import {
  CX_OFF_WHITE,
  CX_DARK_BLUE,
  CX_GRAY_BLUE,
  CX_LIGHT_BLUE
} from "./Constants";
import logo from "../resources/logo-white.png";
import ClockFull from "./clock.js";
import BuildStatus from "./BuildStatus";
import SlackComponent from "./SlackComponent";
import Grid from "@material-ui/core/Grid";
import { flexbox } from "@material-ui/system";
import Github from "./githubCaller";
import { CX_FONT } from "./Constants";

/*
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
*/

const Logo = () => {
  return <img src={logo} alt="Logo" height="100vh" />;
};

const BOTTOM_HEIGHT = window.innerHeight - 124;

const styles = {
  root: {
    height: "100%",
    fontFamily: CX_FONT
  },
  banner: {
    background: CX_DARK_BLUE,
    height: "124px",
    width: "100%",
    margin: "0px",
    padding: "0 40px 0 40px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  bottom: {
    background: CX_GRAY_BLUE,
    width: "100%",
    height: BOTTOM_HEIGHT
  },
  leftBox: {
    padding: "40px 40px 40px 40px",
    height: "100%",
    width: "75%"
  },
  rightBox: {
    height: "100%",
    width: "15%"
  }
};

function Main() {
  return (
    <Grid container style={{ height: "100%" }}>
      <Grid container style={styles.banner}>
        <Logo />
        <ClockFull timezone="US/Arizona" place="PHX" />
        <ClockFull timezone="US/Mountain" place="DEN" />
        <ClockFull timezone="US/Eastern" place="BOS/DC" />
        <ClockFull timezone="Australia/Sydney" place="MEL (+1)" />
      </Grid>
      <Grid container style={styles.bottom}>
        <Grid item style={styles.leftBox}>
          {/* Left box content */}
          <BuildStatus />
        </Grid>
        <Grid item style={styles.rightBox}>
          {/* Right box content */}
          <SlackComponent />
          {/* <Github /> */}
        </Grid>
      </Grid>
    </Grid>
  );
}

ReactDOM.render(<Main />, document.getElementById("iamroot"));
