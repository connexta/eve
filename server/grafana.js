const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

//GRAFANA SETUP
const auth_header = "Bearer " + process.env.SOAESB_BEARER_TOKEN;
const timeout = 120000; //2 minutes

//use Puppeteer to take screenshot and write it to the respond url.
module.exports = {
  getScreenshot: async function(prod, url) {
    const browser = prod
      ? await puppeteer.launch({
          executablePath: "/usr/bin/chromium-browser",
          headless: true,
          args: ["--no-sandbox"]
        })
      : await puppeteer.launch({
          defaultViewport: null,
          headless: false,
          args: ["--start-maximized"]
        });

    const width = prod ? 2560 : 0;
    const height = prod ? 1286 : 0;

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ Authorization: auth_header });
    await page.setDefaultNavigationTimeout();
    await page.setViewport({ width: width, height: height });
    await page.goto(url, { waitUntil: "networkidle0" });
    const screenshotBuffer = await page.screenshot({ timeout });
    await browser.close();
    return screenshotBuffer;
  }
};