import React from "react";
import { server2URL } from "../utils/EnvReact";
class RetrieveData extends React.Component {
  componentDidMount() {
    fetch(server2URL + "/listall")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        const RetrieveData = document.getElementById("RetrieveData");
        RetrieveData.innerHTML = data
          .map((ele, i) => {
            return `<tr key=${i}>
            <td>${i + 1}</td>        
            <td>${ele.venueid}</td>
            <td>${ele.venuename}</td>
            <td>${ele.eventid}</td>
            <td>${ele.title}</td>
            <td>${ele.datetime}</td>           
            <td>${ele.latitude}</td>
            <td>${ele.longitude}</td>
            <td>${ele.description}</td>
            <td>${ele.presenter}</td>
            <td>${ele.price}</td>
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
        <section className="p-1 mx-1">
          <h4>Events Retrieved</h4>

          <table
            className="p-2 text-center table table-hover"
            style={{ tableLayout: "fixed" }}
          >
            <thead className="thead-light">
              <tr>
                <th scope="col">Count</th>
                <th scope="col">Venue ID</th>
                <th scope="col">Venue Name</th>
                <th scope="col">Event ID</th>
                <th scope="col">Title</th>
                <th scope="col">Datetime</th>
                <th scope="col">Latitude</th>
                <th scope="col">Longitude</th>
                <th scope="col">Description</th>
                <th scope="col">Presenter</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody id="RetrieveData">
              <tr></tr>
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}

export default RetrieveData;
