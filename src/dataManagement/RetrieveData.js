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

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { server2URL } from "../utils/EnvReact";
import "../style.css";

const columns = [
  { field: "eventid", headerName: "eventid" },
  { field: "title", headerName: "Title", width: 300 },
  { field: "description", headerName: "description", width: 300 },
  { field: "presenter", headerName: "presenter", width: 300 },
  { field: "price", headerName: "price", width: 300 },
  { field: "venuename", headerName: "venuename", width: 300 },
  { field: "venueid", headerName: "venueid", width: 300 },
  { field: "latitude", headerName: "latitude", width: 300 },
  { field: "longitude", headerName: "longitude", width: 300 },
  { field: "datetime", headerName: "datetime", width: 300 },
];

const DataTable = () => {
  const [tableData, setTableData] = useState([]);

  const [rows, setRows] = useState(tableData);
  const [deletedRows, setDeletedRows] = useState([]);

  useEffect(() => {
    fetch(server2URL + "/listall")
      .then((data) => data.json())
      .then((data) => setTableData(data));
  }, []);

  return (
    <div style={{ height: 700, width: "100%" }}>
      <DataGrid
        getRowId={(data) => data.eventid}
        rows={tableData}
        columns={columns}
        pageSize={12}
        checkboxSelection={false}
        onSelectionModelChange={({ selectionModel }) => {
          const rowIds = selectionModel.map((rowId) =>
            parseInt(String(rowId), 10)
          );
          const rowsToDelete = tableData.filter((row) =>
            rowIds.includes(row.id)
          );
          setDeletedRows(rowsToDelete);
          console.log(deletedRows);
        }}
      />
    </div>
  );
};

export default DataTable;
