/**
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

const { User, Token, Event } = require("./Schemas");

// For 'async' functions, put 'await' in front before calling them
// The purpose is the wait for the function to complete its task before advancing

// Event
async function getEvents() {
  return await Event.find({});
}
// Event


// User
async function getUserId(username) {
  let res = await User.exists({ username: username });
  return res == null ? null : res._id;
}

async function loginQuery(username, password) {
  return await User.exists({ username: username, pw: password });
}
// User


// Token
async function getRefTokenByUserId(id) {
  let res = await Token.findOne({ userid: id }, 'refreshToken');
  return res == null ? null : res.refreshToken;
} 

async function getRefTokenByUsername(username) {
  const id = await getUserId(username);
  return id == null ? null : getRefTokenByUserId(id);
}

async function deleteToken(username) {
  const id = await getUserId(username);
  return id == null ? null : await Token.deleteMany({userid: id});
}

async function addToken(username, accessToken, refreshToken) {
  const id = await getUserId(username);
  if (id == null) 
    return null;

  if (!await Token.exists({userid: id}))
    return await Token.create({userid: id, accessToken: accessToken, refreshToken: refreshToken})
  return await Token.findOneAndUpdate({userid: id}, {accessToken: accessToken, refreshToken: refreshToken})
}
// Token;

module.exports = {
  getUserId, loginQuery, getEvents,
  getRefTokenByUserId, getRefTokenByUsername, deleteToken, addToken
}