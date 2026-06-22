import type { ColumnDef } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";

export type LocarColType = {
  appSeq: string;
  classNo: string;
  subClassNo: string;
  locarnoGroupId: string;
  goodsSummaryKo: string;
  goodsSummaryEn: string;
  goodsCount: string;
};

/**
 * 로카르노 테이블 컬럼
 */
export const getLocarColumns = (editMode: Boolean): ColumnDef<LocarColType>[] => [
  selectColumn<LocarColType>(36),

  {
    accessorKey: "classNo",
    header: "물품류",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.classNo = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "subClassNo",
    header: "물품군",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.subClassNo = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize">{getValue() as string}</div>;
    },
  },

  {
    accessorKey: "goodsSummaryKo",
    header: "물품의명칭(국문)",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.goodsSummaryKo = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize whitespace-pre-wrap break-words">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "goodsSummaryEn",
    header: "물품의명칭(영문)",
    size: 130,
    cell: ({ row, getValue }) => {
      if (editMode) {
        return (
          <input
            type="text"
            defaultValue={getValue() as string}
            onChange={(e) => {
              row.original.goodsSummaryEn = e.target.value;
            }}
            className="w-full rounded border border-black px-2 py-1"
          />
        );
      }
      return <div className="capitalize whitespace-pre-wrap break-words">{getValue() as string}</div>;
    },
  },


];
