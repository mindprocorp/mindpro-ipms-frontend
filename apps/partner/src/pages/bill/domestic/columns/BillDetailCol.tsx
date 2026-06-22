import type { ColumnDef } from "@tanstack/react-table";
import { formatPrice } from "@shared/util/formatUtil";
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
    cell: ({ getValue }) => <div className="text-center">{getValue() as string || "-"}</div>,
  },
  {
    accessorKey: "itemContent",
    header: "청구내역",
    size: 200,
    cell: ({ getValue }) => <div className="px-2 truncate">{getValue() as string || "-"}</div>,
  },
  {
    accessorKey: "unitPrice",
    header: "단가",
    size: 100,
    cell: ({ getValue }) => (
      <div className="text-right px-2">
        {formatPrice(getValue())}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "수량",
    size: 80,
    cell: ({ getValue }) => <div className="text-center">{getValue() as string || "1"}</div>,
  },
  {
    accessorKey: "amount",
    header: "금액",
    size: 100,
    cell: ({ getValue }) => (
      <div className="text-right px-2">
        {formatPrice(getValue())}
      </div>
    ),
  },
  {
    accessorKey: "vatAmount",
    header: "부가세",
    size: 100,
    cell: ({ getValue }) => (
      <div className="text-right px-2">
        {formatPrice(getValue())}
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "청구합계",
    size: 120,
    cell: ({ getValue }) => (
      <div className="text-right px-2 font-bold text-blue-700">
        {formatPrice(getValue())}
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 200,
    cell: ({ getValue }) => <div className="px-2 truncate">{getValue() as string || "-"}</div>,
  },
];
