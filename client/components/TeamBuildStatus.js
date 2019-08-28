import React from "react";
import BuildStatus from "../components/BuildStatus";
import { hour } from "../utils/TimeUtils";
import makeTrashable from "trashable";

export default class TeamBuildStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      urlList: localStorage.getItem(this.props.name)
        ? JSON.parse(localStorage.getItem(this.props.name))
        : [], //format of array with object {<Name of Pipeline>: <master URL>}
      isLoading: true
    };
  }

  componentDidMount() {
    localStorage.getItem(this.props.name)
      ? this.setState({ isLoading: false })
      : this.createJenkinsURLList(this.props.url);
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
      fetch(url)
        .then(response => response.json())
        .then(json => {
          console.log("Pipleline URL:", json);
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
        fetch(Object.values(pipelineNameList[i]))
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
              [updatedName]: Object.values(pipelineNameList[i]) + "/master/"
            });
          }
        })
        .catch(e => console.log("error", e));
    }

    this.setState({ urlList: urlList, isLoading: false });
    localStorage.setItem(this.props.name, JSON.stringify(urlList));
  }

  render() {
    return this.props.vertical ? (
      <BuildStatus urlList={this.state.urlList} listvert />
    ) : (
      <BuildStatus urlList={this.state.urlList} />
    );
  }
}
