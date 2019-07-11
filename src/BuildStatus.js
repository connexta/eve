import React from "react";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "./Constants.js";
import BuildIcon from "./BuildIcon";
import Card from "@material-ui/core/Card";
import { CardHeader, CardContent } from "@material-ui/core";
import { AllianceURL, DDFURL, DIBURL, GSRURL, AFURL } from "./lib/Link";
import { extractTime } from "./utilities/utility";

const BUILD_LIST = ["alliance", "ddf", "gsr", "dib", "haart jobs"];

const URL_LIST = [AllianceURL, DDFURL, DIBURL, GSRURL, AFURL];

const URL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/";

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
      fetchedData: [],
      //big dataset wrapped up alliance, etc..
      teamData: [],
      isLoading: true
    };
  }

  // updates the build status every 60 sec
  componentDidMount() {
    this.refreshBuildStatus();
    this.intervalId = setInterval(() => this.refreshBuildStatus(), 1000 * 10); //NOTICE 60 -> 5   //set to 1 hour or 12 hours..?
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  refreshBuildStatus() {
    let overallData = [];
    //fetch initial data such as displayName, weatherScore
    this.fetchData(URL);
    overallData = this.setDataInitialInfo();

    // fetch most recent build time for each team repo
    for (let i = 0; i < URL_LIST.length; i++){
      this.fetchData(URL_LIST[i]);
      this.setDataTimeInfo();
    }


    // fetch(URL)
    //   .then(response => response.json())
    //   .then(jsonData => {
    //     this.setState({ overviewData: jsonData});
    //   })
    //   .catch(e => console.log("error", e));

    // fetch(AllianceURL)
    //   .then(response => response.json())
    //   .then(jsonData => {
    //     this.setState({ teamData: jsonData});
    //   })
    //   .catch(e => console.log("error", e));

      // this.compactData();

  }

  //fetch data from jenkin url
  async fetchData(URL){
    await fetch(URL)
      .then(response => response.json())
      .then(jsonData => {
        this.setState({ fetchedData: jsonData});
        // console.log("inside");
        // console.log(jsonData);
      })
      .catch(e => console.log("error", e));

  }

  getMostrecentRun(){

  }

  //set data info such as displayName, weatherScore, time (placeholder for now)
  setDataInitialInfo(){
    let tempdata = [];
    let index = 0;
    if (this.state.fetchedData.length > 0){
      this.state.fetchedData.map(item => {
        if (BUILD_LIST.includes(item.displayName.toLowerCase())) {
          tempdata[index] = {
            displayName: item.displayName,
            weatherScore: item.weatherScore,
            time: ""
          };
          index++;
        }
      })
    }

    console.log(tempdata);
    return tempdata;
    // this.setState({ data: tempdata });

  }

  setDataTimeInfo(overallData){
    // for (let i = 0; i < overallData.length; i++){
    //   // if (overallData.displayName === ){

    //   // }
    // }
  }


//isLoading: false
 compactData() {
    let tempdata = [];
    let index = 0;
    this.state.overviewData.map(item => {
      if (BUILD_LIST.includes(item.displayName.toLowerCase())) {
        tempdata[index] = {
          displayName: item.displayName,
          weatherScore: item.weatherScore,
          time: ""
        };
        index++;
      }
    })
    
    for (let i = 0; i < tempdata.length; i++){
      tempdata[i].time = extractTime(this.state.teamData[0].startTime);
    }


    this.setState({ data: tempdata, isLoading: false });
    console.log(this.state.data);
  }

  render() {
    // if (this.state.allianceData.length > 1 ){
    //   console.log(extractTime(this.state.allianceData[0].startTime));
    // }
    // console.log(this.state.data);
    // console.log(this.state.allianceData);

    // console.log(this.state.data);

    return this.state.isLoading ? (
      <Card raised={true} style={styles.card}>
        Loading Build Health. . .
      </Card>
    ) : (
      <Card raised={true} style={styles.card}>
        <CardHeader
          title="Build Health"
          style={styles.cardheader}
          titleTypographyProps={{ variant: "h3" }}
        />
        <CardContent style={styles.cardContent}>
          {this.state.data.map(item => {
            // if (BUILD_LIST.includes(item.displayName.toLowerCase())) {
              return (
                <BuildIcon
                  score={item.weatherScore}
                  name={item.displayName}
                  key={item.displayName}
                  time={item.time}
                />
              );
            })
          // })
          }
        </CardContent>
      </Card>
    );
  }
}

export default BuildStatus;
