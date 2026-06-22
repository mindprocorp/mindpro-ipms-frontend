import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";


export const overseasListColumnsData: ColumnDef<any>[] = [
  selectColumn<any>(),

  /* --- 형님이 나열하신 순서와 라벨 매칭 --- */
  { id: "appRoute.codeName", accessorFn: (row) => row.appRoute?.codeName, header: "구분", size: 100 },
  { accessorKey: "receiptDate", header: "접수일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { id: "rightType.codeName", accessorFn: (row) => row.rightType?.codeName, header: "권리", size: 80 },
  { id: "countryCode.codeName", accessorFn: (row) => row.countryCode?.codeName, header: "국가코드", size: 80 },
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 150,
    cell: ({ row }) => {
      const { appSeq, ourRef, appRoute } = row.original;
      const routeMap: Record<string, string> = {
        "20": "direct",
        "30": "pct",
        "40": "ep",
        "50": "madrid",
        "60": "national",
      };
      const categoryGubun = routeMap[appRoute?.code];
      const to = categoryGubun ? `/overseas/${categoryGubun}/detail/${appSeq}?rightType=${row.original.rightType?.code}` : "#";
      return (
        <Link
          to={to}
          className="text-blue-600 hover:underline font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {ourRef || "-"}
        </Link>
      );
    }
  },
  { accessorKey: "caseDeadline", header: "사건마감일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { id: "status.codeName", accessorFn: (row) => row.status?.codeName, header: "현재상태", size: 100 },
  { id: "clientNm", accessorFn: (row) => row.clientNm, header: "의뢰인", size: 120 },
  { id: "applicantNm", accessorFn: (row) => row.applicantNm, header: "출원인", size: 120 },
  { accessorKey: "appDate", header: "출원일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "appNo", header: "출원번호", size: 130 },
  { accessorKey: "regDate", header: "등록일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "regNo", header: "등록번호", size: 130 },
  { id: "foreignAgentNm", accessorFn: (row) => row.foreignAgentNm, header: "해외대리인", size: 120 },
  { accessorKey: "note", header: "비고", size: 200 },
  { accessorKey: "yourRef", header: "YourRef", size: 130 },
  { accessorKey: "clientRef", header: "출원인관리번호", size: 140 },
  { accessorKey: "kipoRefNo", header: "특허청참조번호", size: 130 },
  { accessorKey: "wipoRefNo", header: "WIPO참조번호", size: 130 },
  { accessorKey: "titleKo", header: "국문명칭", size: 200 },
  { accessorKey: "titleEn", header: "영문명칭", size: 200 },
  { accessorKey: "goodsClass", header: "류(class)", size: 80 },
  { id: "inventorInfo.userName", accessorFn: (row) => row.inventorInfo?.userName, header: "발명자", size: 120 },
  { id: "regMgrNm", accessorFn: (row) => row.regMgrNm, header: "등록권리자", size: 120 },
  { id: "adminMgrInfo.userName", accessorFn: (row) => row.adminMgrInfo?.userName, header: "관리담당자", size: 100 },
  { id: "caseMgrInfo.userName", accessorFn: (row) => row.caseMgrInfo?.userName, header: "사건담당자", size: 100 },
  { id: "attorneyInfo.userName", accessorFn: (row) => row.attorneyInfo?.userName, header: "담당변리사", size: 100 },
  { accessorKey: "appDeadline", header: "출원마감일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "standardDeadline", header: "연차마감일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "renewalDeadline", header: "갱신마감일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "npe20Deadline", header: "20개월마감일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "npe30Deadline", header: "30개월마감일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "annuityOrderDate", header: "위임일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "abandonDate", header: "포기취하일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "abandonNote", header: "포기내용", size: 200 },
  { accessorKey: "regDecisionDate", header: "등록결정일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "pubDate", header: "출원공개일자", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "pubNo", header: "출원공개번호", size: 130 },
  { accessorKey: "announcementDate", header: "출원공고일자", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "announcementNo", header: "출원공고번호", size: 130 },
];
