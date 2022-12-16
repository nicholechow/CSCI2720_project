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

import { server2URL } from "../utils/EnvReact"

export const localurl = port => "http://localhost:" + port

export const refreshPage = () => window.location.reload()

export const isUser = () => sessionStorage.username != null && sessionStorage.accessToken != null && sessionStorage.refreshToken != null
export const isAdmin = () => sessionStorage.username === "admin"
export const isLoggedIn = () => isUser() || isAdmin()

export const logout = () => {
  fetch(server2URL + "/logout", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ username: sessionStorage.username }),
  }).then(() => {
    delete sessionStorage.username;
    delete sessionStorage.accessToken;
    delete sessionStorage.refreshToken;
    refreshPage()
  })
}