import React from "react";
import styled from "styled-components";
import Fab from '@material-ui/core/Fab';
// import SettingsIcon from '@material-ui/icons/Settings';
// import { settings } from '@material-ui/core/Icon';
// import Icon from '@material-ui/core/Icon';
import { Settings, Cancel } from "@material-ui/icons"
import { ThemeProvider } from "@material-ui/styles";
// import Modal from '@material-ui/core/Modal';
import { Dialog, DialogTitle } from "@material-ui/core";
import { settingTheme } from "../../utils/Constants";
import SettingContainers from "./SettingContainers";
import { connect } from 'react-redux'
import { enterEdit, leaveEdit, toggleEdit } from "../../actions";

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

class Setting extends React.Component {
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

  handleClick() {
    // this.setState({ open: true });
    // this.props.enterEdit();
    this.props.toggleEdit();
    console.log("opened");
  }

  handleClose() {
    // this.setState({ open: false });
    console.log("closed");
    // this.props.leaveEdit();
  }

  toggleFabIcon() {
    return (!this.props.editMode ? 
    <Settings color="secondary"/> :
    <Cancel color="secondary"/>
    )
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
          Select a component to edit
        </DialogTitle>
        <SettingContainers/>
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
              onClick={this.handleClick.bind(this)} > 
                {/* <SettingsIcon color="red"/> */}
                {/* <Icon>code</Icon> */}
                <ThemeProvider theme={settingTheme}>
                  {this.toggleFabIcon()}
                </ThemeProvider>
            </Fab>
            {/* {this.displayDialog()} */}
      </ThemeProvider>
    );
  }
}

// const mapDispatchToProps = dispatch => ({
//   clickEdit,
//   leaveEdit
// })
// const map

const mapStateToProps = state => ({
  // components: state.currentComponents,
  editMode: state.editMode
})

const mapDispatchToProps = {
  enterEdit,
  leaveEdit,
  toggleEdit
}


export default connect(mapStateToProps, mapDispatchToProps)(Setting)