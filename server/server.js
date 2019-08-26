const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const grafana = require("./grafana");
const fs = require("fs");
const cron = require("./cron");
const multer = require("multer");

dotenv.config();
const app = express();
const port = process.env.EVE_PORT || 3000;
const prod = process.env.NODE_ENV === "production";

const dir = path.join(process.cwd(), "eve/carouselMedia");

app.use(express.static(prod ? "/eve/carouselMedia" : dir));

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

/* CRON JOB */
//CRON JOB for SOAESB grafana
app.set("SOAESB", grafana.getScreenshot(prod, soaesb_url)); //initial run
cron.grafanaCron(prod, app, soaesb_url);

// Create storage for media images
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, prod ? "/eve/carouselMedia" : "eve/carouselMedia");
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});

// Multer package handles image storage
var upload = multer({
  storage: storage
}).array("imgUploader", 3);

/* ROUTE */
// Reads JSON data for carousel
app.get("/carousel", function(req, res) {
  var content = fs.readFileSync(
    prod ? "/eve/carousel.json" : "eve/carousel.json"
  );
  res.send(JSON.parse(content));
});

// Posts JSON data from carousel
app.post("/carousel", function(req, res) {
  var content = fs.readFileSync(
    prod ? "/eve/carousel.json" : "eve/carousel.json"
  );

  let cards = JSON.parse(content).cards;

  cards.push(req.body.card);

  fs.writeFileSync(
    prod ? "/eve/carousel.json" : "eve/carousel.json",
    JSON.stringify({ cards: cards })
  );
  res.end("Data sent successfully");
});

// Handles upload of images
app.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      return res.end(err.toString());
    }
    return res.end("File uploaded successfully");
  });
});

//Handles deletion of images
app.post("/remove", function(req, res) {
  var content = fs.readFileSync(
    prod ? "/eve/carousel.json" : "eve/carousel.json"
  );

  let removed = req.body.card;

  let temp = JSON.parse(content).cards.filter(
    card =>
      !(
        card.body == removed.body &&
        card.title == removed.title &&
        card.media == removed.media
      )
  );

  fs.writeFileSync(
    prod ? "/eve/carousel.json" : "eve/carousel.json",
    JSON.stringify({ cards: temp })
  );

  let media = removed.media;
  if (media != null) {
    fs.unlink(
      prod ? "/eve/carouselMedia/" + media : "eve/carouselMedia/" + media,
      function(err) {
        if (err) {
          res.end(err.toString());
          return;
        } else {
          res.end("Card deleted successfully");
          return;
        }
      }
    );
  }
});

// Reads version data and sends to client
app.get("/versions", function(req, res) {
  var content = fs.readFileSync(
    prod ? "/eve/versions.json" : "eve/versions.json"
  );
  res.send(JSON.parse(content));
});

// Writes version data from client
app.post("/versions", function(req, res) {
  fs.writeFileSync(
    prod ? "/eve/versions.json" : "eve/versions.json",
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
  let targetPath = prod ? "/target" : "../target";
  res.sendFile(path.join(__dirname, targetPath, "index.html"));
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
