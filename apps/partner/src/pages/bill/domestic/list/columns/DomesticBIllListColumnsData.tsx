import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export type DomesticListColType = {
  customerSeq: string;
  bizInfoSeq: string;
  invoiceSeq: string;
  appSeq: string;
  [key: string]: any; // 동적 필드 허용
};

export const domesticBIllListColumnsData: ColumnDef<DomesticListColType, any>[] = [
//   selectColumn<DomesticListColType>(),

  { id: "caseCategory.codeName", accessorFn: (row) => row.caseCategory?.codeName, header: "사건구분", size: 100 },
  { id: "invCategory.codeName", accessorFn: (row) => row.invCategory?.codeName, header: "청구구분", size: 100 },
  { id: "invClass.codeName", accessorFn: (row) => row.invClass?.codeName, header: "청구분류", size: 100 },
  { id: "invType.codeName", accessorFn: (row) => row.invType?.codeName, header: "청구종류", size: 150 },
  { accessorKey: "createAt", header: "등록일", size: 100, cell: (info) => formatDate(info.getValue()) },
  { accessorKey: "invDate", header: "청구일", size: 100, cell: (info) => formatDate(info.getValue()) },
  { accessorKey: "invNo", header: "청구번호", size: 150 },
  { id: "customer.customerName", accessorFn: (row) => row.customer?.customerName, header: "고객명", size: 150 },
  { accessorKey: "invContent", header: "청구내용", size: 400, minSize: 300 },
  {
    accessorKey: "totalInvAmount",
    header: "청구금액",
    size: 130,
    cell: (info) => <div className="text-right font-bold text-p-color-1">{Number(info.getValue() || 0).toLocaleString()}</div>
  },
  { accessorKey: "depAmount", header: "입금액", size: 120, cell: (info) => Number(info.getValue() || 0).toLocaleString() },
  {
    accessorKey: "unpaidAmount",
    header: "미수금",
    size: 130,
    cell: (info) => <div className="text-right font-bold text-red-500">{Number(info.getValue() || 0).toLocaleString()}</div>
  },
  { accessorKey: "govFee", header: "관납료", size: 120, cell: (info) => Number(info.getValue() || 0).toLocaleString() },
  { accessorKey: "agencyFee", header: "수수료", size: 120, cell: (info) => Number(info.getValue() || 0).toLocaleString() },
  { accessorKey: "vat", header: "부가세", size: 120, cell: (info) => Number(info.getValue() || 0).toLocaleString() },
  { accessorKey: "etcFee", header: "기타비용", size: 120, cell: (info) => Number(info.getValue() || 0).toLocaleString() },
  { id: "invMgr.userName", accessorFn: (row) => row.invMgr?.userName, header: "비용담당", size: 100 },
  { accessorKey: "abandonDate", header: "포기일", size: 100, cell: (info) => formatDate(info.getValue()) },
  { accessorKey: "abandonAmount", header: "포기금액", size: 120, cell: (info) => Number(info.getValue() || 0).toLocaleString() },
  { accessorKey: "govFeePayDate", header: "관납료납부일", size: 100, cell: (info) => formatDate(info.getValue()) },
  { accessorKey: "govFeePayAmount", header: "관납료납부액", size: 120, cell: (info) => Number(info.getValue() || 0).toLocaleString() },
  { accessorKey: "outsourceDate", header: "외주송금일", size: 120, cell: (info) => formatDate(info.getValue()) },
  // { accessorKey: "perfInfo", header: "실적정보", size: 150 },
  { accessorKey: "taxBillDate", header: "계산서발행일", size: 120, cell: (info) => formatDate(info.getValue()) },
  { accessorKey: "taxBillNo", header: "발행번호", size: 150 },
  { id: "taxBillType.codeName", accessorFn: (row) => row.taxBillType?.codeName, header: "발행구분", size: 150 },
  { accessorKey: "note", header: "비고", size: 1000 },
  { id: "rightType.codeName", accessorFn: (row) => row.rightType?.codeName, header: "권리", size: 100 },
  { accessorKey: "ourRef", header: "OurRef", size: 130 },
  { accessorKey: "clientRef", header: "출원인관리번호", size: 130 },
  { accessorKey: "appDate", header: "출원일", size: 100, cell: (info) => formatDate(info.getValue()) },
  { accessorKey: "appNo", header: "출원번호", size: 150 },
  { accessorKey: "regDate", header: "출원등록일", size: 100, cell: (info) => formatDate(info.getValue()) },
  { accessorKey: "regNo", header: "등록번호", size: 150 },
  { accessorKey: "titleKo", header: "국문명칭", size: 1000 },
  { accessorKey: "clientName", header: "의뢰인", size: 120 },
  { accessorKey: "applicantName", header: "출원인", size: 120 },
  { id: "adminMgr.userName", accessorFn: (row) => row.adminMgr?.userName, header: "관리담당자", size: 100 },
  { id: "caseMgr.userName", accessorFn: (row) => row.caseMgr?.userName, header: "사건담당자", size: 100 },
  { accessorKey: "depositDate", header: "입금일", size: 100, cell: (info) => formatDate(info.getValue()) },
];
