import React from "react";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { updateCurrentWallboard, leaveEdit } from "../actions";
import MediaComponent from "../components/MediaComponent";
import Github from "../components/Github";
import SlackComponent from "../components/SlackComponent";
import BuildStatus from "../components/BuildStatus";
import { RightBox } from "../styles/WallboardStyles";
import { createJenkinslistFromRoot } from "../utils/Utils";
import { SLACK_WALLBOARD_CHANNEL } from "../utils/Config";

const GITHUB_HEIGHT = 400;
const DEV_SPACE = 60;

const StyleBuildStatus = {
  height: `calc(100% - ${DEV_SPACE}px - 20px)`,
  width: `calc(33% - 30px)`,
  margin: `20px 10px 20px 20px`
};

const StyleMedia = {
  height: `calc(100% - ${DEV_SPACE}px - 20px)`,
  width: `calc(33% - 30px)`,
  margin: `20px 10px 20px 10px`
};

const StyleSlack = {
  width: `calc(100% - 30px)`,
  height: `calc(100% - ${GITHUB_HEIGHT}px - ${DEV_SPACE}px - 40px)`,
  margin: `20px 20px 10px 10px`
};

const StyleGithub = {
  width: `calc(100% - 30px)`,
  height: `${GITHUB_HEIGHT}px`,
  margin: `20px 20px 20px 10px`
};

class I2OWallboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    this.props.leaveEdit();
    await this.props.updateCurrentWallboard("I2O");
    this.I2ODefaultData = await createJenkinslistFromRoot(
      "ION",
      "bitbucket",
      "ion-"
    );
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
      <Grid container style={{ height: "100%" }} direction={"row"} spacing={0}>
        <BuildStatus
          style={StyleBuildStatus}
          type={["URL", "NAME"]}
          name="BuildStatus"
          default={this.I2ODefaultData}
          listvert
          disable
        />
        <MediaComponent
          style={StyleMedia}
          wallboard={"I2O"}
          name="MediaComponent"
          AdminOnly
          disablePopup
        />
        <RightBox item>
          <SlackComponent
            style={StyleSlack}
            type={["CHANNEL"]}
            name="SlackComponent"
            default={SLACK_WALLBOARD_CHANNEL}
          />
          <Github
            style={StyleGithub}
            type={["REPOPATH"]}
            name="Github"
            default={"connexta/replication"}
          />
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
)(I2OWallboard);
