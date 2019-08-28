import React from "react";
import styled from "styled-components";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import Github from "../components/Github";
import Calendar from "../components/Calendar/Calendar";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { jenkinsURLList } from "../utils/Link";
import MediaComponent from "../components/MediaComponent";
import EventComponent from "../components/EventComponent";
import {connect} from 'react-redux';
import { addComponents, deleteComponents, updateCurrentWallboard, leaveEdit } from "../actions";
import { CARD_SIDE_MARGINS } from "../styles/styles";
import { TV_GITHUB_HEIGHT } from "../utils/Constants";

const CHANNEL = process.env.SLACK_CHANNEL;
const REPOPATH = "codice/ddf";
/*
You can change the size of any component through the use of styled components.

< Example >
To change height of BuildStatus...

const StyledBuildStatus = styled(BuildStatus)`
  height: 100px;
`

*/

const buildStatusWidth = `calc(100% - ${CARD_SIDE_MARGINS}px)`;
/*Height of Slack Card is size of window beneath banner minus size of github card and margins */
const SlackHeight = `calc(100% - ${TV_GITHUB_HEIGHT}px - 72px - 32px)`; 
const GithubHeight = `${TV_GITHUB_HEIGHT}px`;

class TVWallboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      localComponents: ["BuildStatus", "Media", "Event", "Slack", "Github"],
      SLACKCHANNEL: "",
      GITHUB: "",
      BUILDSTATUS: ""
    }
  }

  async componentDidMount(){
    // console.log("attempting to add components");
    // console.log(this.props.components);
    // this.props.addComponents(this.state.localComponents);
    await this.props.updateCurrentWallboard("TV");
    // console.log("UPDATING SLACK CHANNEL");
    await this.updateContent("SLACKCHANNEL",CHANNEL);
    await this.updateContent("GITHUB",REPOPATH);
    await this.updateContent("BUILDSTATUS",jenkinsURLList);
    // console.log("Done loading");
    this.setState({isLoading: false});
  }

  componentWillUnmount() {
    // this.props.deleteComponents(this.state.localComponents);
    this.props.updateCurrentWallboard("HOME");
    this.props.leaveEdit();
    console.log("unboarding");
  }

  async updateContent(component, defaultData){
    console.log("UPDATING CONTENT");
    let retrieved = false;
    await fetch("/theme?wallboard="+this.props.currentWallboard+"&component="+component, {
        method: "GET",
        headers: { "Content-Type": 'application/json' }
    })
    .then(response=>{
        console.log("RESPONSING response");
        console.log(response)
        return response.json()
    })
    .then(data=>{
        console.log("RESPONSING data");
        console.log("SETTING");
        console.log(data)
        if (data && Object.keys(data).length){
          // this.setState({[component]:data.data})
          this.setState({[component]:data.data});
          retrieved = true;
        }
        console.log("SETTING END hmm");
        
    })
    .catch(err=>{
        console.log(err);
    })

    //if unable to retrieve data from backend, fall back to provided defaultData
    if (!retrieved) {
      console.log("Unable to retrieve");
      this.setState({[component]:defaultData})
    }
  }

  //if the data is an array type (multiple elements), partially update the data
  partialUpdate(content, index, name){
    let temp = this.state[name].slice();
    // console.log("TMEP TEMP");
    // console.log(temp);
    temp[index] = content;
    // console.log(temp);
    // console.log(content);
    this.setState({[name]: temp});
  }


  render() {

    // console.log("SLAC VALUE " + this.state.SLACKCHANNEL)
    // console.log("GIOT VAL " + this.state.GITHUB)
    return (
      this.state.isLoading ?
      <Grid container style={{ height: "100%" }} spacing={0}/>
      :
      <Grid container style={{ height: "100%" }} spacing={0}>
        <LeftBox item>
            <BuildStatus 
              width={buildStatusWidth} 
              isEdit={this.props.isEdit} 
              // content={jenkinsURLList}
              content={this.state.BUILDSTATUS}
              updateContent={(content,index,name) => this.partialUpdate(content,index,name)}
              // updateContent={(content) => {console.log("calling updatecontent"); this.setState({BUILDSTATUS: content})}}
              type={["URL","NAME"]}
              name="BUILDSTATUS"
              dimension={[6,2]}
              />
          <Grid
            container
            direction="row"
            style={{ height: "calc(100% - 260px)" }}
          >
            <MediaComponent />
            <EventComponent />
          </Grid>
        </LeftBox>
        <RightBox item>
          <SlackComponent 
            height={SlackHeight} 
            isEdit={this.props.isEdit}
            content={this.state.SLACKCHANNEL}
            updateContent={(content) => {console.log("calling updatecontent"); this.setState({SLACKCHANNEL: content})}}
            type={["CHANNEL"]}
            name="SLACKCHANNEL"
            dimension={[1,1]}
            />
          <Github 
            height={GithubHeight}
            isEdit={this.props.isEdit}
            content={this.state.GITHUB}
            updateContent={(content) => this.setState({GITHUB: content})}
            // content="codice/ddf"
            type={["REPOPATH"]}
            name="GITHUB"
            dimension={[1,1]}
            // repoPath="codice/ddf"
            // updateContent={() => {}}
            />
        </RightBox>
      </Grid>
    );
  }
}
/*
      SLACKCHANNEL: CHANNEL,
      GITHUB: REPOPATH,
*/

const mapStateToProps = state => ({
  components: state.currentComponents,
  isEdit: state.editMode,
  currentWallboard: state.currentWallboard
  
})

const mapDispatchToProps = {
    addComponents,
    deleteComponents,
    updateCurrentWallboard,
    leaveEdit
}
// const mapDispatchToProps = dispatch => ({
//     addComponents: component => dispatch(addComponents(component)),
//     deleteComponents: component => dispatch(deleteComponents(component)),
//     updateCurrentWallboard: wallboard => dispatch(updateCurrentWallboard(wallboard)),
//     leaveEdit: dispatch(leaveEdit())


//     // toggleEdit: dispatch(toggleEdit)
// })
// function mapDispatchToProps(dispatch) {
//   // return {AddComponents: function() {
//   //   dispatch(AddComponents(ownProps.components))
//   // }
//   return {
//     actions: bindActionCreators(addComponents, dispatch)
//   }
//   // return {
//   //   addComponents
//   // }
// }

export default connect(mapStateToProps, mapDispatchToProps)(TVWallboard);
// export default connect(mapStateToProps)(TVWallboard);
// export default connect()(TVWallboard);
//addComponents

/*

const mapDispatchToProps = {
  enterEdit,
  leaveEdit,
  toggleEdit
}


export default connect(mapStateToProps, mapDispatchToProps)(Setting)

*/