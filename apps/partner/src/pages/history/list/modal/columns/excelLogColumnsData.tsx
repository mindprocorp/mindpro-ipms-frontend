import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";

export type ExcelLogColType = {
  seq: string;
  downloadDateTime: string;
  userId: string;
  userName: string;
  menuName: string;
  fileName: string;
  rowCount: number;
  ipAddress: string;
};

export const excelLogColumnsData: ColumnDef<ExcelLogColType, any>[] = [
  {
    accessorKey: "downloadDateTime",
    header: "변환일시",
    size: 160,
    cell: ({ getValue }: any) => <div>{formatDate(getValue())}</div>,
  },
  {
    accessorKey: "userId",
    header: "아이디",
    size: 120,
    cell: ({ row }: any) => <div>{row.getValue("userId")}</div>,
  },
  {
    accessorKey: "userName",
    header: "사용자명",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("userName")}</div>,
  },
  {
    accessorKey: "menuName",
    header: "메뉴명",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("menuName")}</div>,
  },
  {
    accessorKey: "fileName",
    header: "파일명",
    size: 200,
    cell: ({ row }: any) => <div>{row.getValue("fileName")}</div>,
  },
  {
    accessorKey: "rowCount",
    header: "건수",
    size: 80,
    cell: ({ row }: any) => <div className="text-right">{row.getValue("rowCount")?.toLocaleString()}</div>,
  },
  {
    accessorKey: "ipAddress",
    header: "IP주소",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("ipAddress")}</div>,
  },
];
