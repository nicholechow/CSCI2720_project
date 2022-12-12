// Global Variables

// Properties
// import PropertiesReader from 'properties-reader'
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('config.properties');
const mongoose = require('mongoose')
const { Schema } = mongoose;
mongoose.connect(properties.get("mongodb+srv://stu046:p554024W@cluster0.wenbhsm.mongodb.net/stu046")); //Fill in your own connection string

// Usage:
// import { foo } from './Vars';
// vars.foo = 1;

const vars = {};

const EventSchema = mongoose.Schema({
  eventid: { type: Number, required: true },
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

const CommentSchema = mongoose.Schema({
  venueid: { type: Number, required: true },
  username: { type: String, required: true },
  comment: { type: String, required: true },
});
const Comment = mongoose.model("Comment", CommentSchema);

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  pw: { type: String, required: true },
  fav: { type: Array },
});
const User = mongoose.model("User", UserSchema);

// export default vars;
export { vars, Event, Venue, Comment, User };