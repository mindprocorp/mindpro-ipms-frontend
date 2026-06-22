import type { ColumnDef } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";

export type HistorySearchColType = {
  seq: string;
  actionDateTime: string;
  actionType: string;
  caseCategory: string;
  ourRef: string;
  appNo: string;
  regNo: string;
  fieldName: string;
  beforeValue: string;
  afterValue: string;
  actionUser: string;
};

export const historySearchColumnsData: ColumnDef<HistorySearchColType, any>[] = [
//   selectColumn<HistorySearchColType>(50),

  {
    accessorKey: "actionDateTime",
    header: "일시",
    size: 160,
    cell: ({ row }: any) => <div>{row.getValue("actionDateTime")}</div>,
  },
  {
    accessorKey: "actionType",
    header: "작업구분",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("actionType")}</div>,
  },
  {
    accessorKey: "caseCategory",
    header: "사건구분",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("caseCategory")}</div>,
  },
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 130,
    cell: ({ row }: any) => <div>{row.getValue("ourRef")}</div>,
  },
  {
    accessorKey: "appNo",
    header: "출원번호",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("appNo")}</div>,
  },
  {
    accessorKey: "regNo",
    header: "등록번호",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("regNo")}</div>,
  },
  {
    accessorKey: "fieldName",
    header: "항목",
    size: 120,
    cell: ({ row }: any) => <div>{row.getValue("fieldName")}</div>,
  },
  {
    accessorKey: "beforeValue",
    header: "변경전",
    size: 1000,
    cell: ({ row }: any) => <div>{row.getValue("beforeValue")}</div>,
  },
  {
    accessorKey: "afterValue",
    header: "변경후",
    size: 1000,
    cell: ({ row }: any) => <div>{row.getValue("afterValue")}</div>,
  },
  {
    accessorKey: "actionUser",
    header: "작업자",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("actionUser")}</div>,
  },
];
