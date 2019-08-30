const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const grafana = require("./grafana");
const fs = require("fs");
const cron = require("./cron");
const fetch = require("node-fetch");
const multer = require("multer");

dotenv.config();
const app = express();

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
const mediaDir = prod
  ? "/eve/carouselMedia"
  : path.join(process.cwd(), "eve/carouselMedia");
app.use(express.static(mediaDir));
const targetPath = prod ? "/target" : "../target";
const themeFileLocation = prod ? "/eve/theme.json" : "eve/theme.json";
const versionFileLocation = prod ? "/eve/versions.json" : "eve/versions.json";
const mediaFolder = prod ? "/eve/carouselMedia" : "eve/carouselMedia";
const mediaFile = prod ? "/eve/carousel.json" : "eve/carousel.json";

/* CRON JOB */
//CRON JOB for SOAESB grafana
if (prod) {
  app.set("SOAESB", grafana.getScreenshot(prod, soaesb_url)); //initial run
  cron.grafanaCron(prod, app, soaesb_url);
}

// Create storage for media images
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, mediaFolder);
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});

// Multer package handles image storage
const upload = multer({
  storage: storage
}).array("imgUploader", 3);

/* ROUTE */
// Reads JSON data for carousel
app.get("/carousel", function(req, res) {
  if (fs.existsSync(mediaFile)) {
    let content = fs.readFileSync(mediaFile);
    res.send(JSON.parse(content));
  } else res.send({ cards: [] });
});

// Posts JSON data from carousel
app.post("/carousel", function(req, res) {
  if (fs.existsSync(mediaFile)) {
    let content = fs.readFileSync(mediaFile);

    let cards = JSON.parse(content).cards;

    cards.push(req.body.card);

    fs.writeFileSync(mediaFile, JSON.stringify({ cards: cards }));
    res.end("Data sent successfully");
  } else {
    let content = { cards: [req.body.card] };
    fs.writeFileSync(mediaFile, JSON.stringify(content));
    res.end("Data send successfully!");
  }
});

// Handles upload of images
app.post("/upload", function(req, res) {
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);

  upload(req, res, function(err) {
    if (err) {
      return res.end(err.toString());
    }
    return res.end("File uploaded successfully");
  });
});

//Handles deletion of images
app.post("/remove", function(req, res) {
  if (fs.existsSync(mediaFile)) {
    let content = fs.readFileSync(mediaFile);

    let removed = req.body.card;

    let temp = JSON.parse(content).cards.filter(
      card =>
        !(
          card.body == removed.body &&
          card.title == removed.title &&
          card.media == removed.media
        )
    );

    fs.writeFileSync(mediaFile, JSON.stringify({ cards: temp }));
  }

  if (fs.existsSync(mediaDir)) {
    let media = req.body.card.media;
    if (media != null) {
      fs.unlink(mediaFolder + "/" + media, function(err) {
        if (err) {
          res.end(err.toString());
          return;
        } else {
          res.end("Card deleted successfully");
          return;
        }
      });
    }
  }

  res.end("No card to delete");
});

// Reads version data and sends to client
app.get("/fetch", async (req, res) => {
  const url = req.query.url;
  const type = req.query.type;
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
    console.log("Error in /fetch ", error);
  }
  res.end();
});

app.get("/theme", function(req, res) {
  try {
    const wallboard = req.query.wallboard;
    const component = req.query.component;

    //check if file exists
    if (fs.existsSync(themeFileLocation)) {
      let data = JSON.parse(fs.readFileSync(themeFileLocation));
      let filteredData;
      if (data && wallboard && component && data[wallboard]) {
        filteredData = data[wallboard][component];
      } else {
        filteredData = undefined;
      }
      res.send({ data: filteredData });
    } else {
      res.send({ data: undefined });
    }
  } catch (error) {
    console.log("Error in GET /theme: ", error);
  }
  res.end();
});

app.post("/theme", function(req, res) {
  const wallboard = req.query.wallboard;
  const component = req.query.component;
  if (wallboard && component) {
    //case: invalid update input
    let finalData;
    if (fs.existsSync(themeFileLocation)) {
      let data = JSON.parse(fs.readFileSync(themeFileLocation));
      if (!data[wallboard]) {
        //case: wallboard data doesn't exist at all
        let addedData = { [wallboard]: { [component]: req.body.data } };
        finalData = { ...addedData, ...data };
      } else {
        data[wallboard][component] = req.body.data;
        finalData = data;
      }
    } else {
      finalData = { [wallboard]: { [component]: req.body.data } };
    }
    fs.writeFileSync(themeFileLocation, JSON.stringify(finalData), function(
      err
    ) {
      if (err)
        console.log("Unable to write theme to the non-existing file ", err);
    });
  }
  res.end();
});

app.get("/versions", function(req, res) {
  if (fs.existsSync(versionFileLocation)) {
    let content = fs.readFileSync(versionFileLocation);
    res.send(JSON.parse(content));
  } else {
    res.send({ GSR: "", Alliance: "", DDF: "" });
  }
});

// Writes version data from client
app.post("/versions", function(req, res) {
  fs.writeFileSync(versionFileLocation, JSON.stringify(req.body));
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

module.exports = app;
