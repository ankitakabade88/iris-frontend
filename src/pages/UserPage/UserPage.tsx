import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
setUserViewMode,
setUserStatusFilter,
} from "../../store/uiSlice";
import { fetchUsers, type User } from "../../store/userSlice";

import UserCard from "../../components/Users/UserCard";
import UserModal from "../../components/Users/UserModal";
import UserSkeleton from "../../components/Users/UserSkeleton";
import UsersTable from "../../components/Tables/UsersTable";
import type { User as TableUser } from "../../components/Tables/UsersTable";

import { TbCards } from "react-icons/tb";
import { LiaTableSolid } from "react-icons/lia";
import { AnimatePresence } from "framer-motion";

import "./UserPage.css";

type StatusFilter = "all" | "active" | "inactive";

export default function UserPage() {

const navigate = useNavigate();
const location = useLocation();
const dispatch = useAppDispatch();

const users = useAppSelector((state) => state.users.users);
const loading = useAppSelector((state) => state.users.loading);

const viewMode = useAppSelector(
(state) => state.ui.userViewMode
);

const statusFilter = useAppSelector(
(state) => state.ui.userStatusFilter
) as StatusFilter;

const currentUser = useAppSelector(
(state) => state.auth.user
);

const isAdmin = currentUser?.role === "admin";

const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [search, setSearch] = useState("");

/* ================= FETCH USERS ================= */

useEffect(() => {
if (!users.length) {
dispatch(fetchUsers());
}
}, [dispatch, users.length]);

useEffect(() => {
const state = location.state as { refresh?: boolean } | null;

if (state?.refresh) {
  dispatch(fetchUsers());
  navigate(location.pathname, { replace: true });
}

}, [location.state, navigate, location.pathname, dispatch]);

/* ================= FILTER ================= */

const filteredUsers = useMemo(() => {
let data = [...users];

if (search) {
  const term = search.toLowerCase();

  data = data.filter((u) =>
    u.name.toLowerCase().includes(term) ||
    u.email?.toLowerCase().includes(term)
  );
}

if (statusFilter === "active") {
  data = data.filter((u) => u.isActive);
}

if (statusFilter === "inactive") {
  data = data.filter((u) => !u.isActive);
}

return data;
}, [users, search, statusFilter]);

/* ================= TABLE FORMAT ================= */

const tableUsers: TableUser[] = useMemo(
() =>
filteredUsers.map((u) => ({
_id: u._id,
name: u.name,
email: u.email ?? "-",
role: u.role,
status: u.isActive ? "Active" : "Pending",
})),
[filteredUsers]
);

return ( <div className="users-page">

  <div className="page-toolbar">

    <div>
      <h1 className="page-title">Users</h1>
      <p className="page-subtitle">
        Manage organization users
      </p>
    </div>

    <div className="toolbar-right">

      <input
        className="search-input"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="filter-dropdown"
        value={statusFilter}
        onChange={(e) =>
          dispatch(
            setUserStatusFilter(
              e.target.value as StatusFilter
            )
          )
        }
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <div className="view-toggle">

        <button
          className={viewMode === "cards" ? "active" : ""}
          onClick={() =>
            dispatch(setUserViewMode("cards"))
          }
        >
          <TbCards />
        </button>

        <button
          className={viewMode === "table" ? "active" : ""}
          onClick={() =>
            dispatch(setUserViewMode("table"))
          }
        >
          <LiaTableSolid />
        </button>

      </div>

      {isAdmin && (
        <button
          className="btn-primary"
          onClick={() => navigate("/add-user")}
        >
          + Add User
        </button>
      )}

    </div>
  </div>

  <div className="users-section-card">

    <div className="section-header">
      <div>
        <h3>Users</h3>
        <span>{filteredUsers.length} users</span>
      </div>
    </div>

    {viewMode === "table" && (
      <UsersTable
        users={tableUsers}
        onRowClick={(user) => {
          const original = users.find(
            (u) => u._id === user._id
          );
          if (original) setSelectedUser(original);
        }}
      />
    )}

    {viewMode === "cards" && (

      <div className="users-grid">

        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <UserSkeleton key={`skeleton-${i}`} />
            ))
          : filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                name={user.name}
                role={user.role}
                isAdmin={isAdmin}
                isActive={user.isActive}
                onClick={() =>
                  isAdmin && setSelectedUser(user)
                }
              />
            ))}
      </div>

    )}

  </div>

  <AnimatePresence>
    {selectedUser && (
      <UserModal
        key={selectedUser._id}
        id={selectedUser._id}
        name={selectedUser.name}
        role={selectedUser.role}
        isAdmin={isAdmin}
        onClose={() => setSelectedUser(null)}
      />
    )}
  </AnimatePresence>

</div>

);
}
