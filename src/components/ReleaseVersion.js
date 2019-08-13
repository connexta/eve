import React from "react";
import { List, ListItem } from "@material-ui/core";
import { BoxStyle, BoxHeader } from "../styles/styles";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";
import makeTrashable from "trashable";

export default class ReleaseVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      versions: [],
      isEditing: false
    };

    this.getVersions();
  }

  async getVersions() {
    this.trashableVersionFetch = makeTrashable(
      fetch("http://localhost:9000", {
        method: "GET"
      })
    );

    await this.trashableVersionFetch
      .catch(err => console.log(err))
      .then(res => {
        if (!res.ok) {
          console.log("Failed to fetch versions data " + call);
          return;
        } else {
          return res.json();
        }
      })
      .then(res => {
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

  editText() {
    this.setState({ isEditing: true });
  }

  async save() {
    this.setState({
      isEditing: false
    });

    this.trashableVersionSave = makeTrashable(
      fetch("http://localhost:9000", {
        method: "POST",
        body: JSON.stringify(this.state.versions),
        headers: { "Content-Type": "application/json" }
      })
    );

    await this.trashableVersionSave
      .catch(err => console.log(err))
      .then(res => res.text())
      .then(res => console.log(res));
  }

  handleChange(evt) {
    let temp = this.state.versions;
    temp[evt.target.name] = evt.target.value;
    this.setState({ versions: temp });
  }

  toggle() {
    if (!this.state.isEditing) this.setState({ toggle: !this.state.toggle });
  }

  editText(num) {
    this.setState({ editing: num });
  }

  componentWillUnmount() {
    if (this.trashableVersionFetch) this.trashableVersionFetch.trash();

    if (this.trashableVersionSave) this.trashableVersionSave.trash();
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
      <BoxStyle>
        <BoxHeader>Testing</BoxHeader>
        {this.state.isEditing ? (
          <div>
            <Edit />
            <Save onClick={() => this.save()} />
          </div>
        ) : (
          <div>
            <Edit onClick={() => this.editText()} />
            <Save />
          </div>
        )}
        <div>
          {this.state.versions.map((item, i) => {
            this.props.isEditing ? (
              <p>
                Version:
                <TextField
                  name={this.props.name.toString()}
                  onChange={this.props.callback}
                  defaultValue={this.props.version}
                  variant="outlined"
                />
              </p>
            ) : (
              <p>Version: {this.props.version}</p>
            );
          })}
        </div>
      </BoxStyle>
    );
  }
}
