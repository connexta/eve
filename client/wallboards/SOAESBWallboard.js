import React from "react";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import BuildAF from "../components/BuildAF";
import Grafana from "../components/Grafana";
import { SOAESB_GRAFANA_URL } from "../utils/Link";
import {connect} from 'react-redux';
import { AFJenkinLink, AFURL, AFpipeline } from "../utils/Link.js";
import { updateCurrentWallboard, leaveEdit } from "../actions";

const buildAFList = [AFJenkinLink, AFURL, AFpipeline];

class SOAESBWallboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      BUILDAF: "" 
    }
  }

  async componentDidMount(){
    console.log("attempting to add components");
    await this.props.updateCurrentWallboard("SOAESB");
    await this.updateContent("BUILDAF",buildAFList);
    console.log("Done loading");
    this.setState({isLoading: false});
  }

  componentWillUnmount() {
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

  
  render() {
    return (
      this.state.isLoading ?
      <Grid container style={{ height: "100%" }}/>
      :
      <Grid container style={{ height: "100%" }}>
        <LeftBox item>
          <Grafana name={"SOAESB"} url={SOAESB_GRAFANA_URL} />
        </LeftBox>
        <RightBox item>
          <BuildAF 
            isEdit={this.props.isEdit}
            content={this.state.BUILDAF}
            updateContent={(content) => this.setState({BUILDAF: content})}
            type="URL"
            name="BUILDAF"
            num="1"
          />
        </RightBox>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  isEdit: state.editMode,
  currentWallboard: state.currentWallboard
})

const mapDispatchToProps = {
  updateCurrentWallboard,
  leaveEdit
}

export default connect(mapStateToProps, mapDispatchToProps)(SOAESBWallboard);