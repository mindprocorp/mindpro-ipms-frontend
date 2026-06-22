import type { ColumnDef } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";

export type ColType = {
  appSeq: string;
  productGroupId: string;
  productClass: string;
  productCount: number;
  productSummaryKo: string;
  productSummaryEn: string;
};

/**
 * 우선권 테이블 컬럼
 */
export const getProductColumns = (editMode: Boolean): ColumnDef<ColType>[] => [
  selectColumn<ColType>(36),

  {
    accessorKey: "productClass",
    header: "Class",
    size: 80,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.productClass = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "productCount",
    header: "상품수",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="number"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.productCount = Number(e.target.value);
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "productSummaryKo",
    header: "지정상품(국문) - 리스트에선 500자만 표시",
    size: 430,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.productSummaryKo = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize whitespace-pre-wrap break-words">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "productSummaryEn",
    header: "지정상품(영문) - 리스트에선 500자만 표시",
    size: 430,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.productSummaryEn = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize whitespace-pre-wrap break-words">{getValue() as string}</div>;
    },
  },
];
