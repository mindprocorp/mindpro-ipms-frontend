import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatPrice, handlePriceChange, formatAppNo } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export type ColType = {
  remittanceCount: number | unknown; // 차수
  paymentDiv: string; // 납부구분코드
  requestDate: string; // 출원일/신청일
  appNo: string; // 출원번호
  krwAmount: number | unknown; // 납부금액
  costRemittanceDate: string; // 등록일/납부일
  note: string; // 비고
};

/**
 * 갱신관리 테이블 컬럼
 */
export const getRenewalColumns = (editMode: Boolean): ColumnDef<ColType>[] => [
  selectColumn<ColType>(28),

  {
    accessorKey: "remittanceCount",
    header: "차수",
    size: 80,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="number"
            defaultValue={getValue() as number}
            onChange={(e) => {
              row.original.remittanceCount = Number(e.target.value);
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as number}</div>;
    },
  },
  {
    accessorKey: "paymentDiv",
    header: "납부구분",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.paymentDiv = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "requestDate",
    header: "갱신출원일/신청일",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            maxLength={10}
            defaultValue={formatDate(getValue())}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9-]/g, "");
              row.original.requestDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "appNo",
    header: "갱신출원번호",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.appNo = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatAppNo(getValue())}</div>;
    },
  },

  {
    accessorKey: "costRemittanceDate",
    header: "갱신등록일/납부일",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            maxLength={10}
            defaultValue={formatDate(getValue())}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9-]/g, "");
              row.original.costRemittanceDate = val;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div>{formatDate(getValue())}</div>;
    },
  },
  {
    accessorKey: "krwAmount",
    header: "납부금액",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={formatPrice(getValue())}
            onChange={(e) => {
              const val = handlePriceChange(e);
              row.original.krwAmount = val;
            }}
            className="w-full rounded border border-black px-2 py-1 text-right"
          />
        );
      }
      return <div className="text-right">{formatPrice(getValue())}</div>;
    },
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.note = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
];
