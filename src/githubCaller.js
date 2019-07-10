import axios from "axios";
import React from "react";
import Octicon, { GitPullRequest } from "@primer/octicons-react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {
  CX_OFF_WHITE,
  CX_FONT,
  CX_DARK_BLUE,
  CX_GRAY_BLUE
} from "./Constants.js";

const NUMPULLS = 5;
const CALL_FREQ = 1000 * 60 * 60;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// const PRTitle = styledComponents.span`
//   display: inline-block;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   max-width: 90%;
//   vertical-align: bottom;
// `;

// const PRMainLine = styledComponents.span`
//   margin-left: 8px;
//   padding: 0px;
// `;

// // const PRSubline = styledComponents.div`
// //   margin-left: 32px;
// //   margin-bottom: 16px;
// //   padding: 0px;
// //   font-style: italic;
// //   font-size: 0.8em;
// // `;

// const PRSubline = styled("div")({});

const styles = {
  box: {
    backgroundColor: CX_OFF_WHITE,
    fontFamily: CX_FONT,
    height: "40%",
    margin: "12px 12px 12px 12px",
    padding: "12px 12px 12px 24px"
  },
  header: {
    padding: "0px",
    margin: "12px 0px 0px 0px"
  },
  PRTitle: {
    display: "inline-block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "80%",
    verticalAlign: "bottom"
  },
  PRMainLine: {
    margin: "0 0 0 8px",
    padding: "0px",
    fontSize: "0.8em"
  },
  PRSubline: {
    margin: "0 0 16px 32px",
    padding: "0px",
    fontStyle: "italic",
    fontSize: "0.6em"
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

  render() {
    let prList = this.state.data.map((pr, i) => (
      <div key={i}>
        <Octicon icon={GitPullRequest} size="medium" />
        <span style={styles.PRMainLine}>
          <span style={styles.PRTitle}>{pr.title}</span>
          <em style={{ color: CX_GRAY_BLUE }}>{" #" + pr.number}</em>
        </span>
        <div style={styles.PRSubline}>
          {pr.author}
          {" (" + pr.timeCreated + ")"}
        </div>
      </div>
    ));

    return (
      <Card style={styles.box}>
        <h3 style={styles.header}>DDF Pull Requests</h3>
        <CardContent>{prList}</CardContent>
      </Card>
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
    this.interval = setInterval(() => this.callGithub(), CALL_FREQ);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
