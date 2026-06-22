import { Button, Icons } from "@repo/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { FormTemplateVO } from "@shared/api/organization/formTemplateApi";
import { YN_OPTIONS } from "@shared/enum/organizationType";
import SelectBox from "../../../_components/common/SelectBox";

export const getColumnsData = (
  total: number,
  onEdit: (seq: string) => void,
  onDelete: (item: FormTemplateVO) => void,
  onCellSave: (item: FormTemplateVO, updates: Partial<FormTemplateVO>) => void,
  onPreview: (seq: string) => void,
): ColumnDef<FormTemplateVO>[] => [
  { id: "no", header: "번호", size: 60, cell: ({ row }) => total - row.index },
  { accessorKey: "templateName", header: "서식명" },
  {
    accessorKey: "useYn",
    header: "사용여부",
    size: 120,
    cell: ({ row }) => (
      <SelectBox
        value={row.original.useYn || "Y"}
        onChange={(v) => onCellSave(row.original, { useYn: v })}
        options={YN_OPTIONS}
        className="h-7 w-full text-xs"
      />
    ),
  },
  {
    accessorKey: "docModifyYn",
    header: "진행문서수정",
    size: 120,
    cell: ({ row }) => (
      <SelectBox
        value={row.original.docModifyYn || "N"}
        onChange={(v) => onCellSave(row.original, { docModifyYn: v })}
        options={YN_OPTIONS}
        className="h-7 w-full text-xs"
      />
    ),
  },
  {
    id: "preview",
    header: "미리보기",
    size: 60,
    cell: ({ row }) => (
      <Button size="icon-xs" variant="ghost" onClick={() => onPreview(row.original.formTemplateSeq!)}>
        <Icons.Eye className="size-4" />
      </Button>
    ),
  },
  {
    id: "edit",
    header: "수정",
    size: 60,
    cell: ({ row }) => (
      <Button size="icon-xs" variant="ghost" onClick={() => onEdit(row.original.formTemplateSeq!)}>
        <Icons.Pencil className="size-4" />
      </Button>
    ),
  },
  {
    id: "delete",
    header: "삭제",
    size: 60,
    cell: ({ row }) => (
      <Button size="icon-xs" variant="ghost-red" onClick={() => onDelete(row.original)}>
        <Icons.Trash2 className="size-4" />
      </Button>
    ),
  },
];
