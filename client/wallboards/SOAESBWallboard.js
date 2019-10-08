import React from "react";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import BuildAF from "../components/BuildAF";
import Grafana from "../components/Grafana";
import { SOAESB_GRAFANA_URL } from "../utils/Link";
import { connect } from "react-redux";
import { updateCurrentWallboard, leaveEdit } from "../actions";
import Github from "../components/Github";

const BUILD_STATUS_HEIGHT = 520;

const StyleBuildStatus = {
  height: `${BUILD_STATUS_HEIGHT}px`,
  width: `calc(100% - 30px)`,
  margin: `20px 20px 10px 10px`
};

const StyleGrafana = {
  height: `calc(100% - 80px)`,
  width: `calc(100% - 30px)`,
  margin: `20px 10px 20px 20px`
};

const StyleGithub = {
  height: `calc(100% - ${BUILD_STATUS_HEIGHT}px - 100px)`,
  width: `calc(100% - 30px)`,
  margin: `20px 20px 20px 10px`
};

class SOAESBWallboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    this.props.leaveEdit();
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
      <Grid container style={{ height: "100%" }} spacing={0}>
        <LeftBox item>
          <Grafana
            style={StyleGrafana}
            name={"SOAESB"}
            url={SOAESB_GRAFANA_URL}
          />
        </LeftBox>
        <RightBox item>
          <BuildAF
            style={StyleBuildStatus}
            type={["URL", "NAME"]}
            name="BuildAF"
          />
          <Github style={StyleGithub} type={["REPOPATH"]} name="Github" />
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
