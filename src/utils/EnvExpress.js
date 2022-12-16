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

require('dotenv').config()

const env = process.env;

const localurl = port => "http://localhost:" + port

const authServerPort = env.REACT_APP_authServerPort
const serverPort = env.REACT_APP_serverPort
const server2Port = env.REACT_APP_server2Port

const authServerURL = localurl(authServerPort)
const serverURL = localurl(serverPort)
const server2URL = localurl(server2Port)
console.log(server2URL, env.REACT_APP_server2Port)

const salt = env.salt
const mapboxglKey = env.mapboxglKey


module.exports ={
  env, localurl, authServerPort, serverPort, server2Port, 
  authServerURL, serverURL, server2URL, salt, mapboxglKey
}