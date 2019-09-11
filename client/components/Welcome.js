import React from "react";
import { Dialog, DialogTitle } from "@material-ui/core";
import { userName } from "./Calendar/GraphConfig";
import { time } from "../utils/TimeUtils";

//display Welcome dialog when sign-in user enter the website
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    if (userName !== "default") {
      this.setState({ open: true });
    }
  }

  displayDialog() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ open: false });
    }, time({ seconds: 2 }));

    return (
      <Dialog
        onClose={() => {
          this.setState({ open: false });
        }}
        aria-labelledby="Login"
        open={this.state.open}
        maxWidth={false}
      >
        <DialogTitle>Welcome Back, {userName.split(" ")[0]}! </DialogTitle>
      </Dialog>
    );
  }

  render() {
    return <>{this.displayDialog()}</>;
  }
}

export default Welcome;
