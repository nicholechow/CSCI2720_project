import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import vars from "./Vars";

// Reference: https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { set } from "mongoose";
mapboxgl.accessToken =
  "pk.eyJ1IjoiMTE1NTE3MDk1MiIsImEiOiJjbGI5OXI3eDgwc21vM3BxYzd1MTNrMXA0In0.0HxBmgExZx-Y_BfWj_tF8Q";
// Home
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn === undefined ? false : this.props.loggedIn,
      isAdmin: this.props.isAdmin === undefined ? false : this.props.isAdmin,
      r: false,
      u: false,
      d: false,
    };

    // Debug Account
    vars.username = vars.loggedIn === this.props.loggedIn ? "Debugger" : "";
    console.log(vars.loggedIn);

    this.handleLogout = this.handleLogout.bind(this);
    this.handleR = this.handleR.bind(this);
    this.handleU = this.handleU.bind(this);
    this.handleD = this.handleD.bind(this);
  }
  handleLogout() {
    this.setState({ loggedIn: false });
  }
  handleR() {
    this.setState({ r: !this.state.r });
  }
  handleU() {
    this.setState({ u: !this.state.u });
  }
  handleD() {
    this.setState({ d: !this.state.d });
  }

  render() {
    if (!this.state.loggedIn) {
      return (
        <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
          {/* Title */}
          <h3 className="p-3">Welcome to Group 19's Project</h3>
          {/* <Link to="/login/signup" className="text-decoration-none p-3"><button className='btn p-auto m-auto'>Sign Up</button></Link> */}
          <Link to="/login/signin" className="text-decoration-none p-3">
            <button className="btn p-auto m-auto">Sign In</button>
          </Link>
        </div>
      );
    } else {
      if (!this.state.isAdmin)
        return (
          <div className="p-1 border border-primary rounded-1 container">
            <Location />
            <Map id="all" />
          </div>
        );

      if (this.state.isAdmin)
        return (
          <div className="p-1 border border-primary rounded-1 container">
            <div>
              <Link to="/">
                <button onClick="{this.handleLogout}">Logout</button>
              </Link>
              <button>Create event</button>
              <button onClick={this.handleR}> Retrieve events</button>
              <button onClick={this.handleU}>Update event</button>
              <button onClick={this.handleD}>Delete event</button>
            </div>
            <div>{this.state.r ? <RetrieveData /> : <p></p>}</div>
            <div>{this.state.u ? <UpdateData /> : <p></p>}</div>
            <div>{this.state.d ? <DeleteData /> : <p></p>}</div>
          </div>
        );
    }
  }
}
// Home;

