import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export const billRemittanceCol: ColumnDef<any>[] = [
  selectColumn<any>(36),

  {
    accessorKey: "depositSendDate",
    header: "송금일",
    size: 100,
    cell: ({ getValue }) => <div className="text-center">{formatDate(getValue())}</div>,
  },
  {
    accessorKey: "exchangeAmount", //   송금액(외화) 키값 수정
    header: "송금액",
    size: 120,
    cell: ({ getValue }) => (
      <div className="text-right px-2">
        {Number(getValue() || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    ),
  },
  {
    accessorKey: "exchangeRatio", //   송금환율 키값 수정 (Ratio!)
    header: "송금환율",
    size: 100,
    cell: ({ getValue }) => (
      <div className="text-right px-2">
        {Number(getValue() || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    ),
  },
  {
    accessorKey: "depositAmount", //   환산비용(KRW) 키값 수정
    header: "환산비용(KRW)",
    size: 130,
    cell: ({ getValue }) => (
      <div className="text-right px-2 font-semibold text-blue-600">
        {Number(getValue() || 0).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "depositFee", //   송금수수료 키값 수정
    header: "송금수수료",
    size: 110,
    cell: ({ getValue }) => (
      <div className="text-right px-2">
        {Number(getValue() || 0).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 200,
    cell: ({ getValue }) => (
      <div className="text-left truncate px-2" title={getValue() as string}>
        {getValue() as string || "-"}
      </div>
    ),
  },
];
