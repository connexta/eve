import React from "react";
import ReleaseVersion from "../components/ReleaseVersion";
import { connect } from "react-redux";
import { updateCurrentWallboard, leaveEdit } from "../actions";

class GSRWallboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await this.props.updateCurrentWallboard("GSR");
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    this.props.updateCurrentWallboard("HOME");
    this.props.leaveEdit();
  }

  render() {
    return this.state.isLoading ? <></> : <ReleaseVersion />;
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
