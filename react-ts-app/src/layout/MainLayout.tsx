import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebars/Sidebar";
import Header from "../components/Header/Header";
import SettingsModal from "../components/Settings/SettingsModal";
import "./MainLayout.css";

interface Props {
  onLogout: () => void;
}

export default function MainLayout({ onLogout }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        onOpenSettings={() => setSettingsOpen(true)}
        onLogout={onLogout}
      />

      <div className="content-wrapper">
        {/*HEADER */}
        <Header />

        {/* ✅ PAGE CONTENT */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
