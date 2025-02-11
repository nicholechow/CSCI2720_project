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

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Map } from "./Map";
import { server2URL } from "../utils/EnvReact";
import { isUser, isLoggedIn } from "../utils/Utils";
import { Link } from "react-router-dom";

function CommentRow(props) {
  //console.log(props);
  return (
    <tr>
      <td>{props.username}</td>
      <td>{props.comment}</td>
    </tr>
  );
}
export default function Venue(props) {
  const { venueId } = useParams();
  const [venueName, setVenueName] = useState("");
  const [fav, setFav] = useState(false);
  const [state, setState] = useState(false);
  const [status, setStatus] = useState(true);
  const changeLocFav = () => {
    setFav(!fav);
    fetch(server2URL + "/changeFav/" + sessionStorage.username, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ venueId: parseInt(venueId) }),
    })
      .then()
      .then(() => {
        //console.log(fav);
        if (status === true) {
          setState(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (isLoggedIn() && props.loadState) {
      fetch(server2URL + "/venueName/" + venueId)
        .then((res) => res.text())
        .then((data) => {
          //console.log(data);
          if (data === "not found") {
            setStatus(false);
          } else if (venueName.length === 0) {
            setVenueName(data);
            setStatus(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (isUser()) {
        fetch(server2URL + "/fav/" + sessionStorage.username + "/" + venueId)
          .then((res) => res.json())
          .then((data) => {
            //console.log(data);
            if (state === false && status === true) {
              setFav(data);
              setState(true);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [props.loadState, state, fav]);
  return isLoggedIn() ? (
    status ? (
      <div className="justify-content-center text-center">
        <h1 id="venueName">
          {venueName}
          {isUser() && props.loadState ? (
            <button
              className={
                fav ? "btn btn-danger mx-2" : "btn btn-outline-danger mx-2"
              }
              onClick={() => changeLocFav(venueId)}
            >
              ♥
            </button>
          ) : (
            ""
          )}
        </h1>
        <nav className="navbar navbar-expand-sm navbar-light bg-light justify-content-center">
          <ul className="navbar-nav">
            <li className="nav-item mx-3">
              <a href="#map" className="nav-link">
                Map
              </a>
            </li>
            <li className="nav-item mx-3">
              <a href="#events" className="nav-link">
                Events
              </a>
            </li>
            <li className="nav-item mx-3">
              <a href="#comments" className="nav-link">
                Comments
              </a>
            </li>
          </ul>
        </nav>
        <React.StrictMode>
          <Map id={venueId} />
        </React.StrictMode>

        <Detail id={venueId} loadState={props.loadState} />
        <Comments id={venueId} loadState={props.loadState} />
      </div>
    ) : (
      <h1 className="text-center">Location not found</h1>
    )
  ) : (
    <h2 className="text-center">
      <Link to="/">Please login</Link>
    </h2>
  );
}

function Detail(props) {
  const [list, setList] = useState([]);

  useEffect(() => {
    document.title = "Detail";
  }, []);

  useEffect(() => {
    if (props.loadState) {
      fetch(server2URL + "/venueEvents/" + props.id)
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          if (list.length === 0) setList(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.loadState, list]);

  return (
    <div className="col-sm-12 col-md-12 col-lg-10 mx-auto my-4">
      <section id="events">
        <h4>Events</h4>
        {list.length !== 0 ? (
          <div className="overflow-auto">
            <table
              className="table table-hover"
              style={{ fontSize: "2.5vmin" }}
            >
              <thead className="thead-light">
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Datetime</th>
                  <th scope="col">Presenter</th>
                  <th scope="col">Price</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody id="eventList">
                {list.map((loc, i) => (
                  <tr key={i}>
                    <td>{loc.title}</td>
                    <td>{loc.datetime}</td>
                    <td>{loc.presenter}</td>
                    <td>{loc.price}</td>
                    <td>{loc.description}</td>
                  </tr>
                ))}
                {/* )} */}
              </tbody>
            </table>
          </div>
        ) : (
          <h5>Loading</h5>
        )}
      </section>
    </div>
  );
}

// Comments
function Comments(props) {
  const [list, setList] = useState([]);
  const [state, setState] = useState(false);
  const commentSubmit = () => {
    let commentContent = document.getElementById("commentContent").value.trim();
    if (commentContent.length !== 0) {
      fetch(server2URL + "/createComment/" + props.id, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: sessionStorage.username,
          commentContent: commentContent,
        }),
      })
        .then()
        .then(() => {
          document.getElementById("commentContent").value = "";
          setState(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (props.loadState) {
      fetch(server2URL + "/comment/" + props.id)
        .then((res) => res.json())
        .then((data) => {
          if (state === false) {
            //console.log(data);
            setList(data);
            setState(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.loadState, state]);
  return (
    <section
      id="comments"
      className="col-sm-12 col-md-10 p-2 m-1 border border-primary rounded-1 d-inline-block"
    >
      <h4>Comments</h4>

      {list.length === 0 ? (
        <h5>No comment</h5>
      ) : (
        <table className="d-inline-block">
          <thead>
            <tr>
              <th className="pe-4 mr-auto">Username</th>
              <th className="pe-4 mr-auto">Comment</th>
            </tr>
          </thead>
          <tbody>
            {/* Fetch Data & Insert Here Automatically*/}

            {list.map((loc, i) => (
              <CommentRow
                key={i}
                username={loc.username}
                comment={loc.comment}
              />
            ))}
          </tbody>
        </table>
      )}

      {isUser() ? (
        <form>
          <div className="form-group">
            {/*<label for="commentContent"></label>*/}
            <br />
            <textarea
              id="commentContent"
              className="form-control"
              name="commentContent"
              placeholder="Write your comment here"
            />
            <br />
          </div>
          <button type="reset" className="btn btn-primary mx-2">
            Clear
          </button>
          <button
            type="button"
            onClick={() => commentSubmit()}
            className="btn btn-primary mx-2"
          >
            Submit
          </button>
        </form>
      ) : null}
    </section>
  );
}
// Comments;
