import React from "react";
import styled from "styled-components";
import {
  CX_DARK_BLUE,
  CX_GRAY_BLUE,
  CX_FONT,
  CX_OFF_WHITE,
  BANNER_HEIGHT
} from "./utils/Constants";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { wallboards } from "./wallboards/Home";
import NullWallboard from "./wallboards/NullWallboard";
import Setting from "./components/Settings/Setting";
import Banner from "./components/Banner";
import Grid from "@material-ui/core/Grid";

import { StylesProvider } from "@material-ui/styles";
import {connect} from 'react-redux';
import { addComponents, updateCurrentWallboard } from "./actions";

const RootGrid = styled(Grid)`
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  font-family: ${CX_FONT};
  background: ${CX_GRAY_BLUE};
`;


const BottomGrid = styled(Grid)`
  background: ${CX_GRAY_BLUE};
  width: 100%;
  position: absolute;
  top: ${BANNER_HEIGHT}px;
  bottom: 0;
  /* height: ""; */
`;


const StyledDevMsg = styled.div`
  color: ${CX_OFF_WHITE};
  font-size: 20px;
  position: absolute;
  bottom: 0;
  margin-left: 24px;
`;

const StyledSettings = styled.div`
  bottom:0;
  right:0;
  margin-right: 10px;
  margin-bottom: 10px;
  position: absolute;
`;


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isLoading: true,
            BANNER: CX_DARK_BLUE
        }
    }


    async componentDidMount(){
        console.log("attempting to add components");
        console.log(this.props.components);
        this.props.addComponents(["App"]);
        await this.updateContent("BANNER",CX_DARK_BLUE);
        console.log("Done loading");
        this.setState({isLoading: false});
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
            if (data){
              this.setState({[component]:data.data})
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


    render(){
        return (
          this.state.isLoading ?
          <div/>
          :
            <StylesProvider injectFirst>
            <Router>
              <RootGrid container>
                <Banner 
                  isEdit={this.props.isEdit}
                  content={this.state.BANNER}
                  updateContent={(content) => {console.log("calling updatecontent"); this.setState({BANNER: content})}}
                  type="COLOR"
                  name="BANNER"
                  />
                <BottomGrid item>
                  <Switch>
                    {wallboards.map(wallboard => {
                      return <Route {...wallboard} exact />;
                    })}
                    <Route component={NullWallboard} />
                  </Switch>
                  <StyledDevMsg>
                    <p>Work in Progress, contact @vina, @matt or join #wallboard-dev</p>
                  </StyledDevMsg>
                  <StyledSettings>
                    <Setting/>
                  </StyledSettings>
                </BottomGrid>
              </RootGrid>
            </Router>
          </StylesProvider>
        );
    }
}
const mapStateToProps = state => ({
    components: state.currentComponents,
    isEdit: state.editMode,
    currentWallboard: state.currentWallboard
  })
  
  // const mapDispatchToProps = dispatch => ({
  //     addComponents: component => dispatch(addComponents(component))
  // })

  const mapDispatchToProps = {
    addComponents,
    updateCurrentWallboard,
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

/*
            height={SlackHeight} 
            isEdit={this.props.isEdit}
            content={this.state.SLACKCHANNEL}
            updateContent={(content) => {console.log("calling updatecontent"); this.setState({SLACKCHANNEL: content})}}
            type="CHANNEL"
            name="SLACKCHANNEL"
            */