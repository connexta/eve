import axios from "axios";
import React from "react";
import Octicon, { GitPullRequest } from "@primer/octicons-react";
import styled from "styled-components";
import { CX_OFF_WHITE, CX_FONT } from "./Constants.js";

const NUMPULLS = 5;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const Box = styled.div`
  width: 100%;
  height: 40%;
  border-radius: 20px;
  padding: 20px;
  background-color: ${CX_OFF_WHITE};

  display: flex;
  flex-direction: column;
  align-items: left;
  flex-wrap: wrap;

  font-size: 0.75em;
  font-family: ${CX_FONT};

  margin-top: 0px;
`;

const PRTitle = styled.span`
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
      data: []
    };
  }

  localizeTime(time) {
    return new Date(time.split("T"));
  }

  render() {
    let prList = [];
    for (var i = 0; i < this.state.data.length; i++) {
      prList.push(
        <div key={i}>
          <Octicon icon={GitPullRequest} size="medium" />
          <PRTitle>
            {this.state.data[i].title}
            <em style={{ color: "#477081" }}>
              {" #" + this.state.data[i].number}
            </em>
          </PRTitle>
          <PRSubline>
            {this.state.data[i].author}
            {" (" + this.state.data[i].timeCreated + ")"}
          </PRSubline>
        </div>
      );
    }

    return (
      <Box>
        <h2>DDF Pull Requests</h2>
        {prList}
      </Box>
    );
  }

  loadUserData(data) {
    console.log("hello");
    console.log(data);
    var pulls = [];
    for (var i = 0; i < data.length && i < NUMPULLS; i++) {
      pulls[i] = {
        author: data[i].user.login,
        number: data[i].number,
        title:
          data[i].title.length > 110
            ? data[i].title.substring(0, 107) + "..."
            : data[i].title,
        timeCreated: parseDate(data[i].created_at)
      };
    }

    this.setState({ data: pulls });
  }

  componentDidMount() {
    this.callGithub();
    setInterval(() => this.callGithub(), 1000 * 10);
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
