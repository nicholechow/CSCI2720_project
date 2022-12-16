const filePath = __dirname + process.env.dataPath;
// const express = require("express");
// const app = express();
const fs = require("fs");
const parser = require("xml2json");
const download = require("download");
const { Event, Venue } = require('../utils/Schemas');

let dirty = false;
const isLoading = () => dirty;

const datamine = async db => {
  if (dirty)
    return -1;

  dirty = true;
  db.dropCollection("venues");
  db.dropCollection("events");

  //download file
  await download(process.env.eventsURL, filePath, process.env.eventsPath).then(async () => {
    await download(process.env.venuesURL, filePath, process.env.venuesPath).then(async () => {
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

      xml = fs.readFileSync(filePath + '/' + process.env.eventsPath, "utf8");
      json = parser.toJson(xml, { object: true });
      xml2 = fs.readFileSync(filePath + '/' + process.env.venuesPath, "utf8");
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

          if (typeof(json2.venues.venue[i].latitude) == "object" || typeof(json2.venues.venue[i].longitude) == "object" || 
            check < 3 || json2.venues.venue[i].latitude == lat[index1 - 1]) {
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

      const temp = []
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
        
        // const temp = []
        for (var a = 0; a < t.length; a++) {
            temp.push({
              eventid: e[a],
              venueid: v[j],
              title: t[a],
              datetime: dt[a],
              venuename: n[j],
              latitude: lat[j],
              longitude: lon[j],
              description: d[a],
              presenter: p[a],
              price: price[a]
            })
          // await Event.create({
          //   eventid: e[a],
          //   venueid: v[j],
          //   title: t[a],
          //   datetime: dt[a],
          //   venuename: n[j],
          //   latitude: lat[j],
          //   longitude: lon[j],
          //   description: d[a],
          //   presenter: p[a],
          //   price: price[a],
          // });
        }
        // const eee = 
        // await Event.insertMany(temp)
        // console.log(eee)
      }
      await Event.insertMany(temp)

      temp.splice(0, temp.length)

      // venues = [] 
      for (var b = 0; b <= 9; b++) {
        temp.push({
          id: v[b],
          venue: n[b],
          latitude: lat[b],
          longitude: lon[b]
        });
        // await Venue.create({
        //   id: v[b],
        //   venue: n[b],
        //   latitude: lat[b],
        //   longitude: lon[b],
        // });
      }
      Venue.insertMany(temp)
    });
  });
  dirty = false;
  return 0;
}

module.exports = { isLoading, datamine }