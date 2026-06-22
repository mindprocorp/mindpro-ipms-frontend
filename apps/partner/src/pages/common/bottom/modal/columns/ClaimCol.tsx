import type { ColumnDef } from "@tanstack/react-table";
import type { ClaimItemListResponseType } from "@shared/api/common/commBottomApi.ts";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export type ClaimColType = ClaimItemListResponseType;

/**
 * 청구 테이블 컬럼
 */
export const getClaimColumns = (editMode: Boolean): ColumnDef<ClaimColType>[] => [
  selectColumn<ClaimColType>(28),

  {
    id: "costCategory.codeName",
    accessorFn: (row) => row.costCategory?.codeName,
    header: "청구분류",
    size: 130,
    cell: ({ getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "invDate",
    header: "청구일",
    size: 130,
    cell: ({ getValue }) => <div>{formatDate(getValue())}</div>,
  },
  {
    accessorKey: "invNo",
    header: "청구번호",
    size: 130,
    cell: ({ getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
  {
    accessorKey: "itemContent",
    header: "청구내용",
    size: 130,
    cell: ({ getValue }) => <div className="capitalize">{getValue() as string}</div>,
    meta: { pin: "left" },
  },
  {
    accessorKey: "govFee",
    header: "관납료",
    size: 130,
    cell: ({ getValue }) => <div className="text-right">{Number(getValue() || 0).toLocaleString()}</div>,
  },
  {
    accessorKey: "agencyFee",
    header: "수수료",
    size: 130,
    cell: ({ getValue }) => <div className="text-right">{Number(getValue() || 0).toLocaleString()}</div>,
  },
  {
    accessorKey: "vat",
    header: "부가세",
    size: 130,
    cell: ({ getValue }) => <div className="text-right">{Number(getValue() || 0).toLocaleString()}</div>,
  },
  {
    accessorKey: "transFee",
    header: "번역료",
    size: 130,
    cell: ({ getValue }) => <div className="text-right">{Number(getValue() || 0).toLocaleString()}</div>,
  },
  {
    accessorKey: "etcFee",
    header: "기타비용",
    size: 130,
    cell: ({ getValue }) => <div className="text-right">{Number(getValue() || 0).toLocaleString()}</div>,
  },
  {
    accessorKey: "totalAmount",
    header: "청구금액",
    size: 130,
    cell: ({ getValue }) => <div className="text-right font-bold">{Number(getValue() || 0).toLocaleString()}</div>,
  },
  {
    accessorKey: "depAmount",
    header: "입금액",
    size: 130,
    cell: ({ getValue }) => <div className="text-right">{Number(getValue() || 0).toLocaleString()}</div>,
  },
  {
    accessorKey: "unpaidAmount",
    header: "미수금",
    size: 130,
    cell: ({ getValue }) => <div className="text-right text-red-500">{Number(getValue() || 0).toLocaleString()}</div>,
  },
  {
    accessorKey: "abandonAmount",
    header: "포기금액",
    size: 130,
    cell: ({ getValue }) => <div className="text-right">{Number(getValue() || 0).toLocaleString()}</div>,
  },
  {
    accessorKey: "taxBillDate",
    header: "계산서발행일",
    size: 130,
    cell: ({ getValue }) => <div>{formatDate(getValue())}</div>,
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 130,
    cell: ({ getValue }) => <div className="capitalize">{getValue() as string}</div>,
  },
];
