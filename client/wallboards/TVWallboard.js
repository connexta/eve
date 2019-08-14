import React from "react";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import Github from "../components/Github";
import Calendar from "../components/Calendar/Calendar";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { jenkinsURLList } from "../utils/Link";

/*
You can change the size of any component through the use of styled components.

< Example >
To change height of BuildStatus...

const StyledBuildStatus = styled(BuildStatus)`
  height: 100px;
`

*/

export default class TVWallboard extends React.Component {
  render() {
    return (
      <Grid container style={{ height: "100%" }}>
        <LeftBox item>
          <BuildStatus urlList={jenkinsURLList} />
          <Calendar />
        </LeftBox>
        <RightBox item>
          <SlackComponent />
          <Github repoPath={"codice/ddf"} />
        </RightBox>
      </Grid>
    );
  }
}
