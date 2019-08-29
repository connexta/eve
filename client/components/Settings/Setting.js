import React from "react";
import Fab from "@material-ui/core/Fab";
import { Settings, Cancel } from "@material-ui/icons";
import { ThemeProvider } from "@material-ui/styles";
import { Dialog, DialogTitle } from "@material-ui/core";
import { settingTheme } from "../../utils/Constants";
import { connect } from "react-redux";
import { toggleEdit } from "../../actions";

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

  displayDialog() {
    return (
      <Dialog
        onClose={this.handleClose.bind(this)}
        aria-labelledby="edit"
        open={this.state.open}
        maxWidth={false}
      >
        <DialogTitle>Select a component to edit</DialogTitle>
      </Dialog>
    );
  }

  render() {
    return (
      <ThemeProvider theme={settingTheme}>
        <Fab
          aria-label="settings"
          color="primary"
          size="small"
          onClick={this.handleClick.bind(this)}
        >
          <ThemeProvider theme={settingTheme}>
            {this.toggleFabIcon()}
          </ThemeProvider>
        </Fab>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  edit: state.edit
});

const mapDispatchToProps = {
  toggleEdit
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setting);
