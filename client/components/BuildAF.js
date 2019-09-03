import React from "react";
import styled from "styled-components";
import { BATMAN_GRAY } from "../utils/Constants.js";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { hour, parseTimeString } from "../utils/TimeUtils.js";
import { BoxHeader } from "../styles/styles";
import makeTrashable from "trashable";
import componentHOC from "./Settings/componentHOC";
import GoodState from "@material-ui/icons/CheckCircleOutline";
import BadState from "@material-ui/icons/HighlightOff";

const StyledHeader = styled(BoxHeader)`
  cursor: pointer;
`;

const SubHeader = styled.div`
  margin: 0px;
  font-size: 20px;
`;

const StyleListItemIcon = styled(ListItemIcon)`
  font-size: 40px;
`;

const ListItemTextDots = styled(ListItemText)`
  color: ${BATMAN_GRAY};
  text-align: center;
`;

const Subline = styled.div`
  color: ${BATMAN_GRAY};
  font-size: 20px;
  font-style: italic;
`;

class BuildAF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      failedData: []
    };
  }

  // updates the build status around every midnight with timer checking current hour every 1 hour.
  componentDidMount() {
    this.updateBuildStatus();
    this.timerIntervalID = setInterval(() => this.timer(), hour); //1 hour interval
  }

  componentWillUnmount() {
    clearInterval(this.timerIntervalID);
    this.trashableFetchPromise.trash();
  }

  //if and only if the current time is 0 hour (midnight), trigger to update build status.
  timer() {
    let today = new Date();
    let currentHour = today.getHours();
    if (currentHour === 0) {
      this.updateBuildStatus();
    }
  }

  //fetch
  async updateBuildStatus() {
    this.trashableFetchPromise = makeTrashable(
      fetch(this.props.content[0].URL + "runs/")
    );

    await this.trashableFetchPromise
      .then(response => response.json())
      .then(jsonData => {
        this.setState({
          isLoading: false,
          failedData: this.getFailedData(jsonData)
        });
      })
      .catch(e => console.log("error", e));
  }

  //obtain all failed build in Jenkins up to the last successful build,
  //including the last successful build.
  getFailedData(jsonData) {
    let failedData = [];
    for (let i = 0; i < jsonData.length; i++) {
      failedData.push(jsonData[i]);
      if (jsonData[i].result == "SUCCESS") {
        break;
      }
    }
    return failedData;
  }

  //@param:
  //  causes: name for the userID value pair in JSON format
  //@return:
  //  return builder if specified, else "timer"
  //  If causes is not defined at all, then return "unknown causes beyond our control"
  formatCauses(causes) {
    if (causes) {
      return causes[0].userId ? causes[0].userId : "timer";
    }
    return "unknown causes beyond our control";
  }

  //@return:
  //  unicode dots to represent trimmed data
  displayDots() {
    return (
      <ListItem>
        <ListItemTextDots
          primary={"\u22EE"} //\u22EE: Vertical Ellipsis to represent trimmed data
          primaryTypographyProps={{ variant: "h5" }}
        />
      </ListItem>
    );
  }


  displayItems(data, index){
    const description = data.description
    ? data.description
    : "build title not provided";
    
    return (
      <>
      <StyleListItemIcon>
      {data.result === "SUCCESS" ? (
        <GoodState
          fontSize={"inherit"}
          style={{
            color: "green",
            padding: "1 0",
            float: "left",
            transform: "scale(0.9)"
          }}
        />
      ) : (
        <BadState
          fontSize={"inherit"}
          style={{
            color: "red",
            padding: "1 0",
            float: "left",
            transform: "scale(0.9)"
          }}
        />
      )}
    </StyleListItemIcon>
    <div>
      {description}
      <Subline>
        {parseTimeString(data.startTime) +
          " Triggered by " +
          this.formatCauses(data.causes)}
      </Subline>
    </div>
    </>
    )
  }

  //@return:
  //  display list of build contents (builder [data.causes], build start time, build result, build description)
  displayListContents(data, index) {
    return (
      this.props.edit ?
      <ListItem
        disableGutters={true}
        key={index}
      >
        {this.displayItems(data, index)}
      </ListItem>
      :
      <ListItem
        disableGutters={true}
        key={index}
        button
        component="a"
        href={this.props.content[0].LINK + data.id}
      >
        {this.displayItems(data, index)}
      </ListItem>
    );
  }

  //return bullet format of failed Data and its content for display
  //if failed data has been trimmed for too many data, it will show ... for trimmed off data.
  //which will results in showing few most recent failed builds + ... + few most oldest failed builds
  //@param
  //  maxNum : total number of builds to show
  //  latestShowNum : number of most recent failed builds to show
  //@return
  //  first, returns builds number equal to latestShowNum
  //  second, if total number of failed data is larger than maxNum to show, returns ... (displaydots function) to represent trimmed data
  //  third, if there are more remaining data to show, return the remaining data.
  //  If there are no failed data to show at all, returns no builds detected string
  getListContents(maxNum, latestShowNum) {
    const { failedData } = this.state;
    if (failedData.length > 0) {
      return (
        <List>
          {failedData
            .slice(0, latestShowNum)
            .map((data, index) => this.displayListContents(data, index))}

          {failedData.length > maxNum ? this.displayDots() : undefined}

          {failedData.length > maxNum
            ? failedData
                .slice(failedData.length - (maxNum - latestShowNum))
                .map((data, index) => this.displayListContents(data, index))
            : failedData
                .slice(latestShowNum)
                .map((data, index) => this.displayListContents(data, index))}
        </List>
      );
    } else {
      return (
        <List>
          <ListItem>
            <ListItemText
              primary={"No Builds Detected"}
              primaryTypographyProps={{ variant: "h5" }}
            ></ListItemText>
          </ListItem>
        </List>
      );
    }
  }

  render() {
    return this.state.isLoading ? (
      <span>Loading AF Builds. . .</span>
    ) : (
      <span>
        <StyledHeader onClick={() => this.props.edit ? undefined : window.open(this.props.content[0].LINK)}>
          {this.props.content[0].NAME}
          <SubHeader>
            Display failed build from most recent up to the last successful
            build
          </SubHeader>
        </StyledHeader>
        {this.getListContents(4, 2)}
      </span>
    );
  }
}

const WrappedComponent = componentHOC(BuildAF);
export default WrappedComponent;
