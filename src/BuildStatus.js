import React from "react";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "./Constants.js";
import BuildIcon from "./BuildIcon";
import Card from "@material-ui/core/Card";
import { CardHeader, CardContent } from "@material-ui/core";
import {
  overviewURL,
  AllianceURL,
  DDFURL,
  DIBURL,
  GSRURL,
  AFURL
} from "./lib/Link";
import { getRelativeTime } from "./utilities/utility";

const BUILD_LIST = ["alliance", "ddf", "gsr", "dib"];

const URL_LIST = [AllianceURL, DDFURL, GSRURL, DIBURL, AFURL];

const oneHour = 1000 * 60 * 60;

const styles = {
  card: {
    background: CX_OFF_WHITE,
    fontSize: "50px",
    color: BATMAN_GRAY,
    fontFamily: CX_FONT
  },
  cardheader: {
    background: CX_OFF_WHITE,
    color: BATMAN_GRAY,
    fontFamily: CX_FONT
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  }
};

class BuildStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true
    };
  }

  // updates the build status every 1 hour
  componentDidMount() {
    this.refreshBuildStatus();
    this.intervalId = setInterval(() => this.refreshBuildStatus(), oneHour);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  //a function that continuously be called by each set interval in componentDidMount() to fetch/update each team status for display
  //overallData: temporary array to collect each team status before pushing to setState: data
  //index: to keep track of each team status in the array overallData.
  //update data for displayName, weatherScore, last build time.
  async refreshBuildStatus() {
    let overallData = [];
    let index = 0;

    //fetch/update overview data for each team (except AF) for displayName and weatherScore
    let promise = this.fetchData(overviewURL);
    await promise
      .then(values => {
        values.map(item => {
          if (BUILD_LIST.includes(item.displayName.toLowerCase())) {
            overallData, (index = this.updateData(item, overallData, index));
          }
        });
      })
      .catch(e => console.log("error", e));

    //fetch/update overview data for AF team for displayName and weatherScore
    promise = this.fetchData(AFURL);
    await promise
      .then(item => {
        overallData, (index = this.updateData(item, overallData, index));
      })
      .catch(e => console.log("error", e));

    //fetch/update last time build status for each team
    let promises = [];
    for (let i = 0; i < URL_LIST.length; i++) {
      promises.push(this.fetchData(URL_LIST[i]));
    }
    await Promise.all(promises)
      .then(values => {
        for (let i = 0; i < values.length; i++) {
          overallData[i].time =
            "Last: " + getRelativeTime(new Date(values[i].latestRun.startTime));
        }
      })
      .catch(e => console.log("error", e));

    //push all collected data to data state, and make it ready to display.
    this.setState({ data: overallData, isLoading: false });
  }

  //fetch data from the jenkin url
  fetchData(URL) {
    return fetch(URL)
      .then(response => response.json())
      .catch(e => console.log("error", e));
  }

  //Fix AF repo build name to "AF"
  //@return:
  //  if name is AF specific repo name, convert to "AF" instead for easy display
  //  otherwise, display its original name.
  fixARName(displayName) {
    return displayName === "SOAESB_Nightly_Release_Builder"
      ? "AF"
      : displayName;
  }

  //@param:
  //  item: that contains information for array overallData to be updated
  //  overallData: array to pass down to keep each build information such as displayName
  //  index: used to assign for each build information in the array
  //@return:
  //  overallData & index: to be passed down for next functions
  updateData(item, overallData, index) {
    overallData[index] = {
      displayName: this.fixARName(item.displayName),
      weatherScore: item.weatherScore,
      time: ""
    };
    index++;
    return overallData, index;
  }

  render() {
    return this.state.isLoading ? (
      <Card raised={true} style={styles.card}>
        Loading Build Health. . .
      </Card>
    ) : (
      <Card raised={true} style={styles.card}>
        <CardHeader
          title="Build Health"
          style={styles.cardheader}
          disableTypography={true} //disable to properly apply CX_FONT
        />
        <CardContent style={styles.cardContent}>
          {this.state.data.map(item => {
            return (
              <BuildIcon
                score={item.weatherScore}
                name={item.displayName}
                key={item.displayName}
                time={item.time}
              />
            );
          })}
        </CardContent>
      </Card>
    );
  }
}

export default BuildStatus;
