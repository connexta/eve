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
import Setting from "./components/Settings/Setting";
import logo from "../resources/logo-offwhite.png";
import Clock from "./components/Clock";
import Grid from "@material-ui/core/Grid";

import { StylesProvider } from "@material-ui/styles";
import {connect} from 'react-redux';
import { addComponents } from "./actions";

export const BANNER_HEIGHT = 100;

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
  padding: 4px 40px 0 40px;
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

const StyledSettings = styled.div`
  bottom:0;
  right:0;
  margin-right: 10px;
  margin-bottom: 10px;
  position: absolute;
`;

const Logo = () => {
  return <StyledLogo src={logo} alt="Logo" height="104px" />;
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount(){
        console.log("attempting to add components");
        console.log(this.props.components);
        this.props.addComponents(["App"]);
      }

    render(){
        return (
            <StylesProvider injectFirst>
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
                  <StyledSettings>
                    <Setting/>
                  </StyledSettings>
                </BottomGrid>
              </RootGrid>
            </Router>
          </StylesProvider>
        );
    }
}
const mapStateToProps = state => ({
    components: state.currentComponents
  })
  
  const mapDispatchToProps = dispatch => ({
      addComponents: component => dispatch(addComponents(component))
  })

export default connect(mapStateToProps, mapDispatchToProps)(App);
