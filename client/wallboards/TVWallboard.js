import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import Github from "../components/Github";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import MediaComponent from "../components/MediaComponent";
import EventComponent from "../components/EventComponent";
import { connect } from "react-redux";
import { updateCurrentWallboard, leaveEdit } from "../actions";

const GITHUB_HEIGHT = 400;
const DEV_SPACE = 60;

/*
You can change the size of any component by passing the parameter to the component.

const StyleBuildStatus = {
  height: `160px`,
  width: `calc(100% - 30px)`,
  margin: `20px`
};

<BuildStatus 
  style={StyleBuildStatus} 
  />
*/

const StyleBuildStatus = {
  height: `160px`,
  width: `calc(100% - 30px)`,
  margin: `20px 10px 10px 20px`
};

const StyleMedia = {
  height: `100%`,
  width: `calc(50% - 25px)`,
  margin: `10px 10px 20px 20px`
};

const StyleEvent = {
  height: `100%`,
  width: `calc(50% - 25px)`,
  margin: `10px 10px 20px 10px`
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

class TVWallboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await this.props.updateCurrentWallboard("TV");
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
          <BuildStatus
            style={StyleBuildStatus}
            type={["URL", "NAME"]}
            row={6}
            name="BuildStatus"
          />
          <Grid
            container
            direction="row"
            style={{ height: "calc(100% - 260px)" }}
          >
            <MediaComponent style={StyleMedia} wallboard={"tv"} disableEffect />
            <EventComponent style={StyleEvent} wallboard={"tv"} disableEffect />
          </Grid>
        </LeftBox>
        <RightBox item>
          <SlackComponent
            style={StyleSlack}
            type={["CHANNEL"]}
            name="SlackComponent"
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
)(TVWallboard);
