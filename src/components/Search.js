import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server2URL } from "../utils/EnvReact";
import { isLoggedIn } from "../utils/Utils";
import { Link } from "react-router-dom";

export default function Search() {
  useEffect(() => {
    document.title = "Search";
  }, []);

  return isLoggedIn() ? (
    <div className="justify-content-center text-center">
      <Detail />
    </div>
  ) : (
    <h2 className="text-center">
      <Link to="/">Please login</Link>
    </h2>
  );
}

function LocationRow(props) {
  //console.log(props);
  return (
    <tr>
      <td>
        <Link to={"/venue/" + props.venueId}>{props.venueName}</Link>
      </td>
      <td>{props.eventCnt}</td>
    </tr>
  );
}

function Detail() {
  const { keyword } = useParams();
  const [list, setList] = useState([]);
  useEffect(() => {
    fetch(server2URL + "/search/" + keyword)
      .then((res) => res.json())
      .then((data) => {
        //console.log(keyword);
        //console.log(list);
        if (data.length !== null) setList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [keyword]);

  return (
    <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
      <h1>Result for: {keyword}</h1>
      <section
        id="locations"
        className="p-1 mx-1 border border-primary rounded-1"
      >
        <h4>Locations</h4>

        {list.length === 0 ? (
          <h2>No Result</h2>
        ) : (
          <table className="p-2 text-center table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">Location</th>
                <th scope="col"> number of events</th>
              </tr>
            </thead>
            <tbody id="LocationTbody">
              {list.map((loc, i) => (
                <LocationRow
                  key={i}
                  venueId={loc.venueId}
                  venueName={loc.venueName}
                  eventCnt={loc.eventCnt}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
