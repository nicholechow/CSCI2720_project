// Here saves the Schemas of the Database, so no need to have more than 1 copies of Schemas in the project.
// Usage:
// const { Event, Venue, Comment, User, db } = require('./Schemas');

// Properties
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('config.properties');

const mongoose = require('mongoose')
mongoose.connect(properties.get("dbURL"));
const db = mongoose.connection;

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
Event = mongoose.model("Event", EventSchema);

const VenueSchema = mongoose.Schema({
  id: { type: Number, required: true },
  venue: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});
Venue = mongoose.model("Venue", VenueSchema);

const CommentSchema = mongoose.Schema({
  venueid: { type: Number, required: true },
  username: { type: String, required: true },
  comment: { type: String, required: true },
});
Comment = mongoose.model("Comment", CommentSchema);

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  pw: { type: String, required: true },
  fav: { type: Array },
});
User = mongoose.model("User", UserSchema);

exports.db = db;
exports.Event = Event;
exports.Venue = Venue;
exports.Comment = Comment;
exports.User = User;