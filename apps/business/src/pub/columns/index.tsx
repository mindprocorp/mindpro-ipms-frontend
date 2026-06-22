import { Checkbox } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columnsData: ColumnDef<Payment, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        size="sm"
      />
    ),
    size: 36,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        size="sm"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "id",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "amount",
    header: "권리",
    // size: 40,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "email",
    header: "email",
    // size: 40,
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "사건마감일",
    size: 200,
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
];

export const columnsDataNested: ColumnDef<Payment, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        size="sm"
      />
    ),
    size: 36,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        size="sm"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      rowSpan: 2,
      align: "center",
    },
  },
  {
    accessorKey: "id",
    header: "id",
    columns: [
      {
        header: "firstName",
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
      },
      {
        header: "lastName",
        accessorKey: "lastName",
        id: "lastName",
        cell: (info) => info.getValue(),
      },
    ],
  },
  {
    accessorKey: "amount",
    header: "권리",
    // size: 40,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      rowSpan: 2,
      align: "center",
    },
  },
  {
    accessorKey: "email",
    header: "email",
    // size: 40,
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "status",
    header: "사건마감일",
    size: 200,
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
];
