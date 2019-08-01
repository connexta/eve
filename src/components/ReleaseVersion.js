import React from "react";
import { Card, List, ListItem } from "@material-ui/core";
import { LEFT_BOX_STYLE, BOX_STYLE, BOX_HEADER } from "../styles/styles";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";

export default class ReleaseVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: -1,
      versions: {}
    };

    this.getVersions();
  }

  async getVersions() {
    fetch("http://localhost:9000", {
      method: "GET"
    })
      .then(res => {
        if (!res.ok) {
          console.log("Failed to fetch versions data " + call);
          return;
        } else {
          return res.json();
        }
      })
      .then(res => {
        console.log(res);
        this.setState({ versions: res });
      });
  }

  async save(num) {
    let val = this.refs.newText.value;

    let temp = this.state.versions;
    temp[num] = val;

    this.setState({
      versions: temp,
      editing: -1
    });

    fetch("http://localhost:9000", {
      method: "POST",
      body: JSON.stringify(temp),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
  }

  editText(num) {
    this.setState({ editing: num });
  }

  render() {
    let versions = [0, 1, 2];

    versions = versions.map(v => {
      if (this.state.editing === v)
        return (
          <ListItem key={v}>
            <textarea ref="newText" />
            <Edit />
            <Save onClick={() => this.save(v)} />
          </ListItem>
        );
      else
        return (
          <ListItem key={v}>
            <span>Version {this.state.versions[v]}</span>
            <Edit onClick={() => this.editText(v)} />
            <Save />
          </ListItem>
        );
    });

    return (
      <Card style={{ ...LEFT_BOX_STYLE, ...BOX_STYLE }}>
        <div style={BOX_HEADER}>Testing</div>
        <List>{versions}</List>
      </Card>
    );
  }
}
