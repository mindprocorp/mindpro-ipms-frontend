import type { Table, Row } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";

export const columnsData = [
  selectColumn<any>(36),
  {
    accessorKey: "id",
    header: "입금번호",
    // size: 40,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "amount",
    header: "입금일",
    // size: 40,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "email",
    header: "입금액",
    // size: 40,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "총금액",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "잔액",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "비고",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
];
