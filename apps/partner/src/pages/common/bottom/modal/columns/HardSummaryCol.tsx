import type { ColumnDef } from "@tanstack/react-table";

export type HardSummaryColType = {
  claimSummaryInfo: {
    summary: string;
    claimScope: string;
  };
};

/**
 * 마감경과 테이블 컬럼
 */
export const getHardSummaryColumns = (editMode: Boolean): ColumnDef<HardSummaryColType>[] => [
  {
    id: "claimSummaryInfo.summary",
    accessorFn: (row) => row.claimSummaryInfo?.summary,
    header: "요약",
    size: 200,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as number}
            onChange={(e) => {
              row.original.claimSummaryInfo.summary = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as number}</div>;
    },
  },
  {
    id: "claimSummaryInfo.claimScope",
    accessorFn: (row) => row.claimSummaryInfo?.claimScope,
    header: "청구범위",
    size: 200,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as number}
            onChange={(e) => {
              row.original.claimSummaryInfo.claimScope = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as number}</div>;
    },
  },
  {
    accessorKey: "discountRatio",
    header: "대표도",
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
