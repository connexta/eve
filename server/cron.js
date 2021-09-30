const grafana = require("./grafana");
const jenkins = require("./jenkins");
const wespire = require("./wespire");
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
  },
  wespireCron: function(prod, app, url) {
    new CronJob(
      "0 * * * * *", //every minute
      function() {
        console.log("running wespire cron job for every minute, while testing");
        app.set("WESPIRE", wespire.getRecentBlogs(prod, url));
      },
      null,
      true
    );
  }
};
