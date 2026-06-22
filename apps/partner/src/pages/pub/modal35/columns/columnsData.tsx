import type { Table, Row } from "@tanstack/react-table";
import { RHF } from "@repo/ui";
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
    header: "출원인(한글)",
    // size: 40,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "email",
    header: "출원인(영문)",
    // size: 40,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "특허고객번호",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "지분율",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "비고",
    size: 200,
    cell: ({ row }) => {
      return <RHF.Input name="testVal" label="" size="h24" />;
    },
  },
  {
    accessorKey: "status",
    header: "순서",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("status")}</div>,
    meta: { pin: "left" },
  },
];
