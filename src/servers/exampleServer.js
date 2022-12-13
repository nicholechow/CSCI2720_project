// require('dotenv').config()

const { env, exampleServerPort } = require("../utils/EnvExpress")
const { db } = require('../utils/Schemas');
const { getRefTokenByUsername, deleteToken, addToken } = require('../utils/Queries')
// const { authenticateToken } = require('./authServer')

const express = require('express')
const app = express()
app.use(express.json())

const jwt = require('jsonwebtoken')

const cors = require("cors");
app.use(cors());


db.on("error", console.error.bind(console, "Connection error:"));

// Link to database
// Post ( user input )
const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]

// Working
app.all('/authenticate', authenticateToken, (req, res) => {
  res.send("1")
})

// authenticateToken(req, res, next)
// Why next() ? https://expressjs.com/en/guide/writing-middleware.html
// If the current middleware function does not end the request-response cycle,
// it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.
//
// Usage:
// const { authenticateToken } = require('./authServer')
// app.get('/posts', authenticateToken, (req, res) => {
//   Normal stuff...
// })
function authenticateToken(req, res, next) {
  const header = req.headers['authorization']
  // If header is undefined, then token is undefined too
  const token = header && header.split(' ')[1]
  // 401: Unauthorized, this request did not send a token
  if (token == null){
    return res.sendStatus(401)
  }

  jwt.verify(token, env.ACCESS_TOKEN_KEY, (err, user) => {
    // console.log(err)
    // 403: Forbidden, this request is invalid(invalid/outdated token)
    if (err)
      return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Intentional typo
function postss() {
  app.get('/posts', authenticateToken, (req, res) => {
    console.log(res)
    console.log(posts)
    res.json(posts.filter(post => post.username === req.user.name))
  })
}

db.once("open", () => {
  postss()
});

app.listen(exampleServerPort)
