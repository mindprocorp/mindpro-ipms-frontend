import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerListItem } from "@shared/api/customer/customerApi";
import { formatDate } from "@shared/util/formatUtil";

type CodeMaps = {
  clientCategoryMap: Record<string, string>;
  applicantCategoryMap: Record<string, string>;
  corpCategoryMap: Record<string, string>;
};

export const getColumnsData = ({ clientCategoryMap, applicantCategoryMap, corpCategoryMap }: CodeMaps): ColumnDef<CustomerListItem>[] => [
  {
    accessorKey: "clientCategory",
    header: "고객구분",
    size: 100,
    cell: ({ row }) => {
      const code = row.original.clientCategory;
      return code ? (clientCategoryMap[code] || code) : "";
    },
  },
  {
    accessorKey: "applicantCategory",
    header: "출원인구분",
    size: 100,
    cell: ({ row }) => {
      const code = row.original.applicantCategory;
      return code ? (applicantCategoryMap[code] || code) : "";
    },
  },
  {
    accessorKey: "corpCategory",
    header: "기업구분",
    size: 100,
    cell: ({ row }) => {
      const code = row.original.corpCategory;
      return code ? (corpCategoryMap[code] || code) : "";
    },
  },
  {
    accessorKey: "attorneyCategory",
    header: "변리사구분",
    size: 100,
  },
  {
    accessorKey: "clientNameKo",
    header: "고객명(한글)",
    size: 150,
    cell: ({ row }) => {
      const customerSeq = row.original.customerSeq;
      const clientNameKo = row.getValue("clientNameKo") as string;
      return (
        <span className="text-p-color-1 font-medium cursor-pointer">
          {clientNameKo || customerSeq}
        </span>
      );
    },
  },
  {
    accessorKey: "clientNameEn",
    header: "고객명(영문)",
    size: 1000,
  },
  {
    accessorKey: "companyName",
    header: "회사명",
    size: 1000,
  },
  {
    accessorKey: "deptName",
    header: "부서",
    size: 120,
  },
  {
    accessorKey: "position",
    header: "직책",
    size: 100,
  },
  {
    accessorKey: "registrationDate",
    header: "등록일",
    size: 110,
    cell: ({ getValue }) => <div>{formatDate(getValue())}</div>,
  },
];
