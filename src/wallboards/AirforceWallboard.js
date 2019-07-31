import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import { leftBox, rightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import BuildAF from "../components/BuildAF";
import { jenkinsURLList } from "../utils/Link";

const styles = {
  cardContent: {
    padding: "4px",
    width: "14%",
  }
}

export default class AirforceWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <Grid item style={leftBox}>
          <BuildStatus urlList={jenkinsURLList} cardContentStyle={styles.cardContent}/>
          <BuildAF />
        </Grid>
        <Grid item style={rightBox}>
          <SlackComponent />
        </Grid>
      </Grid>
    );
  }
}
