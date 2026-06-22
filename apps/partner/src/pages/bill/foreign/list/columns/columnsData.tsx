import type { ColumnDef } from "@tanstack/react-table";
import type { Payment } from "../_components/TabList";
import { selectColumn } from "@shared/util/selectColumn";

export const columnsData: ColumnDef<Payment, any>[] = [
  selectColumn<Payment>(36),

  {
    accessorKey: "id",
    header: "id",
    // size: 40,
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "amount",
    header: "권리",
    // size: 40,
    cell: ({ row }) => <div className="capitalize">{row.getValue("amount")}</div>,
  },
  {
    accessorKey: "email",
    header: "email",
    // size: 40,
    cell: ({ row }) => <div className="capitalize">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: "사건마감일",
    size: 200,
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
];
