import React from "react";
import styled from "styled-components";
import { Card, List, ListItem, ListItemIcon } from "@material-ui/core";
import { CX_GRAY_BLUE } from "../utils/Constants.js";
import { BOX_STYLE, BOX_HEADER, BOX_HEADER_SIZE } from "../styles/styles";
import pullRequest from "../../resources/pullRequest.png";
import { getRelativeTime, hour, time } from "../utils/TimeUtils";
import makeTrashable from "trashable";
import pullRequestGray from "../../resources/pullRequestgray.png";

import NeutralState from "@material-ui/icons/remove";
import BadState from "@material-ui/icons/clear";
import GoodState from "@material-ui/icons/done";

const SIDENAV_WIDTH = 40;
export const GITHUB_HEIGHT = 360;

const MAXPULLS = 5; // Max number of pull requests to display
const NUM_STATUSES = 3; // Max number of statuses to display for each PR
const REQ_APPROVALS = 2; // Required number of approvals for a given PR
const CALL_FREQ = hour; // Frequency to refresh GitHub data
const ROTATE_FREQ = time({ seconds: 10 }); // Frequency to rotate displayed PR

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const GithubCard = styled(Card)`
  height: ${GITHUB_HEIGHT}px;
`;

const Header = styled.div`
  width: 100%;
`;
const CardContent = styled.div`
  margin: 12px 0 0 12px;
  height: calc(100% - ${BOX_HEADER_SIZE}px);
  width: calc(100% - ${SIDENAV_WIDTH}px - 100px);
  float: left;
`;

const Icon = styled.img`
  height: 20px;
  float: left;
  margin: 1px 4px 0 0;
`;

const MainAndSubline = styled.div`
  display: inline-block;
`;

const PRMainLine = styled.span`
  display: inline-block;
`;

const PRTitle = styled.span`
  display: inline-block;
`;

const PRNumber = styled.em`
  color: ${CX_GRAY_BLUE};
  vertical-align: "bottom";
`;

const PRSubline = styled.div`
  font-style: italic;
`;

const HighlightNav = styled.div`
  border-style: none solid none none;
  border-width: 1px;
  padding-right: 4px;
`;

const UnhighlightNav = styled.div`
  color: ${CX_GRAY_BLUE};
  padding-right: 4px;
`;

const NavBar = styled.div`
  width: ${SIDENAV_WIDTH}px;
  height: calc(100% - ${BOX_HEADER_SIZE}px);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 16px;
  float: left;
`;

// Appends s to word if value is not 1
function addS(val) {
  return val == 1 ? "" : "s";
}

// Returns either GoodState or NeutralState depending on num approvals
function Approvals(props) {
  return props.approvals >= REQ_APPROVALS ? <GoodState /> : <NeutralState />;
}

// SideNav used to display number of PRs and navigate between them
function SideNav(props) {
  var navs = [];
  for (let i = 0; i < props.numPulls; i++) {
    let next =
      i == props.displayIndex ? (
        <HighlightNav
          key={i}
          onClick={() => {
            props.callback(i);
          }}
        >
          <Icon src={pullRequest}></Icon>
          {i + 1}
        </HighlightNav>
      ) : (
        <UnhighlightNav
          key={i}
          onClick={() => {
            props.callback(i);
          }}
        >
          <Icon src={pullRequestGray}></Icon>
          {i + 1}
        </UnhighlightNav>
      );
    navs.push(next);
  }
  return <NavBar>{navs}</NavBar>;
}

// Displays statuses below PR header
function Statuses(props) {
  let statuses = [];
  let max =
    props.statuses.length > NUM_STATUSES
      ? NUM_STATUSES - 1
      : props.statuses.length;
  for (let i = 0; i < max; i++) {
    let icon = <NeutralState />;
    if (
      props.statuses[i].state == "failure" ||
      props.statuses[i].state == "error"
    )
      icon = <BadState />;
    else if (props.statuses[i].state == "success") icon = <GoodState />;

    statuses.push(
      <ListItem key={i}>
        <ListItemIcon key={i}>{icon}</ListItemIcon>
        {props.statuses[i].context}: {props.statuses[i].description}
      </ListItem>
    );
  }
  if (statuses.length > NUM_STATUSES)
    statuses.push(
      <ListItem key={NUM_STATUSES}>
        + {props.statuses.length - (NUM_STATUSES - 1)} more statuses
      </ListItem>
    );
  return statuses;
}

