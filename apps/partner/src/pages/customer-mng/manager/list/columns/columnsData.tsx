import type { ColumnDef } from "@tanstack/react-table";
//   타입을 실제 데이터 구조에 맞게 any 혹은 확장된 타입을 사용하세요
import type { CustomerManagerListItem } from "@shared/api/customer/customerApi";

type CodeMaps = {
  clientCategoryMap: Record<string, string>;
};

export const getColumnsData = ({ clientCategoryMap }: CodeMaps): ColumnDef<any>[] => [
  {
    accessorKey: "userNameKo", //   managerName -> userNameKo
    header: "담당자명",
    size: 120,
  },
  {
    accessorKey: "deptName", //   유지 (키값 일치)
    header: "부서",
    size: 120,
  },
  {
    accessorKey: "userPosition", //   position -> userPosition
    header: "직책",
    size: 100,
  },
  {
    accessorKey: "userMobileNo", //   mobile -> userMobileNo
    header: "휴대폰",
    size: 130,
  },
  {
    accessorKey: "userTelNo", //   추가된 필드
    header: "전화번호",
    size: 130,
  },
  {
    accessorKey: "userEmail", //   email -> userEmail
    header: "이메일",
    size: 200,
  },
  {
    accessorKey: "userFaxNo", //   fax -> userFaxNo
    header: "FAX",
    size: 130,
  },
  {
    accessorKey: "userPostNo", //   zipCode -> userPostNo
    header: "우편번호",
    size: 80,
  },
  {
    accessorKey: "userAddr", //   address -> userAddr
    header: "주소",
    size: 250,
    cell: ({ row }) => `${row.original.userAddr || ""} ${row.original.userAddrDetail || ""}`.trim(),
  },
  {
    accessorKey: "etaxYn", //   추가: 전자세금계산서 여부
    header: "세금계산서",
    size: 100,
    cell: ({ getValue }) => (getValue() === "Y" ? "대상" : "미대상"),
  },
  {
    accessorKey: "note", //   추가: 비고
    header: "비고",
    size: 200,
  },
];
