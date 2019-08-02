import React from "react";
import styled from "styled-components";
<<<<<<< HEAD:client/components/BuildStatus.js
<<<<<<< HEAD:client/components/BuildStatus.js
import { CX_DARK_BLUE } from "../utils/Constants";
import BuildIcon from "./BuildIcon";
import { CardContent } from "@material-ui/core";
import { BoxStyle, BoxHeader, CARD_SIDE_MARGINS } from "../styles/styles";
<<<<<<< HEAD:client/components/BuildStatus.js
=======
import {
  CX_OFF_WHITE,
  CX_FONT,
  BATMAN_GRAY,
  CX_DARK_BLUE
} from "../utils/Constants";
=======
import { CX_DARK_BLUE } from "../utils/Constants";
>>>>>>> Converted to styled components:src/components/BuildStatus.js
import BuildIcon from "./BuildIcon";
import { CardContent } from "@material-ui/core";
import { jenkinsURLList } from "../utils/Link";
import {
  BoxStyle,
  BoxHeader,
  CARD_SIDE_MARGINS,
  LEFT_BOX_STYLE
} from "../styles/styles";
>>>>>>> Switching to styled in progress:src/components/BuildStatus.js
=======
>>>>>>> Dealt with conflicts after rebasing:src/components/BuildStatus.js
import makeTrashable from "trashable";
import { hour, getRelativeTime, time } from "../utils/TimeUtils";
import Button from "@material-ui/core/Button";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";

export const BUILD_STATUS_HEIGHT = 160;

const TOGGLE_INTERVAL = time({ seconds: 10 });

<<<<<<< HEAD:client/components/BuildStatus.js
<<<<<<< HEAD:client/components/BuildStatus.js
const StyledCard = styled(BoxStyle)`
  width: calc(100% - ${CARD_SIDE_MARGINS}px);
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 32px;
  clear: both;
  && {
    padding: 0;
  }
`;

const ButtonDefault = styled(Button)`
  float: right;
`;

const ButtonSelected = styled(Button)`
  float: right;
  text-decoration: underline ${CX_DARK_BLUE};

  &:hover {
    text-decoration: underline ${CX_DARK_BLUE};
  }
`;
=======
const styles = {
  // card: {
  //   height: BUILD_STATUS_HEIGHT,
  //   width: "calc(100% - " + CARD_SIDE_MARGINS + "px)"
  // },
  // cardheader: {
  //   background: CX_OFF_WHITE,
  //   color: BATMAN_GRAY,
  //   fontFamily: CX_FONT
  // },
  // cardContent: {
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   flexWrap: "wrap",
  //   fontSize: "32px",
  //   padding: "8px",
  //   clear: "both"
  // },
  // buttonDefault: {
  //   float: "right"
  // },
  // buttonSelected: {
  //   float: "right",
  //   borderBottom: "thick solid " + CX_DARK_BLUE
  // }
};
>>>>>>> Switching to styled in progress:src/components/BuildStatus.js

=======
>>>>>>> Converted to styled components:src/components/BuildStatus.js
const StyledCard = styled(BoxStyle)`
  width: calc(100% - ${CARD_SIDE_MARGINS}px);
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 32px;
  padding: 8px;
  clear: both;
`;

const ButtonDefault = styled(Button)`
  float: right;
`;

const ButtonSelected = styled(Button)`
  float: right;
  text-decoration: underline ${CX_DARK_BLUE};
`;

