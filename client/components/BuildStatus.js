import React from "react";
import styled, {css} from "styled-components";
import { CX_DARK_BLUE } from "../utils/Constants";
import BuildIcon from "./BuildIcon";
import { CardContent } from "@material-ui/core";
import { BoxStyle, BoxHeader, CARD_SIDE_MARGINS } from "../styles/styles";
import makeTrashable from "trashable";
import { hour, getRelativeTime, time } from "../utils/TimeUtils";
import Button from "@material-ui/core/Button";
import editHOC from "./Settings/editHOC";

const TOGGLE_INTERVAL = time({ seconds: 10 });

// const 

//make function? take boolean.
// const StyledCard = styled(BoxStyle)`
const StyledCard = styled.div`
  /* width: calc(100% - ${CARD_SIDE_MARGINS}px); */
  
  /* -webkit-transition: border-width 0.1s;
  transition: border 0.1s ease-in-out;
  box-shadow: 0 0 5px rgba(81, 203, 238, 1); */


  /* ${({ editMode }) => ``} */
  /* border: ${props => props.isedit === "true" && css`10px solid ${CX_DARK_BLUE}`}; */
  
  /* ${props => props.show && css`10px solid red`} */
  /* border: ${props => 
    props.editMode ? "10px solid ${CX_DARK_BLUE}" : "10px solid red"
  }; */
  /* color: "red"; */
`;

// if listvert is not true, it will list the items horizontally,
// otherwise it will list them vertically
const getListStyle = listvert => {
  if (!listvert) {
    return " \
  display: flex; \
  flex-direction: row; \
  justify-content: space-between; \
  flex-wrap: wrap; \
    ";
  } else return ``;
};

// wrap CardContent, omitting listvert prop
const CardWrapper = props => {
  const { listvert, ...rest } = props;
  return <CardContent {...rest} />;
};

const StyledCardContent = styled(CardWrapper)`
  ${props => {
    return getListStyle(props.listvert);
  }};

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

class BuildStatus extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      currentData: [],
      isLoading: true,
      toggle: true
    };
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
  }

  //a function that continuously be called by each set interval in componentDidMount() to fetch/update each team status for display
  //overallData: temporary array to collect each team status before pushing to setState: data
  //update data for displayName, score, last build time.
  async refreshBuildStatus() {
    let overallData = [];
    this.trashableRequestList = [];
    for (let index in this.props.content) {
      this.trashableRequestList.push(
        makeTrashable(this.fetchData(Object.values(this.props.content[index])))
      );
    }
    //fetch and update jenkins information for all team
    await Promise.all(this.trashableRequestList)
      .then(linklist => {
        for (let index = 0; index < linklist.length; index++) {
          this.updateData(
            linklist[index],
            overallData,
            Object.keys(this.props.content[index]),
            index
          );
        }
      })
      .catch(e => console.log("error", e));
    //push all collected data to data state, and make it ready to display.
    this.setState({ currentData: overallData, isLoading: false });
  }

  toggle() {
    this.setState({ toggle: !this.state.toggle });
    clearInterval(this.toggleId);
    this.toggleId = setInterval(() => this.toggle(), TOGGLE_INTERVAL);
  }

  clearTimer() {
    clearInterval(this.toggleId);
    this.toggleId = setInterval(() => this.toggle(), TOGGLE_INTERVAL);
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
    if (item){
      overallData[index] = {
        displayName: name,
        oneScore: item.latestRun.result === "SUCCESS" ? 100 : 0,
        fiveScore: item.weatherScore,
        oneSubtitle: getRelativeTime(new Date(item.latestRun.startTime)),
        fiveSubtitle: this.getFiveSubtitle(item)
      };
    }
    else {
      overallData[index] = {
        displayName: "INVALID",
        oneScore: 0,
        fiveScore: 0,
        oneSubtitle: "",
        fiveSubtitle: "INVALID"
      };
    }

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
      ? this.state.currentData.map((item,index) => {
          return (
            <BuildIcon
              score={item.oneScore}
              name={item.displayName}
              key={Date.now() + index + item.displayName + item.oneSubtitle}
              subtitle={item.oneSubtitle}
            />
          );
        })
      : this.state.currentData.map((item,index) => {
          return (
            <BuildIcon
              score={item.fiveScore}
              name={item.displayName}
              key={Date.now() + index + item.displayName + item.fiveSubtitle}
              subtitle={item.fiveSubtitle}
            />
          );
        });
    return display;
  }

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

  showContent(){
    return (this.state.isLoading ? (
      <span>
        <BoxHeader>Loading Build Health. . .</BoxHeader>
      </span>
    ) : (
      <span>
        <BoxHeader>Jenkins Build Health</BoxHeader>
        {this.buildButtons(this.state.toggle)}
        <StyledCardContent listvert={this.props.listvert}>
          {this.getBuildDisplay()}
        </StyledCardContent>
      </span>
    ));
  }

  // editModeToggle(){
  //   return (this.props.isEdit ? (
  //     <Clickable>
  //       <StyledCard isedit={this.props.isEdit.toString()} raised={true} onClick={this.handleClick}>
  //           {this.showContent()}
  //       </StyledCard>
  //     </Clickable>
  //   ) : (

  //   ))
  // }

  render() {
    // console.log(this.props.isEdit);
    // const { isEdit, ...rest } = props;
    return (
      // <StyledCard isedit={this.props.isEdit.toString()} raised={true}>
      // <StyledCard isedit={this.props.isEdit.toString()} raised={true}>
        this.showContent()
      // </StyledCard>
    )
    // return this.editModeToggle();
  }
}

const WrappedComponent = editHOC(BuildStatus);
export default WrappedComponent;
