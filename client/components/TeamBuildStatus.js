import React from "react";
import BuildStatus from "../components/BuildStatus";
import { hour } from "../utils/TimeUtils";
import makeTrashable from "trashable";

export default class TeamBuildStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      urlList: localStorage.getItem(this.props.teamName)
        ? JSON.parse(localStorage.getItem(this.props.teamName))
        : [],
      isLoading: true
    };
  }

  componentDidMount() {
    localStorage.getItem(this.props.teamName)
      ? this.setState({ isLoading: false })
      : this.createJenkinsURLList(this.props.rootURL);
    this.getPipelineId = setInterval(() => this.createJenkinsURLList(), hour);
  }

  componentWillUnmount() {
    clearInterval(this.getPipelineId);
    if (this.trashablePipeline) {
      this.trashablePipeline.trash();
    }
    if (this.trashableBranchExists)
      this.trashableBranchExists.forEach(promise => promise.trash());
  }

  //create the state of urlList for each ION pipeline master branch.
  async createJenkinsURLList(url) {
    let urlList = [];
    this.trashableBranchExists = [];
    //get existing pipelines in ION team
    this.trashablePipeline = makeTrashable(
      fetch("/fetch/?type=JSON&url=" + url)
        .then(response => response.json())
        .then(json => {
          return json.pipelineFolderNames;
        })
        .then(pipelineFolderNames => {
          let pipelineURLList = [];
          pipelineURLList = pipelineFolderNames.map(name => {
            return { [name]: url + name };
          });

          return pipelineURLList;
        })
        .catch(e => console.log("error", e))
    );
    const pipelineNameList = await this.trashablePipeline;

    //For each existing pipelines, obtain the url if it has master branch
    for (let i = 0; i < pipelineNameList.length; i++) {
      this.trashableBranchExists[i] = makeTrashable(
        fetch("/fetch/?type=JSON&url=" + Object.values(pipelineNameList[i]))
          .then(response => response.json())
          .catch(e => console.log("error fetching the i2o pipelines", e))
      );

      await this.trashableBranchExists[i]
        .then(json => {
          return json.branchNames.includes("master");
        })
        .then(branchExists => {
          if (branchExists) {
            let name = Object.keys(pipelineNameList[i]).toString();
            let updatedName = name.replace("ion-", ""); //remove ion- in the name if it has any.
            urlList.push({
              NAME: updatedName, URL: Object.values(pipelineNameList[i]) + "/master/"
            });
          }
        })
        .catch(e => console.log("error", e));
    }

    this.setState({ urlList: urlList, isLoading: false });
    localStorage.setItem(this.props.teamName, JSON.stringify(urlList));
  }

  render() {
    return (
      <BuildStatus
        style={this.props.style}
        type={this.props.type}
        row={this.props.row}
        name={this.props.name}
        disable={this.props.disable}
        disableEffect={this.props.disableEffect}
        listvert={this.props.listvert}
        default={this.state.urlList}
      />
    )
  }
}
