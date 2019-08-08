const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

//GRAFANA SETUP
const GF_SOAESB_URL =
  "http://haart-kube.phx.connexta.com:3000/d/6hIxKFVZk/soa_dashboard?orgId=1";
const USERNAME = process.env.SOAESB_LOGIN_USERNAME;
const PASSWORD = process.env.SOAESB_LOGIN_PASSWORD;
const auth_string = USERNAME + ":" + PASSWORD;
const auth_header = "Basic " + new Buffer.from(auth_string).toString("base64");

//use Puppeteer to take screenshot and write it to the respond url.
module.exports = {
  getScreenshot: async function(res, prod) {
    if (prod) {
      //production level
      const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",

        headless: true,
        args: ["--no-sandbox"]
      });
      const page = await browser.newPage();

      await page.setExtraHTTPHeaders({ Authorization: auth_header });
      await page.setDefaultNavigationTimeout(120000);
      await page.setViewport({ width: 2560, height: 1286 });

      await page.goto(GF_SOAESB_URL, { waitUntil: "networkidle0" });

      const screenshotBuffer = await page.screenshot({});

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": screenshotBuffer.length
      });
      res.end(screenshotBuffer);
      await browser.close();
    } else {
      //developer level
      const browser = await puppeteer.launch({
        defaultViewport: null,
        args: ["--start-maximized"],
        headless: false
      });
      const page = await browser.newPage();

      await page.setExtraHTTPHeaders({ Authorization: auth_header });
      await page.setDefaultNavigationTimeout(120000);
      await page.setViewport({ width: 0, height: 0 });

      await page.goto(GF_SOAESB_URL, { waitUntil: "networkidle0" });

      const screenshotBuffer = await page.screenshot();

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": screenshotBuffer.length
      });
      res.end(screenshotBuffer);
      await browser.close();
    }
  }
};
