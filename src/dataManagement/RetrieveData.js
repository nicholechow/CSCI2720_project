import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { server2URL } from "../utils/EnvReact";
import { withStyles } from "@mui/styles";
// import "../style.css";

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

const StyledDataGrid = withStyles({
  root: {
    "& .MuiDataGrid-renderingZone": {
      maxHeight: "none !important",
    },
    "& .MuiDataGrid-cell": {
      lineHeight: "unset !important",
      maxHeight: "none !important",
      whiteSpace: "normal !important",
      wordWrap: "break-word !important",
    },
    "& .MuiDataGrid-row": {
      maxHeight: "none !important",
    },
  },
})(DataGrid);

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
      <StyledDataGrid
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
