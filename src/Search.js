import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const cors = require("cors");

export default function Search() {
  
  useEffect(() => {
    document.title = 'Search';
  }, []);

  return (
    <div className="justify-content-center text-center">
      <Detail />
    </div>
  );
}

function LocationRow(props) {
  console.log(props);
  return (
    <tr>
      <td>
        <a href={"http://localhost:3000/venue/" + props.venueId}>
          {props.venueName}
        </a>
      </td>
      <td>{props.eventCnt}</td>
    </tr>
  );
}

function Detail() {
  const { keyword } = useParams();
  const [list, setList] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8889/search/" + keyword)
      .then((res) => res.json())
      .then((data) => {
        if (data.length !== 0 && list.length === 0)
          setList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
      <h1>Result for: {keyword}</h1>
      <section
        id="locations"
        className="p-1 mx-1 border border-primary rounded-1"
      >
        <h4>Locations</h4>

        <table className="p-2 text-center table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col">Location</th>
              <th scope="col"> number of events</th>
            </tr>
          </thead>
          <tbody id="LocationTbody">
            {list.length === 0 ? (
              <h2>No Result</h2>
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
