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

import React from "react";
import { server2URL } from "../utils/EnvReact";

class UserRetrieveData extends React.Component {
  componentDidMount() {
    fetch(server2URL + "/userlist")
      .then((res) => res.json())
      .then((data) => {
        const UserRetrieveData = document.getElementById("UserRetrieveData");
        UserRetrieveData.innerHTML = data
          .map((ele) => {
            return `<tr>
                        <td>${ele.username}</td>
                        <td>${ele.pw}</td>
                        <td>${ele.fav}</td>
                    </tr>`;
          })
          .join("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
        <section className="p-1 mx-1 ">
          <h4>User Retrieve</h4>

          <table className="p-2 text-center table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Password</th>
                <th scope="col">Favourite Location</th>
              </tr>
            </thead>
            <tbody id="UserRetrieveData">
              <tr></tr>
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}

export default UserRetrieveData;
