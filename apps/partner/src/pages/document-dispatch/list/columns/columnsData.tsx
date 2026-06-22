import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export type DocumentDispatchColType = {
  dispatchSeq: string;
  category: string;
  docType: string;
  dispatchDate: string;
  client: string;
  manager: string;
  docContent: string;
  method: string;
  sendDate: string;
  regNo: string;
  ackYn: string;
  postAddr: string;
  note: string;
};

export const documentDispatchColumnsData: ColumnDef<DocumentDispatchColType, any>[] = [
//   selectColumn<DocumentDispatchColType>(50),

  {
    accessorKey: "category",
    header: "구분",
    size: 80,
    cell: ({ row }: any) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "docType",
    header: "종류",
    size: 80,
    cell: ({ row }: any) => <div>{row.getValue("docType")}</div>,
  },
  {
    accessorKey: "dispatchDate",
    header: "일자",
    size: 120,
    cell: ({ getValue }: any) => <div>{formatDate(getValue())}</div>,
  },
  {
    accessorKey: "client",
    header: "거래처",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("client")}</div>,
  },
  {
    accessorKey: "manager",
    header: "담당자",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("manager")}</div>,
  },
  {
    accessorKey: "docContent",
    header: "문서내용",
    size: 1000,
    cell: ({ row }: any) => <div>{row.getValue("docContent")}</div>,
  },
  {
    accessorKey: "method",
    header: "방법",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("method")}</div>,
  },
  {
    accessorKey: "sendDate",
    header: "발송일",
    size: 120,
    cell: ({ getValue }: any) => <div>{formatDate(getValue())}</div>,
  },
  {
    accessorKey: "regNo",
    header: "등기번호",
    size: 140,
    cell: ({ row }: any) => <div>{row.getValue("regNo")}</div>,
  },
  {
    accessorKey: "ackYn",
    header: "수신확인",
    size: 80,
    cell: ({ row }: any) => <div>{row.getValue("ackYn")}</div>,
  },
  {
    accessorKey: "postAddr",
    header: "우편주소",
    size: 1000,
    cell: ({ row }: any) => <div>{row.getValue("postAddr")}</div>,
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 1000,
    cell: ({ row }: any) => <div>{row.getValue("note")}</div>,
  },
];
