const grafana = require("./grafana");
const jenkins = require("./jenkins");
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
  jenkinsCron: function(app) {
    new CronJob(
      "0 0 */1 * * *", //every hour
      function() {
        console.log("running jenkins cron job for every one hour");
        app.set("JENKINS", jenkins.getJenkinsList());
      },
      null,
      true
    );
  }
};
