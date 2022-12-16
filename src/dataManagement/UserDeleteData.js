import React from "react";
import { server2URL } from "../utils/EnvReact";

class UserDeleteData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    fetch(server2URL + "/userdelete/" + this.state.username, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then((data) => {
        document.getElementById("userdeletemessage").innerText = data;
      });
  }

  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
        <section className="p-1 mx-1 ">
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
              <h3>Remove User</h3>

              <div className="p-2 form-group mt-3">
                <label htmlFor="username">Username:</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  placeholder="Enter username here"
                  required
                />
              </div>

              <div className="p-2 d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Delete
                </button>
              </div>
              <p id="userdeletemessage"></p>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default UserDeleteData;
