import React from "react";
import styled from "styled-components";
import { time, hour } from "../utils/TimeUtils";
import throttle from "lodash.throttle";

const ImgContainer = styled.div`
  padding: 24px;
  width: 10px;
  margin: 0px;
`;

export default class Grafana extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      imageURL: "/display/?name=" + this.props.name + "?" + Date.now()
    };
  }

  async componentDidMount() {
    this.timerIntervalID = setInterval(() => this.updateImage(), hour);
    window.addEventListener("resize", this.throttledHandleWindowResize());
  }

  updateImage() {
    this.setState({
      imageURL: "/display/?name=" + this.props.name + "?" + Date.now()
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerIntervalID);
    window.removeEventListener("resize", this.throttledHandleWindowResize());
  }

  //throttle method to prevent explosive rendering during window resizing.
  throttledHandleWindowResize() {
    return throttle(() => {
      this.setState({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
      });
    }, time({ seconds: 0.2 }));
  }

  render() {
    return (
      <ImgContainer>
        <a href={this.props.url}>
          <img
            src={this.state.imageURL}
            width={this.state.screenWidth * 0.65}
            height={this.state.screenHeight * 0.78}
            alt="Grafana Screenshot"
          />
        </a>
      </ImgContainer>
    );
  }
}