class BuildStatus extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      currentData: [],
      isLoading: true,
      toggle: true,
      versions: [],
      isEditing: false
    };

    this.getVersions();
  }

  async getVersions() {
    this.trashableVersionFetch = makeTrashable(
      fetch("http://localhost:9000", {
        method: "GET"
      })
    );

    await this.trashableVersionFetch
      .catch(err => console.log(err))
      .then(res => {
        if (!res.ok) {
          console.log("Failed to fetch versions data " + call);
          return;
        } else {
          return res.json();
        }
      })
      .then(res => {
        this.setState({ versions: res });
      });
  }

  componentDidMount() {
    this.refreshBuildStatus();
    this.intervalId = setInterval(() => this.refreshBuildStatus(), hour);
    this.toggleId = setInterval(() => this.toggle(), TOGGLE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    clearInterval(this.toggleId);

    //clearing out left out promise during unmount.
    if (this.trashableRequestList)
      this.trashableRequestList.forEach(promise => promise.trash());

    if (this.trashableVersionFetch) this.trashableVersionFetch.trash();

    if (this.trashableVersionSave) this.trashableVersionSave.trash();
  }

  //a function that continuously be called by each set interval in componentDidMount() to fetch/update each team status for display
  //overallData: temporary array to collect each team status before pushing to setState: data
  //update data for displayName, score, last build time.
  async refreshBuildStatus() {
    let overallData = [];
    this.trashableRequestList = [];
    for (let index in this.props.urlList) {
      this.trashableRequestList.push(
        makeTrashable(this.fetchData(Object.values(this.props.urlList[index])))
      );
    }
    //fetch and update jenkins information for all team
    await Promise.all(this.trashableRequestList)
      .then(linklist => {
        for (let index = 0; index < linklist.length; index++) {
          this.updateData(
            linklist[index],
            overallData,
            Object.keys(this.props.urlList[index]),
            index
          );
        }
      })
      .catch(e => console.log("error", e));
    //push all collected data to data state, and make it ready to display.
    this.setState({ currentData: overallData, isLoading: false });
  }

  toggle() {
<<<<<<< HEAD:client/components/BuildStatus.js
    this.setState({ toggle: !this.state.toggle });
    clearInterval(this.toggleId);
    this.toggleId = setInterval(() => this.toggle(), TOGGLE_INTERVAL);
  }

  clearTimer() {
    clearInterval(this.toggleId);
    this.toggleId = setInterval(() => this.toggle(), TOGGLE_INTERVAL);
=======
    if (!this.state.isEditing) this.setState({ toggle: !this.state.toggle });
  }

  handleChange(evt) {
    let temp = this.state.versions;
    temp[evt.target.name] = evt.target.value;
    this.setState({ versions: temp });
  }

  async save() {
    this.setState({
      isEditing: false
    });

    this.trashableVersionSave = makeTrashable(
      fetch("http://localhost:9000", {
        method: "POST",
        body: JSON.stringify(this.state.versions),
        headers: { "Content-Type": "application/json" }
      })
    );

    await this.trashableVersionSave
      .catch(err => console.log(err))
      .then(res => res.text())
      .then(res => console.log(res));
  }

  editText() {
    this.setState({ isEditing: true });
>>>>>>> working editable version numbers/nodejs server:src/components/BuildStatus.js
  }

  //fetch data from the jenkin url
  fetchData(URL) {
    return fetch(URL)
      .then(response => response.json())
      .catch(e => console.log("error", e));
  }

  //update overallData from item
  //@param:
  //  item: that contains information for array overallData to be updated
  //  overallData: array to pass down to keep each build information such as displayName, etc.
  //  name: processed name to be displayed on the wallboard
  //  index: used to assign for each build information in the array
  updateData(item, overallData, name, index) {
    overallData[index] = {
      displayName: name,
      oneScore: item.latestRun.result === "SUCCESS" ? 100 : 0,
      fiveScore: item.weatherScore,
      oneSubtitle: getRelativeTime(new Date(item.latestRun.startTime)),
      fiveSubtitle: this.getFiveSubtitle(item)
    };
  }

  //get last five builds subtitles based on the number of weatherscore and number of total builds
  getFiveSubtitle(item) {
    const divisor = item.latestRun.id >= 5 ? 5 : item.latestRun.id; //Since weatherscore is calculated by max 5 builds.
    const weatherScoreDivisor =
      divisor === 0 ? undefined : Math.round(100 / divisor); //avoid 0 division
    if (!weatherScoreDivisor) {
      return "Data not Found";
    } else {
      return (
        item.weatherScore / weatherScoreDivisor +
        "/" +
        divisor.toString() +
        " Succeeded"
      );
    }
  }

  //return list of <BuildIcon> with corresponding information to the state toggle.
  //if this.state.toggle === true, return list of current build
  //else, list of last 5 builds
  getBuildDisplay() {
    const display = this.state.toggle
      ? this.state.currentData.map((item, i) => {
          return (
            <BuildIcon
              score={item.oneScore}
              name={item.displayName}
              key={item.displayName + item.oneSubtitle}
              subtitle={item.oneSubtitle}
              version={this.state.versions[item.displayName]}
              cardContentStyle={this.props.cardContentStyle}
              isEditing={this.state.isEditing}
              callback={this.handleChange.bind(this)}
            />
          );
        })
      : this.state.currentData.map((item, i) => {
          return (
            <BuildIcon
              score={item.fiveScore}
              name={item.displayName}
              key={item.displayName + item.fiveSubtitle}
              subtitle={item.fiveSubtitle}
              version={this.state.versions[item.displayName]}
              cardContentStyle={this.props.cardContentStyle}
              isEditing={this.state.isEditing}
              callback={this.handleChange.bind(this)}
            />
          );
        });
    return display;
  }

<<<<<<< HEAD:client/components/BuildStatus.js
  buildButtons(toggle) {
    return toggle ? (
      <div>
        <ButtonDefault onClick={this.toggle.bind(this)}>
          Last 5 Builds
        </ButtonDefault>
        <ButtonSelected onClick={this.clearTimer.bind(this)}>
          Current Build
        </ButtonSelected>
      </div>
    ) : (
      <div>
        <ButtonSelected onClick={this.clearTimer.bind(this)}>
          Last 5 Builds
        </ButtonSelected>
        <ButtonDefault onClick={this.toggle.bind(this)}>
          Current Build
        </ButtonDefault>
      </div>
    );
  }

  render() {
    return this.state.isLoading ? (
      <StyledCard raised={true}>
        <BoxHeader>Loading Build Health. . .</BoxHeader>
      </StyledCard>
    ) : (
      <StyledCard raised={true}>
        <BoxHeader>Jenkins Build Health</BoxHeader>
        {this.buildButtons(this.state.toggle)}
=======
  render() {
    return this.state.isLoading ? (
      <StyledCard raised={true}>
        <BoxHeader>Loading Build Health. . .</BoxHeader>
      </StyledCard>
    ) : (
      <StyledCard raised={true}>
        <BoxHeader>Jenkins Build Health</BoxHeader>
        {this.state.toggle ? (
          <ButtonDefault onClick={this.toggle}>Last 5 Builds</ButtonDefault>
        ) : (
          <ButtonSelected onClick={this.toggle}>Last 5 Builds</ButtonSelected>
        )}
        {this.state.toggle ? (
          <ButtonSelected onClick={this.toggle}>Current Builds</ButtonSelected>
        ) : (
          <ButtonDefault onClick={this.toggle}>Current Builds</ButtonDefault>
        )}
<<<<<<< HEAD:client/components/BuildStatus.js
<<<<<<< HEAD:client/components/BuildStatus.js
        {/* // <Button
        //   style={
        //     this.state.toggle ? styles.buttonDefault : styles.buttonSelected
        //   }
        //   onClick={this.toggle}
        // >
        //   Last 5 Builds
        // </Button>
        // <Button
        //   style={
        //     this.state.toggle ? styles.buttonSelected : styles.buttonDefault
        //   }
        //   onClick={this.toggle}
        // >
        //   Current Build
        // </Button> */}
>>>>>>> Switching to styled in progress:src/components/BuildStatus.js
=======
>>>>>>> Converted to styled components:src/components/BuildStatus.js
=======
        {this.state.isEditing ? (
          <div>
            <Edit />
            <Save onClick={() => this.save()} />
          </div>
        ) : (
          <div>
            <Edit onClick={() => this.editText()} />
            <Save />
          </div>
        )}
>>>>>>> working editable version numbers/nodejs server:src/components/BuildStatus.js
        <StyledCardContent>{this.getBuildDisplay()}</StyledCardContent>
      </StyledCard>
    );
  }
}

export default BuildStatus;
