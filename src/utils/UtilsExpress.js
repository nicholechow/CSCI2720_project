const { salt } = require("./EnvExpress")
const { createHash } = require("crypto");

const pwd = str => createHash('sha256').update(salt.concat(str)).digest('hex');

module.exports = { pwd }