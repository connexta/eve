const fetch = require("node-fetch");

const ROOTURL =
  "http://jenkins.phx.connexta.com/service/jenkins/";

const JENKINSROOTURL = 
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/";

const APIPOSTFIX = "api/json";

//use Puppeteer to take screenshot and write it to the respond url.
module.exports = {
    getJenkinsList: async function() {
        let url = ROOTURL + APIPOSTFIX;
        let jenkinsData = await fetchJSON(url);
        let rootListJenkins = await jenkinsData.jobs.map(data => ({
            name: data.name
        }))
        // console.log("asd");
        // console.log(rootListJenkins);
        let branchList = [];
        for (let index in rootListJenkins) {

            let suburl = ROOTURL+"job/"+rootListJenkins[index].name+"/"+APIPOSTFIX;
            // console.log("sub url " + suburl);
            branchList.push(fetchJSON(suburl));
        }
        let completeListJenkins = [];
        await Promise.all(branchList)
            .then(list => {
                for (let index in list) {
                    completeListJenkins.push({
                        name: list[index].name,
                        branch: list[index].jobs.map(element=>({
                            name: element.name, 
                            url: JENKINSROOTURL+list[index].name+"/"+element.name}))
                    })
                }
        })
        // console.log("FINAL DATA");
        // console.log(completeListJenkins);
        return completeListJenkins
    }
}

async function fetchJSON (url) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        // console.log(json);
        return json;
    } catch(error) {
        console.log("Error in jenkinsListCreator fetch ", error);
    }
}


