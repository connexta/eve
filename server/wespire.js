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
      const content = await page.content();

            let results = [];
            let blogs = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('blog-card');
                items.forEach((item) => {
                    let style = item.getAttribute('style');
                    console.log(style);
                    let date = item.querySelector('h5').getAttribute('data-date');
                    console.log(date);
                    let link = item.querySelector('a').getAttribute('href');
                    console.log(link);
                    let text = item.querySelector('a').getAttribute('href').innerHTML;
                    console.log(text);
           
                    results.push({
                        style: style,
                        date:  date,
                        link:  link,
                        text:  text,
                    });
                });
            })

      /*
      blog.forEach((results) => {
        console.log(blog);
      })
      */

      await browser.close();
      //console.log(content);
      return screenshotBuffer;
    } catch (error) {
      console.log(error);
    }
  }
};
