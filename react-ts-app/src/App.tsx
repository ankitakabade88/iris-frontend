import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import RoomPage from "./pages/Room_temp";
import EmployeePage from "./pages/Employee_temp";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profiles/Profile";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login
              onLogin={() => {
                localStorage.setItem("auth", "true");
                setIsAuthenticated(true);
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout onLogout={handleLogout} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/employees" element={<EmployeePage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
