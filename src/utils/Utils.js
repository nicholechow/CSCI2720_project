import { server2URL } from "../utils/EnvReact";

export const refreshPage = ()=>{
  window.location.reload();
}

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