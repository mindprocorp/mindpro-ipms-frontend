import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatPrice } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export type DepositColType = {
  depositSendDate: string;
  depositCheckDate: string;
  depositAmount: string;
  depositFee: string;
  depositName: string;
  depositBank: string;
  note: string;
};

export const depositCol: ColumnDef<DepositColType>[] = [
  selectColumn<DepositColType>(36),

  {
    id: "bankingDate",
    accessorFn: (row: any) => row.bankingDate || row.depositSendDate,
    header: "입금일",
    size: 100,
    cell: ({ getValue }) => <div className="text-center">{formatDate(getValue())}</div>,
  },
  {
    id: "totalAmount",
    accessorFn: (row: any) => row.totalAmount || row.bankingAmount || row.depositAmount,
    header: "입금액",
    size: 120,
    cell: ({ getValue }) => (
      <div className="text-right px-2 font-medium">
        {formatPrice(getValue())}
      </div>
    ),
  },

  {
    accessorKey: "depositFee",
    header: "입금수수료",
    size: 100,
    cell: ({ getValue }) => (
      <div className="text-right px-2">
        {formatPrice(getValue())}
      </div>
    ),
  },
  {
    accessorKey: "depositName",
    header: "입금방법",
    size: 100,
    cell: ({ getValue }) => <div className="text-center">{getValue() as string || "-"}</div>,
  },
  {
    accessorKey: "depositBank",
    header: "입금은행",
    size: 100,
    cell: ({ getValue }) => <div className="text-center">{getValue() as string || "-"}</div>,
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 200,
    cell: ({ getValue }) => <div className="px-2 truncate">{getValue() as string || "-"}</div>,
  },
];

