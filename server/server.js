const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const grafana = require("./grafana");
const fs = require("fs");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const prod = process.env.NODE_ENV === "production";

app.use(express.static("target"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/* ROUTE */
//create screenshot of grafana dashboard

/* ROUTE */
app.get("/versions", function(req, res) {
  var content = fs.readFileSync("versions.json");
  res.send(JSON.parse(content));
});

app.post("/versions", function(req, res) {
  fs.writeFileSync("versions.json", JSON.stringify(req.body));
  res.end();
});

app.get("/grafana", (req, res) => {
  app.set(
    req.query.name,
    grafana.getScreenshot(prod, urlList[req.query.name], req.query.timezone)
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
