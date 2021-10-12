const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const grafana = require("./grafana");
const sharepoint = require("./sharepoint");
const teams = require("./teams");
const jenkins = require("./jenkins");
const wespire = require("./wespire");
const login = require("./login");
const fs = require("fs");
const cron = require("./cron");
const fetch = require("node-fetch");
const multer = require("multer");

dotenv.config();
const app = express();

/* URL */
const soaesb_url =
  "https://c4large3.phx.connexta.com:3000/grafana/d/6hIxKFVZk/";
const wespire_url = "https://octo.wespire.com/blogs/";

app.use(express.static("target"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/* production setting */
const prod = process.env.NODE_ENV === "production";
const mediaDir = prod
  ? "/eve/carouselMedia"
  : path.join(process.cwd(), "eve/carouselMedia");
app.use(express.static(mediaDir));
const targetPath = prod ? "/target" : "../target";
const themeFileLocation = prod ? "/eve/theme.json" : "eve/theme.json";
const versionFileLocation = prod ? "/eve/versions.json" : "eve/versions.json";
const mediaFolder = prod ? "/eve/carouselMedia" : "eve/carouselMedia";
const mediaFile = prod ? "/eve/carousel.json" : "eve/carousel.json";
const eventFile = prod ? "/eve/event.json" : "eve/event.json";
//expected content format of adminFile would be as such
//{"admin":["John Smith","anyMicrosoft Name"]}
const adminFile = prod ? "/eve/admin.json" : "eve/admin.json";

/* CRON JOB */
// grafana cron job
app.set("SOAESB", grafana.getScreenshot(prod, soaesb_url)); //initial run
cron.grafanaCron(prod, app, soaesb_url);

//jenkins cron job
app.set("JENKINS", jenkins.getJenkinsList()); //initial run
cron.jenkinsCron(app);

//sharepoint cron job
app.set("SHAREPOINT", sharepoint.getPages()); //initial run
cron.sharepointCron(app);

//teams cron job
app.set("TEAMS", teams.getMessages()); //initial run
cron.teamsCron(app);

//wespire cron job
app.set("WESPIRE", wespire.getRecentBlogs(prod, wespire_url)); //initial run
cron.wespireCron(prod, app, wespire_url);

// Create storage for media images
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, mediaFolder);
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  },
});

// Multer package handles image storage
const upload = multer({
  storage: storage,
}).array("imgUploader", 3);

/* ROUTE */
// Reads JSON data for carousel
app.get("/carousel", function(req, res) {
  if (fs.existsSync(mediaFile)) {
    let content = JSON.parse(fs.readFileSync(mediaFile));

    let route = content.routes.find((item) => item.route === req.query.route);

    if (route == undefined) res.send({ cards: [] });
    else res.send({ cards: route.cards });
  } else res.send({ cards: [] });
});

// Posts JSON data from carousel
app.post("/carousel", function(req, res) {
  if (fs.existsSync(mediaFile)) {
    var content = JSON.parse(fs.readFileSync(mediaFile));

    let index;
    let route = content.routes.find((item, i) => {
      index = i;
      return item.route === req.body.route;
    });

    if (route == undefined) {
      content.routes.push({ route: req.body.route, cards: [req.body.card] });
    } else {
      route.cards.push(req.body.card);
      content.routes[index] = route;
    }

    fs.writeFileSync(mediaFile, JSON.stringify(content));
    res.end("Data sent successfully");
  } else {
    let content = {
      routes: [{ route: req.body.route, cards: [req.body.card] }],
    };

    fs.writeFileSync(mediaFile, JSON.stringify(content));
    res.end("Data sent successfully!");
  }
});

// Handles upload of images
app.post("/upload", function(req, res) {
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);

  upload(req, res, function(err) {
    if (err) {
      return res.end(err.toString());
    }
    return res.end("File uploaded successfully");
  });
});

//Handles deletion of images
app.post("/remove", function(req, res) {
  if (fs.existsSync(mediaFile)) {
    var content = JSON.parse(fs.readFileSync(mediaFile));

    let removed = req.body.card;
    let index;

    let route = content.routes.find((item, i) => {
      index = i;
      return item.route === req.body.route;
    });

    if (route != undefined) {
      content.routes[index].cards = route.cards.filter(
        (card) =>
          !(
            card.body == removed.body &&
            card.title == removed.title &&
            card.media == removed.media
          )
      );

      fs.writeFileSync(mediaFile, JSON.stringify(content));
    }

    let media = removed.media;
    if (media != null) {
      fs.unlink(mediaFolder + "/" + media, function(err) {
        if (err) {
          res.end(err.toString());
          return;
        } else {
          res.end("Card deleted successfully");
          return;
        }
      });
    }
  }

  res.end("No card to delete");
});

app.get("/event", function(req, res) {
  if (fs.existsSync(eventFile)) {
    let content = JSON.parse(fs.readFileSync(eventFile));

    let route = content.routes.find((item) => item.route === req.query.route);

    if (route == undefined) res.send({ events: [] });
    else res.send({ events: route.events });
  } else res.send({ events: [] });
});

