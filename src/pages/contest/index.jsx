import { useState, useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  Link,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import {
  Link as RouterLink,
  Route,
  Routes,
  useLocation,
  Outlet,
} from "react-router-dom";
import ListContest from "../../components/list-contest";
import ScheduleContest from "../../components/scheduler-contest";
import { tokens } from "../../theme";
import ContestDetail from "../../components/contest-detail";
import RegisterContest from "../../components/register-contest";

import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";

// Để sử dụng được sync, registerLicense là cái key mà ngta cấp
import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF5cWWFCdkx3TXxbf1x0ZFRMYVRbR3BPIiBoS35RckVkW3xecHBSQ2hbVUJ0"
);

const Contest = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();

  const Breadcrumb = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: "20px", mt: "20px" }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          return (
            <Link
              key={to}
              component={RouterLink}
              to={to}
              color="inherit"
              sx={{ textTransform: "capitalize" }}
            >
              {value}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  return (
    <Box p={15} ml={10}>
      {Breadcrumb()}

      <Box display="flex" justifyContent="right" p={5}>
        <Box display="flex">
          <Button
            component={RouterLink}
            to="dangdienra"
            sx={{
              borderBottom:
                location.pathname.startsWith("/contest/dangdienra") ||
                location.pathname === "/contest"
                  ? `2px solid ${colors.greenAccent[500]}`
                  : "none",
            }}
          >
            Đang diễn ra
          </Button>

          <Button
            component={RouterLink}
            to="/contest/sapdienra"
            sx={{
              borderBottom: location.pathname.startsWith("/contest/sapdienra")
                ? `2px solid ${colors.greenAccent[500]}`
                : "none",
            }}
          >
            Sắp diễn ra
          </Button>
          <Button
            component={RouterLink}
            to="thang"
            sx={{
              borderBottom:
                location.pathname === "/contest/thang"
                  ? `2px solid ${colors.greenAccent[500]}`
                  : "none",
            }}
          >
            Tháng
          </Button>
        </Box>
      </Box>

      <Routes>
        <Route path="/" element={<ListContest />} />
      </Routes>

      <Outlet />
    </Box>
  );
};

export default Contest;
