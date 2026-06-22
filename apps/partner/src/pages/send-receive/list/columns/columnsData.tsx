import type { ColumnDef } from "@tanstack/react-table";
import type { SendReceiveListType } from "@shared/api/sendReceive/sendReceiveApi.ts";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export const sendReceiveListColumnsData: ColumnDef<SendReceiveListType, any>[] = [
//   selectColumn<SendReceiveListType>(50),
  {
    accessorKey: "caseCategoryName",
    header: "사건구분",
    size: 70,
    cell: ({ row }: any) => <div>{row.getValue("caseCategoryName")}</div>,
  },
  {
    accessorKey: "progressTypeName",
    header: "구분",
    size: 50,
    cell: ({ row }: any) => <div>{row.getValue("progressTypeName")}</div>,
  },
  {
    id: "rightType.codeName",
    accessorFn: (row) => row.rightType?.codeName,
    header: "권리",
    size: 50,
    cell: (info: any) => <div>{info.getValue()}</div>,
  },
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 130,
    cell: ({ row }: any) => <div>{row.getValue("ourRef")}</div>,
  },
  {
    accessorKey: "appDate",
    header: "출원일",
    size: 80,
    cell: ({ row }: any) => <div>{formatDate(row.getValue("appDate"))}</div>,
  },
  {
    accessorKey: "appNo",
    header: "출원번호",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("appNo")}</div>,
  },
  {
    accessorKey: "regDate",
    header: "등록일",
    size: 80,
    cell: ({ row }: any) => <div>{formatDate(row.getValue("regDate"))}</div>,
  },
  {
    accessorKey: "regNo",
    header: "등록번호",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("regNo")}</div>,
  },
  {
    accessorKey: "productClass",
    header: "분류",
    size: 50,
    cell: ({ row }: any) => <div>{row.getValue("productClass")}</div>,
  },
  {
    accessorKey: "eventDate",
    header: "일자",
    size: 80,
    cell: ({ row }: any) => <div>{formatDate(row.getValue("eventDate"))}</div>,
  },
  {
    accessorKey: "content",
    header: "내용",
    size: 1000,
    cell: ({ row }: any) => <div>{row.getValue("content")}</div>,
  },
  {
    accessorKey: "applicantName",
    header: "출원인",
    size: 80,
    cell: ({ row }: any) => <div>{row.getValue("applicantName")}</div>,
  },
  {
    accessorKey: "titleKo",
    header: "국문명칭",
    size: 1000,
    cell: ({ row }: any) => <div>{row.getValue("titleKo")}</div>,
  },
];
