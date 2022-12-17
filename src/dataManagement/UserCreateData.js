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

import React from "react";
import { server2URL } from "../utils/EnvReact";

class UserCreateData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      pw: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    let newData = {
      username: document.getElementById("username").value,
      pw: document.getElementById("pw").value,
    };
    fetch(server2URL + "/usercreate", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => res.text())
      .then((txt) => {
        document.getElementById("usercreatemessage").innerHTML = txt;
      });
  }

  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
        <section className="p-1 mx-1 ">
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="p-4 col-lg-6 m-auto border border-4 border-primary rounded-3">
              <h3>Create a user</h3>

              <div className="p-2 form-group mt-3">
                <label htmlFor="username">Username:</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  minLength="4"
                  maxLength="20"
                  required
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="pw">Password:</label>
                <input
                  id="pw"
                  name="pw"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  minLength="4"
                  maxLength="20"
                  required
                />
              </div>
              <div className="p-2 d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
              <p id="usercreatemessage"></p>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default UserCreateData;
