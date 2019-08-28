const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const jsonfile = require("jsonfile");
const grafana = require("./grafana");
const fs = require("fs");
const cron = require("./cron");

dotenv.config();
const app = express();

/* URL */
const soaesb_url =
  "http://haart-kube.phx.connexta.com:3000/grafana/d/6hIxKFVZk/soa_dashboard?orgId=1";
const urlList = {
  SOAESB: soaesb_url
};



app.use(express.static("target"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/* production setting */
const prod = process.env.NODE_ENV === "production";
const themeFileLocation = prod ? "/eve/theme.json" :  path.join(process.cwd(), "eve/theme.json");

/* CRON JOB */
//CRON JOB for SOAESB grafana
if (prod) {
    app.set("SOAESB", grafana.getScreenshot(prod, soaesb_url)); //initial run
    cron.grafanaCron(prod, app, soaesb_url);
}

/* ROUTE */
app.get("/theme", function(req, res) {
  try {
    const wallboard = req.query.wallboard;
    const component = req.query.component;
    console.log(wallboard);
    console.log(component);

    //check if file exists
    if (fs.existsSync(themeFileLocation)){
        // console.log(JSON.parfs.readFileSync(themeFileLocation))
        let data = JSON.parse(fs.readFileSync(themeFileLocation));
        console.log("get theme data");
        console.log(data);
        // console.log(JSON.parse(data));
        // let filteredData = data.filter(
        //   content => 
        //   (
        //     content.wallboard == wallboard &&
        //     content.wallboard.component == component
        //   )
        // )
        let filteredData;
        if (data && wallboard && component && data[wallboard]){
            filteredData = data[wallboard][component];
        }
        else {
            filteredData = undefined;
        }
        
        // console.log(content);
        // console.log("fi");
        console.log("FILTERED DATA");
        console.log(filteredData);
        // res.send({filteredData});
        res.send({"data":filteredData});
    }
    else {
        res.send({"data":undefined});
    }
    
  }
  catch (error) {
    console.log("Error in GET /theme: ", error);
  }
  res.end();
});

app.post("/theme", function(req, res) {
  console.log("Writing into ");
  const wallboard = req.query.wallboard;
  const component = req.query.component;
  // console.log(req);
  // console.log(req.body.data);
  // const bodyData = JSON.stringify(req.body);
  // console.log(JSON.stringify(req.body));
  // const bodyData = JSON.parse(req.body);
  // console.log(bodyData);
  // console.log(JSON.parse(req.body));

    if (wallboard && component) { //case: invalid update input
        let finalData;
        if (fs.existsSync(themeFileLocation)){
            let data = JSON.parse(fs.readFileSync(themeFileLocation));
            if (!data[wallboard]) { //case: wallboard data doesn't exist at all
                let addedData = {[wallboard]:{[component]:req.body.data}};
                finalData = {...addedData, ...data};
            }
            else {
                data[wallboard][component] = req.body.data;
                finalData = data;
            }
        }
        else {
            console.log("file doesn't exists");
            console.log(wallboard);
            finalData = {[wallboard]:{[component]:req.body.data}};
        }
        fs.writeFileSync(themeFileLocation, JSON.stringify(finalData), function (err) {
            if (err) console.log("Unable to write theme to the non-existing file ",err)
        })
    }


//   if (wallboard && component) {
//     if (fs.existsSync(themeFileLocation)){
//         let data = JSON.parse(fs.readFileSync(themeFileLocation));
//         if (!data[wallboard]) {
//             let addedData = {[wallboard]:{[component]:req.body.data}};
//             fs.writeFileSync(themeFileLocation, JSON.stringify(data), function (err) {
//                 if (err) console.log("Unable to write theme to the non-existing file ",err)
//             })
//         }
//         else {
//             data[wallboard][component] = req.body.data;
//             fs.writeFileSync(themeFileLocation, JSON.stringify(data), function (err) {
//                 if (err) console.log("Unable to write theme to the file ", err);
//                 })
//         }
//         // console.log(data);
//         // console.log(req.body.data);
//         // // console.log(JSON.parse(req.body.data));
//         // // data[wallboard][component] = req.body.data;

//         // // let data = {[wallboard]: {[component]: req.body.data}};
//         // console.log("pre");
//         // console.log(data);
//         /*
    
//     Object.values(data.TV).forEach((element)=>console.log(element))
    
//         */
//         // console.log("Writing to file " + themeFileLocation);
//         // console.log(data);

//     }
//     else {
//         console.log("file doesn't exists");
//         console.log(wallboard);
//         let data = {[wallboard]:{[component]:req.body.data}};
//         fs.writeFileSync(themeFileLocation, JSON.stringify(data), function (err) {
//             if (err) console.log("Unable to write theme to the non-existing file ",err)
//         })
//     }
//   }

  // fs.writeFileSync(
  //   themeFileLocation,
  //   JSON.stringify()
  // )
//   console.log()
  res.end();
});


app.get("/versions", function(req, res) {
  var content = fs.readFileSync(
    prod ? "versions.json" : "server/versions.json"
  );
  res.send(JSON.parse(content));
});

app.post("/versions", function(req, res) {
  fs.writeFileSync(
    prod ? "versions.json" : "server/versions.json",
    JSON.stringify(req.body)
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

module.exports = app;