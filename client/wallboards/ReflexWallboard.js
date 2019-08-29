import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { updateCurrentWallboard, leaveEdit } from "../actions";
import { CARD_SIDE_MARGINS } from "../styles/styles";
import { TV_GITHUB_HEIGHT } from "../utils/Constants";

const buildStatusWidth = `calc(100% - ${CARD_SIDE_MARGINS}px)`;
const SlackHeight = `calc(100% - ${TV_GITHUB_HEIGHT}px - 72px - 32px)`;

class ReflexWallboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await this.props.updateCurrentWallboard("Reflex");
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
          <BuildStatus
            width={buildStatusWidth}
            type={["URL", "NAME"]}
            row={6}
            name="BuildStatus"
          />
        </LeftBox>
        <RightBox item>
          <SlackComponent
            height={SlackHeight}
            type={["CHANNEL"]}
            name="SlackComponent"
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
)(ReflexWallboard);
