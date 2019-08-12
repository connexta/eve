const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const grafana = require("./grafana");
const fs = require("fs");
const cron = require("./cron");

dotenv.config();
const app = express();
const port = process.env.EVE_PORT || 3000;
const prod = process.env.NODE_ENV === "production";

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./resources/carouselMedia");
  },
  filename: function(req, file, callback) {
    // callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    callback(null, file.originalname);
  }
});

var upload = multer({
  storage: storage
}).array("imgUploader", 3);

// Add headers
// mediaApp.use(function(req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

/* URL */
const soaesb_url =
  "http://haart-kube.phx.connexta.com:3000/grafana/d/6hIxKFVZk/soa_dashboard?orgId=1";
const urlList = {
  SOAESB: soaesb_url
};

app.use(express.static("target"));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/* CRON JOB */
//CRON JOB for SOAESB grafana
app.set("SOAESB", grafana.getScreenshot(prod, soaesb_url)); //initial run
cron.grafanaCron(prod, app, soaesb_url);

/* ROUTE */
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
app.post("/carousel", function(req, res) {
  console.log(req.body);
  fs.writeFileSync("./resources/carousel.json", JSON.stringify(req.body));
  res.end();
});

app.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      return res.end("Something went wrong!");
    }
<<<<<<< HEAD
  } catch (error) {
    console.log("Error in /display ", error);
  }
=======
    return res.end("File uploaded successfully!");
  });
>>>>>>> working but with redirect
});

app.get("*", (req, res) => {
  let targetPath =
    process.env.NODE_ENV === "production" ? "/target" : "../target";
  res.sendFile(path.join(__dirname, targetPath, "index.html"));
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
