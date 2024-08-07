import { IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import api from "../../../config/axios";

const handleConfirm = (id, rows, setRows, linkapi, fetfunction) => {
  confirmAlert({
    title: "Xác nhận xóa",
    message: "Bạn có chắc muốn xóa không?",
    buttons: [
      {
        label: "Có",
        onClick: () => handleDelete(id, linkapi, fetfunction),
      },
      {
        label: "Không",
        onClick: () => {},
      },
    ],
    overlayClassName: "custom-confirm-alert-overlay",
  });
};

const handleDelete = async (id, linkapi, fetfunction) => {
  try {
    if (linkapi === "club") {
      await api.delete(`/${linkapi}/${id}`);
    } else if (linkapi === "block-staff") {
      await api.put(`/${linkapi}/${id}`);
    }
    fetfunction();
  } catch (error) {
    console.error(`Error handling ${linkapi} for ID ${id}:`, error);
  }
};

const DeleteButton = ({ id, rows, setRows, linkapi, fetfunction }) => (
  <IconButton
    onClick={() => handleConfirm(id, rows, setRows, linkapi, fetfunction)}
    sx={{ color: "#AF2525" }}
  >
    <DeleteOutlineIcon />
  </IconButton>
);

export default DeleteButton;
