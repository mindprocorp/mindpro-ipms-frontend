import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatPrice } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

/**
 * 금액 포맷팅 유틸
 */
const formatAmount = (val: any) => {
  return <div className="text-right">{val ? formatPrice(val) : "-"}</div>;
};


export const overseaBillColumnsData: ColumnDef<any>[] = [
//   selectColumn<any>(),

  /* --- [1] 청구 기본 정보 --- */
  { id: "caseCategory.codeName", accessorFn: (row) => row.caseCategory?.codeName, header: "사건구분", size: 80 },
  { id: "invCategory.codeName", accessorFn: (row) => row.invCategory?.codeName, header: "청구구분", size: 80 },
  { id: "invClass.codeName", accessorFn: (row) => row.invClass?.codeName, header: "청구분류", size: 80 },
  { id: "invType.codeName", accessorFn: (row) => row.invType?.codeName, header: "청구종류", size: 120 },
  { accessorKey: "invDate", header: "청구일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "invNo", header: "청구번호", size: 120 },
  { accessorKey: "invSendDate", header: "청구발송일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "agentInvDate", header: "대리인청구일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "debitReceiptDate", header: "DEBIT접수일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "debitNo", header: "DEBIT번호", size: 120 },

  /* --- [2] 고객 및 담당자 --- */
  { accessorKey: "foreignAgentName", header: "해외대리인", size: 120 },
  { id: "customer.customerName", accessorFn: (row) => row.customer?.customerName, header: "고객명", size: 150 },
  { id: "customerContact.userName", accessorFn: (row) => row.customerContact?.userName, header: "고객담당자", size: 100 },
  { id: "invMgr.userName", accessorFn: (row) => row.invMgr?.userName, header: "비용담당", size: 100 },
  { accessorKey: "invContent", header: "청구내용", size: 400, minSize: 300 },

  /* --- [3] 관리 번호 --- */
  { accessorKey: "ourRef", header: "OurRef", size: 130 },
  { accessorKey: "clientRef", header: "출원인관리번호", size: 130 },
  { accessorKey: "yourRef", header: "YourRef", size: 130 },
  { id: "rightType.codeName", accessorFn: (row) => row.rightType?.codeName, header: "권리", size: 80 },

  /* --- [4] 사건 상세 정보 --- */
  { accessorKey: "appDate", header: "출원일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "appNo", header: "출원번호", size: 130 },
  { accessorKey: "regDate", header: "등록일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "regNo", header: "등록번호", size: 130 },
  { accessorKey: "oaDocument", header: "OA대상서류", size: 150 },
  { accessorKey: "clientName", header: "의뢰인", size: 100 },
  { accessorKey: "applicantName", header: "출원인", size: 100 },
  { accessorKey: "titleKo", header: "출원명칭(국문)", size: 200 },
  { accessorKey: "niceClass", header: "류(Class)", size: 80 },

  /* --- [5] 내부 관리자 --- */
  { id: "adminMgr.userName", accessorFn: (row) => row.adminMgr?.userName, header: "관리담당자", size: 100 },
  { id: "caseMgr.userName", accessorFn: (row) => row.caseMgr?.userName, header: "사건담당자", size: 100 },
  { id: "attorney.userName", accessorFn: (row) => row.attorney?.userName, header: "담당변리사", size: 100 },

  /* --- [6] 화폐 및 환율 --- */
  { id: "currencyUnit.codeName", accessorFn: (row) => row.currencyUnit?.codeName, header: "화폐단위", size: 100 },
  { accessorKey: "exchangeRateDate", header: "환율적용일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  {
    accessorKey: "exchangeRate",
    header: "청구환율",
    size: 100,
    cell: ({ getValue }) => <div className="text-right font-mono">{Number(getValue() || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
  },

  /* --- [7] 비용 정보 (JSON 키 매핑) --- */
  { accessorKey: "govFee", header: "관납료", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "agencyFee", header: "수수료", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "vat", header: "부가세", size: 100, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "etcFee", header: "기타비용", size: 100, cell: ({ getValue }) => formatAmount(getValue()) },
  {
    accessorKey: "totalInvAmount",
    header: "청구금액계",
    size: 120,
    cell: ({ getValue }) => <div className="text-right font-bold text-blue-600">{formatPrice(getValue())}</div>
  },
  { accessorKey: "depAmount", header: "입금액", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  {
    accessorKey: "unpaidAmount",
    header: "미수금",
    size: 110,
    cell: ({ getValue }) => <div className="text-right font-bold text-red-500">{formatPrice(getValue())}</div>
  },

  /* --- [8] 세금계산서 및 외주 --- */
  { accessorKey: "taxBillDate", header: "계산서발행일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "taxBillNo", header: "계산서번호", size: 120 },
  { accessorKey: "outsourceDate", header: "외주송금일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "outsourceCost", header: "외주비용", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "outsourceVat", header: "외주부가세", size: 100, cell: ({ getValue }) => formatAmount(getValue()) },

  /* --- [9] 실적 및 포기 --- */
  { accessorKey: "perfDate", header: "실적인정일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "perfAmount", header: "실적금액", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "abandonDate", header: "포기일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
  { accessorKey: "abandonContent", header: "포기내용", size: 150 },
  { accessorKey: "abandonAmount", header: "포기금액", size: 110, cell: ({ getValue }) => formatAmount(getValue()) },
  { accessorKey: "note", header: "비고", size: 200 },
  { accessorKey: "depositDate", header: "입금일", size: 100, cell: ({ getValue }) => formatDate(getValue()) },
];
