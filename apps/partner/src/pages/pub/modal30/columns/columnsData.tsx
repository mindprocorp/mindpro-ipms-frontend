import type { Table, Row } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";

export const columnsData = [
  selectColumn<any>(36),
  {
    accessorKey: "id",
    header: "id",
    // size: 40,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "amount",
    header: "권리",
    size: 40,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "email",
    header: "email",
    // size: 40,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "사건마감일",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "사건마감일",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "사건마감일",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
    meta: { pin: "left" },
  },
  {
    accessorKey: "status",
    header: "사건마감일",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "사건마감일",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
];
