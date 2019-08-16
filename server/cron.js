const grafana = require("./grafana");
const CronJob = require("cron").CronJob;

module.exports = {
  grafanaCron: function(prod, app, url) {
    new CronJob(
      "0 0 */1 * * *",
      function() {
        console.log("running grafana cron job for every one hour");
        app.set("SOAESB", grafana.getScreenshot(prod, url));
      },
      null,
      true
    );
  }
};
