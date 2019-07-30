import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "../utils/Constants";
import { Homebase, WallBoardButtons } from "../styles/WallboardStyles";
import Button from "@material-ui/core/Button";

// Wallboard Variants
import GSRWallboard from "./GSRWallboard";
import TVWallboard from "./TVWallboard";
import SOAESBWallboard from "./SOAESBWallboard";
import ReflexWallboard from "./ReflexWallboard";
import I2OWallboard from "./I2OWallboard";

const proxy = props => <Home {...props} />;

// Add new wallboard variants here
export const wallboards = [
  { path: "/", component: proxy, key: "Home" },
  { path: "/tv/", component: TVWallboard, key: "TV" },
  { path: "/soaesb/", component: SOAESBWallboard, key: "SOAESB" },
  { path: "/reflex/", component: ReflexWallboard, key: "Reflex" },
  { path: "/gsr/", component: GSRWallboard, key: "GSR" },
  { path: "/i2o/", component: I2OWallboard, key: "I2O" }
];

// const styles = {
//   button: {
//     background: CX_OFF_WHITE,
//     height: "15vh",
//     width: "20vw",
//     margin: "20px",
//     fontSize: "35px",
//     fontFamily: CX_FONT,
//     color: BATMAN_GRAY,
//     boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
//   },
//   title: {
//     textAlign: "center",
//     color: CX_OFF_WHITE,
//     fontFamily: CX_FONT
//   }
// };

const StyledButton = styled(Button)`
  && {
    background: ${CX_OFF_WHITE};
    height: 15vh;
    width: 20vw;
    margin: 20px;
    font-size: 35px;
    font-family: ${CX_FONT};
    color: ${BATMAN_GRAY};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  }
`;

const StyledTitle = styled.h1`
  text-align: center;
  color: ${CX_OFF_WHITE};
  font-family: ${CX_FONT};
`;

export default class Home extends React.Component {
  render() {
    return (
      // <div>
      <Homebase>
        <StyledTitle>Choose Wallboard Variant</StyledTitle>
        <WallBoardButtons>
          {/* generate links and paths through wallboards object */}
          {wallboards.map(wallboard => {
            if (wallboard.path == "/") return; // ignore Home link
            return (
              <Link
                to={wallboard.path}
                style={{ textDecoration: "none" }}
                key={wallboard.key}
              >
                <StyledButton>{wallboard.key}</StyledButton>
              </Link>
            );
          })}
        </WallBoardButtons>
      </Homebase>
      // </div>
    );
  }
}
