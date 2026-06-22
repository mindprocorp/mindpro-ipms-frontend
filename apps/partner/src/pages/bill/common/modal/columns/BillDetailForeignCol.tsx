import type { ColumnDef } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";

export const billDetailForeignCol: ColumnDef<any>[] = [
  selectColumn<any>(36),

  {
    // 1. 비용구분
    id: "costCategory.codeName",
    accessorFn: (row) => row.costCategory?.codeName,
    header: "비용구분",
    size: 100,
    cell: ({ getValue }) => <div className="text-center">{getValue() as string || "-"}</div>,
  },
  {
    // 2. 청구내역
    accessorKey: "itemContent",
    header: "청구내역",
    size: 200,
    cell: ({ getValue }) => <div className="px-2 truncate">{getValue() as string || "-"}</div>,
  },
  {
    // 3. 청구금액 (외화)
    //   [수정] exchangeAmount -> unitPrice (JSON 키값과 일치)
    accessorKey: "unitPrice",
    header: "청구금액",
    size: 120,
    cell: ({ getValue }) => (
      <div className="text-right px-2">
        {Number(getValue() || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    ),
  },
  {
    // 4. 청구환산액 (KRW)
    //   [수정] depositAmount -> totalAmount (JSON 키값과 일치)
    accessorKey: "totalAmount",
    header: "청구환산액(KRW)",
    size: 130,
    cell: ({ getValue }) => (
      <div className="text-right px-2 font-semibold text-blue-600">
        {Number(getValue() || 0).toLocaleString()}
      </div>
    ),
  },
  {
    // 5. 비고
    accessorKey: "note",
    header: "비고",
    size: 150,
    cell: ({ getValue }) => <div className="px-2 truncate">{getValue() as string || "-"}</div>,
  },
];
