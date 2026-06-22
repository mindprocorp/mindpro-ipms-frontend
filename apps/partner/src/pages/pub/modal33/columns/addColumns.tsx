import type { Table, Row } from "@tanstack/react-table";
import { RHF } from "@repo/ui";
import { selectColumn } from "@shared/util/selectColumn";

export const addColumns = [
  selectColumn<any>(36),

  {
    accessorKey: "amount",
    header: "의뢰인(한글)",
    // size: 40,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "email",
    header: "의뢰인(영문)",
    // size: 40,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "특허고객번호",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
];
