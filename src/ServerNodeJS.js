var express = require("express");
var fs = require("fs");
var myParser = require("body-parser");
var app = express();
var cors = require("cors");

app.use(cors());
app.use(myParser.json());
app.post("/", function(req, res) {
  console.log(req.body);
  fs.writeFileSync("./configure.json", JSON.stringify(req.body));
});

app.get("/", function(req, res) {
  console.log("GET CALL");
  var content = fs.readFileSync("./configure.json");
  res.send(JSON.parse(content));
});

app.listen(9000);
