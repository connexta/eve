import React from "react";
import styled from "styled-components";
import logo from "../../resources/Octo-Logo-2021-White.png";
import Clock from "../components/Clock";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import componentHOC from "./Settings/componentHOC";
import O_FONT from "../utils/Constants";
import WebFont from 'webfontloader';

WebFont.load({
   google: {
     //families: [{O_FONT}]
     families: ['Roboto', 'Aaux Next']
   }
});

const StyledLogo = styled.img`
  margin: 0 0 12px 0;
`;

const Logo = () => {
  return <StyledLogo src={logo} alt="Logo" height="104px" />;
};

class Banner extends React.Component {
  render() {
    return (
      <>
        <Link to={"/"} style={this.props.edit ? { pointerEvents: "none" } : {}}>
          <Logo />
        </Link>

        <Clock timezone="US/Arizona" place="AZ" />
        <Clock timezone="US/Mountain" place="MT" />
        <Clock timezone="US/Eastern" place="ET" />
        <Clock timezone="Europe/London" place="LON" />
        <Clock timezone="Australia/Melbourne" place="MEL" />
      </>
    );
  }
}

const WrappedComponent = componentHOC(Banner);
export default WrappedComponent;
