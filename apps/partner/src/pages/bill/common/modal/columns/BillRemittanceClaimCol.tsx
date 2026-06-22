import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export const billRemittcolumnsDataanceCol: ColumnDef<any>[] = [
  selectColumn<any>(36),


  {
    accessorKey: "remitDate",
    header: "송금일",
    cell: ({ getValue }) => <div className="text-center">{formatDate(getValue())}</div>,
  },
  {
    accessorKey: "remitAmount",
    header: "송금액",
    cell: ({ getValue }) => (
      <div className="text-right font-medium">
        {(getValue() as number)?.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "remitExchangeRate",
    header: "송금환율",
    cell: ({ getValue }) => (
      <div className="text-right">
        {(getValue() as number)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    ),
  },
  {
    accessorKey: "convertedAmountKrw",
    header: "환산비용(KRW)",
    cell: ({ getValue }) => (
      <div className="text-right font-bold text-blue-600">
        {(getValue() as number)?.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "remitFee",
    header: "송금수수료",
    cell: ({ getValue }) => (
      <div className="text-right">
        {(getValue() as number)?.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "remark",
    header: "비고",
    cell: ({ getValue }) => <div className="text-left">{getValue() as string}</div>,
  },
];
