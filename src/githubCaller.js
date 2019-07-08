import axios from "axios";
import React from "react";
import Octicon, { GitPullRequest } from "@primer/octicons-react";
import styled from "styled-components";
import {
  CX_OFF_WHITE,
  CX_FONT,
  CX_LIGHT_BLUE,
  CX_DARK_BLUE
} from "./Constants.js";

const NUMPULLS = 5;
const CALL_FREQ = 1000 * 60 * 60;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const Box = styled.div`
  width: 93%;
  height: 89%;
  border-radius: 20px;
  padding: 20px;
  background-color: ${CX_OFF_WHITE};

  display: flex;
  flex-direction: column;
  align-items: left;
  flex-wrap: wrap;

  font-size: 0.745em;
  font-family: ${CX_FONT};

  margin: 8px;
`;

const PRTitle = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  vertical-align: bottom;
`;

const PRMainLine = styled.span`
  margin-left: 8px;
  padding: 0px;
`;

const PRSubline = styled.div`
  margin-left: 32px;
  margin-bottom: 16px;
  padding: 0px;
  font-style: italic;
  font-size: 0.8em;
`;

function parseDate(date) {
  var year = date.substring(2, 4);
  var month = date.substring(5, 7);
  var day = date.substring(8, 10);
  return month + "/" + day + "/" + year;
}

export default class Github extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      intervalId: 0
    };
  }

  localizeTime(time) {
    return new Date(time.split("T"));
  }

  render() {
    let prList = this.state.data.map((pr, i) => (
      <div key={i}>
        <Octicon icon={GitPullRequest} size="medium" />
        <PRMainLine>
          <PRTitle>{this.state.data[i].title}</PRTitle>
          <em style={{ color: "#477081" }}>
            {" #" + this.state.data[i].number}
          </em>
        </PRMainLine>
        <PRSubline>
          {this.state.data[i].author}
          {" (" + this.state.data[i].timeCreated + ")"}
        </PRSubline>
      </div>
    ));

    return (
      <div style={{ backgroundColor: CX_DARK_BLUE }}>
        <Box>
          <h2>DDF Pull Requests</h2>
          {prList}
        </Box>
      </div>
    );
  }

  loadUserData(data) {
    var pulls = [];
    for (var i = 0; i < data.length && i < NUMPULLS; i++) {
      pulls[i] = {
        author: data[i].user.login,
        number: data[i].number,
        title: data[i].title,
        timeCreated: parseDate(data[i].created_at)
      };
    }

    this.setState({ data: pulls });
  }

  componentDidMount() {
    this.callGithub();
    this.setState({
      intervalId: setInterval(() => this.callGithub(), CALL_FREQ)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  callGithub() {
    axios
      .get(
        "https://api.github.com/repos/codice/ddf/pulls?client_id=" +
          CLIENT_ID +
          "&client_secret=" +
          CLIENT_SECRET
      )
      .then(res => this.loadUserData(res.data));
  }
}