export default class Github extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prs: [],
      name: null,
      displayIndex: 0,
      numPulls: MAXPULLS
    };

    this.getRepoName();
  }

  // Function to make class to GitHub API, trashable used to protect against broken promises
  async fetchGithub(call) {
    this.trashableRequestGithub = makeTrashable(fetch(call));

    return await this.trashableRequestGithub
      .then(res => {
        if (!res.ok) {
          console.log("Failed to fetch GitHub data: " + call);
          return;
        } else {
          return res.json();
        }
      })
      .then(res => {
        return res;
      });
  }

  // Finds and sets name of repo
  async getRepoName() {
    let call =
      "https://api.github.com/repos/" +
      this.props.repoPath +
      "?client_secret=" +
      CLIENT_SECRET +
      "&client_id=" +
      CLIENT_ID;
    let name = (await this.fetchGithub(call)).name.toUpperCase();
    this.setState({ name: name });
  }

  // Gets review data for a given PR and returns num of approvals
  async getReviews(prNum) {
    let call =
      "https://api.github.com/repos/" +
      this.props.repoPath +
      "/pulls/" +
      prNum +
      "/reviews";
    let reviews = await this.fetchGithub(call);
    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
      if (reviews[i].state == "APPROVED") sum++;
    }
    return sum;
  }

  // Gets status data for a given PR and returns latest status for each given context
  async getStatuses(url) {
    let statuses = await this.fetchGithub(url);
    statuses = statuses.map(st => {
      return {
        description: st.description,
        context: st.context,
        state: st.state
      };
    });

    let unique = {};

    statuses.forEach(function(i) {
      if (!unique[i.context]) {
        unique[i.context] = i;
      }
    });

    return Object.values(unique);
  }

  // Calls GitHub to fetch PR, status, and review data & stores in this.state.pulls
  async loadUserData() {
    let call = "https://api.github.com/repos/" + this.props.repoPath + "/pulls";
    let data = await this.fetchGithub(call);

    var pulls = [];
    this.setState({
      numPulls: data.length >= MAXPULLS ? MAXPULLS : data.length
    });

    for (let i = 0; i < this.state.numPulls; i++) {
      let approvals = await this.getReviews(data[i].number);
      let statuses = await this.getStatuses(data[i].statuses_url);

      pulls[i] = {
        author: data[i].user.login,
        number: data[i].number,
        title: data[i].title,
        timeCreated: getRelativeTime(new Date(data[i].created_at)),
        url: data[i].html_url,
        approvals: approvals,
        statuses: statuses
      };
    }

    this.setState({ prs: pulls });
  }

  // Increments which PR to display
  rotatePR() {
    this.setState({
      displayIndex:
        this.state.displayIndex == this.state.numPulls - 1
          ? 0
          : this.state.displayIndex + 1
    });
  }

  // Manually changes which PR to display, resets timer
  switchPR(i) {
    this.setState({ displayIndex: i });
    clearInterval(this.rotateInterval);
    this.rotateInterval = setInterval(() => this.rotatePR(), ROTATE_FREQ);
  }

  // Gets user data and sets timer for refreshing data and rotating displayed PR
  componentDidMount() {
    this.loadUserData();
    this.interval = setInterval(() => this.loadUserData(), CALL_FREQ);
    this.rotateInterval = setInterval(() => this.rotatePR(), ROTATE_FREQ);
  }

  // Clears interval and destroys remaining promises when component unmounted
  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.rotateInterval);
    if (this.trashableRequestGithub) this.trashableRequestGithub.trash();
  }

  render() {
    if (this.state.prs.length == 0)
      return (
        <GithubCard style={BOX_STYLE} raised={true}>
          <p style={BOX_HEADER}>{this.state.name} Pull Requests</p>
          <CardContent>No pull requests</CardContent>
        </GithubCard>
      );
    else {
      let pr = this.state.prs[this.state.displayIndex];
      return (
        <GithubCard style={BOX_STYLE} raised={true}>
          <Header style={BOX_HEADER}>{this.state.name} Pull Requests</Header>
          <SideNav
            displayIndex={this.state.displayIndex}
            numPulls={this.state.numPulls}
            callback={this.switchPR.bind(this)}
          />
          <CardContent onClick={() => window.open(pr.url)}>
            <MainAndSubline>
              <PRMainLine>
                <PRTitle>
                  <PRNumber>{" #" + pr.number}</PRNumber> {pr.title}
                </PRTitle>
              </PRMainLine>
              <PRSubline>
                Created {pr.timeCreated} by {pr.author}
              </PRSubline>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Approvals approvals={pr.approvals} />
                  </ListItemIcon>
                  {pr.approvals} approval
                  {addS(pr.approvals)}
                </ListItem>
                <Statuses statuses={pr.statuses} />
              </List>
            </MainAndSubline>
          </CardContent>
        </GithubCard>
      );
    }
  }
}
