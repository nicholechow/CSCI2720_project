// request handle
// execute node src/server2.js

const express = require("express");
const app = express();
var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://stu046:p554024W@cluster0.wenbhsm.mongodb.net/stu046" //Fill in your own
);
//mongodb+srv://stu046:p554024W@cluster0.wenbhsm.mongodb.net/stu046

const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));
// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open...");
  const VenueSchema = mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    datetime: { type: String, required: true },
    venue: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: { type: String },
    presenter: { type: String, required: true },
    price: { type: Number },
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
    Venue.find({}, "id venue", (err, v) => {
      if (err) console.log(err);
      else {
        //console.log(v);
        let venueId = v.map((arr) => arr.id);
        let venueList = v.filter((ele, i) => venueId.indexOf(venueId[i]) === i);
        let venueEventCnt = venueList.map((ele) => ({
          venueId: ele.id,
          venueName: ele.venue,
          eventCnt: venueId.filter((ele2) => ele2 === ele.id).length,
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
        res.send(v.venue);
        console.log("get venue name");
      }
    });
  });

  // get all events with details of a venue
  app.get("/venueEvents/:venueId", (req, res) => {
    Venue.find(
      { id: req.params["venueId"] },
      "title datetime description presenter",
      (err, v) => {
        if (err) console.log(err);
        else {
          res.send(v);
          console.log("get venue events details");
        }
      }
    );
  });
});

// listen to port 5000
const server = app.listen(8889);
