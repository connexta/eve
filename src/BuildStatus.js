import React from 'react';
import styled from 'styled-components';
import BuildIcon from './BuildIcon';

const BUILD_LIST = ['alliance', 'aus', 'ddf', 'gsr', 'dib'];

const URL = 'https://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/';

const FONT="\"Open Sans\", \"Arial\"";
const Builds = styled.div`
  width: 55vw;
  height: 200px;
  border: solid black 3px;
  border-radius: 20px;
  padding: 20px;
  background-color: #f2f2f2;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  font-size: 2em;
  font-family: ${FONT};
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
    this.setState({ data: [], isLoading: true })
    this.refreshBuildStatus();
    setInterval(() => this.refreshBuildStatus(), 60000);
  }

  refreshBuildStatus() {
      this.updateBuildStatus();
  }

  updateBuildStatus() {
    fetch(URL)
      .then(response => response.json())
      .then(jsonData => {
        this.setState({ data: jsonData, isLoading: false});
      })
      .catch(e => console.log('error', e));
  }

  render() {
    return (
      this.state.isLoading 
      ?
      <Builds>
      Loading. . .
      </Builds>
      :
      <Builds>
        {this.state.data.map((item) => {
          if (BUILD_LIST.includes(item.displayName.toLowerCase())){
            return (<BuildIcon score={item.weatherScore} name={item.displayName} />);
          }
        })}
      </Builds>
      );
  }
}

export default BuildStatus;