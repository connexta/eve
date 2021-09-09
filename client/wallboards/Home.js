import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { O_FROST, O_FONT, O_SMOKE } from "../utils/Constants";
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

export const StyledButton = styled(Button)`
  background-color: ${O_FROST};
  height: 15vh;
  width: 20vw;
  margin: 20px;
  font-size: 35px;
  font-family: ${O_FONT};
  color: ${O_SMOKE};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  :hover {
    background: rgba(242, 242, 242, 0.9);
  }
`;

const StyledTitle = styled.h1`
  text-align: center;
  color: ${O_FROST};
  font-family: ${O_FONT};
`;

export default class Home extends React.Component {
  render() {
    return (
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
    );
  }
}
