import type { ColumnDef } from "@tanstack/react-table";
import type { CostColType } from "@pages/common/bottom/modal/columns/CostCol.tsx";
import { selectColumn } from "@shared/util/selectColumn";

export type BillDistributeColType = {
  costCategoryCode: {
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

export const billDistributeCol: ColumnDef<BillDistributeColType>[] = [
  selectColumn<BillDistributeColType>(36),


  {
    id: "costCategory.codeName",
    accessorFn: (row) => row.costCategory?.codeName,
    header: "담당자",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "itemContent",
    header: "부서",
    size: 200,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "unitPrice",
    header: "실적구분",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "quantity",
    header: "기여율",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "amount",
    header: "실적인정일자",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
    meta: { pin: "left" },
  },
  {
    accessorKey: "vatAmount",
    header: "실적",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "totalAmount",
    header: "비고",
    size: 100,
    cell: ({ row, getValue }) => <div className="capitalize">{getValue() as string}</div>,
  }

];
