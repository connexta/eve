import React from "react";
import EventComponent from "../components/EventComponent";
import Github from "../components/Github";
import MediaComponent from "../components/MediaComponent";
import ReleaseVersion from "../components/ReleaseVersion";
import SlackComponent from "../components/SlackComponent";
import BuildStatus from "../components/BuildStatus";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import { GSRUrlList } from "../utils/Link";
import { SLACK_GSR_DEV_CHANNEL } from "../utils/Config";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { updateCurrentWallboard, leaveEdit } from "../actions";

const GITHUB_HEIGHT = 400;
const DEV_SPACE = 60;

const StyleBuildStatus = {
  height: `160px`,
  width: `calc(50% - 30px)`,
  margin: `20px 10px 10px 20px`
};

const StyleRelease = {
  height: `160px`,
  width: `calc(50% - 30px)`,
  margin: `20px 0px 10px 10px`
};

const StyleMedia = {
  height: `100%`,
  width: `calc(50% - 30px)`,
  margin: `10px 10px 20px 20px`
};

const StyleEvent = {
  height: `100%`,
  width: `calc(50% - 30px)`,
  margin: `10px 10px 20px 10px`
};

const StyleSlack = {
  margin: `20px 20px 0px 0px`,
  width: `calc(100% - 20px)`,
  height: `calc(100% - ${GITHUB_HEIGHT}px - ${DEV_SPACE}px - 40px)`
};

const StyleGithub = {
  margin: `20px 20px 20px 0px`,
  width: `calc(100% - 20px)`,
  height: `${GITHUB_HEIGHT}px`
};

class GSRWallboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    this.props.leaveEdit();
    await this.props.updateCurrentWallboard("GSR");
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
        <LeftBox>
          <Grid container direction="row">
            <BuildStatus
              style={StyleBuildStatus}
              type={["URL", "NAME"]}
              row={3}
              name="BuildStatus"
              default={GSRUrlList}
            />
            <ReleaseVersion
              style={StyleRelease}
              name="ReleaseVersion"
              disableEffect
              AdminOnly
              disablePopup
            />
          </Grid>
          <Grid
            container
            direction="row"
            style={{ height: "calc(100% - 260px)" }}
          >
            <MediaComponent
              style={StyleMedia}
              wallboard={"gsr"}
              name="MediaComponent"
              AdminOnly
              disablePopup
            />
            <EventComponent
              style={StyleEvent}
              wallboard={"gsr"}
              name="EventComponent"
              AdminOnly
              disablePopup
            />
          </Grid>
        </LeftBox>
        <RightBox item>
          <SlackComponent
            style={StyleSlack}
            type={["CHANNEL"]}
            name="SlackComponent"
            default={SLACK_GSR_DEV_CHANNEL}
          />
          <Github
            style={StyleGithub}
            type={["REPOPATH"]}
            name="Github"
            default="connexta/gsr-yorktown"
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
)(GSRWallboard);
