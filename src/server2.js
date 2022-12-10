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

  // response: [{venueName: "venue 1", eventCnt: 3},...]
  app.get("/venueEventCnt", (req, res) => {
    Venue.find({}, "venue", (err, v) => {
      if (err) console.log(err);
      else {
        //console.log(v);
        v = v.map((arr) => arr.venue);
        let venueList = v.filter((ele, i, arr) => arr.indexOf(ele) === i);
        let venueEventCnt = venueList.map((ele) => ({
          venueName: ele,
          eventCnt: v.filter((ele2) => ele2 === ele).length,
        }));
        res.send(venueEventCnt);
        console.log("get venueEventCnt");
      }
    });
  });
});

// listen to port 5000
const server = app.listen(8889);
