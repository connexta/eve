const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const https = require("https");
const fetch = require("node-fetch");
const grafana = require("./grafana");
const cron = require("./cron");
const links = require("./links");

dotenv.config();
const app = express();
const port = process.env.EVE_PORT || 3000;

app.use(express.static("target"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/* production setting */
const prod = process.env.NODE_ENV === "production";
const versionFileLocation = prod ? "versions.json" : "server/versions.json";
const targetPath = prod ? "/target" : "../target";

/* CRON JOB */
//CRON JOB for SOAESB grafana
app.set("SOAESB", grafana.getScreenshot(prod, links.soaesb_url)); //initial run
cron.grafanaCron(prod, app, links.soaesb_url);
//CRON JOB for Github
var github_list = ["codice/ddf"];
// app.set(github_list[0])
console.log(github_list);
// app.set()
// console.log(app.get("codice/ddf"))
// app.set("codice/ddf", "ho");
// console.log(app.get("codice/ddf"))
// console.log(links.github.reponame("codice/ddf"))
// console.log(links);


/* ROUTE */
app.get("/fetch", async (req, res) => {
  const url = req.query.url;
  const type = req.query.type;
  // console.log("type is " + type);
  // console.log("THE URL " + url);
  try {
    const response = await fetch(url);
    switch (type) {
      case "JSON":
        const json = await response.json();
        res.send(json);
        break;
      default:
        res.send(response);
    }
  } catch (error) {
    console.log(error);
  }
  res.end();
});

app.get("/versions", function(req, res) {
  var content = fs.readFileSync(
    versionFileLocation
  );
  res.send(JSON.parse(content));
});

app.post("/versions", function(req, res) {
  fs.writeFileSync(
    versionFileLocation,
    JSON.stringify(req.body)
  );
  res.end();
});

//image url to display created grafana screenshot
app.get("/display", async (req, res) => {
  try {
    const name = req.query.name.split("?")[0];
    const screenshotBuffer = await app.get(name);
    if (screenshotBuffer) {
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": screenshotBuffer.length
      });
      res.end(screenshotBuffer);
    } else {
      res.end();
    }
  } catch (error) {
    console.log("Error in /display ", error);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, targetPath, "index.html"));
});

if (process.argv.length >= 2 && process.argv[2] === "https") { //DEV setup for HTTPS enviornment
  const options = {
    key: fs.readFileSync( './localhost.key' ),
    cert: fs.readFileSync( './localhost.cert' ),
    requestCert: false,
    rejectUnauthorized: false
  }
  const server = https.createServer( options, app );
  server.listen(port, () => {
    console.log(`App listening on https://localhost:${port}`);
  });
}
else { //DEV setup for HTTP or production level
  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
}
