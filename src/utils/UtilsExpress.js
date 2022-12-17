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

const { salt } = require("./EnvExpress");
const { createHash } = require("crypto");
const { isLoading } = require("../servers/DataMiner");

const pwd = (str) =>
  createHash("sha256").update(salt.concat(str)).digest("hex");

// Wait up to 10s if database is loading
const _app = async (path, func, req, res) => {
  for (let i = 0; isLoading(); i++) {
    await new Promise((res) => setTimeout(res, 1000));
    if (i >= 30)
      // 503 Service Unavailable
      return res.send(503);
  }

  // For visualizing the order
  console.log("Before: " + path);
  await func(req, res);
  console.log("After: " + path);
};

const apost = (app, path, func) =>
  app.post(path, async (req, res) => await _app(path, func, req, res));
const aget = (app, path, func) =>
  app.get(path, async (req, res) => await _app(path, func, req, res));
const aput = (app, path, func) =>
  app.put(path, async (req, res) => await _app(path, func, req, res));
const adelete = (app, path, func) =>
  app.delete(path, async (req, res) => await _app(path, func, req, res));

module.exports = { pwd, apost, aget, aput, adelete };
