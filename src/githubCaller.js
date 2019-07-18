import React from "react";
import { Card } from "@material-ui/core";
import { CX_GRAY_BLUE } from "./Constants.js";
import { BOX_STYLE, BOX_HEADER } from "./styles";
import pullRequest from "../resources/pullRequest.png";
import { getRelativeTime, hour } from "./utilities/TimeUtils";
import makeTrashable from "trashable";

const NUMPULLS = 5;
const CALL_FREQ = hour;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const GITHUB_HEIGHT = 360;

const styles = {
  box: {
    height: GITHUB_HEIGHT
  },
  cardContent: {
    margin: "12px 0 0 12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "84%"
  },
  header: {
    margin: "12px 0px 0px 12px"
  },
  icon: {
    height: "22px",
    verticalAlign: "top"
  },
  mainAndSubline: {
    display: "inline-block",
    width: "90%"
  },
  PRMainLine: {
    margin: "0 0 0 8px",
    fontSize: "20px"
  },
  PRTitle: {
    display: "inline-block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "80%",
    verticalAlign: "bottom"
  },
  PRSubline: {
    margin: "0 0 0px 8px",
    padding: "0px",
    fontStyle: "italic",
    fontSize: "20px"
  }
};

export default class Github extends React.Component {
  constructor(props) {
    super(props);
    this.interval = 0;
    this.state = {
      prs: [],
      repoPath: this.props.repoPath,
      name: null
    };

    this.getRepoName();
  }

  loadUserData(data) {
    var pulls = [];
    for (let i = 0; i < data.length && i < NUMPULLS; i++) {
      pulls[i] = {
        author: data[i].user.login,
        number: data[i].number,
        title: data[i].title,
        timeCreated: getRelativeTime(new Date(data[i].created_at))
      };
    }

    this.setState({ prs: pulls });
  }

  componentDidMount() {
    this.callGithub();
    this.interval = setInterval(() => this.callGithub(), CALL_FREQ);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    //clearing out left out promise during unmount.
    if (this.trashableRequestGithub) this.trashableRequestGithub.trash();
  }

  getRepoName() {
    fetch(
      "https://api.github.com/repos/" +
        this.state.repoPath +
        "?client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET
    )
      .then(res => {
        if (!res.ok) {
          console.log(
            res.status +
              ": " +
              res.statusText +
              " (Failed to fetch GitHub Data)"
          );
          return;
        } else {
          return res.json();
        }
      })
      .then(res => {
        this.setState({ name: res.name.toUpperCase() });
      });
  }

  async callGithub() {
    this.trashableRequestGithub = makeTrashable(
      fetch(
        "https://api.github.com/repos/" +
          this.state.repoPath +
          "/pulls?client_id=" +
          CLIENT_ID +
          "&client_secret=" +
          CLIENT_SECRET
      )
    );

    await this.trashableRequestGithub
      .then(res => {
        if (!res.ok) {
          console.log("Failed to fetch GitHub data");
          return;
        } else {
          return res.json();
        }
      })
      .then(res => this.loadUserData(res));
  }

  render() {
    let prList = this.state.prs.map((pr, i) => (
      <div key={i} style={{ marginBottom: "12px" }}>
        <img style={styles.icon} src={pullRequest}></img>
        <div style={styles.mainAndSubline}>
          <span style={styles.PRMainLine}>
            <span style={styles.PRTitle}>{pr.title}</span>
            <em style={{ color: CX_GRAY_BLUE, verticalAlign: "bottom" }}>
              {" #" + pr.number}
            </em>
          </span>
          <div style={styles.PRSubline}>
            {pr.timeCreated} by {pr.author}
          </div>
        </div>
      </div>
    ));

    return (
      <Card style={{ ...styles.box, ...BOX_STYLE }} raised={true}>
        <p style={BOX_HEADER}>{this.state.name} Pull Requests</p>
        <div style={styles.cardContent}>{prList}</div>
      </Card>
    );
  }
}
