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

const { env } = require("./EnvReact")

export function authenticateToken(req, res, next) {
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