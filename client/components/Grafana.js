import React from "react";
import styled from "styled-components";
import { time, hour } from "../utils/TimeUtils";
import throttle from "lodash.throttle";
import { DotLoader } from "react-spinners";
import { CX_LIGHT_BLUE } from "../utils/Constants";

const ImgContainer = styled.div`
  padding: 24px;
  width: 10px;
  margin: 0px;
`;

const DotLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
`;

export default class Grafana extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      imageURL: "/grafana?" + Date.now()
    };
  }

  componentDidMount() {
    this.getScreenshot();
    this.timerIntervalID = setInterval(() => this.getScreenshot(), hour); //1 hour interval
    window.addEventListener("resize", this.throttledHandleWindowResize());
  }

  componentWillUnmount() {
    clearInterval(this.timerIntervalID);
    window.removeEventListener("resize", this.throttledHandleWindowResize());
    if (this.trashableGetScreenshot) this.trashableGetScreenshot.trash();
  }

  //obtain Grafana screenshot through NodeJS to /grafana
  async getScreenshot() {
    const url = "/grafana/?url=" + this.props.url;
    await fetch(url, {
      method: "GET"
    }).catch(err => {
      console.log("Unable to fetch grafana screenshot ", err);
    });

    this.setState({ isLoading: false, imageURL: url + "?" + Date.now() });
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
    return this.state.isLoading ? (
      <DotLoaderContainer>
        <DotLoader color={CX_LIGHT_BLUE} loading={this.state.isLoading} />
      </DotLoaderContainer>
    ) : (
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
