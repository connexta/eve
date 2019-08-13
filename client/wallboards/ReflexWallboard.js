import React from "react";
import BuildStatus from "../components/BuildStatus";
import BuildAF from "../components/BuildAF";
import SlackComponent from "../components/SlackComponent";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { jenkinsURLList } from "../utils/Link";

const styles = {
  cardContent: {
    padding: "4px",
    width: "14%"
  }
};

export default class AirforceWallboard extends React.Component {
  render() {
    return (
      <Grid container>
        <Grid item>
          <LeftBox>
            <BuildStatus
              urlList={jenkinsURLList}
              cardContentStyle={styles.cardContent}
            />
          </LeftBox>
          <BuildAF />
        </Grid>
        <RightBox item>
          <SlackComponent />
        </RightBox>
      </Grid>
    );
  }
}
