const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const grafana = require("./grafana");

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: "./",
  filename: function(req, file, callback) {
    return file.originalname;
  }
});

var upload = multer({
  storage: storage
}).array("imgUploader, 3");

// Add headers
// mediaApp.use(function(req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });

app.use(express.static("target"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(express.static(__dirname, "public"));

/* ROUTE */
app.get("/grafana", (req, res) => {
  let prod = process.env.NODE_ENV === "production";
  grafana.getScreenshot(res, prod);
});

app.post("/carousel", function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      return res.end("Something went wrong!");
    }
    return console.log(res.body);
  });
});

app.get("*", (req, res) => {
  let targetPath =
    process.env.NODE_ENV === "production" ? "/target" : "../target";
  res.sendFile(path.join(__dirname, targetPath, "index.html"));
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
