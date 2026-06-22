import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";

export type DownloadLogColType = {
  seq: string;
  downloadDateTime: string;
  userId: string;
  userName: string;
  fileName: string;
  fileSize: number;
  ourRef: string;
  ipAddress: string;
};

export const downloadLogColumnsData: ColumnDef<DownloadLogColType, any>[] = [
  {
    accessorKey: "downloadDateTime",
    header: "다운로드일시",
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
    accessorKey: "fileName",
    header: "파일명",
    size: 200,
    cell: ({ row }: any) => <div>{row.getValue("fileName")}</div>,
  },
  {
    accessorKey: "fileSize",
    header: "크기(byte)",
    size: 100,
    cell: ({ row }: any) => <div className="text-right">{row.getValue("fileSize")?.toLocaleString()}</div>,
  },
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 130,
    cell: ({ row }: any) => <div>{row.getValue("ourRef")}</div>,
  },
  {
    accessorKey: "ipAddress",
    header: "IP주소",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("ipAddress")}</div>,
  },
];
