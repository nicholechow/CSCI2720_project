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