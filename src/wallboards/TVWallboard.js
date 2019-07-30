import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import Github from "../components/Github";
import Calendar from "../components/Calendar/Calendar";
import { leftBox, rightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { jenkinsURLList } from "../utils/Link";

const styles = {
  cardContent: {
    padding: "4px",
    width: "15%"
  }
};

export default class TVWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <Grid item style={leftBox}>
          <BuildStatus
            urlList={jenkinsURLList}
            cardContentStyle={styles.cardContent}
          />
          <Calendar />
        </Grid>
        <Grid item style={rightBox}>
          <SlackComponent />
          <Github repoPath={"codice/ddf"} />
        </Grid>
      </Grid>
    );
  }
}
