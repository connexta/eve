import React from "react";
import BuildStatus from "../components/BuildStatus";
import { I2OleftBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { IONURL } from "../utils/Link";
import { hour } from "../utils/TimeUtils";
import makeTrashable from "trashable";

const styles = {
  cardContent: {
    padding: "4px",
    display: "block",
    flex: "0 100%"
  }
};

class I2OWallboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlList: localStorage.getItem('I2O') ? JSON.parse(localStorage.getItem('I2O')) : [], //format of array with object {<Name of Pipeline>: <master URL>}
      isLoading: true
    };
  }

  componentDidMount() {
    localStorage.getItem('I2O') ? this.setState({isLoading: false}) : this.createJenkinsURLList();
    this.getPipelineId = setInterval(() => this.createJenkinsURLList(), hour);
  }

  componentWillUnmount() {
    clearInterval(this.getPipelineId);
    if (this.trashablePipeline){
      this.trashablePipeline.trash();
    }
    if (this.trashableBranchExists)
      this.trashableBranchExists.forEach(promise => promise.trash());
  }

  //create the state of urlList for each ION pipeline master branch.
  async createJenkinsURLList() {
    let urlList = [];
    this.trashableBranchExists = []

    //get existing pipelines in ION team
    this.trashablePipeline = makeTrashable(fetch(IONURL)
      .then(response => response.json())
      .then(json => {
        return json.pipelineFolderNames;
      })
      .then(pipelineFolderNames => {
        let pipelineURLList = [];
        pipelineURLList = pipelineFolderNames.map(name => {
          return { [name]: IONURL + name };
        });
        return pipelineURLList;
      })
      .catch(e => console.log("error", e)));
    const pipelineNameList = await this.trashablePipeline;

    //For each existing pipelines, obtain the url if it has master branch
    for (let i = 0; i < pipelineNameList.length; i++) {
      this.trashableBranchExists[i] = makeTrashable(fetch(Object.values(pipelineNameList[i]))
      .then(response => response.json())
      .catch(e => console.log("error fetching the i2o pipelines", e)));

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
    localStorage.setItem('I2O', JSON.stringify(urlList));
  }

  render() {
    return this.state.isLoading ? (
      <Grid></Grid>
    ) : (
      <Grid container style={{ height: "100%" }}>
        <Grid item style={I2OleftBox}>
          <BuildStatus
            urlList={this.state.urlList}
            cardContentStyle={styles.cardContent}
          />
        </Grid>
      </Grid>
    );
  }
}

export default I2OWallboard;
