import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import Sidebar from "../components/Sidebars/Sidebar";
import Header from "../components/Header/Header";

import { logout } from "../store/authSlice";

import "./MainLayout.css";

export default function MainLayout() {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const fullscreenRoutes = ["/book-room"];

  const isFullscreen = fullscreenRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (isFullscreen) {
    return (
      <div className="fullscreen-layout">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="content-wrapper">
        <Header onLogout={handleLogout} />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}