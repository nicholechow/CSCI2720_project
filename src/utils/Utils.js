import { server2URL } from "../utils/EnvReact";

export const refreshPage = () => {
  window.location.reload();
}

export const isUser = () => sessionStorage.username != null && sessionStorage.accessToken != null && sessionStorage.refreshToken != null;
export const isAdmin = () => sessionStorage.username == "admin";
export const isLoggedIn = () => isUser || isAdmin;

export const logout = () => {
  fetch(server2URL + "/logout", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ username: sessionStorage.username }),
  }).then(res => {
    delete sessionStorage.username;
    delete sessionStorage.accessToken;
    delete sessionStorage.refreshToken;
    refreshPage();
  });
}