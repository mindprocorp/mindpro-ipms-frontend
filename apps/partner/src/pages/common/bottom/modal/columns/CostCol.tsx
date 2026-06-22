import type { ColumnDef } from "@tanstack/react-table";
import { formatPrice, handlePriceChange } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

export type CostColType = {
  remittanceCount: number;
  costFee: number;
  discountRatio: number;
  note: string;
};

/**
 * 마감경과 테이블 컬럼
 */
export const getCostColumns = (editMode: Boolean): ColumnDef<CostColType>[] => [
  selectColumn<CostColType>(36),

  {
    accessorKey: "remittanceCount",
    header: "차수",
    size: 130,
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
    accessorKey: "costFee",
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
              row.original.costFee = Number(val.replace(/,/g, ""));
            }}
            className="w-full rounded border border-black px-2 py-1 text-right"
          />
        );
      }
      return <div className="text-right">{formatPrice(getValue())}</div>;
    },
  },
  {
    accessorKey: "discountRatio",
    header: "감면율",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="number"
            defaultValue={getValue() as number}
            onChange={(e) => {
              row.original.discountRatio = Number(e.target.value);
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() + "%"}</div>;
    },
  },
];
