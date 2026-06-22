import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import type { ObjectionTrialListItem } from "@shared/api/objection-trial/objectionTrialApi";


type CodeMaps = {
  courtCodeMap: Record<string, string>;
  agentCodeMap: Record<string, string>;
  caseTypeCodeMap: Record<string, string>;
};

export const getColumnsData = ({
  courtCodeMap,
  agentCodeMap,
  caseTypeCodeMap
}: CodeMaps): ColumnDef<ObjectionTrialListItem>[] => [

  /* [1] 구분 */
  { id: "appClassification.codeName", accessorFn: (row) => row.appClassification?.codeName, header: "구분", size: 80 },
  /* [2] 접수일 */
  { accessorKey: "receiptDate", header: "접수일", size: 100, cell: ({getValue}) => formatDate(getValue()) },
  /* [3] OurRef - 순수하게 ourRef만 노출 */
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 160,
    cell: ({ row }) => {
      const { conflictSeq, ourRef } = row.original;
      return (
        <Link
          to={`/objection-trial/detail/${conflictSeq}`}
          className="text-blue-600 hover:underline font-medium"
          //   링크 클릭 시 Row 클릭 이벤트 중복 방지
          onClick={(e) => e.stopPropagation()}
        >
          {ourRef || "-"}
        </Link>
      );
    }
  },
  /* [4] 계류법정 ~ [32] 국문명칭 */
  {
    id: "courtCategoryCode.codeName",
    accessorFn: (row) => row.courtCategoryCode?.codeName,
    header: "계류법정",
    size: 100,
    cell: ({ row, getValue }) => getValue() || (row.original.courtCategoryCode?.code ? courtCodeMap[row.original.courtCategoryCode.code] : "-")
  },
  { accessorKey: "caseNo", header: "사건번호", size: 130 },
  {
    id: "caseType.codeName",
    accessorFn: (row) => row.caseType?.codeName,
    header: "사건종류",
    size: 100,
    cell: ({ row, getValue }) => getValue() || (row.original.caseType?.code ? caseTypeCodeMap[row.original.caseType.code] : "-"),
  },
  {
    id: "agentCategoryCode.codeName",
    accessorFn: (row) => row.agentCategoryCode?.codeName,
    header: "대리인구분",
    size: 100,
    cell: ({ row, getValue }) => getValue() || (row.original.agentCategoryCode?.code ? agentCodeMap[row.original.agentCategoryCode.code] : "-")
  },
  { id: "client.userName", accessorFn: (row) => row.client?.userName, header: "의뢰인", size: 120 },
  { id: "status.codeName", accessorFn: (row) => row.status?.codeName, header: "현재상태", size: 100 },
  { accessorKey: "dueLimitDate", header: "사건마감일", size: 100, cell: ({getValue}) => formatDate(getValue()) },
  { accessorKey: "yourRef", header: "YourRef", size: 120 },
  { id: "foreignAgent.userName", accessorFn: (row) => row.foreignAgent?.userName, header: "해외대리인", size: 120 },
  { id: "petitioner.userName", accessorFn: (row) => row.petitioner?.userName, header: "청구인", size: 120 },
  { accessorKey: "respondent", header: "피청구인", size: 120 },
  { accessorKey: "judgmentDate", header: "판결결정일", size: 100, cell: ({getValue}) => formatDate(getValue()) },
  { accessorKey: "decisionContent", header: "판결내용", size: 200 },
  { accessorKey: "appealLimitDate", header: "불복마감일", size: 100, cell: ({getValue}) => formatDate(getValue()) },
  { accessorKey: "appealDate", header: "불복제기일", size: 100, cell: ({getValue}) => formatDate(getValue()) },
  { accessorKey: "abandonDate", header: "포기취하일", size: 100, cell: ({getValue}) => formatDate(getValue()) },
  { accessorKey: "abandonContent", header: "포기내용", size: 200 },
  { id: "adminMgr.userName", accessorFn: (row) => row.adminMgr?.userName, header: "관리담당자", size: 100 },
  { id: "caseMgr.userName", accessorFn: (row) => row.caseMgr?.userName, header: "사건담당자", size: 100 },
  { id: "attorney.userName", accessorFn: (row) => row.attorney?.userName, header: "담당변리사", size: 100 },
  { accessorKey: "note", header: "비고", size: 1000 },
  { id: "country.code", accessorFn: (row) => row.country?.code, header: "국가코드", size: 80 },
  { id: "country.codeName", accessorFn: (row) => row.country?.codeName, header: "출원국가", size: 100 },
  { id: "rightType.codeName", accessorFn: (row) => row.rightType?.codeName, header: "권리", size: 80 },
  { accessorKey: "appNo", header: "출원번호", size: 130 },
  { accessorKey: "appDate", header: "출원일", size: 100, cell: ({getValue}) => formatDate(getValue()) },
  { accessorKey: "regNo", header: "등록번호", size: 130 },
  { accessorKey: "regDate", header: "등록일", size: 100, cell: ({getValue}) => formatDate(getValue()) },
  { accessorKey: "claimDate", header: "청구일", size: 100, cell: ({getValue}) => formatDate(getValue()) },
  {
    accessorKey: "titleKo",
    header: "국문명칭",
    size: 1000,
    cell: ({getValue}) => <div className="truncate" title={getValue()}>{getValue() || "-"}</div>
  },
];
