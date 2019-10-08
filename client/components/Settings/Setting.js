import React from "react";
import styled from "styled-components";
import Fab from "@material-ui/core/Fab";
import { Settings, Cancel } from "@material-ui/icons";
import { ThemeProvider } from "@material-ui/styles";
import { settingTheme } from "../../utils/Constants";
import { connect } from "react-redux";
import { toggleEdit } from "../../actions";

const StyleFab = styled(Fab)`
  visibility: ${props =>
    props.currentwallboard === "TV" ? "hidden" : "visible"};
  opacity: ${props => (props.currentwallboard === "TV" ? 0 : 1)};
  transition: visibility 0.5s, opacity 0.5s linear;
`;

const FabContainer = styled.div`
  &:hover {
    ${StyleFab} {
      visibility: visible;
      opacity: 1;
    }
  }
`;

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleClick() {
    this.props.toggleEdit();
  }

  toggleFabIcon() {
    return !this.props.edit ? (
      <Settings color="secondary" />
    ) : (
      <Cancel color="secondary" />
    );
  }

  render() {
    return (
      <>
        <FabContainer>
          <ThemeProvider theme={settingTheme}>
            <StyleFab
              aria-label="settings"
              color="primary"
              size="small"
              onClick={this.handleClick.bind(this)}
              currentwallboard={this.props.currentWallboard}
            >
              <ThemeProvider theme={settingTheme}>
                {this.toggleFabIcon()}
              </ThemeProvider>
            </StyleFab>
          </ThemeProvider>
        </FabContainer>
      </>
    );
  }
}

const mapStateToProps = state => ({
  edit: state.edit,
  currentWallboard: state.currentWallboard
});

const mapDispatchToProps = {
  toggleEdit
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setting);
