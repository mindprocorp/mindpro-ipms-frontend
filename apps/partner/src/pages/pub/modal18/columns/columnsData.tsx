import type { TestData } from "@pages/pub/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";

export const columnsData: ColumnDef<TestData, any>[] = [
  selectColumn<TestData>(36),

  {
    accessorKey: "id",
    header: "국가코드",
    size: 120,
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "amount",
    header: "국가명",
    size: 10000,
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
];
