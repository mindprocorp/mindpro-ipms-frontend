import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export type PrepaymentSearchData = {
  prepaymentSeq: string;
  depositDate: string;
  depositAmount: string;
  generalBalance: string;
  designatedBalance: string;
};

export const prepaymentSearchColumns: ColumnDef<PrepaymentSearchData>[] = [
  selectColumn<PrepaymentSearchData>(36),

  {
    accessorKey: "prepaymentSeq",
    header: "선수금 입금번호",
    size: 150,
  },
  {
    accessorKey: "depositDate",
    header: "입금일",
    size: 100,
    cell: ({ getValue }) => <div>{formatDate(getValue())}</div>,
  },
  {
    accessorKey: "depositAmount",
    header: "입금액",
    size: 100,
  },
  {
    accessorKey: "generalBalance",
    header: "일반선수금 잔액",
    size: 120,
  },
  {
    accessorKey: "designatedBalance",
    header: "지정선수금 잔액",
    size: 120,
  },
];
