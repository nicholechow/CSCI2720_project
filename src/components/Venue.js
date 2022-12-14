import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Map } from "./Home";
import { server2URL } from "../utils/EnvExpress"

function CommentRow(props) {
  //console.log(props);
  return (
    <tr>
      <td>{props.username}</td>
      <td>{props.comment}</td>
    </tr>
  );
}
export default function Venue() {
  const { venueId } = useParams();
  const [venueName, setVenueName] = useState("");
  const [fav, setFav] = useState(false);
  const [state, setState] = useState(false);
  const changeLocFav = () => {
    fetch(server2URL + "/changeFav/user0", {
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
        setState(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetch(server2URL + "/venueName/" + venueId)
      .then((res) => res.text())
      .then((data) => {
        //console.log(venueName);
        if (venueName.length === 0) setVenueName(data);
      })
      .catch((error) => {
        console.log(error);
      });
    fetch(server2URL + "/fav/user0/" + venueId)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        if (state === false) {
          setFav(data);
          setState(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return (
    <div className="justify-content-center text-center">
      <h1 id="venueName">
        {venueName}
        <button
          className={
            fav ? "btn btn-danger mx-2" : "btn btn-outline-danger mx-2"
          }
          onClick={() => changeLocFav(venueId)}
        >
          ♥
        </button>
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
      <Map id={venueId} />
      <Detail id={venueId} />
      <Comments id={venueId} />
    </div>
  );
}

function Detail(props) {
  const [list, setList] = useState([]);

  useEffect(() => {
    document.title = "Detail";
  }, []);

  fetch(server2URL + "/venueEvents/" + props.id)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      if (list.length === 0) setList(data);
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <div className="col-sm-12 col-md-12 col-lg-10 mx-auto my-4">
      <section id="events">
        <h4>Events</h4>
        {list.length !== 0 ? (
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Datetime</th>
                <th scope="col">Presenter</th>
                <th scope="col">Price</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody id="eventList">
              {/* {list.length === 0 ? (
              <tr>
                <th scope="col">/</th>
                <td>Loading...</td>
                <td>/</td>
                <td>/</td>
                <td>/</td>
                <td>/</td>
              </tr>
            ) : ( */}
              {list.map((loc, i) => (
                <tr key={i}>
                  <th scope="col">{i + 1}</th>
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
          username: "user0",
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
    fetch(server2URL + "/comment/" + props.id)
      .then((res) => res.json())
      .then((data) => {
        if (data.length !== 0 && state === false) {
          setList(data);
          setState(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return (
    <section
      id="comments"
      className="col-sm-12 col-md-4 p-2 m-1 border border-primary rounded-1 d-inline-block"
    >
      <h4>Comments</h4>
      <table className="d-inline-block">
        <thead>
          <tr>
            <th className="pe-4 mr-auto">Username</th>
            <th className="pe-4 mr-auto">Comment</th>
          </tr>
        </thead>

        {/* Fetch Data & Insert Here Automatically*/}
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td>No Result</td>
              <td>No Result</td>
            </tr>
          ) : (
            list.map((loc, i) => (
              <CommentRow
                key={i}
                username={loc.username}
                comment={loc.comment}
              />
            ))
          )}
        </tbody>
      </table>
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
    </section>
  );
}
// Comments;
