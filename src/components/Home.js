import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Reference: https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import CreateData from "../dataManagement/CreateData";
import DeleteData from "../dataManagement/DeleteData";
import DataTable from "../dataManagement/RetrieveData";
import UpdateData from "../dataManagement/UpdateData";
import UserCreateData from "../dataManagement/UserCreateData";
import UserDeleteData from "../dataManagement/UserDeleteData";
import UserRetrieveData from "../dataManagement/UserRetrieveData";
import UserUpdateData from "../dataManagement/UserUpdateData";
import { Map } from "./Map";

import {
  server2URL,
  exampleServerURL,
  mapboxglKey,
  onLoad,
} from "../utils/EnvReact";
import { isUser, isAdmin, isLoggedIn } from "../utils/Utils";

export const setMapboxglKey = () => (mapboxgl.accessToken = mapboxglKey());

// Home
export default function Home(props) {
  const [open, setOpen] = useState("c");
  const [loginState, setLoginState] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) return;
    //console.log(props.getLoadState);
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
            <Location id="locationComponent" loadState={props.loadState} />
            <React.StrictMode>
              <Map id="all" />
            </React.StrictMode>
          </div>
        </div>
      ) : (
        <h2 className="text-center">
          <Link to="/">Please login</Link>
        </h2>
      );

    case 2:
      return (
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-2">
              <nav className="navbar navbar-vertical-left">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#"
                      onClick={() => setOpen("c")}
                    >
                      <i className="fa fa-calendar" aria-hidden="true"></i>{" "}
                      Create event
                    </a>
                  </li>
                  <li className="nav-item ">
                    <a
                      className="nav-link"
                      href="#"
                      onClick={() => setOpen("r")}
                    >
                      <i className="fa fa-calendar" aria-hidden="true"></i>{" "}
                      Retrieve events
                    </a>
                  </li>
                  <li className="nav-item ">
                    <a
                      className="nav-link"
                      href="#"
                      onClick={() => setOpen("u")}
                    >
                      <i className="fa fa-calendar" aria-hidden="true"></i>{" "}
                      Update event
                    </a>
                  </li>
                  <li className="nav-item ">
                    <a
                      className="nav-link"
                      href="#"
                      onClick={() => setOpen("d")}
                    >
                      <i className="fa fa-calendar" aria-hidden="true"></i>{" "}
                      Delete event
                    </a>
                  </li>
                  <li className="nav-item ">
                    <a
                      className="nav-link"
                      href="#"
                      onClick={() => setOpen("uc")}
                    >
                      <i className="fa fa-user" aria-hidden="true"></i> Create
                      user
                    </a>
                  </li>
                  <li className="nav-item ">
                    <a
                      className="nav-link"
                      href="#"
                      onClick={() => setOpen("ur")}
                    >
                      <i className="fa fa-user" aria-hidden="true"></i> Retrieve
                      user information
                    </a>
                  </li>
                  <li className="nav-item ">
                    <a
                      className="nav-link"
                      href="#"
                      onClick={() => setOpen("uu")}
                    >
                      <i className="fa fa-user" aria-hidden="true"></i> Update
                      user information
                    </a>
                  </li>
                  <li className="nav-item ">
                    <a
                      className="nav-link"
                      href="#"
                      onClick={() => setOpen("ud")}
                    >
                      <i className="fa fa-user" aria-hidden="true"></i> Delete
                      user
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-10 ">
              <div>{open === "c" ? <CreateData /> : ""}</div>
              <div>{open === "r" ? <DataTable /> : ""}</div>
              <div>{open === "u" ? <UpdateData /> : ""}</div>
              <div>{open === "d" ? <DeleteData /> : ""}</div>
              <div>{open === "uc" ? <UserCreateData /> : ""}</div>
              <div>{open === "ur" ? <UserRetrieveData /> : ""}</div>
              <div>{open === "uu" ? <UserUpdateData /> : ""}</div>
              <div>{open === "ud" ? <UserDeleteData /> : ""}</div>{" "}
            </div>
          </div>
        </div>
      );

    default:
      return <div>Error</div>;
  }
}
// Home;

// Location
function Location(props) {
  const [statee, setStatee] = useState(false);
  const [statee2, setStatee2] = useState(false);
  const [list, setList] = useState([]);
  const [sortState, setSortState] = useState(0);
  /*
  const LocationInit = () => async () => {
    setStatee(false);
    setStatee2(false);
    console.log(list.length);
    if (list.length === 0) return setTimeout(() => LocationInit(), 2000);
  };

  useEffect(() => LocationInit());
  */

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
    setList(list2);
    //console.log(list2);

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
          //console.log(list);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (props.loadState) {
      //console.log(props.loadState);
      fetch(server2URL + "/venueEventCnt")
        .then((res) => res.json())
        .then((data) => {
          //console.log(list);
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
    }
  }, [props.loadState, list, statee, statee2]);

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
          Sort by Number of events {sortState === -1 ? "↑" : "↓"}
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
                  Number of events{" "}
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
