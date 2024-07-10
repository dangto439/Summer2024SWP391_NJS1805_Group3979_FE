import { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme.js";
import Header from "../dashboard/Header.jsx";
import DeleteButton from "../global/deletebutton/index.jsx";
// import Forms from "./forms.jsx";
import api from "../../config/axios.js";
const Club = ({ clubId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  // const [isFormOpen, setFormOpen] = useState(false);
  // const [mode, setMode] = useState("");
  // const [selectedCourtId, setSelectedCourtId] = useState("");

  // const handleUpdate = (id) => {
  //   setMode("update");
  //   setSelectedCourtId(id);
  //   setFormOpen(true);
  // };

  const handleCreate = async () => {
    await api.post(`/court/${clubId}`);
    fetchCourts();
  };

  const columns = [
    {
      field: "courtId",
      headerName: "Mã Sân",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "courtName",
      headerName: "Tên Sân",
      flex: 1,
      cellClassName: "name-column--cell",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "courtStatus",
      headerName: "Trạng thái",
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "delete",
    //   headerName: "Xóa",
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => (
    //     <DeleteButton
    //       id={params.id}
    //       rows={rows}
    //       setRows={setRows}
    //       linkapi={"court"}
    //     />
    //   ),
    // },
  ];

  const fetchCourts = async () => {
    try {
      // nội dung fetch
      const response = await api.get(`/courts/${clubId}`);
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, [clubId]);

  return (
    <Box m="20px" className="team-container">
      <Header
        title="Quản lý sân"
        subtitle=""
        buttonText="Tạo sân mới"
        onButtonClick={handleCreate}
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
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.courtId}
        />
      </Box>

      {/* <Forms
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        fetFunction={fetchCourts}
        mode={mode}
        id={selectedCourtId}
      /> */}
    </Box>
  );
};

export default Club;
