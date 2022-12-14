import React, { useEffect, useState } from "react";
import { server2URL } from "../utils/EnvReact";
import { isAdmin, isLoggedIn } from "../utils/Utils";

export default function Account() {
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
    fetch(server2URL + "/fav/" + sessionStorage.username)
      .then((res) => res.json())
      .then((fav) => {
        if (stateAcc === false) {
          //console.log(fav);
          setFavList(fav);
          setStateAcc(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // I want to do this to get rid of a warning, this changed does not seem to ruin everything at first glance...
  }, [stateAcc]);
  // }, []);

  return (
    <div className="col-sm-12 col-md-10 col-lg-8 m-auto justify-content-center text-center">
      <h1>Account</h1>
      <h2>username: {sessionStorage.username}</h2>
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
                    <a href={"http://localhost:3000/venue/" + ele.id}>
                      {ele.venue}
                    </a>
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
  );
}
