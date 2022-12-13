import React, { useEffect, useState } from "react";
import { server2URL } from "../utils/EnvReact"

export default function Account() {
  const [favList, setFavList] = useState([]);

  useEffect(() => {
    document.title = "Account Profile";
  }, []);

  useEffect(() => {
    fetch(server2URL + "/fav/user0")
      .then((res) => res.json())
      .then((fav) => {
        if (favList.length === 0) {
          //console.log(fav);
          setFavList(fav);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // I want to do this to get rid of a warning, this changed does not seem to ruin everything at first glance...
    // }, [favList.length]);
  }, []);

  return (
    <div className="col-sm-12 col-md-10 col-lg-8 m-auto justify-content-center text-center">
      <h1>Account</h1>
      <h2>username: user0</h2>
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
