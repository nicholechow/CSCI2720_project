

const url1 = "https://www.lcsd.gov.hk/datagovhk/event/events.xml";
const url2 = "https://www.lcsd.gov.hk/datagovhk/event/venues.xml";
const filePath = `${__dirname}`;
const option1 = {
  filename: 'file.xml'
}
const option2 = {
  filename: 'venue.xml'
}

const express = require('express');
const app = express();
const http = require('https');
const fs = require('fs');
const parser = require('xml2json');
var xmlDoc = require('xmldoc');
const download = require('download');

const mongoose = require('mongoose');
mongoose.connect(''); //Fill in your own connection string
//mongodb+srv://stu141:p651183W@cluster0.gbo7pn3.mongodb.net/stu141
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function() {
  //create data schema
  const VenueSchema = mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    datetime: { type: String, required: true },
    venue: { type: String ,required: true},
    latitude: { type: Number ,required: true},
    longitude: { type: Number ,required: true},
    description: { type: String },
    presenter: { type: String ,required: true},
    price: { type: Number }
  });

  const Venue = mongoose.model('Venue', VenueSchema);
    
  //download file
  download(url1,filePath, option1).then(() => {
    download(url2,filePath, option2).then(() => {
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

      xml = fs.readFileSync(filePath + '/file.xml','utf8');
      json = parser.toJson(xml, {object: true});
      xml2 = fs.readFileSync(filePath + '/venue.xml', 'utf8');
      json2 = parser.toJson(xml2, {object: true});
      
      
      

      function setup1() {
        for (var i = 0; i < json2.venues.venue.length; i++) {
          re = new RegExp(json2.venues.venue[i].id, 'g');
          check = xml.match(re).length;
          if (count == 10) {
            index1++;
            break;
          }

          if ((typeof(json2.venues.venue[i].latitude) == 'object' )|| (typeof(json2.venues.venue[i].longitude) == 'object') || check < 3) {
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
            price[index] = Number(json.events.event[i].pricee);
            index++;
          }
          if ((index + 1) % 4 == 0) {
            index++;
            break;
          };
        }
      }




      for (var i = 0; i <= 9; i++) {
        setup2(v[i]);
      }
      


      //remove null value
      t = t.filter(n => n);
      dt = dt.filter(n => n);
      d = d.filter(n => n);
      p = p.filter(n => n);
      price = price.filter(n => n);

      while (t.length < 30) {
        //index1 = 0;
        setup1();
        index = 0;

        for (var i = 0; i <= 9; i++) {
          setup2(v[i]);
        }
        t = t.filter(n => n);
        dt = dt.filter(n => n);
        d = d.filter(n => n);
        p = p.filter(n => n);
        price = price.filter(n => n);
      }

      //change null value
      for (var i = 0; i < price.length; i++) {
        if (typeof(price[i]) == 'object') price[i] = '/';
      }

      for (var i = 0; i < d.length; i++) {
        if (typeof(d[i]) == 'object') d[i] = '/';
      }

      //create data entries
      Venue.count(function (e, r) { 
        if (r == 0) {
          for (var i = 0; i <= 9; i++) {
            Venue.create({
            id: v[i],
            title: t[3 * i],
            datetime: dt[3 * i],
            venue: n[i],
            latitude: lat[i],
            longitude: lon[i],
            description: d[3 * i],
            presenter: p[3 * i],
            price: price[3 * i],
            });
          }
          for (var i = 0; i <= 9; i++) {
            Venue.create({
            id: v[i],
            title: t[3 * i + 1],
            datetime: dt[3 * i + 1],
            venue: n[i],
            latitude: lat[i],
            longitude: lon[i],
            description: d[3 * i + 1],
            presenter: p[3 * i + 1],
            price: price[3 * i + 1],
            });
          }
          for (var i = 0; i <= 9; i++) {
            Venue.create({
            id: v[i],
            title: t[3 * i + 2],
            datetime: dt[3 * i + 2],
            venue: n[i],
            latitude: lat[i],
            longitude: lon[i],
            description: d[3 * i + 2],
            presenter: p[3 * i + 2],
            price: price[3 * i + 2],
            });
          }
        }
      });
      Venue.find({}, (err, vn)=>{
        console.log(vn);
        console.log(v);
      });
      
    });

  });
});






const server = app.listen(3000);