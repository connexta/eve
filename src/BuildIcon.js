import React from "react";
import styled from "styled-components";
import sun from "../resources/sun.png";
import cloud from "../resources/sun_cloud.png";
import storm from "../resources/thunder.png";

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const IconStyle = styled.div`
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background-color: black;
  margin-left: 15px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

class BuildIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      score: props.score
    };
  }

  render() {
    return this.state.score == 100 ? (
      <IconContainer>
        {this.state.name}
        <IconStyle>
          <img src={sun} alt="sun" height="50px" />
        </IconStyle>
      </IconContainer>
    ) : this.state.score > 50 ? (
      <IconContainer>
        {this.state.name}
        <IconStyle>
          <img src={cloud} alt="cloud" height="50px" />
        </IconStyle>
      </IconContainer>
    ) : (
      <IconContainer>
        {this.state.name}
        <IconStyle>
          <img src={storm} alt="storm" height="50px" />
        </IconStyle>
      </IconContainer>
    );
  }
}

export default BuildIcon;
