import React from "react";
import { server2URL } from "../utils/EnvReact";

class CreateData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      venueId: "",
      datetime: "",
      description: "",
      presenter: "",
      price: "",
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
      title: document.getElementById("title").value,
      venueid: Number(document.getElementById("venueId").value),
      datetime: document.getElementById("datetime").value,
      description: document.getElementById("description").value,
      presenter: document.getElementById("presenter").value,
      price: document.getElementById("price").value,
    };
    fetch(server2URL + "/create", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => res.text())
      .then((txt) => {
        document.getElementById("createmessage").innerHTML = txt;
      });
  }

  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
        <section className="p-1 mx-1 ">
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
              <h3>Create Event</h3>

              <div className="p-2 form-group mt-3">
                <label htmlFor="title">Title:</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="venueId">Venue ID:</label>
                <input
                  id="venueId"
                  name="venueId"
                  type="number"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="datetime">Datetime:</label>
                <input
                  id="datetime"
                  name="datetime"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="description">Description:</label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="presenter">Presenter:</label>
                <input
                  id="presenter"
                  name="presenter"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="price">Price:</label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>
              <div className="p-2 d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
              <p id="createmessage"></p>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default CreateData;
