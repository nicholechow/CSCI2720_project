// We really should rename this file to something more representative...
// Like DatabaseManagerServer.js

// request handle
// execute node src/server2.js5
const { env, authServerURL, mapboxglKey } = require("../utils/EnvExpress");
const { pwd } = require("../utils/UtilsExpress");

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

// From server.js
// Configs
// require('dotenv').config()
const { serverPort } = require("../utils/EnvExpress");
// // Properties
// const PropertiesReader = require('properties-reader');
// const properties = PropertiesReader('config.properties');

// const url1 = "https://www.lcsd.gov.hk/datagovhk/event/events.xml";
// const url2 = "https://www.lcsd.gov.hk/datagovhk/event/venues.xml";
const filePath = __dirname + process.env.dataPath;

const fs = require("fs");
const parser = require("xml2json");
const download = require("download");

// Unused
// const http = require("https");
// const xmlDoc = require("xmldoc");

// const mongoose = require("mongoose");
// const { Schema } = mongoose;
// mongoose.connect(properties.get("dbURL"));

const { Event, Venue, Comment, User, db } = require("../utils/Schemas");

// const mongoose = require("mongoose");
// mongoose.connect(properties.get("dbURL"));
// const db = mongoose.connection;

// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));

// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open...");

  const bodyParser = require("body-parser");
  // Use parser to obtain the content in the body of a request
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // app.get() / app.post() / app.delete()
  // TODO:: Maybe sort sort this for easier navigation

  app.put("/loadData", (req, res) => {
    db.dropCollection("venues");
    db.dropCollection("events");

    //download file
    download(process.env.eventsURL, filePath, process.env.eventsPath).then(
      () => {
        download(process.env.venuesURL, filePath, process.env.venuesPath).then(
          () => {
            //read file and convert to json
            var e = [];
            var v = [];
            var lat = [];
            var lon = [];
            var t = [];
            var dt = [];
            var n = [];
            var d = [];
            var p = [];
            var price = [];
            var index = 0;
            var index1 = 0;
            var count = 0;
            var xml;
            var json;
            var xml2;
            var json2;
            var re;
            var check = 0;

            xml = fs.readFileSync(
              filePath + "/" + process.env.eventsPath,
              "utf8"
            );
            json = parser.toJson(xml, { object: true });
            xml2 = fs.readFileSync(
              filePath + "/" + process.env.venuesPath,
              "utf8"
            );
            json2 = parser.toJson(xml2, { object: true });

            // I think setup1() can be reduced into just the for loop, since there is only one usage
            function setup1() {
              for (var i = 0; i < json2.venues.venue.length; i++) {
                re = new RegExp(json2.venues.venue[i].id, "g");
                check = xml.match(re).length;
                if (count == 10) {
                  index1++;
                  break;
                }

                if (
                  typeof json2.venues.venue[i].latitude == "object" ||
                  typeof json2.venues.venue[i].longitude == "object" ||
                  check < 3 ||
                  json2.venues.venue[i].latitude == lat[index1 - 1]
                ) {
                } else {
                  v[index1] = Number(json2.venues.venue[i].id);
                  n[index1] = json2.venues.venue[i].venuee;
                  lat[index1] = Number(json2.venues.venue[i].latitude);
                  lon[index1] = Number(json2.venues.venue[i].longitude);
                  count++;
                  index1++;
                }
              }
            }

            setup1();

            // I think setup2() can be reduced into just the for loop and put inside the for loop, since there is only one usage
            function setup2(id) {
              for (var i = 0; i < json.events.event.length; i++) {
                if (json.events.event[i].venueid == id) {
                  e[index] = Number(json.events.event[i].id);
                  t[index] = json.events.event[i].titlee;
                  dt[index] = json.events.event[i].predateE;
                  d[index] = json.events.event[i].desce;
                  p[index] = json.events.event[i].presenterorge;
                  price[index] = json.events.event[i].pricee;
                  index++;
                }
              }
            }

            for (var j = 0; j <= 9; j++) {
              setup2(v[j]);
              index = 0;

              //change null value
              for (var i = 0; i < price.length; i++) {
                if (typeof price[i] == "object") price[i] = "/";
              }

              for (var k = 0; k < d.length; k++) {
                //if (typeof(price[i]) == 'object') price[i] = '/';
                if (typeof d[k] == "object") d[k] = "/";
              }

              for (var a = 0; a < t.length; a++) {
                Event.create({
                  eventid: e[a],
                  venueid: v[j],
                  title: t[a],
                  datetime: dt[a],
                  venuename: n[j],
                  latitude: lat[j],
                  longitude: lon[j],
                  description: d[a],
                  presenter: p[a],
                  price: price[a],
                });
              }
            }

            for (var b = 0; b <= 9; b++) {
              Venue.create({
                id: v[b],
                venue: n[b],
                latitude: lat[b],
                longitude: lon[b],
              });
            }
            res.send("load data");
            console.log("load data");
          }
        );
      }
    );
  });

  //login
  // 1: user
  // 2: admin
  app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let loginState = -1;
    let token = {};
    let status = -1;

    const ret = () =>
      res.json({
        username: username,
        password: password,
        loginState: loginState,
        token: token,
        status: status,
      });

    if (username == "admin" && username == password) {
      // Admin
      loginState = 2;
      return ret();
    }

    // User
    token = await fetch(authServerURL + "/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (res.status in [401, 403]) {
          loginState = 0;
          return {};
        }
        loginState = 1;
        return res.json();
      })
      .catch((err) => {
        console.log("8889/login" + err);
        loginState = -2;
      });

    ret();
  });

  app.post("/logout", async (req, res) => {
    const username = req.body.username;

    if (username != "admin") {
      // User
      await fetch(authServerURL + "/logout", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username }),
      });
    }

    console.log("Logout");
    res.redirect(204, "/");
  });

  // get all venue name with its number of events
  app.get("/venueEventCnt", (req, res) => {
    Event.find({}, "venueid venuename latitude longitude", (err, v) => {
      if (err) console.log(err);
      else {
        //console.log(v);
        let venueId = v.map((arr) => arr.venueid);
        let venueList = v.filter((ele, i) => venueId.indexOf(venueId[i]) === i);
        let venueEventCnt = venueList.map((ele) => ({
          venueId: ele.venueid,
          venueName: ele.venuename,
          latitude: ele.latitude,
          longitude: ele.longitude,
          eventCnt: venueId.filter((ele2) => ele2 === ele.venueid).length,
        }));
        res.send(venueEventCnt);
        // console.log("get venueEventCnt");
      }
    });
  });

  // get user favourite location
  // return [{id: 123, venue: abc},...]
  app.get("/fav/:username", (req, res) => {
    User.findOne({ username: req.params["username"] }, "fav", (err, f) => {
      if (err) console.log(err);
      else {
        Venue.find({}, "id venue", (err2, v) => {
          if (err2) console.log(err2);
          else {
            if (f !== null) {
              let list = v
                .filter((ele) => f.fav.includes(ele.id))
                .map((ele2) => ({ id: ele2.id, venue: ele2.venue }));
              res.send(list);
              //res.send(f.fav);
              //console.log(list);
              // console.log("get user fav");
            } else {
              res.send();
            }
          }
        });
      }
    });
  });

  // get whether it is a user favourite location
  // return true or false
  app.get("/fav/:username/:venueId", (req, res) => {
    User.findOne({ username: req.params["username"] }, "fav", (err, f) => {
      if (err) console.log(err);
      else {
        res.send(f.fav.includes(req.params["venueId"]));
        //console.log(f.fav);
        // console.log("get user fav");
      }
    });
  });

  // update user fav
  app.put("/changeFav/:username", (req, res) => {
    User.findOne({ username: req.params["username"] }, "fav", (err, f) => {
      if (err) console.log(err);
      else {
        if (f.fav.includes(req.body["venueId"]))
          f.fav.remove(req.body["venueId"]);
        else f.fav.push(req.body["venueId"]);
        f.save();
        res.send();
        console.log("update user fav");
      }
    });
  });

  // get venue name from id
  app.get("/venueName/:venueId", (req, res) => {
    Venue.findOne({ id: req.params["venueId"] }, "venue", (err, v) => {
      if (err) console.log(err);
      else {
        if (v === null) {
          res.status(404).send("not found");
        } else {
          res.send(v.venue);
          console.log(v.venue);
          console.log("get venue name");
        }
      }
    });
  });

  // get venue Latitude and longitude from id
  app.get("/venueLatLong/:venueId", (req, res) => {
    Venue.findOne(
      { id: req.params["venueId"] },
      "latitude longitude",
      (err, v) => {
        if (err) console.log(err);
        else {
          res.send(v);
          // console.log("get venue latitude and longitude");
        }
      }
    );
  });

  // get all venues' Latitude and longitude
  app.get("/allVenueLatLong/", (req, res) => {
    Venue.find({}, (err, v) => {
      if (err) console.log(err);
      else {
        res.send(v);
        // console.log("get all venue latitude and longitude");
      }
    });
  });

  // get all events with details of a venue
  app.get("/venueEvents/:venueId", (req, res) => {
    Event.find(
      { venueid: req.params["venueId"] },
      "title datetime description presenter price",
      (err, v) => {
        if (err) console.log(err);
        else {
          res.send(v);
          // console.log("get venue events details");
        }
      }
    );
  });

  // add comment
  app.put("/createComment/:venueId", (req, res) => {
    if (req.body["commentContent"].length !== 0) {
      Comment.create(
        {
          username: req.body["username"],
          comment: req.body["commentContent"],
          venueid: req.params["venueId"],
        },
        (err, ne) => {
          if (err) {
            res.send(err);
          }
          res.send();
        }
      );
    }
  });

  // get all events
  app.get("/listall", (req, res) => {
    Event.find({}, (err, v) => {
      if (err) console.log(err);
      else res.send(v);
    });
  });

  // delete event by event id
  app.delete("/delete/:eventId", (req, res) => {
    Event.findOne({ eventid: Number(req.params["eventId"]) }).exec(function (
      err,
      d
    ) {
      if (d != null) {
        d.remove();
        res.send(
          "Event ID: " +
            String(req.params["eventId"]) +
            " has been deleted successfully."
        );
      } else {
        res.send(
          "Event ID: " + String(req.params["eventId"]) + " is not found."
        );
      }
    });
  });

  // get event by event id
  app.get("/listone/:eventId", (req, res) => {
    Event.findOne({ eventid: Number(req.params["eventId"]) }, (err, e) => {
      if (e != null) {
        res.send(e);
      } else {
      }
    });
  });

  // get venue by venue id
  app.get("/listvenue/:venueId", (req, res) => {
    let buf = "";
    Venue.findOne({ id: Number(req.params["venueId"]) }, (err, v) => {
      if (v != null) {
        res.send(
          v.venue + "<Br>" + String(v.latitude) + "<Br>" + String(v.longitude)
        );
      } else {
        res.send("404");
      }
    });
  });

  // create event
  app.post("/create", async (req, res) => {
    let currentid = 0;
    Venue.findOne({ id: Number(req.body["venueid"]) }, (err, v) => {
      if (v != null) {
        Event.find({})
          .sort({ eventid: -1 })
          .limit(1)
          .exec((err1, val) => {
            if (val != null) {
              currentid = val[0].eventid + 1;
            } else {
              currentid = 1;
            }
            Event.create(
              {
                eventid: currentid,
                venueid: Number(req.body["venueid"]),
                title: req.body["title"],
                datetime: req.body["datetime"],
                venuename: String(v.venue),
                latitude: Number(v.latitude),
                longitude: Number(v.longitude),
                description: req.body["description"],
                presenter: req.body["presenter"],
                price: req.body["price"],
              },
              (err2, e) => {
                if (err2) {
                  console.log("error");
                } else {
                  return res.send("Event created successfully");
                }
              }
            );
          });
      } else {
        return res.send("Venue not found");
      }
    });
  });

  // update event by event id
  app.put("/update/:eventId", async (req, res) => {
    let buf = "";
    Event.findOne({ eventid: Number(req.params["eventId"]) }, (err, e) => {
      if (e != null) {
        Venue.findOne({ id: Number(req.body["venueid"]) }, (err1, v) => {
          if (v != null) {
            e.title = req.body["title"];
            e.venueid = Number(req.body["venueid"]);
            e.venuename = v.venue;
            e.datetime = req.body["datetime"];
            e.latitude = v.latitude;
            e.longitude = v.longitude;
            e.description = req.body["description"];
            e.presenter = req.body["presenter"];
            e.price = req.body["price"];
            e.save();
            buf = "Event updated successfully";
          } else {
            buf = "Venue ID does not exist";
          }
        });
      } else {
        buf = "Event ID does not exist";
      }
    });

    setTimeout(() => {
      res.send(buf);
    }, "70");
  });

  // get venues by keyword
  app.get("/search/:keyword", (req, res) => {
    Event.find(
      { venuename: { $regex: req.params["keyword"], $options: "i" } },
      "venueid venuename latitude longitude",
      (err, v) => {
        if (err) console.log(err);
        else {
          let venueId = v.map((arr) => arr.venueid);
          let venueList = v.filter(
            (ele, i) => venueId.indexOf(venueId[i]) === i
          );
          let venueEventCnt = venueList.map((ele) => ({
            venueId: ele.venueid,
            venueName: ele.venuename,
            latitude: ele.latitude,
            longitude: ele.longitude,
            eventCnt: venueId.filter((ele2) => ele2 === ele.venueid).length,
          }));
          res.send(venueEventCnt);
          // console.log("get search");
        }
      }
    );
  });

  // get comments by venue id
  app.get("/comment/:venueId", (req, res) => {
    Comment.find(
      { venueid: req.params["venueId"] },
      "username comment",
      (err, v) => {
        if (err) console.log(err);
        else {
          res.send(v);
          // console.log("get comment");
        }
      }
    );
  });

  // delete event by event id
  app.delete("/delete/:eventId", (req, res) => {
    Event.findOne({ eventid: Number(req.params["eventId"]) }).exec(function (
      err,
      d
    ) {
      if (d != null) {
        d.remove();
        res.send(
          "Event ID: " +
            String(req.params["eventId"]) +
            " has been deleted successfully."
        );
      } else {
        res.send(
          "Event ID: " + String(req.params["eventId"]) + " is not found."
        );
      }
    });
  });

  //get all users
  app.get("/userlist", (req, res) => {
    User.find({}, (err, u) => {
      if (err) console.log(err);
      else res.send(u);
    });
  });

  //get user by username
  app.get("/user/:username", (req, res) => {
    User.findOne({ username: String(req.params["username"]) }, (err, u) => {
      if (u != null) {
        res.send(u);
      } else {
      }
    });
  });

  //create user
  app.post("/usercreate", (req, res) => {
    //User.findOne({username: String(req.body['username']) }, (err,u) => {
    User.create(
      {
        username: String(req.body["username"]),
        pw: pwd(String(req.body["pw"])),
        fav: req.body["fav"],
      },
      (err, u) => {
        if (err) {
          console.log(err);
        } else {
          res.send("User created successfully");
        }
      }
    );
  });

  //update user by username
  app.put("/userupdate/:username", (req, res) => {
    let buf = "";
    User.findOne({ username: String(req.params["username"]) }, (err, u) => {
      if (u != null) {
        u.username = String(req.body["username"]);
        u.pw = String(req.body["pw"]);
        u.fav = req.body["fav"];
        u.save();
        buf = "User information updated successfully";
      } else {
        buf = "The username does not exist";
      }
    });
    setTimeout(() => {
      res.send(buf);
    }, "70");
  });

  //delete user by username
  app.delete("/userdelete/:username", (req, res) => {
    User.findOne({ username: String(req.params["username"]) }).exec(function (
      err,
      u
    ) {
      if (u != null) {
        u.remove();
        res.send(
          "User " +
            String(req.params["username"]) +
            " has been deleted successfully."
        );
      } else {
        res.send("User " + String(req.params["username"]) + "is not found.");
      }
    });
  });

  // get env variables
  app.get("/env", (_, res) => res.json({ mapboxglKey: mapboxglKey }));
});

// listen to port
const server = app.listen(env.server2Port);
