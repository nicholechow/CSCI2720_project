const { salt } = require("./EnvExpress")
const { createHash } = require("crypto");
const { isLoading } = require("../servers/DataMiner");

const pwd = str => createHash('sha256').update(salt.concat(str)).digest('hex');

// Wait up to 10s if database is loading
const _app = async (func, req, res) => {
  for (let i = 0; isLoading(); i++) {
    await new Promise(res => setTimeout(res, 1000))
    if (i >= 10)
    // 503 Service Unavailable
      return res.send(503)
  }
  
  // For visualizing the order
  console.log("Before")
  await func(req, res)
  console.log("After")
}

const apost = (app, path, func) => {
  // console.log(app, path)
  app.post(path, async (req, res) => await _app(func, req, res))
}
const aget = (app, path, func) => app.get(path, async (req, res) => await _app(func, req, res))
const aput = (app, path, func) => app.put(path, async (req, res) => await _app(func, req, res))
const adelete = (app, path, func) => app.delete(path, async (req, res) => await _app(func, req, res))

module.exports = { pwd, apost, aget, aput, adelete }