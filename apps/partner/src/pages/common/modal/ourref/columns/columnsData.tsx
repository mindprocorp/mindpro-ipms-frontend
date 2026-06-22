import type { ColumnDef } from "@tanstack/react-table";
import { type SearchAppItem } from "@shared/api/common/commApi.ts";
import { formatDate } from "@shared/util/formatUtil";

// ColumnDef<TData, TValue> 에서 TValue를 any로 지정하여 DataTable 컴포넌트와의 타입 충돌 해결
export const columnsData: ColumnDef<SearchAppItem, any>[] = [
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 140,
  },
  {
    id: "rightType",
    accessorFn: (row) => row.rightType?.codeName,
    header: "권리",
    size: 80,
    cell: ({ row }) => row.original.rightType?.codeName || "-",
  },
  {
    id: "country",
    accessorFn: (row) => row.country?.codeName,
    header: "국가",
    size: 80,
    cell: ({ row }) => row.original.country?.codeName || "-",
  },
  {
    accessorKey: "appNo",
    header: "출원번호",
    size: 150,
  },
  {
    accessorKey: "appDate",
    header: "출원일",
    size: 110,
    cell: ({ getValue }) => <div>{formatDate(getValue())}</div>,
  },
  {
    accessorKey: "regNo",
    header: "등록번호",
    size: 150,
  },
  {
    accessorKey: "regDate",
    header: "등록일",
    size: 110,
    cell: ({ getValue }) => <div>{formatDate(getValue())}</div>,
  },
  {
    id: "applicant",
    accessorFn: (row) => row.applicant?.userName,
    header: "출원인",
    size: 150,
    cell: ({ row }) => row.original.applicant?.userName || "-",
  },
  {
    accessorKey: "titleKo",
    header: "사건명칭(국문)",
    size: 300,
    cell: ({ row }) => (
      <div className="truncate w-[280px] text-left" title={String(row.getValue("titleKo") || "")}>
        {row.getValue("titleKo")}
      </div>
    ),
  },
];

// import { Checkbox } from "@repo/ui";

// export const columnsData = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//         size="sm"
//       />
//     ),
//     size: 36,
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//         size="sm"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "id",
//     header: "id",
//     // size: 40,
//     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
//   },
//   {
//     accessorKey: "amount",
//     header: "권리",
//     size: 40,
//     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
//   },
//   {
//     accessorKey: "email",
//     header: "email",
//     // size: 40,
//     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "사건마감일",
//     size: 200,
//     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "사건마감일",
//     size: 200,
//     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "사건마감일",
//     size: 200,
//     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
//     meta: { pin: "left" },
//   },
//   {
//     accessorKey: "status",
//     header: "사건마감일",
//     size: 200,
//     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "사건마감일",
//     size: 200,
//     cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
//   },
// ];
