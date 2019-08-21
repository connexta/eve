import React from "react";
import styled from "styled-components";
import Fab from '@material-ui/core/Fab';
// import SettingsIcon from '@material-ui/icons/Settings';
// import { settings } from '@material-ui/core/Icon';
// import Icon from '@material-ui/core/Icon';
import { Settings } from "@material-ui/icons"
import { ThemeProvider } from "@material-ui/styles";
// import Modal from '@material-ui/core/Modal';
import { Dialog, DialogTitle } from "@material-ui/core";
import { settingTheme } from "../utils/Constants";


const ImgContainer = styled.div`
  padding: 24px;
  width: 10px;
  margin: 0px;
`;

const DotLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
`;

export default class Setting extends React.Component {
  constructor(props) {
    super(props);
    // this.handleOpen = this.handleOpen.bind(this);
    this.state = {
      open: false
    };
    // const [open, setOpen] = React.useState(false);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // handleOpen() {
  //   // this.setOpen(true);
  // }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose(value) {
    this.setState({ open: false });
  }

  displayDialog() {
    return(
      <Dialog
        onClose={this.handleClose.bind(this)}
        aria-labelledby="edit"
        open={this.state.open}
        maxWidth={false}
      >
        <DialogTitle>
          Testing
        </DialogTitle>
      </Dialog>
    )
  }

//onClick={handleOpen}>
  render() {
    return (
        <ThemeProvider theme={settingTheme}>
            <Fab 
              aria-label="settings" 
              color="primary" 
              size="small"
              onClick={this.handleClickOpen.bind(this)} > 
                {/* <SettingsIcon color="red"/> */}
                {/* <Icon>code</Icon> */}
                <ThemeProvider theme={settingTheme}>
                  <Settings color="secondary"/>
                </ThemeProvider>
            </Fab>
            {this.displayDialog()}
      </ThemeProvider>
    );
  }
}