app.post("/event", function(req, res) {
  if (fs.existsSync(eventFile)) {
    let content = JSON.parse(fs.readFileSync(eventFile));

    let index;
    let route = content.routes.find((item, i) => {
      index = i;
      return item.route === req.body.route;
    });
    if (content.routes == undefined) {
      content = {
        routes: [{ route: req.body.route, events: [req.body.event] }],
      };
    } else if (route == undefined) {
      content.routes.push({ route: req.body.route, events: [req.body.event] });
    } else {
      route.events.push(req.body.event);
      content.routes[index] = route;
    }

    fs.writeFileSync(eventFile, JSON.stringify(content));
    res.end("Data sent successfully");
  } else {
    content = {
      routes: [{ route: req.body.route, events: [req.body.event] }],
    };

    fs.writeFileSync(eventFile, JSON.stringify(content));
    res.end("Data sent successfully");
  }
});

app.post("/removeEvent", function(req, res) {
  if (fs.existsSync(eventFile)) {
    let content = JSON.parse(fs.readFileSync(eventFile));
    let removed = req.body.event;
    let index;

    let route = content.routes.find((item, i) => {
      index = i;
      return item.route === req.body.route;
    });

    if (route != undefined) {
      content.routes[index].events = route.events.filter(
        (event) =>
          !(
            event.title == removed.title &&
            event.location == removed.location &&
            event.startTime == removed.startTime &&
            event.endTime == removed.endTime
          )
      );

      fs.writeFileSync(eventFile, JSON.stringify(content));
    }
  }
  res.end("Data removed successfully");
});

// Reads version data and sends to client
app.get("/fetch", async (req, res) => {
  const url = req.query.url;
  const type = req.query.type;

  try {
    const response = await fetch(url);
    switch (type) {
      case "JSON":
        const json = await response.json();
        res.send(json);
        break;
      default:
        res.send(response);
    }
  } catch (error) {
    console.log("Error in /fetch ", error);
  }
  res.end();
});

app.get("/theme", function(req, res) {
  try {
    const wallboard = req.query.wallboard;
    const component = req.query.component;
    const id = req.query.id;
    //check if file exists
    if (fs.existsSync(themeFileLocation)) {
      let data = JSON.parse(fs.readFileSync(themeFileLocation));
      let filteredData;
      if (data && wallboard && component && data[id] && data[id][wallboard]) {
        filteredData = data[id][wallboard][component];
      } else {
        filteredData = undefined;
      }
      res.send({ data: filteredData });
    } else {
      res.send({ data: undefined });
    }
  } catch (error) {
    console.log("Error in GET /theme: ", error);
  }
  res.end();
});

app.post("/theme", function(req, res) {
  const wallboard = req.query.wallboard;
  const component = req.query.component;
  const id = req.query.id;

  if (wallboard && component) {
    //case: invalid update input
    let finalData;
    if (fs.existsSync(themeFileLocation)) {
      let data = JSON.parse(fs.readFileSync(themeFileLocation));

      //case: user data doesn't exist
      if (!data[id]) {
        let addedData = {
          [id]: { [wallboard]: { [component]: req.body.data } },
        };
        finalData = { ...addedData, ...data };
      }
      //case: user's wallboard data doesn't exist
      else if (!data[id][wallboard]) {
        let tmp = data[id];
        tmp = { ...tmp, ...{ [wallboard]: { [component]: req.body.data } } };
        data[id] = tmp;
        finalData = data;
      }
      //case: user's component data doesn't exist or data already exists
      else {
        data[id][wallboard][component] = req.body.data;
        finalData = data;
      }
    } else {
      finalData = { [id]: { [wallboard]: { [component]: req.body.data } } };
    }
    fs.writeFileSync(themeFileLocation, JSON.stringify(finalData), function(
      err
    ) {
      if (err)
        console.log("Unable to write theme to the non-existing file ", err);
    });
  }
  res.end();
});

app.get("/versions", function(req, res) {
  if (fs.existsSync(versionFileLocation)) {
    let content = fs.readFileSync(versionFileLocation);
    res.send(JSON.parse(content));
  } else {
    res.send({ GSR: "", Alliance: "", DDF: "" });
  }
});

// Writes version data from client
app.post("/versions", function(req, res) {
  fs.writeFileSync(versionFileLocation, JSON.stringify(req.body));
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
        "Content-Length": screenshotBuffer.length,
      });
      res.end(screenshotBuffer);
    } else {
      res.end();
    }
  } catch (error) {
    console.log("Error in /display ", error);
  }
});

app.get("/jenkinslist", async function(req, res) {
  res.send(await app.get("JENKINS"));
});

app.get("/sharepointlist", async (req, res) => {
  const list = await app.get("SHAREPOINT");
  res.send(list);
});

app.get("/teamslist", async function(req, res) {
  const teamslist = await app.get("TEAMS")
  res.send(teamslist);
});

app.get("/checkadmin", function(req, res) {
  let isAdmin = true;
  if (fs.existsSync(adminFile) && fs.readFileSync(adminFile).length) {
    let adminNameList = JSON.parse(fs.readFileSync(adminFile));
    isAdmin = login.checkAdmin(req.query.name, adminNameList.admin);
  }
  res.send({ result: isAdmin });
});

app.get("/wespireblog", async (req, res) => {
  const blogs = await app.get("WESPIRE");
  res.send(blogs);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, targetPath, "index.html"));
});

module.exports = app;
