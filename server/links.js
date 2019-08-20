const dotenv = require("dotenv");
dotenv.config();
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/* URL */
module.exports = {
    soaesb_url: "http://haart-kube.phx.connexta.com:3000/grafana/d/6hIxKFVZk/soa_dashboard?orgId=1",
    github: {
        reponame: function(repoPath) {
            return "https://api.github.com/repos/" + repoPath + "?client_secret=" + CLIENT_SECRET + "&client_id=" + CLIENT_ID
        },
        pull: function(repoPath) {
            return "https://api.github.com/repos/" + repoPath + "/pulls"
        },
        approval: function(repoPath, prNum) {
            return "https://api.github.com/repos/" + repoPath + "/pulls/" + prNum + "/reviews"
        }    
    }  
}

// const urlList = {
//   SOAESB: soaesb_url
// };
//          <Github repoPath={"codice/ddf"} />