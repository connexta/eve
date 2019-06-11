import React from 'react';
import styled from 'styled-components';
import BuildIcon from './BuildIcon';
import sun from '../resources/sun.png';
import cloud from '../resources/sun_cloud.png';
import storm from '../resources/thunder.png';

const BASE_URL = 'https://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/';

const Box = styled.div`
    width: 50vw;
    height: 30vh;
    background-color: #f2f2f2;
    border-radius: 5%;
    border: solid black 3px;

`

const Builds = styled.div`

`

class BuildStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
    }
  }

  // updates the build status every 60 sec
  componentDidMount() {
    this.refreshBuildStatus();
    setInterval(() => this.refreshBuildStatus(), 60000);
  }

  refreshBuildStatus() {
      this.setState({ data: [], isLoading: true });
      this.updateBuildStatus();
  }

  updateBuildStatus() {
    fetch(BASE_URL)
      .then(response => response.json())
      .then(jsonData => {
        this.setState({ data: jsonData, isLoading: false});
      })
      .catch(e => console.log('error', e));
  }

  logWeather() {
    console.log("Clicked");
    console.log("Weather: " + this.state.data[0].weatherScore);
    console.log("Name: " + this.state.data[0].displayName);
  }

  render() {
    return (
      this.state.isLoading 
      ?
      <Box>
      Loading. . .
      </Box>
      :
      <div>
        {this.state.data.map((item, index) => {
          console.log("status: " + item.weatherScore);
          return (<div key={index}>{item.displayName}: <BuildIcon name={item.displayName} score={item.weatherScore}/>  </div>);
        })}
      </div>
      );
  }
}

export default BuildStatus;