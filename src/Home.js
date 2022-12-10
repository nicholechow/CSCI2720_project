import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import vars from "./Vars";

// Reference: https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken =
  "pk.eyJ1IjoiMTE1NTE3MDk1MiIsImEiOiJjbGI5OXI3eDgwc21vM3BxYzd1MTNrMXA0In0.0HxBmgExZx-Y_BfWj_tF8Q";
// Home
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn === undefined ? false : this.props.loggedIn,
      isAdmin: this.props.isAdmin === undefined ? false : this.props.isAdmin,
      r: false
    };

    // Debug Account
    vars.username = vars.loggedIn === this.props.loggedIn ? "Debugger" : "";
    console.log(vars.loggedIn);
  
    this.handleLogout = this.handleLogout.bind(this);
    this.handleR = this.handleR.bind(this);
  }
handleLogout() {
  this.setState({ loggedIn: false });
}
handleR(){
  this.setState({r: !this.state.r});
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
            <Map />
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
              <button>Update event</button>
              <button onClick={this.handleR}> Retrieve events</button>
              <button>Delete event</button>
            </div>
            <div>
            {(this.state.r)? <RetrieveData/>: <p></p>}
             
            </div>
            
          </div>

        );
    }
  }
}
// Home;

// Location
function Location() {
  fetch("http://localhost:8889/venueEventCnt")
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      const Location = document.getElementById("Location");
      Location.innerHTML = data
        .map((ele) => {
          return `<tr>\n<td><a href="http://localhost:3000/venue/${ele.venueId}">${ele.venueName}</a></td>\n<td>${ele.eventCnt}</td>\n
            <td>
              <button class="btn btn-danger">♥</button>
            </td>\n</tr>\n`;
        })
        .join("");
    })
    .catch((error) => {
      console.log(error);
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
          className="my-1"
          type="text"
          placeholder="Search Bar"
        ></input>
        <button
          id="sort"
          className="mx-1 py-1 btn btn-outline-primary"
          type="button"
        >
          Sort by number of events↓
        </button>
        {/* <button id='favourites'></button> */}
        <table className="p-2 text-center table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col">Location</th>
              <th scope="col"> number of events</th>
            </tr>
          </thead>
          <tbody id="Location">
            <tr>
              <td>Location 1</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Location 2</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Location 3</td>
              <td>3</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
// Location;

// Map
export function Map() {
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
  componentDidMount(){
    fetch("http://localhost:8889/listall")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        const RetrieveData = document.getElementById("RetrieveData");
        RetrieveData.innerHTML = data
          .map((ele) => {
            return `<tr>
            <td>${ele.id}</td>
            <td>${ele.title}</td>
            <td>${ele.datetime}</td>
            <td>${ele.venue}</td>
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
  render(){
  return (
    <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
      <section
        className="p-1 mx-1 border border-primary rounded-1"
      >
        <h4>Data Retrieved</h4>

        <table className="p-2 text-center table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Datetime</th>
              <th scope="col">Venue</th>
              <th scope="col">Latitude</th>
              <th scope="col">Longitude</th>
              <th scope="col">Description</th>
              <th scope="col">Presenter</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody id="RetrieveData">
            <tr>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
  }
}
