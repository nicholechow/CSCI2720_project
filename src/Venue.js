import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Map } from "./Home";

export default function Venue() {
  const { venueId } = useParams();
  fetch("http://localhost:8889/venueName/" + venueId)
    .then((res) => res.text())
    .then((data) => {
      //console.log(data);
      const Location = document.getElementById("venueName");
      Location.innerHTML =
        data + `<button class="btn btn-danger mx-2">♥</button>`;
    })
    .catch((error) => {
      console.log(error);
    });
  return (
    <div className="justify-content-center text-center">
      <h1 id="venueName">
        <button className="btn btn-danger mx-2">♥</button>
      </h1>
      <p>Some description about this location(?</p>
      <Map />
      <Detail />
      <Comments />
    </div>
  );
}

function Detail() {
  const { venueId } = useParams();
  fetch("http://localhost:8889/venueEvents/" + venueId)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      const Location = document.getElementById("eventList");
      Location.innerHTML = data
        .map((ele, i) => {
          return `<tr>
            <th scope="col">${i + 1}</th>
            <td>${ele.title}</td>
            <td>${ele.datetime}</td>
            <td>${ele.presenter}</td>
            <td>${ele.description}</td>`;
        })
        .join("");
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
            {/*<th scope="col">price</th>*/}
            <th scope="col">description</th>
          </tr>
        </thead>
        <tbody id="eventList">
          <tr>
            <th scope="col">1</th>
            <td>event 1</td>
            <td>00:00</td>
            <td>abc</td>
            {/*<td>$100</td>*/}
            <td>/</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Comments
function Comments() {
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
            {/* <td>Time</td> */}
          </tr>
        </thead>

        {/* Fetch Data & Insert Here Automatically*/}
        <tbody>
          <tr>
            <td>Alex Au</td>
            <td>Cool Location</td>
          </tr>
          <tr>
            <td>Bedgy Bo</td>
            <td>Agree</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
// Comments;
