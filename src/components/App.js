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

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import Home, { setMapboxglKey } from "./Home";
import Login from "./Login";
import Venue from "./Venue";
import Search from "./Search";
import Account from "./Account";
import { server2URL } from "../utils/EnvReact";
import { isUser, isLoggedIn, logout } from "../utils/Utils";
import { onLoad } from "../utils/EnvReact";
import { mapboxglKey } from "../utils/EnvReact";
import { set } from "mongoose";

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
  const updateTime = useRef("");
  const [navState, setNavState] = useState(true);

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
          //setTimeout(() => {
          let time = new Date();
          updateTime.current = time.toString().split(" ").slice(0, 5).join(" ");
          setLoadState(true);
          //}, 3000);
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
              () =>
                document.getElementById("autoclick")
                  ? document.getElementById("autoclick").click()
                  : null,
              "70"
            );
            sessionStorage.username = "admin";

            setNavState(true);
            setLoadState(false);
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
                let time = new Date();
                updateTime.current = time
                  .toString()
                  .split(" ")
                  .slice(0, 5)
                  .join(" ");
                setLoadState(true);
              })
              .catch((err) => console.log(err));
            break;

          case 1:
            setDisplaylink("/user");
            setTimeout(
              () =>
                document.getElementById("autoclick")
                  ? document.getElementById("autoclick").click()
                  : null,
              "70"
            );
            setNavState(true);
            setLoadState(false);
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
                let time = new Date();
                updateTime.current = time
                  .toString()
                  .split(" ")
                  .slice(0, 5)
                  .join(" ");
                setLoadState(true);
              })
              .catch((err) => console.log(err));

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
              {isLoggedIn() && navState ? (
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

              {isLoggedIn() && navState ? (
                <div className="d-flex">
                  {isUser() ? (
                    <Link to="account" className="btn btn-warning mx-1">
                      Account: {sessionStorage.username}
                    </Link>
                  ) : null}
                  <Link
                    to="/login/signin"
                    className="btn"
                    type="submit"
                    id="search_button"
                    // href="../"
                    onClick={() => {
                      logout();
                      setNavState(false);
                    }}
                  >
                    Logout
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </nav>
        <p className="text-end my-0 pe-2">
          <small>
            {updateTime.current
              ? "Last update time: " + updateTime.current
              : ""}
          </small>
        </p>
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
