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

import { localurl } from "./Utils";

export const serverPort=process.env.REACT_APP_serverPort
export const server2Port=process.env.REACT_APP_server2Port
export const authServerPort=process.env.REACT_APP_authServerPort
export const exampleServerPort=process.env.REACT_APP_exampleServerPort

export const authServerURL = localurl(authServerPort)
export const serverURL = localurl(serverPort)
export const server2URL = localurl(server2Port)
export const exampleServerURL = localurl(exampleServerPort)

export const ok = () => env.ok
export const mapboxglKey = process.env.REACT_APP_mapboxglKey
