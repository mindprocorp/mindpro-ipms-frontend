import type { CountryData } from "../CountryModal";
import type { ColumnDef } from "@tanstack/react-table";
import { selectColumn } from "@shared/util/selectColumn";

export const columnsData: ColumnDef<CountryData, any>[] = [
  selectColumn<CountryData>(36),

  {
    accessorKey: "countryCode",
    header: "국가코드",
    size: 100,
    cell: ({ row }) => <div>{row.getValue("countryCode")}</div>,
  },
  {
    accessorKey: "countryNameKo",
    header: "한글명",
    size: 160,
    cell: ({ row }) => <div>{row.getValue("countryNameKo")}</div>,
  },
  {
    accessorKey: "countryNameEn",
    header: "영문명",
    size: 10000,
    cell: ({ row }) => <div>{row.getValue("countryNameEn")}</div>,
  },
];
