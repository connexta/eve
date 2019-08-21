# Server

## server
Main entry file for backend side server (NodeJS) to host the server and any backend code.

#### Packages:
- **express**: NodeJS Web application framework for routing.
- **cors**: middleware for enabling CORS support.
- **body-parser**: middleware for parsing incoming request bodies. Parses application/json and application/x-www-form-urlencoded.
- **path**: utilities for working with file and directory paths.
- **dotenv**: utilities for extract .env environment variable in dev environment.
- **multer**: handles saving images to disk

#### Details:
- **port**: in final production level, it'll pick up process.env.EVE_PORT from dcos service which is set to 3000.
- **static files**: front end files are statically read by NodeJS from compacted folder `target` created by webpack.

## grafana
Use Puppeteer library to take a screenshot of grafana dashboard

#### Packages:
- **puppeteer**: generate screenshots of a webpage through chromium in a given url.
- **dotenv**

#### Details:
- **getScreenshot**: parameter (prod: true if production level, url: url to take a screenshot of, timezone: timezone of browser used by user). Runs in headless mode in production to not display full chrome popup.
