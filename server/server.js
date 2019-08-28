const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const jsonfile = require("jsonfile");
const grafana = require("./grafana");
const fs = require("fs");
const cron = require("./cron");

dotenv.config();
const app = express();
const port = process.env.EVE_PORT || 3000;

/* URL */
const soaesb_url =
  "http://haart-kube.phx.connexta.com:3000/grafana/d/6hIxKFVZk/soa_dashboard?orgId=1";
const urlList = {
  SOAESB: soaesb_url
};

app.use(express.static("target"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/* production setting */
const prod = process.env.NODE_ENV === "production";
const themeFileLocation = prod ? "/eve/theme.json" : "eve/theme.json";

/* CRON JOB */
//CRON JOB for SOAESB grafana
app.set("SOAESB", grafana.getScreenshot(prod, soaesb_url)); //initial run
cron.grafanaCron(prod, app, soaesb_url);

/* ROUTE */
app.get("/theme", function(req, res) {
  try {
    const wallboard = req.query.wallboard;
    const component = req.query.component;
    console.log(wallboard);
    console.log(component);
    let data = jsonfile.readFileSync(themeFileLocation);
  
    console.log("get theme data");
    console.log(data);
    // console.log(JSON.parse(data));
    // let filteredData = data.filter(
    //   content => 
    //   (
    //     content.wallboard == wallboard &&
    //     content.wallboard.component == component
    //   )
    // )
  
    let filteredData = data[wallboard][component];
  
    // console.log(content);
    // console.log("fi");
    console.log(filteredData);
    res.send({"data":filteredData});
  }
  catch (error) {
    console.log("Error in GET /theme: ", error);
  }
  res.end();
});

app.post("/theme", function(req, res) {
  console.log("Writing into ");
  const wallboard = req.query.wallboard;
  const component = req.query.component;
  // console.log(req);
  // console.log(req.body.data);
  // const bodyData = JSON.stringify(req.body);
  // console.log(JSON.stringify(req.body));
  // const bodyData = JSON.parse(req.body);
  // console.log(bodyData);
  // console.log(JSON.parse(req.body));
  let data = jsonfile.readFileSync(themeFileLocation);
  console.log(data);
  data[wallboard][component] = req.body.data;
  // let data = {[wallboard]: {[component]: req.body.data}};
  console.log("pre");
  console.log(data);
  /*

Object.values(data.TV).forEach((element)=>console.log(element))

  */
  // console.log("Writing to file " + themeFileLocation);
  // console.log(data);
  jsonfile.writeFileSync(themeFileLocation, data, function (err) {
    if (err) console.log("Unable to write theme to the file ", err);
  })
  // fs.writeFileSync(
  //   themeFileLocation,
  //   JSON.stringify()
  // )
  res.end();
});


app.get("/versions", function(req, res) {
  var content = fs.readFileSync(
    prod ? "versions.json" : "server/versions.json"
  );
  res.send(JSON.parse(content));
});

app.post("/versions", function(req, res) {
  fs.writeFileSync(
    prod ? "versions.json" : "server/versions.json",
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
  let targetPath =
    process.env.NODE_ENV === "production" ? "/target" : "../target";
  res.sendFile(path.join(__dirname, targetPath, "index.html"));
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
