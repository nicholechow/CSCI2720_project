import React from "react";
import { server2URL } from "../utils/EnvReact";

class UserUpdateData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      pw: "",
      newusername: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleLoad(e) {
    e.preventDefault();
    fetch(server2URL + "/user/" + String(this.state.username))
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("newusername").value = data.username;
        document.getElementById("pw").value = data.pw;
      });
  }
  handleSubmit(e) {
    e.preventDefault();
    let newData = {
      username: document.getElementById("username").value,
      pw: document.getElementById("pw").value,
      newusername: document.getElementById("newusername").value,
    };
    fetch(server2URL + "/userupdate/" + String(this.state.username), {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => res.text())
      .then((txt) => {
        let inf=txt.split("\n");
        if (inf.length>1){
          document.getElementById("userupdatemessage").innerText = "Please input original username";
        }else{
          document.getElementById("userupdatemessage").innerText = txt;
        }
        
      });
  }

  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
        <section className="p-1 mx-1 ">
          <form className="form" onSubmit={this.handleLoad}>
            <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
              <h3>Load User Information</h3>

              <div className="p-2 form-group mt-3">
                <label htmlFor="username">Original Username:</label>
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
                  Load
                </button>
              </div>
            </div>
          </form>
          <br />
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
              <h3>Update User Information</h3>

              <div className="p-2 form-group mt-3">
                <label htmlFor="newusername">New Username:</label>
                <input
                  id="newusername"
                  name="newusername"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="pw">New Password:</label>
                <input
                  id="pw"
                  name="pw"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>

              <div className="p-2 d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
                <p id="userupdatemessage"></p>
              </div>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default UserUpdateData;
