import type { ColumnDef } from "@tanstack/react-table";
import type { DueDateItem } from "@shared/api/duedate/duedateApi";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";


const renderName = (val: any): string => {
  if (!val) return "";
  if (Array.isArray(val)) {
    return val.map((v) => renderName(v)).join(", ");
  }
  if (typeof val === "object") {
    return val.userName || val.codeName || val.clientNameKo || val.nameKo || val.name || "";
  }
  return String(val);
};

export const getColumnsData = (): ColumnDef<DueDateItem>[] => [
//   selectColumn<DueDateItem>(36),

  {
    accessorKey: "caseCategory",
    header: "사건구분",
    size: 100,
    cell: ({ row }) => renderName(row.getValue("caseCategory")),
  },
  {
    accessorKey: "appRoute",
    header: "구분",
    size: 80,
    cell: ({ row }) => renderName(row.getValue("appRoute")),
  },
  {
    accessorKey: "country",
    header: "국가",
    size: 80,
    cell: ({ row }) => renderName(row.getValue("country")),
  },
  {
    accessorKey: "rightType",
    header: "권리",
    size: 80,
    cell: ({ row }) => renderName(row.getValue("rightType")),
  },
  {
    accessorKey: "deadline",
    header: "마감일",
    size: 110,
    cell: ({ row }) => formatDate(row.getValue("deadline") as string),
  },
  {
    accessorKey: "dueType",
    header: "마감종류",
    size: 100,
    cell: ({ row }) => renderName(row.getValue("dueType")),
  },
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 150,
  },
  {
    accessorKey: "appNo",
    header: "출원번호",
    size: 140,
  },
  {
    accessorKey: "appDate",
    header: "출원일",
    size: 110,
    cell: ({ row }) => formatDate(row.getValue("appDate") as string),
  },
  {
    accessorKey: "regNo",
    header: "등록번호",
    size: 140,
  },
  {
    accessorKey: "regDate",
    header: "등록일",
    size: 110,
    cell: ({ row }) => formatDate(row.getValue("regDate") as string),
  },
  {
    accessorKey: "titleKo",
    header: "국문명칭",
    size: 180,
  },
  {
    accessorKey: "titleEn",
    header: "영문명칭",
    size: 400,
  },
  {
    accessorKey: "applicant",
    header: "출원인",
    size: 120,
    cell: ({ row }) => renderName(row.getValue("applicant")),
  },
  {
    accessorKey: "client",
    header: "의뢰인",
    size: 120,
    cell: ({ row }) => renderName(row.getValue("client")),
  },
  {
    accessorKey: "inventor",
    header: "발명자",
    size: 120,
    cell: ({ row }) => renderName(row.getValue("inventor")),
  },
  {
    accessorKey: "deptName",
    header: "부서",
    size: 100,
    cell: ({ row }) => renderName(row.getValue("deptName")),
  },
  {
    accessorKey: "yourRef",
    header: "YourRef",
    size: 130,
  },
  {
    accessorKey: "applicantRefNo",
    header: "출원인관리번호",
    size: 140,
  },
  {
    accessorKey: "adminMgr",
    header: "관리담당자",
    size: 110,
    cell: ({ row }) => renderName(row.getValue("adminMgr")),
  },
  {
    accessorKey: "caseMgr",
    header: "사건담당자",
    size: 110,
    cell: ({ row }) => renderName(row.getValue("caseMgr")),
  },
  {
    accessorKey: "attorney",
    header: "담당변호인",
    size: 110,
    cell: ({ row }) => renderName(row.getValue("attorney")),
  },
];
