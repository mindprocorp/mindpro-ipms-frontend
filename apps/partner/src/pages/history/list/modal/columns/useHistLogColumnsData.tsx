import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";

export type UseHistLogColType = {
  createAt: string;
  createUser: string;
  clientIp: string;
  menuName: string;
  actionName: string;
  reqUrl: string;
  reqMethod: string;
  userAgent: string;
};

export const useHistLogColumnsData: ColumnDef<UseHistLogColType, any>[] = [
  {
    accessorKey: "createAt",
    header: "사용일시",
    size: 160,
    cell: ({ getValue }: any) => <div>{getValue()}</div>,
  },
  {
    accessorKey: "createUser",
    header: "아이디",
    size: 120,
    cell: ({ row }: any) => <div>{row.getValue("createUser")}</div>,
  },

  {
    accessorKey: "clientIp",
    header: "클라이언트IP",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("clientIp")}</div>,
  },
  {
    accessorKey: "menuName",
    header: "메뉴명",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("menuName")}</div>,
  },
  {
    accessorKey: "actionName",
    header: "actionType",
    size: 200,
    cell: ({ row }: any) => <div>{row.getValue("actionName")}</div>,
  },
  {
    accessorKey: "reqUrl",
    header: "요청 URL",
    size: 150,
    cell: ({ row }: any) => <div>{row.getValue("reqUrl")}</div>,
  },
  {
    accessorKey: "reqMethod",
    header: "요청메소드",
    size: 100,
    cell: ({ row }: any) => <div>{row.getValue("reqMethod")}</div>,
  },
  {
    accessorKey: "userAgent",
    header: "useAgent",
    size: 200,
    cell: ({ row }: any) => <div>{row.getValue("userAgent")}</div>,
  },
];
