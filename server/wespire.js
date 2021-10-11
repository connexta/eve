const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

//WESPIRE SETUP
const WESPIRE_TOKEN = process.env.WESPIRE_TOKEN;

//use Puppeteer to parse blogs endpoint HTML from WeSpire
module.exports = {
  getRecentBlogs: async function(prod, url) {
    try {
      const browser = prod
        ? await puppeteer.launch({
            executablePath: "/usr/bin/chromium-browser",
            headless: true,
            args: [
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
              "--headless",
              "--ignore-certificate-errors"
            ],
            env: {
              TZ: "America/Phoenix"
            }
          })
        : await puppeteer.launch({
            defaultViewport: null,
            headless: true,
            args: ["--start-maximized", "--disable-dev-shm-usage", "--headless", "--ignore-certificate-errors"],
            env: {
              TZ: "America/Phoenix"
            }
          });

      const page = await browser.newPage();

      await page.setCookie({
        'name': 'remember_token',
        'value': WESPIRE_TOKEN,
        'url': url
      });

      await page.setDefaultNavigationTimeout(0);
      await page.goto(url, { waitUntil: "networkidle0" });

      const blogCards = await page.$$eval('div.blog-card',
        cards => {
          return cards.map(
            card => {
              let style = card.querySelector("div.image-container").getAttribute("style")
              let date = card.querySelector("h5").getAttribute("data-date")
              let link = card.querySelector('a').getAttribute('href')
              let text = card.querySelector('a').innerHTML;

              return {
                style: style,
                date: date,
                link: link,
                text: text}
            }).slice(0,5)
      })

      await browser.close();
      return blogCards;
    } catch (error) {
      console.log(error);
    }
  }
};
