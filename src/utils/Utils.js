import { server2URL,authServerPort, serverPort, server2Port, exampleServerPort } from "../utils/EnvReact"

export const localurl = port => "http://localhost:" + port

// export const authServerURL = localurl(authServerPort)
// export const serverURL = localurl(serverPort)
// export const server2URL = localurl(server2Port)
// export const exampleServerURL = localurl(exampleServerPort)

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