import type { ColumnDef } from "@tanstack/react-table";
import type { NiceProductResponse, ClassResponse } from "../api/niceProductApi";
import { selectColumn } from "@shared/util/selectColumn";

export const masterColumns: ColumnDef<NiceProductResponse, any>[] = [
  {
    accessorKey: "classNo",
    header: "Class",
    size: 50,
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
  },

  {
    accessorKey: "classNmKo",
    header: "분류",
    size: 1000,
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

export const classColumns: ColumnDef<ClassResponse, any>[] = [
  selectColumn<NiceProductResponse>(36),

  {
    accessorKey: "idx",
    header: "No.",
    size: 50,
    cell: (info) => <div className="capitalize">{info.cell.row.index + 1}</div>,
  },
  {
    accessorKey: "productNmKo",
    header: "지정상품(국문)",
    size: 10000,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
  {
    accessorKey: "productNmEn",
    header: "지정상품(영문)",
    size: 10000,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
];

/** 지정상품 목록: 행 선택만 허용, 헤더 전체선택 체크박스 없음 */
export const classColumnsGoodsNoHeaderSelectAll: ColumnDef<ClassResponse, any>[] = [
  selectColumn<ClassResponse>(36, { hideHeaderSelectAll: true }),

  {
    accessorKey: "idx",
    header: "No.",
    size: 50,
    cell: (info) => <div className="capitalize">{info.cell.row.index + 1}</div>,
  },
  {
    accessorKey: "productNmKo",
    header: "지정상품(국문)",
    size: 10000,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
  {
    accessorKey: "productNmEn",
    header: "지정상품(영문)",
    size: 10000,
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
];
