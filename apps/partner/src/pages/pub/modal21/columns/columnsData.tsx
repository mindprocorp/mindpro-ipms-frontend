import type { ColumnDef } from "@tanstack/react-table";
import type { NiceProductResponse, ClassResponse } from "../api/niceProductApi";
import { selectColumn } from "@shared/util/selectColumn";

export const masterColumns: ColumnDef<NiceProductResponse, any>[] = [
  {
    accessorKey: "classNo",
    header: "Class",
    size: 50,
    cell: (info) => {
      return <div className="capitalize">{info.getValue()}</div>;
    },
    meta: {
      selectOnClick: true,
    },
  },

  {
    accessorKey: "classNmKo",
    header: "분류",
    size: 1000,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
      selectOnClick: true,
    },
  },
];

export const classColumns: ColumnDef<ClassResponse, any>[] = [
  selectColumn<NiceProductResponse>(36),

  {
    accessorKey: "idx",
    header: "No.",
    size: 70,
    cell: (info) => <div className="capitalize">{info.cell.row.index + 1}</div>,
  },
  {
    accessorKey: "productNmKo",
    header: "지정상품(국문)",
    size: 400,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
  {
    accessorKey: "productNmEn",
    header: "지정상품(영문)",
    size: 1000,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
];
