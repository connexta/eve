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
import { CARD_SIDE_MARGINS } from "../styles/styles";
import { TV_GITHUB_HEIGHT } from "../utils/Constants";

/*
You can change the size of any component by passing the parameter to the component.

< Example >
To change height of BuildStatus...

const buildStatusWidth = `calc(100% - ${CARD_SIDE_MARGINS}px)`;
<BuildStatus 
  width={buildStatusWidth} 
  />
*/

const buildStatusWidth = `calc(100% - ${CARD_SIDE_MARGINS}px)`;
/*Height of Slack Card is size of window beneath banner minus size of github card and margins */
const SlackHeight = `calc(100% - ${TV_GITHUB_HEIGHT}px - 72px - 32px)`;
const GithubHeight = `${TV_GITHUB_HEIGHT}px`;
const MediaHeight = `calc((100% / 2) - 24px)`;

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
            width={buildStatusWidth}
            type={["URL", "NAME"]}
            row={6}
            name="BuildStatus"
          />
          <Grid
            container
            direction="row"
            style={{ height: "calc(100% - 260px)" }}
          >
            <MediaComponent />
            <EventComponent />
          </Grid>
        </LeftBox>
        <RightBox item>
          <SlackComponent
            height={SlackHeight}
            type={["CHANNEL"]}
            name="SlackComponent"
          />  
          <Github height={GithubHeight} type={["REPOPATH"]} name="Github" />
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
