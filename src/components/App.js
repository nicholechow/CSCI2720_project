import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import Home from "./Home";
import Login from "./Login";
import Venue from "./Venue";
import Search from "./Search";
import Account from "./Account";
import { server2URL } from "../utils/EnvReact"

// App
function App(props) {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     username: "",
  //     password: "",
  //     displaytext: "",
  //     displaylink: "",

  //     adminflag:
  //       this.props.adminflag === undefined ? false : this.props.adminflag,
  //     loginflag:
  //       this.props.loginflag === undefined ? false : this.props.loginflag,
  //   };
  // }

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [displaytext, setDisplaytext] = useState("")
  const [displaylink, setDisplaylink] = useState("")
  const [adminflag, setAdminflag] = useState(props.adminflag === undefined ? false : props.adminflag)
  const [loginflag, setLoginflag] = useState(props.loginflag === undefined ? false : props.loginflag)


  // handleChange(e) {
  //   this.setState({ [e.target.name]: e.target.value });
  // }

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  }
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let loginbody = {
      username: username,
      password: password
    };
    fetch(server2URL + "/login", {
      method: "POST",
      headers: { 
        "Content-type": "application/json"
      },
      body: JSON.stringify(loginbody),
    })
      .then (res => res.json())
      .then (json => {
        console.log(json)
        switch (json.loginState) {
          case 2:
            setDisplaylink("/admin");
            setTimeout(() =>  document.getElementById("autoclick").click(), "70");
            sessionStorage.username = "admin"
            break;

          case 1:
            setDisplaylink("/user");
            setTimeout(() => document.getElementById("autoclick").click(), "70");

            if (!json.username) delete sessionStorage.username
            else sessionStorage.username = json.username

            if (!json.token.accessToken) delete sessionStorage.accessToken
            else sessionStorage.accessToken = json.token.accessToken

            if (!json.token.refreshToken) delete sessionStorage.refreshToken
            else sessionStorage.refreshToken = json.token.refreshToken
            
            break;
          
          default:
            document.getElementById("123").innerText = "Please input correct username and password";
        }
      })

      // .then((res) => res.text())
      // .then((txt) => {
      //   console.log("3000: " + txt)
      //   if (txt === "2") {
      //     setDisplaylink("/admin");
      //     setTimeout(() => {
      //       document.getElementById("autoclick").click();
      //     }, "70");
      //   } else if (txt === "1") {
      //     setDisplaylink("/user");
      //     setTimeout(() => {
      //       document.getElementById("autoclick").click();
      //     }, "70");
      //   } else {
      //     document.getElementById("123").innerText =
      //       "Please input correct username and password";
      //   }
      // });
  }

  const load = () => {
    document.querySelector("#search_button").href =
      "http://localhost:3000/search/" +
      document.querySelector("#keyword_iput").value;
  }

  return (
    <>
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              CSCI2720 Group 19's Project
            </a>
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
                  <a className="nav-link active" aria-current="page" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <Link to="account" className="nav-link">
                    Account
                  </Link>
                </li>
              </ul>
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  id="keyword_iput"
                  onChange={(e) => load()}
                ></input>
                <a
                  className="btn btn-outline-success"
                  type="submit"
                  id="search_button"
                  href="http://localhost:3000.com/search/"
                >
                  Search
                </a>
              </div>
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
          <Route path="/debug" element={<Home loggedIn={true} />} />
          <Route path="/venue/:venueId" element={<Venue />} />
          <Route path="/search/:keyword" element={<Search />} />
          <Route path="/account" element={<Account />} />
          <Route
            path="/user"
            element={
              <Home
                loggedIn={loginflag}
                isAdmin={adminflag}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <Home
                loggedIn={loginflag}
                isAdmin={adminflag}
              />
            }
          />
          <Route path="*" element={<Home loggedIn={false} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
// App;

export default App;
