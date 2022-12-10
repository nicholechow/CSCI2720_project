import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React from "react";
import vars from "./Vars";
import Home from "./Home";
import Login from "./Login";
import Venue from "./Venue";

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
    if (this.state.username === "admin") {
      if (this.state.password === "admin") {
        this.setState({ adminflag: true, loginflag: true, displaytext: "You are an admin, click here to go to the admin page.", displaylink: "/admin" });
        document.getElementById("123").innerText = "";
      }
    } else if (this.state.username === "user") {
      if (this.state.password === "user") {
        this.setState({ adminflag: false, loginflag: true, displaytext: "You are a user, click here to go to the user page.", displaylink: "/user" });
        document.getElementById("123").innerText = "";
      }
    } else {
      document.getElementById("123").innerText =
        "Please input a correct username and password";
      document.getElementById("123").classList.add("text-danger");
    }
  }
  render(){
  return (
    <>
      <BrowserRouter>
        <div className="nav justify-content-between bg-warning sticky-top">
          <div>
            <Link to="/">
              <button className="btn btn-transparent">
                CSCI2720 Group 19's Project
              </button>
            </Link>
          </div>
          {vars.username
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
                <button className="btn btn-transparent">Debug Login</button>
              </Link>
            )}
          </div>
        </div>

        <hr className="m-0 mb-3" />

        <Routes>
          {/* <Route path="/login/signup" element={<Login mode={signup}/>} /> */}
          <Route path="/login/signin" element={<Login data={{
            username: this.state.usernmae,
            password: this.state.password,
            displaylink: this.state.displaylink,
            displaytext: this.state.displaytext,
            adminflag: this.state.adminflag,
            loginflag: this.state.loginflag,
            handleChange: this.handleChange.bind(this),
            handleSubmit: this.handleSubmit.bind(this)
          }}/>} />
          <Route path="/debug" element={<Home loggedIn={true} />} />
          <Route path="/venue/:venueId" element={<Venue />} />
          <Route path="/user" element={<Home loggedIn={this.state.loginflag} isAdmin={this.state.adminflag}/>} />
          <Route path="/admin" element={<Home loggedIn={this.state.loginflag} isAdmin={this.state.adminflag}/>} />
          <Route path="*" element={<Home loggedIn={false}/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
  }
}
// App;

export default App;
