// request handle
// execute node src/server2.js

const express = require("express");
const app = express();
var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://stu046:p554024W@cluster0.wenbhsm.mongodb.net/stu046"
);
//mongodb+srv://stu046:p554024W@cluster0.wenbhsm.mongodb.net/stu046
//mongodb+srv://stu141:p651183W@cluster0.gbo7pn3.mongodb.net/stu141

const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));
// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open...");
  const EventSchema = mongoose.Schema({
    venueid: { type: Number, required: true },
    title: { type: String, required: true },
    datetime: { type: String, required: true },
    venuename: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: { type: String, required: true },
    presenter: { type: String, required: true },
    price: { type: String, required: true },
  });

  const Event = mongoose.model("Event", EventSchema);

  const VenueSchema = mongoose.Schema({
    id: { type: Number, required: true },
    venue: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  });

  const Venue = mongoose.model("Venue", VenueSchema);

  const bodyParser = require("body-parser");
  // Use parser to obtain the content in the body of a request
  app.use(bodyParser.urlencoded({ extended: false }));
  const cors = require("cors");
  app.use(cors());
  app.use(bodyParser.json());

  // get all venue name with its number of events
  // response: [{venueId: 1234, venueName: "venue 1", eventCnt: 3},...]
  app.get("/venueEventCnt", (req, res) => {
    Event.find({}, "venueid venuename", (err, v) => {
      if (err) console.log(err);
      else {
        //console.log(v);
        let venueId = v.map((arr) => arr.venueid);
        let venueList = v.filter((ele, i) => venueId.indexOf(venueId[i]) === i);
        let venueEventCnt = venueList.map((ele) => ({
          venueId: ele.venueid,
          venueName: ele.venuename,
          eventCnt: venueId.filter((ele2) => ele2 === ele.venueid).length,
        }));
        res.send(venueEventCnt);
        console.log("get venueEventCnt");
      }
    });
  });

  // get venue name from id
  app.get("/venueName/:venueId", (req, res) => {
    Venue.findOne({ id: req.params["venueId"] }, "venue", (err, v) => {
      if (err) console.log(err);
      else {
        //if (v==null) res.status(404).send("Event not found");
        res.send(v.venue);
        console.log("get venue name");
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
          console.log("get venue latitude and longitude");
        }
      }
    );
  });

  app.get("/allVenueLatLong/", (req, res) => {
    Venue.find({}, "latitude longitude", (err, v) => {
      if (err) console.log(err);
      else {
        res.send(v);
        console.log("get all venue latitude and longitude");
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
          console.log("get venue events details");
        }
      }
    );
  });
  app.get("/listall", (req, res) => {
    Venue.find({}, (err, v) => {
      if (err) console.log(err);
      else {
        res.send(v);
      }
    });
  });
});

// listen to port 5000
const server = app.listen(8889);
