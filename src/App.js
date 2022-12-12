import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React from "react";
// import vars from "./Vars";
import Home from "./Home";
import Login from "./Login";
import Venue from "./Venue";
import Search from "./Search";
import Account from "./Account";

// App
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      displaytext: "",
      displaylink: "",
      adminflag:
        this.props.adminflag === undefined ? false : this.props.adminflag,
      loginflag:
        this.props.loginflag === undefined ? false : this.props.loginflag,
    };
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    let loginbody={
      'username': this.state.username,
      'password': this.state.password
    }
    fetch("http://localhost:8889/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(loginbody)
    })
    .then((res) => res.text())
    .then((txt) => {
      if (txt=="2"){
        this.setState({
          displaytext: "You are an admin, click here to go to the admin page.",
          displaylink: "/admin",
        });
      }else if (txt=="1"){
        this.setState({
          displaytext: "You are a user, click here to go to the user page.",
          displaylink: "/user",
        });
      }
    });
    
  }

  load() {
    document.querySelector("#search_button").href =
      "http://localhost:3000/search/" +
      document.querySelector("#keyword_iput").value;
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <nav class="navbar navbar-expand-lg bg-light">
            <div class="container-fluid">
              <a class="navbar-brand" href="/">
                CSCI2720 Group 19's Project
              </a>
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/">
                      Home
                    </a>
                  </li>
                  <li class="nav-item">
                    <Link to="account" className="nav-link">
                      Account
                    </Link>
                  </li>
                </ul>
                <div className="nav justify-content-between bg-warning sticky-top">
                  {/* {vars.username
                    ? '<div><Link to="/debug"><button className="btn btn-transparent">' +
                      vars.username +
                      "</button></Link></div>"
                    : ""}
                  <div>
                    {vars.loggedIn ? (
                      <Link to="/logout">
                        <button className="btn btn-transparent">Log Out</button>
                      </Link>
                    ) : (
                      <Link to="/debug">
                        <button className="btn btn-transparent">
                          Debug Login
                        </button>
                      </Link>
                    )} */}
                  {/* </div> */}
                </div>
                <div class="d-flex">
                  <input
                    class="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    id="keyword_iput"
                    onChange={(e) => this.load()}
                  ></input>
                  <a
                    class="btn btn-outline-success"
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
            {/* <Route path="/login/signup" element={<Login mode={signup}/>} /> */}
            <Route
              path="/login/signin"
              element={
                <Login
                  data={{
                    username: this.state.usernmae,
                    password: this.state.password,
                    displaylink: this.state.displaylink,
                    displaytext: this.state.displaytext,
                    adminflag: this.state.adminflag,
                    loginflag: this.state.loginflag,
                    handleChange: this.handleChange.bind(this),
                    handleSubmit: this.handleSubmit.bind(this),
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
                  loggedIn={this.state.loginflag}
                  isAdmin={this.state.adminflag}
                />
              }
            />
            <Route
              path="/admin"
              element={
                <Home
                  loggedIn={this.state.loginflag}
                  isAdmin={this.state.adminflag}
                />
              }
            />
            <Route path="*" element={<Home loggedIn={false} />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}
// App;

export default App;
