const { User, Token } = require("./Schemas");

// For 'async' functions, put 'await' in front before calling them
// The purpose is the wait for the function to complete its task before advancing

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
  return await Token.findOneAndUpdate({userid: id, accessToken: accessToken, refreshToken: refreshToken})
}
// Token;

module.exports = {
  getUserId, loginQuery, 
  getRefTokenByUserId, getRefTokenByUsername, deleteToken, addToken
}