import type { Table, Row } from "@tanstack/react-table";
import { Button, Icons } from "@repo/ui";
import { selectColumn } from "@shared/util/selectColumn";

export const columnsData = [
  {
    id: "drag",
    accessorKey: "drag",
    header: "",
    size: 30,
  },
  selectColumn<any>(36),
  {
    accessorKey: "id",
    header: "번호",
    size: 50,
    cell: ({ row }: { row: Row<unknown> }) => <div className="text-center">{row.index + 1}</div>,
  },
  {
    accessorKey: "detail",
    header: "상세",
    size: 40,
    cell: ({ row }: { row: Row<unknown> }) => (
      <div className="text-center">
        <Button size="h24" variant="ghost">
          <Icons.Search />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "nameKo",
    header: "등록권리자(한글)",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("nameKo")}</div>,
  },
  {
    accessorKey: "nameEn",
    header: "등록권리자(영문)",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("nameEn")}</div>,
  },
  {
    accessorKey: "cusNum",
    header: "특허고객번호",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("cusNum")}</div>,
  },
  {
    accessorKey: "rate",
    header: "지분율",
    size: 70,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("rate")}</div>,
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 200,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("note")}</div>,
  },
  {
    accessorKey: "seq",
    header: "순서",
    size: 70,
    cell: ({ row }: { row: Row<unknown> }) => <div className="capitalize">{row.getValue("seq")}</div>,
    meta: { pin: "left" },
  },
];
