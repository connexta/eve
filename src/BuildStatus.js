import React from 'react';
import styled from 'styled-components'

const Box = styled.div`
    width: 50vw;
    height: 30vh;
    background-color: #f2f2f2;
    border-radius: 5%;
    border: solid black 3px;

    align-content: center;
    &:hover
`


class BuildStatus extends React.Component {
  render() {
    return (
      <Box><div>This is the build status: Everything is broke :(</div></Box>
    );
  }
}

export default BuildStatus;