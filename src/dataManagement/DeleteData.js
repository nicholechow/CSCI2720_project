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

class DeleteData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    fetch(server2URL + "/delete/" + this.state.eventId, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then((data) => {
        document.getElementById("deletemessage").innerText = data;
      });
  }
  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
        <section className="p-1 mx-1 ">
          <h4>Delete Data</h4>

          <form className="form" onSubmit={this.handleSubmit}>
            <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
              <div className="p-2 form-group mt-3">
                <label htmlFor="eventId">Event ID:</label>
                <input
                  id="eventId"
                  name="eventId"
                  type="number"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  placeholder="Enter event ID here"
                  required
                />
              </div>

              <div className="p-2 d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Delete
                </button>
              </div>
              <p id="deletemessage"></p>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default DeleteData;
