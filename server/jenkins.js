const fetch = require("node-fetch");

const ROOTURL = "http://jenkins.phx.connexta.com/service/jenkins/";

const JENKINSROOTURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/";

const APIPOSTFIX = "api/json";

//Create a JSON of all Jenkins list with its any subsequent branches
//For each layer, leaf key is set to be true or false depends on if subsequent branch exists for the purpose of efficiency.
//data format as such
//[{name: <name>, leaf: false, branch: [{name: <name>, link: <link>, url: <url>, leaf: true}]}]
module.exports = {
  getJenkinsList: async function() {
    let jenkinsList;
    try {
      jenkinsList = await getSubBranch(
        ROOTURL + APIPOSTFIX,
        JENKINSROOTURL,
        true
      );
      for (let key in Object.keys(jenkinsList)) {
        let suburl =
          ROOTURL + "job/" + jenkinsList[key].name + "/" + APIPOSTFIX;
        let subdataurl = JENKINSROOTURL + jenkinsList[key].name + "/";
        let secondList = await getSubBranch(suburl, subdataurl, false);
        jenkinsList[key] = { ...jenkinsList[key], branch: secondList };
        for (let keyTwo in Object.keys(jenkinsList[key].branch)) {
          if (!jenkinsList[key].branch[keyTwo].leaf) {
            let name = jenkinsList[key].branch[keyTwo].name;
            let finalurl =
              ROOTURL +
              "job/" +
              jenkinsList[key].name +
              "/" +
              "job/" +
              name +
              "/" +
              APIPOSTFIX;
            let finaldataurl =
              JENKINSROOTURL + jenkinsList[key].name + "/" + name + "/";
            let finalList = await getSubBranch(finalurl, finaldataurl, false);

            if (finalList.length != 0) {
              jenkinsList[key].branch[keyTwo] = {
                ...jenkinsList[key].branch[keyTwo],
                branch: finalList
              };
            } else {
              jenkinsList[key].branch[keyTwo].leaf = true;
            }
          }
        }
      }
    } catch (error) {
      jenkinsList = [];
    }

    return jenkinsList;
  }
};

//Obtain and return the subsequent branch
//@param
//  rootURL : (string) starting jenkins url to find subsequent branch
//  dataURL : (string) url string to be concanated with the data of subsequent branch to be stored
//  noURLs : (boolean) if ture, store url & link key/value pair.
//@return
//  subsequent branch data in JSON format
async function getSubBranch(rootURL, dataURL, noURLs) {
  try {
    let jenkinsData = await fetchJSON(rootURL);
    if (Object.keys(jenkinsData).includes("jobs")) {
      let rootListJenkins = await jenkinsData.jobs
        .filter(
          data => !data.name.startsWith("PR") && !data.name.startsWith("pr")
        )
        .map(data => {
          let leaf = data && data.color ? true : false;
          return noURLs
            ? {
                name: data.name,
                leaf: leaf
              }
            : {
                name: data.name,
                link: data.url,
                url: dataURL + data.name + "/",
                leaf: leaf
              };
        });
      return rootListJenkins;
    }
  } catch (error) {
    console.log("Error in getSubBranch ", error);
  }
}

async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Error in jenkinsListCreator fetch ", error);
  }
}
