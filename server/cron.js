const grafana = require("./grafana");
const links = require("./links");
const fetch = require("node-fetch");
const CronJob = require("cron").CronJob;

module.exports = {
  grafanaCron: function(prod, app, url) {
    new CronJob(
      "0 0 */1 * * *", //every hour
      function() {
        console.log("running grafana cron job for every one hour");
        app.set("SOAESB", grafana.getScreenshot(prod, url));
      },
      null,
      true
    );
  },
  githubCron: async function(app, github_list) {
    new CronJob(
      "0 0 */1 * * *", //every hour
      function() {
        console.log("Fetching github Data");
        for (let item in github_list) {
          const response = await fetch(links.github.pull(item)); //overall data
          const data = await response.json();


          let data = {
            "reponame" : links.github.reponame(item),
            "pull" : links.github.pull(item),
            "approval" : links.github.pull(item, )

        }
      },
      null,
      true
    );
  }
};
