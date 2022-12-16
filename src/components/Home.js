import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Reference: https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import CreateData from "../dataManagement/CreateData";
import DeleteData from "../dataManagement/DeleteData";
import RetrieveData from "../dataManagement/RetrieveData";
import UpdateData from "../dataManagement/UpdateData";
import UserCreateData from "../dataManagement/UserCreateData";
import UserDeleteData from "../dataManagement/UserDeleteData";
import UserRetrieveData from "../dataManagement/UserRetrieveData";
import UserUpdateData from "../dataManagement/UserUpdateData";

import {
  server2URL,
  exampleServerURL,
  mapboxglKey,
  onLoad,
} from "../utils/EnvReact";
import { isUser, isAdmin, isLoggedIn } from "../utils/Utils";

export const setMapboxglKey = () => (mapboxgl.accessToken = mapboxglKey());

// Home
export default function Home() {
  const [c, setC] = useState(false);
  const [r, setR] = useState(false);
  const [u, setU] = useState(false);
  const [d, setD] = useState(false);
  const [user_c, setUser_c] = useState(false);
  const [user_r, setUser_r] = useState(false);
  const [user_u, setUser_u] = useState(false);
  const [user_d, setUser_d] = useState(false);
  const [loginState, setLoginState] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) return;

    fetch(exampleServerURL + "/authenticate", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + sessionStorage.accessToken,
      },
      body: JSON.stringify({
        accessToken: sessionStorage.accessToken,
        refreshToken: sessionStorage.refreshToken,
      }),
    })
      .then((res) => res.text())
      .then((txt) => {
        // It may be NaN For Example, "Forbidden": from the 403 code (?)
        const loginS = isNaN(Number(txt)) ? 0 : Number(txt);

        document.title = !isAdmin() ? "Home" : "Admin";

        switch (loginS) {
          case 1:
            setLoginState(loginS);
            break;

          default:
            setLoginState(isAdmin() ? 2 : loginS);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("If it is 401 or 403, then it is intended... NOT DONE");
      });
  });

  const handleC = () => setC(!c);
  const handleR = () => setR(!r);
  const handleU = () => setU(!u);
  const handleD = () => setD(!d);
  const handleUserC = () => setUser_c(!user_c);
  const handleUserR = () => setUser_r(!user_r);
  const handleUserU = () => setUser_u(!user_u);
  const handleUserD = () => setUser_d(!user_d);

  switch (loginState) {
    case 0:
      return (
        <div className="p-4 col-6 m-auto border border-4 border-primary rounded-3">
          <h3 className="p-3">Welcome to Group 19's Project</h3>
          <Link to="/login/signin" className="text-decoration-none p-3">
            <button className="btn p-auto m-auto">Sign In</button>
          </Link>
        </div>
      );

    case 1:
      return isUser() ? (
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
            </ul>
          </nav>
          <div className="p-1 border border-primary rounded-1 container">
            <Location id="locationComponent" />
            <Map id="all" />
          </div>
        </div>
      ) : (
        <h2 className="text-center">
          <Link to="/">Please login</Link>
        </h2>
      );

    case 2:
      return (
        <div className="p-1 border border-primary rounded-1 container">
          <div>
            <nav className="navbar navbar-expand-sm navbar-light bg-light justify-content-center">
              <ul className="navbar-nav">
                <li className="nav-item mx-3">
                  <button onClick={() => handleC()}>Create event</button>
                </li>
                <li className="nav-item mx-3">
                  <button onClick={() => handleR()}> Retrieve events</button>
                </li>
                <li className="nav-item mx-3">
                  <button onClick={() => handleU()}>Update event</button>
                </li>
                <li className="nav-item mx-3">
                  <button onClick={() => handleD()}>Delete event</button>
                </li>
              </ul>
            </nav>
          </div>
          <div>{c ? <CreateData /> : ""}</div>
          <div>{r ? <RetrieveData /> : ""}</div>
          <div>{u ? <UpdateData /> : ""}</div>
          <div>{d ? <DeleteData /> : ""}</div>

          <div>
            <nav className="navbar navbar-expand-sm navbar-light bg-light justify-content-center">
              <ul className="navbar-nav">
                <li className="nav-item mx-3">
                  <button onClick={() => handleUserC()}>Create user</button>
                </li>
                <li className="nav-item mx-3">
                  <button onClick={() => handleUserR()}>
                    Retrieve user information
                  </button>
                </li>
                <li className="nav-item mx-3">
                  <button onClick={() => handleUserU()}>
                    Update user information
                  </button>
                </li>
                <li className="nav-item mx-3">
                  <button onClick={() => handleUserD()}>Delete user</button>
                </li>
              </ul>
            </nav>
          </div>
          <div>{user_c ? <UserCreateData /> : ""}</div>
          <div>{user_r ? <UserRetrieveData /> : ""}</div>
          <div>{user_u ? <UserUpdateData /> : ""}</div>
          <div>{user_d ? <UserDeleteData /> : ""}</div>
        </div>
      );

    default:
      return <div>Error</div>;
  }
}
// Home;

// Location
function Location() {
  const [statee, setStatee] = useState(false);
  const [statee2, setStatee2] = useState(false);
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

    fetch(server2URL + "/changeFav/" + sessionStorage.username, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ venueId: venueId }),
    })
      .then()
      .then(() => {
        setStatee2(false);
        setList(list2);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fileterTable = () => {
    if (document.querySelector("#search_bar").value === "") {
      fetch(server2URL + "/venueEventCnt")
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          setStatee2(false);
          setList(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      fetch(
        server2URL + "/search/" + document.querySelector("#search_bar").value
      )
        .then((res) => res.json())
        .then((data) => {
          setStatee2(false);
          setList(data);
          console.log(list);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //useEffect(() => {
  fetch(server2URL + "/venueEventCnt")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      if (list.length === 0) {
        //console.log(data);
        if (list.length === 0 && statee === false) {
          setList(data);
          setStatee(true);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  fetch(server2URL + "/fav/" + sessionStorage.username)
    .then((res) => res.json())
    .then((fav) => {
      if (fav.length !== 0 && statee === true && statee2 === false) {
        fav = fav.map((ele) => ele.id);
        //console.log(fav);
        setList(
          list.map((ele) => {
            ele.fav = fav.includes(ele.venueId);
            return ele;
          })
        );
        setStatee2(true);
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
        <Link to={"/venue/" + props.venueId}>{props.venueName}</Link>
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

  const mapboxInit = () => async () => {
    // If no key or key length not right, then load try to load it but still failed, then wait 2s and try again
    if (
      !mapboxglKey() ||
      (mapboxglKey().length !== 93 && (await onLoad()).mapboxglKey == null)
    )
      return setTimeout(mapboxInit(), 2000);

    // initialize map only once
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,

      // Remove Unneeded buttons from Mapbox
      attributionControl: false,
    });

    if (props.id !== "all") {
      await fetch(server2URL + "/venueLatLong/" + props.id)
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
      return;
    }

    await fetch(server2URL + "/allVenueLatLong")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        for (let i = 0; i < 10; i++) {
          let url = "/venue/" + String(data[i].id);
          // https://docs.mapbox.com/mapbox-gl-js/example/set-popup/
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            "<a href=" + url + ">" + String(data[i].venue) + "</a>"
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
  };

  useEffect(() => mapboxInit(), []);

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
