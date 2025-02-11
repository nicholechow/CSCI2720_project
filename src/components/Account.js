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
import { server2URL } from "../utils/EnvReact";
import { isAdmin, isUser, isLoggedIn } from "../utils/Utils";
import { Link } from "react-router-dom";
import { PromiseProvider } from "mongoose";

export default function Account(props) {
  const [favList, setFavList] = useState([]);
  const [stateAcc, setStateAcc] = useState(false);
  const changeFav = (venueId) => {
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
        //let index = favList.findIndex((item) => item.venueId === venueId);
        setStateAcc(false);
        setFavList(favList.filter((ele) => ele.venueId !== venueId));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    document.title = "Account Profile";
  }, []);

  useEffect(() => {
    if (isUser() && props.loadState && stateAcc === false) {
      //console.log(props.loadState);
      //setTimeout(() => {
      fetch(server2URL + "/fav/" + sessionStorage.username)
        .then((res) => res.json())
        .then((fav) => {
          //if (stateAcc === false) {
          //console.log(fav);
          setFavList(fav);
          setStateAcc(true);
          //}
        })
        .catch((error) => {
          console.log(error);
        });
      //}, 3000);
    }
    // I want to do this to get rid of a warning, this changed does not seem to ruin everything at first glance...
  }, [props.loadState, stateAcc]);
  // }, []);

  return isLoggedIn() ? (
    <div className="col-sm-12 col-md-10 col-lg-8 m-auto justify-content-center text-center">
      <h1>Account</h1>
      {isUser() ? (
        <div>
          <h2>
            username: <b className="text-warning">{sessionStorage.username}</b>
          </h2>
          <section
            id="favLocation"
            className="p-1 mx-1 border border-primary rounded-1"
          >
            <h3>Favourite Locations</h3>

            {favList.length === 0 ? (
              <h5>No result</h5>
            ) : (
              favList.map((ele, i) => (
                <table key={i} className="p-2 text-center table table-hover">
                  <tbody>
                    <tr>
                      <td>
                        <Link to={"/venue/" + ele.id}>{ele.venue}</Link>
                        <button
                          className={"btn btn-danger mx-3"}
                          onClick={() => changeFav(ele.id)}
                        >
                          ♥
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ))
            )}
          </section>
        </div>
      ) : isAdmin() ? (
        <div>
          <h2>
            username: <b className="text-danger">admin</b>
          </h2>
        </div>
      ) : (
        <div>
          <h2>Error</h2>
        </div>
      )}
    </div>
  ) : (
    <h2 className="text-center">
      <Link to="/">Please login</Link>
    </h2>
  );
}
