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
import { server2URL } from "../utils/EnvReact";
import { isLoggedIn } from "../utils/Utils";
import { Link } from "react-router-dom";

export default function Search(props) {
  useEffect(() => {
    document.title = "Search";
  }, []);

  return isLoggedIn() ? (
    <div className="justify-content-center text-center">
      <Detail loadState={props.loadState} />
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

function Detail(props) {
  const { keyword } = useParams();
  const [list, setList] = useState([]);
  useEffect(() => {
    if (props.loadState) {
      //console.log(props.loadState);
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
    }
  }, [keyword, props.loadState]);

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
