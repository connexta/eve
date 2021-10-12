import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import {
  O_GUNMETAL,
  O_SMOKE,
  BANNER_HEIGHT
} from "../../utils/Constants";
import { BoxStyle } from "../../styles/styles";
import {
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
  TextField
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { DefaultData } from "../../utils/DefaultData";
import { Save, Cancel } from "@material-ui/icons";
import { time } from "../../utils/TimeUtils";
import ColorPicker from "./ColorPicker";
import Dropdown from "./Dropdown";
import { userName, userID } from "../GraphApi/GraphConfig";

const componentHOC = WrappedComponent => {
  const ComponentWrapper = styled(BoxStyle)`
    width: ${props => (props.style ? props.style.width : undefined)};
    height: ${props => (props.style ? props.style.height : undefined)};
    margin: ${props => (props.style ? props.style.margin : undefined)};
    position: relative;
    transition: outline 0.6s linear;
    -webkit-transition: outline 0.6s linear;
    cursor: ${props => props.edit && props.outline && css`pointer`};
    outline: ${props =>
      props.edit && props.outline
        ? css`6px solid ${O_GUNMETAL}`
        : css`0px solid`};
  `;

  const BannerWrapper = styled.div`
    background: ${props => props.content};
    height: ${BANNER_HEIGHT}px;
    width: 100%;
    margin: 0px;
    padding: 0px 40px 0 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    transition: box-shadow 0.6s linear;
    -webkit-transition: box-shadow 0.6s linear;
    cursor: ${props => props.edit && css`pointer`};
    box-shadow: ${props =>
      props.edit ? css`0px 10px 10px ${O_SMOKE}` : css`0px 0px 0px`};
    z-index: 1;
    position: relative;
  `;

  const SaveFabWrapper = styled(Save)`
    margin-right: 8px;
  `;

  const CancelFabWrapper = styled(Cancel)`
    margin-right: 8px;
  `;

  class HOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false, //for first Dialog (user input)
        resultsOpen: false, //for Second Dialog (Success/Failure Results)
        key: Date.now(), //to reload the component once the changes has been applied
        metSaveRequirement: false, //to validate input entry
        isLoading: true, //for waiting initial data fetch
        editable: true, //for verifying if the component can be editable
        edit: this.props.disable ? false : this.props.edit, //edit state
        default: this.props.default || DefaultData[this.props.name], //default data
        dropDownSelectedName: [], //for maintaining the subsequent list from first selection.
        dropDownSelectedNameSecond: [] //for maintaining the subsequent list from second selection (dropDownSelectedName).
      };
    }

    async componentDidMount() {
      await this.initialUpdateContent(this.props.name, this.state.default);
      await this.initialFetchJenkinslist();
      await this.initialEditableCheck();
      this.setState({ isLoading: false });
    }

    componentDidUpdate(prevProps) {
      if (this.props.edit !== prevProps.edit) {
        this.setState({ edit: this.props.disable ? false : this.props.edit });
      }
    }

    //initially check if the component is editable.
    //Two criterias: check if disable prop exists, and check if user is Admin in case of AdminOnly props
    async initialEditableCheck() {
      let editable =
        !this.props.disable && (await this.checkAdmin(this.props.AdminOnly));
      this.setState({ editable: editable });
    }

    async checkAdmin(AdminOnly) {
      let isAdmin = false;
      if (AdminOnly) {
        await fetch("/checkadmin?name=" + userName, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
          .then(response => {
            return response.json();
          })
          .then(data => {
            if (data && Object.keys(data).length) {
              isAdmin = data.result;
            }
          })
          .catch(err => {
            console.log("Unable to verify admin role from backend ", err);
          });
      } else {
        isAdmin = true;
      }
      return isAdmin;
    }

    //initially update the content of all components from backend data.
    //if not available, set it to defaultData
    async initialUpdateContent(component, defaultData) {
      let retrieved = false;
      await fetch(
        "/theme?wallboard=" +
          this.props.currentWallboard +
          "&component=" +
          component +
          "&id=" +
          userID,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      )
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data && Object.keys(data).length) {
            this.setState({ content: data.data });
            retrieved = true;
          }
        })
        .catch(err => {
          console.log("Unable to retrieve data from backend ", err);
        });

      //if unable to retrieve data from backend, fall back to provided defaultData
      if (!retrieved) {
        this.setState({ content: defaultData });
      }
    }

    //initially obtain jenkins list for BuildStatus.
    async initialFetchJenkinslist() {
      let jenkinsList = await fetch("/jenkinslist")
        .then(response => response.json())
        .catch(err => {
          console.log("Unable to retrieve jenkins data from backend ", err);
        });
      this.setState({ jenkinsList: jenkinsList });
    }

    //Update the newly changed data to backend based on if the input format is single (i.e. string) or multiple input.
    //isArray is true if input is expected to be multiple
    updateContent(content, index, isArray) {
      if (isArray) {
        this.partialUpdate(content, index);
      } else {
        this.setState({ content: content });
      }
    }

    //if the data is an array type (multiple elements), partially update the data
    partialUpdate(content, index) {
      this.setState({
        content: this.insertElementIntoArray(this.state.content, content, index)
      });
    }

    //handle color change in child component ColorPicker
    handleColorChange(color) {
      this.setState({ COLOR: color.hex });
    }

    //handle channel change in child component Dropdown
    handleChannelChange(channelID) {
      this.setState({ CHANNEL: channelID.id });
    }

    //handle initial dropdown selection for jenkins in child component Dropdown
    //Update the first entry, dropDownSelectedName; and removed second entry, dropDownSelectedNameSecond to clear it out.
    handleJenkinsFirstChange(selectedName, index) {
      this.setState({
        dropDownSelectedName: this.insertElementIntoArray(
          this.state.dropDownSelectedName,
          selectedName,
          index
        ),
        dropDownSelectedNameSecond: this.insertElementIntoArray(
          this.state.dropDownSelectedNameSecond,
          undefined,
          index
        ),
        URL: [],
        NAME: [],
        LINK: []
      });
    }

    //handle subsequent dropdown selection for jenkins in child component Dropdown
    //Update the second entry only if it is not the last Dropdown selection
    handleJenkinsDataChange(data, index, last) {
      last
        ? undefined
        : this.setState({
            dropDownSelectedNameSecond: this.insertElementIntoArray(
              this.state.dropDownSelectedNameSecond,
              data,
              index
            )
          });

      this.setState({
        URL: this.insertElementIntoArray(this.state.URL, data.url, index),
        NAME: this.insertElementIntoArray(
          this.state.NAME,
          this.state.dropDownSelectedName[index].name,
          index
        ),
        LINK: this.insertElementIntoArray(this.state.LINK, data.link, index)
      });
    }

    //update channel list for dropdown. Remove any archived channel.
    updateChannelList(channelList) {
      this.setState({
        channelList: channelList.filter(channelData => !channelData.is_archived)
      });
    }

    //check if text is valid based on its type.
    metRequirement(type, text) {
      if (text === undefined) return false;
      switch (type) {
        case "REPOPATH":
          return this.githubRequirement(text);
        case "TYPE_NOT_PROVIDED":
          return false;
        default:
          return true;
      }
    }

    //matches to repo path
    //i.e. repo/path
    githubRequirement(text) {
      let regexp = /^[\w-_\.]+\/[\w-_\.]+$/;
      return regexp.test(text);
    }

    handleClick() {
      this.setState({ open: true });
    }

    //close the dialog and clear out the textfields
    handleClose() {
      this.setState({
        open: false,
        dropDownSelectedName: [],
        dropDownSelectedNameSecond: []
      });
    }

    //insert element into array[index]
    insertElementIntoArray(array, element, index) {
      let tmp = array ? array.slice() : [];
      tmp[index] = element;
      return tmp;
    }

    //if it's Banner, always Post it to HOME since Getting Banner data always come from HOME
    bannerPost(isBanner) {
      let curWallboard = isBanner ? "HOME" : this.props.currentWallboard;
      return (
        "/theme?wallboard=" +
        curWallboard +
        "&component=" +
        this.props.name +
        "&id=" +
        userID
      );
    }

    //post the data to the backend. If it's Banner, call bannerPost to select HOME wallboard.
    postData() {
      let dataToUpdate = this.state.content;
      fetch(this.bannerPost(this.props.name === "Banner"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataToUpdate })
      });
    }

    //handle saving the contents to the state and to the backend
    //saving method differs whether the data is a string or an array (checked by isArray)
    //index loops around the data
    //jndex loops around the input type
    async handleMultipleSave(e, row, column) {
      let metOneRequirement = false;
      let isArray = !(row == 1 && column == 1);
      for (let index = 0; index < row; index++) {
        let metSaveRequirement = true;

        // check if valid response has been inputted: requires all the fields to be filled for the row
        for (let jndex = 0; jndex < column; jndex++) {
          let inputData =
            isArray && this.state[this.props.type[jndex]]
              ? this.state[this.props.type[jndex]][index]
              : this.state[this.props.type[jndex]];
          metSaveRequirement =
            metSaveRequirement &&
            this.metRequirement(this.props.type[jndex], inputData);
        }
        if (metSaveRequirement) {
          let sendData;
          for (let jndex = 0; jndex < column; jndex++) {
            let inputName = this.props.type[jndex];
            let inputData =
              isArray && this.state[this.props.type[jndex]]
                ? this.state[this.props.type[jndex]][index]
                : this.state[this.props.type[jndex]];
            sendData = isArray
              ? { ...sendData, ...{ [inputName]: inputData } }
              : inputData;
          }

          await this.updateContent(sendData, index, isArray);
          this.postData();
          metOneRequirement = true;
          this.setState({
            key: Date.now()
          });
        }
      }
      this.setState({
        metSaveRequirement: metOneRequirement, //if at least one requirement has met.
        resultsOpen: true
      });
    }

    displaySaveFab(row, column) {
      return (
        <Button onClick={e => this.handleMultipleSave(e, row, column)}>
          <SaveFabWrapper />
          Save
        </Button>
      );
    }

    displayCancelFab() {
      return (
        <Button onClick={this.handleClose.bind(this)}>
          <CancelFabWrapper />
          Close
        </Button>
      );
    }

    //display input selection based on the type
    displaySelectionByType(type, index) {
      switch (type) {
        case "COLOR":
          return (
            <ColorPicker
              handleColorChange={this.handleColorChange.bind(this)}
            />
          );
        case "CHANNEL":
          return (
            <Dropdown
              type="CHANNEL"
              list={this.state.channelList}
              handleChange={this.handleChannelChange.bind(this)}
            />
          );
        //URL is splited into at most three dropdowns. First for initial selection of projects, Second and Third for corresponding branches from the first selection
        //Third Dropdown appears only if the Second Dropdown selection shows that it has additional branch.
        case "URL":
          return (
            <>
              <Dropdown
                type="MAINURL"
                index={index}
                list={this.state.jenkinsList}
                handleChange={this.handleJenkinsFirstChange.bind(this)}
              />
              <Dropdown
                type="SUBURL"
                index={index}
                list={
                  this.state.dropDownSelectedName[index]
                    ? this.state.dropDownSelectedName[index].branch
                    : undefined
                }
                handleChange={this.handleJenkinsDataChange.bind(this)}
              />
              <Dropdown
                type="LASTURL"
                index={index}
                list={
                  this.state.dropDownSelectedNameSecond[index]
                    ? this.state.dropDownSelectedNameSecond[index].branch
                    : undefined
                }
                handleChange={this.handleJenkinsDataChange.bind(this)}
              />
            </>
          );
        case "NAME":
          return (
            <TextField
              name={type + index}
              value={
                this.state.dropDownSelectedName &&
                this.state.dropDownSelectedName[index]
                  ? this.state.dropDownSelectedName[index].name
                  : ""
              }
              onChange={e => {
                this.setState({
                  [type]: this.insertElementIntoArray(
                    this.state[type],
                    e.target.value,
                    index
                  ),
                  dropDownSelectedName: this.insertElementIntoArray(
                    this.state.dropDownSelectedName,
                    {
                      ...this.state.dropDownSelectedName[index],
                      name: e.target.value
                    },
                    index
                  )
                });
              }}
            />
          );
        default:
          return (
            <TextField
              name={type + index}
              onChange={e => {
                this.setState({
                  [type]: this.insertElementIntoArray(
                    this.state[type],
                    e.target.value,
                    index
                  )
                });
              }}
            />
          );
      }
    }

    getMultipleCells(row, column, typeArray) {
      let tables = [];
      for (let index = 0; index < row; index++) {
        let columnCells = [];
        for (let jndex = 0; jndex < column; jndex++) {
          columnCells.push(
            <React.Fragment key={index.toString() + jndex.toString()}>
              <TableCell>
                {row > 1 ? typeArray[jndex] + index : typeArray[jndex]}
              </TableCell>
              <TableCell>
                {this.displaySelectionByType(typeArray[jndex], index)}
              </TableCell>
            </React.Fragment>
          );
        }
        tables.push(<TableRow key={index}>{columnCells}</TableRow>);
      }
      return tables;
    }

    settingTableMultiple(row, column, typeArray) {
      return (
        <Table>
          <TableBody>{this.getMultipleCells(row, column, typeArray)}</TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>{this.displaySaveFab(row, column)}</TableCell>
              <TableCell>{this.displayCancelFab()}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
    }

    //second Dialog which appears once the user saved the input.
    displaySaveResults() {
      let message = this.state.metSaveRequirement
        ? "Successfully updated the component."
        : "Failed: Please provide correct input.";
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({ resultsOpen: false });
      }, time({ seconds: 2 }));
      return (
        <Dialog
          onClose={() => {
            this.setState({ resultsOpen: false });
          }}
          aria-labelledby="saveResults"
          open={this.state.resultsOpen}
        >
          <DialogTitle>{message}</DialogTitle>
        </Dialog>
      );
    }

    //first Dialog which appears once the user select the component to edit.
    displayDialog() {
      let typeArray = this.props.type ? this.props.type : ["TYPE_NOT_PROVIDED"];
      let row = this.props.row ? this.props.row : 1;
      let column = typeArray.length;
      return (
        <Dialog
          onClose={this.handleClose.bind(this)}
          aria-labelledby="edit"
          open={this.state.open}
          maxWidth={false}
        >
          <DialogTitle>Editing a Component</DialogTitle>
          {this.settingTableMultiple(row, column, typeArray)}
        </Dialog>
      );
    }

    displayComponent() {
      let edit = this.state.edit && this.state.editable;
      return (
        <ComponentWrapper
          style={this.props.style}
          edit={edit ? "true" : undefined}
          onClick={edit ? this.handleClick.bind(this) : undefined}
          key={this.state.key}
          raised={true}
          outline={!this.props.disableEffect ? "true" : undefined}
        >
          <WrappedComponent
            {...this.props}
            edit={edit}
            content={this.state.content}
            updateChannelList={this.updateChannelList.bind(this)}
          />
        </ComponentWrapper>
      );
    }

    displayBanner() {
      let edit = this.state.edit;
      return (
        <BannerWrapper
          edit={edit ? "true" : undefined}
          content={this.state.content}
          onClick={edit ? this.handleClick.bind(this) : undefined}
          key={this.state.key}
        >
          <WrappedComponent {...this.props} />
        </BannerWrapper>
      );
    }

    render() {
      return this.state.isLoading ? (
        <></>
      ) : (
        <>
          {this.props.name === "Banner"
            ? this.displayBanner()
            : this.displayComponent()}
          {!this.props.disablePopup ? this.displayDialog() : undefined}
          {this.state.resultsOpen ? this.displaySaveResults() : undefined}
        </>
      );
    }
  }

  const mapStateToProps = state => ({
    edit: state.edit,
    currentWallboard: state.currentWallboard
  });

  return connect(mapStateToProps)(HOC);
};

export default componentHOC;
