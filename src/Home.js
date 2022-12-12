import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import vars from "./Vars";

// Reference: https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
// import { set } from "mongoose";

import CreateData from "./DataManagement/CreateData";
import DeleteData from "./DataManagement/DeleteData";
import RetrieveData from "./DataManagement/RetrieveData";
import UpdateData from "./DataManagement/UpdateData";

mapboxgl.accessToken =
  "pk.eyJ1IjoiMTE1NTE3MDk1MiIsImEiOiJjbGI5OXI3eDgwc21vM3BxYzd1MTNrMXA0In0.0HxBmgExZx-Y_BfWj_tF8Q";

// Home
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn === undefined ? false : this.props.loggedIn,
      isAdmin: this.props.isAdmin === undefined ? false : this.props.isAdmin,
      c: false,
      r: false,
      u: false,
      d: false,
      loginstate: 0,
    };

    // Debug Account
    // vars.username = vars.loggedIn === this.props.loggedIn ? "Debugger" : "";
    // console.log(vars.loggedIn);

    this.handleLogout = this.handleLogout.bind(this);
    this.handleC = this.handleC.bind(this);
    this.handleR = this.handleR.bind(this);
    this.handleU = this.handleU.bind(this);
    this.handleD = this.handleD.bind(this);
  }
  componentDidMount() {
    let loginbody = {
      username: "",
      password: "",
    };
    fetch("http://localhost:8889/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(loginbody),
    })
      .then((res) => res.text())
      .then((txt) => {
        this.setState({ loginstate: Number(txt) });
        if (txt === "2") {
          document.title = "Admin";
        } else {
          document.title = "Home";
        }
      });
  }

  handleLogout() {
    let loginbody = {
      username: "",
      password: "",
      logout: 1,
    };
    fetch("http://localhost:8889/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(loginbody),
    })
      .then((res) => res.text())
      .then((txt) => {
        this.setState({ loginstate: Number(txt) });
      });
  }
  handleC() {
    this.setState({ c: !this.state.c });
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
    if (this.state.loginstate === 0) {
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
      if (this.state.loginstate === 1)
        return (
          <div>
            <nav className="navbar navbar-expand-sm navbar-light bg-light justify-content-center">
              <ul className="navbar-nav">
                <li className="nav-item mx-3">
                  <a href="#locations" className="nav-link">
                    Location
                  </a>
                </li>
                <li className="nav-item mx-3">
                  <a href="#map" className="nav-link">
                    Map
                  </a>
                </li>
                <li className="nav-item mx-3">
                  <a onClick={this.handleLogout} className="nav-link">
                    Logout
                  </a>
                </li>
              </ul>
            </nav>
            <div className="p-1 border border-primary rounded-1 container">
              <Location id="locationComponent" />
              <Map id="all" />
            </div>
          </div>
        );

      if (this.state.loginstate === 2)
        return (
          <div className="p-1 border border-primary rounded-1 container">
            <div>
              <nav className="navbar navbar-expand-sm navbar-light bg-light justify-content-center">
                <ul className="navbar-nav">
                  <li className="nav-item mx-3">
                    <Link to="/">
                      <button onClick={this.handleLogout}>Logout</button>
                    </Link>
                  </li>
                  <li className="nav-item mx-3">
                    <button onClick={this.handleC}>Create event</button>
                  </li>
                  <li className="nav-item mx-3">
                    <button onClick={this.handleR}> Retrieve events</button>
                  </li>
                  <li className="nav-item mx-3">
                    <button onClick={this.handleU}>Update event</button>
                  </li>
                  <li className="nav-item mx-3">
                    <button onClick={this.handleD}>Delete event</button>
                  </li>
                </ul>
              </nav>
            </div>
            <div>{this.state.c ? <CreateData /> : <p></p>}</div>
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
  const [state2, setState2] = useState(false);
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
  const changeFav = (venueId) => {
    let index = list.findIndex((item) => item.venueId === venueId);
    let list2 = list;
    list2[index].fav = !list2[index].fav;

    fetch("http://localhost:8889/changeFav/user0", {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ venueId: venueId }),
    })
      .then()
      .then(() => {
        setState2(false);
        setList(list2);
        //console.log(list2);
        //console.log("favClick");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fileterTable = () => {
    if (document.querySelector("#search_bar").value === "") {
      fetch("http://localhost:8889/venueEventCnt")
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          setState2(false);
          setList(data);
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
          setState2(false);
          setList(data);
          console.log(list);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //useEffect(() => {
  fetch("http://localhost:8889/venueEventCnt")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      if (list.length === 0) {
        //console.log(data);
        if (list.length === 0 && state === false) {
          setList(data);
          setState(true);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  fetch("http://localhost:8889/fav/user0")
    .then((res) => res.json())
    .then((fav) => {
      if (fav.length !== 0 && state === true && state2 === false) {
        fav = fav.map((ele) => ele.id);
        //console.log(fav);
        setList(
          list.map((ele) => {
            ele.fav = fav.includes(ele.venueId);
            return ele;
          })
        );
        setState2(true);
        //console.log(list);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  //});

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

        {list.length === 0 ? (
          <h4 className="text-center">No Result</h4>
        ) : (
          <table className="p-2 text-center table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">Location</th>
                <th scope="col">
                  {" "}
                  number of events{" "}
                  {sortState === -1 ? "↓" : sortState === 1 ? "↑" : ""}
                </th>
                <th scope="col">Latitude</th>
                <th scope="col">Longitude</th>
              </tr>
            </thead>
            <tbody id="LocationTbody">
              {list.map((loc, i) => (
                <LocationRow
                  key={i}
                  venueId={loc.venueId}
                  venueName={loc.venueName}
                  eventCnt={loc.eventCnt}
                  latitude={loc.latitude}
                  longitude={loc.longitude}
                  fav={loc.fav}
                  changeFav={changeFav}
                />
              ))}
            </tbody>
          </table>
        )}
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
      <td>{props.latitude}</td>
      <td>{props.longitude}</td>
      <td>
        <button
          className={
            props.fav === true ? "btn btn-danger" : "btn btn-outline-danger"
          }
          onClick={() => props.changeFav(props.venueId)}
        >
          ♥
        </button>
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
          // console.log(data);
          for (let i = 0; i < 10; i++) {
            let url = "http://localhost:3000/venue/" + String(data[i].id);
            // https://docs.mapbox.com/mapbox-gl-js/example/set-popup/
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              "<a href= " + url + ">" + String(data[i].venue) + "</a>"
            );
            const el = document.createElement("div");
            el.id = "marker";
            new mapboxgl.Marker()
              .setLngLat([data[i].longitude, data[i].latitude])
              .setPopup(popup)
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
    <div className="d-flex m-auto">
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
