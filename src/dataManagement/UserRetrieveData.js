import React from "react";
import { server2URL } from "../utils/EnvReact"

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
                  .join("")
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="col-sm-12 col-md-12 col-lg-12 m-auto">
                <section className="p-1 mx-1 border border-primary rounded-1">
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