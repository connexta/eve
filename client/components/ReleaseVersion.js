import React from "react";
import styled from "styled-components";
import { TextField } from "@material-ui/core";
import {
  BoxStyle,
  BoxHeader,
  FlexRowCardContent,
  FlexRowSubHeading
} from "../styles/styles";
import { Edit, Save } from "@material-ui/icons";
import makeTrashable from "trashable";

const VersionCardContent = styled(FlexRowCardContent)`
  flex-direction: row;
  justify-content: space-around;
`;

const VersionStyledDate = styled(FlexRowSubHeading)`
  margin-left: 0px;
`;

const VersionStyledDateNoField = styled(VersionStyledDate)`
  margin-bottom: 11px;
`;

const StyledTextField = styled(TextField)`
  width: 80px;
  margin-top: 0;
  font-size: 20px;
`;

const IconBox = styled.div`
  float: right;
  margin-top: 8px;
`;

export default class ReleaseVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      versions: {},
      isEditing: false
    };
  }

  // Call server to load version numbers
  async getVersions() {
    this.trashableVersionFetch = makeTrashable(
      fetch("/versions", {
        method: "GET"
      })
    );

    await this.trashableVersionFetch
      .catch(err => console.log(err))
      .then(res => {
        if (!res.ok) {
          console.log("Failed to fetch versions data");
          return;
        } else {
          return res.json();
        }
      })
      .then(res => {
        this.setState({ versions: res });
      });
  }

  // Send version data to server
  async save() {
    this.setState({
      isEditing: false
    });

    this.trashableVersionSave = makeTrashable(
      fetch("/versions", {
        method: "POST",
        body: JSON.stringify(this.state.versions),
        headers: { "Content-Type": "application/json" }
      })
    );

    await this.trashableVersionSave
      .catch(err => console.log(err))
      .then(res => {
        if (!res.ok) {
          console.log("Failed to save versions data");
          return;
        } else {
          return res.text();
        }
      })
      .then(res => console.log("Server response: " + res));
  }

  // Flips state between editing and non editing mode
  toggle() {
    if (!this.state.isEditing) this.setState({ toggle: !this.state.toggle });
  }

  componentDidMount() {
    this.getVersions();
  }

  // Trash any unmet promises
  componentWillUnmount() {
    if (this.trashableVersionFetch) this.trashableVersionFetch.trash();
    if (this.trashableVersionSave) this.trashableVersionSave.trash();
  }

  render() {
    return (
      <BoxStyle raised={true}>
        <BoxHeader>Version Numbers</BoxHeader>
        <IconBox>
          {this.state.isEditing ? (
            <span>
              <Edit />
              <Save onClick={() => this.save()} />
            </span>
          ) : (
            <span>
              <Edit onClick={() => this.setState({ isEditing: true })} />
              <Save />
            </span>
          )}
        </IconBox>
        <VersionCardContent>
          {this.state.versions == null ? (
            <VersionStyledDate>Data failed to load</VersionStyledDate>
          ) : (
            Object.keys(this.state.versions).map((item, i) => {
              return (
                <div key={i}>
                  <div>{item}</div>
                  {this.state.isEditing ? (
                    <VersionStyledDate>
                      Version:
                      <StyledTextField
                        onChange={e => {
                          let temp = this.state.versions;
                          temp[item] = e.target.value;
                          this.setState({ versions: temp });
                        }}
                        defaultValue={this.state.versions[item]}
                        margin="dense"
                      />
                    </VersionStyledDate>
                  ) : (
                    <VersionStyledDateNoField>
                      Version: {this.state.versions[item]}
                    </VersionStyledDateNoField>
                  )}
                </div>
              );
            })
          )}
        </VersionCardContent>
      </BoxStyle>
    );
  }
}
