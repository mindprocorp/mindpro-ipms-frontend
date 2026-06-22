import type { ColumnDef } from "@tanstack/react-table";
import type { LocarnoResponse } from "../api/locarnoApi";
import { selectColumn } from "@shared/util/selectColumn";

export const columnsResult: ColumnDef<LocarnoResponse, any>[] = [
  selectColumn<LocarnoResponse>(36),

  {
    accessorKey: "index",
    header: "No.",
    size: 80,
    cell: (info) => <div className="capitalize">{info.row.index + 1}</div>,
  },
  {
    accessorKey: "classNo",
    header: "물품류",
    size: 80,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "subclassNo",
    header: "물품군",
    size: 80,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "goodsNmKo",
    header: "물품의 범위(국문)",
    size: 10000,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
  {
    accessorKey: "goodsNmEn",
    header: "물품의 범위(영문)",
    size: 10000,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
];

export const subClassColumns: ColumnDef<LocarnoResponse, any>[] = [
  {
    accessorKey: "subclassNmKo",
    header: "물품의 명칭(국문)",
    size: 10000,
    cell: (info) => (
      <div
        className="capitalize"
        onClick={(value) => {
          info.row.toggleSelected(!!value);
        }}
      >
        {info.getValue()}
      </div>
    ),
    meta: {
      cellAlign: "left",
    },
  },

  {
    accessorKey: "subclassNmEn",
    header: "물품의 명칭(영문)",
    size: 10000,
    cell: (info) => (
      <div
        className="capitalize"
        onClick={(value) => {
          info.row.toggleSelected(!!value);
        }}
      >
        {info.getValue()}
      </div>
    ),
    meta: {
      cellAlign: "left",
    },
  },
];

export const goodsColumns: ColumnDef<LocarnoResponse, any>[] = [
  selectColumn<LocarnoResponse>(36),
  {
    accessorKey: "goodsNmKo",
    header: "물품의 명칭(국문)",
    size: 10000,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },

  {
    accessorKey: "goodsNmEn",
    header: "물품의 명칭(영문)",
    size: 10000,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
];
