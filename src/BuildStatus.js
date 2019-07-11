import React from "react";
import { CX_OFF_WHITE, CX_FONT, BATMAN_GRAY } from "./Constants.js";
import BuildIcon from "./BuildIcon";
import Card from "@material-ui/core/Card";
import { CardHeader, CardContent } from "@material-ui/core";
import { AllianceURL, DDFURL, DIBURL, GSRURL, AFURL } from "./lib/Link";
import { extractTime } from "./utilities/utility";

const BUILD_LIST = ["alliance", "ddf", "gsr", "dib"];

const URL_LIST = [AllianceURL, DDFURL, GSRURL, DIBURL, AFURL];

const overviewURL =
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


  findAndUpdateData(values, overallData, index){
    values.map(item => {
      if (BUILD_LIST.includes(item.displayName.toLowerCase())){
        overallData[index] = {
          displayName: item.displayName,
          weatherScore: item.weatherScore,
          time: ""
        }
        index++;
      }
    })
    return overallData, index;
  }

  updateData(item, overallData, index){
    overallData[index] = {
      displayName: item.displayName,
      weatherScore: item.weatherScore,
      time: ""
    }
    index++;
    return overallData, index;
  }
  
  async refreshBuildStatus() {
    let overallData = [];
    let index = 0;

    let promise = this.fetchData(overviewURL);
    await promise.then((values)=>{
      values.map(item => {
        if (BUILD_LIST.includes(item.displayName.toLowerCase())){
          overallData, index = this.updateData(item, overallData, index);
        }
      })
    });

    promise = this.fetchData(AFURL);
    await promise.then((item)=>{
      overallData, index = this.updateData(item, overallData, index);
    })

    //fetch initial data such as displayName, weatherScore
    let promises = [];
    for (let i = 0; i < URL_LIST.length; i++){
      promises.push(this.fetchData(URL_LIST[i]));

    }
    await Promise.all(promises)
      .then((values) => {
        for (let i = 0; i < values.length; i++){
          overallData[i].time = extractTime(values[i].latestRun.startTime);
        }
      });
      this.setState({ data: overallData, isLoading: false });
  }


  //NOTICE: error testing.. catch added.
  //fetch data from the jenkin url
  fetchData(URL){
    return fetch(URL).then(response=>response.json()).catch(e=>console.log("error", e));
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
          titleTypographyProps={{ variant: "h3" }}
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
            })
          }
        </CardContent>
      </Card>
    );
  }
}

export default BuildStatus;
