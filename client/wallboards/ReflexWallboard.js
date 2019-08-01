import React from "react";
import BuildStatus from "../components/BuildStatus";
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
      <Grid container style={{ height: "100%" }}>
<<<<<<< HEAD:client/wallboards/ReflexWallboard.js
<<<<<<< HEAD:client/wallboards/ReflexWallboard.js
        <LeftBox item>
=======
        <Grid item style={leftBox}>
>>>>>>> Progress on converting styling:src/wallboards/AirforceWallboard.js
=======
        <LeftBox>
>>>>>>> Dealt with conflicts after rebasing:src/wallboards/AirforceWallboard.js
          <BuildStatus
            urlList={jenkinsURLList}
            cardContentStyle={styles.cardContent}
          />
<<<<<<< HEAD:client/wallboards/ReflexWallboard.js
        </LeftBox>
=======
          <BuildAF />
<<<<<<< HEAD:client/wallboards/ReflexWallboard.js
        </Grid>
>>>>>>> Progress on converting styling:src/wallboards/AirforceWallboard.js
=======
        </LeftBox>
>>>>>>> Dealt with conflicts after rebasing:src/wallboards/AirforceWallboard.js
        <RightBox item>
          <SlackComponent />
        </RightBox>
      </Grid>
    );
  }
}
