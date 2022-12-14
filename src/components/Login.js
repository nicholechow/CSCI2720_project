import React, { useEffect } from "react";
import { Link } from "react-router-dom";

/*
// Reference: https://supertokens.com/blog/building-a-login-screen-with-react-and-bootstrap
*/

export default function Login(props) {
  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <div>
      <form className="form" onSubmit={props.data.handleSubmit}>
        <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
          <h3>Sign In</h3>

          <div className="p-2 form-group mt-3">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              onChange={props.data.handleChangeUsername}
              className="form-control mt-1"
              placeholder="Enter username here"
              minLength="4"
              maxLength="20"
              required
            />
          </div>

          <div className="p-2 form-group mt-3">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={props.data.handleChangePassword}
              className="form-control mt-1"
              placeholder="Enter password here"
              minLength="4"
              maxLength="20"
              required
            />
          </div>

          <div className="p-2 d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Sign in
            </button>
          </div>
          <p id="123" className="text-danger"></p>
        </div>
      </form>
      <Link to={props.data.displaylink}>
        <button id="autoclick" className="btn btn-transparent" hidden>
          {props.data.displaytext}
        </button>
      </Link>
    </div>
  );
}
// Login;
