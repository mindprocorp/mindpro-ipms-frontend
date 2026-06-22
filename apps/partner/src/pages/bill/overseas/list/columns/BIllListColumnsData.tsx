import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

/**
 * 금액 포맷팅 유틸
 */
const formatAmount = (val: any) => {
  const num = Number(val || 0);
  return <div className="text-right">{num.toLocaleString()}</div>;
};


export const overseaBillColumnsData: ColumnDef<any>[] = [
//   selectColumn<any>(),

  /* --- [1] 기본 정보 매핑 수정 --- */
  { id: "caseCategory.codeName", accessorFn: (row) => row.caseCategory?.codeName, header: "사건구분", size: 80 },
  { id: "invCategory.codeName", accessorFn: (row) => row.invCategory?.codeName, header: "청구구분", size: 80 },
  { id: "invClass.codeName", accessorFn: (row) => row.invClass?.codeName, header: "청구분류", size: 80 },
  { id: "invType.codeName", accessorFn: (row) => row.invType?.codeName, header: "청구종류", size: 150 },
  { accessorKey: "invDate", header: "청구일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "invNo", header: "청구번호", size: 120 },
  { accessorKey: "invSendDate", header: "청구발송일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },

  /* --- [2] 거래처 및 담당자 (JSON 키에 맞게 수정) --- */
  { accessorKey: "foreignAgentName", header: "해외대리인", size: 120 },
  { id: "customer.customerName", accessorFn: (row) => row.customer?.customerName, header: "고객명", size: 150 },
  { id: "customerContact.userName", accessorFn: (row) => row.customerContact?.userName, header: "고객담당자", size: 100 },
  { id: "invMgr.userName", accessorFn: (row) => row.invMgr?.userName, header: "비용담당", size: 100 },
  { accessorKey: "invContent", header: "청구내용", size: 400, minSize: 300 },

  /* --- [3] 참조 및 관리번호 --- */
  { accessorKey: "ourRef", header: "OurRef", size: 130 },
  { accessorKey: "clientRef", header: "출원인관리번호", size: 130 },
  { accessorKey: "yourRef", header: "YourRef", size: 130 },
  { id: "rightType.codeName", accessorFn: (row) => row.rightType?.codeName, header: "권리", size: 80 },

  /* --- [4] 사건 정보 --- */
  { accessorKey: "appDate", header: "출원일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "appNo", header: "출원번호", size: 130 },
  { accessorKey: "regDate", header: "등록일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "regNo", header: "등록번호", size: 130 },
  { accessorKey: "oaDocument", header: "OA대상서류", size: 150 },
  { accessorKey: "applicantName", header: "출원인", size: 120 },
  { accessorKey: "titleKo", header: "출원명칭(국문)", size: 200 },
  { accessorKey: "niceClass", header: "류(Class)", size: 80 },

  /* --- [5] 내부 담당자 --- */
  { id: "adminMgr.userName", accessorFn: (row) => row.adminMgr?.userName, header: "관리담당자", size: 100 },
  { id: "caseMgr.userName", accessorFn: (row) => row.caseMgr?.userName, header: "사건담당자", size: 100 },
  { id: "attorney.userName", accessorFn: (row) => row.attorney?.userName, header: "담당변리사", size: 100 },

  /* --- [6] 화폐 및 환율 (JSON: currencyUnit.codeName) --- */
  { id: "currencyUnit.codeName", accessorFn: (row) => row.currencyUnit?.codeName, header: "화폐단위", size: 100 },
  { accessorKey: "exchangeRateDate", header: "환율적용일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "exchangeRate", header: "청구환율", size: 100, cell: ({ getValue }) => <div className="text-right">{Number(getValue() || 0).toFixed(2)}</div> },

  /* --- [7] 비용 정보 (가장 중요한 수치 데이터) --- */
  { accessorKey: "govFee", header: "관납료", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "agencyFee", header: "수수료", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "vat", header: "부가세", size: 100, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "transFee", header: "송금수수료", size: 100, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "etcFee", header: "기타비용", size: 100, cell: ({ getValue }) => formatAmount(getValue()) },
  {
    accessorKey: "totalInvAmount",
    header: "청구금액계",
    size: 120,
    cell: ({ getValue }) => <div className="text-right font-bold text-blue-600">{Number(getValue() || 0).toLocaleString()}</div>
  },
  { accessorKey: "depAmount", header: "입금액", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  {
    accessorKey: "unpaidAmount",
    header: "미수금",
    size: 110,
    cell: ({ getValue }) => <div className="text-right font-bold text-red-500">{Number(getValue() || 0).toLocaleString()}</div>
  },

  /* --- [8] 외주 및 실적 --- */
  { accessorKey: "outsourceDate", header: "외주송금일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "outsourceCost", header: "외주비용", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "perfDate", header: "실적인정일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "perfAmount", header: "실적금액", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },

  /* --- [9] 기타 및 비고 --- */
  { accessorKey: "abandonDate", header: "포기일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "abandonContent", header: "포기내용", size: 150 },
  { accessorKey: "abandonAmount", header: "포기금액", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "note", header: "비고", size: 200 },
  { accessorKey: "depositDate", header: "입금일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
];
