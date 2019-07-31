import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import Github from "../components/Github";
import Calendar from "../components/Calendar/Calendar";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
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
        <LeftBox item>
<<<<<<< HEAD:client/wallboards/TVWallboard.js
          <BuildStatus
            urlList={jenkinsURLList}
            cardContentStyle={styles.cardContent}
          />
          <Calendar />
<<<<<<< HEAD:client/wallboards/TVWallboard.js
        </LeftBox>
=======
        </Grid>
>>>>>>> Progress on converting styling:src/wallboards/TVWallboard.js
=======
          <BuildStatus />
          <Calendar />
        </LeftBox>
>>>>>>> Converted to styled components:src/wallboards/TVWallboard.js
        <RightBox item>
          <SlackComponent />
          <Github repoPath={"codice/ddf"} />
        </RightBox>
      </Grid>
    );
  }
}
