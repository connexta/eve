const app = require("./app");
const https = require("https");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.EVE_PORT || 3000;

/* URL */
const soaesb_url =
  "http://haart-kube.phx.connexta.com:3000/grafana/d/6hIxKFVZk/soa_dashboard?orgId=1";
const urlList = {
  SOAESB: soaesb_url
};

/* Deploy */
if (process.argv.length >= 2 && process.argv[2] === "https") {
  //DEV setup for HTTPS enviornment
  const options = {
    key: fs.readFileSync("./localhost.key"),
    cert: fs.readFileSync("./localhost.cert"),
    requestCert: false,
    rejectUnauthorized: false
  };
  const server = https.createServer(options, app);
  server.listen(port, () => {
    console.log(`App listening on https://localhost:${port}`);
  });
} else {
  //DEV setup for HTTP or production level
  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
}
