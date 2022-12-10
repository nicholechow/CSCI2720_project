import React from "react";
import { useParams } from "react-router-dom";

export default function Venue() {
  let { loc } = useParams();
  return (
    <div className="justify-content-center text-center">
      <h1 id="loc">{loc}</h1>
      <div>Some description about this location(?</div>
      <div className="col-8 mx-auto my-4">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">title</th>
              <th scope="col">datetime</th>
              <th scope="col">presenter</th>
              <th scope="col">description</th>
            </tr>
          </thead>
          <tbody id="eventList">
            <tr>
              <th scope="col">1</th>
              <td>event 1</td>
              <td>00:00</td>
              <td>abc</td>
              <td>/</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
