import { Input } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { CodeMasterItem, CodeDetail } from "@shared/api/common/commApi";
import SelectBox from "../../../_components/common/SelectBox";
import { selectColumn } from "@shared/util/selectColumn";

export const masterColumnsData: ColumnDef<CodeMasterItem>[] = [
  { accessorKey: "grpCd", header: "분류코드", size: 140 },
  { accessorKey: "cdNm", header: "코드명", size: 180 },
  {
    accessorKey: "useYn",
    header: "사용",
    size: 60,
    cell: ({ getValue }) => (
      <div className="text-center">{(getValue() as string) ?? "Y"}</div>
    ),
  },
];

export const getDetailColumnsData = (
  onCellChange: (rowId: string, field: keyof CodeDetail, value: string) => void,
): ColumnDef<CodeDetail>[] => [
  selectColumn<CodeDetail>(36),

  {
    accessorKey: "dtlCd",
    header: "상세코드",
    size: 100,
    cell: ({ row }) => (
      <Input
        value={row.original.dtlCd}
        onChange={(e) => onCellChange(row.id, "dtlCd", e.target.value)}
      />
    ),
  },
  {
    accessorKey: "cdNm",
    header: "코드명",
    size: 150,
    cell: ({ row }) => (
      <Input
        value={row.original.cdNm}
        onChange={(e) => onCellChange(row.id, "cdNm", e.target.value)}
      />
    ),
  },
  {
    accessorKey: "kipoCd",
    header: "KIPO코드",
    size: 100,
    cell: ({ row }) => (
      <Input
        value={row.original.kipoCd}
        onChange={(e) => onCellChange(row.id, "kipoCd", e.target.value)}
      />
    ),
  },
  {
    accessorKey: "refVal1",
    header: "참조값1",
    size: 100,
    cell: ({ row }) => (
      <Input
        value={row.original.refVal1 || ""}
        onChange={(e) => onCellChange(row.id, "refVal1", e.target.value)}
      />
    ),
  },
  {
    accessorKey: "refVal2",
    header: "참조값2",
    size: 100,
    cell: ({ row }) => (
      <Input
        value={row.original.refVal2 || ""}
        onChange={(e) => onCellChange(row.id, "refVal2", e.target.value)}
      />
    ),
  },
  {
    accessorKey: "dispOrd",
    header: "정렬순서",
    size: 80,
    cell: ({ row }) => (
      <Input
        type="number"
        value={row.original.dispOrd}
        onChange={(e) => onCellChange(row.id, "dispOrd", e.target.value)}
      />
    ),
  },
  {
    accessorKey: "useYn",
    header: "사용여부",
    size: 80,
    cell: ({ row }) => (
      <SelectBox
        value={row.original.useYn}
        onChange={(v) => onCellChange(row.id, "useYn", v)}
        options={[
          { label: "Y", value: "Y" },
          { label: "N", value: "N" },
        ]}
        className="h-7 w-full text-xs"
      />
    ),
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 150,
    cell: ({ row }) => (
      <Input
        value={row.original.note || ""}
        onChange={(e) => onCellChange(row.id, "note", e.target.value)}
      />
    ),
  },
];
