import React from "react";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import BuildAF from "../components/BuildAF";
import Grafana from "../components/Grafana";
import { SOAESB_GRAFANA_URL } from "../utils/Link";
import { connect } from "react-redux";
import { updateCurrentWallboard, leaveEdit } from "../actions";

class SOAESBWallboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await this.props.updateCurrentWallboard("SOAESB");
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    this.props.updateCurrentWallboard("HOME");
    this.props.leaveEdit();
  }

  render() {
    return this.state.isLoading ? (
      <></>
    ) : (
      <Grid container style={{ height: "100%" }}>
        <LeftBox item>
          <Grafana name={"SOAESB"} url={SOAESB_GRAFANA_URL} />
        </LeftBox>
        <RightBox item>
          <BuildAF type={["LINK", "URL", "NAME"]} name="BuildAF" />
        </RightBox>
      </Grid>
    );
  }
}

const mapDispatchToProps = {
  updateCurrentWallboard,
  leaveEdit
};

export default connect(
  null,
  mapDispatchToProps
)(SOAESBWallboard);
