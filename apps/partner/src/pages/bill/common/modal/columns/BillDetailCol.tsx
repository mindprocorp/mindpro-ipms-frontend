import type { ColumnDef } from "@tanstack/react-table";
import type { CostColType } from "@pages/common/bottom/modal/columns/CostCol.tsx";
import { selectColumn } from "@shared/util/selectColumn";

export type BillDetailColType = {
  costCategory: {
    code: string;
    codeName: string;
  };
  itemContent: string;
  unitPrice: string;
  quantity: string;
  amount: string;
  vatAmount: string;
  totalAmount: string;
  note: string;
};

export const billDetailCol: ColumnDef<BillDetailColType>[] = [
  selectColumn<BillDetailColType>(36),

  {
    id: "costCategory.codeName",
    accessorFn: (row) => row.costCategory?.codeName,
    header: "비용구분",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "itemContent",
    header: "청구내용",
    size: 200,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "unitPrice",
    header: "단가",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "quantity",
    header: "수량",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "amount",
    header: "금액",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
    meta: { pin: "left" },
  },
  {
    accessorKey: "vatAmount",
    header: "부가세",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "totalAmount",
    header: "청구합계",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 200,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
];
