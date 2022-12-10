const url1 = "https://www.lcsd.gov.hk/datagovhk/event/events.xml";
const url2 = "https://www.lcsd.gov.hk/datagovhk/event/venues.xml";
const filePath = `${__dirname}`;
const option1 = {
  filename: "file.xml",
};
const option2 = {
  filename: "venue.xml",
};

const express = require("express");
const app = express();
const http = require("https");
const fs = require("fs");
const parser = require("xml2json");
var xmlDoc = require("xmldoc");
const download = require("download");

const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.connect(""); //Fill in your own connection string
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));

db.once("open", function () {
  //create data schema
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

  const UserSchema = mongoose.Schema({
    username: {type: String ,required: true, unique: true},
    pw: {type: String ,required: true},
    fav: {type: Array}
  });

  const User = mongoose.model('User', UserSchema);

  const CommentSchema = mongoose.Schema({
    commentid: {type: Number, required: true},
    venueid: {type: Number, required: true},
    userid: {type: Number,required: true},
    content: {type: String, required: true}
  });

  const Comment = mongoose.model('Comment', CommentSchema);*/
  db.dropCollection("venues");
  db.dropCollection("events");

  //download file
  download(url1, filePath, option1).then(() => {
    download(url2, filePath, option2).then(() => {
      //read file and convert to json
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

      xml = fs.readFileSync(filePath + "/file.xml", "utf8");
      json = parser.toJson(xml, { object: true });
      xml2 = fs.readFileSync(filePath + "/venue.xml", "utf8");
      json2 = parser.toJson(xml2, { object: true });

      function setup1() {
        for (var i = 0; i < json2.venues.venue.length; i++) {
          re = new RegExp(json2.venues.venue[i].id, "g");
          check = xml.match(re).length;
          if (count == 10) {
            index1++;
            break;
          }

          if (
            (typeof json2.venues.venue[i].latitude ||
              typeof json2.venues.venue[i].longitude) == "object" ||
            check < 3
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

      function setup2(id) {
        for (var i = 0; i < json.events.event.length; i++) {
          if (json.events.event[i].venueid == id) {
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
    });
  });
});

const server = app.listen(3000);
