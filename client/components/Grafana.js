import React from "react";
import styled from "styled-components";
import { time, hour, minute } from "../utils/TimeUtils";
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
    let url = "/display/?name=" + this.props.name + "?" + Date.now();
    this.state = {
      isLoading: true,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      imageURL: localStorage.getItem(this.props.name)
        ? localStorage.getItem(this.props.name)
        : url
    };
  }

  async componentDidMount() {
    (await this.doesImageExist())
      ? this.setState({ isLoading: false })
      : this.createImage();
    this.timerIntervalID = setInterval(() => this.createImage(), minute);
    this.reloadIntervalID = setInterval(() => location.reload(), hour);
    window.addEventListener("resize", this.throttledHandleWindowResize());
  }

  componentWillUnmount() {
    clearInterval(this.timerIntervalID);
    clearInterval(this.reloadIntervalID);
    window.removeEventListener("resize", this.throttledHandleWindowResize());
  }

  //Check if image URL is functioning and exists; resolves promise received from checkImageExists() to obtain boolean value.
  //return true if localStorage contains cacheed image url & image url functions
  async doesImageExist() {
    let imageExist = false;
    await this.checkImageExist(this.state.imageURL)
      .then(response => {
        imageExist = response;
      })
      .catch(error => {
        console.log("Is Page Ready? ", error);
      });
    return localStorage.getItem(this.props.name) && imageExist;
  }

  //return promise with boolean value with true if url is image.
  async checkImageExist(url) {
    return new Promise(function(resolve, reject) {
      let contentIsImage = false;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          if (xhr.getResponseHeader("Content-Type")) {
            contentIsImage = xhr
              .getResponseHeader("Content-Type")
              .includes("image");
            resolve(contentIsImage);
          } else {
            reject(false);
          }
        }
      };
      xhr.open("HEAD", url, true);
      xhr.send();
    });
  }

  //create grafana dashboard screenshot through NodeJS. Stored the results into localStorage and state.
  async createImage() {
    let setURL =
      "/grafana/?name=" + this.props.name + "&timezone=" + this.getTimezone();
    await fetch(setURL, {
      method: "GET"
    }).catch(err => {
      console.log("Unable to take grafana screenshot ", err);
    });

    let getURL = "/display/?name=" + this.props.name + "?" + Date.now();
    localStorage.setItem(this.props.name, getURL);

    this.setState({
      imageURL: getURL,
      isLoading: !(await this.doesImageExist())
    });
  }

  //get browser's current timezone.
  getTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
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
