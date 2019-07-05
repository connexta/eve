import axios from "axios";
import React from "react";
import Octicon, { GitPullRequest } from "@primer/octicons-react";
import styled from "styled-components";
import { CX_OFF_WHITE, CX_FONT } from "./Constants.js";

const NUMPULLS = 5;
const TOKEN = process.env.GITHUB_TOKEN;

const Box = styled.div`
  width: 660px;
  height: 472px;
  border-radius: 20px;
  padding: 20px;
  background-color: ${CX_OFF_WHITE};

  display: flex;
  flex-direction: column;
  align-items: left;
  flex-wrap: wrap;

  font-size: 0.75em;
  font-family: ${CX_FONT};
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

  componentDidMount() {
    this.callGithub();
    setInterval(() => this.callGithub(), 1000 * 10);
  }

  callGithub() {
    console.log("Fetching Github Data");
    const header = "Authorization: token " + TOKEN;
    axios
      .get("https://api.github.com/repos/connexta/ddf/pulls", {
        headers: { header }
      })
      .then(res => {
        var pulls = [];
        for (var i = 0; i < res.data.length && i < NUMPULLS; i++) {
          pulls[i] = {
            author: res.data[i].user.login,
            number: res.data[i].number,
            title:
              res.data[i].title.length > 45
                ? res.data[i].title.substring(0, 42) + "..."
                : res.data[i].title,
            timeCreated: parseDate(res.data[i].created_at)
          };
        }

        this.setState({ data: pulls });
      });
  }
}
