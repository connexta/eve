import React from "react";
import styled from "styled-components";
import {
  CX_GRAY_BLUE,
  CX_FONT,
  CX_OFF_WHITE,
  BANNER_HEIGHT
} from "./utils/Constants";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { wallboards } from "./wallboards/Home";
import NullWallboard from "./wallboards/NullWallboard";
import Setting from "./components/Settings/Setting";
import Login from "./components/Settings/Login";
import Banner from "./components/Banner";
import Grid from "@material-ui/core/Grid";
import { StylesProvider } from "@material-ui/styles";
import Welcome from "./components/Welcome";

const RootGrid = styled(Grid)`
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  font-family: ${CX_FONT};
  background: ${CX_GRAY_BLUE};
`;

const BottomGrid = styled(Grid)`
  background: ${CX_GRAY_BLUE};
  width: 100%;
  position: absolute;
  top: ${BANNER_HEIGHT}px;
  bottom: 0;
`;

const StyledDevMsg = styled.div`
  color: ${CX_OFF_WHITE};
  font-size: 20px;
  position: absolute;
  bottom: 0;
  margin-left: 24px;
`;

const StyledSettings = styled.div`
  bottom: 0;
  right: 0;
  margin-right: 20px;
  margin-bottom: 10px;
  position: absolute;
`;

const StyledLogin = styled.div`
  bottom: 0;
  right: 60px;
  margin-right: 20px;
  margin-bottom: 10px;
  position: absolute;
`;

export default class App extends React.Component {
  render() {
    return (
      <StylesProvider injectFirst>
        <Router>
          <RootGrid container>
            <Banner type={["COLOR"]} name="Banner" />
            <BottomGrid item>
              <Switch>
                {wallboards.map(wallboard => {
                  return <Route {...wallboard} exact />;
                })}
                <Route component={NullWallboard} />
              </Switch>
              <StyledDevMsg>
                <p>
                  Work in Progress, contact @vina, @matt or join #wallboard-dev
                </p>
              </StyledDevMsg>
              <StyledSettings>
                <Setting />
              </StyledSettings>
              <StyledLogin>
                <Login />
              </StyledLogin>
              <Welcome />
            </BottomGrid>
          </RootGrid>
        </Router>
      </StylesProvider>
    );
  }
}
