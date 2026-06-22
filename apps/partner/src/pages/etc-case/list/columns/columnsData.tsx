import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";


export const getColumnsData = (): ColumnDef<any>[] => [
//   selectColumn<any>(),

  /* --- [1] 구분 --- */
  { id: "appClassification.codeName", accessorFn: (row) => row.appClassification?.codeName, header: "구분", size: 80 },

  /* --- [2] OurRef --- */
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 160,
    cell: ({ row }) => {
      const { conflictSeq, ourRef } = row.original;
      return (
        <Link
          to={`/etc-case/detail/${conflictSeq}`}
          className="text-blue-600 hover:underline font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {ourRef || "-"}
        </Link>
      );
    }
  },

  /* --- [3] 의뢰인 (JSON: client.userName) --- */
  { id: "client.userName", accessorFn: (row) => row.client?.userName, header: "의뢰인", size: 120 },

  /* --- [4] 사건종류 (JSON: caseTypeCode.codeName) --- */
  { id: "caseType.codeName", accessorFn: (row) => row.caseType?.codeName, header: "사건종류", size: 100 },

  /* --- [5] 사건명 (JSON: caseTitleKo) --- */
  { accessorKey: "caseTitleKo", header: "사건명", size: 1000 },

  /* --- [6] 날짜 및 상태 --- */
  { accessorKey: "receiptDate", header: "접수일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "dueLimitDate", header: "처리마감일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "processDate", header: "처리일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { id: "status.codeName", accessorFn: (row) => row.status?.codeName, header: "현재상태", size: 100 },
  { accessorKey: "deadlineDate", header: "사건마감일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },

  /* --- [7] 관리 정보 --- */
  { accessorKey: "yourRef", header: "YourRef", size: 120 },
  { accessorKey: "respondent", header: "상대방", size: 120 },
  { id: "foreignAgent.userName", accessorFn: (row) => row.foreignAgent?.userName, header: "해외대리인", size: 120 },
  { accessorKey: "finalResult", header: "최종결과", size: 120 }, // 현재 JSON엔 null이지만 키는 유지
  { accessorKey: "abandonDate", header: "포기취하일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "abandonContent", header: "포기내용", size: 200 },

  /* --- [8] 담당자 --- */
  { id: "adminMgr.userName", accessorFn: (row) => row.adminMgr?.userName, header: "관리담당자", size: 100 },
  { id: "caseMgr.userName", accessorFn: (row) => row.caseMgr?.userName, header: "사건담당자", size: 100 },
  { id: "attorney.userName", accessorFn: (row) => row.attorney?.userName, header: "담당변리사", size: 100 },

  /* --- [9] 출원 정보 --- */
  { accessorKey: "note", header: "비고", size: 1000 },
  { id: "rightType.codeName", accessorFn: (row) => row.rightType?.codeName, header: "권리", size: 80 },
  { accessorKey: "appNo", header: "출원번호", size: 130 },
  { accessorKey: "appDate", header: "출원일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "regNo", header: "등록번호", size: 130 },
  { accessorKey: "regDate", header: "등록일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "titleKo", header: "국문명칭", size: 1000 },
  { accessorKey: "titleEn", header: "영문명칭", size: 400 },
];
