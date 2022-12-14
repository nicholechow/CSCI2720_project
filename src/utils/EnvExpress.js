require('dotenv').config()

const env = process.env;

const localurl = port => "http://localhost:" + port

const authServerPort = env.authServerPort
const serverPort = env.serverPort
const server2Port = env.server2Port
const exampleServerPort = env.exampleServerPort

const authServerURL = localurl(authServerPort)
const serverURL = localurl(serverPort)
const server2URL = localurl(server2Port)
const exampleServerURL = localurl(exampleServerPort)

const salt = env.salt
const mapboxglKey = env.mapboxglKey


module.exports ={
  env, localurl, authServerPort, serverPort, server2Port, exampleServerPort,
  authServerURL, serverURL, server2URL, exampleServerURL, salt, mapboxglKey
}