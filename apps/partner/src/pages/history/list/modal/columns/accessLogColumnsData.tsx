import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";

export type AccessLogColType = {
  createAt: string;
  userId: string;
  userNameKo: string;
  loginIp: string;
  category: string;
  loginDeviceType: string;
  loginType: string;
};

export const accessLogColumnsData: ColumnDef<AccessLogColType, any>[] = [
  {
    accessorKey: "createAt",
    header: "접속일시",
    size: 160,
    cell: ({ getValue }: any) => <div>{getValue()}</div>,
  },
  {
    accessorKey: "userId",
    header: "아이디",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("userId")}</div>,
  },
  {
    accessorKey: "userNameKo",
    header: "사용자명",
    size: 120,
    cell: ({ row }: any) => <div>{row.getValue("userNameKo")}</div>,
  },
  {
    accessorKey: "loginIp",
    header: "IP주소",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("loginIp")}</div>,
  },
  {
    accessorKey: "category",
    header: "구분",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "loginDeviceType",
    header: "접속 기기 유형",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("loginDeviceType")}</div>,
  },
  {
    accessorKey: "loginType",
    header: "로그인 유형",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("loginType")}</div>,
  },
  {
    accessorKey: "loginCountry",
    header: "접속국가코드",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("loginCountry")}</div>,
  },
];
