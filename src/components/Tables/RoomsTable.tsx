import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";

import React, { useMemo, useState } from "react";
import type { Room } from "../Rooms/RoomCard";

import "./RoomsTable.css";

/* =====================================================
   PROPS
===================================================== */

type Props = {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
};

/* =====================================================
   COMPONENT
===================================================== */

function RoomsTable({ rooms, onSelectRoom }: Props) {

  /* ================= TABLE STATE ================= */

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  /* ================= COLUMNS ================= */

  const columns = useMemo<ColumnDef<Room>[]>(() => [
    { accessorKey: "name", header: "Room" },
    { accessorKey: "capacity", header: "Capacity" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "location", header: "Location" },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`room-status ${
            row.original.isAvailable
              ? "available"
              : "unavailable"
          }`}
        >
          {row.original.isAvailable ? "Available" : "Busy"}
        </span>
      ),
    },
  ], []);

  /* ================= TABLE INSTANCE ================= */

  const table = useReactTable({
    data: rooms,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="rooms-table-surface">

      {/* HEADER */}
      <div className="rooms-table-header">
        <div>
          <h2 className="table-title">Rooms</h2>
          <span className="record-count">
            {rooms.length} rooms
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div className="rooms-table-scroll">
        <table className="rooms-table">

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

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  No rooms found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="room-row"
                  onClick={() => onSelectRoom(row.original)}
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

export default React.memo(RoomsTable);