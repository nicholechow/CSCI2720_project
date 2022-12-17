/*
 * CSCI2720/ESTR2106 Course Project
 * A Social Map of Events
 *
 * We declare that the assignment here submitted is original
 * except for source material explicitly acknowledged,
 * and that the same or closely related material has not been
 * previously submitted for another course.
 * We also acknowledge that we are aware of University policy and
 * regulations on honesty in academic work, and of the disciplinary
 * guidelines and procedures applicable to breaches of such
 * policy and regulations, as contained in the website.
 *
 * University Guideline on Academic Honesty:
 *   http://www.cuhk.edu.hk/policy/academichonesty
 * Faculty of Engineering Guidelines to Academic Honesty:
 *   https://www.erg.cuhk.edu.hk/erg/AcademicHonesty
 *
 * Student Name: Choi Man Kit, Chow Tsz Ching, Chui Kin Ho, Heung Tsz Kit, Tse Chi Man, Yu Kin Lam
 * Student ID  : 1155144350, 1155142491, 1155170952, 1155143358, 1155142152, 1155143885
 * Date        : 17 Dec 2022
 */

// Here saves the Schemas of the Database, so no need to have more than 1 copies of Schemas in the project.
// Usage:
// const { Event, Venue, Comment, User, db } = require('./Schemas');

// Configs
require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.dbURL);
const db = mongoose.connection;

const EventSchema = mongoose.Schema({
  eventid: { type: Number, required: true , unique: true},
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
  id: { type: Number, required: true, unique: true},
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

const TokenSchema = mongoose.Schema({
  userid: { type: String, required: true, unique: true, ref: "User" },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
});
const Token = mongoose.model("Token", TokenSchema);

module.exports = { db, Event, Venue, Comment, User, Token };
