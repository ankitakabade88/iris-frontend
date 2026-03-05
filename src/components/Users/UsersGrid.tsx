import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaThLarge, FaTable } from "react-icons/fa";

import { fetchUsers } from "../../api/userApi";
import UserCard from "./UserCard";
import UsersTable from "../Tables/UsersTable";
import type { User } from "../Tables/UsersTable";

import "./UsersGrid.css";

export default function UsersGrid() {
  const [view, setView] =
    useState<"cards" | "table">("cards");

  const [search, setSearch] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  /* ========= NORMALIZE ========= */

  const users = useMemo<User[]>(
    () =>
      (Array.isArray(data) ? data : []).map(
        (u: any): User => ({
          _id: u._id,
          name: u.name ?? "Unknown User",
          email: u.email ?? "-",

          // ✅ STRICT ROLE TYPE
          role:
            String(u.role).toLowerCase() === "admin"
              ? "admin"
              : "employee",

          status: u.isActive ? "Active" : "Pending",
        })
      ),
    [data]
  );

  /* ========= SEARCH ========= */

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    return users.filter(u =>
      `${u.name} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  /* ========= UI ========= */

  return (
    <div className="users-grid-page">

      {/* ===== TOOLBAR ===== */}
      <div className="grid-toolbar">

        <input
          className="search-input"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="toolbar-actions">

          {/* VIEW SWITCH */}
          <div className="view-toggle">
            <button
              className={view === "table" ? "active" : ""}
              onClick={() => setView("table")}
            >
              <FaTable />
            </button>

            <button
              className={view === "cards" ? "active" : ""}
              onClick={() => setView("cards")}
            >
              <FaThLarge />
            </button>
          </div>

          <button className="add-user-btn">
            + Add User
          </button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      {view === "cards" ? (
        <div className="users-grid">

          {isLoading ? (
            <div className="empty-state">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">No users found</div>
          ) : (
            filteredUsers.map(user => (
              <UserCard
                key={user._id}
                name={user.name}
                role={user.role}
                isAdmin={user.role === "admin"}
                isActive={user.status === "Active"}
                onClick={() => {}}
              />
            ))
          )}

        </div>
      ) : (
        <UsersTable users={filteredUsers} />
      )}
    </div>
  );
}