// Location
function Location() {
  const [state, setState] = useState(false);
  const [list, setList] = useState([]);
  const [sortState, setSortState] = useState(0);
  const sortTable = () => {
    if (list.length !== 0) {
      if (sortState === 1 || sortState === 0) {
        setSortState(-1);
        setList(list.sort((a, b) => b.eventCnt - a.eventCnt));
      } else {
        setSortState(1);
        setList(list.sort((a, b) => a.eventCnt - b.eventCnt));
      }
    }
  };

  const fileterTable = () => {
    if (document.querySelector("#search_bar").value == "") {
      fetch("http://localhost:8889/venueEventCnt")
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          if (list.length === 0) setList(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      fetch(
        "http://localhost:8889/search/" +
          document.querySelector("#search_bar").value
      )
        .then((res) => res.json())
        .then((data) => {
          setList(data);
          console.log(list);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    fetch("http://localhost:8889/venueEventCnt")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        if (list.length === 0) {
          //console.log(data);
          if (list.length === 0 && state === false) {
            setList(data);
            setState(true);
          }
          return fetch("http://localhost:8889/fav/user0"); // user0 for testing
        }
      })
      .then((res) => res.json())
      .then((fav) => {
        console.log(fav);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
      <section
        id="locations"
        className="p-1 mx-1 border border-primary rounded-1"
      >
        <h4>Locations</h4>
        <input
          id="search_bar"
          className="form-control"
          type="text"
          placeholder="Search Bar"
          onChange={() => fileterTable()}
        ></input>
        <button
          id="sort"
          className="mx-1 py-1 btn btn-outline-primary"
          type="button"
          onClick={() => sortTable()}
        >
          Sort by number of events {sortState === -1 ? "↑" : "↓"}
        </button>
        {/* <button id='favourites'></button> */}
        <table className="p-2 text-center table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col">Location</th>
              <th scope="col"> number of events</th>
            </tr>
          </thead>
          <tbody id="LocationTbody">
            {list.length === 0 ? (
              <tr>
                <td>No Result</td>
                <td>No Result</td>
              </tr>
            ) : (
              list.map((loc, i) => (
                <LocationRow
                  key={i}
                  venueId={loc.venueId}
                  venueName={loc.venueName}
                  eventCnt={loc.eventCnt}
                />
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
function LocationRow(props) {
  return (
    <tr>
      <td>
        <a href={"http://localhost:3000/venue/" + props.venueId}>
          {props.venueName}
        </a>
      </td>
      <td>{props.eventCnt}</td>
      <td>
        <button className="btn btn-outline-danger">♥</button>
      </td>
    </tr>
  );
}
// Location;

// Map
export function Map(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(22.302711);
  const [lng, setLng] = useState(114.177216);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    // console.log(1);
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,

      // Remove Unneeded buttons from Mapbox
      attributionControl: false,
    });
    if (props.id !== "all") {
      fetch("http://localhost:8889/venueLatLong/" + props.id)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data.latitude);
          new mapboxgl.Marker()
            .setLngLat([data.longitude, data.latitude])
            .addTo(map.current);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      fetch("http://localhost:8889/allVenueLatLong")
        .then((res) => res.json())
        .then((data) => {
          // console.log(data.latitude);
          for (let i = 0; i < 10; i++) {
            new mapboxgl.Marker()
              .setLngLat([data[i].longitude, data[i].latitude])
              .addTo(map.current);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });
  return (
    // <section id='map' className='p-2 m-1 border border-primary rounded-1'>
    <div className="d-flex m-auto col-sm-12 col-md-8 col-lg-9 ">
      <section
        id="map"
        className="p-1 mx-1 border border-primary rounded-1 d-inline-block w-100"
      >
        <h4>Map</h4>
        <div>
          {/* Mapbox */}
          <div
            ref={mapContainer}
            className="map-container"
            style={{ width: "100%", height: "400px" }}
          />
        </div>
      </section>
    </div>
  );
}
// Map;

class RetrieveData extends React.Component {
  componentDidMount() {
    fetch("http://localhost:8889/listall")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        const RetrieveData = document.getElementById("RetrieveData");
        RetrieveData.innerHTML = data
          .map((ele, i) => {
            return `<tr key={i}>
            <td>${i + 1}</td>        
            <td>${ele.venueid}</td>
            <td>${ele.venuename}</td>
            <td>${ele.eventid}</td>
            <td>${ele.title}</td>
            <td>${ele.datetime}</td>           
            <td>${ele.latitude}</td>
            <td>${ele.longitude}</td>
            <td>${ele.description}</td>
            <td>${ele.presenter}</td>
            <td>${ele.price}</td>
            </tr>`;
          })
          .join("");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
        <section className="p-1 mx-1 border border-primary rounded-1">
          <h4>Data Retrieved</h4>

          <table className="p-2 text-center table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">Count</th>
                <th scope="col">Venue ID</th>
                <th scope="col">Venue Name</th>
                <th scope="col">Event ID</th>
                <th scope="col">Title</th>
                <th scope="col">Datetime</th>
                <th scope="col">Latitude</th>
                <th scope="col">Longitude</th>
                <th scope="col">Description</th>
                <th scope="col">Presenter</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody id="RetrieveData">
              <tr></tr>
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}

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

          <form className="form" method="POST">
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
                />
              </div>

              <div className="p-2 d-grid gap-2 mt-3">
                <button onClick={this.handleSubmit} className="btn btn-primary">
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

class UpdateData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: "",
      title: "",
      venueId: "",
      venueName: "",
      datetime: "",
      latitude: "",
      longitude: "",
      description: "",
      presenter: "",
      price: "",
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
    fetch("http://localhost:8889/listone/" + String(this.state.eventId))
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("title").value = data.title;
        document.getElementById("venueId").value = data.venueid;
        document.getElementById("venueName").value = data.venuename;
        document.getElementById("datetime").value = data.datetime;
        document.getElementById("latitude").value = data.latitude;
        document.getElementById("longitude").value = data.longitude;
        document.getElementById("description").value = data.description;
        document.getElementById("presenter").value = data.presenter;
        document.getElementById("price").value = data.price;
      });
  }
  handleSubmit(e) {
    e.preventDefault();
    let newData = {
      title: document.getElementById("title").value,
      venueid: Number(document.getElementById("venueId").value),
      venuename: document.getElementById("venueName").value,
      datetime: document.getElementById("datetime").value,
      latitude: Number(document.getElementById("latitude").value),
      longitude: Number(document.getElementById("longitude").value),
      description: document.getElementById("description").value,
      presenter: document.getElementById("presenter").value,
      price: document.getElementById("price").value,
    };
    fetch("http://localhost:8889/update/" + String(this.state.eventId), {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => res.text())
      .then((txt) => {
        console.log(txt);
        if (txt === "success") {
          document.getElementById("updatemessage").innerHTML =
            "Update successfully.";
        } else {
          document.getElementById("updatemessage").innerHTML =
            "Update is not success. Make sure your data is input correctly";
        }
      });
  }
  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
        <section className="p-1 mx-1 border border-primary rounded-1">
          <h4>Update Data</h4>

          <form className="form" method="POST">
            <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
              <h3>Load Event</h3>

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
                <button onClick={this.handleLoad} className="btn btn-primary">
                  Load
                </button>
              </div>
            </div>
          </form>
          <br />
          <form className="form" method="POST">
            <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
              <h3>Update Event</h3>

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
                <label htmlFor="venueName">Venue Name:</label>
                <input
                  id="venueName"
                  name="venueName"
                  type="text"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="venueName">Datetime:</label>
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
                <label htmlFor="venueName">Latitude:</label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="venueName">Longitude:</label>
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  onChange={this.handleChange}
                  className="form-control mt-1"
                  required
                />
              </div>

              <div className="p-2 form-group mt-3">
                <label htmlFor="venueName">Description:</label>
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
                <label htmlFor="venueName">Presenter:</label>
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
                <label htmlFor="venueName">Price:</label>
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
                <button onClick={this.handleSubmit} className="btn btn-primary">
                  Update
                </button>
              </div>
              <p id="updatemessage"></p>
            </div>
          </form>
        </section>
      </div>
    );
  }
}
