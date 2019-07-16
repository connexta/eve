import React from "react";
import Octicon, { GitPullRequest } from "@primer/octicons-react";
import { Card, CardContent } from "@material-ui/core";
import { CX_GRAY_BLUE } from "./Constants.js";
import { BOX_STYLE } from "./index";

const NUMPULLS = 5;
const CALL_FREQ = 1000 * 60 * 60;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CARD_HEIGHT = (window.innerHeight - 124) / 2 - 18;

const styles = {
  box: {
    height: CARD_HEIGHT
  },
  header: {
    margin: "12px 0px 0px 12px",
    fontSize: "50px"
  },
  PRMainLine: {
    margin: "0 0 0 8px",
    padding: "0px",
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
    margin: "0 0 0px 32px",
    padding: "0px",
    fontStyle: "italic",
    fontSize: "20px"
  }
};

function parseDate(date) {
  var year = date.substring(2, 4);
  var month = date.substring(5, 7);
  var day = date.substring(8, 10);
  return month + "/" + day + "/" + year;
}

export default class Github extends React.Component {
  constructor(props) {
    super(props);
    this.interval = 0;
    this.state = {
      data: []
    };
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
    this.interval = setInterval(() => this.callGithub(), CALL_FREQ);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  callGithub() {
    fetch(
      "https://api.github.com/repos/codice/ddf/pulls?client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET
    )
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
    let prList = this.state.data.map((pr, i) => (
      <div style={{ height: "60px" }} key={i}>
        <Octicon icon={GitPullRequest} size="medium" />
        <span style={styles.PRMainLine}>
          <span style={styles.PRTitle}>{pr.title}</span>
          <em style={{ color: CX_GRAY_BLUE, verticalAlign: "bottom" }}>
            {" #" + pr.number}
          </em>
        </span>
        <div style={styles.PRSubline}>
          {pr.author}
          {" (" + pr.timeCreated + ")"}
        </div>
      </div>
    ));

    return (
      <Card style={{ ...styles.box, ...BOX_STYLE }} raised={true}>
        <p style={styles.header}>DDF Pull Requests</p>
        <CardContent>{prList}</CardContent>
      </Card>
    );
  }
}
