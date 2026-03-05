import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";

import { useMemo, useState } from "react";
import "./UsersTable.css";

/* ================= TYPES ================= */

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  status: "Active" | "Pending";
};

type Props = {
  users: User[];
  onRowClick?: (user: User) => void; // ⭐ enable popup click
};

/* ================= COMPONENT ================= */

export default function UsersTable({
  users,
  onRowClick,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 8,
    });

  /* ---------- columns ---------- */

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },

      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <span className="role-text">
            {row.original.role}
          </span>
        ),
      },

      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`user-status ${
              row.original.status === "Active"
                ? "active"
                : "inactive"
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
    ],
    []
  );

  /* ---------- table ---------- */

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ================= UI ================= */

  return (
    <div className="users-table-root">

      {/* TABLE CARD */}
      <div className="users-table-wrapper">
        <table className="users-table">

          {/* HEADER */}
          <thead>
            {table.getHeaderGroups().map(group => (
              <tr key={group.id}>
                {group.headers.map(header => {
                  const sorted =
                    header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {sorted === "asc"
                        ? " ↑"
                        : sorted === "desc"
                        ? " ↓"
                        : ""}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* BODY */}
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  No users found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={
                    onRowClick ? "clickable-row" : ""
                  }
                  onClick={() =>
                    onRowClick?.(row.original)
                  }
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell ??
                          ((info) => info.getValue()),
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          ← Prev
        </button>

        <span>
          Page {table.getState().pagination.pageIndex + 1}
          {" / "}
          {table.getPageCount()}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next →
        </button>
      </div>
    </div>
  );
}