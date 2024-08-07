/* eslint-disable react/prop-types */
import {
  RouterProvider,
  createBrowserRouter,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgetPassword from "./pages/forgot-password";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./pages/reset-password";
import Layout from "./components/layout";
import HomePage from "./pages/home";
import Dashboard from "./components/dashboard";
import { useSelector } from "react-redux";
import { selectUser } from "./redux/features/counterSlice";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Profile from "./components/profile";
import Intro from "./pages/intro";
import Contact from "./pages/contact";
import ManageAccount from "./components/manage-account";
import Staff from "./components/staff";
import Court from "../src/components/club";
import Club from "../src/components/club";
import Booking from "./pages/booking";
import HistoryBooking from "./pages/history-booking";
import ClubDetail from "./pages/club-detail";
import ListClub from "./pages/list-club";
import Payment from "./pages/payment";
import LayoutAdmin from "./components/layoutadmin";
import AdminDasboard from "./components/admin";
import Contest from "./pages/contest";
import ListContest from "../src/components/list-contest";
import ScheduleContest from "./components/scheduler-contest";
import Checkin from "./pages/check-in";
import Tournament from "../src/components/tournaments/gamebycustomer";
import Wallet from "./pages/wallet";
import ContestDetail from "../src/components/contest-detail";
import RegisterContest from "../src/components/register-contest";
// import Game from "../src/components/tournaments/game";
import Game from "../src/components/tournaments/gamebyowner";
import Policy from "./pages/policy";
import ClubOwnerDasboard from "./components/clubowner";
import BookingManager from "./components/booking-manager-clubowner";
import PromotionManager from "./components/promotion-manager";
import Bill from "./pages/bill";
import ClubAdmin from "./components/club-admin";
import Tournaments from "./components/tournaments";
import NewTournament from "./components/tournaments/newtournament";
import TournamentDetail from "./components/tournaments/tournamentsdetail";

function App() {
  const user = useSelector(selectUser);

  const AuthRoute = ({ children }) => {
    if (user == null) {
      toast.error("Bạn cần đăng nhập tài khoản admin trước");
      return <Navigate to="/login" />;
    } else if (user.role != "ADMIN") {
      toast.error("Bạn không phải là Admin!");
      return <Navigate to="/login" />;
    }
    return children;
  };

  const ClubOwnerRoute = ({ children }) => {
    if (user == null) {
      toast.error("Bạn cần đăng nhập tài khoản chủ CLB trước");
      return <Navigate to="/login" />;
    } else if (user.role != "CLUB_OWNER") {
      toast.error("Bạn không phải là chủ CLB!");
      return <Navigate to="/login" />;
    }
    return children;
  };

  const PrivateRoute = ({ children }) => {
    if (user == null) {
      toast.error("Bạn cần đăng nhập");
      return <Navigate to="/login" />;
    }
    return children;
  };

  const ClubStafRoute = ({ children }) => {
    if (user == null) {
      toast.error("Bạn cần đăng nhập tài khoản chủ nhân viên trước");
      return <Navigate to="/login" />;
    } else if (user.role != "CLUB_STAFF") {
      toast.error("Bạn không phải là nhân viên");
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/introduction",
          element: <Intro />,
        },
        {
          path: "/club-detail/:clubId",
          element: <ClubDetail />,
        },
        {
          path: "/list-club",
          element: <ListClub />,
        },
        {
          path: "/policy",
          element: <Policy />,
        },
        {
          path: "/checkin/:id",
          element: (
            <ClubStafRoute>
              <Checkin />
            </ClubStafRoute>
          ),
        },
        {
          path: "/contact",
          element: (
            // <PrivateRoute>
            <Contact />
            // </PrivateRoute>
          ),
        },
        {
          path: "/wallet",
          element: <Wallet />,
        },

        {
          path: "/bill",
          element: (
            <PrivateRoute>
              <Bill />
            </PrivateRoute>
          ),
        },
        {
          path: "/contest/*",
          element: (
            // <PrivateRoute>
            <Contest />
            // </PrivateRoute>
          ),
          children: [
            {
              path: "dangdienra",
              element: <ListContest />,
            },
            {
              path: "sapdienra",
              element: <ListContest />,
            },
            {
              path: "thang",
              element: <ScheduleContest />,
            },
            {
              path: "dangdienra/chitiet2/:id",
              element: <Tournament />,
            },
            {
              path: "sapdienra/chitiet/:id",
              element: <ContestDetail />,
            },
            {
              path: "dangdienra/chitiet/:id",
              element: <ContestDetail />,
            },
            {
              path: "sapdienra/thamgia/:id",
              element: <RegisterContest />,
            },
          ],
        },

        {
          path: "/booking/:clubId",
          element: (
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            // <PrivateRoute>
            <Profile />
            // </PrivateRoute>
          ),
        },
        {
          path: "/history-booking",
          element: (
            // <PrivateRoute>
            <HistoryBooking />
            // </PrivateRoute>
          ),
        },

        {
          path: "/payment",
          element: <Payment />,
        },
      ],
    },
    {
      path: "/game",
      element: <Game />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgetPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/admin",
      element: (
        <AuthRoute>
          <LayoutAdmin />
        </AuthRoute>
      ),
      children: [
        {
          path: "",
          element: <AdminDasboard />,
        },
        {
          path: "account",
          element: <ManageAccount />,
        },
        {
          path: "club",
          element: <ClubAdmin />,
        },
        {
          path: "setting",
          element: <Staff />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/dashboard/",
      element: (
        <ClubOwnerRoute>
          <Dashboard />
        </ClubOwnerRoute>
      ),
      children: [
        {
          path: "",
          element: <ClubOwnerDasboard />,
        },
        {
          path: "club",
          element: <Club />,
        },
        {
          path: "staff/:clubId",
          element: <Staff />,
        },
        {
          path: "staff/allstaff",
          element: <Staff />,
        },
        {
          path: "court/:clubId",
          element: <Court />,
        },
        {
          path: "bookingmanager/:clubId",
          element: <BookingManager />,
        },
        {
          path: "promotionmanager/:clubId",
          element: <PromotionManager />,
        },

        {
          path: "manage-account",
          element: <ManageAccount />,
        },
        {
          path: "tournaments",
          element: <Tournaments />,
          children: [
            {
              path: "new",
              element: <NewTournament />,
            },
            {
              path: "detail/:id",
              element: <TournamentDetail />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
