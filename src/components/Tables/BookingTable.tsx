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

import { useState, useMemo } from "react";
import "./BookingTable.css";

/* ================= TYPES ================= */

export type Booking = {
  _id: string;
  room: string;
  employee: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "Upcoming" | "Live" | "Completed";
};

type Props = {
  bookings: Booking[];
  onRowClick?: (booking: Booking) => void;
};

/* ================= HELPERS ================= */

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ================= COMPONENT ================= */

export default function BookingTable({
  bookings,
  onRowClick,
}: Props) {

  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 8,
    });

  /* ================= COLUMNS ================= */

  const columns = useMemo<ColumnDef<Booking>[]>((
    () => [
      { accessorKey: "employee", header: "Employee" },

      { accessorKey: "room", header: "Room" },

      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => formatDate(row.original.date),
      },

      {
        id: "time",
        header: "Time",
        cell: ({ row }) => (
          <span className="time-cell">
            {row.original.startTime}
            <span className="time-separator">—</span>
            {row.original.endTime}
          </span>
        ),
      },

      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status.toLowerCase();

          return (
            <span className={`status-badge ${status}`}>
              {status === "live" && (
                <span className="live-dot" />
              )}
              {row.original.status}
            </span>
          );
        },
      },

      {
        accessorKey: "purpose",
        header: "Purpose",
        cell: info => info.getValue() || "—",
      },
    ]
  ), []);

  /* ================= TABLE ================= */

  const table = useReactTable({
    data: bookings,
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
    <div className="booking-table-wrapper">

      <div className="table-toolbar">
        <div>
          <h2>Bookings</h2>
          <span className="record-count">
            {bookings.length} records
          </span>
        </div>
      </div>

      <div className="table-scroll">
        <table className="booking-table">

          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="th-content">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="sort-indicator">
                          {sorted === "asc"
                            ? "↑"
                            : sorted === "desc"
                            ? "↓"
                            : ""}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="clickable-row"
                onClick={() => onRowClick?.(row.original)}
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
            ))}
          </tbody>

        </table>
      </div>

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