import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

// 1. 해외 청구서 데이터 타입 정의 (제공해주신 항목 기반)
export type OverseaBillColType = {
  invoiceSeq: string;
  caseCategory: { codeName: string }; // 사건구분
  invCategory: { codeName: string };  // 청구구분
  invClass: { codeName: string };     // 청구분류
  invType: { codeName: string };      // 청구종류
  invDate: string;                    // 청구일
  invNo: string;                      // 청구번호
  invSendDate: string;                // 청구서 발송일
  clientName: string;                 // 해외대리인
  customer: { customerName: string }; // 고객명
  customerContact: { userName: string }; // 고객담당자
  invMgr: { userName: string };       // 비용담당
  ourRef: string;                     // OurRef
  yourRef: string;                    // YourRef
  rightType: { codeName: string };    // 권리
  appDate: string;                    // 출원일
  appNo: string;                      // 출원번호
  regDate: string;                    // 등록일
  regNo: string;                      // 등록번호
  totalInvAmount: string | number;    // 청구금액
  unpaidAmount: string | number;      // 미수금
  currencyUnit: { code: string };     // 화폐단위
  note: string;                       // 비고
  // ... 필요에 따라 추가
};

export const overseaBillColumnsData: ColumnDef<OverseaBillColType, any>[] = [
  selectColumn<OverseaBillColType>(),

  {
    accessorKey: "invNo",
    header: "청구번호",
    size: 120,
  },
  {
    accessorKey: "invDate",
    header: "청구일",
    size: 100,
    cell: ({ getValue }) => <div>{formatDate(getValue())}</div>,
  },
  {
    id: "customer.customerName",
    accessorFn: (row) => row.customer?.customerName,
    header: "고객명",
    size: 150,
  },
  {
    accessorKey: "ourRef",
    header: "Our Ref",
    size: 130,
  },
  {
    id: "rightType.codeName",
    accessorFn: (row) => row.rightType?.codeName,
    header: "권리",
    size: 80,
  },
  {
    accessorKey: "appNo",
    header: "출원번호",
    size: 130,
  },
  {
    id: "invCategory.codeName",
    accessorFn: (row) => row.invCategory?.codeName,
    header: "청구구분",
    size: 90,
  },
  {
    accessorKey: "totalInvAmount",
    header: "청구금액",
    size: 110,
    cell: ({ row }) => (
      <div className="text-right font-bold">
        {Number(row.getValue("totalInvAmount")).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "unpaidAmount",
    header: "미수금",
    size: 110,
    cell: ({ row }) => (
      <div className="text-right text-red-500 font-bold">
        {Number(row.getValue("unpaidAmount")).toLocaleString()}
      </div>
    ),
  },
  {
    id: "invMgr.userName",
    accessorFn: (row) => row.invMgr?.userName,
    header: "비용담당",
    size: 100,
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 200,
    cell: ({ row }) => <div className="truncate w-[180px]">{row.getValue("note")}</div>,
  },
];
