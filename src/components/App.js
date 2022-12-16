import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Home, { setMapboxglKey } from "./Home";
import Login from "./Login";
import Venue from "./Venue";
import Search from "./Search";
import Account from "./Account";
import { server2URL } from "../utils/EnvReact";
import { isUser, isLoggedIn, logout } from "../utils/Utils";
import { onLoad } from "../utils/EnvReact";
import mapboxgl from "mapbox-gl";
import { mapboxglKey } from "../utils/EnvReact";

// App
function App(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displaytext] = useState("");
  const [displaylink, setDisplaylink] = useState("");
  const [adminflag] = useState(
    props.adminflag === undefined ? false : props.adminflag
  );
  const [loginflag] = useState(
    props.loginflag === undefined ? false : props.loginflag
  );
  const [keyword, setKeyword] = useState("");
  const [loadState, setLoadState] = useState(false);
  //const getLoadState = () => loadState;

  useEffect(
    () => async () => {
      //console.log(getLoadState);
      console.log(mapboxglKey);
      await onLoad();
      setMapboxglKey();
    },
    [loadState]
  );

  useEffect(() => {
    window.addEventListener("load", () => {
      fetch(server2URL + "/loadData", {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
        .then()
        .then(() => {
          setTimeout(() => {
            setLoadState(true);
          }, 3000);
        })
        .catch((err) => console.log(err));
    });
  });

  const handleChangeUsername = (e) => setUsername(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    let loginbody = {
      username: username,
      password: password,
    };
    fetch(server2URL + "/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(loginbody),
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json)
        switch (json.loginState) {
          case 2:
            setDisplaylink("/admin");
            setTimeout(
              () => document.getElementById("autoclick").click(),
              "70"
            );
            sessionStorage.username = "admin";
            /*
            fetch(server2URL + "/loadData", {
              method: "PUT",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            })
              .then()
              .then(() => {
                setLoadState(true);
              })
              .catch((err) => console.log(err));
              */
            break;

          case 1:
            setDisplaylink("/user");
            setTimeout(
              () => document.getElementById("autoclick").click(),
              "70"
            );
            /*
            fetch(server2URL + "/loadData", {
              method: "PUT",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            })
              .then()
              .then(() => {
                setLoadState(true);
              })
              .catch((err) => console.log(err));
              */

            if (!json.username) delete sessionStorage.username;
            else sessionStorage.username = json.username;

            if (!json.token.accessToken) delete sessionStorage.accessToken;
            else sessionStorage.accessToken = json.token.accessToken;

            if (!json.token.refreshToken) delete sessionStorage.refreshToken;
            else sessionStorage.refreshToken = json.token.refreshToken;

            break;

          default:
            document.getElementById("123").innerText =
              "Please input correct username and password";
        }
      });
  };

  const load = () => {
    //console.log(document.querySelector("#keyword_iput").value);
    setKeyword(document.querySelector("#keyword_iput").value);
  };

  return (
    <>
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              CSCI2720 Group 19's Project
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/" className="nav-link active" aria-current="page">
                    Home
                  </Link>
                </li>
              </ul>
              {isLoggedIn() ? (
                <div className="d-flex">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    id="keyword_iput"
                    onChange={() => load()}
                  ></input>
                  <Link
                    to={"/search/" + keyword}
                    className="btn btn-outline-success"
                    type="submit"
                    id="search_button"
                  >
                    Search
                  </Link>
                </div>
              ) : null}

              {isLoggedIn() ? (
                <div className="d-flex">
                  {isUser() ? (
                    <Link to="account" className="btn btn-warning mx-1">
                      Account: {sessionStorage.username}
                    </Link>
                  ) : null}
                  <a
                    className="btn"
                    type="submit"
                    id="search_button"
                    // href="../"
                    onClick={() => logout()}
                  >
                    Logout
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </nav>
        <hr className="m-0 mb-3" />
        <Routes>
          <Route
            path="/login/signin"
            element={
              <Login
                data={{
                  username: username,
                  password: password,
                  displaylink: displaylink,
                  displaytext: displaytext,
                  adminflag: adminflag,
                  loginflag: loginflag,
                  handleChangeUsername: handleChangeUsername.bind(this),
                  handleChangePassword: handleChangePassword.bind(this),
                  handleSubmit: handleSubmit.bind(this),
                }}
              />
            }
          />
          <Route
            path="/debug"
            element={<Home loggedIn={true} loadState={loadState} />}
          />
          <Route
            path="/venue/:venueId"
            element={<Venue loadState={loadState} />}
          />
          <Route
            path="/search/:keyword"
            element={<Search loadState={loadState} />}
          />
          <Route path="/account" element={<Account loadState={loadState} />} />
          <Route
            path="/user"
            element={
              <Home
                loggedIn={loginflag}
                isAdmin={adminflag}
                loadState={loadState}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <Home
                loggedIn={loginflag}
                isAdmin={adminflag}
                loadState={loadState}
              />
            }
          />
          <Route
            path="*"
            element={<Home loggedIn={false} loadState={loadState} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
// App;

export default App;
