import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";

import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import RoomPage from "./pages/RoomPage/RoomPage";
import EmployeePage from "./pages/UserPage/UserPage";
import Bookingpage from "./pages/Bookingpage/Bookingpage";
import BookRoom from "./pages/Bookingpage/BookRoom";

import Login from "./pages/LoginPage/Login";
import SetPassword from "./pages/LoginPage/SetPassword";
import ForgotPassword from "./pages/LoginPage/ForgotPassword";

import AddUser from "./pages/Forms/AddUser";
import AddRoom from "./pages/Forms/AddRoom";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminRoute from "./components/Auth/AdminRoute";
import ChangePassword from "./pages/LoginPage/ChangePassword";

export default function App() {

  const { isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );

  return (

    <Routes>

      {/* ================= ROOT ================= */}

      <Route
        path="/"
        element={
          <Navigate
            to={isLoggedIn ? "/dashboard" : "/login"}
            replace
          />
        }
      />

      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/login"
        element={
          !isLoggedIn
            ? <Login/>
            : <Navigate to="/dashboard" replace/>
        }
      />

      {/* Forgot Password Page */}
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      {/* Password Reset Page */}
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/change-password" element={<ChangePassword/>} />


      {/* ================= PROTECTED ROUTES ================= */}

      <Route
        element={
          <ProtectedRoute>
            <MainLayout/>
          </ProtectedRoute>
        }
      >

        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/rooms" element={<RoomPage/>} />
        <Route path="/bookings" element={<Bookingpage/>} />
        <Route path="/book-room" element={<BookRoom/>} />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/users"
          element={
            <AdminRoute>
              <EmployeePage/>
            </AdminRoute>
          }
        />

        <Route
          path="/add-user"
          element={
            <AdminRoute>
              <AddUser/>
            </AdminRoute>
          }
        />

        <Route
          path="/add-room"
          element={
            <AdminRoute>
              <AddRoom/>
            </AdminRoute>
          }
        />

      </Route>

      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to={isLoggedIn ? "/dashboard" : "/login"}
            replace
          />
        }
      />

    </Routes>

  );
}