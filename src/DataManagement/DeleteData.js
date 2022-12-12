import React from "react";

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
    fetch("http://localhost:8889/delete/" + this.state.eventId, {
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
        <section className="p-1 mx-1 border border-primary rounded-1">
          <h4>Delete Data</h4>

          <form className="form" onSubmit={this.handleSubmit}>
            <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
              <h3>Remove Event</h3>

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
