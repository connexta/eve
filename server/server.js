const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const grafana = require("./grafana");
const cron = require("./cron");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("target"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const prod = process.env.NODE_ENV === "production";

/* URL */
const soaesb_url =
  "http://haart-kube.phx.connexta.com:3000/grafana/d/6hIxKFVZk/soa_dashboard?orgId=1";

/* CRON JOB */
app.set("SOAESB", grafana.getScreenshot(prod, soaesb_url)); //initial run
cron.grafanaCron(prod, app, soaesb_url);

/* ROUTE */
app.get("/display", async (req, res) => {
  const name = req.query.name.split("?")[0];
  const screenshotBuffer = await app.get(name);
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": screenshotBuffer.length
  });
  res.end(screenshotBuffer);
});

app.get("*", (req, res) => {
  let targetPath =
    process.env.NODE_ENV === "production" ? "/target" : "../target";
  res.sendFile(path.join(__dirname, targetPath, "index.html"));
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
