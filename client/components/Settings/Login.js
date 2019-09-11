import React from "react";
import styled from "styled-components";
import {
  Button,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableFooter
} from "@material-ui/core";
import {
  userAgentApplication,
  config,
  userID,
  userName
} from "../Calendar/GraphConfig";
import Fab from "@material-ui/core/Fab";
import { AccountCircle, Cancel } from "@material-ui/icons";
import { ThemeProvider } from "@material-ui/styles";
import { settingTheme } from "../../utils/Constants";
import { connect } from "react-redux";

const StyledButton = styled(Button)`
  width: 70%;
  margin: auto;
`;

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

const CancelFabWrapper = styled(Cancel)`
  margin-right: 8px;
`;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      userDialogOpen: false,
      adminStatus: false
    };
  }

  async componentDidMount() {
    let adminStatus = await this.checkAdmin();
    this.setState({ adminStatus: adminStatus });
  }

  handleClick() {
    this.setState({ open: true });
  }

  toggleFabIcon() {
    return !this.props.edit ? (
      <AccountCircle color="secondary" />
    ) : (
      <Cancel color="secondary" />
    );
  }

  //check user's admin status.
  async checkAdmin() {
    let isAdmin = false;
    await fetch("/checkadmin?id=" + userID, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data && Object.keys(data).length) {
          isAdmin = data.result;
        }
      })
      .catch(err => {
        console.log("Unable to verify admin role from backend ", err);
      });
    return isAdmin;
  }

  async login() {
    try {
      await userAgentApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account"
      });
      document.location.reload();
    } catch (err) {
      console.log("Error Logging In");
    }
  }

  // logs out user, will refresh page
  logout() {
    userAgentApplication.logout();
  }

  //Function to toggle between log in / log out button depending on state
  LogInOut() {
    return userID !== "default" ? (
      <>
        <StyledButton variant={"outlined"} onClick={this.logout.bind(this)}>
          Log Out
        </StyledButton>
        <StyledButton
          variant={"outlined"}
          onClick={() => this.setState({ userDialogOpen: true })}
        >
          Account Info
        </StyledButton>
      </>
    ) : (
      <StyledButton variant={"outlined"} onClick={this.login.bind(this)}>
        Log In
      </StyledButton>
    );
  }

  //close the dialog and clear out the textfields
  handleClose(dialogOpenName) {
    this.setState({
      [dialogOpenName]: false
    });
  }

  displayCancelFab(dialogOpenName) {
    return (
      <Button onClick={this.handleClose.bind(this, dialogOpenName)}>
        <CancelFabWrapper />
        Close
      </Button>
    );
  }

  displayClose(dialogOpenName) {
    return (
      <TableFooter>
        <TableRow>
          <TableCell align="center">
            {this.displayCancelFab(dialogOpenName)}
          </TableCell>
        </TableRow>
      </TableFooter>
    );
  }

  displayDialog() {
    return (
      <Dialog
        onClose={() => {
          this.setState({ open: false });
        }}
        aria-labelledby="LoginSub"
        open={this.state.open}
        maxWidth={false}
      >
        <DialogTitle>Login System</DialogTitle>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align="center">{this.LogInOut()}</TableCell>
            </TableRow>
          </TableBody>
          {this.displayClose("open")}
        </Table>
      </Dialog>
    );
  }

  displayAccount() {
    return (
      <Dialog
        onClose={() => {
          this.setState({ userDialogOpen: false });
        }}
        aria-labelledby="User"
        open={this.state.userDialogOpen}
        maxWidth={false}
      >
        <DialogTitle>User's Account Information</DialogTitle>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>User's name: {userName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>User's ID: {userID}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Admin: {this.state.adminStatus ? "YES" : "NO"}
              </TableCell>
            </TableRow>
          </TableBody>
          {this.displayClose("userDialogOpen")}
        </Table>
      </Dialog>
    );
  }

  render() {
    return (
      <>
        <FabContainer>
          <ThemeProvider theme={settingTheme}>
            <StyleFab
              aria-label="loginMain"
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
        {this.displayDialog()}
        {this.displayAccount()}
      </>
    );
  }
}

const mapStateToProps = state => ({
  currentWallboard: state.currentWallboard
});

export default connect(mapStateToProps)(Login);
