import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Map } from "./Home";
function LocationRow(props) {
  console.log(props);
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
  fetch("http://localhost:8889/venueName/" + venueId)
    .then((res) => res.text())
    .then((data) => {
      //console.log(venueName);
      if (venueName.length === 0) setVenueName(data);
    })
    .catch((error) => {
      console.log(error);
    });
  return (
    <div className="justify-content-center text-center">
      <h1 id="venueName">
        {venueName}
        <button className="btn btn-danger mx-2">♥</button>
      </h1>
      <Map id={venueId} />
      <Detail id={venueId} />
      <Comments id={venueId} />
    </div>
  );
}

function Detail(props) {
  const [list, setList] = useState([]);
  fetch("http://localhost:8889/venueEvents/" + props.id)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      if (list.length === 0) setList(data);
    })
    .catch((error) => {
      console.log(error);
    });
  return (
    <div className="col-sm-12 col-md-12 col-lg-8 mx-auto my-4">
      <h4>Events</h4>
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">title</th>
            <th scope="col">datetime</th>
            <th scope="col">presenter</th>
            <th scope="col">price</th>
            <th scope="col">description</th>
          </tr>
        </thead>
        <tbody id="eventList">
          {list.length === 0 ? (
            <tr>
              <th scope="col">/</th>
              <td>Loading...</td>
              <td>/</td>
              <td>/</td>
              <td>/</td>
              <td>/</td>
            </tr>
          ) : (
            list.map((loc, i) => (
              <tr key={i}>
                <th scope="col">{i + 1}</th>
                <td>{loc.title}</td>
                <td>{loc.datetime}</td>
                <td>{loc.presenter}</td>
                <td>{loc.price}</td>
                <td>{loc.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Comments
function Comments(props) {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8889/comment/" + props.id)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        if (list.length === 0) {
          setList(data);
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
              <LocationRow username={loc.username} comment={loc.comment} />
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
// Comments;
