import { useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../dashboard/Header";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./index.scss";

const Staff = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState(mockDataTeam);

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this account?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setRows(rows.filter((row) => row.id !== id));
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
      overlayClassName: "custom-confirm-alert-overlay",
    });
  };
  const handleAddNewStaffAccount = () => {
    return <div></div>;
  };

  const columns = [
    {
      field: "id",
      headerName: "Staff ID",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "clubid",
      headerName: "Club ID",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "delete",
      headerName: "Delete Account",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDelete(params.id)}
          sx={{ color: "#AF2525" }}
        >
          <DeleteOutlineIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px" className="team-container">
      <Header
        title="Manage Staff Account"
        subtitle="Dĩm nè"
        onAddStaff={handleAddNewStaffAccount}
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[800],
            borderBottom: "none",
          },
          "&.MuIDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[800],
          },
          "& .MuiDataGrid-columnHeader": {
            display: "flex",
            justifyContent: "center",
          },
        }}
      >
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Staff;
