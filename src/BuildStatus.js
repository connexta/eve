import React from "react";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "./Constants.js";
import BuildIcon from "./BuildIcon";
import Card from "@material-ui/core/Card";
import { CardHeader, CardContent } from "@material-ui/core";
import { AllianceJenkinLink } from "./lib/Link";
import { extractTime } from "./utilities/utility";

const BUILD_LIST = ["alliance", "ddf", "gsr", "dib"];

const URL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/";

const styles = {
  card: {
    background: CX_OFF_WHITE,
    fontSize: "50px",
    color: BATMAN_GRAY,
    "font-family": CX_FONT
  },
  cardheader: {
    background: CX_OFF_WHITE,
    color: BATMAN_GRAY,
    "font-family": CX_FONT
  },
  cardContent: {
    display: "flex",
    "flex-direction": "row",
    "justify-content": "space-between",
    "flex-wrap": "wrap"
  }
};

class BuildStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      overviewData: [],
      //big dataset wrapped up alliance, etc..
      allianceData: [],
      isLoading: true
    };
  }

  // updates the build status every 60 sec
  componentDidMount() {
    this.refreshBuildStatus();
    this.intervalId = setInterval(() => this.refreshBuildStatus(), 1000 * 10); //NOTICE 60 -> 5
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  refreshBuildStatus() {
    fetch(URL)
      .then(response => response.json())
      .then(jsonData => {
        this.setState({ overviewData: jsonData});
      })
      .catch(e => console.log("error", e));

    fetch(AllianceJenkinLink)
      .then(response => response.json())
      .then(jsonData => {
        this.setState({ allianceData: jsonData});
      })
      .catch(e => console.log("error", e));

      this.compactData();
  }


  getMostrecentRun(){

  }

 compactData() {
    let tempdata = [];
    let index = 0;
    this.state.overviewData.map(item => {
      if (BUILD_LIST.includes(item.displayName.toLowerCase())) {
        tempdata[index] = {
          name: item.displayName,
          weatherScore: item.weatherScore,
          time: ""
        };
        index++;
      }
    })
    
    for (let i = 0; i < tempdata.length; i++){
      tempdata[i].time = "1";
    }


    this.setState({ data: tempdata, isLoading: false });
    console.log(this.state.data);
  }

  render() {
    // if (this.state.allianceData.length > 1 ){
    //   console.log(extractTime(this.state.allianceData[0].startTime));
    // }
    // console.log(this.state.data);
    console.log(this.state.allianceData);

    // console.log(this.state.data);

    return this.state.isLoading ? (
      <Card raised="true" style={styles.card}>
        Loading Build Health. . .
      </Card>
    ) : (
      <Card raised="true" style={styles.card}>
        <CardHeader
          title="Build Health"
          style={styles.cardheader}
          titleTypographyProps={{ variant: "h3" }}
        />
        <CardContent style={styles.cardContent}>
          {this.state.overviewData.map(item => {
            if (BUILD_LIST.includes(item.displayName.toLowerCase())) {
              return (
                <BuildIcon
                  score={item.weatherScore}
                  name={item.displayName}
                  key={item.displayName}
                  time={"11"}
                />
              );
            }
          })}
        </CardContent>
      </Card>
    );
  }
}

export default BuildStatus;
