import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import {
  CX_DARK_BLUE,
  BATMAN_GRAY,
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

const componentHOC = WrappedComponent => {
  const ComponentWrapper = styled(BoxStyle)`
    width: ${props => props.style ? props.style.width : undefined};
    height: ${props => props.style ? props.style.height : undefined};
    margin: ${props => props.style ? props.style.margin : undefined};
    position: relative;
    transition: outline 0.6s linear;
    -webkit-transition: outline 0.6s linear;
    cursor: ${props => props.edit && props.outline && css`pointer`};
    outline: ${props =>
      props.edit && props.outline ? css`10px solid ${CX_DARK_BLUE}` : css`0px solid`};
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
      props.edit ? css`0px 10px 10px ${BATMAN_GRAY}` : css`0px 0px 0px`};
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
        key: Date.now(),
        metSaveRequirement: false,
        isLoading: true,
        edit: this.props.disable ? false : this.props.edit,
        default: this.props.default || DefaultData[this.props.name]
      };
    }

    async componentDidMount() {
      await this.initialUpdateContent(
        this.props.name,
        this.state.default
      );
      this.setState({ isLoading: false });
    }

    componentDidUpdate(prevProps) {
      if (this.props.edit !== prevProps.edit) {
        this.setState({ edit: this.props.disable ? false : this.props.edit });
      }
    }

    async initialUpdateContent(component, defaultData) {
      let retrieved = false;
      await fetch(
        "/theme?wallboard=" +
          this.props.currentWallboard +
          "&component=" +
          component,
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

    updateContent(content, index, isArray) {
      if (isArray) {
        this.partialUpdate(content, index);
      } else {
        this.setState({ content: content });
      }
    }

    //if the data is an array type (multiple elements), partially update the data
    partialUpdate(content, index) {
      let temp = this.state.content.slice();
      temp[index] = content;
      this.setState({ content: temp });
    }

    //check if text is valid based on its type.
    metRequirement(type, text) {
      if (text === undefined) return false;
      switch (type) {
        case "CHANNEL":
          return this.slackRequirement(text);
        case "REPOPATH":
          return this.githubRequirement(text);
        case "COLOR":
          return this.colorRequirement(text);
        case "TYPE_NOT_PROVIDED":
          return false;
        default:
          return true;
      }
    }

    //matches to slack channel
    //i.e. ABC123DEF
    slackRequirement(text) {
      let regexp = /^[A-Z0-9]{9}$/;
      return regexp.test(text);
    }

    //matches to repo path
    //i.e. repo/path
    githubRequirement(text) {
      let regexp = /^[\w-_\.]+\/[\w-_\.]+$/;
      return regexp.test(text);
    }

    //matches to color
    //i.e. #AAA123
    colorRequirement(text) {
      let regexp = /^#\w{6}$/;
      return regexp.test(text);
    }

    handleClick() {
      this.setState({ open: true });
    }

    handleClose() {
      this.setState({ open: false });
    }

    //if it's Banner, always Post it to HOME since Getting Banner data always come from HOME
    bannerPost(isBanner){
        let curWallboard = isBanner ? "HOME" : this.props.currentWallboard;
        return "/theme?wallboard=" + curWallboard + "&component=" + this.props.name;
    }

    postData() {
      let dataToUpdate = this.state.content;
      fetch(this.bannerPost(this.props.name === "Banner"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataToUpdate })
      });
    }

    //handle saving the contents to the state and to the backend
    //saving method differs whether the data is a string or an array (checked by isArray)
    async handleMultipleSave(e, row, column) {
      let metOneRequirement = false;
      let isArray = !(row == 1 && column == 1);
      for (let index = 0; index < row; index++) {
        let metSaveRequirement = true;
        //check if valid response has been inputted
        for (let jndex = 0; jndex < column; jndex++) {
          let inputData = this.state[this.props.type[jndex] + index];
          metSaveRequirement =
            metSaveRequirement &&
            this.metRequirement(this.props.type[jndex], inputData);
        }
        if (metSaveRequirement) {
          let sendData;
          for (let jndex = 0; jndex < column; jndex++) {
            let inputName = this.props.type[jndex];
            let inputData = this.state[this.props.type[jndex] + index];
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
                <TextField
                  name={typeArray[jndex] + index}
                  onChange={e => {
                    this.setState({ [e.target.name]: e.target.value });
                  }}
                ></TextField>
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
        this.timeout = setTimeout(()=>{this.setState({ resultsOpen:false })}, time({seconds:2}));
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
      return (
        <ComponentWrapper
         style={this.props.style}
          edit={this.state.edit ? "true" : undefined}
          onClick={this.state.edit && !this.props.disableEffect ? this.handleClick.bind(this) : undefined}
          key={this.state.key}
          raised={true}
          outline={!this.props.disableEffect ? "true" : undefined}
        >
          <WrappedComponent {...this.props} content={this.state.content} />
        </ComponentWrapper>
      );
    }

    displayBanner() {
    let editable = this.state.edit;
      return (
        <BannerWrapper
          edit={editable ? "true" : undefined}
          content={this.state.content}
          onClick={editable ? this.handleClick.bind(this) : undefined}
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
          {this.displayDialog()}
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
